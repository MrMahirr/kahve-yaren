import { useMemo, useRef, type RefObject } from 'react'
import { frameList, type FramePrefix } from '@/data/sequences'
import { useFrameSequence } from '@/hooks/useFrameSequence'

type FrameSequenceProps = {
  /** İlerlemesi ölçülen bölüm (sahnesi sticky olan uzun bölüm). */
  sectionRef: RefObject<HTMLElement | null>
  prefix: FramePrefix
  focal: number
  lazy?: boolean
  /** Ekran okuyucu için videonun ne gösterdiği. */
  label: string
  onProgress?: (progress: number, frameIndex: number) => void
}

export function FrameSequence({
  sectionRef,
  prefix,
  focal,
  lazy,
  label,
  onProgress,
}: FrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frames = useMemo(() => frameList(prefix), [prefix])

  useFrameSequence({
    sectionRef,
    canvasRef,
    frames,
    focal,
    lazy,
    background: '#140d0a', // --color-gece
    onProgress,
  })

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="absolute inset-0 block size-full"
    />
  )
}
