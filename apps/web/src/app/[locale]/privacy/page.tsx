export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: January 2026',
      sections: [
        {
          title: 'Information We Collect',
          content: 'We collect information you provide directly to us, such as when you fill out a contact form, request a quote, or communicate with us. This may include your name, email address, phone number, company name, and project details.'
        },
        {
          title: 'How We Use Your Information',
          content: 'We use the information we collect to respond to your inquiries, provide services you request, send you updates about our services (with your consent), and improve our website and services.'
        },
        {
          title: 'Information Sharing',
          content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as necessary to provide our services or as required by law.'
        },
        {
          title: 'Data Security',
          content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          title: 'Cookies',
          content: 'Our website uses cookies to enhance your browsing experience. You can control cookies through your browser settings. Essential cookies are required for the website to function properly.'
        },
        {
          title: 'Your Rights',
          content: 'You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing activities. To exercise these rights, please contact us.'
        },
        {
          title: 'Contact Us',
          content: 'If you have questions about this Privacy Policy or our data practices, please contact us at privacy@codexterminal.com.'
        }
      ]
    },
    de: {
      title: 'Datenschutzerklärung',
      lastUpdated: 'Zuletzt aktualisiert: Januar 2026',
      sections: [
        {
          title: 'Informationen, die wir sammeln',
          content: 'Wir sammeln Informationen, die Sie uns direkt zur Verfügung stellen, z.B. wenn Sie ein Kontaktformular ausfüllen, ein Angebot anfordern oder mit uns kommunizieren. Dies kann Ihren Namen, Ihre E-Mail-Adresse, Telefonnummer, Firmennamen und Projektdetails umfassen.'
        },
        {
          title: 'Wie wir Ihre Informationen verwenden',
          content: 'Wir verwenden die gesammelten Informationen, um auf Ihre Anfragen zu antworten, angeforderte Dienstleistungen zu erbringen, Ihnen Updates über unsere Dienste zu senden (mit Ihrer Zustimmung) und unsere Website und Dienste zu verbessern.'
        },
        {
          title: 'Informationsweitergabe',
          content: 'Wir verkaufen, handeln oder übertragen Ihre persönlichen Daten nicht an Dritte ohne Ihre Zustimmung, außer wenn dies zur Erbringung unserer Dienste oder gesetzlich erforderlich ist.'
        },
        {
          title: 'Datensicherheit',
          content: 'Wir implementieren angemessene technische und organisatorische Maßnahmen, um Ihre persönlichen Daten vor unbefugtem Zugriff, Änderung, Offenlegung oder Zerstörung zu schützen.'
        },
        {
          title: 'Cookies',
          content: 'Unsere Website verwendet Cookies, um Ihr Browsing-Erlebnis zu verbessern. Sie können Cookies über Ihre Browsereinstellungen kontrollieren. Essentielle Cookies sind für die Funktion der Website erforderlich.'
        },
        {
          title: 'Ihre Rechte',
          content: 'Sie haben das Recht, auf Ihre persönlichen Daten zuzugreifen, sie zu korrigieren oder zu löschen. Sie können auch bestimmten Verarbeitungsaktivitäten widersprechen oder diese einschränken. Bitte kontaktieren Sie uns, um diese Rechte auszuüben.'
        },
        {
          title: 'Kontakt',
          content: 'Wenn Sie Fragen zu dieser Datenschutzerklärung oder unseren Datenpraktiken haben, kontaktieren Sie uns bitte unter privacy@codexterminal.com.'
        }
      ]
    },
    fr: {
      title: 'Politique de Confidentialité',
      lastUpdated: 'Dernière mise à jour: Janvier 2026',
      sections: [
        {
          title: 'Informations que nous collectons',
          content: 'Nous collectons les informations que vous nous fournissez directement, par exemple lorsque vous remplissez un formulaire de contact, demandez un devis ou communiquez avec nous. Cela peut inclure votre nom, adresse e-mail, numéro de téléphone, nom d\'entreprise et détails du projet.'
        },
        {
          title: 'Comment nous utilisons vos informations',
          content: 'Nous utilisons les informations collectées pour répondre à vos demandes, fournir les services demandés, vous envoyer des mises à jour sur nos services (avec votre consentement) et améliorer notre site web et nos services.'
        },
        {
          title: 'Partage d\'informations',
          content: 'Nous ne vendons, n\'échangeons ni ne transférons vos informations personnelles à des tiers sans votre consentement, sauf si nécessaire pour fournir nos services ou comme requis par la loi.'
        },
        {
          title: 'Sécurité des données',
          content: 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos informations personnelles contre l\'accès, la modification, la divulgation ou la destruction non autorisés.'
        },
        {
          title: 'Cookies',
          content: 'Notre site web utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez contrôler les cookies via les paramètres de votre navigateur. Les cookies essentiels sont nécessaires au bon fonctionnement du site.'
        },
        {
          title: 'Vos droits',
          content: 'Vous avez le droit d\'accéder, de corriger ou de supprimer vos informations personnelles. Vous pouvez également vous opposer ou restreindre certaines activités de traitement. Veuillez nous contacter pour exercer ces droits.'
        },
        {
          title: 'Nous contacter',
          content: 'Si vous avez des questions sur cette politique de confidentialité ou nos pratiques en matière de données, veuillez nous contacter à privacy@codexterminal.com.'
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
    title: locale === 'de' ? 'Datenschutzerklärung | CodeX Terminal' : locale === 'fr' ? 'Politique de Confidentialité | CodeX Terminal' : 'Privacy Policy | CodeX Terminal',
    description: locale === 'de'
      ? 'Erfahren Sie, wie CodeX Terminal Ihre persönlichen Daten sammelt, verwendet und schützt.'
      : locale === 'fr'
      ? 'Découvrez comment CodeX Terminal collecte, utilise et protège vos données personnelles.'
      : 'Learn how CodeX Terminal collects, uses, and protects your personal information.',
  };
}
