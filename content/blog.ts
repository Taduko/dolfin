import type { Post, LocalizedPost } from './blog-types'
import itinerary from './posts/guatemala-itinerary'
import bestTime from './posts/best-time-to-visit-guatemala'
import incentive from './posts/guatemala-incentive-travel'
import chooseDmc from './posts/choose-dmc-guatemala'

// Newest first.
export const posts: Post[] = [chooseDmc, incentive, bestTime, itinerary].sort((a, b) =>
  a.date < b.date ? 1 : -1,
)

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function localized(post: Post, locale: string): LocalizedPost {
  return locale === 'en' ? post.en : post.es
}

export function relatedPosts(slug: string, limit = 2): Post[] {
  return posts.filter((p) => p.slug !== slug).slice(0, limit)
}
