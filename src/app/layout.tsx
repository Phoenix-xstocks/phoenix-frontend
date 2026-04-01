import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Outfit } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';

const Web3Provider = dynamic(
  () => import('@/providers/Web3Provider').then((mod) => mod.Web3Provider),
  { ssr: false }
);

const mainFont = localFont({
  src: '../../public/fonts/Inter-Regular.woff2',
  variable: '--font-main',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Phoenix Protocol',
  description: 'Permissionless Autocall on Tokenized Equities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${mainFont.variable} ${outfit.variable}`}>
      <body className="min-h-screen antialiased">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
