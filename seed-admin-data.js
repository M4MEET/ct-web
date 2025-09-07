const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding admin data...');

  // Get password from environment variable or use default for development
  const defaultPassword = process.env.SEED_DEFAULT_PASSWORD || 'temp123';
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
  
  if (process.env.NODE_ENV === 'production' && !process.env.SEED_DEFAULT_PASSWORD) {
    throw new Error('SEED_DEFAULT_PASSWORD environment variable is required in production');
  }

  console.log(`Using default password for seed users (${process.env.NODE_ENV === 'production' ? 'from env' : 'development default'})`);

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@codexterminal.com' },
      update: {},
      create: {
        email: 'admin@codexterminal.com',
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
        password: hashedPassword
      },
    }),
    prisma.user.upsert({
      where: { email: 'editor@codexterminal.com' },
      update: {},
      create: {
        email: 'editor@codexterminal.com',
        name: 'Editor User',
        role: 'EDITOR',
        isActive: true,
        emailVerified: true,
        twoFactorEnabled: false, // Disable 2FA for seed data
        password: hashedPassword
      },
    }),
    prisma.user.upsert({
      where: { email: 'author@codexterminal.com' },
      update: {},
      create: {
        email: 'author@codexterminal.com',
        name: 'Author User',
        role: 'AUTHOR',
        isActive: true,
        emailVerified: false,
        password: hashedPassword
      },
    })
  ]);

  console.log(`Created ${users.length} users`);

  // Create sample services
  const services = await Promise.all([
    prisma.service.upsert({
      where: {
        slug_locale: {
          slug: 'shopware-development',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'shopware-development',
        locale: 'en',
        name: 'Shopware Development',
        summary: 'Custom Shopware plugins, themes, and e-commerce solutions',
        icon: '🛒',
        order: 1,
        status: 'published',
      },
    }),
    prisma.service.upsert({
      where: {
        slug_locale: {
          slug: 'digital-marketing',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'digital-marketing',
        locale: 'en',
        name: 'Digital Marketing',
        summary: 'SEO, PPC, content marketing, and marketing automation',
        icon: '📈',
        order: 2,
        status: 'published',
      },
    }),
    prisma.service.upsert({
      where: {
        slug_locale: {
          slug: 'cloud-infrastructure',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'cloud-infrastructure',
        locale: 'en',
        name: 'Cloud Infrastructure',
        summary: 'AWS, Azure, and GCP solutions with DevOps automation',
        icon: '☁️',
        order: 3,
        status: 'published',
      },
    }),
    prisma.service.upsert({
      where: {
        slug_locale: {
          slug: 'custom-development',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'custom-development',
        locale: 'en',
        name: 'Custom Development',
        summary: 'Tailored software solutions for your business needs',
        icon: '💻',
        order: 4,
        status: 'draft',
      },
    }),
  ]);

  console.log(`Created ${services.length} services`);

  // Create sample pages
  const pages = await Promise.all([
    prisma.page.upsert({
      where: {
        slug_locale: {
          slug: 'home',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'home',
        locale: 'en',
        title: 'Home - CodeX Terminal',
        seo: {
          title: 'CodeX Terminal - Web Development & Digital Solutions',
          description: 'Professional web development, Shopware development, and digital marketing services.',
          noindex: false
        },
        status: 'published',
        updatedById: users[0].id,
      },
    }),
    prisma.page.upsert({
      where: {
        slug_locale: {
          slug: 'about',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'about',
        locale: 'en',
        title: 'About Us - CodeX Terminal',
        seo: {
          title: 'About CodeX Terminal - Our Story & Mission',
          description: 'Learn about CodeX Terminal, our team, and our commitment to delivering excellent web solutions.',
          noindex: false
        },
        status: 'published',
        updatedById: users[0].id,
      },
    }),
    prisma.page.upsert({
      where: {
        slug_locale: {
          slug: 'services',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'services',
        locale: 'en',
        title: 'Our Services - CodeX Terminal',
        seo: {
          title: 'Professional Web Development Services - CodeX Terminal',
          description: 'Explore our comprehensive web development, Shopware, and digital marketing services.',
          noindex: false
        },
        status: 'published',
        updatedById: users[0].id,
      },
    }),
    prisma.page.upsert({
      where: {
        slug_locale: {
          slug: 'contact',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'contact',
        locale: 'en',
        title: 'Contact Us - CodeX Terminal',
        seo: {
          title: 'Contact CodeX Terminal - Get In Touch',
          description: 'Contact our team for web development, Shopware, and digital marketing services.',
          noindex: false
        },
        status: 'draft',
        updatedById: users[0].id,
      },
    }),
  ]);

  console.log(`Created ${pages.length} pages`);

  // Create sample case studies
  const caseStudies = await Promise.all([
    prisma.caseStudy.upsert({
      where: {
        slug_locale: {
          slug: 'ecommerce-platform-migration',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'ecommerce-platform-migration',
        locale: 'en',
        title: 'E-commerce Platform Migration Success',
        client: 'Fashion Retailer Inc.',
        sector: 'E-commerce',
        category: 'caseStudy',
        seo: {
          title: 'E-commerce Migration Case Study | CodeX Terminal',
          description: 'How we successfully migrated a major fashion retailer from legacy system to modern Shopware 6 platform.',
          noindex: false
        },
        status: 'published',
      },
    }),
    prisma.caseStudy.upsert({
      where: {
        slug_locale: {
          slug: 'digital-transformation',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'digital-transformation',
        locale: 'en',
        title: 'Complete Digital Transformation',
        client: 'Manufacturing Corp',
        sector: 'Manufacturing',
        category: 'caseStudy',
        seo: {
          title: 'Digital Transformation Case Study | CodeX Terminal',
          description: 'Complete digital transformation case study for a manufacturing company.',
          noindex: false
        },
        status: 'published',
      },
    }),
    prisma.caseStudy.upsert({
      where: {
        slug_locale: {
          slug: 'react',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'react',
        locale: 'en',
        title: 'React',
        client: null,
        sector: null,
        category: 'technology',
        icon: '⚛️',
        order: 1,
        seo: {
          title: 'React Development | CodeX Terminal',
          description: 'Expert React development services for modern web applications.',
          noindex: false
        },
        status: 'published',
      },
    }),
    prisma.caseStudy.upsert({
      where: {
        slug_locale: {
          slug: 'shopware',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'shopware',
        locale: 'en',
        title: 'Shopware',
        client: null,
        sector: null,
        category: 'technology',
        icon: '🛒',
        order: 2,
        seo: {
          title: 'Shopware Development | CodeX Terminal',
          description: 'Professional Shopware development and e-commerce solutions.',
          noindex: false
        },
        status: 'published',
      },
    }),
    prisma.caseStudy.upsert({
      where: {
        slug_locale: {
          slug: 'nextjs',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'nextjs',
        locale: 'en',
        title: 'Next.js',
        client: null,
        sector: null,
        category: 'technology',
        icon: '🚀',
        order: 3,
        seo: {
          title: 'Next.js Development | CodeX Terminal',
          description: 'Advanced Next.js development for high-performance web applications.',
          noindex: false
        },
        status: 'published',
      },
    }),
    prisma.caseStudy.upsert({
      where: {
        slug_locale: {
          slug: 'typescript',
          locale: 'en'
        }
      },
      update: {},
      create: {
        slug: 'typescript',
        locale: 'en',
        title: 'TypeScript',
        client: null,
        sector: null,
        category: 'technology',
        icon: '📘',
        order: 4,
        seo: {
          title: 'TypeScript Development | CodeX Terminal',
          description: 'Professional TypeScript development for scalable applications.',
          noindex: false
        },
        status: 'published',
      },
    }),
  ]);

  console.log(`Created ${caseStudies.length} case studies`);

  console.log('Admin data seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });