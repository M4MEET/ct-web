const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createMagentoService() {
  try {
    console.log('Creating Magento Development service...')
    
    const service = await prisma.service.create({
      data: {
        slug: 'magento-development',
        locale: 'en',
        name: 'Magento Development',
        summary: 'Expert Magento development services including custom extensions, responsive themes, performance optimization, migrations, PWA solutions, B2B portals, and enterprise support for scalable e-commerce.',
        icon: '🛒',
        order: 4,
        pageId: 'cmfbj1tw20012an2u6tsg669v', // Link to the page we just created
        status: 'published'
      }
    })
    
    console.log('Magento service created successfully:', service)
    
  } catch (error) {
    console.error('Error creating Magento service:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createMagentoService()