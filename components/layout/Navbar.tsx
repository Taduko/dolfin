'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const otherLocale = locale === 'es' ? 'en' : 'es'
  const switchedPath = `/${otherLocale}${pathname.slice(`/${locale}`.length)}`

  // Solid (cream) once scrolled or when the mobile menu is open; otherwise
  // transparent with cream text, floating over the page's dark hero.
  const solid = scrolled || open

  const links = [
    { href: `/${locale}/servicios/fit`, label: t('fit') },
    { href: `/${locale}/servicios/mice`, label: t('mice') },
    { href: `/${locale}/servicios/agencias`, label: t('agencias') },
    { href: `/${locale}/nosotros`, label: t('nosotros') },
    { href: `/${locale}/destinos`, label: t('destinos') },
    { href: `/${locale}/blog`, label: t('blog') },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? 'border-b border-forest/10 bg-cream/95 backdrop-blur'
          : 'border-b border-transparent bg-gradient-to-b from-forest-deep/40 to-transparent'
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-500 md:px-12 ${
          scrolled ? 'h-16' : 'h-20'
        }`}
      >
        <Link
          href={`/${locale}`}
          onClick={() => setOpen(false)}
          className={`font-serif text-xl font-semibold tracking-wide transition-colors ${
            solid ? 'text-forest' : 'text-cream'
          }`}
        >
          Dolfing Travel
        </Link>

        <nav
          className={`hidden items-center gap-7 text-sm transition-colors md:flex ${
            solid ? 'text-ink/70' : 'text-cream/85'
          }`}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition-colors ${solid ? 'hover:text-forest' : 'hover:text-cream'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push(switchedPath)}
            className={`text-xs uppercase tracking-widest transition-colors ${
              solid ? 'text-ink/50 hover:text-forest' : 'text-cream/70 hover:text-cream'
            }`}
          >
            {otherLocale}
          </button>
          <Link
            href={`/${locale}/cotizar`}
            className={`hidden rounded-sm px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.12em] transition-all duration-300 hover:-translate-y-0.5 md:inline-flex ${
              solid
                ? 'bg-forest text-cream hover:bg-forest-deep'
                : 'border border-cream/50 text-cream hover:border-cream hover:bg-cream/10'
            }`}
          >
            {t('cotizar')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={t('menu')}
            aria-expanded={open}
            className={`transition-colors md:hidden ${solid ? 'text-forest' : 'text-cream'}`}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-forest/10 bg-cream px-6 py-4 md:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-forest/5 py-3 text-sm text-ink/70 transition-colors hover:text-forest"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/cotizar`}
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-sm bg-forest px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-cream transition-colors hover:bg-forest-deep"
            >
              {t('cotizar')}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
