const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Helper function to read JSON content
function readServiceContent(filename) {
  const filePath = path.join(process.cwd(), filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
}

// Helper function to create blocks from content
function createBlocksFromContent(content, locale) {
  const blocks = [];

  if (content.content?.hero) {
    blocks.push({
      type: 'hero',
      order: 0,
      data: {
        id: `${content.slug}-hero`,
        type: 'hero',
        visible: true,
        eyebrow: content.content.hero.eyebrow || '',
        headline: content.content.hero.headline,
        subcopy: content.content.hero.description,
        primaryCTA: content.content.hero.cta ? {
          label: content.content.hero.cta.text,
          href: content.content.hero.cta.link
        } : undefined
      }
    });
  }

  if (content.content?.features) {
    blocks.push({
      type: 'featureGrid',
      order: 1,
      data: {
        id: `${content.slug}-features`,
        type: 'featureGrid',
        visible: true,
        heading: locale === 'de' ? 'Umfassende Lösungen' : locale === 'fr' ? 'Solutions Complètes' : 'Comprehensive Solutions',
        columns: 3,
        items: content.content.features.map(feature => ({
          title: feature.title,
          description: feature.description,
          icon: feature.icon
        }))
      }
    });
  }

  return blocks;
}

async function linkServicePages() {
  console.log('Starting service page linking...');

  const serviceContentFiles = [
    // German content files
    { file: 'web_development_content_de.json', slug: 'web-entwicklung', locale: 'de' },
    { file: 'ecommerce_content_de.json', slug: 'ecommerce-entwicklung', locale: 'de' },
    { file: 'prestashop_content_de.json', slug: 'prestashop-entwicklung', locale: 'de' },
    { file: 'shopify_content_de.json', slug: 'shopify-entwicklung', locale: 'de' },
    { file: 'technical_consulting_content_de.json', slug: 'technische-beratung', locale: 'de' },
    { file: 'managed_support_content_de.json', slug: 'verwalteter-support', locale: 'de' },
    { file: 'migration_services_content_de.json', slug: 'migrations-services', locale: 'de' },
    { file: 'cloud_infrastructure_content_de.json', slug: 'cloud-infrastruktur', locale: 'de' },

    // French content files
    { file: 'web_development_content_fr.json', slug: 'developpement-web', locale: 'fr' },
    { file: 'ecommerce_content_fr.json', slug: 'developpement-ecommerce', locale: 'fr' },
    { file: 'prestashop_content_fr.json', slug: 'developpement-prestashop', locale: 'fr' },
    { file: 'shopify_content_fr.json', slug: 'developpement-shopify', locale: 'fr' },
    { file: 'technical_consulting_content_fr.json', slug: 'conseil-technique', locale: 'fr' },
    { file: 'managed_support_content_fr.json', slug: 'support-gere', locale: 'fr' },
    { file: 'migration_services_content_fr.json', slug: 'services-migration', locale: 'fr' },
    { file: 'cloud_infrastructure_content_fr.json', slug: 'infrastructure-cloud', locale: 'fr' }
  ];

  for (const { file, slug, locale } of serviceContentFiles) {
    try {
      console.log(`Processing ${file}...`);

      const content = readServiceContent(file);
      if (!content) {
        console.log(`Content not found for ${file}, skipping...`);
        continue;
      }

      // Find the service
      const service = await prisma.service.findFirst({
        where: {
          slug: slug,
          locale: locale
        }
      });

      if (!service) {
        console.log(`Service not found for slug: ${slug}, locale: ${locale}, skipping...`);
        continue;
      }

      // Check if service already has a page
      if (service.pageId) {
        console.log(`Service ${slug} (${locale}) already has a linked page, skipping...`);
        continue;
      }

      // Create page with blocks
      const page = await prisma.page.create({
        data: {
          slug: slug + '-page',
          locale: locale,
          title: content.name,
          status: 'published',
          seo: content.seo || {
            title: content.seo?.title || `${content.name} | CodeX Terminal`,
            description: content.seo?.description || content.summary
          },
          blocks: {
            create: createBlocksFromContent(content, locale)
          }
        }
      });

      // Link the page to the service
      await prisma.service.update({
        where: { id: service.id },
        data: { pageId: page.id }
      });

      console.log(`✅ Successfully linked page for ${slug} (${locale})`);

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }

  console.log('Service page linking completed!');
}

// Run the script
linkServicePages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());