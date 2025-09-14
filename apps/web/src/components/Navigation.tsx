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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isScrolled, setIsScrolled] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('navigation');
  const locale = useLocale();

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Use current window location in development to avoid hardcoded ports
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        
        const response = await fetch(`${baseUrl}/api/services?locale=${locale}`);
        
        if (response.ok) {
          const result = await response.json();
          setServices(result.data || []);
        } else {
          console.warn('Services API not available, using fallback navigation');
          setServices([]);
        }
      } catch (error) {
        console.warn('Services API fetch failed, using fallback navigation:', error.message || error);
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, [locale]);

  useEffect(() => {
    setMounted(true);
    
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
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

  // Add "View All Services" option and fallback services
  const fallbackServices = dynamicServicesDropdown.length === 0 ? [
    {
      name: t('dropdowns.services.shopware.title'),
      href: '/services/shopware',
      description: t('dropdowns.services.shopware.description'),
      icon: '🛒'
    },
    {
      name: t('dropdowns.services.marketing.title'),
      href: '/services/marketing',
      description: t('dropdowns.services.marketing.description'),
      icon: '📈'
    },
    {
      name: t('dropdowns.services.cloudInfra.title'),
      href: '/services/cloud',
      description: t('dropdowns.services.cloudInfra.description'),
      icon: '☁️'
    }
  ] : dynamicServicesDropdown;

  const servicesDropdown = [
    ...fallbackServices,
    {
      name: t('dropdowns.services.viewAll.title'),
      href: '/services',
      description: t('dropdowns.services.viewAll.description'),
      icon: '📋',
      highlight: true
    }
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
      name: t('resources'), 
      href: '/resources',
      key: 'resources',
      dropdown: [
        {
          name: t('dropdowns.resources.technologies.title'),
          href: '/technologies',
          description: t('dropdowns.resources.technologies.description'),
          icon: '⚡'
        },
        {
          name: t('dropdowns.resources.caseStudies.title'),
          href: '/case-studies',
          description: t('dropdowns.resources.caseStudies.description'),
          icon: '📊'
        },
        {
          name: t('dropdowns.resources.blogPosts.title'),
          href: '/blog',
          description: t('dropdowns.resources.blogPosts.description'),
          icon: '📝'
        }
      ]
    },
    { 
      name: t('about'), 
      href: '/about'
    },
  ];

  // Show fallback during hydration to prevent mismatch
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b bg-white/80 border-gray-200/50 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/[0.03] to-transparent pointer-events-none"></div>
        <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 py-2 sm:py-3" aria-label="Top">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group relative">
                <img 
                  src="/codex-logo.svg" 
                  alt="CodeX Terminal" 
                  className="h-8 sm:h-9 w-auto" 
                />
              </Link>
            </div>
            <div className="hidden lg:flex items-center bg-gray-900/90 backdrop-blur-xl rounded-full px-2 py-1 shadow-lg border border-gray-800/50">
              <div className="animate-pulse bg-gray-700 h-6 w-24 rounded"></div>
            </div>
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-lg"></div>
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded-lg"></div>
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded-lg"></div>
            </div>
            <div className="flex items-center lg:hidden">
              <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-lg"></div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

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
          <div 
            className="hidden lg:flex items-center bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full px-2 py-1 shadow-lg border border-gray-800/50 dark:border-gray-700/50 relative"
            onMouseLeave={() => setActiveDropdown(null)}
          >
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <div
                    onMouseEnter={() => setActiveDropdown(item.key || null)}
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
            
            {/* Dropdown positioned relative to entire navigation container */}
            {activeDropdown && (
              <div
                className={`absolute left-0 right-0 top-full pt-3 transition-all duration-300 ${
                  activeDropdown
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
                onMouseEnter={() => setActiveDropdown(activeDropdown)}
              >
                <div className="w-full rounded-xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-300 dark:border-gray-600 overflow-hidden">
                  <div className="p-3 grid grid-cols-2 gap-2">
                    {navigation
                      .find(item => item.key === activeDropdown)
                      ?.dropdown?.map((dropdownItem, idx) => (
                        <Link
                          key={`${dropdownItem.href}-${idx}`}
                          href={dropdownItem.href}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group/item ${
                            dropdownItem.highlight 
                              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          <span className={`text-lg flex-shrink-0 ${
                            dropdownItem.highlight ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover/item:text-primary-500 dark:group-hover/item:text-primary-400'
                          }`}>
                            {dropdownItem.icon}
                          </span>
                          <span className={`font-medium text-sm leading-tight ${
                            dropdownItem.highlight 
                              ? 'text-white' 
                              : 'text-gray-900 dark:text-gray-100 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400'
                          }`}>
                            {dropdownItem.name}
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            )}
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

          {/* Mobile controls - Theme toggle, language switcher, and menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Theme Toggle - Mobile */}
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

            {/* Language Switcher - Mobile */}
            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-white transition-all duration-200 active:scale-95 touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-mobile-menu-button
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
          className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-300 ease-in-out transform origin-top ${
            mobileMenuOpen
              ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
          }`}
          data-mobile-menu
        >
          <div className="mx-4 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Menu Content */}
            <div className="max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-6 space-y-1">
                {/* Navigation Items */}
                {navigation.map((item) => (
                  <div key={item.name} className="">
                    {item.dropdown ? (
                      <div className="">
                        {/* Category Header with Plus/Minus Button */}
                        <div className="flex items-center justify-between py-3 px-2">
                          <Link
                            href={item.href}
                            className="flex-1 text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => toggleCategory(item.name)}
                            className={`ml-3 p-2 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation shadow-sm ${
                              expandedCategories.includes(item.name)
                                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            aria-label={expandedCategories.includes(item.name) ? `Collapse ${item.name}` : `Expand ${item.name}`}
                          >
                            <svg
                              className={`w-4 h-4 transform transition-all duration-300 ease-in-out ${
                                expandedCategories.includes(item.name) ? 'rotate-45 scale-110' : 'rotate-0 scale-100'
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>

                        {/* Expandable Sub-items */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out transform ${
                          expandedCategories.includes(item.name)
                            ? 'max-h-[1200px] opacity-100 translate-y-0'
                            : 'max-h-0 opacity-0 -translate-y-2'
                        }`}>
                          <div className="pb-3 pl-4 pr-2 space-y-2">
                            {item.dropdown.map((dropdownItem, idx) => (
                              <Link
                                key={`mobile-${dropdownItem.href}-${idx}`}
                                href={dropdownItem.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 active:scale-[0.98] ${
                                  dropdownItem.highlight
                                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-400'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <span className={`text-lg flex-shrink-0 ${
                                  dropdownItem.highlight ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  {dropdownItem.icon}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className={`font-semibold text-sm ${
                                    dropdownItem.highlight ? 'text-white' : ''
                                  }`}>
                                    {dropdownItem.name}
                                  </div>
                                  {dropdownItem.description && !dropdownItem.highlight && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                      {dropdownItem.description}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-3 px-2">
                        <Link
                          href={item.href}
                          className="block text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </div>
                    )}

                    {/* Subtle separator line */}
                    <div className="mx-2 border-b border-gray-100 dark:border-gray-700"></div>
                  </div>
                ))}
              </div>

              {/* Footer with contact button */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800">
                <Link
                  href="/contact"
                  className="block w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 active:scale-[0.98]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
