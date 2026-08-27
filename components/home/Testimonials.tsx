import { useTranslations } from 'next-intl'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'

const items = ['t1', 't2', 't3'] as const

function Stars() {
  return (
    <div className="flex gap-1" aria-label="5/5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.8 6.1 20.5l1.3-6.6L2.5 9.4l6.6-.8L12 2.5Z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const t = useTranslations('testimonials')

  return (
    <Section tone="cream">
      <Reveal>
        <SectionHeading kicker={t('kicker')} lead={t('lead')} size="md">
          {t('title')}
        </SectionHeading>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item} delay={i * 90}>
            {/* TODO: replace with real client reviews (quote, name, origin) */}
            <figure className="flex h-full flex-col border border-forest/15 bg-cream p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_48px_-24px_rgba(27,58,45,0.35)]">
              <Stars />
              <blockquote className="mt-6 flex-1 font-serif text-lg leading-relaxed text-forest">
                “{t(`${item}_quote`)}”
              </blockquote>
              <figcaption className="mt-6 border-t border-forest/10 pt-5">
                <p className="font-serif text-base text-forest">{t(`${item}_name`)}</p>
                <p className="mt-1 text-[0.7rem] uppercase tracking-[0.2em] text-gold">{t(`${item}_origin`)}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
