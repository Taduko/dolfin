import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import Button from '@/components/ui/Button'

export default function Hero() {
  const t = useTranslations('hero')
  const td = useTranslations('destinations')
  const locale = useLocale()

  return (
    <section className="relative flex h-[100svh] min-h-[640px] items-end overflow-hidden">
      {/* TODO: swap for client-provided hero photo. Currently licensed Unsplash stock — see public/images/CREDITS.md */}
      <Image
        src="/images/hero-guatemala.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-ken-burns object-cover"
      />

      {/* Cinematic scrim: deep forest at the base for legibility + brand cohesion */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest/45 to-forest/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/50 to-transparent" />

      {/* Thin gold framing hairlines — a cartographic, editorial border */}
      <div className="pointer-events-none absolute inset-x-6 bottom-6 top-24 hidden border border-cream/10 md:block" />

      <div className="relative z-10 w-full px-6 pb-20 md:px-12 md:pb-28 lg:px-24">
        <div className="max-w-3xl">
          <p className="animate-fade-up delay-1 mb-7 flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-12 bg-gold/70" />
            {t('eyebrow')}
          </p>
          <h1 className="animate-fade-up delay-2 mb-9 max-w-2xl text-balance font-serif text-[2.9rem] font-normal leading-[1.04] tracking-[-0.01em] text-cream md:text-6xl lg:text-7xl">
            {t.rich('tagline', { em: (chunks) => <em>{chunks}</em> })}
          </h1>
          <div className="animate-fade-up delay-3 flex flex-wrap gap-4">
            <Button href={`/${locale}/cotizar`} variant="secondary">
              {t('cta_primary')}
            </Button>
            <Button href={`/${locale}/servicios/fit`} variant="outline">
              {t('cta_secondary')}
            </Button>
          </div>
        </div>
      </div>

      {/* Cartographic signature: name + real coordinates of the photographed place */}
      <p className="animate-fade-up delay-4 absolute bottom-9 right-6 z-10 hidden items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-cream/65 sm:flex md:right-12">
        <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
        {td('atitlan')} <span className="text-gold/80">·</span> 14.69° N, 91.20° W
      </p>

      {/* Scroll cue (decorative) */}
      <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <svg
          className="animate-scroll-nudge h-6 w-6 text-cream/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}
