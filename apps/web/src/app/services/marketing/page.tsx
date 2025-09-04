import { BlockRenderer } from '@/components/BlockRenderer';

// Marketing-specific content
const marketingBlocks = [
  {
    id: 'marketing-hero',
    type: 'hero',
    data: {
      id: 'marketing-hero',
      type: 'hero',
      visible: true,
      eyebrow: 'Digital Marketing Specialists',
      headline: 'Comprehensive Digital Marketing for Ecommerce',
      subcopy: 'Drive traffic, increase conversions, and maximize ROI with our specialized digital marketing services designed specifically for ecommerce businesses.',
      cta: {
        label: 'Get Marketing Strategy',
        href: '/contact?service=marketing'
      }
    }
  },
  {
    id: 'marketing-services',
    type: 'featureGrid',
    data: {
      id: 'marketing-services',
      type: 'featureGrid',
      visible: true,
      heading: 'Complete Digital Marketing Services',
      subtitle: 'Everything you need to grow your ecommerce business online',
      features: [
        {
          title: 'Ecommerce SEO Optimization',
          description: 'Technical SEO, keyword research, product page optimization, and schema markup specifically designed for ecommerce platforms like Shopware to improve organic visibility and search rankings.',
          icon: '🔍'
        },
        {
          title: 'Pay-Per-Click Advertising',
          description: 'Strategic Google Ads, Shopping campaigns, Facebook Ads, and social media advertising with advanced targeting, conversion tracking, and ROI optimization for maximum ecommerce performance.',
          icon: '📊'
        },
        {
          title: 'Email Marketing Automation',
          description: 'Advanced email sequences, cart abandonment recovery, customer segmentation, lifecycle campaigns, and personalized product recommendations to increase customer lifetime value.',
          icon: '📧'
        },
        {
          title: 'Conversion Rate Optimization',
          description: 'A/B testing, user experience analysis, checkout optimization, landing page improvements, and data-driven strategies to increase your ecommerce conversion rates and revenue.',
          icon: '📈'
        },
        {
          title: 'Social Media Marketing',
          description: 'Instagram Shopping, Facebook Catalog integration, influencer partnerships, social commerce strategies, and community building to expand your brand reach and drive sales.',
          icon: '📱'
        },
        {
          title: 'Marketing Analytics & Reporting',
          description: 'Advanced tracking setup, Google Analytics 4 implementation, marketing attribution modeling, performance dashboards, and actionable insights to optimize your marketing spend.',
          icon: '📋'
        }
      ]
    }
  },
  {
    id: 'marketing-process',
    type: 'richText',
    data: {
      id: 'marketing-process',
      type: 'richText',
      visible: true,
      content: `<div class="py-16 bg-gray-50">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">Our Marketing Process</h2>
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div class="space-y-6">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Strategy Development</h3>
                    <p class="text-gray-600">Comprehensive analysis of your business, competitors, and target audience to create a tailored marketing strategy.</p>
                  </div>
                </div>
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Campaign Setup</h3>
                    <p class="text-gray-600">Implementation of tracking, campaign creation, content development, and technical setup across all channels.</p>
                  </div>
                </div>
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Optimization & Testing</h3>
                    <p class="text-gray-600">Continuous A/B testing, performance monitoring, and data-driven optimization to improve results.</p>
                  </div>
                </div>
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Reporting & Growth</h3>
                    <p class="text-gray-600">Monthly reports, strategic recommendations, and scaling successful campaigns for maximum ROI.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-white p-8 rounded-lg shadow-sm">
              <h3 class="text-xl font-bold mb-6 text-gray-900">Marketing Results We Deliver</h3>
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <span class="text-green-500 text-xl">✓</span>
                  <span class="text-gray-700">Increased organic traffic by 150%+ on average</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-green-500 text-xl">✓</span>
                  <span class="text-gray-700">Improved conversion rates by 25-50%</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-green-500 text-xl">✓</span>
                  <span class="text-gray-700">Reduced customer acquisition cost by 30%</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-green-500 text-xl">✓</span>
                  <span class="text-gray-700">3-5x return on ad spend (ROAS)</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-green-500 text-xl">✓</span>
                  <span class="text-gray-700">Increased customer lifetime value by 40%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`
    }
  }
];

export default function MarketingServicesPage() {
  return <BlockRenderer blocks={marketingBlocks} />;
}

export const metadata = {
  title: 'Digital Marketing Services - Ecommerce Marketing Specialists',
  description: 'Comprehensive digital marketing services for ecommerce businesses. SEO, PPC, email marketing, social media, and conversion optimization.',
};