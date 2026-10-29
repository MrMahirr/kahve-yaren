import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'ghost' | 'outline'

const base =
  'inline-flex h-14 cursor-pointer items-center justify-center gap-2.5 rounded-full border-0 px-7 font-body text-base leading-none font-semibold no-underline transition-[background-color,color,translate] duration-250 [&_svg]:size-[18px] [&_svg]:flex-none'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-zeytin text-kaymak hover:-translate-y-0.5 hover:bg-zeytin-koyu',
  ghost:
    'border-[1.5px] border-kaymak/70 bg-transparent text-kaymak hover:bg-kaymak hover:text-telve',
  outline:
    'h-12 border-[1.5px] border-telve bg-transparent px-[22px] text-[15px] text-telve hover:bg-telve hover:text-kaymak',
}

/** Buton görünümü; bileşen dışında (ör. form içinde özel bir öğede) de kullanılabilir. */
export const buttonClasses = (variant: ButtonVariant = 'primary', className?: string) =>
  cn(base, variants[variant], className)
