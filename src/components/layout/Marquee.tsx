import { Fragment } from 'react'
import { CupMark } from '@/components/icons'
import { MARQUEE_WORDS } from '@/data/navigation'

/** Kesintisiz döngü: aynı grup iki kez çizilir, iz -%50 kayınca başa sarar. */
function MarqueeGroup() {
  return (
    <div className="flex items-center gap-10 pr-10 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-medium tracking-[-.02em] whitespace-nowrap">
      {MARQUEE_WORDS.map((word) => (
        <Fragment key={word.text}>
          {word.emphasis ? <em className="text-krema">{word.text}</em> : <span>{word.text}</span>}
          <CupMark className="flex-none text-krema" />
        </Fragment>
      ))}
    </div>
  )
}

export function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-zeytin-koyu bg-zeytin py-5 text-kaymak"
    >
      <div className="flex w-max animate-marquee">
        <MarqueeGroup />
        <MarqueeGroup />
      </div>
    </div>
  )
}
