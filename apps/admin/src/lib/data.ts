import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Data access functions for pages
export async function getPages(locale: string = 'en') {
  return await prisma.page.findMany({
    where: {
      locale: locale as any,
    },
    include: {
      blocks: {
        orderBy: {
          order: 'asc',
        },
      },
      updatedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function getPage(id: string) {
  return await prisma.page.findUnique({
    where: { id },
    include: {
      blocks: {
        orderBy: {
          order: 'asc',
        },
      },
      updatedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function createPage(data: any) {
  return await prisma.page.create({
    data: {
      slug: data.slug,
      locale: data.locale,
      title: data.title,
      seo: data.seo || null,
      status: data.status,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      blocks: {
        create: data.blocks?.map((block: any, index: number) => ({
          type: block.type,
          data: block,
          order: index,
        })) || [],
      },
    },
    include: {
      blocks: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}

export async function updatePage(id: string, data: any) {
  // First, delete existing blocks
  await prisma.block.deleteMany({
    where: { pageId: id },
  });

  return await prisma.page.update({
    where: { id },
    data: {
      slug: data.slug,
      locale: data.locale,
      title: data.title,
      seo: data.seo || null,
      status: data.status,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      blocks: {
        create: data.blocks?.map((block: any, index: number) => ({
          type: block.type,
          data: block,
          order: index,
        })) || [],
      },
    },
    include: {
      blocks: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}

export async function deletePage(id: string) {
  return await prisma.page.delete({
    where: { id },
  });
}

// Data access functions for blog posts
export async function getBlogPosts(locale: string = 'en') {
  return await prisma.blogPost.findMany({
    where: {
      locale: locale as any,
    },
    include: {
      blocks: {
        orderBy: {
          order: 'asc',
        },
      },
      author: true,
      cover: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function getBlogPost(id: string) {
  return await prisma.blogPost.findUnique({
    where: { id },
    include: {
      blocks: {
        orderBy: {
          order: 'asc',
        },
      },
      author: true,
      cover: true,
    },
  });
}

// Data access functions for services
export async function getServices(locale: string = 'en') {
  return await prisma.service.findMany({
    where: {
      locale: locale as any,
    },
    include: {
      page: {
        include: {
          blocks: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { updatedAt: 'desc' },
    ],
  });
}

export async function getService(id: string) {
  return await prisma.service.findUnique({
    where: { id },
    include: {
      page: {
        include: {
          blocks: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      },
    },
  });
}

export async function createService(data: any) {
  return await prisma.service.create({
    data: {
      slug: data.slug,
      locale: data.locale,
      name: data.name,
      summary: data.summary || undefined,
      icon: data.icon || undefined,
      order: data.order || undefined,
      pageId: data.pageId || undefined,
      status: data.status,
    },
    include: {
      page: {
        include: {
          blocks: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      },
    },
  });
}

export async function updateService(id: string, data: any) {
  return await prisma.service.update({
    where: { id },
    data: {
      slug: data.slug,
      locale: data.locale,
      name: data.name,
      summary: data.summary || undefined,
      icon: data.icon || undefined,
      order: data.order || undefined,
      pageId: data.pageId || undefined,
      status: data.status,
    },
    include: {
      page: {
        include: {
          blocks: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      },
    },
  });
}

export async function deleteService(id: string) {
  return await prisma.service.delete({
    where: { id },
  });
}