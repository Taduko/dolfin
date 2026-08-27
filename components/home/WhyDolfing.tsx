import { useTranslations } from 'next-intl'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'

const items = ['fleet', 'global', 'mice', 'multilingual', 'network'] as const

export default function WhyDolfing() {
  const t = useTranslations('why')

  return (
    <Section tone="sand">
      <Reveal className="max-w-2xl">
        <SectionHeading kicker={t('kicker')} size="lg">
          {t('title')}
        </SectionHeading>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal
            key={item}
            delay={i * 90}
            className="group border-t border-forest/15 pt-7"
          >
            <div className="mb-5 flex items-baseline gap-4">
              <span className="font-serif text-3xl font-normal leading-none text-gold/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="mt-1 h-px w-8 bg-gold transition-all duration-500 group-hover:w-16"
                aria-hidden="true"
              />
            </div>
            <h3 className="mb-3 font-serif text-xl font-normal leading-snug tracking-[-0.01em] text-forest">
              {t(`${item}_title`)}
            </h3>
            <p className="text-sm leading-relaxed text-ink/65">{t(`${item}_desc`)}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
