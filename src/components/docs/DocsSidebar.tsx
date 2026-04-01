'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SIDEBAR, type SidebarSection } from '@/lib/docs-sidebar';

function slugToHref(slug: string[]): string {
  if (slug.length === 0) return '/docs';
  return '/docs/' + slug.join('/');
}

function SectionGroup({ section }: { section: SidebarSection }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-muted mb-2 hover:text-white transition-colors"
      >
        {section.title}
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="space-y-0.5">
          {section.items.map((item) => {
            const href = slugToHref(item.slug);
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'text-accent bg-accent/10 font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-surface-2'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function DocsSidebar() {
  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 pb-8">
        {SIDEBAR.map((section) => (
          <SectionGroup key={section.title} section={section} />
        ))}
      </nav>
    </aside>
  );
}

export function DocsMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-sm text-muted hover:text-white transition-colors w-full"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Navigation
        <svg
          className={`w-3 h-3 ml-auto transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="mt-2 p-4 rounded-lg bg-surface border border-border max-h-80 overflow-y-auto">
          {SIDEBAR.map((section) => (
            <SectionGroup key={section.title} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}
