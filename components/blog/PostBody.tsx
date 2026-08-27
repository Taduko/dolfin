import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

// Renders a post's Markdown body with the site's editorial typography.
const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-14 mb-5 text-balance font-serif text-2xl font-normal tracking-[-0.01em] text-forest md:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-9 mb-3 font-serif text-xl font-normal text-forest">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-6 leading-[1.8] text-ink/75 md:text-lg">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-6 ml-1 space-y-2.5 text-ink/75 md:text-lg">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 ml-1 list-decimal space-y-2.5 pl-5 text-ink/75 md:text-lg marker:text-gold">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="relative pl-6 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-gold/70 [ol_&]:pl-1 [ol_&]:before:hidden">
      {children}
    </li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-forest underline decoration-gold/60 decoration-1 underline-offset-4 transition-colors hover:text-gold"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-gold pl-6 font-serif text-xl italic leading-relaxed text-forest">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong className="font-medium text-forest">{children}</strong>,
  h1: ({ children }) => (
    <h2 className="mt-14 mb-5 font-serif text-2xl font-normal text-forest md:text-3xl">{children}</h2>
  ),
}

export default function PostBody({ content }: { content: string }) {
  return (
    <div className="max-w-2xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
