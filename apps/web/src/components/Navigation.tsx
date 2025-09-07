'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '../navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

interface Service {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  icon?: string;
}

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isScrolled, setIsScrolled] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const t = useTranslations('navigation');
  const locale = useLocale();

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3002' 
          : window.location.origin;
        
        const response = await fetch(`${baseUrl}/api/services?locale=${locale}`);
        
        if (response.ok) {
          const result = await response.json();
          setServices(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching services for navigation:', error);
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, [locale]);

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = (savedTheme as 'light' | 'dark') || systemTheme;
    setTheme(initialTheme);
    
    // Apply both class and data-theme for maximum compatibility
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  useEffect(() => {
    // Add scroll listener for better header visibility
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply both class and data-theme for maximum compatibility
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Remove duplicates by name and create dynamic navigation with services
  const uniqueServices = services.reduce((acc, service) => {
    // Check if a service with the same name already exists
    const existingService = acc.find(s => s.name === service.name);
    if (!existingService) {
      acc.push(service);
    }
    return acc;
  }, [] as Service[]);

  const dynamicServicesDropdown = uniqueServices.map(service => {
    // Keep summary short for dropdown (max 50 characters)
    let shortSummary = service.summary || 'Professional service offering.';
    if (shortSummary.length > 50) {
      shortSummary = shortSummary.substring(0, 47) + '...';
    }
    
    return {
      name: service.name,
      href: `/services/${service.slug}`,
      description: shortSummary,
      icon: service.icon || '🔧'
    };
  });

  // Add "View All Services" option
  const servicesDropdown = [
    ...dynamicServicesDropdown,
    ...(dynamicServicesDropdown.length > 0 ? [{
      name: t('dropdowns.services.viewAll.title'),
      href: '/services',
      description: t('dropdowns.services.viewAll.description'),
      icon: '📋',
      highlight: true
    }] : [])
  ];

  const navigation = [
    { name: t('home'), href: '/' },
    { 
      name: t('services'), 
      href: '/services',
      key: 'services',
      dropdown: servicesDropdown
    },
    { 
      name: t('technologies'), 
      href: '/technologies',
      key: 'technologies',
      dropdown: [
        {
          name: t('dropdowns.technologies.nextjs.title'),
          href: '/technologies/nextjs',
          description: t('dropdowns.technologies.nextjs.description'),
          icon: '⚛️'
        },
        {
          name: t('dropdowns.technologies.typescript.title'),
          href: '/technologies/typescript',
          description: t('dropdowns.technologies.typescript.description'),
          icon: '📘'
        },
        {
          name: t('dropdowns.technologies.shopware6.title'),
          href: '/technologies/shopware',
          description: t('dropdowns.technologies.shopware6.description'),
          icon: '🛒'
        },
        {
          name: t('dropdowns.technologies.aws.title'),
          href: '/technologies/aws',
          description: t('dropdowns.technologies.aws.description'),
          icon: '☁️'
        },
        {
          name: t('dropdowns.technologies.viewAll.title'),
          href: '/technologies',
          description: t('dropdowns.technologies.viewAll.description'),
          icon: '⚡',
          highlight: true
        }
      ]
    },
    { 
      name: t('caseStudies'), 
      href: '/case-studies'
    },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-200 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 border-gray-200 dark:border-gray-800 shadow-md' 
        : 'bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-800/50 shadow-sm'
    }`}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/[0.03] to-transparent pointer-events-none"></div>
      
      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 py-2 sm:py-3" aria-label="Top">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group relative">
              <img 
                src="/codex-logo.svg" 
                alt="CodeX Terminal" 
                className="h-8 sm:h-9 w-auto transition-all duration-300 group-hover:scale-105" 
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </Link>
          </div>

          {/* Prisma-style pill navigation container */}
          <div className="hidden lg:flex items-center bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full px-2 py-1 shadow-lg border border-gray-800/50 dark:border-gray-700/50">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <div
                    onMouseEnter={() => setActiveDropdown(item.key || null)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link 
                      href={item.href}
                      className="flex items-center gap-1 text-white/90 hover:text-white px-4 py-2.5 text-[15px] font-medium transition-all duration-200 rounded-full hover:bg-white/10"
                    >
                      <span>{item.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.key ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    
                    {/* Prisma-style dropdown menu */}
                    <div
                      className={`absolute left-1/2 transform -translate-x-1/2 top-full pt-2 transition-all duration-200 ${
                        activeDropdown === item.key
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      <div className="w-[480px] rounded-lg bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800 overflow-hidden">
                        <div className="p-2 grid grid-cols-3 gap-1">
                          {item.dropdown.map((dropdownItem, idx) => (
                            <Link
                              key={`${dropdownItem.href}-${idx}`}
                              href={dropdownItem.href}
                              className={`flex flex-col items-center text-center gap-1 rounded-md px-2 py-2 transition-all duration-200 group/item ${
                                dropdownItem.highlight 
                                  ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800' 
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                              }`}
                            >
                              <span className="text-base">{dropdownItem.icon}</span>
                              <div className="space-y-0.5">
                                <div className={`font-medium text-[12px] leading-tight ${
                                  dropdownItem.highlight 
                                    ? 'text-primary-700 dark:text-primary-400' 
                                    : 'text-gray-900 dark:text-gray-100 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400'
                                }`}>
                                  {dropdownItem.name}
                                </div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight line-clamp-2">
                                  {dropdownItem.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-white/90 hover:text-white px-4 py-2.5 text-[15px] font-medium transition-all duration-200 rounded-full hover:bg-white/10"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            
            <LanguageSwitcher />
            
            <Link
              href="/contact"
              className="relative inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-2.5 text-[14px] font-semibold text-white shadow-md hover:shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 group"
            >
              <span className="relative z-10">{t('contact')}</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
          </div>

          {/* Mobile menu button - Show for tablet and mobile */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-white transition-all duration-200 active:scale-95 touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <div className="relative w-6 h-6">
                <span
                  className={`absolute left-1/2 top-1/2 block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? 'rotate-45 -translate-x-1/2 -translate-y-1/2' : '-translate-x-1/2 -translate-y-2'
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? 'opacity-0 -translate-x-1/2 -translate-y-1/2' : '-translate-x-1/2 -translate-y-1/2'
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? '-rotate-45 -translate-x-1/2 -translate-y-1/2' : '-translate-x-1/2 translate-y-1'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet menu */}
        <div
          className={`lg:hidden transition-all duration-300 rounded-b-2xl overflow-hidden shadow-lg ${
            mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 px-3 py-4 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            {/* Theme Toggle and Language switcher at the top */}
            <div className="flex justify-center items-center gap-3 pb-3 mb-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              <LanguageSwitcher />
            </div>
            
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div className="space-y-1">
                    <Link
                      href={item.href}
                      className="block rounded-xl px-4 py-4 text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 transition-all duration-200 active:scale-[0.98] touch-manipulation"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <div className="ml-3 space-y-1 border-l-2 border-gray-200 dark:border-gray-600 pl-3">
                      {item.dropdown.map((dropdownItem, idx) => (
                        <Link
                          key={`mobile-${dropdownItem.href}-${idx}`}
                          href={dropdownItem.href}
                          className="block rounded-lg px-3 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 transition-all duration-200 active:scale-[0.98] touch-manipulation"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="font-medium">{dropdownItem.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{dropdownItem.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-xl px-4 py-4 text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 transition-all duration-200 active:scale-[0.98] touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 mt-4">
              <Link
                href="/contact"
                className="block w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-center text-base font-bold text-white shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 active:scale-[0.98] touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('contact')}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
