import type { AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/** Üzerine gelince alt çizgisi soldan sağa çizilen metin linki. */
export function LinkLine({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn('link-line', className)} {...props} />
}
