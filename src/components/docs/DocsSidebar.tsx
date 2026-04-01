'use client';

import { useState, useEffect } from 'react';
import { SIDEBAR, type SidebarSection } from '@/lib/docs-sidebar';

function slugToId(slug: string[]): string {
  if (slug.length === 0) return 'introduction';
  return slug.join('-');
}

function useActiveSection() {
  const [activeId, setActiveId] = useState('introduction');

  useEffect(() => {
    const ids = SIDEBAR.flatMap(s => s.items.map(i => slugToId(i.slug)));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return activeId;
}

function SectionGroup({ section, activeId }: { section: SidebarSection; activeId: string }) {
  const sectionIds = section.items.map(i => slugToId(i.slug));
  const hasActive = sectionIds.includes(activeId);
  const [open, setOpen] = useState(hasActive || section.title === 'Protocol');

  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-1 hover:text-gray-400 transition-colors cursor-pointer"
      >
        {section.title}
        <svg
          className={`w-2.5 h-2.5 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="space-y-px">
          {section.items.map((item) => {
            const id = slugToId(item.slug);
            const isActive = activeId === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`block px-3 py-1 rounded text-[13px] transition-colors ${
                    isActive
                      ? 'text-white bg-white/5'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function DocsSidebar() {
  const activeId = useActiveSection();

  return (
    <aside className="w-52 shrink-0 hidden lg:block">
      <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8">
        {SIDEBAR.map((section) => (
          <SectionGroup key={section.title} section={section} activeId={activeId} />
        ))}
      </nav>
    </aside>
  );
}

export function DocsMobileNav() {
  const [open, setOpen] = useState(false);
  const activeId = useActiveSection();

  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-500 hover:text-white transition-colors w-full border border-white/5 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Navigation
      </button>
      {open && (
        <div className="mt-2 p-3 rounded border border-white/5 max-h-80 overflow-y-auto">
          {SIDEBAR.map((section) => (
            <SectionGroup key={section.title} section={section} activeId={activeId} />
          ))}
        </div>
      )}
    </div>
  );
}
