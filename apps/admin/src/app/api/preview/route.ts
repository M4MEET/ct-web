import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { 
  withErrorHandler, 
  requireAuth, 
  validateRequestBody, 
  apiResponse,
  apiError,
  Permission
} from '@/lib/api-utils';

// Block validation schemas
const BaseBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  visible: z.boolean().default(true),
  analyticsId: z.string().optional(),
  variant: z.string().optional(),
  className: z.string().optional(),
});

const HeroBlockSchema = BaseBlockSchema.extend({
  type: z.literal('hero'),
  eyebrow: z.string().optional(),
  headline: z.string().min(1, 'Headline is required'),
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

const FeatureGridBlockSchema = BaseBlockSchema.extend({
  type: z.literal('featureGrid'),
  heading: z.string().optional(),
  columns: z.number().int().min(2).max(4).default(3),
  items: z.array(z.object({
    icon: z.string().optional(),
    title: z.string(),
    body: z.string()
  })).min(1),
});

const TestimonialBlockSchema = BaseBlockSchema.extend({
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

const LogoCloudBlockSchema = BaseBlockSchema.extend({
  type: z.literal('logoCloud'),
  title: z.string().optional(),
  brands: z.array(z.object({
    name: z.string(),
    logo: z.string().url(),
    url: z.string().url().optional()
  })),
});

const MetricsBlockSchema = BaseBlockSchema.extend({
  type: z.literal('metrics'),
  items: z.array(z.object({
    label: z.string(),
    value: z.string(),
    helpText: z.string().optional()
  })),
});

const RichTextBlockSchema = BaseBlockSchema.extend({
  type: z.literal('richText'),
  content: z.string(), // Should be sanitized before rendering
});

const FAQBlockSchema = BaseBlockSchema.extend({
  type: z.literal('faq'),
  items: z.array(z.object({
    q: z.string(),
    a: z.string()
  })).min(1),
});

const PriceTableBlockSchema = BaseBlockSchema.extend({
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

const ComparisonBlockSchema = BaseBlockSchema.extend({
  type: z.literal('comparison'),
  criteria: z.array(z.string()),
  left: z.array(z.string()),
  right: z.array(z.string()),
});

const ContactFormBlockSchema = BaseBlockSchema.extend({
  type: z.literal('contactForm'),
  formKey: z.string(),
  heading: z.string().optional(),
  subcopy: z.string().optional(),
  successCopy: z.string().optional(),
  privacyNote: z.string().optional(),
});

const MediaBlockSchema = BaseBlockSchema.extend({
  type: z.literal('media'),
  kind: z.enum(['image', 'video']),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  poster: z.string().optional(),
});

// Union of all block types
const AnyBlockSchema = z.discriminatedUnion('type', [
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

const PreviewRequestSchema = z.object({
  blocks: z.array(AnyBlockSchema),
  page: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    locale: z.enum(['en', 'de', 'fr']).optional(),
  }).optional(),
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Check authentication and permissions
  const authResult = await requireAuth(request, Permission.CONTENT_READ);
  if (!authResult.success) {
    return authResult.error;
  }

  // Validate request body
  const bodyResult = await validateRequestBody(request, PreviewRequestSchema);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const { data: previewData } = bodyResult;

  try {
    // Sanitize and validate each block
    const sanitizedBlocks = previewData.blocks.map(block => {
      // Remove any potentially harmful content
      const sanitizedBlock = { ...block };
      
      // For rich text blocks, ensure content is safe
      if (block.type === 'richText') {
        // Basic XSS prevention - in production, use a proper HTML sanitizer
        sanitizedBlock.content = block.content
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
      
      // Validate URLs in blocks
      const validateUrl = (url: string): boolean => {
        try {
          const parsed = new URL(url);
          return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
        } catch {
          return false;
        }
      };

      // Sanitize URLs in different block types
      if ('media' in block && block.media?.src && !validateUrl(block.media.src)) {
        sanitizedBlock.media = { ...block.media, src: '#' };
      }
      
      if ('primaryCTA' in block && block.primaryCTA?.href && !validateUrl(block.primaryCTA.href)) {
        sanitizedBlock.primaryCTA = { ...block.primaryCTA, href: '#' };
      }
      
      if ('secondaryCTA' in block && block.secondaryCTA?.href && !validateUrl(block.secondaryCTA.href)) {
        sanitizedBlock.secondaryCTA = { ...block.secondaryCTA, href: '#' };
      }

      return sanitizedBlock;
    });

    // Return sanitized preview data
    return NextResponse.json({ 
      data: {
        blocks: sanitizedBlocks,
        page: previewData.page || {},
        previewedAt: new Date().toISOString(),
        previewedBy: authResult.session.user.email,
      }
    });
  } catch (error) {
    console.error('Error processing preview:', error);
    return apiError('Failed to process preview', 500);
  }
});