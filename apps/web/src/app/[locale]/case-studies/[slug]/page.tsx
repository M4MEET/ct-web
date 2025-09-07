import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { BlockRenderer } from '@/components/BlockRenderer';

interface CaseStudyPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getCaseStudy(locale: string, slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
    const response = await fetch(
      `${baseUrl}/api/case-studies?locale=${locale}&category=caseStudy&slug=${slug}`,
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      const result = await response.json();
      const caseStudies = result.data || [];
      return caseStudies.length > 0 ? caseStudies[0] : null;
    }
  } catch (error) {
    console.error('Failed to fetch case study:', error);
  }
  
  return null;
}

// For SEO metadata
export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const caseStudy = await getCaseStudy(locale, slug);

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    };
  }

  const title = `${caseStudy.title} | CodeX Terminal`;
  const description = caseStudy.seo?.description || `Learn about our ${caseStudy.title} project and how we delivered successful solutions for ${caseStudy.client}.`;

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
      canonical: `/${locale}/case-studies/${slug}`,
      languages: {
        en: `/en/case-studies/${slug}`,
        de: `/de/case-studies/${slug}`,
        fr: `/fr/case-studies/${slug}`,
      },
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { locale, slug } = await params;
  const caseStudy = await getCaseStudy(locale, slug);

  if (!caseStudy) {
    notFound();
  }

  const hasContent = 
    (caseStudy.blocks && caseStudy.blocks.length > 0) ||
    (caseStudy.page && caseStudy.page.blocks && caseStudy.page.blocks.length > 0);

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
            <Link href={`/${locale}/case-studies`} className="text-gray-500 hover:text-gray-700">
              Case Studies
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{caseStudy.title}</span>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-white">
        {/* Case Study Header */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <span className="text-4xl">{caseStudy.icon || '📊'}</span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {caseStudy.title}
              </h1>
              
              {caseStudy.client && (
                <p className="text-xl text-gray-600 mb-4">
                  Client: {caseStudy.client}
                </p>
              )}

              {caseStudy.sector && (
                <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                  <span>{caseStudy.sector}</span>
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
                caseStudy.blocks && caseStudy.blocks.length > 0 
                  ? caseStudy.blocks.map((block: any) => ({ ...block.data, id: block.id, type: block.type }))
                  : caseStudy.page.blocks
              } 
            />
          ) : (
            <div className="prose prose-lg mx-auto">
              <div className="bg-blue-50 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{caseStudy.icon || '📊'}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {caseStudy.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  This case study showcases our successful collaboration with {caseStudy.client || 'our client'}.
                  We delivered a comprehensive solution that met their specific requirements and business objectives.
                </p>
                
                {caseStudy.sector && (
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Industry</h3>
                    <p className="text-gray-600">{caseStudy.sector}</p>
                  </div>
                )}

                {caseStudy.client && (
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                    <p className="text-gray-600">{caseStudy.client}</p>
                  </div>
                )}

                <div className="border-t pt-6">
                  <p className="text-sm text-gray-500">
                    Interested in similar solutions for your business?
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

        {/* Related Case Studies */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Other Case Studies
            </h2>
            <RelatedCaseStudies locale={locale} currentSlug={slug} />
          </div>
        </div>
      </main>
    </>
  );
}

// Related case studies component
async function RelatedCaseStudies({ locale, currentSlug }: { locale: string; currentSlug: string }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
    const response = await fetch(
      `${baseUrl}/api/case-studies?locale=${locale}&category=caseStudy&status=published`,
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      const result = await response.json();
      const caseStudies = result.data || [];
      const relatedCaseStudies = caseStudies
        .filter((caseStudy: any) => caseStudy.slug !== currentSlug)
        .slice(0, 6);

      if (relatedCaseStudies.length === 0) {
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">No other case studies available at the moment.</p>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedCaseStudies.map((caseStudy: any) => (
            <Link
              key={caseStudy.slug}
              href={`/${locale}/case-studies/${caseStudy.slug}`}
              className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                  <span className="text-xl">{caseStudy.icon || '📊'}</span>
                </div>
                {caseStudy.sector && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {caseStudy.sector}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                {caseStudy.title}
              </h3>
              {caseStudy.client && (
                <p className="text-xs text-gray-500">Client: {caseStudy.client}</p>
              )}
            </Link>
          ))}
        </div>
      );
    }
  } catch (error) {
    console.error('Failed to fetch related case studies:', error);
  }

  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Unable to load related case studies at the moment.</p>
    </div>
  );
}