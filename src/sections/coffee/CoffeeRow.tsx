import { AnimatePresence, m } from 'motion/react'
import { IconPlus } from '@/components/icons'
import type { CoffeeItem } from '@/data/menu'
import { cn } from '@/lib/cn'
import { OptionGroup } from './OptionGroup'

type CoffeeRowProps = {
  item: CoffeeItem
  index: number
  open: boolean
  option: number
  onSelect: () => void
  onOptionChange: (option: number) => void
}

/** Akordeon satırı: başlık butonu kahveyi seçer, açık satırda açıklama ve seçenekler görünür. */
export function CoffeeRow({ item, index, open, option, onSelect, onOptionChange }: CoffeeRowProps) {
  const bodyId = `kahve-${index}`

  return (
    <div className="border-t border-kum-koyu">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={onSelect}
        className="group grid w-full cursor-pointer grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 border-0 bg-transparent px-0 py-5 text-left text-telve sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:gap-4 sm:px-1 sm:py-6"
      >
        <span
          className={cn(
            'font-mono text-[13px] leading-[normal] font-medium',
            open ? 'text-zeytin' : 'text-dem', // gri-kahve 3.6:1 kalıyordu; dem 5.9:1
          )}
        >
          {item.no}
        </span>
        <span>
          <span
            className={cn(
              'block font-display text-2xl leading-[1.1] font-semibold tracking-[-.025em] transition-opacity duration-300 group-hover:opacity-100 sm:text-[clamp(1.625rem,2.4vw,2.125rem)]',
              open ? 'opacity-100' : 'opacity-62',
            )}
          >
            {item.name}
          </span>
          <span className="block text-[13px] text-dem sm:text-sm">{item.short}</span>
        </span>
        <span className="flex items-center gap-4">
          <span className="font-mono text-[17px] leading-[normal] font-medium sm:text-xl">
            ₺{item.options[option].price}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex size-8 items-center justify-center rounded-full border [transition:rotate_.45s_var(--ease-brand),background-color_.3s_ease,color_.3s_ease] sm:size-9',
              open ? 'rotate-45 border-telve bg-telve text-kaymak' : 'border-gri-kahve',
            )}
          >
            <IconPlus />
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="body"
            id={bodyId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5 pb-6 pl-11 sm:pr-1 sm:pb-[30px] sm:pl-[clamp(4px,4.4vw,64px)]">
              <p className="m-0 max-w-[30rem] text-dem">{item.desc}</p>
              <OptionGroup
                id={bodyId}
                label={item.optionLabel}
                options={item.options}
                value={option}
                onChange={onOptionChange}
              />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
