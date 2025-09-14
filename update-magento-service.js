const { PrismaClient } = require('@codex/database')

const prisma = new PrismaClient()

async function updateMagentoService() {
  try {
    console.log('Updating Magento Development service...')
    
    const updatedService = await prisma.service.update({
      where: {
        id: 'cmfa08vt70014angnbeo5pxne'
      },
      data: {
        pageId: 'cmfbj1tw20012an2u6tsg669v',
        summary: 'Expert Magento development services including custom extensions, responsive themes, performance optimization, migrations, PWA solutions, B2B portals, and enterprise support for scalable e-commerce.',
        icon: '🛒'
      }
    })
    
    console.log('Magento service updated successfully:', updatedService)
    
  } catch (error) {
    console.error('Error updating Magento service:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateMagentoService()