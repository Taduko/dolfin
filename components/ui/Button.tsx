import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'

type Props = {
  variant?: Variant
  href?: string
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

const styles: Record<Variant, string> = {
  primary: 'bg-forest text-cream hover:bg-forest-deep',
  secondary: 'bg-gold text-forest hover:bg-gold-light',
  ghost: 'border border-forest/30 text-forest hover:border-forest hover:bg-forest/5',
  outline: 'border border-cream/50 text-cream hover:border-cream hover:bg-cream/10',
}

// Refined CTA: tracked-out label, gentle lift on hover, hairline rounding.
export default function Button({
  variant = 'primary',
  href,
  children,
  className = '',
  type = 'button',
  disabled,
  onClick,
}: Props) {
  const base =
    'group/btn inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.12em] transition-all duration-300 hover:-translate-y-0.5'
  const cls = `${base} ${styles[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
