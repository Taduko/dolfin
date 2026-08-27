import { useTranslations } from 'next-intl'
import TopoLines from '@/components/ui/TopoLines'
import Reveal from '@/components/ui/Reveal'

const items = ['years', 'fleet', 'languages', 'global'] as const

// Forest statement band: four trust signals rendered as an editorial index —
// large gold serif values over a faint topographic field, separated by refined
// gold hairlines. Used on the home page and the nosotros page.
export default function TrustBar() {
  const t = useTranslations('trust')

  return (
    <div className="relative overflow-hidden bg-forest px-6 py-20 text-cream md:px-12 md:py-24 lg:px-24">
      <TopoLines className="pointer-events-none absolute inset-0 h-full w-full text-cream/[0.06]" />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-y-12 md:grid-cols-4 md:gap-y-0 md:divide-x md:divide-cream/15">
        {items.map((item, i) => (
          <Reveal
            key={item}
            delay={i * 90}
            className="group flex flex-col items-center px-4 text-center md:px-8"
          >
            <span className="mb-4 font-serif text-xs italic tracking-wide text-gold/55">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="h-px w-8 bg-gold/50 transition-all duration-500 group-hover:w-14" aria-hidden="true" />
            <p className="mt-5 text-balance font-serif text-xl font-normal leading-snug tracking-[-0.01em] text-gold md:text-2xl">
              {t(item)}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
