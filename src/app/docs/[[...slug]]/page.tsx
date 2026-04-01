import { notFound } from 'next/navigation';
import { getDocPage, getAllDocSlugs } from '@/lib/docs';
import { SIDEBAR } from '@/lib/docs-sidebar';
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer';
import { DocsMobileNav } from '@/components/docs/DocsSidebar';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug?: string[] };
}

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({
    slug: slug.length === 0 ? undefined : slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const slug = params.slug ?? [];
  const doc = getDocPage(slug);
  return {
    title: doc ? `${doc.title} | xYield Docs` : 'xYield Documentation',
  };
}

function getAdjacentPages(currentSlug: string[]) {
  const allItems = SIDEBAR.flatMap((s) => s.items);
  const currentHref = currentSlug.length === 0 ? '/docs' : '/docs/' + currentSlug.join('/');
  const idx = allItems.findIndex(
    (item) => (item.slug.length === 0 ? '/docs' : '/docs/' + item.slug.join('/')) === currentHref
  );

  const prev = idx > 0 ? allItems[idx - 1] : null;
  const next = idx < allItems.length - 1 ? allItems[idx + 1] : null;

  return { prev, next };
}

export default function DocsPage({ params }: PageProps) {
  const slug = params.slug ?? [];
  const doc = getDocPage(slug);

  if (!doc) {
    notFound();
  }

  const { prev, next } = getAdjacentPages(slug);

  return (
    <>
      <DocsMobileNav />
      <article>
        <MarkdownRenderer content={doc.content} />

        <nav className="mt-12 pt-6 border-t border-border flex items-center justify-between">
          {prev ? (
            <Link
              href={prev.slug.length === 0 ? '/docs' : '/docs/' + prev.slug.join('/')}
              className="group flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {prev.label}
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={next.slug.length === 0 ? '/docs' : '/docs/' + next.slug.join('/')}
              className="group flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
            >
              {next.label}
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </article>
    </>
  );
}
