import Link from 'next/link';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const titles = {
    en: 'Blog',
    de: 'Blog',
    fr: 'Blog'
  };

  const subtitles = {
    en: 'Coming Soon',
    de: 'Demnächst verfügbar',
    fr: 'Bientôt disponible'
  };

  const descriptions = {
    en: 'We\'re working on bringing you valuable insights, tutorials, and industry news. Check back soon!',
    de: 'Wir arbeiten daran, Ihnen wertvolle Einblicke, Tutorials und Branchennews zu bringen. Schauen Sie bald wieder vorbei!',
    fr: 'Nous travaillons pour vous apporter des insights, tutoriels et actualités du secteur. Revenez bientôt!'
  };

  const ctas = {
    en: 'View Our Services',
    de: 'Unsere Dienstleistungen ansehen',
    fr: 'Voir nos services'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center py-20">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl">📝</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {titles[locale as keyof typeof titles] || titles.en}
        </h1>
        <p className="text-2xl text-primary-600 font-semibold mb-6">
          {subtitles[locale as keyof typeof subtitles] || subtitles.en}
        </p>
        <p className="text-lg text-gray-600 mb-8">
          {descriptions[locale as keyof typeof descriptions] || descriptions.en}
        </p>
        <Link
          href={`/${locale}/services`}
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
        >
          {ctas[locale as keyof typeof ctas] || ctas.en}
        </Link>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles = {
    en: 'Blog | CodeX Terminal',
    de: 'Blog | CodeX Terminal',
    fr: 'Blog | CodeX Terminal'
  };

  const descriptions = {
    en: 'Insights, tutorials, and industry news from CodeX Terminal. Coming soon!',
    de: 'Einblicke, Tutorials und Branchennews von CodeX Terminal. Demnächst verfügbar!',
    fr: 'Insights, tutoriels et actualités du secteur par CodeX Terminal. Bientôt disponible!'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}
