import { useEffect, useRef, type RefObject } from 'react'
import { coverRect, fitCanvas, isOnScreen } from '@/lib/canvas'
import { clamp } from '@/lib/math'
import { useAnimationLoop } from './useAnimationLoop'

/** Dar ekran sınırı: odak ortaya alınır, yakınlaştırma azalır. */
const NARROW_WIDTH = 760
/** İlerleme bu kadar az değiştiyse ve kare aynıysa yeniden çizilmez. */
const MIN_PROGRESS_DELTA = 0.0015

type FrameSequenceOptions = {
  sectionRef: RefObject<HTMLElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  frames: string[]
  /** Geniş ekranda yatay odak noktası (0..1). */
  focal: number
  /** true: kareler bölüm ekrana yaklaşınca yüklenir. */
  lazy?: boolean
  background: string
  onProgress?: (progress: number, frameIndex: number) => void
}

/**
 * Kaydırmaya bağlı kare dizisi: bölüm (sticky sahnesiyle birlikte) kaydırıldıkça
 * ilerleme 0..1 hesaplanır ve canvas'a karşılık gelen kare çizilir.
 */
export function useFrameSequence({
  sectionRef,
  canvasRef,
  frames,
  focal,
  lazy = false,
  background,
  onProgress,
}: FrameSequenceOptions) {
  const images = useRef<HTMLImageElement[]>([])
  const last = useRef({ image: null as HTMLImageElement | null, progress: -1, force: false })

  // Yükleme: hemen ya da bölüm bir ekran yüksekliği kadar yaklaşınca.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const state = last.current
    const requestRedraw = () => {
      state.force = true
    }

    const load = () => {
      if (images.current.length) return
      images.current = frames.map((src) => {
        const image = new Image()
        image.decoding = 'async'
        image.src = src
        return image
      })
      images.current[0]?.addEventListener('load', requestRedraw, { once: true })
    }

    if (!lazy) {
      load()
      return
    }
    if (typeof IntersectionObserver === 'undefined') {
      const timer = window.setTimeout(load, 600)
      return () => window.clearTimeout(timer)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load()
          observer.disconnect()
        }
      },
      { rootMargin: '100% 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [sectionRef, frames, lazy])

  // Henüz yüklenmemiş bir kare istenirse en yakın yüklü kare kullanılır.
  const nearestLoaded = (index: number) => {
    const list = images.current
    for (let distance = 0; distance < list.length; distance += 1) {
      for (const i of [index - distance, index + distance]) {
        const image = list[i]
        if (image?.complete && image.naturalWidth) return image
      }
    }
    return null
  }

  useAnimationLoop(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    const rect = canvas.getBoundingClientRect()
    if (!isOnScreen(rect)) return

    const sectionRect = section.getBoundingClientRect()
    const distance = sectionRect.height - rect.height
    const progress = distance > 0 ? clamp(-sectionRect.top / distance) : 0
    const index = Math.round(progress * (frames.length - 1))
    const image = nearestLoaded(index)

    const { dpr, resized } = fitCanvas(canvas, rect)
    if (!image) return
    const state = last.current
    const unchanged =
      image === state.image && Math.abs(progress - state.progress) < MIN_PROGRESS_DELTA
    if (!state.force && !resized && unchanged) return
    Object.assign(state, { image, progress, force: false })

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Kaydırdıkça hafif yakınlaşma; dar ekranda odak ortada ve biraz yukarıda.
    const narrow = rect.width < NARROW_WIDTH
    const target = coverRect({ width: image.naturalWidth, height: image.naturalHeight }, rect, {
      focalX: narrow ? 0.5 : focal,
      focalY: narrow ? 0.42 : 0.5,
      zoom: (narrow ? 1 : 1.1) + 0.06 * progress,
    })
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = background
    ctx.fillRect(0, 0, rect.width, rect.height)
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(image, target.x, target.y, target.width, target.height)

    onProgress?.(progress, index)
  })
}
