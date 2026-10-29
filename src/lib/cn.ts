import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// index.css'teki özel yardımcı sınıflar tailwind-merge'e tanıtılır; tanıtılmazsa
// ör. `text-outline` ile `text-outline-color-filiz` "yazı rengi" sanılıp biri silinir.
const twMerge = extendTailwindMerge<'text-outline' | 'text-outline-color'>({
  extend: {
    classGroups: {
      'text-outline': ['text-outline'],
      'text-outline-color': [{ 'text-outline-color': [(value: string) => value.length > 0] }],
    },
  },
  // Yazı boyutu sınıflarımız satır yüksekliği taşımadığı için boyut, leading-*'i silmemeli.
  override: { conflictingClassGroups: { 'font-size': [] } },
})

/** Koşullu sınıfları birleştirir; çakışan Tailwind sınıflarında sonuncusu kazanır. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
