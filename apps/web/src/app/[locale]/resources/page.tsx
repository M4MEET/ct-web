import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('resources');

  const resources = [
    {
      title: locale === 'de' ? 'Technologien' : locale === 'fr' ? 'Technologies' : 'Technologies',
      description: locale === 'de'
        ? 'Entdecken Sie die Technologien und Tools, die wir verwenden'
        : locale === 'fr'
        ? 'Découvrez les technologies et outils que nous utilisons'
        : 'Discover the technologies and tools we use',
      href: `/${locale}/technologies`,
      icon: '⚡'
    },
    {
      title: locale === 'de' ? 'Fallstudien' : locale === 'fr' ? 'Études de Cas' : 'Case Studies',
      description: locale === 'de'
        ? 'Lesen Sie über unsere erfolgreichen Projekte'
        : locale === 'fr'
        ? 'Découvrez nos projets réussis'
        : 'Read about our successful projects',
      href: `/${locale}/case-studies`,
      icon: '📊'
    },
    {
      title: locale === 'de' ? 'Dienstleistungen' : locale === 'fr' ? 'Services' : 'Services',
      description: locale === 'de'
        ? 'Alle unsere professionellen Dienstleistungen'
        : locale === 'fr'
        ? 'Tous nos services professionnels'
        : 'All our professional services',
      href: `/${locale}/services`,
      icon: '🛠️'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              {locale === 'de' ? 'Ressourcen' : locale === 'fr' ? 'Ressources' : 'Resources'}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {locale === 'de'
                ? 'Ressourcen & Einblicke'
                : locale === 'fr'
                ? 'Ressources & Insights'
                : 'Resources & Insights'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {locale === 'de'
                ? 'Entdecken Sie Technologien, Fallstudien und Einblicke aus unserer Arbeit.'
                : locale === 'fr'
                ? 'Découvrez des technologies, études de cas et insights de notre travail.'
                : 'Explore technologies, case studies, and insights from our work.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <Link
                key={index}
                href={resource.href}
                className="group bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-4xl mb-4 block">{resource.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <span className="text-primary-600 font-medium flex items-center">
                  {locale === 'de' ? 'Mehr erfahren' : locale === 'fr' ? 'En savoir plus' : 'Learn more'}
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles = {
    en: 'Resources & Insights | CodeX Terminal',
    de: 'Ressourcen & Einblicke | CodeX Terminal',
    fr: 'Ressources & Insights | CodeX Terminal'
  };

  const descriptions = {
    en: 'Explore our resources including technologies, case studies, and insights from our professional development work.',
    de: 'Entdecken Sie unsere Ressourcen einschließlich Technologien, Fallstudien und Einblicke aus unserer professionellen Entwicklungsarbeit.',
    fr: 'Découvrez nos ressources incluant technologies, études de cas et insights de notre travail de développement professionnel.'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}
