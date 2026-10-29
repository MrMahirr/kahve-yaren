import { useId } from 'react'
import { CupMark, IconClock, IconPin } from '@/components/icons'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { frameList } from '@/data/sequences'

const [coverFrame] = frameList('tk', 1)

/** Dönen yazılı rozet: "FİNCAN HAZIR · SOHBET SENDE ·" çember üzerinde. */
function Badge() {
  const pathId = useId()
  return (
    <div
      aria-hidden="true"
      data-sk="block"
      className="relative flex size-[92px] flex-none items-center justify-center rounded-full bg-zeytin/92 sm:size-28"
    >
      <svg viewBox="0 0 150 150" className="absolute inset-0 size-full animate-spin-slow">
        <defs>
          <path id={pathId} d="M75,75 m-54,0 a54,54 0 1,1 108,0 a54,54 0 1,1 -108,0" />
        </defs>
        <text
          fill="var(--color-kaymak)"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fontWeight="500"
          letterSpacing="2"
        >
          <textPath href={`#${pathId}`} textLength="335" lengthAdjust="spacing">
            FİNCAN HAZIR · SOHBET SENDE ·
          </textPath>
        </text>
      </svg>
      <CupMark size={28} className="text-kaymak" />
    </div>
  )
}

export function ContactVisual() {
  return (
    <div
      data-sk="media"
      className="relative flex min-h-[500px] flex-col justify-between gap-8 overflow-hidden bg-gece p-[clamp(24px,4vw,48px)] text-kaymak sm:min-h-[640px]"
    >
      <img
        src={coverFrame}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover object-[42%_50%]"
      />
      <div aria-hidden="true" data-sk="hide" className="absolute inset-0 shade-contact" />

      <div className="relative flex items-start justify-between gap-4">
        <Eyebrow tone="accent">03 — İletişim</Eyebrow>
        <Badge />
      </div>

      <div className="relative flex flex-col gap-5">
        <h2
          id="iletisim-baslik"
          data-sk="text"
          className="h-display text-[42px] sm:text-[clamp(2.5rem,4.6vw,4.25rem)]"
        >
          Fincan hazır,
          <br />
          <span className="text-zeytin-isik">sohbet sende.</span>
        </h2>
        <p data-sk="text" className="m-0 max-w-[26rem] text-[17px] leading-[1.65] text-krema">
          Toplu sipariş, etkinlik ya da sadece bir öneri. Yaz; bir fincan kahve soğumadan dönelim.
        </p>
        <ul className="m-0 flex list-none flex-col gap-3 border-t border-kaymak/20 p-0 pt-5 text-[15px]">
          <li data-sk="text" className="flex items-center gap-3">
            <IconPin className="text-zeytin-isik" />
            [ADRES — Mahalle, İlçe / Şehir]
          </li>
          <li data-sk="text" className="flex items-center gap-3">
            <IconClock className="text-zeytin-isik" />
            [ÇALIŞMA SAATLERİ]
          </li>
        </ul>
      </div>
    </div>
  )
}
