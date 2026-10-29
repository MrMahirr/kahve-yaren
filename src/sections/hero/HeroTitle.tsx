const WORDS = [
  { text: 'Her' },
  { text: 'fincanda' },
  { text: 'ortak', accent: true },
  { text: 'bir' },
  { text: 'hikâye.' },
]

/** Her kelime kendi maskesinin içinden sırayla yukarı kayar (80 ms arayla). */
export function HeroTitle({ id }: { id: string }) {
  return (
    <h1
      id={id}
      className="h-display text-[50px] leading-[.95] tracking-[-.045em] lg:text-[clamp(3rem,7vw,6.75rem)] short:text-[clamp(2.25rem,5vw,3.25rem)]"
    >
      {WORDS.map((word, i) => (
        <span key={word.text}>
          <span className="inline-block overflow-hidden pb-[.06em] align-top">
            <span
              className={
                word.accent
                  ? 'inline-block animate-word-up text-zeytin-isik'
                  : 'inline-block animate-word-up'
              }
              style={{ animationDelay: `${i * 80 + 100}ms` }}
            >
              {word.text}
            </span>
          </span>{' '}
        </span>
      ))}
    </h1>
  )
}
