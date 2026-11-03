import type { Metadata } from 'next';
import './globals.css';
import { DemoDataProvider } from '@/context/demo-context';
import { DemoBanner } from '@/components/demo-banner';
import { AppShell } from '@/components/app-shell';
import { AddOrderModal } from '@/components/add-order-modal';
import { CustomerDrawer } from '@/components/customer-drawer';

export const metadata: Metadata = {
  title: 'Demo Sistem Admin — Berkah Jaya Konveksi | Nalar Solusi Digital',
  description:
    'Demo interaktif pencatatan order, DP, pelunasan, data pelanggan, dan laporan piutang untuk konveksi oleh Nalar Solusi Digital.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#f4f6f9] text-[#131416]">
        <DemoDataProvider>
          <DemoBanner />
          <AppShell>{children}</AppShell>
          <AddOrderModal />
          <CustomerDrawer />
        </DemoDataProvider>
      </body>
    </html>
  );
}
