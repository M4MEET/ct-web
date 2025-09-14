const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMissingServices() {
  console.log('Adding missing services...');

  try {
    // Create German Shopify service
    const germanShopify = await prisma.service.create({
      data: {
        slug: 'shopify-entwicklung',
        locale: 'de',
        name: 'Shopify Entwicklung',
        summary: 'Professionelle Shopify-Entwicklung mit benutzerdefinierten Themes, Apps, Zahlungsintegration und Store-Migration. Vollständige E-Commerce-Lösungen für Ihren Online-Erfolg.',
        icon: '🛍️',
        order: 5,
        status: 'published'
      }
    });

    console.log('✅ Created German Shopify service:', germanShopify.name);

    // Create French Shopify service
    const frenchShopify = await prisma.service.create({
      data: {
        slug: 'developpement-shopify',
        locale: 'fr',
        name: 'Développement Shopify',
        summary: 'Développement Shopify professionnel avec thèmes personnalisés, applications, intégration de paiement et migration de boutique. Solutions e-commerce complètes pour votre succès en ligne.',
        icon: '🛍️',
        order: 5,
        status: 'published'
      }
    });

    console.log('✅ Created French Shopify service:', frenchShopify.name);

    // Check if French managed support exists with wrong slug
    const existingFrenchSupport = await prisma.service.findMany({
      where: {
        locale: 'fr',
        OR: [
          { slug: 'managed-support' },
          { slug: 'support-gere' },
          { slug: 'verwalteter-support' }
        ]
      }
    });

    console.log('\nExisting French support services:');
    existingFrenchSupport.forEach(service => {
      console.log(`- ${service.slug}: ${service.name}`);
    });

    // If we have a French support service with wrong slug, update it
    const wrongSlugService = existingFrenchSupport.find(s => s.slug !== 'support-gere');
    if (wrongSlugService) {
      const updatedService = await prisma.service.update({
        where: { id: wrongSlugService.id },
        data: { slug: 'support-gere' }
      });
      console.log('✅ Updated French support service slug to:', updatedService.slug);
    } else if (!existingFrenchSupport.some(s => s.slug === 'support-gere')) {
      // Create French managed support service if none exists
      const frenchSupport = await prisma.service.create({
        data: {
          slug: 'support-gere',
          locale: 'fr',
          name: 'Support Géré',
          summary: 'Support technique 24/7 et services de maintenance pour maintenir vos systèmes en marche. Surveillance proactive, mises à jour sécurisées et résolution rapide des problèmes.',
          icon: '🛡️',
          order: 7,
          status: 'published'
        }
      });
      console.log('✅ Created French managed support service:', frenchSupport.name);
    }

    console.log('\n✅ All missing services have been added successfully!');

  } catch (error) {
    console.error('❌ Error adding services:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingServices();