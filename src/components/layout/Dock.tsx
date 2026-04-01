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
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center justify-center shrink-0 transition-opacity duration-200 hover:opacity-80"
          >
            <Image src="/phoenix.svg" alt="Phoenix" width={24} height={24} />
          </Link>

          {/* Nav items */}
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs font-medium uppercase tracking-wide whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'text-white after:absolute after:left-0 after:-bottom-1 after:w-full after:h-px after:bg-white'
                    : 'text-white/60 hover:text-white hover:after:absolute hover:after:left-0 hover:after:-bottom-1 hover:after:w-full hover:after:h-px hover:after:bg-white/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Connect wallet - top right */}
      <div className="fixed top-4 right-6 z-50">
        <ConnectWallet />
      </div>
    </>
  );
}
