import { render, screen } from '@testing-library/react'
import { BrewSection } from './brew/BrewSection'
import { HeroSection } from './hero/HeroSection'
import { StorySection } from './story/StorySection'

describe('HeroSection', () => {
  it('marka sloganını, "Kahveleri Keşfet" butonunu ve açıklamalı videoyu içerir', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Her fincanda ortak bir hikâye.',
    )
    expect(screen.getByRole('link', { name: /Kahveleri Keşfet/ })).toHaveAttribute(
      'href',
      '#kahveler',
    )
    expect(screen.getByRole('img', { name: /Türk kahvesi dökülüyor/ }).tagName).toBe('CANVAS')
  })
})

describe('BrewSection', () => {
  it('başlığı ve espresso videosunu içerir', () => {
    render(<BrewSection />)
    // <br> metin içinde boşluk üretmez; başlık iki satırdır.
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /^Aynı sabır,\s*dokuz bar basınçla\.$/,
    )
    expect(screen.getByRole('img', { name: /espresso akıyor/ })).toBeInTheDocument()
  })
})

describe('StorySection', () => {
  it('dört adımı çizer, ilk adım etkin başlar', () => {
    render(<StorySection />)
    const steps = screen.getAllByRole('article')
    expect(steps).toHaveLength(4)
    expect(steps[0]).toHaveClass('opacity-100')
    expect(steps[1]).toHaveClass('opacity-60')
    expect(screen.getByText('Telve · Çekirdek')).toBeInTheDocument()
  })
})
