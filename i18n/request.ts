import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

type AppLocale = (typeof routing.locales)[number]

// Static import map (avoids the dynamic-path import that emits a __dirname
// context module, which breaks on non-Node runtimes).
const messages: Record<AppLocale, () => Promise<{ default: Record<string, unknown> }>> = {
  es: () => import('../messages/es.json'),
  en: () => import('../messages/en.json'),
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as AppLocale)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await messages[locale as AppLocale]()).default,
  }
})
