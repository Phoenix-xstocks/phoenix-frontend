import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Web3Provider } from '@/providers/Web3Provider';
import './globals.css';

const fkGrotesk = localFont({
  src: '../../public/fonts/FKGrotesk.woff2',
  variable: '--font-fk-grotesk',
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
    <html lang="en" className={`dark ${fkGrotesk.variable}`}>
      <body className="min-h-screen antialiased">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
