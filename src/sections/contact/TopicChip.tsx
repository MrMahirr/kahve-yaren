import { IconClose } from '@/components/icons'
import { cn } from '@/lib/cn'

type TopicChipProps = {
  topic: string
  /** Verilirse çipte konuyu kaldıran bir ✕ butonu çıkar. */
  onClear?: () => void
}

/** Menüden gelen konu: "Konu: Espresso · Duble". */
export function TopicChip({ topic, onClear }: TopicChipProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-10 items-center gap-1 self-start rounded-full bg-zeytin-acik pl-4 text-sm font-semibold text-zeytin-koyu',
        onClear ? 'animate-pop pr-1' : 'pr-4',
      )}
    >
      <span>Konu: {topic}</span>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Konuyu kaldır"
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-current"
        >
          <IconClose size={14} strokeWidth={2} />
        </button>
      )}
    </span>
  )
}
