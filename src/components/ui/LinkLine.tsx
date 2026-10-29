import type { AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/** Üzerine gelince alt çizgisi soldan sağa çizilen metin linki. */
export function LinkLine({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  // İskelet çizgisi metne verilir: link 44 px dokunma alanı taşır, tek satır çizilmeli.
  return (
    <a className={cn('link-line', className)} {...props}>
      <span data-sk="text">{children}</span>
    </a>
  )
}
