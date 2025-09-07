import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create Pages for Services
  const shopwarePage = await prisma.page.create({
    data: {
      slug: 'shopware-development',
      locale: 'en',
      title: 'Shopware Development Services',
      status: 'published',
      seo: {
        title: 'Expert Shopware Development | CodeX Terminal',
        description: 'Professional Shopware development services including custom plugins, theme development, migrations, and App Store solutions.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
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
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'shopware-features',
              type: 'featureGrid',
              visible: true,
              heading: 'Comprehensive Shopware Solutions',
              subtitle: 'Everything you need for successful Shopware implementation',
              features: [
                {
                  title: 'Custom Plugin Development',
                  description: 'Tailored plugins that extend Shopware functionality to meet your specific business requirements.',
                  icon: '🔧'
                },
                {
                  title: 'Theme Development',
                  description: 'Beautiful, responsive themes that provide exceptional user experience and drive conversions.',
                  icon: '🎨'
                },
                {
                  title: 'Store Migration',
                  description: 'Seamless migration from other platforms to Shopware with zero data loss and minimal downtime.',
                  icon: '🚀'
                },
                {
                  title: 'App Store Development',
                  description: 'Develop and publish apps on the Shopware App Store to reach thousands of merchants.',
                  icon: '📱'
                },
                {
                  title: 'Performance Optimization',
                  description: 'Speed up your Shopware store for better user experience and higher conversion rates.',
                  icon: '⚡'
                },
                {
                  title: 'Ongoing Support',
                  description: '24/7 technical support, maintenance, and continuous improvement for your Shopware store.',
                  icon: '🛡️'
                }
              ]
            }
          },
          {
            type: 'richText',
            order: 2,
            data: {
              id: 'shopware-details',
              type: 'richText',
              visible: true,
              content: `<div class="py-16 bg-gray-50">
                <div class="max-w-6xl mx-auto px-6">
                  <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Us for Shopware Development?</h2>
                  <div class="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 class="text-xl font-bold mb-4 text-gray-900">Certified Expertise</h3>
                      <p class="text-gray-600 mb-4">Our team consists of Shopware certified developers with years of experience building successful ecommerce stores.</p>
                      <ul class="space-y-2 text-gray-600">
                        <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Official Shopware Partners</li>
                        <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>100+ Successful Projects</li>
                        <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Expert in Shopware 6</li>
                      </ul>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold mb-4 text-gray-900">Proven Process</h3>
                      <p class="text-gray-600 mb-4">We follow agile methodologies to deliver your project on time and within budget.</p>
                      <ul class="space-y-2 text-gray-600">
                        <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Requirements Analysis</li>
                        <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Iterative Development</li>
                        <li class="flex items-center"><span class="text-primary-600 mr-2">✓</span>Thorough Testing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>`
            }
          }
        ]
      }
    }
  });

  const marketingPage = await prisma.page.create({
    data: {
      slug: 'digital-marketing',
      locale: 'en',
      title: 'Digital Marketing Services',
      status: 'published',
      seo: {
        title: 'Digital Marketing Services | CodeX Terminal',
        description: 'Comprehensive digital marketing services including SEO, PPC, content marketing, and conversion optimization.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'marketing-hero',
              type: 'hero',
              visible: true,
              eyebrow: 'Digital Marketing Excellence',
              headline: 'Grow Your Business with Digital Marketing',
              subcopy: 'Data-driven marketing strategies that drive traffic, generate leads, and increase conversions for sustainable growth.',
              cta: {
                label: 'Get Marketing Consultation',
                href: '/contact?service=marketing'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'marketing-services',
              type: 'featureGrid',
              visible: true,
              heading: 'Full-Service Digital Marketing',
              subtitle: 'Integrated marketing solutions for maximum impact',
              features: [
                {
                  title: 'SEO Optimization',
                  description: 'Improve your search rankings and drive organic traffic with proven SEO strategies.',
                  icon: '🔍'
                },
                {
                  title: 'PPC Advertising',
                  description: 'Maximize ROI with targeted pay-per-click campaigns on Google, Facebook, and more.',
                  icon: '💰'
                },
                {
                  title: 'Content Marketing',
                  description: 'Engage your audience with compelling content that builds trust and drives action.',
                  icon: '✍️'
                },
                {
                  title: 'Email Marketing',
                  description: 'Build lasting customer relationships with personalized email campaigns.',
                  icon: '📧'
                },
                {
                  title: 'Social Media Marketing',
                  description: 'Grow your brand presence and engage customers across all social platforms.',
                  icon: '📱'
                },
                {
                  title: 'Analytics & Reporting',
                  description: 'Data-driven insights and transparent reporting to track your marketing success.',
                  icon: '📊'
                }
              ]
            }
          }
        ]
      }
    }
  });

  const cloudPage = await prisma.page.create({
    data: {
      slug: 'cloud-infrastructure',
      locale: 'en',
      title: 'Cloud Infrastructure Services',
      status: 'published',
      seo: {
        title: 'Cloud Infrastructure Services | CodeX Terminal',
        description: 'Enterprise cloud solutions on AWS, GCP, and Azure with DevOps automation and 24/7 support.',
      },
      blocks: {
        create: [
          {
            type: 'hero',
            order: 0,
            data: {
              id: 'cloud-hero',
              type: 'hero',
              visible: true,
              eyebrow: 'Cloud Infrastructure Experts',
              headline: 'Enterprise Cloud Solutions',
              subcopy: 'Scalable, secure cloud infrastructure that grows with your business. Expert implementation on AWS, GCP, and Azure.',
              cta: {
                label: 'Discuss Cloud Strategy',
                href: '/contact?service=cloud'
              }
            }
          },
          {
            type: 'featureGrid',
            order: 1,
            data: {
              id: 'cloud-services',
              type: 'featureGrid',
              visible: true,
              heading: 'Complete Cloud Solutions',
              subtitle: 'Everything you need for successful cloud transformation',
              features: [
                {
                  title: 'Cloud Migration',
                  description: 'Seamless migration of your applications and data to the cloud with zero downtime.',
                  icon: '☁️'
                },
                {
                  title: 'DevOps Automation',
                  description: 'Streamline your development workflow with CI/CD pipelines and infrastructure as code.',
                  icon: '🔄'
                },
                {
                  title: 'Kubernetes Orchestration',
                  description: 'Deploy and manage containerized applications at scale with Kubernetes.',
                  icon: '🎯'
                },
                {
                  title: 'Serverless Architecture',
                  description: 'Build cost-effective, scalable applications with serverless technologies.',
                  icon: '⚡'
                },
                {
                  title: 'Security & Compliance',
                  description: 'Enterprise-grade security with compliance for GDPR, HIPAA, and SOC 2.',
                  icon: '🔒'
                },
                {
                  title: '24/7 Monitoring',
                  description: 'Round-the-clock monitoring and support to ensure maximum uptime.',
                  icon: '📡'
                }
              ]
            }
          }
        ]
      }
    }
  });

  // Create Services that reference the pages
  await prisma.service.create({
    data: {
      slug: 'shopware',
      locale: 'en',
      name: 'Shopware Development',
      summary: 'Expert Shopware development services including custom plugins, theme development, migrations, and ongoing support.',
      icon: '🛍️',
      order: 1,
      status: 'published',
      pageId: shopwarePage.id
    }
  });

  await prisma.service.create({
    data: {
      slug: 'marketing',
      locale: 'en',
      name: 'Digital Marketing',
      summary: 'Comprehensive digital marketing strategies including SEO, PPC, content marketing, and social media to grow your business.',
      icon: '📈',
      order: 2,
      status: 'published',
      pageId: marketingPage.id
    }
  });

  await prisma.service.create({
    data: {
      slug: 'cloud',
      locale: 'en',
      name: 'Cloud Infrastructure',
      summary: 'Scalable cloud solutions on AWS, GCP, and Azure with DevOps automation, monitoring, and 24/7 support.',
      icon: '☁️',
      order: 3,
      status: 'published',
      pageId: cloudPage.id
    }
  });

  // Additional services without linked pages (using fallback content)
  await prisma.service.create({
    data: {
      slug: 'consulting',
      locale: 'en',
      name: 'Technical Consulting',
      summary: 'Strategic technology consulting to help you make informed decisions and optimize your digital infrastructure.',
      icon: '💡',
      order: 4,
      status: 'published'
    }
  });

  await prisma.service.create({
    data: {
      slug: 'support',
      locale: 'en',
      name: 'Managed Support',
      summary: '24/7 technical support and maintenance services to keep your systems running smoothly.',
      icon: '🛡️',
      order: 5,
      status: 'published'
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });