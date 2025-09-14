const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMissingServices() {
  console.log('Checking for missing services...');

  // Check for Shopify services
  const shopifyServices = await prisma.service.findMany({
    where: {
      slug: {
        contains: 'shopify'
      }
    },
    select: {
      slug: true,
      locale: true,
      name: true
    }
  });

  console.log('\nShopify services found:');
  shopifyServices.forEach(service => {
    console.log(`- ${service.slug} (${service.locale}): ${service.name}`);
  });

  // Check for French support services
  const frenchSupportServices = await prisma.service.findMany({
    where: {
      locale: 'fr',
      OR: [
        { slug: 'support-gere' },
        { slug: 'verwalteter-support' },
        { slug: 'managed-support' }
      ]
    },
    select: {
      slug: true,
      locale: true,
      name: true
    }
  });

  console.log('\nFrench support services found:');
  frenchSupportServices.forEach(service => {
    console.log(`- ${service.slug} (${service.locale}): ${service.name}`);
  });

  // Check all services by locale
  const allServices = await prisma.service.findMany({
    select: {
      slug: true,
      locale: true,
      name: true,
      order: true
    },
    orderBy: [
      { locale: 'asc' },
      { order: 'asc' }
    ]
  });

  console.log('\nAll services by locale:');
  let currentLocale = '';
  allServices.forEach(service => {
    if (service.locale !== currentLocale) {
      currentLocale = service.locale;
      console.log(`\n${service.locale.toUpperCase()}:`);
    }
    console.log(`  ${service.order}: ${service.slug} - ${service.name}`);
  });

  await prisma.$disconnect();
}

checkMissingServices().catch(console.error);