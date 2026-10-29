import { useRef } from 'react'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MENU } from '@/data/menu'
import { SECTION_IDS } from '@/data/navigation'
import { useContactTopic } from '@/features/coffee/contactTopic'
import { useCoffeeSelection } from '@/features/coffee/useCoffeeSelection'
import { useAssetsReady } from '@/hooks/useAssetsReady'
import { skeletonProps } from '@/lib/skeleton'
import { CoffeeRow } from './CoffeeRow'
import { CoffeeStage } from './CoffeeStage'
import { SelectionSummary } from './SelectionSummary'

const MENU_IMAGES = MENU.map((item) => item.image.src)

/** Kahveler: bir kahve seç, nasıl içtiğini söyle; seçim fotoğrafı, fiyatı ve form konusunu belirler. */
export function CoffeeMenuSection() {
  const { selectedIndex, select, optionFor, setOption, current } = useCoffeeSelection(MENU)
  const { setTopic } = useContactTopic()
  const sectionRef = useRef<HTMLElement>(null)
  // Bölüm ekrana yaklaşınca üç fotoğraf beklenir; o zamana kadar iskelet.
  const ready = useAssetsReady({
    images: MENU_IMAGES,
    fonts: true,
    deferUntilNear: sectionRef,
  })

  return (
    <section
      ref={sectionRef}
      {...skeletonProps(ready, 'light')}
      id={SECTION_IDS.coffee}
      aria-labelledby="kahveler-baslik"
      className="relative overflow-hidden"
    >
      <span
        aria-hidden="true"
        data-sk="hide"
        className="pointer-events-none absolute top-[clamp(24px,4vw,56px)] right-[-.04em] font-display text-[clamp(7rem,22vw,20rem)] leading-[.8] font-bold tracking-[-.06em] whitespace-nowrap text-outline text-outline-color-kum-cizgi"
      >
        Menü
      </span>

      <Container className="relative flex flex-col gap-[clamp(36px,4vw,56px)] py-[clamp(72px,9vw,136px)]">
        <div className="flex reveal flex-wrap items-end justify-between gap-x-12 gap-y-4">
          <div className="flex flex-col gap-4">
            <Eyebrow>02 — Kahveler</Eyebrow>
            <h2 id="kahveler-baslik" data-sk="text" className="h-section">
              Üç demleme,
              <br />
              tek masa.
            </h2>
          </div>
          <p data-sk="text" className="m-0 max-w-[22rem] text-[15px] text-dem">
            Bir kahve seç, nasıl içtiğini söyle; gerisini biz demleyelim. Fiyatlar örnek amaçlıdır.
          </p>
        </div>

        <div className="grid reveal grid-cols-[repeat(auto-fit,minmax(min(500px,100%),1fr))] gap-[clamp(28px,4vw,64px)]">
          <CoffeeStage menu={MENU} current={current} />

          <div className="flex flex-col justify-between gap-7">
            <div className="border-b border-kum-koyu">
              {MENU.map((item, index) => (
                <CoffeeRow
                  key={item.id}
                  item={item}
                  index={index}
                  open={index === selectedIndex}
                  option={optionFor(index)}
                  onSelect={() => select(index)}
                  onOptionChange={(option) => setOption(index, option)}
                />
              ))}
            </div>
            <SelectionSummary current={current} onAsk={setTopic} />
          </div>
        </div>
      </Container>
    </section>
  )
}
