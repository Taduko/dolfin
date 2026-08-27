import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import TopoLines from '@/components/ui/TopoLines'
import PageHero from '@/components/ui/PageHero'
import CTABand from '@/components/ui/CTABand'
import SectionHeading from '@/components/ui/SectionHeading'
import Kicker from '@/components/ui/Kicker'
import Reveal from '@/components/ui/Reveal'

type Segment = 'fit' | 'mice' | 'agencias'

const acronym: Record<Segment, string> = { fit: 'FIT', mice: 'MICE', agencias: 'B2B' }
const headerImage: Record<Segment, string> = {
  fit: '/images/atitlan.jpg',
  mice: '/images/antigua.jpg',
  agencias: '/images/tikal.jpg',
}
const approachImage: Record<Segment, string> = {
  fit: '/images/semuc.jpg',
  mice: '/images/izabal.jpg',
  agencias: '/images/atitlan.jpg',
}
const ctaImage: Record<Segment, string> = {
  fit: '/images/tikal.jpg',
  mice: '/images/semuc.jpg',
  agencias: '/images/chichicastenango.jpg',
}
const gallery: Record<Segment, string[]> = {
  fit: ['/images/tikal.jpg', '/images/semuc.jpg', '/images/chichicastenango.jpg'],
  mice: ['/images/izabal.jpg', '/images/tikal.jpg', '/images/atitlan.jpg'],
  agencias: ['/images/antigua.jpg', '/images/atitlan.jpg', '/images/semuc.jpg'],
}

const features = ['f1', 'f2', 'f3', 'f4'] as const

export default function ServicePage({ segment }: { segment: Segment }) {
  const tp = useTranslations('pages')
  const ts = useTranslations(`services.${segment}`)
  const tso = useTranslations('services')
  const tn = useTranslations('nav')
  const td = useTranslations('destinations')
  const locale = useLocale()

  return (
    <>
      <PageHero
        image={headerImage[segment]}
        eyebrow={acronym[segment]}
        title={tp(`${segment}_title`)}
        lead={tp(`${segment}_description`)}
        ctaHref={`/${locale}/cotizar`}
        ctaLabel={tn('cotizar')}
      />

      {/* What we offer — numbered editorial index */}
      <Section>
        <Reveal>
          <SectionHeading kicker={tso('offer_kicker')}>{tso('offer_title')}</SectionHeading>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f} delay={i * 90}>
              <article className="group border-t border-forest/15 pt-7">
                <div className="mb-5 flex items-baseline gap-4">
                  <span className="font-serif text-3xl font-normal leading-none text-gold md:text-4xl" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-16" aria-hidden="true" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-normal tracking-[-0.01em] text-forest md:text-2xl">
                  {ts(`${f}_title`)}
                </h3>
                <p className="text-sm leading-relaxed text-ink/65">{ts(`${f}_desc`)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Approach — forest statement band with image */}
      <section className="relative overflow-hidden bg-forest px-6 py-24 text-cream md:px-12 md:py-28 lg:px-24">
        <TopoLines className="pointer-events-none absolute inset-0 h-full w-full text-cream/[0.05]" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="group relative aspect-[4/3] overflow-hidden">
            {/* TODO: swap for client photo — licensed Unsplash stock (see public/images/CREDITS.md) */}
            <Image
              src={approachImage[segment]}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <Reveal>
            <div className="mb-6">
              <Kicker>{tso('approach_kicker')}</Kicker>
            </div>
            <h2 className="mb-5 font-serif text-3xl font-normal tracking-[-0.01em] text-cream md:text-4xl">
              {ts('approach_title')}
            </h2>
            <span className="mb-7 block h-px w-12 bg-gold" aria-hidden="true" />
            <p className="mb-9 max-w-xl leading-relaxed text-cream/75">{ts('approach_body')}</p>
            <Button href={`/${locale}/cotizar`} variant="secondary">{tn('cotizar')}</Button>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <Section tone="sand">
        <Reveal>
          <SectionHeading kicker={tso('gallery_kicker')}>{tso('gallery_title')}</SectionHeading>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
          {gallery[segment].map((src, i) => (
            <Reveal key={src} delay={i * 90}>
              <div className="group relative aspect-[4/3] overflow-hidden">
                {/* TODO: swap for client photos — licensed Unsplash stock (see public/images/CREDITS.md) */}
                <Image src={src} alt={td('title')} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-forest/10 transition-colors duration-500 group-hover:bg-transparent" />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTABand image={ctaImage[segment]} />
    </>
  )
}
