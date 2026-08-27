// Blog content model. Each post is authored as a typed module under
// content/posts/<slug>.ts and collected in content/blog.ts.

export type PostCategory = 'fit' | 'mice' | 'agencias' | 'guide'

export type LocalizedPost = {
  /** SEO <title> / H1 */
  title: string
  /** Meta description + listing excerpt (1-2 sentences) */
  excerpt: string
  /** SEO keywords */
  keywords: string[]
  /** Article body as Markdown (no H1 — the title is the H1) */
  body: string
}

export type Post = {
  /** URL slug, shared across locales: /[locale]/blog/<slug> */
  slug: string
  /** ISO date (yyyy-mm-dd) */
  date: string
  /** Hero/card image under /public */
  image: string
  category: PostCategory
  /** Estimated reading time in minutes */
  readingMinutes: number
  es: LocalizedPost
  en: LocalizedPost
}
