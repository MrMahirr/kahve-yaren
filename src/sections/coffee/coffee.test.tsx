import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MotionProvider } from '@/components/MotionProvider'
import { useContactTopic } from '@/features/coffee/contactTopic'
import { ContactTopicProvider } from '@/features/coffee/ContactTopicProvider'
import { CoffeeMenuSection } from './CoffeeMenuSection'

function TopicProbe() {
  const { topic } = useContactTopic()
  return <output data-testid="topic">{topic}</output>
}

function setup() {
  const user = userEvent.setup()
  render(
    <MotionProvider>
      <ContactTopicProvider>
        <CoffeeMenuSection />
        <TopicProbe />
      </ContactTopicProvider>
    </MotionProvider>,
  )
  const stage = () => screen.getByRole('figure')
  const row = (name: RegExp) => screen.getByRole('button', { name })
  return { user, stage, row }
}

describe('CoffeeMenuSection', () => {
  it('başlangıçta Türk Kahvesi · Orta seçili gelir', () => {
    const { stage, row } = setup()
    expect(within(stage()).getByText('Türk Kahvesi')).toBeInTheDocument()
    expect(within(stage()).getByText('₺95')).toBeInTheDocument()
    expect(row(/Türk Kahvesi/)).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /Orta/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Türk Kahvesi · Orta')).toBeInTheDocument()
  })

  it('üç kahvenin hepsi görsel, kısa açıklama ve fiyatla listelenir', () => {
    setup()
    expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(3)
    ;[
      'Köpüklü, yoğun; lokumla gelir',
      'Dolgun gövde, kalın krema',
      'Berrak, meyvemsi, uzun içim',
    ].forEach((text) => expect(screen.getByText(text)).toBeInTheDocument())
  })

  it('başka bir satıra tıklayınca sahne, akordeon ve özet güncellenir', async () => {
    const { user, stage, row } = setup()
    await user.click(row(/Espresso/))

    expect(row(/Espresso/)).toHaveAttribute('aria-expanded', 'true')
    expect(row(/Türk Kahvesi/)).toHaveAttribute('aria-expanded', 'false')
    expect(within(stage()).getByText('Espresso')).toBeInTheDocument()
    expect(within(stage()).getByText('₺85')).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByRole('group', { name: 'Şeker' })).not.toBeInTheDocument(),
    )
  })

  it('seçenek değişince fiyat ve özet güncellenir, satırlar arasında seçim korunur', async () => {
    const { user, stage, row } = setup()
    await user.click(row(/Espresso/))
    await user.click(screen.getByRole('button', { name: /Duble/ }))

    expect(screen.getByRole('button', { name: /Duble/ })).toHaveAttribute('aria-pressed', 'true')
    expect(within(stage()).getByText('₺110')).toBeInTheDocument()
    expect(screen.getByText('Espresso · Duble')).toBeInTheDocument()

    await user.click(row(/Filtre Kahve/))
    await user.click(row(/Espresso/))
    expect(screen.getByRole('button', { name: /Duble/ })).toHaveAttribute('aria-pressed', 'true')
  })

  it('"Bu kahve için yaz" seçimi form konusu yapar ve iletişime gider', async () => {
    const { user, row } = setup()
    await user.click(row(/Filtre Kahve/))
    await user.click(screen.getByRole('button', { name: /350 ml/ }))

    const ask = screen.getByRole('link', { name: /Bu kahve için yaz/ })
    expect(ask).toHaveAttribute('href', '#iletisim')
    await user.click(ask)
    expect(screen.getByTestId('topic')).toHaveTextContent('Filtre Kahve · 350 ml')
  })
})
