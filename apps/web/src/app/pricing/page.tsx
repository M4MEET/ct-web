import { BlockRenderer } from '@/components/BlockRenderer';
import { getPageBySlug } from '@/lib/data';

export default async function PricingPage() {
  const page = await getPageBySlug('pricing', 'en');

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-gray-600">Page content is loading...</p>
        </div>
      </div>
    );
  }

  return <BlockRenderer blocks={page.blocks || []} />;
}

export async function generateMetadata() {
  const page = await getPageBySlug('pricing', 'en');
  
  return {
    title: page?.title || 'Pricing',
    description: page?.seo?.description || 'Transparent pricing for software development services'
  };
}