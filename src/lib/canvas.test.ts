import { coverRect } from './canvas'

const image = { width: 1920, height: 1080 }

describe('coverRect', () => {
  it('kutuyu boşluksuz doldurur (geniş kutu, dikey taşar)', () => {
    const box = { width: 1000, height: 400 }
    const r = coverRect(image, box, { focalX: 0.5, focalY: 0.5, zoom: 1 })
    expect(r.width).toBeCloseTo(1000)
    expect(r.height).toBeGreaterThanOrEqual(400)
    expect(r.x).toBeCloseTo(0)
    expect(r.y).toBeCloseTo((400 - r.height) / 2)
  })

  it('dar (dikey) kutuda yükseklik dolar, odak yatay konumu belirler', () => {
    const box = { width: 390, height: 844 }
    const center = coverRect(image, box, { focalX: 0.5, focalY: 0.5, zoom: 1 })
    expect(center.height).toBeCloseTo(844)
    expect(center.x).toBeCloseTo((390 - center.width) / 2)

    const right = coverRect(image, box, { focalX: 0.6, focalY: 0.5, zoom: 1 })
    expect(right.x).toBeGreaterThan(center.x)
  })

  it('odak ne olursa olsun kenarlar açılmaz', () => {
    const box = { width: 390, height: 844 }
    for (const focalX of [-1, 0, 1, 2]) {
      const r = coverRect(image, box, { focalX, focalY: 0.5, zoom: 1.1 })
      expect(r.x).toBeLessThanOrEqual(0)
      expect(r.x + r.width).toBeGreaterThanOrEqual(box.width - 1e-9)
      expect(r.y + r.height).toBeGreaterThanOrEqual(box.height - 1e-9)
    }
  })

  it('zoom görseli büyütür', () => {
    const box = { width: 1280, height: 800 }
    const base = coverRect(image, box, { focalX: 0.6, focalY: 0.5, zoom: 1 })
    const zoomed = coverRect(image, box, { focalX: 0.6, focalY: 0.5, zoom: 1.16 })
    expect(zoomed.width / base.width).toBeCloseTo(1.16)
  })
})
