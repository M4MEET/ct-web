import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SessionTracker } from '@/components/SessionTracker';
import '../globals.css';

const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-inter' 
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-jetbrains-mono' 
});

export const metadata: Metadata = {
  title: 'CodeX Terminal',
  description: 'Professional web development services',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  // Normalize locale to prevent hydration mismatch
  const normalizedLocale = locale === 'de' ? 'de' : locale === 'fr' ? 'fr' : 'en';
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionTracker />
      <div>
        <Navigation />
        
        
        <main className="min-h-screen">
          {children}
        </main>
        <Footer locale={normalizedLocale} />
      </div>
    </NextIntlClientProvider>
  );
}