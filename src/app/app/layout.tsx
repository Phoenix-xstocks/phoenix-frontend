'use client';

import { Dock } from '@/components/layout/Dock';
import { Footer } from '@/components/layout/Footer';
import { HeroScene } from '@/components/hero-scene';
import { Toaster } from 'sonner';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed inset-0 -z-10">
        <HeroScene scrollProgress={0.5} />
      </div>
      <div className="fixed left-0 top-1/2 -translate-y-1/2 w-[280px] h-[400px] z-10 hidden xl:block pointer-events-none opacity-70">
        <HeroScene scrollProgress={0} centerMode className="w-full h-full" />
      </div>
      <Dock />
      <div className="relative">
        {children}
      </div>
      <Footer />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#e5e7eb',
          },
        }}
      />
    </>
  );
}
