import { clamp } from './math'

/** Retina ekranlarda netlik için en fazla 2× piksel yoğunluğu; daha fazlası yalnızca maliyet. */
export const MAX_DPR = 2

type Size = { width: number; height: number }

/** Canvas görünür alanda mı? Ekran dışındaki canvas'lar hiç çizilmez. */
export const isOnScreen = (rect: DOMRect, viewportHeight = window.innerHeight) =>
  rect.width > 0 && rect.bottom >= 0 && rect.top <= viewportHeight

/**
 * Canvas'ın piksel boyutunu ekrandaki boyutuna ve DPR'a eşitler.
 * Boyut değiştiyse `resized: true` döner (canvas temizlenmiş olur, yeniden çizilmeli).
 */
export function fitCanvas(canvas: HTMLCanvasElement, rect: DOMRect) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
  const width = Math.round(rect.width * dpr)
  const height = Math.round(rect.height * dpr)
  const resized = canvas.width !== width || canvas.height !== height
  if (resized) {
    canvas.width = width
    canvas.height = height
  }
  return { dpr, resized }
}

export type CoverOptions = {
  /** Görselin kutuya yerleşeceği yatay odak (0 sol, 1 sağ). */
  focalX: number
  /** Dikey odak (0 üst, 1 alt). */
  focalY: number
  /** 1 = tam cover; üstü yakınlaştırır. */
  zoom: number
}

/**
 * `object-fit: cover` hesabı + odak noktası: görsel kutuyu boşluksuz doldurur,
 * odak noktası mümkün olduğunca belirtilen konuya gelir ama kenarlar asla açılmaz.
 */
export function coverRect(image: Size, box: Size, { focalX, focalY, zoom }: CoverOptions) {
  const scale = Math.max(box.width / image.width, box.height / image.height) * zoom
  const width = image.width * scale
  const height = image.height * scale
  return {
    x: clamp(box.width * focalX - width / 2, box.width - width, 0),
    y: clamp(box.height * focalY - height / 2, box.height - height, 0),
    width,
    height,
  }
}
