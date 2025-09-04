// Data fetching functions for the frontend
export async function getPageBySlug(slug: string, locale: string = 'en') {
  const API_URL = process.env.ADMIN_API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${API_URL}/api/pages?locale=${locale}`, {
      cache: 'no-store', // Always fetch fresh data for now
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch pages');
    }
    
    const pages = await response.json();
    return pages.find((page: any) => page.slug === slug);
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

export async function getHomePage(locale: string = 'en') {
  return getPageBySlug('home', locale);
}