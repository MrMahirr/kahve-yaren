import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MotionProvider } from '@/components/MotionProvider'
import { ContactTopicProvider } from '@/features/coffee/ContactTopicProvider'
import { CoffeeMenuSection } from '@/sections/coffee/CoffeeMenuSection'
import { ContactSection } from './ContactSection'

function setup() {
  const user = userEvent.setup()
  render(
    <MotionProvider>
      <ContactTopicProvider>
        <CoffeeMenuSection />
        <ContactSection />
      </ContactTopicProvider>
    </MotionProvider>,
  )
  const name = () => screen.getByLabelText('Adınız')
  const email = () => screen.getByLabelText('E-posta')
  const message = () => screen.getByLabelText('Mesajınız')
  const submit = () => user.click(screen.getByRole('button', { name: /Mesajı Gönder/ }))
  return { user, name, email, message, submit }
}

describe('ContactSection', () => {
  it('ad, e-posta ve mesaj alanlarını etiketleriyle gösterir', () => {
    const { name, email, message } = setup()
    expect(name()).toHaveAttribute('type', 'text')
    expect(email()).toHaveAttribute('type', 'email')
    expect(message().tagName).toBe('TEXTAREA')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('boş gönderimde üç hata, özet ve ilk alana odak', async () => {
    const { name, email, message, submit } = setup()
    await submit()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Lütfen işaretli 3 alanı kontrol edin.',
    )
    expect(name()).toHaveAttribute('aria-invalid', 'true')
    expect(name()).toHaveAccessibleDescription('Lütfen adınızı yazın.')
    expect(email()).toHaveAccessibleDescription('E-posta adresinizi yazın.')
    expect(message()).toHaveAccessibleDescription('Mesaj alanı boş bırakılamaz.')
    expect(name()).toHaveFocus()
  })

  it('ilk gönderimden sonra yazdıkça hatalar canlı olarak düzelir', async () => {
    const { user, name, email, submit } = setup()
    await submit()
    await user.type(name(), 'Ayşe')
    expect(name()).toHaveAttribute('aria-invalid', 'false')
    expect(screen.getByRole('alert')).toHaveTextContent('Lütfen işaretli 2 alanı kontrol edin.')

    await user.type(email(), 'ayse@')
    expect(email()).toHaveAccessibleDescription('Geçerli bir e-posta girin, ör. ad@alanadi.com')
  })

  it('karakter sayacı mesaj uzunluğunu gösterir', async () => {
    const { user, message } = setup()
    await user.type(message(), 'Merhaba')
    expect(screen.getByText('7 / 500')).toBeInTheDocument()
    expect(message()).toHaveAttribute('maxlength', '500')
  })

  it('geçerli gönderimde başarı mesajı, ilk ad ve odak; yeni mesaja dönülebilir', async () => {
    const { user, name, email, message, submit } = setup()
    await user.type(name(), 'Ayşe Yılmaz')
    await user.type(email(), 'ayse@alanadi.com')
    await user.type(message(), 'Toplu sipariş vermek istiyorum.')
    await submit()

    const status = await screen.findByRole('status')
    expect(within(status).getByText('Mesajın bize ulaştı.')).toBeInTheDocument()
    expect(status).toHaveTextContent('Teşekkürler Ayşe.')
    expect(status).toHaveFocus()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Yeni mesaj yaz' }))
    expect(await screen.findByLabelText('Adınız')).toHaveValue('')
    expect(screen.getByLabelText('Adınız')).toHaveFocus()
  })

  it('menüden gelen konu çip olarak görünür, boş mesajı doldurur ve kaldırılabilir', async () => {
    const { user, message } = setup()
    await user.click(screen.getByRole('button', { name: /Espresso/ }))
    await user.click(screen.getByRole('button', { name: /Duble/ }))
    await user.click(screen.getByRole('link', { name: /Bu kahve için yaz/ }))

    expect(screen.getByText('Konu: Espresso · Duble')).toBeInTheDocument()
    expect(message()).toHaveValue('Merhaba, Espresso · Duble hakkında bilgi almak istiyorum.')

    await user.click(screen.getByRole('button', { name: 'Konuyu kaldır' }))
    expect(screen.queryByText(/Konu:/)).not.toBeInTheDocument()
  })

  it('yazılmış bir mesajın üzerine konu şablonu yazılmaz', async () => {
    const { user, message } = setup()
    await user.type(message(), 'Kendi mesajım')
    await user.click(screen.getByRole('link', { name: /Bu kahve için yaz/ }))
    expect(message()).toHaveValue('Kendi mesajım')
    expect(screen.getByText('Konu: Türk Kahvesi · Orta')).toBeInTheDocument()
  })

  it('konu başarı ekranında görünür; yeni bir konu seçilince forma dönülür', async () => {
    const { user, name, email, submit } = setup()
    await user.click(screen.getByRole('link', { name: /Bu kahve için yaz/ }))
    await user.type(name(), 'Ayşe')
    await user.type(email(), 'ayse@alanadi.com')
    await submit()

    const status = await screen.findByRole('status')
    expect(within(status).getByText('Konu: Türk Kahvesi · Orta')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /Bu kahve için yaz/ }))
    expect(await screen.findByRole('form', { name: 'İletişim formu' })).toBeInTheDocument()
    expect(screen.getByText('Konu: Türk Kahvesi · Orta')).toBeInTheDocument()
  })
})
