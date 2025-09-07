import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { BlockRenderer } from '@/components/BlockRenderer';

interface TechnologyPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getTechnology(locale: string, slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/case-studies?locale=${locale}&category=technology&slug=${slug}`,
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      const result = await response.json();
      const technologies = result.data || [];
      return technologies.length > 0 ? technologies[0] : null;
    }
  } catch (error) {
    console.error('Failed to fetch technology:', error);
  }
  
  return null;
}

// For SEO metadata
export async function generateMetadata({ params }: TechnologyPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const technology = await getTechnology(locale, slug);

  if (!technology) {
    return {
      title: 'Technology Not Found',
    };
  }

  const title = `${technology.title} | CodeX Terminal`;
  const description = technology.seo?.description || `Learn more about ${technology.title} technology and how we use it to build scalable solutions.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/technologies/${slug}`,
      languages: {
        en: `/en/technologies/${slug}`,
        de: `/de/technologies/${slug}`,
        fr: `/fr/technologies/${slug}`,
      },
    },
  };
}

export default async function TechnologyPage({ params }: TechnologyPageProps) {
  const { locale, slug } = await params;
  const technology = await getTechnology(locale, slug);

  if (!technology) {
    notFound();
  }

  const hasContent = 
    (technology.blocks && technology.blocks.length > 0) ||
    (technology.page && technology.page.blocks && technology.page.blocks.length > 0);

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4 text-sm">
            <Link href={`/${locale}`} className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${locale}/technologies`} className="text-gray-500 hover:text-gray-700">
              Technologies
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{technology.title}</span>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-white">
        {/* Technology Header */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <span className="text-4xl">{technology.icon || '⚙️'}</span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {technology.title}
              </h1>
              
              {technology.sector && (
                <p className="text-xl text-gray-600 mb-4">
                  {technology.sector}
                </p>
              )}

              {technology.client && (
                <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                  <span>Used in: {technology.client}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {hasContent ? (
            <BlockRenderer 
              blocks={
                technology.blocks && technology.blocks.length > 0 
                  ? technology.blocks.map((block: any) => ({ ...block.data, id: block.id, type: block.type }))
                  : technology.page.blocks
              } 
            />
          ) : (
            <div className="prose prose-lg mx-auto">
              <div className="bg-blue-50 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{technology.icon || '⚙️'}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {technology.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {technology.title} is one of the key technologies in our development stack. 
                  We leverage its capabilities to build scalable, high-performance solutions for our clients.
                </p>
                
                {technology.sector && (
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                    <p className="text-gray-600">{technology.sector}</p>
                  </div>
                )}

                {technology.client && (
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Context</h3>
                    <p className="text-gray-600">{technology.client}</p>
                  </div>
                )}

                <div className="border-t pt-6">
                  <p className="text-sm text-gray-500">
                    Interested in learning more about how we use {technology.title} in our projects?
                  </p>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Get in Touch
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Technologies */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Other Technologies We Use
            </h2>
            <RelatedTechnologies locale={locale} currentSlug={slug} />
          </div>
        </div>
      </main>
    </>
  );
}

// Related technologies component
async function RelatedTechnologies({ locale, currentSlug }: { locale: string; currentSlug: string }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/case-studies?locale=${locale}&category=technology&status=published`,
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      const result = await response.json();
      const technologies = result.data || [];
      const relatedTechnologies = technologies
        .filter((tech: any) => tech.slug !== currentSlug)
        .slice(0, 6);

      if (relatedTechnologies.length === 0) {
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">No other technologies available at the moment.</p>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {relatedTechnologies.map((tech: any) => (
            <Link
              key={tech.slug}
              href={`/${locale}/technologies/${tech.slug}`}
              className="group bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-50 transition-colors">
                <span className="text-xl">{tech.icon || '⚙️'}</span>
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                {tech.title}
              </h3>
              {tech.sector && (
                <p className="text-xs text-gray-500 mt-1">{tech.sector}</p>
              )}
            </Link>
          ))}
        </div>
      );
    }
  } catch (error) {
    console.error('Failed to fetch related technologies:', error);
  }

  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Unable to load related technologies at the moment.</p>
    </div>
  );
}