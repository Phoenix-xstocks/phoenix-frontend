'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectWallet } from '@/components/connect-wallet';
import { useScrollPastThreshold } from '@/hooks/useScrollPastThreshold';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/deposit', label: 'Deposit' },
  { href: '/notes', label: 'My Notes' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/docs', label: 'Docs' },
];

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const pastThreshold = useScrollPastThreshold(150);

  const showPill = isLanding && pastThreshold;

  if (isLanding) {
    return (
      <nav
        className={`fixed top-[1em] left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
          showPill
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-[3px]">
          {/* Logo pill */}
          <Link
            href="/"
            className="flex items-center justify-center w-[42px] h-[42px] rounded-full bg-white text-black font-bold text-sm shrink-0 transition-transform duration-200 hover:scale-105"
          >
            xY
          </Link>

          {/* Nav items container */}
          <div className="flex items-center h-[42px] rounded-full bg-white px-[3px] gap-[3px]">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center justify-center h-[36px] px-5 rounded-full text-[13px] font-semibold uppercase tracking-wide whitespace-nowrap transition-all duration-300 ease-out ${
                    isActive
                      ? 'bg-black text-white'
                      : 'bg-black/80 text-white/70 hover:bg-black hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Connect button pill */}
          <div className="flex items-center h-[42px] rounded-full bg-white px-2">
            <ConnectWallet />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-accent">Phoenix</span>
              <span className="text-xs text-muted font-mono">PROTOCOL</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-accent bg-accent/10'
                        : 'text-muted hover:text-white hover:bg-surface-2'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}
