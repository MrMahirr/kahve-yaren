export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t

/** 0..1 aralığında yumuşak başlayıp yumuşak biten geçiş (Hermite). */
export const smoothstep = (t: number) => {
  const x = clamp(t)
  return x * x * (3 - 2 * x)
}
