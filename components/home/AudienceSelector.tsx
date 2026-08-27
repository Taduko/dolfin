import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'

const segments = ['fit', 'mice', 'agencias'] as const

const icons: Record<(typeof segments)[number], React.ReactNode> = {
  // Compass — independent travel / exploration
  fit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M15.8 8.2 13 13l-4.8 2.8L11 11l4.8-2.8Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  // Columned building — congresses / corporate / MICE
  mice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M4 9.5h16" />
      <path d="M5.5 9.5V21M9.5 9.5V21M14.5 9.5V21M18.5 9.5V21" />
      <path d="M12 3 4 9.5h16L12 3Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  // Partners — B2B agency network
  agencias: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6" />
      <circle cx="17.2" cy="9.6" r="2.4" />
      <path d="M15.6 14.2c2.7.2 4.6 2.3 4.6 5" />
    </svg>
  ),
}

export default function AudienceSelector() {
  const t = useTranslations('audience')
  const locale = useLocale()

  return (
    <Section tone="cream">
      <Reveal>
        <SectionHeading
          kicker={t('kicker')}
          lead={t('lead')}
        >
          {t.rich('title', { em: (chunks) => <em>{chunks}</em> })}
        </SectionHeading>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3">
        {segments.map((seg, index) => (
          <Reveal key={seg} delay={index * 90} className="h-full">
            <Link
              href={`/${locale}/servicios/${seg}`}
              className="group relative flex h-full flex-col border border-forest/15 bg-cream p-9 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_24px_48px_-24px_rgba(27,58,45,0.35)]"
            >
              {/* Editorial index numeral */}
              <span
                className="font-serif text-5xl font-normal leading-none text-gold/35 transition-colors duration-300 group-hover:text-gold/70"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="mt-7 block h-9 w-9 text-forest transition-colors duration-300 group-hover:text-gold">
                {icons[seg]}
              </span>

              <p className="mb-2 mt-6 text-xs uppercase tracking-[0.2em] text-gold">{t(`${seg}_subtitle`)}</p>
              <h3 className="mb-3 font-serif text-2xl font-normal tracking-[-0.01em] text-forest">{t(`${seg}_title`)}</h3>
              <p className="text-sm leading-relaxed text-ink/60">{t(`${seg}_description`)}</p>

              {/* Gold hairline + arrow affordance that nudges on hover */}
              <span className="mt-auto flex items-center gap-3 pt-8">
                <span className="h-px w-8 bg-gold transition-all duration-300 group-hover:w-16" aria-hidden="true" />
                <svg
                  className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
