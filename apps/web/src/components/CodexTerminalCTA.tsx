'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export function CodexTerminalCTA() {
  const locale = useLocale();
  const t = useTranslations('cta');
  
  return (
    <section className="relative py-24 bg-codex-terminal-body">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/70 via-primary-200/50 to-primary-300/60"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-primary-300/70 to-primary-200/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-primary-200/60 to-primary-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary-200/50 to-primary-100/30 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          {t('title')}
          <span className="block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
            {t('highlight')}
          </span>
        </h2>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href={`/${locale}/contact`}
            className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {t('primaryButton')}
            <svg
              className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center justify-center rounded-2xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:shadow-md"
          >
            {t('secondaryButton')}
          </Link>
        </div>

        {/* Contact methods - Only Email for now */}
        <div className="flex justify-center pt-8 border-t border-gray-200">
          <Link
            href="mailto:info@codexterminal.com"
            className="group flex flex-col items-center p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:shadow-lg transition-shadow">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {t('contactMethods.email.title')}
            </h4>
            <p className="text-sm text-gray-600 text-center">
              {t('contactMethods.email.address')}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}