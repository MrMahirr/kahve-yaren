/** Kaydırmaya bağlı kare dizilerinin verisi (public/frames). */
export const FRAME_COUNT = 60

export type FramePrefix = 'tk' | 'es'

export const frameList = (prefix: FramePrefix, count = FRAME_COUNT) =>
  Array.from(
    { length: count },
    (_, i) => `${import.meta.env.BASE_URL}frames/${prefix}_${String(i + 1).padStart(2, '0')}.webp`,
  )

export type Phase = {
  name: string
  /** Bu fazın bittiği kare indeksi (dahil değil). Son faz için Infinity. */
  until: number
}

export const HERO_PHASES: Phase[] = [
  { name: 'Cezve ısınır', until: 12 },
  { name: 'Kahve süzülür', until: 36 },
  { name: 'Köpük toplanır', until: Infinity },
]

export const ESPRESSO_PHASES: Phase[] = [
  { name: 'Basınç', until: 20 },
  { name: 'Akış', until: 42 },
  { name: 'Krema', until: Infinity },
]

/** Kare indeksine karşılık gelen fazın sırası. */
export const phaseAt = (phases: Phase[], frameIndex: number) =>
  phases.findIndex((phase) => frameIndex < phase.until)
