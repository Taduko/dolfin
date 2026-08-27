import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Post } from '@/content/blog-types'

function formatDate(date: string, locale: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogCard({ post, locale }: { post: Post; locale: string }) {
  const t = useTranslations('blog')
  const l = locale === 'en' ? post.en : post.es

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden border border-forest/15 bg-cream transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_48px_-24px_rgba(27,58,45,0.35)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* TODO: swap for real article imagery — licensed Unsplash stock (see public/images/CREDITS.md) */}
        <Image
          src={post.image}
          alt={l.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 bg-cream/95 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-forest">
          {t(`cat_${post.category}`)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="text-[0.7rem] uppercase tracking-[0.18em] text-gold">
          {formatDate(post.date, locale)} · {post.readingMinutes} {t('min')}
        </p>
        <h3 className="mt-3 text-balance font-serif text-xl font-normal leading-snug text-forest">
          {l.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/60">{l.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-forest">
          {t('read_more')}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  )
}
