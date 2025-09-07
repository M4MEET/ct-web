import { ContactForm } from '@/components/ContactForm';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ service?: string }>;
}

export default async function ContactPage({ params, searchParams }: ContactPageProps) {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;
  const initialService = searchParamsResolved?.service;
  const t = await getTranslations('contact');
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Contact Information Cards - Before Form */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('contactInfo.emailUs.title')}</h3>
                  <p className="text-sm text-gray-600 mb-2">{t('contactInfo.emailUs.description')}</p>
                  <a href="mailto:info@codexterminal.com" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    {t('contactInfo.emailUs.email')}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('contactInfo.quickResponse.title')}</h3>
                  <p className="text-sm text-gray-600 mb-2">{t('contactInfo.quickResponse.description')}</p>
                  <p className="text-sm text-yellow-600 font-medium">
                    {t('contactInfo.quickResponse.timeframe')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Consultation Banner */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-xl font-bold mb-1">{t('freeConsultation.title')}</h3>
                <p className="text-primary-100">
                  {t('freeConsultation.description')}
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{t('freeConsultation.duration')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Contact Form */}
        <div className="max-w-5xl mx-auto">
          <ContactForm initialService={initialService} />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  
  return {
    title: `${t('title')} - CodeX Terminal`,
    description: t('subtitle'),
  };
}