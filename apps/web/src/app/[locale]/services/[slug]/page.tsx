import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/BlockRenderer';

// Database connection to fetch services
async function getServiceBySlug(slug: string, locale: string) {
  try {
    // Use the web app's own API (on port 3002)
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3002';
    
    const response = await fetch(
      `${baseUrl}/api/services?locale=${locale}&status=published&slug=${encodeURIComponent(slug)}`,
      {
        cache: 'no-store' // Ensure fresh data
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    const services = Array.isArray(result) ? result : (result.data || []);
    const service = Array.isArray(services) && services.length > 0
      ? services[0]
      : null;
    
    if (!service) {
      return null;
    }
    
    // If service has a linked page, use the page content and metadata
    if (service.page) {
      return {
        ...service,
        title: service.page.title || service.name,
        seo: service.page.seo || {
          title: service.name,
          description: service.summary
        },
        blocks: service.page.blocks || [],
        // Keep original service data for fallbacks
        serviceName: service.name,
        serviceSlug: service.slug,
        serviceSummary: service.summary
      };
    }
    
    // If no linked page, create default structure
    return {
      ...service,
      blocks: [],
      title: service.name,
      seo: {
        title: service.name,
        description: service.summary
      }
    };
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}


export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  // Try to get service from database first
  let service = await getServiceBySlug(slug, locale);

  // If no service found, return 404
  if (!service) {
    notFound();
  }

  return <BlockRenderer blocks={service.blocks} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  
  // Try to get service from database first
  let service = await getServiceBySlug(slug, locale);
  
  // No fallback content: render only what exists in the database

  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }

  return {
    title: service.seo?.title || service.title || service.name,
    description: service.seo?.description || service.summary,
  };
}

// Generate static params for known services
// No static params; route is dynamic based on DB content
