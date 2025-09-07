// Data fetching functions for the frontend using public read-only endpoints
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function getPageBySlug(slug: string, locale: string = 'en') {
  try {
    const response = await fetch(`${BASE_URL}/api/pages/${slug}?locale=${locale}`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

export async function getHomePage(locale: string = 'en') {
  return getPageBySlug('home', locale);
}

export async function getServices(locale: string = 'en') {
  try {
    const response = await fetch(`${BASE_URL}/api/services?locale=${locale}`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getServiceBySlug(slug: string, locale: string = 'en') {
  try {
    const response = await fetch(`${BASE_URL}/api/services?slug=${slug}&locale=${locale}`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.statusText}`);
    }
    
    const result = await response.json();
    const services = result.data || [];
    return services.length > 0 ? services[0] : null;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

export async function getCaseStudies(locale: string = 'en', category?: 'caseStudy' | 'technology') {
  try {
    const url = new URL(`${BASE_URL}/api/case-studies`);
    url.searchParams.set('locale', locale);
    if (category) {
      url.searchParams.set('category', category);
    }
    
    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch case studies: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
}

export async function getCaseStudyBySlug(slug: string, locale: string = 'en') {
  try {
    const response = await fetch(`${BASE_URL}/api/case-studies?slug=${slug}&locale=${locale}`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch case study: ${response.statusText}`);
    }
    
    const result = await response.json();
    const caseStudies = result.data || [];
    return caseStudies.length > 0 ? caseStudies[0] : null;
  } catch (error) {
    console.error('Error fetching case study:', error);
    return null;
  }
}