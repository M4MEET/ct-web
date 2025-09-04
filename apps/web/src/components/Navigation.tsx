'use client';

import { useState } from 'react';
import Link from 'next/link';

const navigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'Services', 
    href: '/services',
    dropdown: [
      { name: 'Shopware Development', href: '/services/shopware', description: 'Plugins, themes, migrations & custom solutions' },
      { name: 'Digital Marketing', href: '/services/marketing', description: 'SEO, PPC, and marketing automation' },
      { name: 'Cloud Infrastructure', href: '/services/cloud', description: 'AWS, Azure, and DevOps solutions' },
      { name: 'All Services', href: '/services', description: 'View our complete service offerings' },
    ]
  },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-codex-terminal-body/90 backdrop-blur-md border-b border-gray-200/20">
      <nav className="mx-auto max-w-6xl px-6" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-sm font-bold text-white">CX</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                CodeX Terminal
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="group"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button className="flex items-center text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-50/50 transition-all duration-200">
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
                      className={`absolute left-0 top-full mt-1 w-80 rounded-2xl bg-white shadow-xl ring-1 ring-gray-200/50 backdrop-blur-sm transition-all duration-300 ${
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
                            className="block rounded-xl p-4 hover:bg-gray-50 transition-colors group"
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
                    className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-50/50 transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100/50 hover:text-gray-500 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span
                  className={`absolute left-1/2 top-1/2 block h-0.5 w-5 bg-current transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? 'rotate-45 -translate-x-1/2 -translate-y-1/2' : '-translate-x-1/2 -translate-y-2'
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 block h-0.5 w-5 bg-current transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? 'opacity-0 -translate-x-1/2 -translate-y-1/2' : '-translate-x-1/2 -translate-y-1/2'
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 block h-0.5 w-5 bg-current transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? '-rotate-45 -translate-x-1/2 -translate-y-1/2' : '-translate-x-1/2 translate-y-1'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-gray-200/50 px-2 py-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div className="space-y-2">
                    <Link
                      href={item.href}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <div className="ml-4 space-y-1">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="font-medium">{dropdownItem.name}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200/50 mt-4">
              <Link
                href="/contact"
                className="block w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-center text-sm font-medium text-white shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}