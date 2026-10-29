import { Container } from '@/components/ui/Container'
import { LinkLine } from '@/components/ui/LinkLine'
import { NAV_LINKS } from '@/data/navigation'
import { useAssetsReady } from '@/hooks/useAssetsReady'
import { skeletonProps } from '@/lib/skeleton'

export function Footer() {
  const ready = useAssetsReady({ fonts: true })
  return (
    <footer {...skeletonProps(ready, 'dark')} className="overflow-hidden bg-telve text-kaymak">
      <Container className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6 pt-16">
        <p data-sk="text" className="m-0 text-[17px] text-krema">
          Her fincanda ortak bir hikâye.
        </p>
        <nav aria-label="Alt menü" className="flex flex-wrap gap-x-7 gap-y-1">
          {NAV_LINKS.map((link) => (
            <LinkLine
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-[15px] text-kaymak"
            >
              {link.label}
            </LinkLine>
          ))}
        </nav>
      </Container>

      <div
        aria-hidden="true"
        data-sk="text"
        className="mx-auto pt-6 text-center font-display text-[clamp(6rem,25vw,23rem)] leading-[.78] font-bold tracking-[-.065em] whitespace-nowrap"
      >
        Y<span className="text-filiz">â</span>ren
      </div>

      <Container>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-kaymak/16 pt-5 pb-7 font-mono text-xs leading-[normal] tracking-[.06em] text-krema">
          <span data-sk="text">© 2026 Yâren</span>
          <span data-sk="text">Hayali bir markadır · Aday çalışması</span>
        </div>
      </Container>
    </footer>
  )
}
