'use client';

import { useEffect, useRef } from 'react';
import { Dock } from '@/components/layout/Dock';
import { Toaster } from 'sonner';

function OperatorStartup() {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    fetch('/api/operator/fulfill-pending', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.fulfilled?.length > 0) {
          console.log(`[operator] Fulfilled ${data.fulfilled.length} pending requests at startup`);
        }
        if (data.errors?.length > 0) {
          console.warn('[operator] Errors:', data.errors);
        }
      })
      .catch((err) => console.error('[operator] Startup scan failed:', err));
  }, []);
  return null;
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OperatorStartup />
      <Dock />
      <div className="relative z-0 bg-black min-h-screen">
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
