import { createContext, useContext } from 'react'

export type ContactTopic = {
  /** Kahve menüsünden forma taşınan konu; boş dize konu yok demektir. */
  topic: string
  setTopic: (topic: string) => void
}

export const ContactTopicContext = createContext<ContactTopic | null>(null)

export function useContactTopic() {
  const context = useContext(ContactTopicContext)
  if (!context) throw new Error('useContactTopic, ContactTopicProvider içinde kullanılmalı.')
  return context
}
