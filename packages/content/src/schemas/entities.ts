import { z } from 'zod';
import { AnyBlock } from './blocks';

export const SEO = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  noindex: z.boolean().optional(),
  canonical: z.string().url().optional(),
  ogImage: z.string().url().optional(),
});

export const Locales = z.enum(['en', 'de']);

export const PublishStatus = z.enum(['draft', 'inReview', 'scheduled', 'published']);

export const Page = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  locale: Locales,
  title: z.string(),
  seo: SEO.optional(),
  blocks: z.array(AnyBlock),
  status: PublishStatus.default('draft'),
  scheduledAt: z.string().datetime().optional(),
  updatedBy: z.string().optional(),
});

export const BlogPost = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  locale: Locales,
  title: z.string(),
  excerpt: z.string().optional(),
  coverId: z.string().optional(),
  seo: SEO.optional(),
  blocks: z.array(AnyBlock),
  status: PublishStatus.default('draft'),
  scheduledAt: z.string().datetime().optional(),
  authorId: z.string().optional(),
});

export const Service = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  locale: Locales,
  name: z.string(),
  summary: z.string().optional(),
  seo: SEO.optional(),
  blocks: z.array(AnyBlock),
  status: PublishStatus.default('draft'),
});

export const CaseStudy = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  locale: Locales,
  title: z.string(),
  client: z.string().optional(),
  sector: z.string().optional(),
  seo: SEO.optional(),
  blocks: z.array(AnyBlock),
  status: PublishStatus.default('draft'),
});

export type SEO = z.infer<typeof SEO>;
export type Locale = z.infer<typeof Locales>;
export type PublishStatus = z.infer<typeof PublishStatus>;
export type Page = z.infer<typeof Page>;
export type BlogPost = z.infer<typeof BlogPost>;
export type Service = z.infer<typeof Service>;
export type CaseStudy = z.infer<typeof CaseStudy>;