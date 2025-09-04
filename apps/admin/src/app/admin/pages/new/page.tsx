'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnyBlock } from '@codex/content';
import { BlockEditor } from '@/components/editor/BlockEditor';

const pageFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  locale: z.enum(['en', 'de']),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    noindex: z.boolean().optional(),
  }).optional(),
});

type PageFormData = z.infer<typeof pageFormSchema>;

export default function NewPagePage() {
  const router = useRouter();
  const [blocks, setBlocks] = useState<AnyBlock[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      locale: 'en',
      status: 'draft',
    },
  });

  const watchedTitle = watch('title');

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Update slug when title changes
  React.useEffect(() => {
    if (watchedTitle) {
      setValue('slug', generateSlug(watchedTitle));
    }
  }, [watchedTitle, setValue]);

  const onSubmit = async (data: PageFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Save to database via API
      console.log('Saving page:', { ...data, blocks });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to pages list
      router.push('/admin/pages');
    } catch (error) {
      console.error('Failed to save page:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ← Back
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Create New Page</h1>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <input
                    {...register('title')}
                    placeholder="Page title"
                    className="w-full p-2 text-lg font-medium border-0 border-b-2 border-gray-200 focus:border-primary-500 focus:ring-0 bg-transparent"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                  )}
                </div>
                
                <div>
                  <input
                    {...register('slug')}
                    placeholder="page-slug"
                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
                  )}
                </div>
                
                <div>
                  <select
                    {...register('locale')}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                
                <div>
                  <select
                    {...register('status')}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="inReview">In Review</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Preview
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md hover:bg-primary-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Page'}
              </button>
            </div>
          </div>
        </div>

        {/* Block Editor */}
        <div className="flex-1 bg-gray-50">
          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>
      </form>
    </div>
  );
}

// Add React import
import React from 'react';