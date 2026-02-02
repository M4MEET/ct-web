export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const content = {
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: January 2026',
      sections: [
        {
          title: 'Acceptance of Terms',
          content: 'By accessing and using the CodeX Terminal website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'
        },
        {
          title: 'Services',
          content: 'CodeX Terminal provides software development, consulting, and related professional services. The specific scope, deliverables, and terms for any project will be outlined in a separate agreement or statement of work.'
        },
        {
          title: 'Intellectual Property',
          content: 'Unless otherwise agreed in writing, all intellectual property created during a project belongs to the client upon full payment. CodeX Terminal retains the right to use non-confidential work in our portfolio.'
        },
        {
          title: 'Payment Terms',
          content: 'Payment terms are specified in individual project agreements. Standard terms require a deposit before work begins and payment upon delivery of milestones or final deliverables.'
        },
        {
          title: 'Confidentiality',
          content: 'We treat all client information as confidential and will not disclose it to third parties without consent, except as required by law or necessary to provide our services.'
        },
        {
          title: 'Limitation of Liability',
          content: 'CodeX Terminal\'s liability is limited to the amount paid for services. We are not liable for indirect, incidental, or consequential damages arising from the use of our services.'
        },
        {
          title: 'Termination',
          content: 'Either party may terminate services with written notice as specified in the project agreement. Upon termination, the client pays for work completed and retains rights to paid deliverables.'
        },
        {
          title: 'Governing Law',
          content: 'These terms are governed by the laws of the United Kingdom. Any disputes shall be resolved through arbitration or in the courts of England and Wales.'
        },
        {
          title: 'Changes to Terms',
          content: 'We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the updated terms.'
        }
      ]
    },
    de: {
      title: 'Allgemeine Geschäftsbedingungen',
      lastUpdated: 'Zuletzt aktualisiert: Januar 2026',
      sections: [
        {
          title: 'Annahme der Bedingungen',
          content: 'Durch den Zugriff auf und die Nutzung der CodeX Terminal Website und Dienste akzeptieren Sie diese Allgemeinen Geschäftsbedingungen. Wenn Sie diesen Bedingungen nicht zustimmen, nutzen Sie bitte unsere Dienste nicht.'
        },
        {
          title: 'Dienstleistungen',
          content: 'CodeX Terminal bietet Softwareentwicklung, Beratung und verwandte professionelle Dienstleistungen an. Der spezifische Umfang, die Liefergegenstände und die Bedingungen für jedes Projekt werden in einer separaten Vereinbarung festgelegt.'
        },
        {
          title: 'Geistiges Eigentum',
          content: 'Sofern nicht anders schriftlich vereinbart, geht das gesamte während eines Projekts erstellte geistige Eigentum bei vollständiger Zahlung auf den Kunden über. CodeX Terminal behält das Recht, nicht-vertrauliche Arbeiten in unserem Portfolio zu verwenden.'
        },
        {
          title: 'Zahlungsbedingungen',
          content: 'Zahlungsbedingungen werden in den einzelnen Projektvereinbarungen festgelegt. Standardbedingungen erfordern eine Anzahlung vor Arbeitsbeginn und Zahlung bei Lieferung von Meilensteinen oder Endlieferungen.'
        },
        {
          title: 'Vertraulichkeit',
          content: 'Wir behandeln alle Kundeninformationen als vertraulich und geben sie ohne Zustimmung nicht an Dritte weiter, außer wenn gesetzlich erforderlich oder zur Erbringung unserer Dienste notwendig.'
        },
        {
          title: 'Haftungsbeschränkung',
          content: 'Die Haftung von CodeX Terminal ist auf den für Dienstleistungen gezahlten Betrag begrenzt. Wir haften nicht für indirekte, zufällige oder Folgeschäden, die aus der Nutzung unserer Dienste entstehen.'
        },
        {
          title: 'Kündigung',
          content: 'Jede Partei kann die Dienste mit schriftlicher Mitteilung gemäß der Projektvereinbarung kündigen. Bei Kündigung zahlt der Kunde für abgeschlossene Arbeiten und behält die Rechte an bezahlten Liefergegenständen.'
        },
        {
          title: 'Anwendbares Recht',
          content: 'Diese Bedingungen unterliegen dem Recht des Vereinigten Königreichs. Streitigkeiten werden durch Schiedsverfahren oder vor den Gerichten von England und Wales beigelegt.'
        },
        {
          title: 'Änderungen der Bedingungen',
          content: 'Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Die fortgesetzte Nutzung unserer Dienste nach Änderungen gilt als Annahme der aktualisierten Bedingungen.'
        }
      ]
    },
    fr: {
      title: 'Conditions Générales de Service',
      lastUpdated: 'Dernière mise à jour: Janvier 2026',
      sections: [
        {
          title: 'Acceptation des conditions',
          content: 'En accédant et utilisant le site web et les services de CodeX Terminal, vous acceptez d\'être lié par ces Conditions Générales de Service. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser nos services.'
        },
        {
          title: 'Services',
          content: 'CodeX Terminal fournit des services de développement logiciel, de conseil et des services professionnels connexes. La portée spécifique, les livrables et les conditions de chaque projet seront définis dans un accord séparé.'
        },
        {
          title: 'Propriété intellectuelle',
          content: 'Sauf accord écrit contraire, toute propriété intellectuelle créée pendant un projet appartient au client après paiement intégral. CodeX Terminal conserve le droit d\'utiliser les travaux non confidentiels dans notre portfolio.'
        },
        {
          title: 'Conditions de paiement',
          content: 'Les conditions de paiement sont spécifiées dans les accords de projet individuels. Les conditions standard exigent un acompte avant le début des travaux et le paiement à la livraison des jalons ou des livrables finaux.'
        },
        {
          title: 'Confidentialité',
          content: 'Nous traitons toutes les informations client comme confidentielles et ne les divulguons pas à des tiers sans consentement, sauf si requis par la loi ou nécessaire pour fournir nos services.'
        },
        {
          title: 'Limitation de responsabilité',
          content: 'La responsabilité de CodeX Terminal est limitée au montant payé pour les services. Nous ne sommes pas responsables des dommages indirects, accessoires ou consécutifs résultant de l\'utilisation de nos services.'
        },
        {
          title: 'Résiliation',
          content: 'Chaque partie peut résilier les services avec un préavis écrit tel que spécifié dans l\'accord de projet. En cas de résiliation, le client paie pour le travail accompli et conserve les droits sur les livrables payés.'
        },
        {
          title: 'Droit applicable',
          content: 'Ces conditions sont régies par les lois du Royaume-Uni. Tout litige sera résolu par arbitrage ou devant les tribunaux d\'Angleterre et du Pays de Galles.'
        },
        {
          title: 'Modifications des conditions',
          content: 'Nous pouvons mettre à jour ces conditions de temps en temps. L\'utilisation continue de nos services après les modifications constitue l\'acceptation des conditions mises à jour.'
        }
      ]
    }
  };

  const c = content[locale as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <article className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {c.title}
            </h1>
            <p className="text-gray-500">{c.lastUpdated}</p>
          </header>

          <div className="prose prose-lg max-w-none">
            {c.sections.map((section, index) => (
              <section key={index} className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </section>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return {
    title: locale === 'de' ? 'Allgemeine Geschäftsbedingungen | CodeX Terminal' : locale === 'fr' ? 'Conditions Générales de Service | CodeX Terminal' : 'Terms of Service | CodeX Terminal',
    description: locale === 'de'
      ? 'Allgemeine Geschäftsbedingungen für CodeX Terminal Dienstleistungen.'
      : locale === 'fr'
      ? 'Conditions générales de service pour les services CodeX Terminal.'
      : 'Terms and conditions for CodeX Terminal services.',
  };
}
