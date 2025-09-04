import { BlockRenderer } from '@/components/BlockRenderer';

// Shopware-specific content
const shopwareBlocks = [
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
    id: 'shopware-main-services',
    type: 'richText',
    data: {
      id: 'shopware-main-services',
      type: 'richText',
      visible: true,
      content: `<div class="py-16">
        <div class="max-w-6xl mx-auto px-6">
          <h2 id="shopware" class="text-3xl font-bold text-center mb-12 text-gray-900">Complete Shopware Development Expertise</h2>
          <div class="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 class="text-2xl font-bold mb-6 text-primary-600">Custom Plugin Development</h3>
              <p class="text-lg text-gray-600 mb-6">Build powerful, scalable Shopware plugins that extend your store functionality exactly as your business requires. Our plugins follow Shopware best practices and are built for performance.</p>
              <ul class="space-y-3 text-gray-600">
                <li class="flex items-start"><span class="text-primary-600 mr-2">✓</span>Payment gateway integrations</li>
                <li class="flex items-start"><span class="text-primary-600 mr-2">✓</span>Custom product configurators</li>
                <li class="flex items-start"><span class="text-primary-600 mr-2">✓</span>Advanced pricing rules</li>
                <li class="flex items-start"><span class="text-primary-600 mr-2">✓</span>Inventory management systems</li>
                <li class="flex items-start"><span class="text-primary-600 mr-2">✓</span>Customer portal extensions</li>
                <li class="flex items-start"><span class="text-primary-600 mr-2">✓</span>API integrations with third-party systems</li>
              </ul>
            </div>
            <div class="bg-gray-50 p-8 rounded-lg">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Shopware Plugin Development" class="w-full rounded-lg">
            </div>
          </div>
        </div>
      </div>`
    }
  },
  {
    id: 'shopware-extensions',
    type: 'richText',
    data: {
      id: 'shopware-extensions',
      type: 'richText',
      visible: true,
      content: `<div class="bg-primary-50 py-16">
        <div class="max-w-6xl mx-auto px-6">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="bg-white p-8 rounded-lg shadow-sm">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Shopware Extensions" class="w-full rounded-lg mb-4">
            </div>
            <div>
              <h2 id="shopware-extensions" class="text-3xl font-bold mb-6 text-gray-900">Shopware Extensions & Apps</h2>
              <p class="text-lg text-gray-600 mb-6">Develop sophisticated Shopware Apps for the official App Store or private distribution. We handle everything from concept to App Store approval.</p>
              <div class="grid sm:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg shadow-sm">
                  <h4 class="font-semibold text-primary-600 mb-2">App Store Apps</h4>
                  <p class="text-sm text-gray-600">Commercial apps for the Shopware App Store with full approval process support</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm">
                  <h4 class="font-semibold text-primary-600 mb-2">Private Apps</h4>
                  <p class="text-sm text-gray-600">Custom enterprise apps for internal use with advanced security features</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm">
                  <h4 class="font-semibold text-primary-600 mb-2">Theme Development</h4>
                  <p class="text-sm text-gray-600">Responsive, performance-optimized themes that convert visitors to customers</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm">
                  <h4 class="font-semibold text-primary-600 mb-2">Extension Updates</h4>
                  <p class="text-sm text-gray-600">Maintenance and updates for existing plugins and themes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`
    }
  },
  {
    id: 'shopware-migrations',
    type: 'richText',
    data: {
      id: 'shopware-migrations',
      type: 'richText',
      visible: true,
      content: `<div class="py-16">
        <div class="max-w-6xl mx-auto px-6">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="shopware-migrations" class="text-3xl font-bold mb-6 text-gray-900">Shopware Migrations & Upgrades</h2>
              <p class="text-lg text-gray-600 mb-6">Seamlessly migrate your existing ecommerce store to Shopware or upgrade from older Shopware versions. We ensure zero data loss and minimal downtime.</p>
              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Data Analysis & Planning</h4>
                    <p class="text-gray-600 text-sm">Comprehensive audit of your current system and migration strategy development</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Custom Migration Scripts</h4>
                    <p class="text-gray-600 text-sm">Development of specialized tools for your specific data structure</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Testing & Validation</h4>
                    <p class="text-gray-600 text-sm">Extensive testing to ensure data integrity and functionality</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Go-Live Support</h4>
                    <p class="text-gray-600 text-sm">24/7 support during the migration process and post-launch</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 p-8 rounded-lg">
              <h3 class="text-xl font-bold mb-4 text-gray-900">Supported Migration Sources</h3>
              <div class="grid sm:grid-cols-2 gap-4 text-sm">
                <div class="flex items-center space-x-2">
                  <span class="text-green-500">✓</span>
                  <span>Magento 1 & 2</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-green-500">✓</span>
                  <span>WooCommerce</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-green-500">✓</span>
                  <span>Shopware 5</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-green-500">✓</span>
                  <span>PrestaShop</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-green-500">✓</span>
                  <span>OpenCart</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-green-500">✓</span>
                  <span>Custom Systems</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`
    }
  }
];

export default function ShopwareServicesPage() {
  return <BlockRenderer blocks={shopwareBlocks} />;
}

export const metadata = {
  title: 'Shopware Development Services - Expert Plugin Development & Migrations',
  description: 'Professional Shopware development services. Custom plugins, themes, migrations, and App Store development by certified Shopware experts.',
};