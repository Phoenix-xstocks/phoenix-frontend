import { DocsSidebar } from '@/components/docs/DocsSidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        <DocsSidebar />
        <main className="min-w-0 flex-1 max-w-none">{children}</main>
      </div>
    </div>
  );
}
