import { createParticles, morphAt } from './particleSystem'
import { beanShape, cupShape, vortexShape, type Point } from './shapes'

/** Tekrarlanabilir sözde rastgele sayı (mulberry32). */
function seeded(seed = 42) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const withinUnit = (points: Point[], limit = 1.1) =>
  points.every((p) => Math.abs(p.x) <= limit && Math.abs(p.y) <= limit)

describe('şekiller', () => {
  it.each([
    ['çekirdek', beanShape],
    ['girdap', vortexShape],
    ['fincan', cupShape],
  ])('%s istenen sayıda, birim alanda nokta üretir', (_, shape) => {
    const points = shape(500, seeded())
    expect(points).toHaveLength(500)
    expect(withinUnit(points)).toBe(true)
  })

  it('aynı tohumla aynı şekli üretir', () => {
    expect(beanShape(50, seeded(7))).toEqual(beanShape(50, seeded(7)))
  })
})

describe('createParticles', () => {
  it('her parçacık kendi şekil noktasını gösterir ve renge göre sıralıdır', () => {
    const particles = createParticles(300, seeded())
    expect(new Set(particles.map((p) => p.i)).size).toBe(300)
    const colors = particles.map((p) => p.color)
    expect(colors).toEqual([...colors].sort((a, b) => a - b))
  })
})

describe('morphAt', () => {
  it('başta çekirdek, sonda yazı adımındadır', () => {
    expect(morphAt(0)).toMatchObject({ from: 0, to: 1, amount: 0, step: 0 })
    expect(morphAt(1)).toMatchObject({ from: 3, to: 3, step: 3 })
  })

  it('her adımın başı sabit bekler, ortasında geçiş olur', () => {
    const third = 1 / 3
    expect(morphAt(third * 0.2).amount).toBe(0) // ilk %25 bekleme
    expect(morphAt(third * 0.525).amount).toBeCloseTo(0.5) // geçişin ortası
    expect(morphAt(third * 0.9).amount).toBe(1) // son %20 bekleme
  })

  it('baskın adım geçişin yarısında değişir', () => {
    const third = 1 / 3
    expect(morphAt(third * 0.5).step).toBe(0)
    expect(morphAt(third * 0.6).step).toBe(1)
    expect(morphAt(third * 1.6).step).toBe(2)
    expect(morphAt(third * 2.6).step).toBe(3)
  })
})
