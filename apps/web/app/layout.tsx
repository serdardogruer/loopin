import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-main',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-title',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Loopin - Önce Etkinlik, Sonra Tanışma',
  description: 'Gerçek zamanlı sosyal etkinlik, topluluk ve buluşma platformu V2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {/* Ambient Glows */}
        <div className="ambient-glow glow-1" />
        <div className="ambient-glow glow-2" />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
