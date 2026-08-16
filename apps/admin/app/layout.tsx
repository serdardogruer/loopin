import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Loopin V2 - Admin & Moderation Panel',
  description: 'Loopin Yönetim, Moderasyon ve Finansal Raporlama Paneli',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="antialiased bg-[#0B0F19] text-white">
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
