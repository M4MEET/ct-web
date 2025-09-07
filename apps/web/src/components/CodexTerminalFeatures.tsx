'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export function CodexTerminalFeatures() {
  const locale = useLocale();
  const t = useTranslations('features');
  
  const features = [
    {
      title: t('services.shopware.title'),
      description: t('services.shopware.description'),
      icon: '🛍️',
      href: '/services/shopware',
      command: './deploy-shopware.sh',
      status: 'ACTIVE',
      glowColor: 'blue-400'
    },
    {
      title: t('services.marketing.title'),
      description: t('services.marketing.description'),
      icon: '📈',
      href: '/services/marketing',
      command: './optimize-campaigns.sh',
      status: 'RUNNING',
      glowColor: 'green-400'
    },
    {
      title: t('services.cloud.title'),
      description: t('services.cloud.description'),
      icon: '☁️',
      href: '/services/cloud',
      command: './scale-infrastructure.sh',
      status: 'READY',
      glowColor: 'purple-400'
    }
  ];
  
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-codex-terminal-body relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/70 via-primary-200/50 to-primary-300/60"></div>
        <div className="absolute -top-12 sm:-top-24 -right-12 sm:-right-24 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-br from-primary-300/70 to-primary-200/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-12 sm:-bottom-24 -left-12 sm:-left-24 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-primary-200/60 to-primary-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-gradient-radial from-primary-200/50 to-primary-100/30 rounded-full blur-2xl"></div>
      </div>
      <div className="relative mx-auto max-w-6xl px-3 sm:px-6">
        {/* Clean header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            {t('title')}
            <span className="block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              {t('highlight')}
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={`/${locale}${feature.href}`}
              className="group relative h-full"
            >
              {/* Clean card with fixed height */}
              <div className="relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-primary-300 hover:-translate-y-1 p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                <div className="flex flex-col h-full space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="mb-2 sm:mb-0 sm:mr-4 text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-200 text-center sm:text-left">{feature.icon}</span>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors text-center sm:text-left">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow text-center sm:text-left">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center justify-center sm:justify-start text-primary-600 font-medium group-hover:text-primary-700 transition-colors mt-auto pt-3 sm:pt-4">
                    <span className="text-sm sm:text-base">{t('learnMore')}</span>
                    <svg
                      className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Clean Process section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 lg:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
            {t('process.title')}
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="relative group h-full">
              <div className="bg-transparent p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  1
                </div>
                <div className="text-center space-y-2 sm:space-y-3 flex-grow flex flex-col justify-center">
                  <h4 className="font-bold text-gray-800 text-base sm:text-lg">{t('process.steps.discovery.title')}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {t('process.steps.discovery.description')}
                  </p>
                </div>
              </div>
              
              <div className="hidden lg:block absolute top-6 sm:top-8 -right-3 sm:-right-4 text-primary-500 text-xl sm:text-2xl">→</div>
            </div>
            
            <div className="relative group h-full">
              <div className="bg-transparent p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  2
                </div>
                <div className="text-center space-y-2 sm:space-y-3 flex-grow flex flex-col justify-center">
                  <h4 className="font-bold text-gray-800 text-base sm:text-lg">{t('process.steps.strategy.title')}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {t('process.steps.strategy.description')}
                  </p>
                </div>
              </div>
              
              <div className="hidden lg:block absolute top-6 sm:top-8 -right-3 sm:-right-4 text-primary-500 text-xl sm:text-2xl">→</div>
            </div>
            
            <div className="relative group h-full">
              <div className="bg-transparent p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  3
                </div>
                <div className="text-center space-y-2 sm:space-y-3 flex-grow flex flex-col justify-center">
                  <h4 className="font-bold text-gray-800 text-base sm:text-lg">{t('process.steps.execute.title')}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {t('process.steps.execute.description')}
                  </p>
                </div>
              </div>
              
              <div className="hidden lg:block absolute top-6 sm:top-8 -right-3 sm:-right-4 text-primary-500 text-xl sm:text-2xl">→</div>
            </div>
            
            <div className="group h-full">
              <div className="bg-transparent p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  4
                </div>
                <div className="text-center space-y-2 sm:space-y-3 flex-grow flex flex-col justify-center">
                  <h4 className="font-bold text-gray-800 text-base sm:text-lg">{t('process.steps.scale.title')}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {t('process.steps.scale.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}