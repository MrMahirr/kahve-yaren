import { LazyMotion, MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

const loadFeatures = () => import('./motionFeatures').then((module) => module.default)

/**
 * Motion yalnızca DOM geçişleri için kullanılır (menü, akordeon, form ↔ başarı).
 * LazyMotion + `m` bileşenleri ana paketi küçük tutar, animasyon özellikleri sonradan yüklenir;
 * `strict` yanlışlıkla `motion.*` kullanımını yakalar.
 * reducedMotion="user": işletim sistemindeki "hareketi azalt" tercihine uyar.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
