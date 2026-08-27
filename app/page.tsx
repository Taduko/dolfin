import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

// No i18n middleware (it pulls ua-parser-js into the Edge runtime, which
// breaks on Vercel). The root path simply redirects to the default locale;
// locale rendering is handled by the [locale] segment + setRequestLocale.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`)
}
