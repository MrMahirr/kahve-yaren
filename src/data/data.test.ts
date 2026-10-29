import { MENU } from './menu'
import { NAV_LINKS, SECTION_IDS } from './navigation'
import { ESPRESSO_PHASES, FRAME_COUNT, HERO_PHASES, frameList, phaseAt } from './sequences'
import { STORY_STEPS } from './story'

describe('menu', () => {
  it('case study’nin istediği üç kahveyi içerir', () => {
    expect(MENU.map((item) => item.name)).toEqual(['Türk Kahvesi', 'Espresso', 'Filtre Kahve'])
  })

  it.each(MENU)('$name: varsayılan seçenek geçerli, görsel ve fiyat var', (item) => {
    expect(item.options[item.defaultOption]).toBeDefined()
    expect(item.image.src).toBeTruthy()
    expect(item.image.alt.length).toBeGreaterThan(10)
    item.options.forEach((option) => expect(option.price).toBeGreaterThan(0))
  })
})

describe('navigation', () => {
  it('her link bir bölüm id’sine gider', () => {
    const ids = Object.values(SECTION_IDS) as string[]
    NAV_LINKS.forEach((link) => expect(ids).toContain(link.href.slice(1)))
  })
})

describe('sequences', () => {
  it('kare adlarını iki haneli üretir', () => {
    const frames = frameList('tk')
    expect(frames).toHaveLength(FRAME_COUNT)
    expect(frames[0]).toBe('/frames/tk_01.webp')
    expect(frames[59]).toBe('/frames/tk_60.webp')
  })

  it('hero fazları orijinal eşiklerle değişir', () => {
    expect(phaseAt(HERO_PHASES, 0)).toBe(0)
    expect(phaseAt(HERO_PHASES, 11)).toBe(0)
    expect(phaseAt(HERO_PHASES, 12)).toBe(1)
    expect(phaseAt(HERO_PHASES, 35)).toBe(1)
    expect(phaseAt(HERO_PHASES, 36)).toBe(2)
    expect(phaseAt(HERO_PHASES, 59)).toBe(2)
  })

  it('espresso fazları orijinal eşiklerle değişir', () => {
    expect(phaseAt(ESPRESSO_PHASES, 19)).toBe(0)
    expect(phaseAt(ESPRESSO_PHASES, 20)).toBe(1)
    expect(phaseAt(ESPRESSO_PHASES, 42)).toBe(2)
  })
})

describe('story', () => {
  it('dört adım içerir ve son adım marka adıdır', () => {
    expect(STORY_STEPS).toHaveLength(4)
    expect(STORY_STEPS.at(-1)?.title).toBe('Yâren')
  })
})
