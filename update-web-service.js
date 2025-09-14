const { PrismaClient } = require('@codex/database')

const prisma = new PrismaClient()

async function updateWebDevService() {
  try {
    console.log('Updating Web Development service...')
    
    const updatedService = await prisma.service.update({
      where: {
        id: 'web-dev-en-F532F9D21C274B42'
      },
      data: {
        pageId: 'cmfbjmn0a001kan2uq2zlrtib',
        summary: 'Professional web development services: React applications, Next.js websites, e-commerce platforms, API development, PWAs, and full-stack solutions. Modern, fast, and scalable web development.'
      }
    })
    
    console.log('Web Development service updated successfully:', updatedService)
    
  } catch (error) {
    console.error('Error updating Web Development service:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateWebDevService()