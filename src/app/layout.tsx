import type { Metadata } from 'next';
import { GeistPixelTriangle } from 'geist/font/pixel';
import { Web3Provider } from '@/providers/Web3Provider';
import { Dock } from '@/components/layout/Dock';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'xYield Protocol',
  description: 'Permissionless Autocall on Tokenized Equities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${GeistPixelTriangle.variable}`}>
      <body className="min-h-screen antialiased">
        <Web3Provider>
          <Dock />
          {children}
          <Footer />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111827',
                border: '1px solid #374151',
                color: '#e5e7eb',
              },
            }}
          />
        </Web3Provider>
      </body>
    </html>
  );
}
