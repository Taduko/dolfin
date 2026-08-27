import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHero from '@/components/ui/PageHero'
import CTABand from '@/components/ui/CTABand'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages' })
  return { title: t('contacto_title') }
}

const iconCls = 'mb-4 h-7 w-7'
const icons = {
  whatsapp: <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" />,
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.8-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 15.2 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
    </>
  ),
}

function Icon({ shape, className = iconCls }: { shape: React.ReactNode; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {shape}
    </svg>
  )
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contacto')
  const waUrl = buildWhatsAppUrl()
  const email = t('email_value')

  // Editorial index number — a large gold serif numeral, top-right of each card.
  const indexCls =
    'absolute right-6 top-6 font-serif text-2xl font-normal leading-none text-forest/15 transition-colors duration-300 group-hover:text-gold/50'
  const labelCls = 'mb-2 text-xs uppercase tracking-[0.2em] text-gold'
  const valueCls = 'font-serif text-lg font-normal leading-snug text-forest'
  // Light cards: hairline border that warms to gold, a tasteful lift on hover.
  const cardCls =
    'group relative flex flex-col border border-forest/15 bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_24px_48px_-24px_rgba(27,58,45,0.35)]'

  return (
    <>
      <PageHero image="/images/atitlan.jpg" eyebrow={t('eyebrow')} title={t('title')} lead={t('intro')} />

      <Section tone="sand">
        <Reveal>
          <SectionHeading kicker={t('eyebrow')} size="lg" align="center">
            {t('title')}
          </SectionHeading>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Primary channel — forest statement card */}
          <Reveal delay={0}>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-full flex-col border border-forest bg-forest p-7 text-cream transition-all duration-300 hover:-translate-y-1 hover:bg-forest-deep hover:shadow-[0_24px_48px_-24px_rgba(27,58,45,0.35)]"
            >
              <span className="absolute right-6 top-6 font-serif text-2xl font-normal leading-none text-cream/15 transition-colors duration-300 group-hover:text-gold/60" aria-hidden="true">
                01
              </span>
              <Icon shape={icons.whatsapp} className={`${iconCls} text-gold`} />
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gold">{t('whatsapp_label')}</p>
              <p className="font-serif text-lg font-normal leading-snug text-cream">
                {t('whatsapp_link')}{' '}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </p>
              <span className="mt-4 h-px w-10 bg-gold/60 transition-all duration-300 group-hover:w-16" aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal delay={90}>
            <a href={`mailto:${email}`} className={`${cardCls} h-full`}>
              <span className={indexCls} aria-hidden="true">02</span>
              <Icon shape={icons.email} className={`${iconCls} text-forest`} />
              <p className={labelCls}>{t('email_label')}</p>
              <p className={valueCls}>{email}</p>
              <span className="mt-4 h-px w-10 bg-gold/50 transition-all duration-300 group-hover:w-16" aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal delay={180}>
            <div className={`${cardCls} h-full`}>
              <span className={indexCls} aria-hidden="true">03</span>
              <Icon shape={icons.pin} className={`${iconCls} text-forest`} />
              <p className={labelCls}>{t('country_label')}</p>
              <p className={valueCls}>{t('country_value')}</p>
              <span className="mt-4 h-px w-10 bg-gold/50 transition-all duration-300 group-hover:w-16" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={270}>
            <div className={`${cardCls} h-full`}>
              <span className={indexCls} aria-hidden="true">04</span>
              <Icon shape={icons.clock} className={`${iconCls} text-forest`} />
              <p className={labelCls}>{t('response_label')}</p>
              <p className={valueCls}>{t('response_value')}</p>
              <span className="mt-4 h-px w-10 bg-gold/50 transition-all duration-300 group-hover:w-16" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={360} className="sm:col-span-2">
            <div className={`${cardCls} h-full`}>
              <span className={indexCls} aria-hidden="true">05</span>
              <Icon shape={icons.globe} className={`${iconCls} text-forest`} />
              <p className={labelCls}>{t('languages_label')}</p>
              <p className={valueCls}>{t('languages_value')}</p>
              <span className="mt-4 h-px w-10 bg-gold/50 transition-all duration-300 group-hover:w-16" aria-hidden="true" />
            </div>
          </Reveal>
        </div>
      </Section>

      <CTABand image="/images/antigua.jpg" />
    </>
  )
}
