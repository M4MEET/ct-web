import { PrismaClient, Locale, PublishStatus, BlockType } from '@prisma/client';

const prisma = new PrismaClient();

// Page content for services that don't have linked pages
const missingServicePages = [
  // EN - Migration Services
  {
    serviceSlug: 'migration-services',
    locale: 'en' as Locale,
    page: {
      slug: 'migration-services',
      title: 'Professional Migration Services | Seamless Platform Transitions',
      seo: {
        title: 'Migration Services | Platform & Data Migration Experts | CodeX Terminal',
        description: 'Expert platform and data migration services with minimal downtime. E-commerce migrations, legacy system upgrades, cloud migrations, and database transfers handled with precision.'
      },
      blocks: [
        {
          type: 'hero' as BlockType,
          order: 0,
          data: {
            id: 'migration-hero',
            type: 'hero',
            visible: true,
            eyebrow: 'Seamless Platform Transitions',
            headline: 'Expert Migration Services for Modern Businesses',
            subcopy: 'Migrate your platforms, data, and systems with confidence. Our expert team ensures zero data loss, minimal downtime, and a smooth transition to your new technology stack.',
            primaryCTA: { label: 'Plan Your Migration', href: '/contact?service=migration' },
            secondaryCTA: { label: 'View Case Studies', href: '/case-studies' }
          }
        },
        {
          type: 'featureGrid' as BlockType,
          order: 1,
          data: {
            id: 'migration-services-grid',
            type: 'featureGrid',
            visible: true,
            heading: 'Comprehensive Migration Services',
            columns: 3,
            items: [
              { icon: '🛒', title: 'E-commerce Platform Migration', body: 'Migrate from any platform to Shopware, Magento, Shopify, or PrestaShop with complete product, customer, and order data transfer.' },
              { icon: '☁️', title: 'Cloud Migration', body: 'Move your infrastructure to AWS, Azure, or GCP with optimized architecture and improved performance.' },
              { icon: '🗄️', title: 'Database Migration', body: 'Transfer databases between systems while maintaining data integrity, relationships, and performance.' },
              { icon: '🔄', title: 'Legacy System Upgrades', body: 'Modernize outdated systems to current technology stacks without disrupting business operations.' },
              { icon: '📊', title: 'Data Migration & ETL', body: 'Extract, transform, and load data between systems with validation and quality assurance.' },
              { icon: '🔐', title: 'Secure Data Transfer', body: 'Encrypted data transfer with full audit trails and compliance with GDPR and industry regulations.' }
            ]
          }
        },
        {
          type: 'faq' as BlockType,
          order: 2,
          data: {
            id: 'migration-faq',
            type: 'faq',
            visible: true,
            items: [
              { q: 'How long does a typical migration take?', a: 'Migration timelines vary based on complexity. Simple migrations can be completed in 2-4 weeks, while enterprise migrations may take 2-3 months. We provide detailed timelines during the planning phase.' },
              { q: 'Will there be downtime during migration?', a: 'We minimize downtime through careful planning and parallel operation strategies. Most migrations have less than 4 hours of downtime, often scheduled during off-peak hours.' },
              { q: 'How do you ensure data integrity?', a: 'We use checksums, validation scripts, and parallel testing to ensure 100% data accuracy. All migrations include comprehensive pre and post-migration audits.' },
              { q: 'Do you provide post-migration support?', a: 'Yes, all migrations include 30 days of dedicated support plus ongoing maintenance options to ensure smooth operation.' }
            ]
          }
        },
        {
          type: 'contactForm' as BlockType,
          order: 3,
          data: {
            id: 'migration-contact',
            type: 'contactForm',
            visible: true,
            formKey: 'service-migration',
            heading: 'Start Your Migration Project',
            subcopy: 'Tell us about your migration needs and we\'ll provide a detailed plan and timeline.',
            successCopy: 'Thank you! Our migration specialists will contact you within 24 hours.'
          }
        }
      ]
    }
  },
  // EN - Technical Consulting
  {
    serviceSlug: 'technical-consulting',
    locale: 'en' as Locale,
    page: {
      slug: 'technical-consulting',
      title: 'Technical Consulting Services | Expert Technology Advisory',
      seo: {
        title: 'Technical Consulting | Expert Technology Advisory | CodeX Terminal',
        description: 'Strategic technical consulting to guide your technology decisions. Architecture reviews, technology stack selection, digital transformation, and technical due diligence.'
      },
      blocks: [
        {
          type: 'hero' as BlockType,
          order: 0,
          data: {
            id: 'consulting-hero',
            type: 'hero',
            visible: true,
            eyebrow: 'Strategic Technology Advisory',
            headline: 'Expert Technical Consulting for Informed Decisions',
            subcopy: 'Make confident technology choices with expert guidance. Our consultants bring decades of experience in e-commerce, cloud architecture, and digital transformation.',
            primaryCTA: { label: 'Schedule Consultation', href: '/contact?service=consulting' },
            secondaryCTA: { label: 'Our Expertise', href: '/about' }
          }
        },
        {
          type: 'featureGrid' as BlockType,
          order: 1,
          data: {
            id: 'consulting-services-grid',
            type: 'featureGrid',
            visible: true,
            heading: 'Consulting Services',
            columns: 3,
            items: [
              { icon: '🏗️', title: 'Architecture Reviews', body: 'Comprehensive assessment of your current technical architecture with recommendations for optimization and scalability.' },
              { icon: '🎯', title: 'Technology Stack Selection', body: 'Data-driven guidance on choosing the right technologies for your specific business requirements and growth plans.' },
              { icon: '🔄', title: 'Digital Transformation', body: 'Strategic roadmaps for modernizing legacy systems and processes to improve efficiency and competitive advantage.' },
              { icon: '📋', title: 'Technical Due Diligence', body: 'In-depth technical assessments for M&A, investments, or partnership decisions with detailed risk analysis.' },
              { icon: '⚡', title: 'Performance Optimization', body: 'Identify and resolve performance bottlenecks to improve user experience and reduce operational costs.' },
              { icon: '🛡️', title: 'Security Assessment', body: 'Comprehensive security audits and recommendations to protect your systems and data.' }
            ]
          }
        },
        {
          type: 'faq' as BlockType,
          order: 2,
          data: {
            id: 'consulting-faq',
            type: 'faq',
            visible: true,
            items: [
              { q: 'What does a technical consultation include?', a: 'Our consultations include a detailed analysis of your current state, recommendations with prioritization, and an actionable roadmap. Deliverables vary based on scope.' },
              { q: 'Can you help with vendor selection?', a: 'Yes, we provide objective vendor evaluations including feature comparisons, pricing analysis, and integration assessments to help you make informed decisions.' },
              { q: 'Do you offer ongoing advisory services?', a: 'We offer fractional CTO services and ongoing advisory retainers for continuous technical guidance and support.' },
              { q: 'How do you ensure unbiased recommendations?', a: 'We maintain vendor neutrality and base all recommendations on your specific needs, not partnerships or commissions. Our only goal is your success.' }
            ]
          }
        },
        {
          type: 'contactForm' as BlockType,
          order: 3,
          data: {
            id: 'consulting-contact',
            type: 'contactForm',
            visible: true,
            formKey: 'service-consulting',
            heading: 'Request a Consultation',
            subcopy: 'Share your technical challenges and we\'ll schedule a discovery call.',
            successCopy: 'Thank you! A senior consultant will reach out within 24 hours.'
          }
        }
      ]
    }
  },
  // EN - Security & Cybersecurity
  {
    serviceSlug: 'security-cybersecurity',
    locale: 'en' as Locale,
    page: {
      slug: 'security-cybersecurity',
      title: 'Security & Cybersecurity Services | Protect Your Digital Assets',
      seo: {
        title: 'Cybersecurity Services | Security Audits & Protection | CodeX Terminal',
        description: 'Comprehensive cybersecurity services including security audits, penetration testing, compliance consulting, and incident response. Protect your business from cyber threats.'
      },
      blocks: [
        {
          type: 'hero' as BlockType,
          order: 0,
          data: {
            id: 'security-hero',
            type: 'hero',
            visible: true,
            eyebrow: 'Enterprise-Grade Protection',
            headline: 'Comprehensive Cybersecurity for Modern Businesses',
            subcopy: 'Protect your digital assets with our expert security services. From vulnerability assessments to incident response, we safeguard your business against evolving cyber threats.',
            primaryCTA: { label: 'Get Security Assessment', href: '/contact?service=security' },
            secondaryCTA: { label: 'Security Resources', href: '/resources' }
          }
        },
        {
          type: 'featureGrid' as BlockType,
          order: 1,
          data: {
            id: 'security-services-grid',
            type: 'featureGrid',
            visible: true,
            heading: 'Security Services',
            columns: 3,
            items: [
              { icon: '🔍', title: 'Security Audits', body: 'Comprehensive assessment of your security posture including infrastructure, applications, and processes.' },
              { icon: '🎯', title: 'Penetration Testing', body: 'Ethical hacking to identify vulnerabilities before attackers do, with detailed remediation guidance.' },
              { icon: '📋', title: 'Compliance Consulting', body: 'GDPR, PCI-DSS, SOC 2, and ISO 27001 compliance guidance and implementation support.' },
              { icon: '🚨', title: 'Incident Response', body: '24/7 incident response capabilities to minimize damage and restore operations quickly.' },
              { icon: '🛡️', title: 'Security Architecture', body: 'Design and implement security-first architectures that protect while enabling business growth.' },
              { icon: '📚', title: 'Security Training', body: 'Employee security awareness training to reduce human-factor risks.' }
            ]
          }
        },
        {
          type: 'faq' as BlockType,
          order: 2,
          data: {
            id: 'security-faq',
            type: 'faq',
            visible: true,
            items: [
              { q: 'How often should we conduct security audits?', a: 'We recommend comprehensive audits annually, with vulnerability scans quarterly and after any significant infrastructure changes.' },
              { q: 'What compliance standards do you support?', a: 'We support GDPR, PCI-DSS, SOC 2 Type I/II, ISO 27001, HIPAA, and various industry-specific standards.' },
              { q: 'Do you provide 24/7 monitoring?', a: 'Yes, we offer managed security services with 24/7 monitoring, alerting, and incident response capabilities.' },
              { q: 'How do you handle discovered vulnerabilities?', a: 'All vulnerabilities are documented with severity ratings and prioritized remediation steps. We can also assist with fixing critical issues.' }
            ]
          }
        },
        {
          type: 'contactForm' as BlockType,
          order: 3,
          data: {
            id: 'security-contact',
            type: 'contactForm',
            visible: true,
            formKey: 'service-security',
            heading: 'Secure Your Business',
            subcopy: 'Request a security assessment or discuss your cybersecurity needs.',
            successCopy: 'Thank you! Our security team will contact you within 24 hours.'
          }
        }
      ]
    }
  },
  // DE - Magento Entwicklung
  {
    serviceSlug: 'magento-entwicklung',
    locale: 'de' as Locale,
    page: {
      slug: 'magento-entwicklung',
      title: 'Professionelle Magento Entwicklung | E-Commerce Experten',
      seo: {
        title: 'Magento Entwicklung | E-Commerce Experten | CodeX Terminal',
        description: 'Professionelle Magento E-Commerce Entwicklung mit Extensions, Theme-Anpassung, Performance-Optimierung und Migration. Zertifizierte Magento-Entwickler.'
      },
      blocks: [
        {
          type: 'hero' as BlockType,
          order: 0,
          data: {
            id: 'magento-de-hero',
            type: 'hero',
            visible: true,
            eyebrow: 'Adobe Commerce & Magento Experten',
            headline: 'Professionelle Magento E-Commerce Entwicklung',
            subcopy: 'Verwandeln Sie Ihren Online-Shop mit unseren Magento-Entwicklungsdiensten. Von Custom Extensions bis zu Enterprise-Lösungen - wir liefern skalierbare E-Commerce-Plattformen.',
            primaryCTA: { label: 'Projekt Starten', href: '/de/contact?service=magento' },
            secondaryCTA: { label: 'Portfolio Ansehen', href: '/de/case-studies' }
          }
        },
        {
          type: 'featureGrid' as BlockType,
          order: 1,
          data: {
            id: 'magento-de-services-grid',
            type: 'featureGrid',
            visible: true,
            heading: 'Magento Entwicklungsleistungen',
            columns: 3,
            items: [
              { icon: '🔧', title: 'Custom Extension Entwicklung', body: 'Maßgeschneiderte Magento-Extensions für Ihre spezifischen Geschäftsanforderungen.' },
              { icon: '🎨', title: 'Theme-Entwicklung', body: 'Responsive, performante Themes mit optimaler User Experience für alle Geräte.' },
              { icon: '⚡', title: 'Performance-Optimierung', body: 'Geschwindigkeitsoptimierung für bessere Conversion-Raten und SEO-Rankings.' },
              { icon: '🔄', title: 'Magento Migration', body: 'Sichere Migration von Magento 1 zu Magento 2 oder von anderen Plattformen.' },
              { icon: '🔌', title: 'API-Integrationen', body: 'Nahtlose Integration von ERP, CRM, PIM und anderen Geschäftssystemen.' },
              { icon: '🛡️', title: 'Wartung & Support', body: 'Laufende Wartung, Sicherheitsupdates und technischer Support.' }
            ]
          }
        },
        {
          type: 'faq' as BlockType,
          order: 2,
          data: {
            id: 'magento-de-faq',
            type: 'faq',
            visible: true,
            items: [
              { q: 'Warum Magento für E-Commerce wählen?', a: 'Magento bietet unübertroffene Flexibilität, Skalierbarkeit und ein robustes Feature-Set für wachsende Unternehmen. Ideal für B2B und B2C mit komplexen Anforderungen.' },
              { q: 'Wie lange dauert eine Magento-Entwicklung?', a: 'Projektzeiten variieren je nach Umfang. Ein Standard-Shop kann in 8-12 Wochen realisiert werden, Enterprise-Projekte können 3-6 Monate dauern.' },
              { q: 'Bieten Sie Magento-Hosting an?', a: 'Ja, wir bieten optimiertes Magento-Hosting auf AWS, GCP oder Azure mit vollständigem Management und Support.' },
              { q: 'Unterstützen Sie Adobe Commerce Cloud?', a: 'Ja, wir sind Experten für sowohl Magento Open Source als auch Adobe Commerce Cloud Implementierungen.' }
            ]
          }
        },
        {
          type: 'contactForm' as BlockType,
          order: 3,
          data: {
            id: 'magento-de-contact',
            type: 'contactForm',
            visible: true,
            formKey: 'service-magento-de',
            heading: 'Magento Projekt Starten',
            subcopy: 'Beschreiben Sie Ihr E-Commerce-Projekt und wir erstellen ein individuelles Angebot.',
            successCopy: 'Vielen Dank! Unser Team meldet sich innerhalb von 24 Stunden bei Ihnen.'
          }
        }
      ]
    }
  },
  // DE - Sicherheit & Cybersicherheit
  {
    serviceSlug: 'sicherheit-cybersicherheit',
    locale: 'de' as Locale,
    page: {
      slug: 'sicherheit-cybersicherheit',
      title: 'Sicherheit & Cybersicherheit | Digitale Vermögenswerte Schützen',
      seo: {
        title: 'Cybersicherheit | Sicherheitsaudits & Schutz | CodeX Terminal',
        description: 'Umfassende Cybersicherheitsdienste einschließlich Sicherheitsaudits, Penetrationstests, Compliance-Beratung und Incident Response. Schützen Sie Ihr Unternehmen.'
      },
      blocks: [
        {
          type: 'hero' as BlockType,
          order: 0,
          data: {
            id: 'security-de-hero',
            type: 'hero',
            visible: true,
            eyebrow: 'Enterprise-Schutz',
            headline: 'Umfassende Cybersicherheit für Moderne Unternehmen',
            subcopy: 'Schützen Sie Ihre digitalen Vermögenswerte mit unseren Sicherheitsdiensten. Von Schwachstellenanalysen bis Incident Response - wir sichern Ihr Unternehmen gegen Cyber-Bedrohungen.',
            primaryCTA: { label: 'Sicherheitsanalyse Anfordern', href: '/de/contact?service=security' },
            secondaryCTA: { label: 'Sicherheitsressourcen', href: '/de/resources' }
          }
        },
        {
          type: 'featureGrid' as BlockType,
          order: 1,
          data: {
            id: 'security-de-services-grid',
            type: 'featureGrid',
            visible: true,
            heading: 'Sicherheitsdienste',
            columns: 3,
            items: [
              { icon: '🔍', title: 'Sicherheitsaudits', body: 'Umfassende Bewertung Ihrer Sicherheitslage einschließlich Infrastruktur, Anwendungen und Prozesse.' },
              { icon: '🎯', title: 'Penetrationstests', body: 'Ethisches Hacking zur Identifizierung von Schwachstellen mit detaillierten Behebungshinweisen.' },
              { icon: '📋', title: 'Compliance-Beratung', body: 'DSGVO, PCI-DSS, SOC 2 und ISO 27001 Compliance-Beratung und Implementierungsunterstützung.' },
              { icon: '🚨', title: 'Incident Response', body: '24/7 Incident-Response-Fähigkeiten zur Schadensminimierung und schnellen Wiederherstellung.' },
              { icon: '🛡️', title: 'Sicherheitsarchitektur', body: 'Entwurf und Implementierung sicherheitsorientierter Architekturen für Ihr Unternehmen.' },
              { icon: '📚', title: 'Sicherheitsschulungen', body: 'Mitarbeiterschulungen zur Sensibilisierung für Sicherheitsrisiken.' }
            ]
          }
        },
        {
          type: 'faq' as BlockType,
          order: 2,
          data: {
            id: 'security-de-faq',
            type: 'faq',
            visible: true,
            items: [
              { q: 'Wie oft sollten Sicherheitsaudits durchgeführt werden?', a: 'Wir empfehlen jährliche umfassende Audits, vierteljährliche Schwachstellenscans und Prüfungen nach wesentlichen Infrastrukturänderungen.' },
              { q: 'Welche Compliance-Standards unterstützen Sie?', a: 'Wir unterstützen DSGVO, PCI-DSS, SOC 2 Typ I/II, ISO 27001, und verschiedene branchenspezifische Standards.' },
              { q: 'Bieten Sie 24/7 Monitoring an?', a: 'Ja, wir bieten Managed Security Services mit 24/7 Überwachung, Alarmierung und Incident Response.' },
              { q: 'Wie gehen Sie mit gefundenen Schwachstellen um?', a: 'Alle Schwachstellen werden dokumentiert mit Schweregradbewertungen und priorisierten Behebungsschritten.' }
            ]
          }
        },
        {
          type: 'contactForm' as BlockType,
          order: 3,
          data: {
            id: 'security-de-contact',
            type: 'contactForm',
            visible: true,
            formKey: 'service-security-de',
            heading: 'Ihr Unternehmen Sichern',
            subcopy: 'Fordern Sie eine Sicherheitsbewertung an oder besprechen Sie Ihre Cybersicherheitsanforderungen.',
            successCopy: 'Vielen Dank! Unser Sicherheitsteam kontaktiert Sie innerhalb von 24 Stunden.'
          }
        }
      ]
    }
  },
  // FR - Développement Magento
  {
    serviceSlug: 'developpement-magento',
    locale: 'fr' as Locale,
    page: {
      slug: 'developpement-magento',
      title: 'Développement Magento Professionnel | Experts E-commerce',
      seo: {
        title: 'Développement Magento | Experts E-commerce | CodeX Terminal',
        description: 'Développement e-commerce Magento professionnel avec extensions personnalisées, thèmes, optimisation des performances et migrations. Développeurs Magento certifiés.'
      },
      blocks: [
        {
          type: 'hero' as BlockType,
          order: 0,
          data: {
            id: 'magento-fr-hero',
            type: 'hero',
            visible: true,
            eyebrow: 'Experts Adobe Commerce & Magento',
            headline: 'Développement E-commerce Magento Professionnel',
            subcopy: 'Transformez votre boutique en ligne avec nos services de développement Magento. Des extensions personnalisées aux solutions entreprise - nous livrons des plateformes e-commerce évolutives.',
            primaryCTA: { label: 'Démarrer Votre Projet', href: '/fr/contact?service=magento' },
            secondaryCTA: { label: 'Voir le Portfolio', href: '/fr/case-studies' }
          }
        },
        {
          type: 'featureGrid' as BlockType,
          order: 1,
          data: {
            id: 'magento-fr-services-grid',
            type: 'featureGrid',
            visible: true,
            heading: 'Services de Développement Magento',
            columns: 3,
            items: [
              { icon: '🔧', title: 'Développement d\'Extensions', body: 'Extensions Magento sur mesure pour vos besoins métier spécifiques.' },
              { icon: '🎨', title: 'Développement de Thèmes', body: 'Thèmes responsive et performants avec une expérience utilisateur optimale.' },
              { icon: '⚡', title: 'Optimisation Performance', body: 'Optimisation de la vitesse pour de meilleurs taux de conversion et classements SEO.' },
              { icon: '🔄', title: 'Migration Magento', body: 'Migration sécurisée de Magento 1 vers Magento 2 ou depuis d\'autres plateformes.' },
              { icon: '🔌', title: 'Intégrations API', body: 'Intégration transparente d\'ERP, CRM, PIM et autres systèmes métier.' },
              { icon: '🛡️', title: 'Maintenance & Support', body: 'Maintenance continue, mises à jour de sécurité et support technique.' }
            ]
          }
        },
        {
          type: 'faq' as BlockType,
          order: 2,
          data: {
            id: 'magento-fr-faq',
            type: 'faq',
            visible: true,
            items: [
              { q: 'Pourquoi choisir Magento pour l\'e-commerce ?', a: 'Magento offre une flexibilité inégalée, une évolutivité et un ensemble de fonctionnalités robustes pour les entreprises en croissance. Idéal pour B2B et B2C avec des exigences complexes.' },
              { q: 'Combien de temps prend un développement Magento ?', a: 'Les délais varient selon la portée. Une boutique standard peut être réalisée en 8-12 semaines, les projets entreprise peuvent prendre 3-6 mois.' },
              { q: 'Proposez-vous l\'hébergement Magento ?', a: 'Oui, nous proposons un hébergement Magento optimisé sur AWS, GCP ou Azure avec gestion et support complets.' },
              { q: 'Supportez-vous Adobe Commerce Cloud ?', a: 'Oui, nous sommes experts en Magento Open Source et implémentations Adobe Commerce Cloud.' }
            ]
          }
        },
        {
          type: 'contactForm' as BlockType,
          order: 3,
          data: {
            id: 'magento-fr-contact',
            type: 'contactForm',
            visible: true,
            formKey: 'service-magento-fr',
            heading: 'Démarrer Votre Projet Magento',
            subcopy: 'Décrivez votre projet e-commerce et nous vous fournirons un devis personnalisé.',
            successCopy: 'Merci ! Notre équipe vous contactera dans les 24 heures.'
          }
        }
      ]
    }
  },
  // FR - Sécurité & Cybersécurité
  {
    serviceSlug: 'securite-cybersecurite',
    locale: 'fr' as Locale,
    page: {
      slug: 'securite-cybersecurite',
      title: 'Sécurité & Cybersécurité | Protégez Vos Actifs Numériques',
      seo: {
        title: 'Services Cybersécurité | Audits & Protection | CodeX Terminal',
        description: 'Services complets de cybersécurité incluant audits de sécurité, tests de pénétration, conseil en conformité et réponse aux incidents. Protégez votre entreprise.'
      },
      blocks: [
        {
          type: 'hero' as BlockType,
          order: 0,
          data: {
            id: 'security-fr-hero',
            type: 'hero',
            visible: true,
            eyebrow: 'Protection Niveau Entreprise',
            headline: 'Cybersécurité Complète pour les Entreprises Modernes',
            subcopy: 'Protégez vos actifs numériques avec nos services de sécurité experts. De l\'évaluation des vulnérabilités à la réponse aux incidents, nous protégeons votre entreprise contre les cybermenaces.',
            primaryCTA: { label: 'Obtenir une Évaluation', href: '/fr/contact?service=security' },
            secondaryCTA: { label: 'Ressources Sécurité', href: '/fr/resources' }
          }
        },
        {
          type: 'featureGrid' as BlockType,
          order: 1,
          data: {
            id: 'security-fr-services-grid',
            type: 'featureGrid',
            visible: true,
            heading: 'Services de Sécurité',
            columns: 3,
            items: [
              { icon: '🔍', title: 'Audits de Sécurité', body: 'Évaluation complète de votre posture de sécurité incluant infrastructure, applications et processus.' },
              { icon: '🎯', title: 'Tests de Pénétration', body: 'Hacking éthique pour identifier les vulnérabilités avec des conseils de remédiation détaillés.' },
              { icon: '📋', title: 'Conseil en Conformité', body: 'Conseil RGPD, PCI-DSS, SOC 2 et ISO 27001 et support d\'implémentation.' },
              { icon: '🚨', title: 'Réponse aux Incidents', body: 'Capacités de réponse aux incidents 24/7 pour minimiser les dommages et restaurer les opérations.' },
              { icon: '🛡️', title: 'Architecture Sécurité', body: 'Conception et implémentation d\'architectures orientées sécurité pour votre entreprise.' },
              { icon: '📚', title: 'Formation Sécurité', body: 'Formation de sensibilisation à la sécurité pour les employés.' }
            ]
          }
        },
        {
          type: 'faq' as BlockType,
          order: 2,
          data: {
            id: 'security-fr-faq',
            type: 'faq',
            visible: true,
            items: [
              { q: 'À quelle fréquence devons-nous effectuer des audits de sécurité ?', a: 'Nous recommandons des audits complets annuels, des scans de vulnérabilités trimestriels et après tout changement d\'infrastructure significatif.' },
              { q: 'Quels standards de conformité supportez-vous ?', a: 'Nous supportons RGPD, PCI-DSS, SOC 2 Type I/II, ISO 27001, et divers standards sectoriels.' },
              { q: 'Proposez-vous une surveillance 24/7 ?', a: 'Oui, nous offrons des services de sécurité gérés avec surveillance 24/7, alertes et réponse aux incidents.' },
              { q: 'Comment gérez-vous les vulnérabilités découvertes ?', a: 'Toutes les vulnérabilités sont documentées avec des évaluations de gravité et des étapes de remédiation priorisées.' }
            ]
          }
        },
        {
          type: 'contactForm' as BlockType,
          order: 3,
          data: {
            id: 'security-fr-contact',
            type: 'contactForm',
            visible: true,
            formKey: 'service-security-fr',
            heading: 'Sécurisez Votre Entreprise',
            subcopy: 'Demandez une évaluation de sécurité ou discutez de vos besoins en cybersécurité.',
            successCopy: 'Merci ! Notre équipe sécurité vous contactera dans les 24 heures.'
          }
        }
      ]
    }
  }
];

async function main() {
  console.log('Creating missing service pages...\n');

  for (const servicePage of missingServicePages) {
    const { serviceSlug, locale, page } = servicePage;

    // Find the service
    const service = await prisma.service.findUnique({
      where: { slug_locale: { slug: serviceSlug, locale } }
    });

    if (!service) {
      console.log(`❌ Service not found: ${serviceSlug} (${locale})`);
      continue;
    }

    if (service.pageId) {
      console.log(`⏭️  Service already has page: ${serviceSlug} (${locale})`);
      continue;
    }

    // Create the page
    const createdPage = await prisma.page.create({
      data: {
        slug: page.slug,
        locale: locale,
        title: page.title,
        seo: page.seo,
        status: 'published' as PublishStatus,
        blocks: {
          create: page.blocks.map((block) => ({
            type: block.type,
            order: block.order,
            data: block.data as any
          }))
        }
      }
    });

    // Link page to service
    await prisma.service.update({
      where: { id: service.id },
      data: { pageId: createdPage.id }
    });

    console.log(`✅ Created page for: ${service.name} (${locale}) - ${page.blocks.length} blocks`);
  }

  console.log('\n✅ Done creating missing service pages!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
