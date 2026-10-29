import * as z from 'zod/mini'
import { contactSchema, errorSummary, firstName, topicMessage } from './contactSchema'

const valid = { name: 'Ayşe Yılmaz', email: 'ayse@alanadi.com', message: 'Merhaba!' }

const errorsOf = (values: typeof valid) => {
  const result = contactSchema.safeParse(values)
  return result.success ? {} : z.flattenError(result.error).fieldErrors
}

describe('contactSchema', () => {
  it('geçerli değerleri kabul eder', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('boş alanlar için orijinal hata metinlerini verir', () => {
    expect(errorsOf({ name: '', email: '', message: '' })).toEqual({
      name: ['Lütfen adınızı yazın.'],
      email: ['E-posta adresinizi yazın.'],
      message: ['Mesaj alanı boş bırakılamaz.'],
    })
  })

  it('yalnızca boşluktan oluşan değerleri boş sayar', () => {
    expect(errorsOf({ ...valid, name: '   ', message: '\n\t' })).toEqual({
      name: ['Lütfen adınızı yazın.'],
      message: ['Mesaj alanı boş bırakılamaz.'],
    })
  })

  it.each(['ayse', 'ayse@', 'ayse@alanadi', 'ayse@alanadi.c', 'ay se@alanadi.com', '@alanadi.com'])(
    'geçersiz e-posta: %s',
    (email) => {
      expect(errorsOf({ ...valid, email }).email).toEqual([
        'Geçerli bir e-posta girin, ör. ad@alanadi.com',
      ])
    },
  )

  it.each(['ad@alanadi.com', 'a.b+c@mail.alanadi.com.tr', '  ad@alanadi.co  '])(
    'geçerli e-posta: %s',
    (email) => {
      expect(errorsOf({ ...valid, email }).email).toBeUndefined()
    },
  )

  it('500 karakterden uzun mesajı reddeder', () => {
    expect(errorsOf({ ...valid, message: 'a'.repeat(501) }).message).toBeDefined()
    expect(errorsOf({ ...valid, message: 'a'.repeat(500) }).message).toBeUndefined()
  })
})

describe('yardımcılar', () => {
  it('hata özetini tekil ve çoğul yazar', () => {
    expect(errorSummary(1)).toBe('Lütfen işaretli alanı kontrol edin.')
    expect(errorSummary(3)).toBe('Lütfen işaretli 3 alanı kontrol edin.')
  })

  it('ilk adı alır', () => {
    expect(firstName('  Ayşe   Yılmaz ')).toBe('Ayşe')
  })

  it('konu şablonunu üretir', () => {
    expect(topicMessage('Espresso · Duble')).toBe(
      'Merhaba, Espresso · Duble hakkında bilgi almak istiyorum.',
    )
  })
})
