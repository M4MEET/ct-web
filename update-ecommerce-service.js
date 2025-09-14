const { PrismaClient } = require('@codex/database')

const prisma = new PrismaClient()

async function updateEcommerceService() {
  try {
    console.log('Updating E-commerce Development service...')
    
    const updatedService = await prisma.service.update({
      where: {
        id: 'cmfa0a09b0016angn1xjy75q4'
      },
      data: {
        pageId: 'cmfbjybhs0022an2umy3udczh',
        summary: 'Custom e-commerce development services including online stores, marketplace solutions, payment integrations, mobile commerce, B2B portals, multi-vendor platforms, and enterprise solutions for scalable business growth.'
      }
    })
    
    console.log('E-commerce service updated successfully:', updatedService)
    
  } catch (error) {
    console.error('Error updating E-commerce service:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateEcommerceService()