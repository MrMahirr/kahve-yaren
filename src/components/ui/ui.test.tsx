import { render, screen } from '@testing-library/react'
import { Button, ButtonLink } from './Button'
import { Eyebrow } from './Eyebrow'

describe('Button', () => {
  it('varsayılan olarak type="button" ve primary görünümle gelir', () => {
    render(<Button>Gönder</Button>)
    const button = screen.getByRole('button', { name: 'Gönder' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('bg-zeytin')
  })

  it('outline varyantı yüksekliği ve boyutu ezer', () => {
    render(<Button variant="outline">Yeni mesaj yaz</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-12', 'border-telve')
    expect(button).not.toHaveClass('h-14')
  })

  it('ButtonLink bir çapa linki üretir', () => {
    render(<ButtonLink href="#kahveler">Kahveleri Keşfet</ButtonLink>)
    expect(screen.getByRole('link', { name: 'Kahveleri Keşfet' })).toHaveAttribute(
      'href',
      '#kahveler',
    )
  })
})

describe('Eyebrow', () => {
  it('tona göre renk sınıfı seçer', () => {
    render(<Eyebrow tone="light">01 — Hikâye</Eyebrow>)
    expect(screen.getByText('01 — Hikâye')).toHaveClass('eyebrow', 'text-filiz')
  })
})
