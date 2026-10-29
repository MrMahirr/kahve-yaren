import type { Page } from '@playwright/test'

/** Konsol hatalarını ve yakalanmamış istisnaları toplar. */
export function collectErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

/** Bir öğeyi sayfanın üstüne kaydırır (yumuşak kaydırma kapalı) ve çizim için bekler. */
export async function scrollTo(page: Page, selector: string, offset = 0) {
  await page.evaluate(
    ({ selector, offset }) => {
      const element = document.querySelector(selector)
      if (!element) throw new Error(`${selector} bulunamadı`)
      const top = element.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior: 'instant' })
    },
    { selector, offset },
  )
  await page.waitForTimeout(600)
}

/**
 * Canvas'ın ortasındaki piksellerin ortalama parlaklığı (0..765).
 * Boş (yalnızca zemin renginde) bir canvas için çok düşük bir değer döner.
 */
export function canvasBrightness(page: Page, selector: string) {
  return page.evaluate((selector) => {
    const canvas = document.querySelector<HTMLCanvasElement>(selector)
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !canvas.width) return 0
    const size = 40
    const { data } = ctx.getImageData(
      canvas.width / 2 - size / 2,
      canvas.height / 2 - size / 2,
      size,
      size,
    )
    let sum = 0
    for (let i = 0; i < data.length; i += 4) sum += data[i] + data[i + 1] + data[i + 2]
    return sum / (data.length / 4)
  }, selector)
}
