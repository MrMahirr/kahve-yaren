import { IconArrowRight } from '@/components/icons'
import { ButtonLink } from '@/components/ui/Button'
import { SECTION_IDS } from '@/data/navigation'
import type { CurrentCoffee } from '@/features/coffee/useCoffeeSelection'

type SelectionSummaryProps = {
  current: CurrentCoffee
  /** Seçim, iletişim formuna konu olarak taşınır; kaydırmayı link yapar. */
  onAsk: (label: string) => void
}

export function SelectionSummary({ current, onAsk }: SelectionSummaryProps) {
  const { item, option, label } = current

  return (
    <div className="flex flex-col items-stretch justify-between gap-x-5 gap-y-4 rounded-[2px] bg-telve p-5 text-kaymak sm:flex-row sm:flex-wrap sm:items-center sm:pl-6">
      <div>
        <span className="block font-mono text-[11px] leading-[normal] font-medium tracking-[.14em] text-krema uppercase">
          Seçimin
        </span>
        <span className="block text-[17px] font-semibold">
          {item.name} · {option.label}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 sm:justify-start">
        <span className="font-mono text-[26px] leading-none font-medium">₺{option.price}</span>
        <ButtonLink
          href={`#${SECTION_IDS.contact}`}
          onClick={() => onAsk(label)}
          className="h-[52px] flex-[1_1_100%] px-[22px] text-[15px] sm:flex-none"
        >
          Bu kahve için yaz
          <IconArrowRight />
        </ButtonLink>
      </div>
    </div>
  )
}
