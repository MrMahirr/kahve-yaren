import { useRef, useState, type CSSProperties } from 'react'
import { FrameSequence } from '@/components/FrameSequence'
import { IconArrowDown } from '@/components/icons'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { SECTION_IDS } from '@/data/navigation'
import { HERO_PHASES, frameList, phaseAt } from '@/data/sequences'
import { useAssetsReady } from '@/hooks/useAssetsReady'
import { cn } from '@/lib/cn'
import { skeletonProps } from '@/lib/skeleton'
import { HeroTimeline } from './HeroTimeline'
import { HeroTitle } from './HeroTitle'

/** "Kaydır" ipucu bu ilerlemeden sonra kaybolur. */
const HINT_UNTIL = 0.04
/** Kareler saniyede 10 kare çekildi: kare indeksi × 0.1 = saniye. */
const SECONDS_PER_FRAME = 0.1

const FIRST_FRAME = frameList('tk', 1)

const delay = (seconds: string) => ({ '--d': seconds }) as CSSProperties

/** Giriş: cezveden fincana Türk kahvesi, kaydırdıkça kare kare dökülür. */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)
  const [hintVisible, setHintVisible] = useState(true)
  // İlk kare ve fontlar gelene kadar bölüm iskelet olarak görünür.
  const ready = useAssetsReady({ images: FIRST_FRAME, fonts: true })

  const handleProgress = (progress: number, frameIndex: number) => {
    if (timeRef.current) timeRef.current.textContent = (frameIndex * SECONDS_PER_FRAME).toFixed(1)
    if (fillRef.current) fillRef.current.style.width = `${Math.round(progress * 100)}%`
    // Aynı değerle setState render tetiklemez; yalnızca faz değişince render olur.
    setPhase(phaseAt(HERO_PHASES, frameIndex))
    setHintVisible(progress <= HINT_UNTIL)
  }

  return (
    <section
      ref={sectionRef}
      {...skeletonProps(ready, 'dark')}
      id={SECTION_IDS.hero}
      aria-labelledby="hero-baslik"
      // Menü videonun üstünde dursun: nav yüksekliği kadar yukarı çekilir.
      // Sahne her ekranda görünür alanı tam doldurur (16:10, 21:9, dikey tablet, uzun telefon);
      // bölüm, sahnenin üstüne kaydırma mesafesi kadar uzundur.
      className="relative -mt-nav h-[calc(100svh+1200px)] bg-gece text-kaymak lg:h-[calc(100svh+1700px)]"
    >
      <div className="sticky top-0 h-screen overflow-hidden supports-[height:100dvh]:h-dvh">
        <FrameSequence
          sectionRef={sectionRef}
          prefix="tk"
          focal={0.6}
          label="Bakır cezveden beyaz fincana Türk kahvesi dökülüyor"
          onProgress={handleProgress}
        />
        <div
          aria-hidden="true"
          data-sk="hide"
          className="pointer-events-none absolute inset-0 shade-seq"
        />

        <Container className="relative flex h-full flex-col justify-end gap-5 pt-[calc(var(--spacing-nav)+32px)] pb-8 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between lg:gap-8 lg:pb-[clamp(40px,6vw,72px)] short:gap-4 short:pt-[calc(var(--spacing-nav)+16px)] short:pb-5">
          <div className="flex flex-none flex-col gap-[18px] lg:max-w-[640px] lg:flex-[1_1_520px] lg:gap-6 short:gap-3">
            <Eyebrow tone="light" className="fade-in" style={delay('.05s')}>
              Türk kahvesi · Espresso · Filtre
            </Eyebrow>
            <HeroTitle id="hero-baslik" />
            <p
              data-sk="text"
              style={delay('.55s')}
              className="m-0 max-w-[32rem] fade-in text-base text-pretty text-krema lg:text-[clamp(1.0625rem,1.4vw,1.1875rem)] short:text-[15px]"
            >
              Bakır cezvede, kısık ateşte, köpüğü bozulmadan. Yâren geleneksel Türk kahvesini
              bugünün demleme kültürüyle aynı masaya oturtur.
            </p>
            <div
              style={delay('.7s')}
              className="flex fade-in flex-wrap gap-2.5 pt-0.5 lg:gap-x-4 lg:gap-y-3.5 lg:pt-1.5"
            >
              <ButtonLink
                href={`#${SECTION_IDS.coffee}`}
                className="h-[52px] flex-[1.5_1_0] px-3.5 text-[15px] whitespace-nowrap lg:h-14 lg:flex-none lg:px-7 lg:text-base short:h-11 max-lg:[&_svg]:hidden"
              >
                Kahveleri Keşfet
                <IconArrowDown />
              </ButtonLink>
              <ButtonLink
                href={`#${SECTION_IDS.story}`}
                variant="ghost"
                className="h-[52px] flex-[1_1_0] px-3.5 text-[15px] whitespace-nowrap lg:h-14 lg:flex-none lg:px-7 lg:text-base short:h-11"
              >
                Hikâyemiz
              </ButtonLink>
            </div>
          </div>

          <HeroTimeline phase={phase} timeRef={timeRef} fillRef={fillRef} />
        </Container>

        <div
          aria-hidden="true"
          data-sk="hide"
          className={cn(
            'absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 font-mono text-[11px] leading-[normal] tracking-[.2em] text-krema uppercase transition-opacity duration-500 lg:flex',
            !hintVisible && 'opacity-0',
          )}
        >
          <span>Kaydır</span>
          <span className="h-11 w-px overflow-hidden bg-kaymak/20">
            <span className="block h-full w-px animate-drop bg-kaymak" />
          </span>
        </div>
      </div>
    </section>
  )
}
