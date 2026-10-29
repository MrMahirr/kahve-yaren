import { useMemo, useState, type ReactNode } from 'react'
import { ContactTopicContext } from './contactTopic'

/** "Bu kahve için yaz" → iletişim formu arasındaki tek paylaşılan durum. */
export function ContactTopicProvider({ children }: { children: ReactNode }) {
  const [topic, setTopic] = useState('')
  const value = useMemo(() => ({ topic, setTopic }), [topic])
  return <ContactTopicContext value={value}>{children}</ContactTopicContext>
}
