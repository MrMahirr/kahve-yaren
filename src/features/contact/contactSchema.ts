// zod/mini: aynı kurallar, klasik API'nin yaklaşık dörtte biri boyutunda (≈6 KB yerine ≈25 KB).
// Kontroller sırayla çalışır; trim() her alanda ilk sırada olmalıdır.
import * as z from 'zod/mini'

export const MESSAGE_MAX = 500

/** Orijinal tasarımdaki kural: boşluksuz yerel kısım, @, alan adı ve en az iki harfli uzantı. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Hata metinleri orijinal tasarımla birebir aynıdır.
export const contactSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(1, 'Lütfen adınızı yazın.')),
  email: z.string().check(
    z.trim(),
    // Boşsa biçim kontrolüne geçilmez; tek ve doğru hata gösterilir.
    z.minLength(1, { error: 'E-posta adresinizi yazın.', abort: true }),
    z.regex(EMAIL_PATTERN, 'Geçerli bir e-posta girin, ör. ad@alanadi.com'),
  ),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, 'Mesaj alanı boş bırakılamaz.'),
      z.maxLength(MESSAGE_MAX, `Mesaj en fazla ${MESSAGE_MAX} karakter olabilir.`),
    ),
})

export type ContactValues = z.infer<typeof contactSchema>

/** Menüden konu gelince boş mesaj alanına yazılan şablon. */
export const topicMessage = (topic: string) => `Merhaba, ${topic} hakkında bilgi almak istiyorum.`

/** Hata özetinin metni: "Lütfen işaretli alanı / 2 alanı kontrol edin." */
export const errorSummary = (count: number) =>
  `Lütfen işaretli ${count === 1 ? 'alanı' : `${count} alanı`} kontrol edin.`

/** Başarı mesajında hitap için adın ilk kelimesi. */
export const firstName = (name: string) => name.trim().split(/\s+/)[0]
