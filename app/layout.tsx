import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Johnson Jose | Brand + Hyperliquid Paper Trading',
  description: 'Personal brand platform and real-time Hyperliquid perpetuals paper trading experience.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
