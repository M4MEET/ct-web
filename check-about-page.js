const { PrismaClient } = require('./packages/database/dist/index.js')

const prisma = new PrismaClient()

async function checkAboutPage() {
  try {
    console.log('Checking About page in database...')
    
    const aboutPage = await prisma.page.findFirst({
      where: {
        slug: 'about',
        locale: 'en'
      },
      include: {
        blocks: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
    
    if (aboutPage) {
      console.log('✅ About page found:')
      console.log(`   ID: ${aboutPage.id}`)
      console.log(`   Slug: ${aboutPage.slug}`)
      console.log(`   Title: ${aboutPage.title}`)
      console.log(`   Status: ${aboutPage.status}`)
      console.log(`   Locale: ${aboutPage.locale}`)
      console.log(`   Blocks: ${aboutPage.blocks.length}`)
      console.log(`   Updated: ${aboutPage.updatedAt}`)
    } else {
      console.log('❌ About page not found in database')
    }
    
    // Also check all pages to see what's there
    const allPages = await prisma.page.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        locale: true
      }
    })
    
    console.log('\n📋 All pages in database:')
    allPages.forEach(page => {
      console.log(`   ${page.slug} (${page.locale}) - ${page.title} [${page.status}] - ${page.id}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAboutPage()