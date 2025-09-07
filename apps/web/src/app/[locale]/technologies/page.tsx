import { Metadata } from 'next';
import Link from 'next/link';

interface TechnologiesPageProps {
  params: Promise<{ locale: string }>;
}

async function getTechnologies(locale: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
    const response = await fetch(
      `${baseUrl}/api/case-studies?locale=${locale}&category=technology&status=published`,
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      const result = await response.json();
      return result.data || [];
    }
  } catch (error) {
    console.error('Failed to fetch technologies:', error);
  }
  
  // Fallback technologies if API fails
  return [
    { title: 'React', slug: 'react', icon: '⚛️', sector: 'Frontend Framework', client: 'Multiple Projects' },
    { title: 'Node.js', slug: 'nodejs', icon: '🟢', sector: 'Backend Runtime', client: 'Server Applications' },
    { title: 'TypeScript', slug: 'typescript', icon: '🔷', sector: 'Programming Language', client: 'Type-Safe Development' },
    { title: 'Next.js', slug: 'nextjs', icon: '▲', sector: 'Full-Stack Framework', client: 'Web Applications' },
    { title: 'Tailwind CSS', slug: 'tailwind', icon: '🎨', sector: 'CSS Framework', client: 'UI Development' },
    { title: 'PostgreSQL', slug: 'postgresql', icon: '🐘', sector: 'Database', client: 'Data Storage' },
  ];
}

export async function generateMetadata({ params }: TechnologiesPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const title = 'Technologies | CodeX Terminal';
  const description = 'Explore the cutting-edge technologies we use to build scalable, high-performance solutions. From React and Node.js to cloud infrastructure and databases.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/technologies`,
      languages: {
        en: '/en/technologies',
        de: '/de/technologies',
        fr: '/fr/technologies',
      },
    },
  };
}

export default async function TechnologiesPage({ params }: TechnologiesPageProps) {
  const { locale } = await params;
  const technologies = await getTechnologies(locale);

  // Group technologies by sector/category
  const groupedTechnologies = technologies.reduce((acc: any, tech: any) => {
    const category = tech.sector || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tech);
    return acc;
  }, {});

  const categories = Object.keys(groupedTechnologies).sort();

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
            <span className="text-gray-900 font-medium">Technologies</span>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <span className="text-3xl">⚙️</span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Our Technologies
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We leverage cutting-edge technologies to build scalable, high-performance solutions. 
                Explore our technology stack and see how we use these tools to deliver exceptional results.
              </p>
            </div>
          </div>
        </div>

        {/* Technologies Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {categories.length > 0 ? (
            <div className="space-y-16">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    {category}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groupedTechnologies[category].map((tech: any) => (
                      <Link
                        key={tech.slug}
                        href={`/${locale}/technologies/${tech.slug}`}
                        className="group bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-200 hover:border-primary-300"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center group-hover:from-primary-100 group-hover:to-primary-200 transition-colors">
                            <span className="text-2xl">{tech.icon || '⚙️'}</span>
                          </div>
                          
                          <div className="flex-grow min-w-0">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                              {tech.title}
                            </h3>
                            
                            {tech.sector && tech.sector !== category && (
                              <p className="text-sm text-primary-600 font-medium mb-2">
                                {tech.sector}
                              </p>
                            )}
                            
                            {tech.client && (
                              <p className="text-gray-600 text-sm">
                                {tech.client}
                              </p>
                            )}
                            
                            <div className="flex items-center mt-4 text-primary-600 text-sm font-medium group-hover:text-primary-700">
                              <span>Learn more</span>
                              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Technologies Available
              </h2>
              <p className="text-gray-600 mb-8">
                We're currently updating our technology showcase. Please check back soon!
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

        {/* CTA Section */}
        <div className="bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
                Let's discuss how these technologies can help bring your project to life. 
                Our team is ready to deliver exceptional results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Start a Project
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/services`}
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-colors font-medium"
                >
                  View Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}