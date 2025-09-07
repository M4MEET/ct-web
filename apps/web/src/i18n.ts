import { getRequestConfig } from 'next-intl/server';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@codex/content/constants';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = SUPPORTED_LOCALES.includes(locale as any) ? locale : DEFAULT_LOCALE;

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});