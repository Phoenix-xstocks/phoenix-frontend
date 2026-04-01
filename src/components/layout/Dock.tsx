'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ConnectWallet } from '@/components/connect-wallet';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/app/deposit', label: 'Deposit' },
  { href: '/app/dashboard', label: 'Dashboard' },
];

export function Dock() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center shrink-0 transition-opacity duration-200 hover:opacity-80"
        >
          <Image src="/phoenix.svg" alt="Phoenix" width={24} height={24} />
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

        {/* Connect wallet */}
        <ConnectWallet />
      </div>
    </nav>
  );
}
