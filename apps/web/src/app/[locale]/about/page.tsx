import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { BlockRenderer } from '@/components/BlockRenderer';

interface AboutPageProps {
  params: {
    locale: string;
  };
}

async function getPageData(locale: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/api/pages?slug=about&locale=${locale}`, {
      cache: 'no-store' // No caching for testing
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch page data');
    }
    
    const result = await response.json();
    return result.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  const page = await getPageData(locale);
  
  if (!page) {
    return {
      title: 'About Us - CodeX Terminal',
      description: 'Learn about CodeX Terminal, our mission, and our commitment to excellence.',
    };
  }

  return {
    title: page.seo?.title || page.title || 'About Us - CodeX Terminal',
    description: page.seo?.description || 'Learn about CodeX Terminal, our mission, and our commitment to excellence.',
    openGraph: {
      title: page.seo?.title || page.title || 'About Us - CodeX Terminal',
      description: page.seo?.description || 'Learn about CodeX Terminal, our mission, and our commitment to excellence.',
    },
    twitter: {
      title: page.seo?.title || page.title || 'About Us - CodeX Terminal',
      description: page.seo?.description || 'Learn about CodeX Terminal, our mission, and our commitment to excellence.',
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const page = await getPageData(locale);
  
  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20">
      <BlockRenderer blocks={page.blocks} />
    </main>
  );
}