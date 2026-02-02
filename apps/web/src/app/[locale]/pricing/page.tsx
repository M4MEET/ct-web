import Link from 'next/link';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const content = {
    en: {
      badge: 'Pricing',
      title: 'Transparent & Flexible Pricing',
      subtitle: 'We offer customized pricing based on your specific needs. Contact us for a detailed quote.',
      cta: 'Request a Quote',
      features: [
        { icon: '💰', title: 'Project-Based', desc: 'Fixed price for defined scope projects' },
        { icon: '⏱️', title: 'Time & Materials', desc: 'Flexible hourly or daily rates' },
        { icon: '🔄', title: 'Retainer', desc: 'Monthly support and maintenance packages' },
        { icon: '🎯', title: 'Milestone-Based', desc: 'Payment tied to project deliverables' }
      ]
    },
    de: {
      badge: 'Preise',
      title: 'Transparente & Flexible Preisgestaltung',
      subtitle: 'Wir bieten individuelle Preise basierend auf Ihren spezifischen Anforderungen. Kontaktieren Sie uns für ein detailliertes Angebot.',
      cta: 'Angebot Anfordern',
      features: [
        { icon: '💰', title: 'Projektbasiert', desc: 'Festpreis für definierte Projektumfänge' },
        { icon: '⏱️', title: 'Zeit & Material', desc: 'Flexible Stunden- oder Tagessätze' },
        { icon: '🔄', title: 'Retainer', desc: 'Monatliche Support- und Wartungspakete' },
        { icon: '🎯', title: 'Meilensteinbasiert', desc: 'Zahlung gebunden an Projektergebnisse' }
      ]
    },
    fr: {
      badge: 'Tarifs',
      title: 'Tarification Transparente & Flexible',
      subtitle: 'Nous offrons des tarifs personnalisés selon vos besoins spécifiques. Contactez-nous pour un devis détaillé.',
      cta: 'Demander un Devis',
      features: [
        { icon: '💰', title: 'Par Projet', desc: 'Prix fixe pour les projets définis' },
        { icon: '⏱️', title: 'Temps & Matériaux', desc: 'Tarifs horaires ou journaliers flexibles' },
        { icon: '🔄', title: 'Forfait', desc: 'Packages mensuels de support et maintenance' },
        { icon: '🎯', title: 'Par Étapes', desc: 'Paiement lié aux livrables du projet' }
      ]
    }
  };

  const c = content[locale as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              {c.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {c.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {c.subtitle}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              {c.cta}
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg text-center">
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return {
    title: locale === 'de' ? 'Preise | CodeX Terminal' : locale === 'fr' ? 'Tarifs | CodeX Terminal' : 'Pricing | CodeX Terminal',
    description: locale === 'de'
      ? 'Transparente und flexible Preisgestaltung für Ihre Entwicklungsprojekte.'
      : locale === 'fr'
      ? 'Tarification transparente et flexible pour vos projets de développement.'
      : 'Transparent and flexible pricing for your development projects.',
  };
}
