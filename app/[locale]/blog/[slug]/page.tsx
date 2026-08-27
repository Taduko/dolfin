import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Section from '@/components/ui/Section'
import PageHero from '@/components/ui/PageHero'
import CTABand from '@/components/ui/CTABand'
import PostBody from '@/components/blog/PostBody'
import BlogCard from '@/components/blog/BlogCard'
import { getPost, localized, posts, relatedPosts } from '@/content/blog'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dolfingtravel.com'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const l = localized(post, locale)
  const url = `${BASE_URL}/${locale}/blog/${slug}`
  return {
    title: l.title,
    description: l.excerpt,
    keywords: l.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: l.title,
      description: l.excerpt,
      url,
      publishedTime: post.date,
      images: [{ url: `${BASE_URL}${post.image}` }],
    },
  }
}

function formatDate(date: string, locale: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = getPost(slug)
  if (!post) notFound()

  const t = await getTranslations('blog')
  const l = localized(post, locale)
  const related = relatedPosts(slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: l.title,
    description: l.excerpt,
    datePublished: post.date,
    image: `${BASE_URL}${post.image}`,
    inLanguage: locale,
    keywords: l.keywords.join(', '),
    author: { '@type': 'Organization', name: 'Dolfing Travel' },
    publisher: { '@type': 'Organization', name: 'Dolfing Travel' },
    mainEntityOfPage: `${BASE_URL}/${locale}/blog/${slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero image={post.image} eyebrow={t(`cat_${post.category}`)} title={l.title} />

      <Section>
        <Link
          href={`/${locale}/blog`}
          className="mb-10 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-ink/50 transition-colors hover:text-forest"
        >
          ← {t('back')}
        </Link>

        <p className="mb-10 text-[0.7rem] uppercase tracking-[0.18em] text-gold">
          {formatDate(post.date, locale)} · {post.readingMinutes} {t('min')}
        </p>

        <article>
          <PostBody content={l.body} />
        </article>
      </Section>

      {related.length > 0 && (
        <Section tone="sand">
          <h2 className="mb-10 font-serif text-2xl font-normal text-forest md:text-3xl">{t('related')}</h2>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} locale={locale} />
            ))}
          </div>
        </Section>
      )}

      <CTABand image="/images/semuc.jpg" />
    </>
  )
}
