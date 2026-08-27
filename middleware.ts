import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

// Locale prefixing is handled here by hand rather than with next-intl's
// createMiddleware: that helper pulls ua-parser-js into the Edge runtime, which
// breaks on Vercel (see the note in app/page.tsx). Message loading stays with
// the [locale] segment via setRequestLocale.
const locales: readonly string[] = routing.locales

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
  if (hasLocale) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/${routing.defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: ['/((?!api|_next|_vercel|.*\..*).*)'],
}
