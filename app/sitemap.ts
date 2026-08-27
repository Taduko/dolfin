import type { MetadataRoute } from 'next'
import { posts } from '@/content/blog'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dolfingtravel.com'
const locales = ['es', 'en']

const routes = [
  '',
  '/servicios/fit',
  '/servicios/mice',
  '/servicios/agencias',
  '/nosotros',
  '/destinos',
  '/blog',
  '/cotizar',
  '/contacto',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    })),
  )

  const postEntries = locales.flatMap((locale) =>
    posts.map((post) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date + 'T00:00:00'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  )

  return [...staticEntries, ...postEntries]
}
