import { AnimatePresence, m } from 'motion/react'
import { ButtonLink } from '@/components/ui/Button'
import { NAV_LINKS, SECTION_IDS } from '@/data/navigation'

type MobileMenuProps = {
  id: string
  open: boolean
  /** Bir linke tıklanınca panel kapanır. */
  onNavigate: () => void
}

export function MobileMenu({ id, open, onNavigate }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <m.nav
          id={id}
          aria-label="Mobil menü"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex flex-col px-gutter pt-1 pb-6 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="flex min-h-[60px] items-center justify-between border-b border-kaymak/12 font-display text-[28px] leading-[1.1] font-semibold tracking-[-.02em] text-kaymak no-underline"
            >
              {link.label}
              <small className="font-mono text-xs font-medium text-zeytin-isik">{link.no}</small>
            </a>
          ))}
          <ButtonLink href={`#${SECTION_IDS.coffee}`} onClick={onNavigate} className="mt-5">
            Kahveleri Keşfet
          </ButtonLink>
        </m.nav>
      )}
    </AnimatePresence>
  )
}
