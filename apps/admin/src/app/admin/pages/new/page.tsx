'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnyBlock } from '@codex/content';
import { BlockEditor } from '@/components/editor/BlockEditor';

const pageFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  locale: z.enum(['en', 'de', 'fr']),
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
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          blocks: blocks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create page');
      }

      const result = await response.json();
      
      // Redirect to pages list
      router.push('/admin/pages');
    } catch (error) {
      console.error('Failed to save page:', error);
      alert('Failed to save page. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Pages
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
              </div>

              {/* Page Title Section */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">Page Title</label>
                <input
                  {...register('title')}
                  placeholder="Enter page title"
                  className="w-full p-4 text-xl font-semibold border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 bg-white text-gray-900 shadow-sm transition-all duration-200"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2 font-medium">{errors.title.message}</p>
                )}
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    URL Slug
                  </label>
                  <input
                    {...register('slug')}
                    placeholder="page-slug"
                    className="w-full p-3 text-sm font-mono border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 bg-white text-gray-900 shadow-sm"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-2">{errors.slug.message}</p>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Language
                  </label>
                  <select
                    {...register('locale')}
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 bg-white text-gray-900 shadow-sm cursor-pointer"
                  >
                    <option value="en">🇺🇸 English</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="fr">🇫🇷 Français</option>
                  </select>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 bg-white text-gray-900 shadow-sm cursor-pointer"
                  >
                    <option value="draft">📝 Draft</option>
                    <option value="inReview">👀 In Review</option>
                    <option value="scheduled">📅 Scheduled</option>
                    <option value="published">✅ Published</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Create Page
                  </>
                )}
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

