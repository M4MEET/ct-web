const { PrismaClient } = require('./packages/database/node_modules/@prisma/client');

const prisma = new PrismaClient();

async function addShopwareBlocks() {
  try {
    // Find the Shopware case study we just created
    const shopwareTech = await prisma.caseStudy.findFirst({
      where: {
        slug: 'shopware',
        locale: 'en'
      }
    });

    if (!shopwareTech) {
      console.log('❌ Shopware technology not found');
      return;
    }

    console.log('📍 Found Shopware technology:', shopwareTech.id);

    // Create blocks for the Shopware technology page
    const blocks = [
      {
        type: 'hero',
        data: {
          id: 'hero-1',
          type: 'hero',
          visible: true,
          eyebrow: 'E-commerce Excellence',
          headline: 'Shopware Development Services',
          subcopy: 'Transform your digital commerce with custom Shopware solutions. From theme development to complex integrations, we deliver enterprise-grade e-commerce experiences.',
          media: {
            kind: 'image',
            src: '/images/shopware-hero.jpg',
            alt: 'Shopware Development Services'
          },
          primaryCTA: {
            label: 'Start Your Project',
            href: '/contact'
          },
          secondaryCTA: {
            label: 'View Our Work',
            href: '/case-studies'
          },
          badges: [
            { label: 'Shopware Certified', icon: '🏆' },
            { label: '10+ Years Experience', icon: '⭐' }
          ]
        },
        order: 1,
        caseId: shopwareTech.id
      },
      {
        type: 'featureGrid',
        data: {
          id: 'features-1',
          type: 'featureGrid',
          visible: true,
          heading: 'Our Shopware Expertise',
          columns: 3,
          items: [
            {
              icon: '🎨',
              title: 'Custom Theme Development',
              body: 'Pixel-perfect, responsive themes that reflect your brand identity and deliver exceptional user experiences across all devices.'
            },
            {
              icon: '⚙️',
              title: 'Plugin Development',
              body: 'Custom plugins and extensions to extend Shopware functionality and integrate with third-party systems seamlessly.'
            },
            {
              icon: '🔗',
              title: 'System Integrations',
              body: 'Connect Shopware with ERP, CRM, PIM, and other business systems for streamlined operations and data flow.'
            },
            {
              icon: '📱',
              title: 'Mobile Optimization',
              body: 'Mobile-first approach ensuring your store performs flawlessly on all devices with optimized checkout processes.'
            },
            {
              icon: '🚀',
              title: 'Performance Optimization',
              body: 'Speed optimization, caching strategies, and infrastructure setup for lightning-fast loading times and better conversions.'
            },
            {
              icon: '🛡️',
              title: 'Security & Maintenance',
              body: 'Ongoing security updates, performance monitoring, and proactive maintenance to keep your store secure and running smoothly.'
            }
          ]
        },
        order: 2,
        caseId: shopwareTech.id
      },
      {
        type: 'metrics',
        data: {
          id: 'metrics-1',
          type: 'metrics',
          visible: true,
          items: [
            {
              label: 'Shopware Projects',
              value: '50+',
              helpText: 'Successfully delivered projects'
            },
            {
              label: 'Years of Experience',
              value: '10+',
              helpText: 'Working with Shopware platform'
            },
            {
              label: 'Certified Developers',
              value: '5',
              helpText: 'Shopware certified team members'
            },
            {
              label: 'Client Satisfaction',
              value: '98%',
              helpText: 'Based on project feedback'
            }
          ]
        },
        order: 3,
        caseId: shopwareTech.id
      },
      {
        type: 'testimonial',
        data: {
          id: 'testimonial-1',
          type: 'testimonial',
          visible: true,
          quote: 'CodeX Terminal transformed our e-commerce platform with a custom Shopware solution that increased our conversion rate by 40%. Their expertise in Shopware development is unmatched.',
          author: {
            name: 'Sarah Mitchell',
            role: 'E-commerce Manager',
            company: 'TechStyle Commerce',
            avatar: '/images/testimonials/sarah-mitchell.jpg'
          },
          metric: {
            label: 'Conversion Increase',
            value: '40%'
          }
        },
        order: 4,
        caseId: shopwareTech.id
      },
      {
        type: 'faq',
        data: {
          id: 'faq-1',
          type: 'faq',
          visible: true,
          items: [
            {
              q: 'What versions of Shopware do you work with?',
              a: 'We specialize in Shopware 6 and maintain expertise in Shopware 5 for legacy projects. We recommend Shopware 6 for all new projects due to its modern architecture and enhanced features.'
            },
            {
              q: 'How long does a typical Shopware project take?',
              a: 'Project timelines vary based on complexity. A basic theme customization takes 2-4 weeks, while complex custom development projects can take 3-6 months. We provide detailed timelines during project planning.'
            },
            {
              q: 'Do you provide ongoing support and maintenance?',
              a: 'Yes, we offer comprehensive maintenance packages including security updates, performance monitoring, backup management, and priority support to keep your store running optimally.'
            },
            {
              q: 'Can you migrate from other e-commerce platforms to Shopware?',
              a: 'Absolutely! We have experience migrating from Magento, WooCommerce, Shopify, and other platforms to Shopware while preserving your data, SEO rankings, and customer accounts.'
            },
            {
              q: 'What makes Shopware different from other e-commerce platforms?',
              a: 'Shopware offers exceptional flexibility, powerful built-in features, excellent performance, and a strong developer ecosystem. It\'s particularly well-suited for B2B and complex B2C requirements.'
            }
          ]
        },
        order: 5,
        caseId: shopwareTech.id
      },
      {
        type: 'contactForm',
        data: {
          id: 'contact-1',
          type: 'contactForm',
          visible: true,
          formKey: 'shopware-inquiry',
          heading: 'Ready to Start Your Shopware Project?',
          subcopy: 'Tell us about your requirements and we\'ll provide a detailed proposal for your Shopware development project.',
          successCopy: 'Thank you! We\'ll review your requirements and get back to you within 24 hours.',
          privacyNote: 'Your information is secure and will only be used to respond to your inquiry.'
        },
        order: 6,
        caseId: shopwareTech.id
      }
    ];

    // Create all blocks
    for (const blockData of blocks) {
      const block = await prisma.block.create({
        data: {
          type: blockData.type,
          data: blockData.data,
          order: blockData.order,
          caseId: blockData.caseId
        }
      });
      console.log(`✅ Created ${blockData.type} block:`, block.id);
    }

    console.log('🎉 Shopware technology blocks created successfully!');
    console.log(`📍 Access it at: /admin/case-studies/${shopwareTech.id}/edit`);
    console.log(`🌐 View on frontend: /en/technologies/shopware`);
    
  } catch (error) {
    console.error('❌ Error creating Shopware blocks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addShopwareBlocks();