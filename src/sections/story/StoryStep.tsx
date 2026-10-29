import type { StoryStep as Step } from '@/data/story'
import { cn } from '@/lib/cn'

type StoryStepProps = {
  step: Step
  active: boolean
  /** Son adımın numarası marka yeşiliyle çizilir. */
  last: boolean
}

export function StoryStep({ step, active, last }: StoryStepProps) {
  return (
    <article
      className={cn(
        'flex min-h-[340px] flex-col justify-center gap-3 transition-opacity duration-500 lg:min-h-[480px] lg:gap-4',
        // %60: etkin olmayan adım soluk ama WCAG AA kontrastını korur (orijinalde %30, ≈2.2:1).
        active ? 'opacity-100' : 'opacity-60',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'font-display text-[72px] leading-[.85] font-bold tracking-[-.05em] text-outline lg:text-[clamp(5rem,9vw,8rem)]',
          last ? 'text-outline-color-filiz' : 'text-outline-color-findik',
        )}
      >
        {step.no}
      </span>
      <h3 className="m-0 font-display text-[28px] leading-[1.1] font-semibold tracking-[-.02em] lg:text-[clamp(1.75rem,2.6vw,2.25rem)]">
        {step.title}
      </h3>
      <p className="m-0 max-w-[28rem] text-base leading-[1.7] text-krema lg:text-lg">{step.text}</p>
    </article>
  )
}
