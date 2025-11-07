import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/context/Providers';

export const metadata: Metadata = {
  title: 'Achir Bayron LLC - Delivery Tracking Service',
  description: 'Real-time delivery tracking system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
