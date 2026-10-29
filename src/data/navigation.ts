export type NavLink = {
  href: `#${string}`
  label: string
  no: string
}

/** Bölüm id'leri orijinal tasarımla aynıdır; çapa linkleri bunlara bağlıdır. */
export const SECTION_IDS = {
  hero: 'ust',
  brew: 'demleme',
  story: 'hikaye',
  coffee: 'kahveler',
  contact: 'iletisim',
} as const

export const NAV_LINKS: NavLink[] = [
  { href: `#${SECTION_IDS.brew}`, label: 'Demleme', no: '01' },
  { href: `#${SECTION_IDS.story}`, label: 'Hikâye', no: '02' },
  { href: `#${SECTION_IDS.coffee}`, label: 'Kahveler', no: '03' },
  { href: `#${SECTION_IDS.contact}`, label: 'İletişim', no: '04' },
]

export const MARQUEE_WORDS: { text: string; emphasis?: boolean }[] = [
  { text: 'Türk Kahvesi' },
  { text: 'Espresso' },
  { text: 'Filtre' },
  { text: 'Cezve', emphasis: true },
  { text: 'Köpük' },
  { text: 'Krema' },
  { text: 'Sohbet', emphasis: true },
]
