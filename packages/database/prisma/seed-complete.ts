import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting complete content seed...');

  // ============================================
  // ABOUT PAGE - English
  // ============================================
  const aboutPageEn = await prisma.page.upsert({
    where: { slug_locale: { slug: 'about', locale: 'en' } },
    update: {},
    create: {
      slug: 'about',
      locale: 'en',
      title: 'About CodeX Terminal',
      status: 'published',
      seo: {
        title: 'About Us | CodeX Terminal - Your Digital Partner',
        description: 'Learn about CodeX Terminal - a leading software development agency specializing in Shopware, digital marketing, and cloud solutions.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'about-hero',
              type: 'hero',
              visible: true,
              eyebrow: 'About CodeX Terminal',
              headline: 'Your Trusted Digital Partner',
              subcopy: 'We are a team of passionate developers, designers, and digital strategists dedicated to helping businesses succeed in the digital world.',
              cta: {
                label: 'Get in Touch',
                href: '/contact'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'about-values',
              type: 'featureGrid',
              visible: true,
              heading: 'Our Core Values',
              subtitle: 'The principles that guide everything we do',
              features: [
                {
                  title: 'Excellence',
                  description: 'We strive for excellence in every project, delivering solutions that exceed expectations.',
                  icon: '⭐'
                },
                {
                  title: 'Innovation',
                  description: 'We embrace new technologies and approaches to solve complex challenges.',
                  icon: '💡'
                },
                {
                  title: 'Partnership',
                  description: 'We build lasting relationships with our clients, becoming true partners in their success.',
                  icon: '🤝'
                },
                {
                  title: 'Transparency',
                  description: 'We believe in open communication and honest feedback throughout every project.',
                  icon: '🔍'
                }
              ]
            }
          },
          {
            type: 'metrics',
            order: 2,
            data: {
              id: 'about-stats',
              type: 'metrics',
              visible: true,
              items: [
                { label: 'Years Experience', value: '10+' },
                { label: 'Projects Completed', value: '200+' },
                { label: 'Happy Clients', value: '150+' },
                { label: 'Team Members', value: '25+' }
              ]
            }
          },
          {
            type: 'richText',
            order: 3,
            data: {
              id: 'about-story',
              type: 'richText',
              visible: true,
              heading: 'Our Story',
              content: `<div class="prose max-w-none">
                <p>Founded with a vision to bridge the gap between technology and business success, CodeX Terminal has grown into a trusted partner for businesses of all sizes.</p>
                <p>Our journey began with a simple belief: that every business deserves access to top-tier technology solutions. Today, we continue to uphold that belief, delivering exceptional results for our clients across Europe and beyond.</p>
                <h3>What Sets Us Apart</h3>
                <ul>
                  <li><strong>Certified Expertise:</strong> Our team holds certifications in Shopware, AWS, and other leading technologies.</li>
                  <li><strong>Agile Methodology:</strong> We deliver projects on time with iterative development and continuous feedback.</li>
                  <li><strong>Full-Service Support:</strong> From concept to launch and beyond, we're with you every step of the way.</li>
                </ul>
              </div>`
            }
          },
          {
            type: 'contactForm',
            order: 4,
            data: {
              id: 'about-contact',
              type: 'contactForm',
              visible: true,
              formKey: 'contact',
              heading: 'Ready to Work Together?',
              subcopy: 'Let\'s discuss how we can help your business grow.',
              successCopy: 'Thank you for your message. We\'ll be in touch within 24 hours.'
            }
          }
        ]
      }
    }
  });

  console.log('✅ About page (EN) created');

  // ============================================
  // ABOUT PAGE - German
  // ============================================
  const aboutPageDe = await prisma.page.upsert({
    where: { slug_locale: { slug: 'about', locale: 'de' } },
    update: {},
    create: {
      slug: 'about',
      locale: 'de',
      title: 'Über CodeX Terminal',
      status: 'published',
      seo: {
        title: 'Über Uns | CodeX Terminal - Ihr Digitaler Partner',
        description: 'Erfahren Sie mehr über CodeX Terminal - eine führende Softwareentwicklungsagentur für Shopware, digitales Marketing und Cloud-Lösungen.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'about-hero-de',
              type: 'hero',
              visible: true,
              eyebrow: 'Über CodeX Terminal',
              headline: 'Ihr Vertrauenswürdiger Digitaler Partner',
              subcopy: 'Wir sind ein Team leidenschaftlicher Entwickler, Designer und Digital-Strategen, die Unternehmen zum Erfolg in der digitalen Welt verhelfen.',
              cta: {
                label: 'Kontaktieren Sie Uns',
                href: '/de/contact'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'about-values-de',
              type: 'featureGrid',
              visible: true,
              heading: 'Unsere Kernwerte',
              subtitle: 'Die Prinzipien, die alles leiten, was wir tun',
              features: [
                {
                  title: 'Exzellenz',
                  description: 'Wir streben nach Exzellenz in jedem Projekt und liefern Lösungen, die Erwartungen übertreffen.',
                  icon: '⭐'
                },
                {
                  title: 'Innovation',
                  description: 'Wir setzen auf neue Technologien und Ansätze zur Lösung komplexer Herausforderungen.',
                  icon: '💡'
                },
                {
                  title: 'Partnerschaft',
                  description: 'Wir bauen dauerhafte Beziehungen zu unseren Kunden auf und werden echte Partner für ihren Erfolg.',
                  icon: '🤝'
                },
                {
                  title: 'Transparenz',
                  description: 'Wir glauben an offene Kommunikation und ehrliches Feedback während jedes Projekts.',
                  icon: '🔍'
                }
              ]
            }
          },
          {
            type: 'metrics',
            order: 2,
            data: {
              id: 'about-stats-de',
              type: 'metrics',
              visible: true,
              items: [
                { label: 'Jahre Erfahrung', value: '10+' },
                { label: 'Abgeschlossene Projekte', value: '200+' },
                { label: 'Zufriedene Kunden', value: '150+' },
                { label: 'Teammitglieder', value: '25+' }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('✅ About page (DE) created');

  // ============================================
  // ABOUT PAGE - French
  // ============================================
  const aboutPageFr = await prisma.page.upsert({
    where: { slug_locale: { slug: 'about', locale: 'fr' } },
    update: {},
    create: {
      slug: 'about',
      locale: 'fr',
      title: 'À Propos de CodeX Terminal',
      status: 'published',
      seo: {
        title: 'À Propos | CodeX Terminal - Votre Partenaire Digital',
        description: 'Découvrez CodeX Terminal - une agence de développement logiciel spécialisée dans Shopware, le marketing digital et les solutions cloud.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'about-hero-fr',
              type: 'hero',
              visible: true,
              eyebrow: 'À Propos de CodeX Terminal',
              headline: 'Votre Partenaire Digital de Confiance',
              subcopy: 'Nous sommes une équipe de développeurs, designers et stratèges digitaux passionnés, dédiés à aider les entreprises à réussir dans le monde numérique.',
              cta: {
                label: 'Contactez-Nous',
                href: '/fr/contact'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'about-values-fr',
              type: 'featureGrid',
              visible: true,
              heading: 'Nos Valeurs Fondamentales',
              subtitle: 'Les principes qui guident tout ce que nous faisons',
              features: [
                {
                  title: 'Excellence',
                  description: 'Nous visons l\'excellence dans chaque projet, livrant des solutions qui dépassent les attentes.',
                  icon: '⭐'
                },
                {
                  title: 'Innovation',
                  description: 'Nous adoptons les nouvelles technologies et approches pour résoudre les défis complexes.',
                  icon: '💡'
                },
                {
                  title: 'Partenariat',
                  description: 'Nous construisons des relations durables avec nos clients, devenant de véritables partenaires de leur succès.',
                  icon: '🤝'
                },
                {
                  title: 'Transparence',
                  description: 'Nous croyons en la communication ouverte et le feedback honnête tout au long de chaque projet.',
                  icon: '🔍'
                }
              ]
            }
          },
          {
            type: 'metrics',
            order: 2,
            data: {
              id: 'about-stats-fr',
              type: 'metrics',
              visible: true,
              items: [
                { label: 'Années d\'Expérience', value: '10+' },
                { label: 'Projets Réalisés', value: '200+' },
                { label: 'Clients Satisfaits', value: '150+' },
                { label: 'Membres de l\'Équipe', value: '25+' }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('✅ About page (FR) created');

  // ============================================
  // CASE STUDIES - English
  // ============================================
  const caseStudies = [
    {
      slug: 'ecommerce-platform-migration',
      locale: 'en' as const,
      title: 'E-commerce Platform Migration',
      client: 'Fashion Retailer',
      sector: 'Retail',
      icon: '🛒',
      order: 1,
      blocks: [
        {
          type: 'hero' as const,
          order: 0,
          data: {
            id: 'case-ecommerce-hero',
            type: 'hero',
            visible: true,
            eyebrow: 'Case Study',
            headline: 'E-commerce Platform Migration',
            subcopy: 'How we helped a fashion retailer migrate to Shopware 6 and increase sales by 45%.'
          }
        },
        {
          type: 'richText' as const,
          order: 1,
          data: {
            id: 'case-ecommerce-content',
            type: 'richText',
            visible: true,
            heading: 'The Challenge',
            content: `<div class="prose">
              <p>Our client, a growing fashion retailer, was struggling with an outdated e-commerce platform that couldn't keep up with their growth. They needed a modern, scalable solution.</p>
              <h3>Our Solution</h3>
              <ul>
                <li>Migrated 50,000+ products to Shopware 6</li>
                <li>Implemented custom payment integrations</li>
                <li>Built responsive storefront with improved UX</li>
                <li>Set up automated inventory management</li>
              </ul>
              <h3>Results</h3>
              <ul>
                <li>45% increase in online sales</li>
                <li>60% faster page load times</li>
                <li>30% reduction in cart abandonment</li>
              </ul>
            </div>`
          }
        }
      ]
    },
    {
      slug: 'marketing-automation',
      locale: 'en' as const,
      title: 'Marketing Automation Implementation',
      client: 'B2B Software Company',
      sector: 'Technology',
      icon: '📧',
      order: 2,
      blocks: [
        {
          type: 'hero' as const,
          order: 0,
          data: {
            id: 'case-marketing-hero',
            type: 'hero',
            visible: true,
            eyebrow: 'Case Study',
            headline: 'Marketing Automation Success',
            subcopy: 'Implementing a comprehensive marketing automation strategy that tripled lead generation.'
          }
        }
      ]
    },
    {
      slug: 'cloud-migration',
      locale: 'en' as const,
      title: 'Enterprise Cloud Migration',
      client: 'Financial Services',
      sector: 'Finance',
      icon: '☁️',
      order: 3,
      blocks: [
        {
          type: 'hero' as const,
          order: 0,
          data: {
            id: 'case-cloud-hero',
            type: 'hero',
            visible: true,
            eyebrow: 'Case Study',
            headline: 'Enterprise Cloud Migration',
            subcopy: 'Migrating legacy infrastructure to AWS with zero downtime and 40% cost reduction.'
          }
        }
      ]
    }
  ];

  for (const caseStudy of caseStudies) {
    await prisma.caseStudy.upsert({
      where: { slug_locale: { slug: caseStudy.slug, locale: caseStudy.locale } },
      update: {},
      create: {
        slug: caseStudy.slug,
        locale: caseStudy.locale,
        title: caseStudy.title,
        client: caseStudy.client,
        sector: caseStudy.sector,
        icon: caseStudy.icon,
        order: caseStudy.order,
        category: 'caseStudy',
        status: 'published',
        blocks: {
          create: caseStudy.blocks
        }
      }
    });
    console.log(`✅ Case study created: ${caseStudy.title}`);
  }

  // ============================================
  // UPDATE SERVICES WITH PROPER SLUGS
  // ============================================

  // Update existing services to ensure they have proper icons
  await prisma.service.updateMany({
    where: { slug: 'shopware', locale: 'en' },
    data: { icon: '🛍️', order: 1 }
  });

  await prisma.service.updateMany({
    where: { slug: 'marketing', locale: 'en' },
    data: { icon: '📈', order: 2 }
  });

  await prisma.service.updateMany({
    where: { slug: 'cloud', locale: 'en' },
    data: { icon: '☁️', order: 3 }
  });

  await prisma.service.updateMany({
    where: { slug: 'consulting', locale: 'en' },
    data: { icon: '💡', order: 4 }
  });

  await prisma.service.updateMany({
    where: { slug: 'support', locale: 'en' },
    data: { icon: '🛡️', order: 5 }
  });

  // Create web-development service for English if missing
  await prisma.service.upsert({
    where: { slug_locale: { slug: 'web-development', locale: 'en' } },
    update: {},
    create: {
      slug: 'web-development',
      locale: 'en',
      name: 'Web Development',
      summary: 'Custom web application development using modern technologies like React, Next.js, and Node.js.',
      icon: '🌐',
      order: 6,
      status: 'published'
    }
  });

  console.log('✅ Services updated with icons and order');

  // ============================================
  // SITE SETTINGS FOR EMAIL
  // ============================================
  await prisma.siteSetting.upsert({
    where: { key: 'contact' },
    update: {},
    create: {
      key: 'contact',
      value: {
        email: 'info@codexterminal.com',
        phone: '+49 123 456 789',
        address: 'Berlin, Germany',
        responseTime: '2 hours'
      }
    }
  });

  await prisma.siteSetting.upsert({
    where: { key: 'email' },
    update: {},
    create: {
      key: 'email',
      value: {
        fromEmail: 'noreply@codexterminal.com',
        notificationEmail: 'info@codexterminal.com',
        enableAutoResponse: true,
        autoResponseSubject: 'Thank you for contacting CodeX Terminal'
      }
    }
  });

  console.log('✅ Site settings configured');

  console.log('\n🎉 Complete content seed finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
