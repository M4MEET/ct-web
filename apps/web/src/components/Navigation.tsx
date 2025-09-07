'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const t = useTranslations('navigation');
  const locale = useLocale();

  const navigation = [
    { name: t('home'), href: `/${locale}` },
    { 
      name: t('services'), 
      href: `/${locale}/services`,
      dropdown: [
        { name: t('shopware'), href: `/${locale}/services/shopware`, description: 'Plugins, themes, migrations & custom solutions' },
        { name: t('marketing'), href: `/${locale}/services/marketing`, description: 'SEO, PPC, and marketing automation' },
        { name: t('cloud'), href: `/${locale}/services/cloud`, description: 'AWS, Azure, and DevOps solutions' },
        { name: t('allServices'), href: `/${locale}/services`, description: 'View our complete service offerings' },
      ]
    },
    { name: t('about'), href: `/${locale}/about` },
    { name: t('technologies'), href: `/${locale}/technologies` },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-codex-terminal-body/95 via-codex-terminal-component/90 to-codex-terminal-body/95 backdrop-blur-xl border-b border-primary-200/30 shadow-sm">
      {/* Header glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-primary-400/10 to-primary-500/5 opacity-50"></div>
      
      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <img src="/codex-logo.svg" alt="CodeX Terminal" className="h-8 sm:h-10 w-auto group-hover:scale-105 transition-all duration-200" />
            </Link>
          </div>

          {/* Desktop navigation - Show from tablet landscape and up */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="group"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button className="flex items-center text-gray-700 hover:text-primary-600 px-3 xl:px-4 py-2.5 text-sm font-semibold transition-all duration-200 whitespace-nowrap">
                      {item.name}
                      <svg
                        className={`ml-1 h-3 w-3 transition-all duration-200 ${
                          servicesDropdownOpen ? 'rotate-180 text-primary-500' : 'text-gray-400'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown menu */}
                    <div
                      className={`absolute left-0 top-full mt-2 w-80 rounded-2xl bg-white/95 shadow-xl ring-1 ring-primary-200/30 backdrop-blur-xl transition-all duration-300 ${
                        servicesDropdownOpen
                          ? 'opacity-100 translate-y-0 scale-100'
                          : 'opacity-0 -translate-y-3 scale-95 pointer-events-none'
                      }`}
                    >
                      <div className="p-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block rounded-xl p-4 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100/50 transition-all duration-200 group border border-transparent hover:border-primary-200/50 hover:shadow-sm"
                          >
                            <div className="font-medium text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
                              {dropdownItem.name}
                            </div>
                            <div className="mt-1 text-xs text-gray-500 group-hover:text-gray-600">
                              {dropdownItem.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 px-3 xl:px-4 py-2.5 text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-3 xl:space-x-4">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/contact`}
              className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 xl:px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:shadow-primary-500/25 hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 border border-primary-400/20 overflow-hidden group whitespace-nowrap"
            >
              <span className="relative z-10">{t('contact')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Mobile menu button - Show for tablet and mobile */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-3 text-gray-700 hover:bg-gray-100/70 hover:text-gray-900 transition-all duration-200 active:scale-95 touch-manipulation"
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
          <div className="border-t border-gray-200/50 px-3 py-4 space-y-1 bg-white/95 backdrop-blur-sm">
            {/* Language switcher at the top */}
            <div className="flex justify-center pb-3 mb-3 border-b border-gray-200/50">
              <LanguageSwitcher />
            </div>
            
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div className="space-y-1">
                    <Link
                      href={item.href}
                      className="block rounded-xl px-4 py-4 text-base font-semibold text-gray-800 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 active:scale-[0.98] touch-manipulation"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <div className="ml-3 space-y-1 border-l-2 border-gray-200 pl-3">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 active:scale-[0.98] touch-manipulation"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="font-medium">{dropdownItem.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{dropdownItem.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-xl px-4 py-4 text-base font-semibold text-gray-800 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 active:scale-[0.98] touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200/50 mt-4">
              <Link
                href={`/${locale}/contact`}
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
