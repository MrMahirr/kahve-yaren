import { Chip } from '@/components/ui/Chip'
import type { CoffeeItem } from '@/data/menu'
import type { CurrentCoffee } from '@/features/coffee/useCoffeeSelection'
import { cn } from '@/lib/cn'

type CoffeeStageProps = {
  menu: CoffeeItem[]
  current: CurrentCoffee
}

/** Seçili kahvenin büyük fotoğrafı; görseller üst üste durur, aktif olan belirir. */
export function CoffeeStage({ menu, current }: CoffeeStageProps) {
  const { item, option } = current

  return (
    <figure
      aria-live="polite"
      className="relative m-0 min-h-[clamp(420px,46vw,660px)] overflow-hidden rounded-[2px] bg-telve text-kaymak"
    >
      {menu.map((coffee) => (
        <img
          key={coffee.id}
          src={coffee.image.src}
          alt={coffee.image.alt}
          loading="lazy"
          aria-hidden={coffee.id !== item.id}
          style={{ objectPosition: coffee.image.position }}
          className={cn(
            'absolute inset-0 size-full object-cover [transition:opacity_.8s_ease,scale_1.6s_var(--ease-brand)]',
            coffee.id === item.id ? 'scale-100 opacity-100' : 'scale-[1.08] opacity-0',
          )}
        />
      ))}
      <div aria-hidden="true" className="absolute inset-0 shade-stage" />

      <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3 font-mono text-xs tracking-[.14em]">
        <Chip>{item.tag}</Chip>
        <span>
          N° {item.no} / 0{menu.length}
        </span>
      </div>

      <figcaption className="absolute inset-x-[clamp(20px,3vw,36px)] bottom-[clamp(20px,3vw,36px)] flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <span className="font-mono text-xs tracking-[.14em] text-krema uppercase">
            {item.method}
          </span>
          <span className="mt-2 block font-display text-[40px] leading-[.92] font-semibold tracking-[-.04em] sm:text-[clamp(2.5rem,5vw,4.5rem)]">
            {item.name}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-xs tracking-[.14em] text-krema uppercase">
            {option.label}
          </span>
          <strong className="font-mono text-[28px] leading-none font-medium sm:text-[clamp(2rem,3.4vw,3rem)]">
            ₺{option.price}
          </strong>
        </div>
      </figcaption>
    </figure>
  )
}
