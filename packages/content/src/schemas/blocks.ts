import { z } from 'zod';
import { BLOCK_TYPES } from '../constants';

// Base block schema that all blocks extend
export const BaseBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(BLOCK_TYPES),
  visible: z.boolean().default(true),
  analyticsId: z.string().optional(),
  variant: z.string().optional(),
  className: z.string().optional(),
});

// CTA schema - reused across multiple blocks
export const CTASchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  target: z.enum(['_self', '_blank']).optional().default('_self'),
});

// Hero Block
export const HeroBlockSchema = BaseBlockSchema.extend({
  type: z.literal('hero'),
  eyebrow: z.string().optional(),
  headline: z.string().min(3),
  subcopy: z.string().optional(),
  media: z.object({
    kind: z.enum(['image', 'video']),
    src: z.string().url(),
    alt: z.string(),
    poster: z.string().url().optional(), // For videos
  }).optional(),
  primaryCTA: CTASchema.optional(),
  secondaryCTA: CTASchema.optional(),
  badges: z.array(z.object({
    label: z.string(),
    icon: z.string().optional(),
  })).optional(),
});

// Feature Grid Block
export const FeatureGridBlockSchema = BaseBlockSchema.extend({
  type: z.literal('featureGrid'),
  heading: z.string().optional(),
  subtitle: z.string().optional(),
  columns: z.number().int().min(2).max(4).default(3),
  features: z.array(z.object({
    icon: z.string().optional(),
    title: z.string().min(1),
    description: z.string().min(1),
  })).min(1),
});

// Testimonial Block
export const TestimonialBlockSchema = BaseBlockSchema.extend({
  type: z.literal('testimonial'),
  quote: z.string().min(1),
  author: z.object({
    name: z.string().min(1),
    role: z.string().optional(),
    company: z.string().optional(),
    avatar: z.string().url().optional(),
    logo: z.string().url().optional(),
  }),
  metric: z.object({
    label: z.string(),
    value: z.string(),
  }).optional(),
});

// Logo Cloud Block
export const LogoCloudBlockSchema = BaseBlockSchema.extend({
  type: z.literal('logoCloud'),
  title: z.string().optional(),
  brands: z.array(z.object({
    name: z.string().min(1),
    logo: z.string().url(),
    url: z.string().url().optional(),
  })).min(1),
});

// Metrics Block
export const MetricsBlockSchema = BaseBlockSchema.extend({
  type: z.literal('metrics'),
  items: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    helpText: z.string().optional(),
  })).min(1),
});

// Rich Text Block
export const RichTextBlockSchema = BaseBlockSchema.extend({
  type: z.literal('richText'),
  content: z.string().min(1), // HTML or Markdown content
});

// FAQ Block
export const FAQBlockSchema = BaseBlockSchema.extend({
  type: z.literal('faq'),
  heading: z.string().optional(),
  items: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })).min(1),
});

// Price Table Block
export const PriceTableBlockSchema = BaseBlockSchema.extend({
  type: z.literal('priceTable'),
  heading: z.string().optional(),
  plans: z.array(z.object({
    name: z.string().min(1),
    price: z.string().min(1),
    period: z.string().min(1),
    features: z.array(z.string()).min(1),
    cta: CTASchema,
    featured: z.boolean().optional().default(false),
  })).min(1),
});

// Comparison Block
export const ComparisonBlockSchema = BaseBlockSchema.extend({
  type: z.literal('comparison'),
  heading: z.string().optional(),
  criteria: z.array(z.string().min(1)).min(1),
  leftColumn: z.object({
    title: z.string().min(1),
    items: z.array(z.string()),
  }),
  rightColumn: z.object({
    title: z.string().min(1),
    items: z.array(z.string()),
  }),
});

// Contact Form Block
export const ContactFormBlockSchema = BaseBlockSchema.extend({
  type: z.literal('contactForm'),
  formKey: z.string().min(1),
  heading: z.string().optional(),
  subcopy: z.string().optional(),
  successCopy: z.string().optional(),
  privacyNote: z.string().optional(),
});

// Media Block
export const MediaBlockSchema = BaseBlockSchema.extend({
  type: z.literal('media'),
  kind: z.enum(['image', 'video']),
  src: z.string().url(),
  alt: z.string(),
  caption: z.string().optional(),
  poster: z.string().url().optional(), // For videos
});

// Union of all block types
export const AnyBlockSchema = z.discriminatedUnion('type', [
  HeroBlockSchema,
  FeatureGridBlockSchema,
  TestimonialBlockSchema,
  LogoCloudBlockSchema,
  MetricsBlockSchema,
  RichTextBlockSchema,
  FAQBlockSchema,
  PriceTableBlockSchema,
  ComparisonBlockSchema,
  ContactFormBlockSchema,
  MediaBlockSchema,
]);

// Type exports
export type BaseBlock = z.infer<typeof BaseBlockSchema>;
export type CTA = z.infer<typeof CTASchema>;
export type HeroBlock = z.infer<typeof HeroBlockSchema>;
export type FeatureGridBlock = z.infer<typeof FeatureGridBlockSchema>;
export type TestimonialBlock = z.infer<typeof TestimonialBlockSchema>;
export type LogoCloudBlock = z.infer<typeof LogoCloudBlockSchema>;
export type MetricsBlock = z.infer<typeof MetricsBlockSchema>;
export type RichTextBlock = z.infer<typeof RichTextBlockSchema>;
export type FAQBlock = z.infer<typeof FAQBlockSchema>;
export type PriceTableBlock = z.infer<typeof PriceTableBlockSchema>;
export type ComparisonBlock = z.infer<typeof ComparisonBlockSchema>;
export type ContactFormBlock = z.infer<typeof ContactFormBlockSchema>;
export type MediaBlock = z.infer<typeof MediaBlockSchema>;
export type AnyBlock = z.infer<typeof AnyBlockSchema>;
