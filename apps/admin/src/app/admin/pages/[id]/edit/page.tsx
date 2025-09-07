'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<AnyBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageFormSchema),
  });

  const watchedTitle = watch('title');

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      loadPage(p.id);
    });
  }, []);

  const loadPage = async (pageId: string) => {
    try {
      const response = await fetch(`/api/pages/${pageId}`);
      if (response.ok) {
        const result = await response.json();
        const page = result.data;
        
        // Set form values
        setValue('title', page.title);
        setValue('slug', page.slug);
        setValue('locale', page.locale);
        setValue('status', page.status);
        if (page.seo) {
          setValue('seo', page.seo);
        }
        
        // Set blocks
        setBlocks(page.blocks || []);
      } else {
        console.error('Failed to load page');
        alert('Failed to load page');
        router.push('/admin/pages');
      }
    } catch (error) {
      console.error('Error loading page:', error);
      alert('Error loading page');
      router.push('/admin/pages');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Update slug when title changes (only if they match the auto-generated pattern)
  React.useEffect(() => {
    if (watchedTitle) {
      const currentSlug = watch('slug');
      const autoSlug = generateSlug(watchedTitle);
      
      // Only auto-update if current slug looks auto-generated
      if (!currentSlug || currentSlug === generateSlug(watch('title') || '')) {
        setValue('slug', autoSlug);
      }
    }
  }, [watchedTitle, setValue, watch]);

  const onSubmit = async (data: PageFormData) => {
    if (!id) return;

    setSaveStatus('saving');
    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          blocks: blocks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update page');
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save page:', error);
      alert('Failed to save page. Please try again.');
      setSaveStatus('error');
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (response.ok) {
        router.push('/admin/pages');
      } else if (response.status === 409) {
        alert(`Cannot delete page: ${result.message}`);
      } else {
        alert('Failed to delete page. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-gray-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500">Loading page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm mb-4">
                <Link href="/admin/pages" className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Pages
                </Link>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="flex items-center gap-1 text-gray-900 font-semibold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Page
                </span>
              </nav>

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
            
            <div className="flex items-center gap-3 ml-6">
              {/* Save Status */}
              {saveStatus !== 'idle' && (
                <div className="flex items-center gap-2 text-sm">
                  {saveStatus === 'saving' && (
                    <>
                      <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-blue-600">Saving...</span>
                    </>
                  )}
                  {saveStatus === 'saved' && (
                    <>
                      <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-600">Saved</span>
                    </>
                  )}
                  {saveStatus === 'error' && (
                    <>
                      <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-600">Error</span>
                    </>
                  )}
                </div>
              )}

              <Link
                href={`/admin/pages/${id}/preview`}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </Link>
              
              <button
                type="submit"
                disabled={saveStatus === 'saving'}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                {saveStatus === 'saving' ? (
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
                    Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
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