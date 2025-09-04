import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/Navigation';
import { CodexTerminalFooter } from '@/components/CodexTerminalFooter';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodeX Terminal',
  description: 'Professional web development services',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-codex-terminal-body">
      <body className={`${inter.className} min-h-screen bg-codex-terminal-body`}>
        <Navigation />
        {children}
        <CodexTerminalFooter />
      </body>
    </html>
  );
}