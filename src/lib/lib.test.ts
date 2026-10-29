import { cn } from './cn'
import { clamp, lerp, smoothstep } from './math'

describe('math', () => {
  it('clamp değeri sınırlar arasında tutar', () => {
    expect(clamp(-0.2)).toBe(0)
    expect(clamp(1.4)).toBe(1)
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('lerp iki değer arasında doğrusal geçiş yapar', () => {
    expect(lerp(10, 20, 0.5)).toBe(15)
  })

  it('smoothstep uçlarda düz, ortada simetrik', () => {
    expect(smoothstep(0)).toBe(0)
    expect(smoothstep(1)).toBe(1)
    expect(smoothstep(0.5)).toBe(0.5)
    expect(smoothstep(2)).toBe(1)
  })
})

describe('cn', () => {
  it('çakışan Tailwind sınıflarında sonuncuyu bırakır', () => {
    expect(cn('h-14 px-7', 'h-12 px-[22px]')).toBe('h-12 px-[22px]')
  })

  it('marka renkleri ile yazı boyutunu birbirine karıştırmaz', () => {
    expect(cn('text-[15px] text-telve', 'text-kaymak')).toBe('text-[15px] text-kaymak')
  })

  it('özel text-outline sınıflarını yazı rengiyle karıştırmaz', () => {
    const classes = cn('text-[72px] text-outline', 'text-outline-color-filiz').split(' ')
    expect(classes).toEqual(
      expect.arrayContaining(['text-outline', 'text-[72px]', 'text-outline-color-filiz']),
    )
    expect(classes).toHaveLength(3)
    expect(cn('text-outline-color-findik', 'text-outline-color-filiz')).toBe(
      'text-outline-color-filiz',
    )
  })

  it('koşullu sınıfları atlar', () => {
    const open: boolean = false
    expect(cn('row', open && 'is-open', undefined)).toBe('row')
  })
})
