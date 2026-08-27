import type { ReactNode } from 'react'
import Kicker from './Kicker'

type Props = {
  kicker?: ReactNode
  children: ReactNode // heading text — may contain <em> for italic emphasis
  lead?: ReactNode
  align?: 'left' | 'center'
  tone?: 'light' | 'dark' // light = forest text (on cream/sand); dark = cream text (on forest)
  as?: 'h1' | 'h2'
  size?: 'md' | 'lg' | 'xl'
  className?: string
}

const sizes: Record<NonNullable<Props['size']>, string> = {
  md: 'text-3xl md:text-4xl',
  lg: 'text-[2.5rem] leading-[1.05] md:text-5xl',
  xl: 'text-[2.75rem] leading-[1.04] md:text-6xl lg:text-7xl',
}

// Editorial section heading: optional kicker, a refined Playfair display title
// (supports an italic emphasis word via <em>), and an optional lead paragraph.
export default function SectionHeading({
  kicker,
  children,
  lead,
  align = 'left',
  tone = 'light',
  as: Tag = 'h2',
  size = 'md',
  className = '',
}: Props) {
  const isCenter = align === 'center'
  const titleColor = tone === 'dark' ? 'text-cream' : 'text-forest'
  const leadColor = tone === 'dark' ? 'text-cream/75' : 'text-ink/65'

  return (
    <div className={`${isCenter ? 'mx-auto text-center' : ''} ${className}`}>
      {kicker && (
        <div className="mb-5">
          <Kicker align={align}>{kicker}</Kicker>
        </div>
      )}
      <Tag
        className={`text-balance font-serif font-normal tracking-[-0.01em] ${sizes[size]} ${titleColor}`}
      >
        {children}
      </Tag>
      {lead && (
        <p className={`mt-5 max-w-xl text-base leading-relaxed ${leadColor} ${isCenter ? 'mx-auto' : ''}`}>
          {lead}
        </p>
      )}
    </div>
  )
}
