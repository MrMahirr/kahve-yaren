import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { canvasBrightness, collectErrors, scrollTo } from './helpers'

test.describe('Yâren — duman testleri', () => {
  test('sayfa hatasız açılır ve case study içeriğinin tamamı vardır', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/')

    // R1–R2: marka, slogan, "Kahveleri Keşfet"
    await expect(page.getByRole('link', { name: 'Yâren ana sayfa' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Her fincanda ortak bir hikâye.',
    )
    await expect(
      page.locator('#ust').getByRole('link', { name: /Kahveleri Keşfet/ }),
    ).toHaveAttribute('href', '#kahveler')
    // R3: üç kahve, görsel, kısa açıklama, fiyat
    const menu = page.locator('#kahveler')
    for (const name of ['Türk Kahvesi', 'Espresso', 'Filtre Kahve']) {
      await expect(menu.getByRole('button', { name: new RegExp(name) })).toBeVisible()
    }
    await expect(menu.locator('img')).toHaveCount(3)
    // R4: form alanları
    for (const label of ['Adınız', 'E-posta', 'Mesajınız']) {
      await expect(page.getByLabel(label)).toBeVisible()
    }
    expect(errors).toEqual([])
  })

  test('hiçbir genişlikte yatay taşma yoktur', async ({ page }) => {
    test.slow() // dokuz genişlik tek testte
    for (const width of [360, 390, 430, 560, 720, 768, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 860 })
      await page.goto('/')
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow, `${width}px`).toBeLessThanOrEqual(0)
    }
  })

  test('kare dizileri ve telve parçacıkları kaydırınca çizilir', async ({ page }) => {
    await page.goto('/')
    await expect.poll(() => canvasBrightness(page, '#ust canvas')).toBeGreaterThan(60)

    await scrollTo(page, '#demleme', 600) // tembel yüklenir
    await expect.poll(() => canvasBrightness(page, '#demleme canvas')).toBeGreaterThan(60)

    await scrollTo(page, '#hikaye', 400)
    await expect.poll(() => canvasBrightness(page, '#hikaye canvas')).toBeGreaterThan(60)
  })

  test('hero zaman çizelgesi kaydırmayla ilerler', async ({ page }) => {
    await page.goto('/')
    const time = page.locator('#ust').getByText(/sn$/).locator('span')
    await expect(time).toHaveText('0.0')
    await scrollTo(page, '#ust', 1200)
    await expect.poll(async () => Number(await time.textContent())).toBeGreaterThan(2)
  })

  test('kahve seçimi forma konu olarak taşınır ve form gönderilir', async ({ page }) => {
    await page.goto('/')
    const menu = page.locator('#kahveler')
    await menu.getByRole('button', { name: /Espresso/ }).click()
    await menu.getByRole('button', { name: /Duble/ }).click()
    await expect(menu.getByRole('figure')).toContainText('₺110')
    await menu.getByRole('link', { name: /Bu kahve için yaz/ }).click()

    await expect(page.getByText('Konu: Espresso · Duble')).toBeVisible()
    await expect(page.getByLabel('Mesajınız')).toHaveValue(
      'Merhaba, Espresso · Duble hakkında bilgi almak istiyorum.',
    )

    // R5: boş ve hatalı alanlar
    await page.getByRole('button', { name: /Mesajı Gönder/ }).click()
    await expect(page.getByRole('alert')).toHaveText('Lütfen işaretli 2 alanı kontrol edin.')
    await expect(page.getByLabel('Adınız')).toBeFocused()
    await page.getByLabel('Adınız').fill('Ayşe Yılmaz')
    await page.getByLabel('E-posta').fill('ayse@alanadi')
    await expect(page.getByText('Geçerli bir e-posta girin, ör. ad@alanadi.com')).toBeVisible()
    await page.getByLabel('E-posta').fill('ayse@alanadi.com')

    // R6: başarı mesajı
    await page.getByRole('button', { name: /Mesajı Gönder/ }).click()
    const status = page.getByRole('status')
    await expect(status).toContainText('Teşekkürler Ayşe.')
    await expect(status).toContainText('Konu: Espresso · Duble')
    await expect(status).toBeFocused()
  })

  test('klavyeyle ilk odak logo linkidir ve odak halkası görünür', async ({ page, isMobile }) => {
    test.skip(isMobile, 'klavye gezintisi masaüstünde denenir')
    await page.goto('/')
    // Menü yüklenirken iskelettir ve inert'tir; odak alabilmesi için hazır olmalı.
    await expect(page.locator('header')).not.toHaveAttribute('data-loading')
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toHaveAccessibleName('Yâren ana sayfa')
    const outline = await focused.evaluate((el) => getComputedStyle(el).outlineStyle)
    expect(outline).toBe('solid')
  })

  test('hareket azaltılmışsa CSS animasyonları durur', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const animation = await page
      .locator('[aria-hidden="true"] > .animate-marquee')
      .evaluate((el) => getComputedStyle(el).animationName)
    expect(animation).toBe('none')
  })

  test('erişilebilirlik: axe ciddi veya kritik ihlal bulmaz', async ({ page }) => {
    await page.goto('/')
    // İskeletteki saydam metin kontrast ölçümünü anlamsız kılar: tüm bölümler açılsın.
    for (const id of ['demleme', 'kahveler', 'iletisim']) await scrollTo(page, `#${id}`)
    await expect(page.locator('[data-loading]')).toHaveCount(0)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    // Giriş animasyonları (yarı saydam → görünür) bitmeden ölçülürse kontrast yanlış düşük çıkar.
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter(
            (animation) =>
              // Kaydırmaya bağlı (view timeline) ve sonsuz animasyonlar hiç bitmez.
              animation.timeline === document.timeline &&
              animation.effect?.getTiming().iterations !== Infinity,
          )
          .map((animation) => animation.finished),
      ),
    )
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(
      serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
    ).toEqual([])
  })
})

