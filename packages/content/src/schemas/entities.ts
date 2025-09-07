import { z } from 'zod';
import { SUPPORTED_LOCALES, PUBLISH_STATUSES } from '../constants';
import { AnyBlockSchema } from './blocks';

// SEO Schema
export const SEOSchema = z.object({
  title: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
  noindex: z.boolean().optional().default(false),
  canonical: z.string().url().optional(),
  ogImage: z.string().url().optional(),
});

// Base Content Entity Schema
export const BaseContentSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  locale: z.enum(SUPPORTED_LOCALES),
  title: z.string().min(1).max(200),
  seo: SEOSchema.optional(),
  status: z.enum(PUBLISH_STATUSES).default('draft'),
  scheduledAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Page Schema
export const PageSchema = BaseContentSchema.extend({
  blocks: z.array(AnyBlockSchema).default([]),
  updatedBy: z.object({
    id: z.string().uuid(),
    name: z.string().nullable(),
    email: z.string().email(),
  }).optional(),
});

// Blog Post Schema
export const BlogPostSchema = BaseContentSchema.extend({
  excerpt: z.string().max(500).optional(),
  cover: z.object({
    id: z.string().uuid(),
    url: z.string().url(),
    alt: z.string(),
  }).optional(),
  blocks: z.array(AnyBlockSchema).default([]),
  author: z.object({
    id: z.string().uuid(),
    name: z.string(),
    role: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().url().optional(),
  }).optional(),
});

// Service Schema
export const ServiceSchema = BaseContentSchema.extend({
  name: z.string().min(1).max(100),
  summary: z.string().max(300).optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
  page: PageSchema.optional(), // Referenced page content
});

// Case Study Schema
export const CaseStudySchema = BaseContentSchema.extend({
  client: z.string().max(100).optional(),
  sector: z.string().max(100).optional(),
  category: z.enum(['caseStudy', 'technology']).default('caseStudy'),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
  blocks: z.array(AnyBlockSchema).default([]),
  page: PageSchema.optional(), // Referenced page content
});

// Media Asset Schema
export const MediaAssetSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(['image', 'video', 'file']),
  url: z.string().url(),
  alt: z.string().optional(),
  meta: z.record(z.any()).optional(), // Flexible metadata object
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Form Schema
export const FormSchema = z.object({
  id: z.string().uuid(),
  key: z.string().regex(/^[a-z0-9-_]+$/, 'Form key must contain only lowercase letters, numbers, hyphens, and underscores'),
  name: z.string().min(1),
  fields: z.array(z.object({
    name: z.string(),
    type: z.enum(['text', 'email', 'tel', 'textarea', 'select', 'checkbox', 'radio']),
    label: z.string(),
    required: z.boolean().default(false),
    placeholder: z.string().optional(),
    options: z.array(z.string()).optional(), // For select, checkbox, radio
  })),
  validation: z.record(z.any()).optional(),
  routing: z.object({
    email: z.string().email().optional(),
    webhook: z.string().url().optional(),
  }).optional(),
  autoresponder: z.object({
    enabled: z.boolean().default(false),
    subject: z.string().optional(),
    message: z.string().optional(),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User Schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'AUTHOR']).default('AUTHOR'),
  isActive: z.boolean().default(true),
  emailVerified: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type exports
export type SEO = z.infer<typeof SEOSchema>;
export type BaseContent = z.infer<typeof BaseContentSchema>;
export type Page = z.infer<typeof PageSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type CaseStudy = z.infer<typeof CaseStudySchema>;
export type MediaAsset = z.infer<typeof MediaAssetSchema>;
export type Form = z.infer<typeof FormSchema>;
export type User = z.infer<typeof UserSchema>;
