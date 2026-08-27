import Image from 'next/image'
import Button from '@/components/ui/Button'
import TopoLines from '@/components/ui/TopoLines'
import Kicker from '@/components/ui/Kicker'

// Photographic page header shared by inner pages (services, about, contact,
// destinations, quote). A dark hero so the transparent navbar stays legible.
type Props = {
  image: string
  eyebrow: string
  title: string
  lead?: string
  ctaHref?: string
  ctaLabel?: string
}

export default function PageHero({ image, eyebrow, title, lead, ctaHref, ctaLabel }: Props) {
  return (
    <section className="relative flex h-[64vh] min-h-[460px] items-end overflow-hidden">
      {/* TODO: swap for client photo — licensed Unsplash stock (see public/images/CREDITS.md) */}
      <Image src={image} alt="" fill priority sizes="100vw" className="animate-ken-burns object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest/45 to-forest/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/40 to-transparent" />
      <TopoLines className="pointer-events-none absolute inset-0 h-full w-full text-cream/[0.06]" />

      <div className="relative z-10 w-full px-6 pb-16 md:px-12 md:pb-20 lg:px-24">
        <div className="max-w-3xl">
          <div className="animate-fade-up delay-1 mb-5">
            <Kicker>{eyebrow}</Kicker>
          </div>
          <h1 className="animate-fade-up delay-2 mb-5 text-balance font-serif text-4xl font-normal leading-[1.06] tracking-[-0.01em] text-cream md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {lead && (
            <p className="animate-fade-up delay-3 mb-8 max-w-xl leading-relaxed text-cream/80">{lead}</p>
          )}
          {ctaHref && ctaLabel && (
            <div className="animate-fade-up delay-3">
              <Button href={ctaHref} variant="secondary">
                {ctaLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
