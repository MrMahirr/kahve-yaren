import { useEffect, useState, type RefObject } from 'react'

/** Ağ takılırsa içerik en geç bu süre sonra yine gösterilir. */
const MAX_WAIT_MS = 8000

/**
 * Marka fontları açıkça yükletilir: `document.fonts.ready` tek başına, font yüklemesi
 * henüz başlamamışsa hemen çözülür ve hiçbir şeyi beklemez.
 */
const BRAND_FONTS = [
  '600 1em "Bricolage Grotesque Variable"',
  '400 1em "Instrument Sans Variable"',
  '500 1em "DM Mono"',
]

const fontsLoaded = () =>
  Promise.all(BRAND_FONTS.map((font) => document.fonts.load(font)))
    .then(() => document.fonts.ready)
    .catch(() => {})

type AssetsOptions = {
  /** Çözülmesi (decode) beklenen görseller. */
  images?: string[]
  /** Web fontlarının yüklenmesi beklensin mi? */
  fonts?: boolean
  /** Verilirse yükleme bu öğe ekrana bir ekran yüksekliği kadar yaklaşınca başlar. */
  deferUntilNear?: RefObject<Element | null>
}

/** Görsel ekranda çizilebilir olduğunda (ya da yüklenemediğinde) çözülür. */
function decodeImage(src: string) {
  const image = new Image()
  image.decoding = 'async'
  image.src = src
  return image.decode().catch(() => {})
}

/**
 * Bir bölümün ihtiyaç duyduğu dosyalar hazır mı? Skeleton bu değer true olana kadar görünür.
 * Aynı adresler tarayıcı önbelleğinden gelir; görseller ikinci kez indirilmez.
 */
export function useAssetsReady({ images = [], fonts = false, deferUntilNear }: AssetsOptions) {
  const [ready, setReady] = useState(false)
  const key = images.join('|')

  useEffect(() => {
    let active = true
    let timer = 0
    const finish = () => {
      if (active) setReady(true)
    }
    const start = () => {
      timer = window.setTimeout(finish, MAX_WAIT_MS)
      const waits: Promise<unknown>[] = key ? key.split('|').map(decodeImage) : []
      if (fonts && document.fonts) waits.push(fontsLoaded())
      void Promise.all(waits).then(finish)
    }

    const target = deferUntilNear?.current
    let observer: IntersectionObserver | undefined
    if (target && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          observer?.disconnect()
          start()
        },
        { rootMargin: '100% 0px' },
      )
      observer.observe(target)
    } else {
      start()
    }

    return () => {
      active = false
      window.clearTimeout(timer)
      observer?.disconnect()
    }
  }, [key, fonts, deferUntilNear])

  return ready
}
