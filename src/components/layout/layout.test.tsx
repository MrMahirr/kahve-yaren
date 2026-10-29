import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MotionProvider } from '@/components/MotionProvider'
import { MARQUEE_WORDS, NAV_LINKS } from '@/data/navigation'
import { Footer } from './Footer'
import { Marquee } from './Marquee'
import { Navbar } from './Navbar'

const renderNavbar = () =>
  render(
    <MotionProvider>
      <Navbar />
    </MotionProvider>,
  )

describe('Navbar', () => {
  it('masaüstü menüsünde tüm bölüm linkleri var', () => {
    renderNavbar()
    const nav = screen.getByRole('navigation', { name: 'Ana menü' })
    NAV_LINKS.forEach((link) =>
      expect(within(nav).getByRole('link', { name: link.label })).toHaveAttribute(
        'href',
        link.href,
      ),
    )
  })

  it('burger mobil menüyü açar ve kapatır', async () => {
    const user = userEvent.setup()
    renderNavbar()
    const burger = screen.getByRole('button', { name: 'Menüyü aç' })
    expect(burger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: 'Mobil menü' })).not.toBeInTheDocument()

    await user.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'true')
    expect(burger).toHaveAccessibleName('Menüyü kapat')
    expect(screen.getByRole('navigation', { name: 'Mobil menü' })).toBeInTheDocument()

    await user.click(burger)
    await waitFor(() =>
      expect(screen.queryByRole('navigation', { name: 'Mobil menü' })).not.toBeInTheDocument(),
    )
  })

  it('Escape tuşu menüyü kapatır', async () => {
    const user = userEvent.setup()
    renderNavbar()
    await user.click(screen.getByRole('button', { name: 'Menüyü aç' }))
    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Menüyü aç' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('mobil menüde bir linke tıklayınca menü kapanır', async () => {
    const user = userEvent.setup()
    renderNavbar()
    await user.click(screen.getByRole('button', { name: 'Menüyü aç' }))
    const panel = screen.getByRole('navigation', { name: 'Mobil menü' })
    await user.click(within(panel).getByRole('link', { name: 'Kahveleri Keşfet' }))
    await waitFor(() =>
      expect(screen.queryByRole('navigation', { name: 'Mobil menü' })).not.toBeInTheDocument(),
    )
  })
})

describe('Marquee', () => {
  it('kesintisiz döngü için kelimeleri iki kez çizer ve ekran okuyucudan gizlenir', () => {
    const { container } = render(<Marquee />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.textContent?.split(MARQUEE_WORDS[0].text)).toHaveLength(3)
  })
})

describe('Footer', () => {
  it('alt menüyü ve telif satırını içerir', () => {
    render(<Footer />)
    const nav = screen.getByRole('navigation', { name: 'Alt menü' })
    expect(within(nav).getAllByRole('link')).toHaveLength(NAV_LINKS.length)
    expect(screen.getByText('© 2026 Yâren')).toBeInTheDocument()
  })
})
