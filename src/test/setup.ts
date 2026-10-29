import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { MotionGlobalConfig } from 'motion/react'

// Testlerde geçişler beklenmeden tamamlansın.
MotionGlobalConfig.skipAnimations = true

// jsdom'da matchMedia yok; varsayılan olarak hiçbir sorgu eşleşmez (mobil, hareket açık).
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

// jsdom canvas çizmez; kod getContext() null dönünce çizimi atlar.
HTMLCanvasElement.prototype.getContext = (() =>
  null) as typeof HTMLCanvasElement.prototype.getContext

afterEach(() => cleanup())
