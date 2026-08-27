import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import PageHero from '@/components/ui/PageHero'
import BlogCard from '@/components/blog/BlogCard'
import { posts } from '@/content/blog'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return {
    title: t('title'),
    description: t('meta_description'),
  }
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')

  return (
    <>
      <PageHero
        image="/images/hero-guatemala.jpg"
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <Section>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </Section>
    </>
  )
}
