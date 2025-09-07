import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/BlockRenderer';

// Database connection to fetch services
async function getServiceBySlug(slug: string, locale: string) {
  try {
    // Use the web app's own API (on port 3000)
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/services?locale=${locale}&status=published`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    const services = Array.isArray(result) ? result : (result.data || []);
    const service = services.find((service: any) => service.slug === slug);
    
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

// Fallback hardcoded services for existing routes
const fallbackServices = {
  'shopware': {
    name: 'Shopware Development',
    slug: 'shopware',
    summary: 'Expert Shopware development services including plugins, migrations, and themes.',
    seo: {
      title: 'Shopware Development Services - Expert Plugin & Theme Development | CodeX Terminal',
      description: 'Professional Shopware 6 development services by certified experts. Custom plugins, responsive themes, Shopware 5 to 6 migrations, App Store development, performance optimization, and 24/7 support. Get your free consultation today!',
      keywords: 'shopware development, shopware 6, shopware plugins, shopware themes, shopware migration, ecommerce development, symfony development, php development, shopware app store, shopware optimization, shopware consulting, online shop development, shopware agency, shopware experts',
    },
    blocks: [
      {
        id: 'shopware-hero',
        type: 'hero',
        data: {
          id: 'shopware-hero',
          type: 'hero',
          visible: true,
          eyebrow: 'Shopware Development Specialists',
          headline: 'Expert Shopware Development Services',
          subcopy: 'From custom plugin development to complex enterprise migrations, we deliver expert Shopware solutions that drive your ecommerce success.',
          cta: {
            label: 'Start Your Shopware Project',
            href: '/contact?service=shopware'
          }
        }
      },
      {
        id: 'shopware-services',
        type: 'featureGrid',
        data: {
          id: 'shopware-services',
          type: 'featureGrid',
          visible: true,
          heading: 'Comprehensive Shopware Development Services',
          subtitle: 'Full-stack Shopware expertise covering every aspect of your ecommerce platform',
          columns: 3,
          features: [
            {
              icon: '🔌',
              title: 'Custom Plugin Development',
              description: 'Tailored plugins to extend Shopware functionality, optimize performance, and integrate with third-party systems.'
            },
            {
              icon: '🎨',
              title: 'Theme & Template Design',
              description: 'Responsive, conversion-optimized themes that reflect your brand and deliver exceptional user experiences.'
            },
            {
              icon: '🔄',
              title: 'Migration Services',
              description: 'Seamless migration from Shopware 5 to Shopware 6 or from other platforms like Magento, WooCommerce.'
            },
            {
              icon: '🚀',
              title: 'Performance Optimization',
              description: 'Advanced performance tuning, caching strategies, and code optimization for lightning-fast loading times.'
            },
            {
              icon: '🔐',
              title: 'Security Hardening',
              description: 'Comprehensive security audits, vulnerability fixes, and implementation of security best practices.'
            },
            {
              icon: '📱',
              title: 'App Store Development',
              description: 'Commercial plugin development for the Shopware App Store with certification support.'
            }
          ]
        }
      },
      {
        id: 'shopware-expertise',
        type: 'richText',
        data: {
          id: 'shopware-expertise',
          type: 'richText',
          visible: true,
          heading: 'Why Choose Our Shopware Development Team?',
          content: `
            <section class="py-16 bg-transparent">
              <div class="max-w-6xl mx-auto px-6">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Proven Shopware Expertise</h2>
                <div class="grid lg:grid-cols-2 gap-12 mb-16">
                  <div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">🏆 Certified Shopware Partners</h3>
                    <div class="space-y-4">
                      <div class="flex items-start">
                        <svg class="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <p class="text-gray-700">Official Shopware Partner status with certified developers</p>
                      </div>
                      <div class="flex items-start">
                        <svg class="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <p class="text-gray-700">Shopware 6 Advanced Developer certification</p>
                      </div>
                      <div class="flex items-start">
                        <svg class="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <p class="text-gray-700">Direct relationship with Shopware core team</p>
                      </div>
                      <div class="flex items-start">
                        <svg class="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <p class="text-gray-700">Early access to beta features and roadmap insights</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">📊 Impressive Track Record</h3>
                    <div class="grid md:grid-cols-2 gap-6">
                      <div class="text-center">
                        <div class="text-3xl font-bold text-primary-600 mb-2">150+</div>
                        <div class="text-sm text-gray-600">Shopware Projects</div>
                      </div>
                      <div class="text-center">
                        <div class="text-3xl font-bold text-primary-600 mb-2">50+</div>
                        <div class="text-sm text-gray-600">Custom Plugins</div>
                      </div>
                      <div class="text-center">
                        <div class="text-3xl font-bold text-primary-600 mb-2">25+</div>
                        <div class="text-sm text-gray-600">Migrations Completed</div>
                      </div>
                      <div class="text-center">
                        <div class="text-3xl font-bold text-primary-600 mb-2">99.8%</div>
                        <div class="text-sm text-gray-600">Client Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `
        }
      },
      {
        id: 'shopware-technologies',
        type: 'richText',
        data: {
          id: 'shopware-technologies',
          type: 'richText',
          visible: true,
          heading: 'Technology Stack & Integrations',
          content: `
            <section class="py-16 bg-transparent">
              <div class="max-w-6xl mx-auto px-6">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Advanced Shopware Technology Stack</h2>
                <div class="grid lg:grid-cols-3 gap-8">
                  <div class="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">🛠️ Core Technologies</h3>
                    <ul class="space-y-2 text-gray-700">
                      <li>• Shopware 6 & Symfony Framework</li>
                      <li>• PHP 8.x & Modern OOP Patterns</li>
                      <li>• MySQL/MariaDB Optimization</li>
                      <li>• Elasticsearch Integration</li>
                      <li>• Redis Caching & Sessions</li>
                      <li>• Docker & Container Deployment</li>
                    </ul>
                  </div>
                  <div class="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">🔗 Payment & Logistics</h3>
                    <ul class="space-y-2 text-gray-700">
                      <li>• PayPal, Stripe, Klarna Integration</li>
                      <li>• SEPA Direct Debit & Banking</li>
                      <li>• DHL, UPS, FedEx Shipping APIs</li>
                      <li>• Tax & Compliance Automation</li>
                      <li>• Multi-currency Support</li>
                      <li>• PCI DSS Compliance</li>
                    </ul>
                  </div>
                  <div class="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">📈 Marketing & Analytics</h3>
                    <ul class="space-y-2 text-gray-700">
                      <li>• Google Analytics 4 & GTM</li>
                      <li>• Facebook Pixel & Conversions API</li>
                      <li>• Email Marketing (Mailchimp, Klaviyo)</li>
                      <li>• SEO Optimization & Schema.org</li>
                      <li>• A/B Testing Frameworks</li>
                      <li>• Customer Journey Analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          `
        }
      },
      {
        id: 'shopware-process',
        type: 'richText',
        data: {
          id: 'shopware-process',
          type: 'richText',
          visible: true,
          heading: 'Our Shopware Development Process',
          content: `
            <section class="py-16 bg-transparent">
              <div class="max-w-6xl mx-auto px-6">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Structured Development Approach</h2>
                <div class="space-y-8">
                  <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">1</div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Discovery & Requirements Analysis</h3>
                      <p class="text-gray-700">Comprehensive analysis of your business needs, technical requirements, and integration challenges. We create detailed specifications and project roadmaps.</p>
                    </div>
                  </div>
                  <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">2</div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Architecture & Technical Design</h3>
                      <p class="text-gray-700">System architecture planning, database design, API specifications, and security considerations. We ensure scalability and maintainability from day one.</p>
                    </div>
                  </div>
                  <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">3</div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Agile Development & Testing</h3>
                      <p class="text-gray-700">Iterative development with regular demos, comprehensive testing (unit, integration, performance), and continuous integration deployment.</p>
                    </div>
                  </div>
                  <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">4</div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Launch & Post-Launch Support</h3>
                      <p class="text-gray-700">Careful deployment planning, performance monitoring, user training, and ongoing maintenance with 24/7 support availability.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `
        }
      },
      {
        id: 'shopware-faq',
        type: 'faq',
        data: {
          id: 'shopware-faq',
          type: 'faq',
          visible: true,
          heading: 'Frequently Asked Questions',
          items: [
            {
              q: 'How long does a typical Shopware project take?',
              a: 'Project timelines vary based on complexity. A basic theme customization takes 2-4 weeks, custom plugin development 4-8 weeks, and full platform migrations 8-16 weeks. We provide detailed timelines during the discovery phase.'
            },
            {
              q: 'Do you offer Shopware 5 to Shopware 6 migration services?',
              a: 'Yes, we specialize in Shopware 5 to 6 migrations. Our process includes data migration, theme reconstruction, plugin compatibility analysis, and thorough testing to ensure a smooth transition with minimal downtime.'
            },
            {
              q: 'Can you develop plugins for the Shopware App Store?',
              a: 'Absolutely! We develop commercial plugins for the Shopware App Store, handling everything from concept to certification. Our plugins follow Shopware best practices and undergo rigorous quality assurance.'
            },
            {
              q: 'What kind of ongoing support do you provide?',
              a: 'We offer comprehensive maintenance packages including security updates, performance monitoring, bug fixes, and feature enhancements. Our support includes 24/7 monitoring and emergency response options.'
            },
            {
              q: 'Do you handle third-party integrations?',
              a: 'Yes, we integrate Shopware with ERPs (SAP, Microsoft Dynamics), CRMs (Salesforce, HubSpot), payment providers, shipping carriers, and marketing tools. We ensure seamless data flow and real-time synchronization.'
            },
            {
              q: 'What about Shopware performance optimization?',
              a: 'Our optimization services include database tuning, caching implementation, code profiling, CDN setup, and server configuration. We typically achieve 40-60% improvement in page load times.'
            }
          ]
        }
      },
      {
        id: 'shopware-contact',
        type: 'richText',
        data: {
          id: 'shopware-contact',
          type: 'richText',
          visible: true,
          content: `
            <section class="py-16 bg-transparent">
              <div class="max-w-4xl mx-auto px-6 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Shopware Project?</h2>
                <p class="text-lg text-gray-600 mb-8">Get expert consultation and a detailed project proposal from our certified Shopware development team</p>
                <div class="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8 max-w-2xl mx-auto">
                  <div class="grid md:grid-cols-2 gap-6 text-left">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 mb-3">Free Shopware Consultation Includes:</h3>
                      <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center">
                          <svg class="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          Technical requirements analysis
                        </li>
                        <li class="flex items-center">
                          <svg class="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          Project timeline and cost estimate
                        </li>
                        <li class="flex items-center">
                          <svg class="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          Architecture recommendations
                        </li>
                        <li class="flex items-center">
                          <svg class="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          Integration strategy planning
                        </li>
                        <li class="flex items-center">
                          <svg class="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          Performance optimization audit
                        </li>
                      </ul>
                    </div>
                    <div class="flex flex-col justify-center">
                      <div class="bg-white/95 backdrop-blur-sm border border-gray-200/80 p-4 rounded-lg mb-4 shadow-sm">
                        <p class="text-sm text-gray-900 font-semibold mb-2">Contact Information:</p>
                        <p class="text-gray-800 text-sm font-medium">📧 <a href="mailto:info@codexterminal.com" class="underline">info@codexterminal.com</a></p>
                        <p class="text-gray-800 text-sm font-medium">📱 +1 (555) 123-SHOP</p>
                        <p class="text-gray-800 text-sm font-medium">⏰ Response within 4 hours</p>
                      </div>
                      <a href="/contact" class="block w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center no-underline">Get Shopware Consultation</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `
        }
      }
    ]
  },
  'marketing': {
    name: 'Digital Marketing',
    slug: 'marketing',
    summary: 'Comprehensive digital marketing services to grow your business online.',
    seo: {
      title: 'Digital Marketing Services - SEO, PPC & Content Marketing',
      description: 'Professional digital marketing services including SEO optimization, PPC campaigns, and content marketing strategies.',
    },
    blocks: [
      {
        id: 'marketing-hero',
        type: 'hero',
        data: {
          id: 'marketing-hero',
          type: 'hero',
          visible: true,
          eyebrow: 'Digital Marketing Experts',
          headline: 'Grow Your Business with Digital Marketing',
          subcopy: 'Comprehensive digital marketing strategies that drive traffic, generate leads, and increase conversions.',
          cta: {
            label: 'Get Marketing Consultation',
            href: '/contact?service=marketing'
          }
        }
      },
      {
        id: 'shopware-services',
        type: 'featureGrid',
        data: {
          id: 'shopware-services',
          type: 'featureGrid',
          visible: true,
          heading: 'Comprehensive Shopware Development Services',
          subtitle: 'Full-stack Shopware expertise covering every aspect of your ecommerce platform',
          columns: 3,
          features: [
            {
              icon: '🔌',
              title: 'Custom Plugin Development',
              description: 'Tailored plugins to extend Shopware functionality, optimize performance, and integrate with third-party systems like ERP, CRM, and payment gateways.'
            },
            {
              icon: '🎨',
              title: 'Theme & Template Design',
              description: 'Responsive, conversion-optimized themes that reflect your brand and deliver exceptional user experiences across all devices.'
            },
            {
              icon: '🔄',
              title: 'Shopware 5 to 6 Migration',
              description: 'Seamless migration from Shopware 5 to Shopware 6 or from other platforms like Magento, WooCommerce with zero data loss.'
            },
            {
              icon: '🚀',
              title: 'Performance Optimization',
              description: 'Advanced performance tuning, caching strategies, and code optimization for lightning-fast loading times and better conversions.'
            },
            {
              icon: '🔐',
              title: 'Security & Compliance',
              description: 'Comprehensive security audits, vulnerability fixes, and implementation of security best practices and compliance standards.'
            },
            {
              icon: '📱',
              title: 'App Store Development',
              description: 'Commercial plugin development for the Shopware App Store with full certification support and ongoing maintenance.'
            }
          ]
        }
      },
      {
        id: 'shopware-expertise',
        type: 'richText',
        data: {
          id: 'shopware-expertise',
          type: 'richText',
          visible: true,
          content: `
            <section class="py-16 bg-transparent">
              <div class="max-w-6xl mx-auto px-6">
                <div class="text-center mb-12">
                  <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Certified Shopware Development Experts</h2>
                  <p class="text-lg text-gray-600 max-w-3xl mx-auto">Official Shopware Partners with proven expertise in Shopware 6 development, plugin creation, and enterprise-grade e-commerce solutions</p>
                </div>
                <div class="grid lg:grid-cols-2 gap-12 mb-16">
                  <div class="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
                    <h3 class="text-2xl font-bold text-primary-600 mb-6">🏆 Official Shopware Partner</h3>
                    <div class="space-y-4">
                      <div class="flex items-start">
                        <svg class="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <p class="text-gray-700"><strong>Shopware 6 Certified Developers</strong> - Advanced certification in modern Shopware development</p>
                      </div>
                      <div class="flex items-start">
                        <svg class="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <p class="text-gray-700"><strong>Direct Shopware Partnership</strong> - Exclusive access to beta features and technical support</p>
                      </div>
                      <div class="flex items-start">
                        <svg class="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <p class="text-gray-700"><strong>Enterprise Solution Architecture</strong> - Complex multi-store and B2B implementations</p>
                      </div>
                      <div class="flex items-start">
                        <svg class="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <p class="text-gray-700"><strong>App Store Publishers</strong> - Published multiple commercial apps on Shopware Store</p>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
                    <h3 class="text-2xl font-bold text-primary-600 mb-6">📊 Proven Track Record</h3>
                    <div class="grid grid-cols-2 gap-6 mb-6">
                      <div class="text-center">
                        <div class="text-4xl font-bold text-primary-600 mb-2">200+</div>
                        <div class="text-sm text-gray-600">Shopware Projects Delivered</div>
                      </div>
                      <div class="text-center">
                        <div class="text-4xl font-bold text-primary-600 mb-2">75+</div>
                        <div class="text-sm text-gray-600">Custom Plugins Developed</div>
                      </div>
                      <div class="text-center">
                        <div class="text-4xl font-bold text-primary-600 mb-2">50+</div>
                        <div class="text-sm text-gray-600">Successful Migrations</div>
                      </div>
                      <div class="text-center">
                        <div class="text-4xl font-bold text-primary-600 mb-2">99.5%</div>
                        <div class="text-sm text-gray-600">Client Satisfaction Rate</div>
                      </div>
                    </div>
                    <div class="text-center">
                      <p class="text-gray-700 font-medium">From startup e-commerce stores to enterprise-level multi-channel solutions</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `
        }
      },
      {
        id: 'shopware-technologies',
        type: 'richText',
        data: {
          id: 'shopware-technologies',
          type: 'richText',
          visible: true,
          content: `
            <section class="py-16 bg-transparent">
              <div class="max-w-6xl mx-auto px-6">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Advanced Shopware Technology Stack</h2>
                <div class="grid lg:grid-cols-3 gap-8">
                  <div class="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">🛠️ Core Technologies</h3>
                    <ul class="space-y-2 text-gray-700">
                      <li>• Shopware 6 & Symfony Framework</li>
                      <li>• PHP 8.x & Modern OOP Patterns</li>
                      <li>• MySQL/MariaDB Optimization</li>
                      <li>• Elasticsearch Integration</li>
                      <li>• Redis Caching & Sessions</li>
                      <li>• Docker & Container Deployment</li>
                    </ul>
                  </div>
                  <div class="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">🔗 Payment & Logistics</h3>
                    <ul class="space-y-2 text-gray-700">
                      <li>• PayPal, Stripe, Klarna Integration</li>
                      <li>• SEPA Direct Debit & Banking</li>
                      <li>• DHL, UPS, FedEx Shipping APIs</li>
                      <li>• Tax & Compliance Automation</li>
                      <li>• Multi-currency Support</li>
                      <li>• PCI DSS Compliance</li>
                    </ul>
                  </div>
                  <div class="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">📈 Marketing & Analytics</h3>
                    <ul class="space-y-2 text-gray-700">
                      <li>• Google Analytics 4 & GTM</li>
                      <li>• Facebook Pixel & Conversions API</li>
                      <li>• Email Marketing (Mailchimp, Klaviyo)</li>
                      <li>• SEO Optimization & Schema.org</li>
                      <li>• A/B Testing Frameworks</li>
                      <li>• Customer Journey Analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          `
        }
      },
      {
        id: 'shopware-process',
        type: 'richText',
        data: {
          id: 'shopware-process',
          type: 'richText',
          visible: true,
          content: `
            <section class="py-16 bg-transparent">
              <div class="max-w-6xl mx-auto px-6">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Our Shopware Development Process</h2>
                <div class="space-y-8">
                  <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">1</div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Discovery & Requirements Analysis</h3>
                      <p class="text-gray-700">Comprehensive analysis of your business needs, technical requirements, and integration challenges. We create detailed specifications and project roadmaps tailored to your Shopware goals.</p>
                    </div>
                  </div>
                  <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">2</div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Architecture & Technical Design</h3>
                      <p class="text-gray-700">Shopware-specific system architecture planning, database design, plugin architecture, API specifications, and security considerations. We ensure scalability and maintainability from day one.</p>
                    </div>
                  </div>
                  <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">3</div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Agile Development & Testing</h3>
                      <p class="text-gray-700">Iterative Shopware development with regular demos, comprehensive testing (unit, integration, performance), and continuous integration deployment following Shopware best practices.</p>
                    </div>
                  </div>
                  <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">4</div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Launch & Post-Launch Support</h3>
                      <p class="text-gray-700">Careful deployment planning, performance monitoring, user training, and ongoing Shopware maintenance with 24/7 support availability and regular updates.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `
        }
      },
      {
        id: 'shopware-faq',
        type: 'faq',
        data: {
          id: 'shopware-faq',
          type: 'faq',
          visible: true,
          heading: 'Frequently Asked Questions',
          items: [
            {
              q: 'How long does a typical Shopware project take?',
              a: 'Project timelines vary based on complexity. A basic theme customization takes 2-4 weeks, custom plugin development 4-8 weeks, and full platform migrations 8-16 weeks. We provide detailed timelines during the discovery phase with milestone-based delivery.'
            },
            {
              q: 'Do you offer Shopware 5 to Shopware 6 migration services?',
              a: 'Yes, we specialize in Shopware 5 to 6 migrations. Our process includes complete data migration, theme reconstruction, plugin compatibility analysis, and thorough testing to ensure a smooth transition with minimal downtime and zero data loss.'
            },
            {
              q: 'Can you develop plugins for the Shopware App Store?',
              a: 'Absolutely! We develop commercial plugins for the Shopware App Store, handling everything from concept to certification. Our plugins follow Shopware best practices, undergo rigorous quality assurance, and include ongoing maintenance and support.'
            },
            {
              q: 'What kind of ongoing support do you provide?',
              a: 'We offer comprehensive Shopware maintenance packages including security updates, performance monitoring, bug fixes, and feature enhancements. Our support includes 24/7 monitoring, emergency response options, and regular health checks for optimal performance.'
            },
            {
              q: 'Do you handle third-party integrations with Shopware?',
              a: 'Yes, we integrate Shopware with ERPs (SAP, Microsoft Dynamics), CRMs (Salesforce, HubSpot), payment providers, shipping carriers, marketing tools, and custom APIs. We ensure seamless data flow and real-time synchronization.'
            },
            {
              q: 'What about Shopware performance optimization?',
              a: 'Our Shopware optimization services include database tuning, caching implementation, code profiling, CDN setup, and server configuration. We typically achieve 40-60% improvement in page load times and significantly better conversion rates.'
            },
            {
              q: 'How much does Shopware development cost?',
              a: 'Shopware development costs vary based on project scope. Basic theme customizations start from $2,000, custom plugins from $3,000, and full e-commerce implementations from $15,000. We provide detailed quotes after the free consultation.'
            },
            {
              q: 'Do you provide Shopware hosting and server management?',
              a: 'Yes, we offer managed Shopware hosting on optimized cloud infrastructure with auto-scaling, CDN, security monitoring, automated backups, and 99.9% uptime SLA. We handle all technical aspects so you can focus on your business.'
            }
          ]
        }
      },
      {
        id: 'shopware-contact',
        type: 'richText',
        data: {
          id: 'shopware-contact',
          type: 'richText',
          visible: true,
          content: `
            <section class="py-16 bg-transparent">
              <div class="max-w-4xl mx-auto px-6 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Shopware Project?</h2>
                <p class="text-lg text-gray-600 mb-8">Get expert consultation and a detailed project proposal from our certified Shopware development team</p>
                <div class="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8 max-w-2xl mx-auto">
                  <div class="grid md:grid-cols-2 gap-6 text-left">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 mb-3">Free Shopware Consultation Includes:</h3>
                      <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center">
                          <svg class="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          Shopware technical requirements analysis
                        </li>
                        <li class="flex items-center">
                          <svg class="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          Project timeline and cost estimate
                        </li>
                        <li class="flex items-center">
                          <svg class="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          Shopware architecture recommendations
                        </li>
                        <li class="flex items-center">
                          <svg class="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          Integration strategy planning
                        </li>
                        <li class="flex items-center">
                          <svg class="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                          Performance optimization audit
                        </li>
                      </ul>
                    </div>
                    <div class="flex flex-col justify-center">
                      <div class="bg-white/95 backdrop-blur-sm border border-gray-200/80 p-4 rounded-lg mb-4 shadow-sm">
                        <p class="text-sm text-gray-900 font-semibold mb-2">Contact Information:</p>
                        <p class="text-gray-800 text-sm font-medium">📧 <a href="mailto:info@codexterminal.com" class="underline">info@codexterminal.com</a></p>
                        <p class="text-gray-800 text-sm font-medium">📱 +1 (555) 123-SHOP</p>
                        <p class="text-gray-800 text-sm font-medium">⏰ Response within 4 hours</p>
                      </div>
                      <a href="/contact" class="block w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center no-underline">Get Shopware Consultation</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `
        }
      }
    ]
  },
  'cloud': {
    name: 'Cloud Infrastructure',
    slug: 'cloud',
    summary: 'Scalable cloud infrastructure solutions on AWS, GCP, and Azure.',
    seo: {
      title: 'Cloud Infrastructure Services - AWS, GCP & Azure Solutions',
      description: 'Professional cloud infrastructure services including DevOps automation, scalable hosting, and 24/7 monitoring.',
    },
    blocks: [
      {
        id: 'cloud-hero',
        type: 'hero',
        data: {
          id: 'cloud-hero',
          type: 'hero',
          visible: true,
          eyebrow: 'Cloud Infrastructure Specialists',
          headline: 'Enterprise Cloud Solutions',
          subcopy: 'Scalable, secure cloud infrastructure that grows with your business. 24/7 monitoring and support included.',
          cta: {
            label: 'Discuss Cloud Strategy',
            href: '/contact?service=cloud'
          }
        }
      },
    ]
  }
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  // Try to get service from database first
  let service = await getServiceBySlug(slug, locale);

  // No fallback content: render only what exists in the database

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
