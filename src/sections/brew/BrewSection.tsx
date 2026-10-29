import { useRef, useState } from 'react'
import { FrameSequence } from '@/components/FrameSequence'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { SECTION_IDS } from '@/data/navigation'
import { ESPRESSO_PHASES, phaseAt } from '@/data/sequences'
import { cn } from '@/lib/cn'

/** Sayaç, kaydırma boyunca 0'dan demleme süresine (25 sn) çıkar. */
const BREW_SECONDS = 25

/** Demleme: portafiltreden espresso akışı; kareleri bölüm ekrana yaklaşınca yüklenir. */
export function BrewSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const [phase, setPhase] = useState(0)

  const handleProgress = (progress: number, frameIndex: number) => {
    if (counterRef.current)
      counterRef.current.textContent = String(Math.round(progress * BREW_SECONDS))
    setPhase(phaseAt(ESPRESSO_PHASES, frameIndex))
  }

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.brew}
      aria-labelledby="demleme-baslik"
      className="relative h-[calc(100svh+1000px)] bg-gece text-kaymak lg:h-[calc(100svh+1400px)]"
    >
      <div className="sticky top-0 h-screen overflow-hidden supports-[height:100dvh]:h-dvh">
        <FrameSequence
          sectionRef={sectionRef}
          prefix="es"
          focal={0.62}
          lazy
          label="Portafiltreden cam fincana espresso akıyor, kalın krema oluşuyor"
          onProgress={handleProgress}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 shade-seq" />

        <Container className="relative flex h-full flex-col justify-end gap-5 pt-[calc(var(--spacing-nav)+32px)] pb-8 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-8 lg:pb-[clamp(40px,6vw,72px)] short:gap-4 short:pt-[calc(var(--spacing-nav)+16px)] short:pb-5">
          <div className="flex flex-none flex-col gap-[18px] lg:max-w-[560px] lg:flex-[1_1_480px] lg:gap-[22px] short:gap-3">
            <Eyebrow tone="light">Cezveden portafiltreye</Eyebrow>
            <h2
              id="demleme-baslik"
              className="h-display text-[44px] lg:text-[clamp(2.5rem,5.6vw,5rem)] short:text-[clamp(2rem,4.5vw,3rem)]"
            >
              Aynı sabır,
              <br />
              <span className="text-zeytin-isik">dokuz bar</span> basınçla.
            </h2>
            <p className="m-0 max-w-[30rem] text-base leading-[1.65] text-krema lg:text-lg short:text-[15px]">
              Taze öğütülmüş çekirdek, yirmi beş saniyelik bir demleme ve kalın, fındıksı bir krema.
              Geleneği bugünün hızıyla buluşturuyoruz.
            </p>
            <div aria-hidden="true" className="flex gap-2.5 pt-2">
              {ESPRESSO_PHASES.map((step, i) => (
                <div
                  key={step.name}
                  className="flex flex-1 flex-col gap-2.5 font-mono text-xs leading-[normal] tracking-[.1em] uppercase"
                >
                  <span
                    className={cn(
                      'h-0.5 rounded-full transition-colors duration-400',
                      i <= phase ? 'bg-zeytin-isik' : 'bg-kaymak/22',
                    )}
                  />
                  <span
                    className={cn(
                      'transition-opacity duration-400',
                      i === phase ? 'opacity-100' : 'opacity-45',
                    )}
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute top-[calc(var(--spacing-nav)+20px)] right-gutter font-display text-[72px] leading-[.8] font-bold tracking-[-.05em] text-outline [--outline-color:rgb(244_239_230/.55)] lg:static lg:self-end lg:text-[clamp(4rem,9vw,8.5rem)]"
          >
            <span ref={counterRef}>0</span>s
          </div>
        </Container>
      </div>
    </section>
  )
}
