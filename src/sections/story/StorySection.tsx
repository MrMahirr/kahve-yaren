import { useRef, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { SECTION_IDS } from '@/data/navigation'
import { STORY_STEPS } from '@/data/story'
import { useParticles } from '@/features/particles/useParticles'
import { useAssetsReady } from '@/hooks/useAssetsReady'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { skeletonProps } from '@/lib/skeleton'
import { StoryStep } from './StoryStep'

/** Hikâye: kaydırdıkça telve taneleri çekirdek, girdap, fincan ve "Yâren" biçimine girer. */
export function StorySection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = usePrefersReducedMotion()
  const [activeStep, setActiveStep] = useState(0)
  // Parçacıkların "Yâren" yazısı marka fontuyla örneklenir; font gelene kadar iskelet.
  const ready = useAssetsReady({ fonts: true })

  useParticles({ canvasRef, trackRef, reduceMotion, onStep: setActiveStep })

  const current = STORY_STEPS[activeStep]

  return (
    <section
      {...skeletonProps(ready, 'dark')}
      id={SECTION_IDS.story}
      aria-labelledby="hikaye-baslik"
      className="bg-telve text-kaymak"
    >
      <Container className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5 pt-[clamp(72px,9vw,128px)] pb-[clamp(56px,7vw,96px)]">
        <div className="flex flex-col gap-[18px]">
          <Eyebrow tone="light">01 — Hikâye</Eyebrow>
          <h2 id="hikaye-baslik" data-sk="text" className="h-section">
            Çekirdekten fincana,
            <br />
            dört adımda.
          </h2>
        </div>
        <p data-sk="text" className="m-0 max-w-[22rem] text-krema">
          Aşağı kaydır: telve taneleri her adımda yeni bir biçime girer. İmleçle dokunursan
          dağılırlar.
        </p>
      </Container>

      <div
        ref={trackRef}
        className="container-site flex flex-row-reverse flex-wrap gap-x-[clamp(32px,5vw,72px)] pb-[clamp(72px,9vw,128px)]"
      >
        <div
          data-sk="media"
          className="sticky top-[calc(var(--spacing-nav)+12px)] z-2 h-[min(340px,calc(100svh-var(--spacing-nav)-24px))] basis-full self-start overflow-hidden rounded-[2px] border border-krema/16 bg-telve lg:h-[min(clamp(340px,52vw,740px),calc(100svh-100px))] lg:flex-[1.15_1_480px]"
        >
          <canvas ref={canvasRef} aria-hidden="true" className="block size-full touch-pan-y" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 top-[18px] flex justify-between gap-3 font-mono text-xs leading-[normal] font-medium tracking-[.12em] text-krema uppercase"
          >
            <span data-sk="text">
              {current.no} / 0{STORY_STEPS.length}
            </span>
            <span data-sk="text">Telve · {current.title}</span>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 bottom-5 flex gap-1.5"
          >
            {STORY_STEPS.map((step, i) => (
              <span
                key={step.no}
                data-sk="block"
                className={cn(
                  'h-[3px] flex-1 rounded-full transition-colors duration-400',
                  i <= activeStep ? 'bg-filiz' : 'bg-krema/22',
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-[1_1_420px] flex-col">
          {STORY_STEPS.map((step, i) => (
            <StoryStep
              key={step.no}
              step={step}
              active={i === activeStep}
              last={i === STORY_STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
