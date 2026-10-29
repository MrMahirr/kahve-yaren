import { clamp, smoothstep } from '@/lib/math'
import type { Point, Random } from './shapes'

const TAU = Math.PI * 2

/** Telve tonları: krema, fındık, kaymak, filiz. */
export const PARTICLE_COLORS = ['#E2C9A6', '#B08A68', '#F4EFE6', '#A9B57E'] as const
/** Renk dağılımı: çoğu krema, az sayıda zeytin yeşili. */
const COLOR_WEIGHTS = [0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3]

export type Particle = {
  /** Şekillerdeki hedef noktanın sırası. */
  i: number
  x: number
  y: number
  vx: number
  vy: number
  color: number
  size: number
  /** 0..1: geçişe ne kadar geç katılacağı (dalga etkisi). */
  delay: number
  phase: number
  speed: number
}

export function createParticles(count: number, random: Random = Math.random): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    i,
    x: random() * 800,
    y: random() * 600,
    vx: 0,
    vy: 0,
    color: COLOR_WEIGHTS[Math.floor(random() * COLOR_WEIGHTS.length)],
    size: random() < 0.1 ? 2.6 : 1.3 + random() * 0.9,
    delay: random(),
    phase: random() * TAU,
    speed: 0.6 + random() * 0.8,
  })).sort((a, b) => a.color - b.color) // aynı renkler art arda: fillStyle az değişir
}

export type Morph = {
  /** Kaynak şekil (0..3). */
  from: number
  /** Hedef şekil (0..3). */
  to: number
  /** Geçiş miktarı (0..1, yumuşatılmış). */
  amount: number
  /** O an ekranda baskın olan adım. */
  step: number
}

/**
 * Kaydırma ilerlemesini (0..1) dört şekil arasındaki geçişe çevirir.
 * Her adımın ilk %25'i ve son %20'si sabit bekler, aradaki kısımda biçim değişir.
 */
export function morphAt(progress: number, shapeCount = 4): Morph {
  const last = shapeCount - 1
  const s = clamp(progress) * last
  const from = Math.min(Math.floor(s), last)
  const to = Math.min(from + 1, last)
  const amount = smoothstep((s - from - 0.25) / 0.55)
  return { from, to, amount, step: amount < 0.5 ? from : to }
}

type RenderFrame = {
  width: number
  height: number
  /** Saniye cinsinden zaman (dalgalanma ve girdap dönüşü için). */
  time: number
  morph: Morph
  pointer: Point
  reduceMotion: boolean
}

const rotate = (p: Point, angle: number): Point =>
  angle === 0
    ? p
    : {
        x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
        y: p.x * Math.sin(angle) + p.y * Math.cos(angle),
      }

/**
 * Bir kare ilerletir ve çizer: her parçacık iki şekil arasındaki hedefine yay gibi çekilir,
 * imlece yaklaşınca itilir. Hareket azaltılmışsa doğrudan hedefe yerleşir.
 */
export function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  shapes: Point[][],
  { width, height, time, morph, pointer, reduceMotion }: RenderFrame,
) {
  const cx = width / 2
  const cy = height / 2
  const unit = Math.min(width, height) * 0.4
  // Girdap (şekil 1) yavaşça döner.
  const spinFrom = morph.from === 1 ? time * 0.25 : 0
  const spinTo = morph.to === 1 ? time * 0.25 : 0
  const radius = width < 760 ? 70 : 100
  let currentColor = -1

  for (const p of particles) {
    const t = clamp(morph.amount * 1.4 - p.delay * 0.4)
    const chaos = Math.sin(Math.PI * t) // geçişin ortasında dağılır, uçlarda toplanır
    const a = rotate(shapes[morph.from][p.i], spinFrom)
    const b = rotate(shapes[morph.to][p.i], spinTo)
    const wobble = reduceMotion ? 0 : 0.006 + chaos * 0.22
    const tx = cx + (a.x + (b.x - a.x) * t + Math.sin(time * p.speed + p.phase) * wobble) * unit
    const ty =
      cy + (a.y + (b.y - a.y) * t + Math.cos(time * p.speed * 1.2 + p.phase) * wobble) * unit

    if (reduceMotion) {
      p.x = tx
      p.y = ty
    } else {
      let fx = (tx - p.x) * 0.055
      let fy = (ty - p.y) * 0.055
      const dx = p.x - pointer.x
      const dy = p.y - pointer.y
      const d2 = dx * dx + dy * dy
      if (d2 < radius * radius && d2 > 0.01) {
        const d = Math.sqrt(d2)
        const push = (1 - d / radius) * 3.2
        fx += (dx / d) * push
        fy += (dy / d) * push
      }
      p.vx = (p.vx + fx) * 0.84
      p.vy = (p.vy + fy) * 0.84
      p.x += p.vx
      p.y += p.vy
    }

    if (p.color !== currentColor) {
      currentColor = p.color
      ctx.fillStyle = PARTICLE_COLORS[currentColor]
    }
    ctx.fillRect(p.x, p.y, p.size, p.size)
  }
}
