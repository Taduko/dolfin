import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import Kicker from '@/components/ui/Kicker'
import PageHero from '@/components/ui/PageHero'
import Reveal from '@/components/ui/Reveal'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages' })
  return { title: t('destinos_title') }
}

const destinations = [
  { key: 'antigua', src: '/images/antigua.jpg', coords: '14.56° N · 90.73° W' },
  { key: 'atitlan', src: '/images/atitlan.jpg', coords: '14.69° N · 91.20° W' },
  { key: 'tikal', src: '/images/tikal.jpg', coords: '17.22° N · 89.62° W' },
  { key: 'semuc', src: '/images/semuc.jpg', coords: '15.53° N · 89.95° W' },
  { key: 'chichicastenango', src: '/images/chichicastenango.jpg', coords: '14.94° N · 91.11° W' },
  { key: 'izabal', src: '/images/izabal.jpg', coords: '15.50° N · 89.17° W' },
] as const

export default async function DestinosPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('destinations')

  return (
    <>
      <PageHero
        image="/images/hero-guatemala.jpg"
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('page_lead')}
      />

      <Section tone="sand">
        <Reveal>
          <Kicker>{t('kicker')}</Kicker>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-5 md:mt-12 md:grid-cols-3 md:gap-6">
          {destinations.map(({ key, src, coords }, index) => (
            <Reveal key={key} delay={index * 70}>
              <div className="group relative aspect-square overflow-hidden">
                {/* TODO: swap for client-provided photos — licensed Unsplash stock (see public/images/CREDITS.md) */}
                <Image
                  src={src}
                  alt={t(key)}
                  fill
                  priority={index < 3}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/15 to-transparent" />
                <div className="absolute inset-0 bg-forest/10 transition-colors duration-500 group-hover:bg-transparent" />

                {/* Editorial index numeral */}
                <span className="absolute right-4 top-4 font-serif text-base text-cream/60" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="absolute bottom-0 left-0 p-5">
                  <p className="font-serif text-lg text-cream">{t(key)}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-cream/60">{coords}</p>
                  <span
                    className="mt-3 block h-px w-6 bg-gold transition-all duration-500 group-hover:w-12"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
