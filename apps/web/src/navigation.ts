import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from '@codex/content/constants';

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always'
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);