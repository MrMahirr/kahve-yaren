import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav'
}

/** En fazla 1280px genişlik ve ekrana göre değişen yan boşluk. */
export function Container({ as: Tag = 'div', className, ...props }: ContainerProps) {
  return <Tag className={cn('container-site', className)} {...props} />
}
