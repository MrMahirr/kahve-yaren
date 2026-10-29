import { useEffect, useRef, type RefObject } from 'react'
import { useAnimationLoop } from '@/hooks/useAnimationLoop'
import { fitCanvas, isOnScreen } from '@/lib/canvas'
import { createParticles, morphAt, renderParticles, type Particle } from './particleSystem'
import { beanShape, cupShape, textShape, textShapeFont, vortexShape, type Point } from './shapes'

const FONT_FAMILY = '"Bricolage Grotesque Variable"'
const BACKGROUND = '#2B1D16' // --color-telve
/** Yarı saydam silme: parçacıklar kısa bir iz bırakır. */
const TRAIL = 'rgba(43, 29, 22, 0.3)'
const OFFSCREEN = { x: -9999, y: -9999 }

type ParticlesOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  /** Kaydırma ilerlemesi bu öğeye göre ölçülür (sticky sahne + adımlar). */
  trackRef: RefObject<HTMLElement | null>
  reduceMotion: boolean
  /** Baskın adım değişince bir kez çağrılır. */
  onStep: (step: number) => void
}

export function useParticles({ canvasRef, trackRef, reduceMotion, onStep }: ParticlesOptions) {
  const system = useRef<{ particles: Particle[]; shapes: Point[][] } | null>(null)
  const pointer = useRef<Point>({ ...OFFSCREEN })
  const step = useRef(-1)
  const fresh = useRef(true)

  // Kurulum: parçacık sayısı mount anındaki genişliğe göre sabitlenir.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const count = window.innerWidth < 760 ? 1000 : 1700
    const text = () => textShape(count, { text: 'Yâren', font: textShapeFont(FONT_FAMILY) })
    const shapes = [beanShape(count), vortexShape(count), cupShape(count), text()]
    system.current = { particles: createParticles(count), shapes }

    // Yazı şekli, marka fontu yüklenince doğru harflerle yeniden üretilir.
    let active = true
    document.fonts
      ?.load(`700 240px ${FONT_FAMILY}`)
      .then(() => {
        if (active) shapes[3] = text()
      })
      .catch(() => {})

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const onLeave = () => {
      pointer.current = { ...OFFSCREEN }
    }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    return () => {
      active = false
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [canvasRef])

  useAnimationLoop((now) => {
    const canvas = canvasRef.current
    const track = trackRef.current
    if (!canvas || !track || !system.current) return
    const rect = canvas.getBoundingClientRect()
    if (!isOnScreen(rect)) return

    const { dpr, resized } = fitCanvas(canvas, rect)
    if (resized) fresh.current = true

    // Sahne sticky; ilerleme, sahnenin takip öğesi içinde ne kadar yol aldığıdır.
    const trackRect = track.getBoundingClientRect()
    const stickyTop = parseFloat(getComputedStyle(canvas.parentElement ?? canvas).top) || 0
    const distance = trackRect.height - rect.height
    const morph = morphAt(distance > 0 ? (stickyTop - trackRect.top) / distance : 0)
    if (morph.step !== step.current) {
      step.current = morph.step
      onStep(morph.step)
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = reduceMotion || fresh.current ? BACKGROUND : TRAIL
    ctx.fillRect(0, 0, rect.width, rect.height)
    fresh.current = false

    renderParticles(ctx, system.current.particles, system.current.shapes, {
      width: rect.width,
      height: rect.height,
      time: now * 0.001,
      morph,
      pointer: pointer.current,
      reduceMotion,
    })
  })
}
