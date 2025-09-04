import { BlockRenderer } from '@/components/BlockRenderer';

async function getPage() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/pages?slug=services`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }
    
    const data = await response.json();
    return data[0]; // Get first page with matching slug
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

export default async function ServicesPage() {
  const page = await getPage();

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Services</h1>
          <p className="text-gray-600">Page content is loading...</p>
        </div>
      </div>
    );
  }

  return <BlockRenderer blocks={page.blocks || []} />;
}

export async function generateMetadata() {
  const page = await getPage();
  
  return {
    title: page?.title || 'Services',
    description: page?.seo?.description || 'Our comprehensive software development services'
  };
}