import { useEffect, useState } from 'react'
import { IconClose, IconMenu, Logo } from '@/components/icons'
import { Container } from '@/components/ui/Container'
import { LinkLine } from '@/components/ui/LinkLine'
import { NAV_LINKS, SECTION_IDS } from '@/data/navigation'
import { MobileMenu } from './MobileMenu'

const MOBILE_MENU_ID = 'mobil-menu'
const DESKTOP_QUERY = '(min-width: 721px)'

export function Navbar() {
  const [open, setOpen] = useState(false)

  // Escape ile kapanır; masaüstü genişliğine geçilince panel kendiliğinden kapanır.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onDesktop)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onDesktop)
    }
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-kaymak/10 bg-gece/62 text-kaymak backdrop-blur-[14px]">
      <Container className="flex h-nav items-center justify-between gap-8">
        <a
          href={`#${SECTION_IDS.hero}`}
          aria-label="Yâren ana sayfa"
          className="flex min-h-11 items-center gap-2.5 text-kaymak no-underline"
        >
          <Logo />
          <span className="font-display text-[23px] leading-none font-semibold tracking-[-.03em] md:text-[25px]">
            Yâren
          </span>
        </a>

        <nav aria-label="Ana menü" className="hidden gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <LinkLine
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-[15px] font-medium text-kaymak"
            >
              {link.label}
            </LinkLine>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={MOBILE_MENU_ID}
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-kaymak/30 bg-transparent text-kaymak md:hidden"
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </Container>

      <MobileMenu id={MOBILE_MENU_ID} open={open} onNavigate={() => setOpen(false)} />
    </header>
  )
}
