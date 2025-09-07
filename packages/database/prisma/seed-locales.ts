import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting locale seed for German and French...');

  // German Services and Pages
  const shopwarePageDe = await prisma.page.create({
    data: {
      slug: 'shopware-development',
      locale: 'de',
      title: 'Shopware-Entwicklungsservices',
      status: 'published',
      seo: {
        title: 'Experten Shopware-Entwicklung | CodeX Terminal',
        description: 'Professionelle Shopware-Entwicklungsservices inklusive benutzerdefinierte Plugins, Theme-Entwicklung, Migrationen und App Store-Lösungen.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'shopware-hero-de',
              type: 'hero',
              visible: true,
              eyebrow: 'Shopware-Entwicklungsspezialisten',
              headline: 'Experten-Shopware-Entwicklungsservices',
              subcopy: 'Von der benutzerdefinierten Plugin-Entwicklung bis hin zu komplexen Unternehmensmigrationen liefern wir Experten-Shopware-Lösungen, die Ihren E-Commerce-Erfolg fördern.',
              cta: {
                label: 'Shopware-Projekt starten',
                href: '/contact?service=shopware'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'shopware-features-de',
              type: 'featureGrid',
              visible: true,
              heading: 'Umfassende Shopware-Lösungen',
              subtitle: 'Alles, was Sie für eine erfolgreiche Shopware-Implementierung benötigen',
              features: [
                {
                  title: 'Benutzerdefinierte Plugin-Entwicklung',
                  description: 'Maßgeschneiderte Plugins, die die Shopware-Funktionalität erweitern, um Ihre spezifischen Geschäftsanforderungen zu erfüllen.',
                  icon: '🔧'
                },
                {
                  title: 'Theme-Entwicklung',
                  description: 'Schöne, responsive Themes, die außergewöhnliche Benutzererfahrung bieten und Conversions fördern.',
                  icon: '🎨'
                },
                {
                  title: 'Shop-Migration',
                  description: 'Nahtlose Migration von anderen Plattformen zu Shopware mit null Datenverlust und minimaler Ausfallzeit.',
                  icon: '🚀'
                },
                {
                  title: 'App Store-Entwicklung',
                  description: 'Entwickeln und veröffentlichen Sie Apps im Shopware App Store, um Tausende von Händlern zu erreichen.',
                  icon: '📱'
                },
                {
                  title: 'Performance-Optimierung',
                  description: 'Beschleunigen Sie Ihren Shopware-Shop für bessere Benutzererfahrung und höhere Conversion-Raten.',
                  icon: '⚡'
                },
                {
                  title: 'Laufender Support',
                  description: '24/7 technischer Support, Wartung und kontinuierliche Verbesserung für Ihren Shopware-Shop.',
                  icon: '🛡️'
                }
              ]
            }
          }
        ]
      }
    }
  });

  const marketingPageDe = await prisma.page.create({
    data: {
      slug: 'digital-marketing',
      locale: 'de',
      title: 'Digital Marketing Services',
      status: 'published',
      seo: {
        title: 'Digital Marketing Services | CodeX Terminal',
        description: 'Umfassende Digital Marketing Services inklusive SEO, PPC, Content Marketing und Conversion-Optimierung.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'marketing-hero-de',
              type: 'hero',
              visible: true,
              eyebrow: 'Digital Marketing Excellence',
              headline: 'Wachsen Sie Ihr Unternehmen mit Digital Marketing',
              subcopy: 'Datengetriebene Marketing-Strategien, die Traffic fördern, Leads generieren und Conversions für nachhaltiges Wachstum steigern.',
              cta: {
                label: 'Marketing-Beratung erhalten',
                href: '/contact?service=marketing'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'marketing-services-de',
              type: 'featureGrid',
              visible: true,
              heading: 'Full-Service Digital Marketing',
              subtitle: 'Integrierte Marketing-Lösungen für maximale Wirkung',
              features: [
                {
                  title: 'SEO-Optimierung',
                  description: 'Verbessern Sie Ihre Suchrankings und fördern Sie organischen Traffic mit bewährten SEO-Strategien.',
                  icon: '🔍'
                },
                {
                  title: 'PPC-Werbung',
                  description: 'Maximieren Sie den ROI mit gezielten Pay-per-Click-Kampagnen auf Google, Facebook und mehr.',
                  icon: '💰'
                },
                {
                  title: 'Content-Marketing',
                  description: 'Begeistern Sie Ihr Publikum mit überzeugenden Inhalten, die Vertrauen aufbauen und zum Handeln bewegen.',
                  icon: '✍️'
                },
                {
                  title: 'E-Mail-Marketing',
                  description: 'Bauen Sie dauerhafte Kundenbeziehungen mit personalisierten E-Mail-Kampagnen auf.',
                  icon: '📧'
                },
                {
                  title: 'Social Media Marketing',
                  description: 'Erweitern Sie Ihre Markenpräsenz und binden Sie Kunden über alle sozialen Plattformen hinweg ein.',
                  icon: '📱'
                },
                {
                  title: 'Analytics & Reporting',
                  description: 'Datengetriebene Einblicke und transparente Berichterstattung zur Verfolgung Ihres Marketing-Erfolgs.',
                  icon: '📊'
                }
              ]
            }
          }
        ]
      }
    }
  });

  const cloudPageDe = await prisma.page.create({
    data: {
      slug: 'cloud-infrastructure',
      locale: 'de',
      title: 'Cloud-Infrastruktur Services',
      status: 'published',
      seo: {
        title: 'Cloud-Infrastruktur Services | CodeX Terminal',
        description: 'Enterprise Cloud-Lösungen auf AWS, GCP und Azure mit DevOps-Automatisierung und 24/7 Support.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'cloud-hero-de',
              type: 'hero',
              visible: true,
              eyebrow: 'Cloud-Infrastruktur-Experten',
              headline: 'Enterprise Cloud-Lösungen',
              subcopy: 'Skalierbare, sichere Cloud-Infrastruktur, die mit Ihrem Unternehmen wächst. Expertenimplementierung auf AWS, GCP und Azure.',
              cta: {
                label: 'Cloud-Strategie diskutieren',
                href: '/contact?service=cloud'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'cloud-services-de',
              type: 'featureGrid',
              visible: true,
              heading: 'Vollständige Cloud-Lösungen',
              subtitle: 'Alles, was Sie für eine erfolgreiche Cloud-Transformation benötigen',
              features: [
                {
                  title: 'Cloud-Migration',
                  description: 'Nahtlose Migration Ihrer Anwendungen und Daten in die Cloud mit null Ausfallzeit.',
                  icon: '☁️'
                },
                {
                  title: 'DevOps-Automatisierung',
                  description: 'Optimieren Sie Ihren Entwicklungsworkflow mit CI/CD-Pipelines und Infrastruktur als Code.',
                  icon: '🔄'
                },
                {
                  title: 'Kubernetes-Orchestrierung',
                  description: 'Bereitstellen und verwalten Sie containerisierte Anwendungen im großen Maßstab mit Kubernetes.',
                  icon: '🎯'
                },
                {
                  title: 'Serverless-Architektur',
                  description: 'Erstellen Sie kosteneffiziente, skalierbare Anwendungen mit Serverless-Technologien.',
                  icon: '⚡'
                },
                {
                  title: 'Sicherheit & Compliance',
                  description: 'Enterprise-grade Sicherheit mit Compliance für GDPR, HIPAA und SOC 2.',
                  icon: '🔒'
                },
                {
                  title: '24/7-Überwachung',
                  description: 'Rund-um-die-Uhr-Überwachung und Support zur Gewährleistung maximaler Uptime.',
                  icon: '📡'
                }
              ]
            }
          }
        ]
      }
    }
  });

  // German Services
  await prisma.service.create({
    data: {
      slug: 'shopware',
      locale: 'de',
      name: 'Shopware Entwicklung',
      summary: 'Experten Shopware-Entwicklungsservices inklusive benutzerdefinierte Plugins, Theme-Entwicklung, Migrationen und laufender Support.',
      icon: '🛍️',
      order: 1,
      status: 'published',
      pageId: shopwarePageDe.id
    }
  });

  await prisma.service.create({
    data: {
      slug: 'marketing',
      locale: 'de',
      name: 'Digital Marketing',
      summary: 'Umfassende Digital Marketing Strategien inklusive SEO, PPC, Content Marketing und Social Media für Ihr Unternehmenswachstum.',
      icon: '📈',
      order: 2,
      status: 'published',
      pageId: marketingPageDe.id
    }
  });

  await prisma.service.create({
    data: {
      slug: 'cloud',
      locale: 'de',
      name: 'Cloud-Infrastruktur',
      summary: 'Skalierbare Cloud-Lösungen auf AWS, GCP und Azure mit DevOps-Automatisierung, Überwachung und 24/7 Support.',
      icon: '☁️',
      order: 3,
      status: 'published',
      pageId: cloudPageDe.id
    }
  });

  await prisma.service.create({
    data: {
      slug: 'consulting',
      locale: 'de',
      name: 'Technische Beratung',
      summary: 'Strategische Technologie-Beratung, um Ihnen bei fundierten Entscheidungen zu helfen und Ihre digitale Infrastruktur zu optimieren.',
      icon: '💡',
      order: 4,
      status: 'published'
    }
  });

  await prisma.service.create({
    data: {
      slug: 'support',
      locale: 'de',
      name: 'Managed Support',
      summary: '24/7 technischer Support und Wartungsservices, um Ihre Systeme reibungslos am Laufen zu halten.',
      icon: '🛡️',
      order: 5,
      status: 'published'
    }
  });

  // German Web Development Service
  const webDevPageDe = await prisma.page.create({
    data: {
      slug: 'web-development',
      locale: 'de',
      title: 'Web-Entwicklungsservices',
      status: 'published',
      seo: {
        title: 'Web-Entwicklungsservices - Benutzerdefinierte Anwendungen & E-Commerce-Plattformen | CodeX Terminal',
        description: 'Professionelle Web-Entwicklungsservices inklusive benutzerdefinierte Anwendungen, E-Commerce-Plattformen, API-Entwicklung und moderne Web-Lösungen. Experten React, Next.js und Full-Stack-Entwicklung.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'web-dev-hero-de',
              type: 'hero',
              visible: true,
              eyebrow: 'Web-Entwicklungsspezialisten',
              headline: 'Benutzerdefinierte Webanwendungen & E-Commerce-Plattformen',
              subcopy: 'Von modernen React-Anwendungen bis hin zu skalierbaren E-Commerce-Plattformen erstellen wir Web-Lösungen, die Ihr Unternehmenswachstum mit modernsten Technologien vorantreiben.',
              cta: {
                label: 'Web-Projekt starten',
                href: '/contact?service=web-development'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'web-dev-features-de',
              type: 'featureGrid',
              visible: true,
              heading: 'Umfassende Web-Entwicklungsservices',
              subtitle: 'Full-Stack-Expertise, die jeden Aspekt der modernen Web-Entwicklung abdeckt',
              columns: 3,
              features: [
                {
                  icon: '⚛️',
                  title: 'React & Next.js Entwicklung',
                  description: 'Moderne, performante Webanwendungen mit React, Next.js und den neuesten JavaScript-Frameworks.'
                },
                {
                  icon: '🛒',
                  title: 'E-Commerce-Plattformen',
                  description: 'Benutzerdefinierte Online-Shops mit Zahlungsintegration, Lagerverwaltung und optimierten Checkout-Flows.'
                },
                {
                  icon: '📱',
                  title: 'Progressive Web Apps',
                  description: 'Mobile-first Anwendungen, die offline funktionieren und native App-ähnliche Erfahrungen auf allen Geräten bieten.'
                },
                {
                  icon: '🔗',
                  title: 'API-Entwicklung',
                  description: 'RESTful APIs und GraphQL-Endpunkte für nahtlose Integration mit Drittanbieterdiensten und mobilen Apps.'
                },
                {
                  icon: '🚀',
                  title: 'Performance-Optimierung',
                  description: 'Blitzschnelle Ladezeiten mit Code-Splitting, Caching-Strategien und Performance-Monitoring.'
                },
                {
                  icon: '🔒',
                  title: 'Sicherheit & Authentifizierung',
                  description: 'Enterprise-grade Sicherheit mit Benutzerauthentifizierung, Datenverschlüsselung und Compliance-Standards.'
                }
              ]
            }
          }
        ]
      }
    }
  });

  await prisma.service.create({
    data: {
      slug: 'web-development',
      locale: 'de',
      name: 'Web-Entwicklung',
      summary: 'Benutzerdefinierte Webanwendungen und E-Commerce-Plattformen mit modernen Technologien erstellt.',
      icon: '🌐',
      order: 4,
      status: 'published',
      pageId: webDevPageDe.id
    }
  });

  // French Services and Pages
  const shopwarePageFr = await prisma.page.create({
    data: {
      slug: 'shopware-development',
      locale: 'fr',
      title: 'Services de Développement Shopware',
      status: 'published',
      seo: {
        title: 'Développement Shopware Expert | CodeX Terminal',
        description: 'Services de développement Shopware professionnels incluant plugins personnalisés, développement de thèmes, migrations et solutions App Store.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'shopware-hero-fr',
              type: 'hero',
              visible: true,
              eyebrow: 'Spécialistes du Développement Shopware',
              headline: 'Services Experts de Développement Shopware',
              subcopy: 'Du développement de plugins personnalisés aux migrations d\'entreprise complexes, nous livrons des solutions Shopware expertes qui stimulent votre succès e-commerce.',
              cta: {
                label: 'Démarrer Votre Projet Shopware',
                href: '/contact?service=shopware'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'shopware-features-fr',
              type: 'featureGrid',
              visible: true,
              heading: 'Solutions Shopware Complètes',
              subtitle: 'Tout ce dont vous avez besoin pour une implémentation Shopware réussie',
              features: [
                {
                  title: 'Développement de Plugins Personnalisés',
                  description: 'Plugins sur mesure qui étendent les fonctionnalités Shopware pour répondre à vos besoins commerciaux spécifiques.',
                  icon: '🔧'
                },
                {
                  title: 'Développement de Thèmes',
                  description: 'Thèmes beaux et réactifs qui offrent une expérience utilisateur exceptionnelle et stimulent les conversions.',
                  icon: '🎨'
                },
                {
                  title: 'Migration de Boutique',
                  description: 'Migration transparente depuis d\'autres plateformes vers Shopware avec zéro perte de données et temps d\'arrêt minimal.',
                  icon: '🚀'
                },
                {
                  title: 'Développement App Store',
                  description: 'Développez et publiez des applications sur le Shopware App Store pour atteindre des milliers de marchands.',
                  icon: '📱'
                },
                {
                  title: 'Optimisation des Performances',
                  description: 'Accélérez votre boutique Shopware pour une meilleure expérience utilisateur et des taux de conversion plus élevés.',
                  icon: '⚡'
                },
                {
                  title: 'Support Continu',
                  description: 'Support technique 24/7, maintenance et amélioration continue pour votre boutique Shopware.',
                  icon: '🛡️'
                }
              ]
            }
          }
        ]
      }
    }
  });

  const marketingPageFr = await prisma.page.create({
    data: {
      slug: 'digital-marketing',
      locale: 'fr',
      title: 'Services de Marketing Digital',
      status: 'published',
      seo: {
        title: 'Services de Marketing Digital | CodeX Terminal',
        description: 'Services de marketing digital complets incluant SEO, PPC, marketing de contenu et optimisation de conversion.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'marketing-hero-fr',
              type: 'hero',
              visible: true,
              eyebrow: 'Excellence du Marketing Digital',
              headline: 'Développez Votre Entreprise avec le Marketing Digital',
              subcopy: 'Stratégies marketing basées sur les données qui génèrent du trafic, génèrent des leads et augmentent les conversions pour une croissance durable.',
              cta: {
                label: 'Obtenir une Consultation Marketing',
                href: '/contact?service=marketing'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'marketing-services-fr',
              type: 'featureGrid',
              visible: true,
              heading: 'Marketing Digital Complet',
              subtitle: 'Solutions marketing intégrées pour un impact maximal',
              features: [
                {
                  title: 'Optimisation SEO',
                  description: 'Améliorez vos classements de recherche et générez du trafic organique avec des stratégies SEO éprouvées.',
                  icon: '🔍'
                },
                {
                  title: 'Publicité PPC',
                  description: 'Maximisez le ROI avec des campagnes pay-per-click ciblées sur Google, Facebook et plus.',
                  icon: '💰'
                },
                {
                  title: 'Marketing de Contenu',
                  description: 'Engagez votre audience avec du contenu convaincant qui construit la confiance et incite à l\'action.',
                  icon: '✍️'
                },
                {
                  title: 'Marketing par Email',
                  description: 'Construisez des relations clients durables avec des campagnes email personnalisées.',
                  icon: '📧'
                },
                {
                  title: 'Marketing des Réseaux Sociaux',
                  description: 'Développez votre présence de marque et engagez les clients sur toutes les plateformes sociales.',
                  icon: '📱'
                },
                {
                  title: 'Analytics & Reporting',
                  description: 'Insights basés sur les données et reporting transparent pour suivre votre succès marketing.',
                  icon: '📊'
                }
              ]
            }
          }
        ]
      }
    }
  });

  const cloudPageFr = await prisma.page.create({
    data: {
      slug: 'cloud-infrastructure',
      locale: 'fr',
      title: 'Services d\'Infrastructure Cloud',
      status: 'published',
      seo: {
        title: 'Services d\'Infrastructure Cloud | CodeX Terminal',
        description: 'Solutions cloud d\'entreprise sur AWS, GCP et Azure avec automatisation DevOps et support 24/7.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'cloud-hero-fr',
              type: 'hero',
              visible: true,
              eyebrow: 'Experts en Infrastructure Cloud',
              headline: 'Solutions Cloud d\'Entreprise',
              subcopy: 'Infrastructure cloud évolutive et sécurisée qui grandit avec votre entreprise. Implémentation experte sur AWS, GCP et Azure.',
              cta: {
                label: 'Discuter de la Stratégie Cloud',
                href: '/contact?service=cloud'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'cloud-services-fr',
              type: 'featureGrid',
              visible: true,
              heading: 'Solutions Cloud Complètes',
              subtitle: 'Tout ce dont vous avez besoin pour une transformation cloud réussie',
              features: [
                {
                  title: 'Migration Cloud',
                  description: 'Migration transparente de vos applications et données vers le cloud avec zéro temps d\'arrêt.',
                  icon: '☁️'
                },
                {
                  title: 'Automatisation DevOps',
                  description: 'Rationalisez votre workflow de développement avec des pipelines CI/CD et l\'infrastructure as code.',
                  icon: '🔄'
                },
                {
                  title: 'Orchestration Kubernetes',
                  description: 'Déployez et gérez des applications conteneurisées à grande échelle avec Kubernetes.',
                  icon: '🎯'
                },
                {
                  title: 'Architecture Serverless',
                  description: 'Construisez des applications évolutives et rentables avec les technologies serverless.',
                  icon: '⚡'
                },
                {
                  title: 'Sécurité & Conformité',
                  description: 'Sécurité de niveau entreprise avec conformité RGPD, HIPAA et SOC 2.',
                  icon: '🔒'
                },
                {
                  title: 'Surveillance 24/7',
                  description: 'Surveillance et support 24h/24 pour assurer un temps de fonctionnement maximal.',
                  icon: '📡'
                }
              ]
            }
          }
        ]
      }
    }
  });

  // French Services
  await prisma.service.create({
    data: {
      slug: 'shopware',
      locale: 'fr',
      name: 'Développement Shopware',
      summary: 'Services experts de développement Shopware incluant plugins personnalisés, développement de thèmes, migrations et support continu.',
      icon: '🛍️',
      order: 1,
      status: 'published',
      pageId: shopwarePageFr.id
    }
  });

  await prisma.service.create({
    data: {
      slug: 'marketing',
      locale: 'fr',
      name: 'Marketing Digital',
      summary: 'Stratégies de marketing digital complètes incluant SEO, PPC, marketing de contenu et réseaux sociaux pour développer votre entreprise.',
      icon: '📈',
      order: 2,
      status: 'published',
      pageId: marketingPageFr.id
    }
  });

  await prisma.service.create({
    data: {
      slug: 'cloud',
      locale: 'fr',
      name: 'Infrastructure Cloud',
      summary: 'Solutions cloud évolutives sur AWS, GCP et Azure avec automatisation DevOps, surveillance et support 24/7.',
      icon: '☁️',
      order: 3,
      status: 'published',
      pageId: cloudPageFr.id
    }
  });

  await prisma.service.create({
    data: {
      slug: 'consulting',
      locale: 'fr',
      name: 'Conseil Technique',
      summary: 'Conseil technologique stratégique pour vous aider à prendre des décisions éclairées et optimiser votre infrastructure numérique.',
      icon: '💡',
      order: 4,
      status: 'published'
    }
  });

  await prisma.service.create({
    data: {
      slug: 'support',
      locale: 'fr',
      name: 'Support Géré',
      summary: 'Support technique 24/7 et services de maintenance pour maintenir vos systèmes en parfait état de fonctionnement.',
      icon: '🛡️',
      order: 5,
      status: 'published'
    }
  });

  // French Web Development Service
  const webDevPageFr = await prisma.page.create({
    data: {
      slug: 'web-development',
      locale: 'fr',
      title: 'Services de Développement Web',
      status: 'published',
      seo: {
        title: 'Services de Développement Web - Applications Personnalisées & Plateformes E-commerce | CodeX Terminal',
        description: 'Services professionnels de développement web incluant applications personnalisées, plateformes e-commerce, développement d\'API et solutions web modernes. Experts React, Next.js et développement full-stack.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'web-dev-hero-fr',
              type: 'hero',
              visible: true,
              eyebrow: 'Spécialistes du Développement Web',
              headline: 'Applications Web Personnalisées & Plateformes E-commerce',
              subcopy: 'Des applications React modernes aux plateformes e-commerce évolutives, nous créons des solutions web qui stimulent la croissance de votre entreprise avec des technologies de pointe.',
              cta: {
                label: 'Démarrer Votre Projet Web',
                href: '/contact?service=web-development'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'web-dev-features-fr',
              type: 'featureGrid',
              visible: true,
              heading: 'Services Complets de Développement Web',
              subtitle: 'Expertise full-stack couvrant tous les aspects du développement web moderne',
              columns: 3,
              features: [
                {
                  icon: '⚛️',
                  title: 'Développement React & Next.js',
                  description: 'Applications web modernes et performantes construites avec React, Next.js et les derniers frameworks JavaScript.'
                },
                {
                  icon: '🛒',
                  title: 'Plateformes E-commerce',
                  description: 'Boutiques en ligne personnalisées avec intégration de paiement, gestion d\'inventaire et flux de commande optimisés.'
                },
                {
                  icon: '📱',
                  title: 'Applications Web Progressives',
                  description: 'Applications mobile-first qui fonctionnent hors ligne et offrent des expériences similaires aux applications natives sur tous les appareils.'
                },
                {
                  icon: '🔗',
                  title: 'Développement d\'API',
                  description: 'APIs RESTful et points de terminaison GraphQL pour une intégration transparente avec les services tiers et applications mobiles.'
                },
                {
                  icon: '🚀',
                  title: 'Optimisation des Performances',
                  description: 'Temps de chargement ultra-rapides avec division de code, stratégies de mise en cache et surveillance des performances.'
                },
                {
                  icon: '🔒',
                  title: 'Sécurité & Authentification',
                  description: 'Sécurité de niveau entreprise avec authentification utilisateur, chiffrement des données et standards de conformité.'
                }
              ]
            }
          }
        ]
      }
    }
  });

  await prisma.service.create({
    data: {
      slug: 'web-development',
      locale: 'fr',
      name: 'Développement Web',
      summary: 'Applications web personnalisées et plateformes e-commerce construites avec des technologies modernes.',
      icon: '🌐',
      order: 4,
      status: 'published',
      pageId: webDevPageFr.id
    }
  });

  console.log('German and French locale seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });