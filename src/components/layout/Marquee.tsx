import { Fragment } from 'react'
import { CupMark } from '@/components/icons'
import { MARQUEE_WORDS } from '@/data/navigation'
import { useAssetsReady } from '@/hooks/useAssetsReady'
import { skeletonProps } from '@/lib/skeleton'

/** Kesintisiz döngü: aynı grup iki kez çizilir, iz -%50 kayınca başa sarar. */
function MarqueeGroup() {
  return (
    <div className="flex items-center gap-10 pr-10 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-medium tracking-[-.02em] whitespace-nowrap">
      {MARQUEE_WORDS.map((word) => (
        <Fragment key={word.text}>
          {word.emphasis ? (
            <em data-sk="text" className="text-krema">
              {word.text}
            </em>
          ) : (
            <span data-sk="text">{word.text}</span>
          )}
          <CupMark data-sk="block" className="flex-none rounded-full text-krema" />
        </Fragment>
      ))}
    </div>
  )
}

export function Marquee() {
  const ready = useAssetsReady({ fonts: true })
  return (
    <div
      {...skeletonProps(ready, 'dark')}
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
