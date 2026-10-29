import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { SECTION_IDS } from '@/data/navigation'
import { useContactTopic } from '@/features/coffee/contactTopic'
import { firstName, type ContactValues } from '@/features/contact/contactSchema'
import { ContactForm } from './ContactForm'
import { ContactSuccess, type SentMessage } from './ContactSuccess'
import { ContactVisual } from './ContactVisual'

const swap = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] },
} as const

export function ContactSection() {
  const { topic, setTopic } = useContactTopic()
  const [sent, setSent] = useState<SentMessage | null>(null)
  const [returning, setReturning] = useState(false)
  const [lastTopic, setLastTopic] = useState(topic)

  // Başarı ekranındayken menüden yeni bir konu seçilirse forma dönülür.
  // Efekt yerine render sırasında güncellenir (React'in "önceki değeri sakla" kalıbı).
  if (topic !== lastTopic) {
    setLastTopic(topic)
    if (topic) setSent(null)
  }

  const handleSubmit = (values: ContactValues) => {
    setSent({ firstName: firstName(values.name), topic })
    setTopic('')
  }

  const handleReset = () => {
    setReturning(true)
    setSent(null)
  }

  return (
    <section
      id={SECTION_IDS.contact}
      aria-labelledby="iletisim-baslik"
      className="pb-[clamp(72px,9vw,136px)]"
    >
      <Container className="px-5 sm:px-gutter">
        <div className="grid reveal grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] overflow-hidden rounded-[2px] border border-kum bg-kopuk">
          <ContactVisual />

          <div className="flex flex-col justify-center px-5 pt-7 pb-8 sm:p-[clamp(28px,4.5vw,64px)]">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <m.div key="success" {...swap}>
                  <ContactSuccess {...sent} onReset={handleReset} />
                </m.div>
              ) : (
                <m.div key="form" {...swap}>
                  <ContactForm
                    topic={topic}
                    onClearTopic={() => setTopic('')}
                    onSubmit={handleSubmit}
                    focusOnMount={returning}
                  />
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  )
}
