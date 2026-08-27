import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Section from '@/components/ui/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'

// Editorial photo mosaic of travelers' trips. Placeholder landscape photos for
// now — see the TODO below; swap for real traveler photos when provided.
const tiles: { src: string; cap: string; big?: boolean }[] = [
  { src: '/images/hero-guatemala.jpg', cap: 'atitlan', big: true },
  { src: '/images/antigua.jpg', cap: 'antigua' },
  { src: '/images/tikal.jpg', cap: 'tikal' },
  { src: '/images/semuc.jpg', cap: 'semuc' },
  { src: '/images/chichicastenango.jpg', cap: 'chichicastenango' },
]

export default function TravelerGallery() {
  const t = useTranslations('gallery')
  const td = useTranslations('destinations')

  return (
    <Section tone="cream">
      <Reveal>
        <SectionHeading kicker={t('kicker')} lead={t('lead')} size="md">
          {t('title')}
        </SectionHeading>
      </Reveal>

      <Reveal className="mt-14 grid grid-cols-2 gap-3 sm:h-[480px] sm:grid-cols-4 sm:grid-rows-2 lg:h-[560px]">
        {tiles.map(({ src, cap, big }) => (
          <div
            key={src}
            className={`group relative overflow-hidden ${
              big ? 'col-span-2 aspect-[16/10] sm:row-span-2 sm:aspect-auto' : 'aspect-square sm:aspect-auto'
            }`}
          >
            {/* TODO: swap for real traveler photos — currently licensed Unsplash stock (see public/images/CREDITS.md) */}
            <Image
              src={src}
              alt={td(cap)}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/10 to-transparent" />
            <div className="absolute inset-0 bg-forest/10 transition-colors duration-500 group-hover:bg-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <p className="font-serif text-base text-cream md:text-lg">{td(cap)}</p>
              <span
                className="mt-2 block h-px w-6 bg-gold transition-all duration-500 group-hover:w-12"
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </Reveal>
    </Section>
  )
}
