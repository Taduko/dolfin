import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHero from '@/components/ui/PageHero'
import Reveal from '@/components/ui/Reveal'
import QuoteForm from '@/components/forms/QuoteForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages' })
  return { title: t('cotizar_title') }
}

export default async function CotizarPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'pages' })

  return (
    <>
      <PageHero
        image="/images/antigua.jpg"
        eyebrow={t('cotizar_eyebrow')}
        title={t('cotizar_title')}
        lead={t('cotizar_lead')}
      />

      <Section>
        <Reveal className="mx-auto max-w-2xl">
          <QuoteForm />
        </Reveal>
      </Section>
    </>
  )
}
