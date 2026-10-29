import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Chip({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-sk="block"
      className={cn(
        'inline-flex h-[30px] items-center rounded-full bg-kaymak px-3.5 font-mono text-[11px] leading-[normal] font-medium tracking-[.1em] text-telve uppercase',
        className,
      )}
      {...props}
    />
  )
}
