import { BlockRenderer } from '@/components/BlockRenderer';

// Cloud services specific content
const cloudBlocks = [
  {
    id: 'cloud-hero',
    type: 'hero',
    data: {
      id: 'cloud-hero',
      type: 'hero',
      visible: true,
      eyebrow: 'Cloud Infrastructure Specialists',
      headline: 'Enterprise Cloud Infrastructure & DevOps',
      subcopy: 'High-performance cloud infrastructure specifically optimized for Shopware and ecommerce platforms with auto-scaling, enterprise security, and 24/7 support.',
      cta: {
        label: 'Get Cloud Strategy',
        href: '/contact?service=cloud'
      }
    }
  },
  {
    id: 'cloud-services',
    type: 'richText',
    data: {
      id: 'cloud-services',
      type: 'richText',
      visible: true,
      content: `<div class="py-16">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">Cloud Infrastructure & DevOps</h2>
          <div class="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 class="text-2xl font-bold mb-6 text-primary-600">Shopware-Optimized Hosting</h3>
              <p class="text-gray-600 mb-6">High-performance cloud infrastructure specifically optimized for Shopware stores with auto-scaling and enterprise security.</p>
              <div class="grid sm:grid-cols-2 gap-4">
                <div class="bg-primary-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-primary-600 mb-2">AWS Solutions</h4>
                  <p class="text-sm text-gray-600">EC2, RDS, CloudFront CDN, and S3 storage optimized for Shopware</p>
                </div>
                <div class="bg-primary-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-primary-600 mb-2">Performance Optimization</h4>
                  <p class="text-sm text-gray-600">Redis caching, Elasticsearch, and database optimization</p>
                </div>
                <div class="bg-primary-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-primary-600 mb-2">Security & Monitoring</h4>
                  <p class="text-sm text-gray-600">24/7 monitoring, SSL certificates, and security hardening</p>
                </div>
                <div class="bg-primary-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-primary-600 mb-2">CI/CD Pipelines</h4>
                  <p class="text-sm text-gray-600">Automated deployment and testing workflows</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 p-8 rounded-lg">
              <h3 class="text-xl font-bold mb-4 text-gray-900">Why Choose Our Cloud Services?</h3>
              <ul class="space-y-3 text-gray-600">
                <li class="flex items-start">
                  <span class="text-primary-600 mr-2">✓</span>
                  99.9% uptime guarantee
                </li>
                <li class="flex items-start">
                  <span class="text-primary-600 mr-2">✓</span>
                  Auto-scaling for traffic spikes
                </li>
                <li class="flex items-start">
                  <span class="text-primary-600 mr-2">✓</span>
                  Regular backups and disaster recovery
                </li>
                <li class="flex items-start">
                  <span class="text-primary-600 mr-2">✓</span>
                  PCI DSS compliance
                </li>
                <li class="flex items-start">
                  <span class="text-primary-600 mr-2">✓</span>
                  Global CDN for fast loading times
                </li>
                <li class="flex items-start">
                  <span class="text-primary-600 mr-2">✓</span>
                  Expert support from certified cloud engineers
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>`
    }
  },
  {
    id: 'cloud-platforms',
    type: 'featureGrid',
    data: {
      id: 'cloud-platforms',
      type: 'featureGrid',
      visible: true,
      heading: 'Multi-Cloud Expertise',
      subtitle: 'We work with all major cloud platforms to provide the best solution for your needs',
      features: [
        {
          title: 'Amazon Web Services (AWS)',
          description: 'Complete AWS solutions including EC2, RDS, S3, CloudFront, Lambda, and more. AWS certified architects design scalable infrastructures.',
          icon: '☁️'
        },
        {
          title: 'Google Cloud Platform (GCP)',
          description: 'Google Cloud solutions with Compute Engine, Cloud SQL, Cloud Storage, and advanced AI/ML services for modern applications.',
          icon: '🌐'
        },
        {
          title: 'Microsoft Azure',
          description: 'Azure cloud services including Virtual Machines, Azure SQL, Blob Storage, and comprehensive enterprise integration solutions.',
          icon: '⚡'
        },
        {
          title: 'DevOps & CI/CD',
          description: 'Automated deployment pipelines, infrastructure as code, monitoring, logging, and continuous integration/deployment workflows.',
          icon: '🔧'
        },
        {
          title: 'Kubernetes & Containers',
          description: 'Container orchestration with Kubernetes, Docker containerization, microservices architecture, and scalable deployments.',
          icon: '📦'
        },
        {
          title: '24/7 Support & Monitoring',
          description: 'Round-the-clock monitoring, incident response, performance optimization, and proactive maintenance of your infrastructure.',
          icon: '🛡️'
        }
      ]
    }
  }
];

export default function CloudServicesPage() {
  return <BlockRenderer blocks={cloudBlocks} />;
}

export const metadata = {
  title: 'Cloud Infrastructure & DevOps Services - AWS, GCP, Azure Specialists',
  description: 'Professional cloud infrastructure and DevOps services. AWS, Google Cloud, Azure hosting optimized for Shopware and ecommerce platforms.',
};