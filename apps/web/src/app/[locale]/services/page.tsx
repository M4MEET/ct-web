import { BlockRenderer } from '@/components/BlockRenderer';

// Fetch services from database
async function getPublishedServices(locale: string) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'; // Web app's own API
    
    const response = await fetch(`${baseUrl}/api/services?locale=${locale}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.data || []; // Web API already filters to published services
    }
    return [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// Enhanced services overview content
const servicesBlocks = [
  {
    id: 'services-hero',
    type: 'hero',
    data: {
      id: 'services-hero',
      type: 'hero',
      visible: true,
      eyebrow: 'Professional Software Development',
      headline: 'Comprehensive Development Services',
      subcopy: 'From Shopware development to digital marketing and cloud infrastructure - we deliver complete solutions for your business growth.',
      cta: {
        label: 'Contact Us',
        href: '/contact'
      }
    }
  },
  {
    id: 'services-overview',
    type: 'featureGrid',
    data: {
      id: 'services-overview',
      type: 'featureGrid',
      visible: true,
      heading: 'Our Core Services',
      subtitle: 'Specialized expertise across the entire digital ecosystem',
      features: [
        {
          title: 'Shopware Development',
          description: 'Expert Shopware plugin development, theme customization, store migrations, and App Store applications. Complete ecommerce solutions from planning to deployment.',
          icon: '🛍️'
        },
        {
          title: 'Digital Marketing',
          description: 'Comprehensive digital marketing strategies including SEO optimization, PPC campaigns, email marketing automation, and conversion rate optimization.',
          icon: '📱'
        },
        {
          title: 'Cloud Infrastructure',
          description: 'Enterprise-grade cloud solutions on AWS, GCP, and Azure. DevOps automation, scalable hosting, and 24/7 monitoring for high-performance applications.',
          icon: '☁️'
        }
      ]
    }
  },
  {
    id: 'services-detailed',
    type: 'richText',
    data: {
      id: 'services-detailed',
      type: 'richText',
      visible: true,
      content: `<div class="py-16 bg-primary-50">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose CodeX Terminal?</h2>
          <div class="grid lg:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                <span class="text-white text-xl font-bold">⚡</span>
              </div>
              <h3 class="text-xl font-bold mb-4 text-gray-900">Fast Delivery</h3>
              <p class="text-gray-600 mb-4">Rapid development and deployment with agile methodologies. Most projects delivered within 4-6 weeks.</p>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Agile development process</li>
                <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Weekly progress updates</li>
                <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Rapid prototyping</li>
              </ul>
            </div>
            <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                <span class="text-white text-xl font-bold">🎯</span>
              </div>
              <h3 class="text-xl font-bold mb-4 text-gray-900">Expert Team</h3>
              <p class="text-gray-600 mb-4">Certified professionals with deep expertise in Shopware, modern web technologies, and cloud platforms.</p>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Shopware certified developers</li>
                <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>AWS/GCP cloud architects</li>
                <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Digital marketing specialists</li>
              </ul>
            </div>
            <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                <span class="text-white text-xl font-bold">🚀</span>
              </div>
              <h3 class="text-xl font-bold mb-4 text-gray-900">Full Support</h3>
              <p class="text-gray-600 mb-4">Comprehensive support from development to maintenance, including training, documentation, and ongoing optimization.</p>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>24/7 technical support</li>
                <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Complete documentation</li>
                <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Team training included</li>
              </ul>
            </div>
          </div>
        </div>
      </div>`
    }
  },
  {
    id: 'services-process',
    type: 'richText',
    data: {
      id: 'services-process',
      type: 'richText',
      visible: true,
      content: `<div class="py-16">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">Our Development Process</h2>
          <div class="grid lg:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white text-xl font-bold">1</span>
              </div>
              <h3 class="text-lg font-bold mb-2 text-gray-900">Discovery & Planning</h3>
              <p class="text-gray-600 text-sm">Comprehensive analysis of your requirements, technical architecture planning, and project roadmap creation.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white text-xl font-bold">2</span>
              </div>
              <h3 class="text-lg font-bold mb-2 text-gray-900">Design & Development</h3>
              <p class="text-gray-600 text-sm">Agile development with regular reviews, clean code practices, and comprehensive testing throughout the process.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white text-xl font-bold">3</span>
              </div>
              <h3 class="text-lg font-bold mb-2 text-gray-900">Testing & Deployment</h3>
              <p class="text-gray-600 text-sm">Thorough quality assurance testing, performance optimization, and seamless deployment to production environments.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white text-xl font-bold">4</span>
              </div>
              <h3 class="text-lg font-bold mb-2 text-gray-900">Support & Optimization</h3>
              <p class="text-gray-600 text-sm">Ongoing maintenance, performance monitoring, feature enhancements, and technical support for long-term success.</p>
            </div>
          </div>
        </div>
      </div>`
    }
  },
  {
    id: 'services-contact',
    type: 'richText',
    data: {
      id: 'services-contact',
      type: 'richText',
      visible: true,
      content: `<div class="py-16 bg-gray-50">
        <div class="max-w-4xl mx-auto px-6 text-center">
          <h2 class="text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
          <p class="text-lg text-gray-600 mb-8">Let's discuss your project and create a solution that drives your business forward.</p>
          <div class="bg-white p-8 rounded-xl shadow-sm">
            <div class="grid md:grid-cols-2 gap-8">
              <div class="text-left">
                <h3 class="text-xl font-bold mb-4 text-gray-900">Get in Touch</h3>
                <div class="space-y-3">
                  <div class="flex items-center space-x-3">
                    <span class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span class="text-primary-600 text-sm">📧</span>
                    </span>
                    <div>
                      <p class="text-sm text-gray-500">Email</p>
                      <a href="mailto:info@codexterminal.com" class="text-primary-600 font-medium hover:text-primary-700">info@codexterminal.com</a>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span class="text-primary-600 text-sm">⚡</span>
                    </span>
                    <div>
                      <p class="text-sm text-gray-500">Response Time</p>
                      <p class="text-gray-900 font-medium">Within 2 hours</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-left">
                <h3 class="text-xl font-bold mb-4 text-gray-900">What Happens Next?</h3>
                <div class="space-y-2 text-sm text-gray-600">
                  <p class="flex items-center"><span class="text-primary-600 mr-2">1.</span>We'll schedule a consultation call</p>
                  <p class="flex items-center"><span class="text-primary-600 mr-2">2.</span>Analyze your requirements and goals</p>
                  <p class="flex items-center"><span class="text-primary-600 mr-2">3.</span>Provide a detailed project proposal</p>
                  <p class="flex items-center"><span class="text-primary-600 mr-2">4.</span>Begin development with weekly updates</p>
                </div>
              </div>
            </div>
            <div class="mt-8 pt-6 border-t border-gray-200">
              <a href="/contact" class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:shadow-primary-500/25 hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105">
                Start Your Project Today
              </a>
            </div>
          </div>
        </div>
      </div>`
    }
  }
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const services = await getPublishedServices(locale);

  // Generate dynamic services block
  const dynamicServicesBlock = {
    id: 'services-overview',
    type: 'featureGrid',
    data: {
      id: 'services-overview',
      type: 'featureGrid',
      visible: true,
      heading: 'Our Core Services',
      subtitle: 'Specialized expertise across the entire digital ecosystem',
      features: services.map((service: any) => ({
        title: service.name,
        description: service.summary || 'Professional service offering.',
        icon: service.icon || '🔧',
        link: `/${locale}/services/${service.slug}`
      }))
    }
  };

  // Use dynamic services if available, otherwise fallback to static
  const dynamicBlocks = services.length > 0 
    ? servicesBlocks.map(block => 
        block.id === 'services-overview' ? dynamicServicesBlock : block
      )
    : servicesBlocks;

  return <BlockRenderer blocks={dynamicBlocks} />;
}

export const metadata = {
  title: 'Professional Development Services - Shopware, Marketing & Cloud Solutions',
  description: 'Comprehensive software development services including Shopware development, digital marketing, and cloud infrastructure. Contact info@codexterminal.com to get started.',
};