import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import ServicePage from '@/components/services/ServicePage'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages' })
  return { title: t('mice_title'), description: t('mice_description') }
}

export default async function MICEPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ServicePage segment="mice" />
}
