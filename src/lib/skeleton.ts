/**
 * Skeleton: bölüm hazır değilken içindeki `data-sk` işaretli öğeler yerinde iskelete dönüşür
 * (stiller index.css → "Skeleton"). Düzen değişmez; içerik gelince sayfa kaymaz.
 *
 *   data-sk="text"   satırları gerçek satır kırılımlarıyla çizgi olur
 *   data-sk="block"  buton, çip, girdi gibi dolu blok olur
 *   data-sk="media"  canvas/fotoğraf alanı parlayan zemin olur, içeriği gizlenir
 *   data-sk="hide"   yüklenirken gizlenir (fotoğraf üstü gölgeler gibi)
 */
export type SkeletonTone = 'light' | 'dark'

/** Bölüm köküne yayılır: yüklenirken iskelet tonu, aria-busy ve etkileşimin kapatılması. */
export const skeletonProps = (ready: boolean, tone: SkeletonTone) => ({
  'data-loading': ready ? undefined : tone,
  'aria-busy': !ready,
  inert: !ready,
})