test.describe('Skeleton', () => {
  test('görseller gecikince bölümler iskelet olur, gelince açılır ve düzen kaymaz', async ({
    page,
  }) => {
    await page.route(/\.webp(\?.*)?$/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 4000))
      await route.continue().catch(() => {})
    })
    await page.goto('/')
    const hero = page.locator('#ust')
    await expect(hero).toHaveAttribute('data-loading', 'dark')
    await expect(hero).toHaveAttribute('aria-busy', 'true')

    const heights = () =>
      page.evaluate(() =>
        ['#ust', '#demleme', '#hikaye', '#kahveler', '#iletisim'].map(
          (s) => document.querySelector(s)!.getBoundingClientRect().height,
        ),
      )
    // Fontlar gelmeden ölçülürse yedek fonttan geçiş yükseklikleri değiştirir (iskeletten bağımsız).
    // Menü yalnızca fontları bekler: hazırsa fontlar yüklenmiştir, görseller hâlâ gecikmededir.
    await expect(page.locator('header')).not.toHaveAttribute('data-loading')
    const before = await heights()

    await expect(hero).not.toHaveAttribute('data-loading', { timeout: 10_000 })
    for (const id of ['demleme', 'kahveler', 'iletisim']) {
      await scrollTo(page, `#${id}`)
      await expect(page.locator(`#${id}`)).not.toHaveAttribute('data-loading', { timeout: 10_000 })
    }
    expect(await heights()).toEqual(before)
  })
})

test.describe('Ekran oranları', () => {
  // 16:10, 16:9, 21:9, 4:3, dikey tablet, uzun ve kısa telefon, yatay telefon
  const VIEWPORTS = [
    [1920, 1200],
    [2560, 1600],
    [1366, 768],
    [3440, 1440],
    [1024, 768],
    [1024, 1366],
    [430, 932],
    [360, 640],
    [844, 390],
    [667, 375],
  ] as const

  test('kare dizisi sahneleri görünür alanı tam doldurur, metin menünün altına girmez', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'ekran boyutları elle ayarlanıyor; masaüstü projesinde bir kez yeterli')
    test.slow() // on ekran boyutu tek testte
    for (const [width, height] of VIEWPORTS) {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      for (const id of ['ust', 'demleme']) {
        await scrollTo(page, `#${id}`, 300)
        const fit = await page.evaluate((id) => {
          const stage = document.getElementById(id)!.firstElementChild!
          const copy = stage.querySelector('.container-site')!.firstElementChild!
          const nav = document.querySelector('header')!.getBoundingClientRect().height
          const s = stage.getBoundingClientRect()
          const c = copy.getBoundingClientRect()
          return {
            gap: Math.round(window.innerHeight - s.bottom),
            underNav: Math.round(nav - c.top),
            overflow: Math.round(c.bottom - s.bottom),
          }
        }, id)
        const label = `${width}×${height} #${id}`
        expect(fit.gap, `${label}: sahnenin altında boşluk`).toBeLessThanOrEqual(0)
        expect(fit.underNav, `${label}: metin menünün altında`).toBeLessThanOrEqual(0)
        expect(fit.overflow, `${label}: metin sahneden taşıyor`).toBeLessThanOrEqual(0)
      }
      await scrollTo(page, '#hikaye', 500)
      const storyCut = await page.evaluate(
        () =>
          document.querySelector('#hikaye .sticky')!.getBoundingClientRect().bottom -
          window.innerHeight,
      )
      expect(storyCut, `${width}×${height}: hikâye sahnesi kesik`).toBeLessThanOrEqual(0)
    }
  })
})

test.describe('Gezinme', () => {
  test('masaüstü menü linki bölüme kaydırır', async ({ page, isMobile }) => {
    test.skip(isMobile, 'masaüstü menüsü')
    await page.goto('/')
    await page
      .getByRole('navigation', { name: 'Ana menü' })
      .getByRole('link', { name: 'Kahveler' })
      .click()
    await expect(page).toHaveURL(/#kahveler$/)
    await expect(page.locator('#kahveler h2')).toBeInViewport()
  })

  test('mobil menü açılır, linke tıklayınca kapanır ve bölüme gider', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'mobil menü')
    await page.goto('/')
    await page.getByRole('button', { name: 'Menüyü aç' }).click()
    const panel = page.getByRole('navigation', { name: 'Mobil menü' })
    await expect(panel).toBeVisible()
    await panel.getByRole('link', { name: /İletişim/ }).click()
    await expect(panel).toBeHidden()
    await expect(page).toHaveURL(/#iletisim$/)
  })
})
