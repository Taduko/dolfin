import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  align?: 'left' | 'center'
  className?: string
}

// Editorial eyebrow label: tracked-out uppercase text flanked by a gold
// hairline. The recurring "kicker" that gives every section magazine rhythm.
export default function Kicker({ children, align = 'left', className = '' }: Props) {
  const justify = align === 'center' ? 'justify-center' : ''
  return (
    <span
      className={`flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-gold ${justify} ${className}`}
    >
      <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
      {children}
      {align === 'center' && <span className="h-px w-10 bg-gold/60" aria-hidden="true" />}
    </span>
  )
}
