import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'

const destinations = [
  { key: 'antigua', src: '/images/antigua.jpg', coords: '14.56° N · 90.73° W' },
  { key: 'atitlan', src: '/images/atitlan.jpg', coords: '14.69° N · 91.20° W' },
  { key: 'tikal', src: '/images/tikal.jpg', coords: '17.22° N · 89.62° W' },
  { key: 'semuc', src: '/images/semuc.jpg', coords: '15.53° N · 89.95° W' },
] as const

export default function DestinationsGrid() {
  const t = useTranslations('destinations')
  const tn = useTranslations('nav')
  const locale = useLocale()

  return (
    <Section tone="sand">
      <Reveal>
        <SectionHeading kicker={t('kicker')} lead={t('page_lead')}>
          {t('title')}
        </SectionHeading>
      </Reveal>

      <Reveal>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {destinations.map(({ key, src, coords }, i) => (
            <Reveal key={key} delay={i * 90}>
              <Link
                href={`/${locale}/destinos`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-sm"
              >
                {/* TODO: swap for client-provided photos — licensed Unsplash stock (see public/images/CREDITS.md) */}
                <Image
                  src={src}
                  alt={t(key)}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Editorial scrim: deep forest at the base for legibility, lifting on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest/25 to-transparent" />
                <div className="absolute inset-0 bg-forest/20 transition-opacity duration-500 group-hover:opacity-0" />

                {/* Editorial index numeral */}
                <span className="absolute right-4 top-4 font-serif text-sm text-cream/50 transition-colors duration-500 group-hover:text-gold/80">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-serif text-lg leading-snug text-cream">{t(key)}</p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-cream/60">{coords}</p>
                  <span
                    className="mt-3 block h-px w-6 bg-gold transition-all duration-500 group-hover:w-16"
                    aria-hidden="true"
                  />
                  <span className="mt-3 flex items-center gap-1.5 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-cream/0 transition-all duration-500 group-hover:text-gold">
                    {tn('destinos')}
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
