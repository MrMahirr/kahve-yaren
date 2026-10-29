import { act, render, screen, waitFor } from '@testing-library/react'
import { useRef } from 'react'
import { skeletonProps } from '@/lib/skeleton'
import { useAssetsReady } from './useAssetsReady'

function Probe({ images = ['/a.webp'], defer = false }: { images?: string[]; defer?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const ready = useAssetsReady({ images, deferUntilNear: defer ? ref : undefined })
  return (
    <section ref={ref} data-testid="bolum" {...skeletonProps(ready, 'dark')}>
      <h2 data-sk="text">Başlık</h2>
    </section>
  )
}

describe('useAssetsReady + skeletonProps', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('görsel çözülene kadar bölüm iskelettir, sonra açılır', async () => {
    let resolve = () => {}
    vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(
      () => new Promise<void>((r) => (resolve = r)),
    )
    render(<Probe />)
    const section = screen.getByTestId('bolum')
    expect(section).toHaveAttribute('data-loading', 'dark')
    expect(section).toHaveAttribute('aria-busy', 'true')
    expect(section).toHaveAttribute('inert')

    await act(async () => resolve())
    expect(section).not.toHaveAttribute('data-loading')
    expect(section).toHaveAttribute('aria-busy', 'false')
    expect(section).not.toHaveAttribute('inert')
  })

  it('görsel yüklenemezse de içerik gösterilir', async () => {
    vi.spyOn(HTMLImageElement.prototype, 'decode').mockRejectedValue(new Error('404'))
    render(<Probe />)
    await waitFor(() => expect(screen.getByTestId('bolum')).not.toHaveAttribute('data-loading'))
  })

  it('ağ takılırsa en geç 8 saniye sonra içerik gösterilir', async () => {
    vi.useFakeTimers()
    vi.spyOn(HTMLImageElement.prototype, 'decode').mockReturnValue(new Promise(() => {}))
    render(<Probe />)
    expect(screen.getByTestId('bolum')).toHaveAttribute('data-loading')
    await act(async () => vi.advanceTimersByTime(8000))
    expect(screen.getByTestId('bolum')).not.toHaveAttribute('data-loading')
  })

  it('deferUntilNear: bölüm ekrana yaklaşana kadar yükleme başlamaz', async () => {
    const decode = vi.spyOn(HTMLImageElement.prototype, 'decode')
    let reveal: (entries: { isIntersecting: boolean }[]) => void = () => {}
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: typeof reveal) {
          reveal = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    render(<Probe defer />)
    expect(decode).not.toHaveBeenCalled()
    expect(screen.getByTestId('bolum')).toHaveAttribute('data-loading')

    await act(async () => reveal([{ isIntersecting: true }]))
    expect(decode).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('bolum')).not.toHaveAttribute('data-loading')
  })
})
