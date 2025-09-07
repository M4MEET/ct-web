import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

interface CaseStudiesPageProps {
  params: Promise<{ locale: string }>;
}

async function getCaseStudies(locale: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
    const response = await fetch(
      `${baseUrl}/api/case-studies?locale=${locale}&category=caseStudy&status=published`,
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      const result = await response.json();
      return result.data || [];
    }
  } catch (error) {
    console.error('Failed to fetch case studies:', error);
  }
  
  return [];
}

export async function generateMetadata({ params }: CaseStudiesPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: `Case Studies | CodeX Terminal`,
    description: 'Explore our successful projects and client collaborations. See how we deliver scalable solutions across various industries.',
    openGraph: {
      title: `Case Studies | CodeX Terminal`,
      description: 'Explore our successful projects and client collaborations. See how we deliver scalable solutions across various industries.',
      type: 'website',
      locale: locale,
    },
    alternates: {
      canonical: `/${locale}/case-studies`,
      languages: {
        en: `/en/case-studies`,
        de: `/de/case-studies`,
        fr: `/fr/case-studies`,
      },
    },
  };
}

export default async function CaseStudiesPage({ params }: CaseStudiesPageProps) {
  const { locale } = await params;
  const caseStudies = await getCaseStudies(locale);

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
            <span className="text-gray-900 font-medium">Case Studies</span>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Case Studies
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore our successful projects and client collaborations. See how we deliver scalable solutions across various industries.
              </p>
            </div>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((caseStudy: any) => (
                <Link
                  key={caseStudy.slug}
                  href={`/${locale}/case-studies/${caseStudy.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 transition-colors">
                        <span className="text-2xl">{caseStudy.icon || '📊'}</span>
                      </div>
                      {caseStudy.sector && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          {caseStudy.sector}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {caseStudy.title}
                    </h3>
                    
                    {caseStudy.client && (
                      <p className="text-gray-600 mb-4">
                        Client: {caseStudy.client}
                      </p>
                    )}
                    
                    <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-medium">
                      <span>View Case Study</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Case Studies Coming Soon
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We're currently preparing detailed case studies of our successful projects. Check back soon to see our work in action.
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get in Touch
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}