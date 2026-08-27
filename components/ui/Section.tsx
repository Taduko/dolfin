type Tone = 'cream' | 'sand' | 'forest'

type Props = {
  children: React.ReactNode
  className?: string
  id?: string
  /** @deprecated use tone="forest" */
  dark?: boolean
  tone?: Tone
}

const tones: Record<Tone, string> = {
  cream: 'bg-cream text-ink',
  sand: 'bg-sand text-ink',
  forest: 'bg-forest text-cream',
}

// Generous, editorial vertical rhythm. Alternate cream/sand to build depth
// between sections; forest for statement bands.
export default function Section({ children, className = '', id, dark, tone }: Props) {
  const resolved: Tone = tone ?? (dark ? 'forest' : 'cream')
  return (
    <section
      id={id}
      className={`px-6 py-24 md:px-12 md:py-28 lg:px-24 ${tones[resolved]} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}
