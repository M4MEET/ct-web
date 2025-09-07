export const SUPPORTED_LOCALES = ['en', 'de', 'fr'] as const;
export const DEFAULT_LOCALE = 'en' as const;

export type Locale = typeof SUPPORTED_LOCALES[number];

export const PUBLISH_STATUSES = ['draft', 'inReview', 'scheduled', 'published'] as const;
export type PublishStatus = typeof PUBLISH_STATUSES[number];

export const BLOCK_TYPES = [
  'hero',
  'featureGrid',
  'testimonial',
  'logoCloud',
  'metrics',
  'richText',
  'faq',
  'priceTable',
  'comparison',
  'contactForm',
  'media'
] as const;

export type BlockType = typeof BLOCK_TYPES[number];

export const USER_ROLES = ['OWNER', 'ADMIN', 'EDITOR', 'AUTHOR'] as const;
export type UserRole = typeof USER_ROLES[number];
