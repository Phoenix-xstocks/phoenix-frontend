'use client';

import { Dock } from '@/components/layout/Dock';
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
        <HeroScene scrollProgress={0} centerMode />
      </div>
      <Dock />
      <div className="relative z-0">
        {children}
      </div>
      {/* PHOENIX watermark — same as landing page */}
      <div className="relative overflow-hidden flex items-end justify-center pb-0 mt-20">
        <span
          className="select-none pointer-events-none font-bold text-white/[0.1] text-[9rem] md:text-[16rem] lg:text-[23rem] leading-none tracking-tight translate-y-[10%] whitespace-nowrap"
          style={{ maskImage: 'linear-gradient(to bottom, white 30%, transparent 90%)', WebkitMaskImage: 'linear-gradient(to bottom, white 30%, transparent 90%)' }}
        >
          PHOENIX
        </span>
      </div>
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
