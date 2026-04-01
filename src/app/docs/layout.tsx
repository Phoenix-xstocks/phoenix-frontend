import Link from 'next/link';
import { DocsSidebar } from '@/components/docs/DocsSidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: '#e5e7eb' }}>
      {/* Simple top bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[var(--background)]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Phoenix
          </Link>
          <span className="text-xs text-gray-600">Documentation</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-10">
        <DocsSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
