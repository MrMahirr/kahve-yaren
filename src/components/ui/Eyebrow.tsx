import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'olive' | 'light' | 'accent'

const tones: Record<Tone, string> = {
  olive: 'text-zeytin', // açık zemin
  light: 'text-filiz', // koyu zemin
  accent: 'text-zeytin-isik', // koyu zeminde vurgu
}

type EyebrowProps = HTMLAttributes<HTMLSpanElement> & { tone?: Tone }

/** Bölüm başlıklarının üstündeki küçük mono etiket ("02 — Kahveler"). */
export function Eyebrow({ tone = 'olive', className, ...props }: EyebrowProps) {
  return <span className={cn('eyebrow', tones[tone], className)} {...props} />
}
