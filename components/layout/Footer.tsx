import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import Kicker from '@/components/ui/Kicker'
import TopoLines from '@/components/ui/TopoLines'

// Editorial footer: deep-forest band with a topographic signature and a thin
// gold rule across the top, a large serif wordmark, gold kicker column labels,
// gold hairline dividers, and refined gold-underline link hovers.
export default function Footer() {
  const t = useTranslations('nav')
  const f = useTranslations('footer')
  const locale = useLocale()

  const servicesLinks = [
    { href: `/${locale}/servicios/fit`, label: t('fit') },
    { href: `/${locale}/servicios/mice`, label: t('mice') },
    { href: `/${locale}/servicios/agencias`, label: t('agencias') },
  ]

  const companyLinks = [
    { href: `/${locale}/nosotros`, label: t('nosotros') },
    { href: `/${locale}/destinos`, label: t('destinos') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/contacto`, label: t('contacto') },
    { href: `/${locale}/cotizar`, label: t('cotizar') },
  ]

  const linkClass =
    'group/link relative inline-flex w-fit items-center text-sm text-cream/70 transition-colors duration-300 hover:text-cream after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full'

  return (
    <footer className="relative overflow-hidden bg-forest-deep text-cream/80">
      {/* Thin gold rule for a premium finish across the top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      {/* Topographic signature, very subtle */}
      <TopoLines className="pointer-events-none absolute inset-x-0 top-0 h-full w-full text-gold/[0.05]" />

      <div className="relative z-10 px-6 py-20 md:px-12 md:py-24 lg:px-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand wordmark + tagline */}
          <div className="md:col-span-6 lg:col-span-5">
            <p className="font-serif text-3xl font-normal leading-[1.05] tracking-[-0.01em] text-cream md:text-4xl">
              Dolfing Travel
            </p>
            <span className="mt-5 block h-px w-12 bg-gold/60" aria-hidden="true" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">
              {f('tagline')}
            </p>
          </div>

          {/* Services column */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <Kicker>{f('services_heading')}</Kicker>
            </div>
            <ul className="flex flex-col gap-3">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div className="md:col-span-3 lg:col-span-4">
            <div className="mb-6">
              <Kicker>{f('company_heading')}</Kicker>
            </div>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gold hairline divider + © line */}
        <div className="mx-auto mt-16 max-w-6xl border-t border-cream/10 pt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-cream/45">
            © {new Date().getFullYear()} Dolfing Travel. {f('rights')}.
          </p>
        </div>
      </div>
    </footer>
  )
}
