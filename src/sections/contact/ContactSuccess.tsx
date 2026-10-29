import { useEffect, useRef } from 'react'
import { IconCheck } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { TopicChip } from './TopicChip'

export type SentMessage = {
  firstName: string
  topic: string
}

type ContactSuccessProps = SentMessage & { onReset: () => void }

/** Geçerli gönderimden sonra formun yerine geçer ve odağı alır, ekran okuyucu sonucu duyurur. */
export function ContactSuccess({ firstName, topic, onReset }: ContactSuccessProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <div ref={ref} role="status" tabIndex={-1} className="flex flex-col gap-[18px] outline-none">
      <div className="flex size-[72px] items-center justify-center rounded-full bg-zeytin text-kaymak">
        <IconCheck className="[&_path]:animate-draw [&_path]:[stroke-dasharray:30]" />
      </div>
      <h3 className="m-0 font-display text-[clamp(2rem,3vw,2.75rem)] leading-[1.05] font-semibold tracking-[-.03em]">
        Mesajın bize ulaştı.
      </h3>
      <p className="m-0 max-w-[26rem] text-[17px] text-dem">
        Teşekkürler {firstName}. Bir fincan kahve soğumadan sana dönüş yapmaya çalışacağız.
      </p>
      {topic && <TopicChip topic={topic} />}
      <Button variant="outline" onClick={onReset} className="self-start">
        Yeni mesaj yaz
      </Button>
    </div>
  )
}
