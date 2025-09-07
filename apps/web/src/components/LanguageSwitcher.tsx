'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // Get locale from URL pathname as backup to avoid hydration issues
  const pathSegments = pathname.split('/').filter(Boolean);
  const urlLocale = pathSegments[0] && languages.some(lang => lang.code === pathSegments[0]) 
    ? pathSegments[0] 
    : 'en';
  
  // Use URL locale as primary source to avoid hydration mismatch
  const currentLocale = urlLocale || locale || 'en';
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    // Extract the path without the current locale
    const segments = pathname.split('/').filter(Boolean);
    const pathWithoutLocale = segments.length > 1 ? '/' + segments.slice(1).join('/') : '/';
    const newPath = `/${langCode}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-primary-600 transition-colors duration-200 rounded-lg hover:bg-gray-50"
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
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-gray-200 z-20">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`flex items-center space-x-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                    language.code === currentLocale 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-base">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                  {language.code === currentLocale && (
                    <svg className="w-4 h-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}