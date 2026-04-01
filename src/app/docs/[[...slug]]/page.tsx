import { getDocPage, getAllDocSlugs } from '@/lib/docs';
import { SIDEBAR } from '@/lib/docs-sidebar';
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer';
import { DocsMobileNav } from '@/components/docs/DocsSidebar';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phoenix Documentation',
};

function getAllDocs() {
  const docs: { sectionTitle: string; id: string; label: string; content: string }[] = [];
  for (const section of SIDEBAR) {
    for (const item of section.items) {
      const doc = getDocPage(item.slug);
      if (doc) {
        const id = item.slug.length === 0 ? 'introduction' : item.slug.join('-');
        docs.push({ sectionTitle: section.title, id, label: item.label, content: doc.content });
      }
    }
  }
  return docs;
}

export default function DocsPage() {
  const allDocs = getAllDocs();

  let currentSection = '';

  return (
    <>
      <DocsMobileNav />
      <div className="space-y-16">
        {allDocs.map((doc) => {
          const showSectionHeader = doc.sectionTitle !== currentSection;
          if (showSectionHeader) currentSection = doc.sectionTitle;

          return (
            <div key={doc.id}>
              {showSectionHeader && (
                <div className="mb-8 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                    {doc.sectionTitle}
                  </p>
                  <div className="h-px bg-white/5 mt-2" />
                </div>
              )}
              <section id={doc.id} className="scroll-mt-20">
                <MarkdownRenderer content={doc.content} />
              </section>
            </div>
          );
        })}
      </div>
    </>
  );
}
