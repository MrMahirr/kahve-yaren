/**
 * Telve parçacıklarının girdiği dört biçim: çekirdek → girdap → fincan → "Yâren".
 * Her şekil -1..1 aralığında (birim kare) bir nokta listesidir; parçacık i, her şekilde
 * i. noktaya gider. `random` testlerde tekrarlanabilir sonuç için verilebilir.
 */
export type Point = { x: number; y: number }
export type Random = () => number

const TAU = Math.PI * 2

/** Eğik kahve çekirdeği: elips + ortadan geçen dalgalı oyuk. */
export function beanShape(count: number, random: Random = Math.random): Point[] {
  const tilt = -0.5
  const [cos, sin] = [Math.cos(tilt), Math.sin(tilt)]

  return Array.from({ length: count }, () => {
    let x = 0
    let y = 0
    if (random() < 0.16) {
      // Kenar çizgisi belirgin olsun
      const angle = random() * TAU
      x = Math.cos(angle) * 0.6
      y = Math.sin(angle) * 0.9
    } else {
      for (let attempt = 0; attempt < 60; attempt += 1) {
        x = (random() * 2 - 1) * 0.6
        y = (random() * 2 - 1) * 0.9
        const inside = (x / 0.6) ** 2 + (y / 0.9) ** 2 <= 1
        const outsideGroove = Math.abs(x - 0.13 * Math.sin(y * 3.4)) > 0.075
        if (inside && outsideGroove) break
      }
    }
    return { x: x * cos - y * sin, y: x * sin + y * cos }
  })
}

/** Öğütme girdabı: üç kollu spiral. */
export function vortexShape(count: number, random: Random = Math.random): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const radius = random() ** 0.65 * 1.08
    const theta = (i % 3) * (TAU / 3) + radius * 4.4 + (random() - 0.5) * 0.7
    return { x: Math.cos(theta) * radius, y: Math.sin(theta) * radius }
  })
}

/** Üstten fincan: dış ağız, iç halka, kulp ve köpük dolgusu. */
export function cupShape(count: number, random: Random = Math.random): Point[] {
  return Array.from({ length: count }, () => {
    const pick = random()
    const angle = random() * TAU
    if (pick < 0.17) {
      const r = 1 + (random() - 0.5) * 0.03
      return { x: Math.cos(angle) * r, y: Math.sin(angle) * r }
    }
    if (pick < 0.33) {
      const r = 0.7 + (random() - 0.5) * 0.025
      return { x: Math.cos(angle) * r, y: Math.sin(angle) * r }
    }
    if (pick < 0.39) return { x: 0.72 + random() * 0.26, y: (random() - 0.5) * 0.18 }
    const r = Math.sqrt(random()) * 0.6
    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r }
  })
}

/** Yazı şekli için font: marka fontu kalın, yüklenmemişse benzer yedekler. */
export const textShapeFont = (family: string) =>
  `700 250px ${family}, "Helvetica Neue", Arial, sans-serif`

type TextShapeOptions = {
  text: string
  /** CSS font tanımı; yazı tipi yüklenmeden çağrılırsa yedek font kullanılır. */
  font: string
  random?: Random
}

/** Bir yazıyı ekran dışı canvas'a çizip dolu piksellerden nokta örnekler. */
export function textShape(
  count: number,
  { text, font, random = Math.random }: TextShapeOptions,
): Point[] {
  const W = 960
  const H = 340
  const STEP = 3
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return Array.from({ length: count }, () => ({ x: 0, y: 0 }))

  ctx.fillStyle = '#000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = font
  ctx.fillText(text, W / 2, H / 2 + 14)

  const alpha = ctx.getImageData(0, 0, W, H).data
  const points: Point[] = []
  for (let y = 0; y < H; y += STEP) {
    for (let x = 0; x < W; x += STEP) {
      if (alpha[(y * W + x) * 4 + 3] > 140) {
        points.push({ x: ((x - W / 2) / W) * 2.4, y: ((y - H / 2) / W) * 2.4 })
      }
    }
  }
  return Array.from({ length: count }, () => {
    const p = points[Math.floor(random() * points.length)] ?? { x: 0, y: 0 }
    return { x: p.x + (random() - 0.5) * 0.01, y: p.y + (random() - 0.5) * 0.01 }
  })
}
