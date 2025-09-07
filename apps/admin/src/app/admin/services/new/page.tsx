'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const serviceFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  locale: z.enum(['en', 'de', 'fr']),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']),
  summary: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  pageId: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

export default function NewServicePage() {
  const router = useRouter();
  const [pages, setPages] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPages, setLoadingPages] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      locale: 'en',
      status: 'draft',
      order: 0,
    },
  });

  const watchedName = watch('name');
  const watchedLocale = watch('locale');

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Load pages for the selected locale
  React.useEffect(() => {
    loadPages(watchedLocale);
  }, [watchedLocale]);

  // Update slug when name changes
  React.useEffect(() => {
    if (watchedName) {
      setValue('slug', generateSlug(watchedName));
    }
  }, [watchedName, setValue]);

  const loadPages = async (locale: string) => {
    setLoadingPages(true);
    try {
      const response = await fetch(`/api/pages?locale=${locale}`);
      if (response.ok) {
        const data = await response.json();
        setPages(data.filter((page: any) => page.status === 'published'));
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoadingPages(false);
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create service');
      }

      // Redirect to services list
      router.push('/admin/services');
    } catch (error) {
      console.error('Failed to save service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Service Header */}
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
                <h1 className="text-2xl font-bold text-gray-900">Create New Service</h1>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <input
                    {...register('name')}
                    placeholder="Service name"
                    className="w-full p-2 text-lg font-medium text-gray-900 border-0 border-b-2 border-gray-200 focus:border-primary-500 focus:ring-0 bg-transparent"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <input
                    {...register('slug')}
                    placeholder="service-slug"
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-md"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
                  )}
                </div>
                
                <div>
                  <select
                    {...register('locale')}
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                
                <div>
                  <select
                    {...register('status')}
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="inReview">In Review</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <textarea
                    {...register('summary')}
                    placeholder="Brief service summary (optional)"
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-md"
                    rows={2}
                  />
                  {errors.summary && (
                    <p className="text-red-500 text-xs mt-1">{errors.summary.message}</p>
                  )}
                </div>
                
                <div>
                  <input
                    {...register('icon')}
                    placeholder="Service icon (emoji or text)"
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-md"
                  />
                  {errors.icon && (
                    <p className="text-red-500 text-xs mt-1">{errors.icon.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    {...register('order', { valueAsNumber: true })}
                    type="number"
                    placeholder="0"
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-md"
                  />
                  {errors.order && (
                    <p className="text-red-500 text-xs mt-1">{errors.order.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Page {loadingPages && <span className="text-gray-400">(Loading...)</span>}
                  </label>
                  <select
                    {...register('pageId')}
                    className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-md"
                    disabled={loadingPages}
                  >
                    <option value="">No page selected</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                  {errors.pageId && (
                    <p className="text-red-500 text-xs mt-1">{errors.pageId.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Select a published page to use as the service content
                  </p>
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
                {isSubmitting ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                📄 Content Management Workflow
              </h3>
              <div className="text-blue-700 text-sm space-y-2">
                <p><strong>1. Create Pages:</strong> Use the "Pages" section to create and edit content with the block editor.</p>
                <p><strong>2. Link to Services:</strong> Select a published page above to display as this service's content.</p>
                <p><strong>3. Service Listing:</strong> This service will appear in the frontend services list and link to the selected page content.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}