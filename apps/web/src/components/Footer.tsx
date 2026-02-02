'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

const socialLinks = [
  {
    name: 'Twitter',
    href: '#',
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: '#',
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

// Fetch case studies from the database
async function getCaseStudies(locale: string, t: any) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
    const response = await fetch(`${baseUrl}/api/case-studies?locale=${locale}&category=caseStudy&status=published`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const result = await response.json();
      const caseStudies = result.data || [];
      // Ensure we have an array before calling slice
      if (Array.isArray(caseStudies)) {
        return caseStudies.slice(0, 6); // Limit to 6 case studies for footer
      }
      console.warn('Case studies API returned non-array data:', caseStudies);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch case studies:', error);
  }
  
  // Fallback case studies if API fails (using translations)
  return [
    { title: t('caseStudies.fallback.ecommercePlatform'), slug: 'ecommerce-platform', icon: '🛒', client: 'Retail Client' },
    { title: t('caseStudies.fallback.marketingAutomation'), slug: 'marketing-automation', icon: '📧', client: 'SaaS Company' },
    { title: t('caseStudies.fallback.cloudMigration'), slug: 'cloud-migration', icon: '☁️', client: 'Enterprise Corp' },
    { title: t('caseStudies.fallback.crmIntegration'), slug: 'crm-integration', icon: '🔗', client: 'Tech Startup' },
    { title: t('caseStudies.fallback.mobileApp'), slug: 'mobile-app', icon: '📱', client: 'Health Company' },
    { title: t('caseStudies.fallback.dataAnalytics'), slug: 'data-analytics', icon: '📊', client: 'Finance Firm' },
  ];
}

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  
  // Define navigation items using translations
  const navigation = {
    main: [
      { name: t('navigation.main.services'), href: '/services' },
      { name: t('navigation.main.about'), href: '/about' },
      { name: t('navigation.main.contact'), href: '/contact' },
      { name: t('navigation.main.pricing'), href: '/pricing' },
    ],
    services: [
      { name: t('navigation.services.shopware'), href: '/services/shopware-development' },
      { name: t('navigation.services.marketing'), href: '/services/digital-marketing' },
      { name: t('navigation.services.cloud'), href: '/services/cloud-infrastructure' },
    ],
    legal: [
      { name: t('navigation.legal.privacy'), href: '/privacy' },
      { name: t('navigation.legal.terms'), href: '/terms' },
    ],
  };
  
  // For now, use fallback case studies (API integration would need to be moved to server component)
  const caseStudies = [
    { title: t('caseStudies.fallback.ecommercePlatform'), slug: 'ecommerce-platform', icon: '🛒', client: 'Retail Client' },
    { title: t('caseStudies.fallback.marketingAutomation'), slug: 'marketing-automation', icon: '📧', client: 'SaaS Company' },
    { title: t('caseStudies.fallback.cloudMigration'), slug: 'cloud-migration', icon: '☁️', client: 'Enterprise Corp' },
    { title: t('caseStudies.fallback.crmIntegration'), slug: 'crm-integration', icon: '🔗', client: 'Tech Startup' },
    { title: t('caseStudies.fallback.mobileApp'), slug: 'mobile-app', icon: '📱', client: 'Health Company' },
    { title: t('caseStudies.fallback.dataAnalytics'), slug: 'data-analytics', icon: '📊', client: 'Finance Firm' },
  ];
  return (
    <footer className="bg-[#141413] border-t border-gray-200/30 relative">
      <div className="relative mx-auto max-w-6xl px-3 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center group mb-4 sm:mb-6">
              <img src="/codex-logo.svg" alt="CodeX Terminal" className="h-8 sm:h-10 w-auto group-hover:scale-105 transition-all duration-200" />
            </Link>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
              {t('description')}
            </p>
            
            {/* Social links */}
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-primary-400 transition-colors p-2 sm:p-3 rounded-lg hover:bg-gray-800/50 touch-manipulation"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Navigation links */}
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-wider uppercase mb-3 sm:mb-4">
                {t('sections.company')}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={`/${locale}${item.href}`}
                      className="text-sm sm:text-base text-gray-300 hover:text-primary-400 transition-colors py-1 block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-wider uppercase mb-3 sm:mb-4">
                {t('sections.services')}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={`/${locale}${item.href}`}
                      className="text-sm sm:text-base text-gray-300 hover:text-primary-400 transition-colors py-1 block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-wider uppercase mb-3 sm:mb-4">
                {t('sections.caseStudies')}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {caseStudies.map((caseStudy) => (
                  <li key={caseStudy.slug}>
                    <Link
                      href={`/${locale}/case-studies/${caseStudy.slug}`}
                      className="text-sm sm:text-base text-gray-300 hover:text-primary-400 transition-colors py-1 block flex items-center gap-2"
                    >
                      <span className="text-xs">{caseStudy.icon}</span>
                      <span>{caseStudy.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-wider uppercase mb-3 sm:mb-4">
                {t('sections.legal')}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={`/${locale}${item.href}`}
                      className="text-sm sm:text-base text-gray-300 hover:text-primary-400 transition-colors py-1 block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-gray-200/50">
          <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-0 text-center sm:text-left">
            © {new Date().getFullYear()} CodeX Terminal. {t('allRightsReserved')}
          </p>
          
          <div className="flex items-center text-xs sm:text-sm text-gray-400">
            <span>{t('madeWithLove')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
