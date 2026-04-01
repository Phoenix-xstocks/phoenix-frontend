import Image from 'next/image';
import Link from 'next/link';

const FOOTER_COLUMNS = [
  {
    title: 'Protocol',
    links: [
      { label: 'App', href: '/deposit' },
      { label: 'Documentation', href: '#' },
      { label: 'Whitepaper', href: '#' },
      { label: 'Smart Contracts', href: '#' },
    ],
  },
  {
    title: 'Data & Analytics',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Dune', href: '#' },
      { label: 'DeFi Llama', href: '#' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Twitter', href: '#' },
      { label: 'Discord', href: '#' },
      { label: 'Telegram', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Brand', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-24">
        <div className="flex flex-col md:flex-row gap-12 md:gap-0">
          {/* Logo */}
          <div className="md:w-1/4">
            <Image src="/phoenix.svg" alt="Phoenix" width={32} height={32} className="invert opacity-80" />
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 md:w-3/4">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-medium text-white mb-5">{col.title}</h4>
                <ul className="space-y-3.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/40 hover:text-white/70 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Large watermark text */}
      <div className="relative h-32 md:h-44 overflow-hidden select-none pointer-events-none">
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[12rem] md:text-[18rem] font-bold leading-none tracking-tighter text-white/[0.03] whitespace-nowrap translate-y-[30%]">
          PHOENIX
        </span>
      </div>

    </footer>
  );
}
