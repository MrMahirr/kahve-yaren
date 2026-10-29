import type { CoffeeOption } from '@/data/menu'

type OptionGroupProps = {
  id: string
  label: string
  options: CoffeeOption[]
  value: number
  onChange: (option: number) => void
}

/** Şeker / shot / boy seçimi: her seçenek basılı durumunu bildiren bir buton. */
export function OptionGroup({ id, label, options, value, onChange }: OptionGroupProps) {
  const labelId = `${id}-secenek`

  return (
    <div className="flex flex-col gap-2.5">
      <span id={labelId} data-sk="text" className="mono-label text-dem">
        {label}
      </span>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <button
            key={option.label}
            type="button"
            data-sk="block"
            aria-pressed={index === value}
            onClick={() => onChange(index)}
            className="inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-full border border-gri-kahve bg-transparent px-[18px] font-body text-sm leading-[normal] font-semibold text-telve transition-colors duration-250 hover:border-telve aria-pressed:border-telve aria-pressed:bg-telve aria-pressed:text-kaymak"
          >
            {option.label}
            <small className="font-mono text-xs font-medium opacity-75">₺{option.price}</small>
          </button>
        ))}
      </div>
    </div>
  )
}
