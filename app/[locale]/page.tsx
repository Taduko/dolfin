import { setRequestLocale } from 'next-intl/server'
import Hero from '@/components/home/Hero'
import AudienceSelector from '@/components/home/AudienceSelector'
import TrustBar from '@/components/home/TrustBar'
import DestinationsGrid from '@/components/home/DestinationsGrid'
import TravelerGallery from '@/components/home/TravelerGallery'
import WhyDolfing from '@/components/home/WhyDolfing'
import Testimonials from '@/components/home/Testimonials'
import HomeCTA from '@/components/home/HomeCTA'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Hero />
      <AudienceSelector />
      <TrustBar />
      <DestinationsGrid />
      <TravelerGallery />
      <WhyDolfing />
      <Testimonials />
      <HomeCTA />
    </>
  )
}
