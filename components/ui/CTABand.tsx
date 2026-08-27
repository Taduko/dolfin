import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import Button from '@/components/ui/Button'
import TopoLines from '@/components/ui/TopoLines'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

// Reusable closing call-to-action band: darkened photo + deep-forest scrim +
// topographic signature. Used on the home page and every service page.
export default function CTABand({ image = '/images/tikal.jpg' }: { image?: string }) {
  const t = useTranslations('cta')
  const locale = useLocale()
  const waUrl = buildWhatsAppUrl()

  return (
    <section className="relative overflow-hidden px-6 py-28 md:px-12 md:py-32 lg:px-24">
      {/* TODO: swap for client photo — licensed Unsplash stock (see public/images/CREDITS.md) */}
      <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-forest-deep/90" />
      <TopoLines className="pointer-events-none absolute inset-0 h-full w-full text-gold/[0.10]" />

      <Reveal className="relative z-10 mx-auto max-w-2xl">
        <SectionHeading
          align="center"
          tone="dark"
          size="lg"
          kicker={t('kicker')}
          lead={t('subtitle')}
        >
          {t.rich('title', { em: (chunks) => <em>{chunks}</em> })}
        </SectionHeading>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={`/${locale}/cotizar`} variant="secondary">
            {t('button')}
          </Button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-cream/40 px-7 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:-translate-y-0.5 hover:border-cream hover:bg-cream/10"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" />
            </svg>
            {t('whatsapp')}
          </a>
        </div>
      </Reveal>
    </section>
  )
}
