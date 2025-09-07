import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('Checking database contents...\n');
  
  // Check Pages
  const pages = await prisma.page.findMany({
    select: { id: true, slug: true, locale: true, title: true }
  });
  console.log('Pages:', pages);
  
  // Check Services
  const services = await prisma.service.findMany({
    select: { id: true, slug: true, locale: true, name: true }
  });
  console.log('\nServices:', services);
  
  await prisma.$disconnect();
}

checkDatabase().catch(console.error);