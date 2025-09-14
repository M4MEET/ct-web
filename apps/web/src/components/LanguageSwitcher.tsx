'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '../navigation';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  // Use the locale from next-intl directly since we're using their usePathname
  const currentLocale = locale;
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];


  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        aria-label="Select language"
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="hidden md:inline font-medium">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-600 z-20 border border-gray-100 dark:border-gray-700">
            <div className="py-2">
              {languages.map((language) => (
                <Link
                  key={language.code}
                  href={pathname}
                  locale={language.code as any}
                  className={`flex items-center space-x-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    language.code === currentLocale
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                      : 'text-gray-700 dark:text-gray-200'
                  }`}
                  onClick={() => {
                    console.log('Language switch clicked:', {
                      from: currentLocale,
                      to: language.code,
                      pathname: pathname
                    });
                    setIsOpen(false);
                  }}
                >
                  <span className="text-base">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                  {language.code === currentLocale && (
                    <svg className="w-4 h-4 ml-auto text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}