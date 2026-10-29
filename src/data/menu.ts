import espressoImg from '@/assets/img/espresso.webp'
import filtreImg from '@/assets/img/filtre.webp'
import turkImg from '@/assets/img/turk.webp'

export type CoffeeOption = {
  label: string
  price: number
}

export type CoffeeItem = {
  id: 'turk' | 'espresso' | 'filtre'
  no: string
  name: string
  tag: string
  method: string
  short: string
  desc: string
  optionLabel: string
  options: CoffeeOption[]
  defaultOption: number
  image: { src: string; alt: string; position: string }
}

/** Fiyatlar örnek amaçlıdır. */
export const MENU: CoffeeItem[] = [
  {
    id: 'turk',
    no: '01',
    name: 'Türk Kahvesi',
    tag: 'Geleneksel',
    method: 'Cezve · 70 ml',
    short: 'Köpüklü, yoğun; lokumla gelir',
    desc: 'Bakır cezvede, kısık ateşte pişer. Pirinç tepside; yanında bir bardak su ve lokumla servis edilir.',
    optionLabel: 'Şeker',
    options: [
      { label: 'Sade', price: 95 },
      { label: 'Orta', price: 95 },
      { label: 'Şekerli', price: 95 },
    ],
    defaultOption: 1,
    image: {
      src: turkImg,
      alt: 'Pirinç tepside köpüklü Türk kahvesi, bakır cezve, bir bardak su ve lokum',
      position: '50% 62%',
    },
  },
  {
    id: 'espresso',
    no: '02',
    name: 'Espresso',
    tag: 'Yoğun',
    method: 'Portafiltre · 30 ml',
    short: 'Dolgun gövde, kalın krema',
    desc: 'Taze öğütülmüş çekirdek, yirmi beş saniyelik demleme. Fındıksı notalar ve ipeksi, kalın bir krema.',
    optionLabel: 'Shot',
    options: [
      { label: 'Tek', price: 85 },
      { label: 'Duble', price: 110 },
    ],
    defaultOption: 0,
    image: {
      src: espressoImg,
      alt: 'Ahşap masada koyu seramik fincanda kremalı espresso ve bir bardak maden suyu',
      position: '58% 58%',
    },
  },
  {
    id: 'filtre',
    no: '03',
    name: 'Filtre Kahve',
    tag: 'Demleme',
    method: 'V60 · Elle demleme',
    short: 'Berrak, meyvemsi, uzun içim',
    desc: 'Seramik V60 ile yavaş dökülerek demlenir. Berrak, meyvemsi ve uzun bir içim; güne sakin başlamak için.',
    optionLabel: 'Boy',
    options: [
      { label: '250 ml', price: 110 },
      { label: '350 ml', price: 130 },
    ],
    defaultOption: 0,
    image: {
      src: filtreImg,
      alt: 'Seramik V60 demleme ekipmanı, cam sürahi ve bir kupa filtre kahve',
      position: '55% 60%',
    },
  },
]
