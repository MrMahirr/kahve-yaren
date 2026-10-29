import type { CSSProperties, RefObject } from 'react'
import { HERO_PHASES } from '@/data/sequences'
import { cn } from '@/lib/cn'

type HeroTimelineProps = {
  phase: number
  /** Süre ve ilerleme çubuğu her karede ref üzerinden güncellenir (render tetiklemez). */
  timeRef: RefObject<HTMLSpanElement | null>
  fillRef: RefObject<HTMLDivElement | null>
}

/** Dökümün zaman çizelgesi: süre, ilerleme ve üç faz. */
export function HeroTimeline({ phase, timeRef, fillRef }: HeroTimelineProps) {
  return (
    <div
      aria-hidden="true"
      style={{ '--d': '.9s' } as CSSProperties}
      className="order-first flex flex-none fade-in flex-col gap-2.5 font-mono lg:order-none lg:flex-[0_1_220px] lg:gap-3.5 lg:pb-1.5"
    >
      <div className="flex justify-between text-xs tracking-[.12em] text-krema uppercase">
        <span data-sk="text">
          <span className="lg:hidden">
            0{phase + 1} · {HERO_PHASES[phase].name}
          </span>
          <span className="hidden lg:inline">Döküm</span>
        </span>
        <span data-sk="text">
          <span ref={timeRef}>0.0</span> sn
        </span>
      </div>
      <div data-sk="block" className="h-0.5 overflow-hidden rounded-full bg-kaymak/18">
        <div ref={fillRef} className="h-full w-0 bg-zeytin-isik" />
      </div>
      <ol className="m-0 hidden list-none flex-col gap-2 p-0 pt-1.5 text-[13px] tracking-[.08em] uppercase lg:flex">
        {HERO_PHASES.map((item, i) => (
          <li
            key={item.name}
            data-sk="text"
            className={cn(
              'flex gap-3.5 transition-opacity duration-400',
              i === phase ? 'opacity-100' : 'opacity-38',
            )}
          >
            <span className="text-zeytin-isik">0{i + 1}</span>
            {item.name}
          </li>
        ))}
      </ol>
    </div>
  )
}
