import { z } from 'zod';

export const BaseBlock = z.object({
  id: z.string().uuid(),
  type: z.string(),
  visible: z.boolean().default(true),
  analyticsId: z.string().optional(),
  variant: z.string().optional(),
  className: z.string().optional(),
});

export const HeroBlock = BaseBlock.extend({
  type: z.literal('hero'),
  eyebrow: z.string().optional(),
  headline: z.string().min(3),
  subcopy: z.string().optional(),
  media: z.object({ 
    kind: z.enum(['image', 'video']), 
    src: z.string().url(), 
    alt: z.string() 
  }).optional(),
  primaryCTA: z.object({ 
    label: z.string(), 
    href: z.string() 
  }).optional(),
  secondaryCTA: z.object({ 
    label: z.string(), 
    href: z.string() 
  }).optional(),
  badges: z.array(z.object({ 
    label: z.string(), 
    icon: z.string().optional() 
  })).optional(),
});

export const FeatureGridBlock = BaseBlock.extend({
  type: z.literal('featureGrid'),
  heading: z.string().optional(),
  columns: z.number().int().min(2).max(4).default(3),
  items: z.array(z.object({ 
    icon: z.string().optional(), 
    title: z.string(), 
    body: z.string() 
  })).min(1),
});

export const TestimonialBlock = BaseBlock.extend({
  type: z.literal('testimonial'),
  quote: z.string(),
  author: z.object({ 
    name: z.string(), 
    role: z.string().optional(), 
    company: z.string().optional(), 
    avatar: z.string().url().optional(), 
    logo: z.string().url().optional() 
  }),
  metric: z.object({ 
    label: z.string(), 
    value: z.string() 
  }).optional(),
});

export const LogoCloudBlock = BaseBlock.extend({
  type: z.literal('logoCloud'),
  title: z.string().optional(),
  brands: z.array(z.object({ 
    name: z.string(), 
    logo: z.string().url(), 
    url: z.string().url().optional() 
  })),
});

export const MetricsBlock = BaseBlock.extend({
  type: z.literal('metrics'),
  items: z.array(z.object({ 
    label: z.string(), 
    value: z.string(), 
    helpText: z.string().optional() 
  })),
});

export const RichTextBlock = BaseBlock.extend({
  type: z.literal('richText'),
  content: z.any(), // portable text JSON
});

export const FAQBlock = BaseBlock.extend({
  type: z.literal('faq'),
  items: z.array(z.object({ 
    q: z.string(), 
    a: z.string() 
  })).min(1),
});

export const PriceTableBlock = BaseBlock.extend({
  type: z.literal('priceTable'),
  plans: z.array(z.object({ 
    name: z.string(), 
    price: z.string(), 
    period: z.string(), 
    features: z.array(z.string()), 
    cta: z.object({ 
      label: z.string(), 
      href: z.string() 
    }) 
  })),
});

export const ComparisonBlock = BaseBlock.extend({
  type: z.literal('comparison'),
  criteria: z.array(z.string()),
  left: z.array(z.string()),
  right: z.array(z.string()),
});

export const ContactFormBlock = BaseBlock.extend({
  type: z.literal('contactForm'),
  formKey: z.string(),
  heading: z.string().optional(),
  subcopy: z.string().optional(),
  successCopy: z.string().optional(),
  privacyNote: z.string().optional(),
});

export const MediaBlock = BaseBlock.extend({
  type: z.literal('media'),
  kind: z.enum(['image', 'video']),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  poster: z.string().optional(),
});

export const AnyBlock = z.discriminatedUnion('type', [
  HeroBlock,
  FeatureGridBlock,
  TestimonialBlock,
  LogoCloudBlock,
  MetricsBlock,
  RichTextBlock,
  FAQBlock,
  PriceTableBlock,
  ComparisonBlock,
  ContactFormBlock,
  MediaBlock,
]);

export type AnyBlock = z.infer<typeof AnyBlock>;
export type HeroBlock = z.infer<typeof HeroBlock>;
export type FeatureGridBlock = z.infer<typeof FeatureGridBlock>;
export type TestimonialBlock = z.infer<typeof TestimonialBlock>;
export type LogoCloudBlock = z.infer<typeof LogoCloudBlock>;
export type MetricsBlock = z.infer<typeof MetricsBlock>;
export type RichTextBlock = z.infer<typeof RichTextBlock>;
export type FAQBlock = z.infer<typeof FAQBlock>;
export type PriceTableBlock = z.infer<typeof PriceTableBlock>;
export type ComparisonBlock = z.infer<typeof ComparisonBlock>;
export type ContactFormBlock = z.infer<typeof ContactFormBlock>;
export type MediaBlock = z.infer<typeof MediaBlock>;