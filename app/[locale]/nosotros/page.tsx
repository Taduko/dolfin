import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHero from '@/components/ui/PageHero'
import TopoLines from '@/components/ui/TopoLines'
import Reveal from '@/components/ui/Reveal'
import TrustBar from '@/components/home/TrustBar'
import WhyDolfing from '@/components/home/WhyDolfing'
import CTABand from '@/components/ui/CTABand'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages' })
  return { title: t('nosotros_title') }
}

export default async function NosotrosPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('nosotros')

  return (
    <>
      <PageHero image="/images/hero-guatemala.jpg" eyebrow={t('eyebrow')} title="Dolfing Travel" lead={t('p1')} />

      <Section tone="sand">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="group relative aspect-[4/3] overflow-hidden">
              {/* TODO: swap for client photo — licensed Unsplash stock (see public/images/CREDITS.md) */}
              <Image
                src="/images/antigua.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-4 border border-cream/20" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <span className="mb-8 block h-px w-12 bg-gold/70" aria-hidden="true" />
            <p className="mb-6 text-balance font-serif text-2xl font-normal leading-snug tracking-[-0.01em] text-forest md:text-3xl">
              {t('p2')}
            </p>
            <p className="text-lg leading-relaxed text-ink/70">{t('p3')}</p>
          </Reveal>
        </div>
      </Section>

      <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden px-6 py-28 md:py-32">
        {/* TODO: swap for client photo — licensed Unsplash stock (see public/images/CREDITS.md) */}
        <Image src="/images/atitlan.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/90 to-forest/80" />
        <TopoLines className="pointer-events-none absolute inset-0 h-full w-full text-gold/[0.10]" />

        <Reveal className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-8 block h-px w-16 bg-gold/70" aria-hidden="true" />
          <p className="text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] text-cream md:text-4xl lg:text-[2.75rem]">
            {t('mission')}
          </p>
          <span className="mx-auto mt-9 block h-px w-16 bg-gold/70" aria-hidden="true" />
        </Reveal>
      </section>

      <TrustBar />
      <WhyDolfing />
      <CTABand image="/images/tikal.jpg" />
    </>
  )
}
