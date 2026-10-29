import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { buttonClasses, type ButtonVariant } from './buttonClasses'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }

export function Button({ variant, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button data-sk="block" type={type} className={buttonClasses(variant, className)} {...props} />
  )
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  variant?: ButtonVariant
}

/** Buton görünümlü çapa linki (ör. "Kahveleri Keşfet" → #kahveler). */
export function ButtonLink({ variant, className, ...props }: ButtonLinkProps) {
  return <a data-sk="block" className={buttonClasses(variant, className)} {...props} />
}
