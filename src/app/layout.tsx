import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Web3Provider } from '@/providers/Web3Provider';
import './globals.css';

const mainFont = localFont({
  src: [
    { path: '../../public/fonts/PressStart2P-Regular.ttf', weight: '400' },
    { path: '../../public/fonts/PressStart2P-Regular.ttf', weight: '700' },
  ],
  variable: '--font-main',
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
    <html lang="en" className={`dark ${mainFont.variable}`}>
      <body className="min-h-screen antialiased">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
