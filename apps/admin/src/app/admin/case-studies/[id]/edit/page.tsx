'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnyBlock } from '@codex/content';
import { BlockEditor } from '@/components/editor/BlockEditor';

const caseStudyFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  locale: z.enum(['en', 'de', 'fr']),
  status: z.enum(['draft', 'inReview', 'scheduled', 'published']),
  category: z.enum(['caseStudy', 'technology']),
  client: z.string().optional(),
  sector: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  pageId: z.string().optional(),
});

type CaseStudyFormData = z.infer<typeof caseStudyFormSchema>;

export default function EditCaseStudyPage() {
  const router = useRouter();
  const params = useParams();
  const caseStudyId = params?.id as string;
  
  const [pages, setPages] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<AnyBlock[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingCaseStudy, setLoadingCaseStudy] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<CaseStudyFormData>({
    resolver: zodResolver(caseStudyFormSchema),
  });

  const watchedLocale = watch('locale');
  const watchedPageId = watch('pageId');
  const watchedSlug = watch('slug');
  const watchedIcon = watch('icon');
  const watchedCategory = watch('category');

  // Load existing case study data
  useEffect(() => {
    if (caseStudyId) {
      loadCaseStudy();
    }
  }, [caseStudyId]);

  // Load pages when locale changes (after initial load)
  useEffect(() => {
    if (watchedLocale && !loadingCaseStudy) {
      loadPages(watchedLocale);
    }
  }, [watchedLocale, loadingCaseStudy]);

  const loadCaseStudy = async () => {
    try {
      const response = await fetch(`/api/case-studies/${caseStudyId}`);
      if (response.ok) {
        const result = await response.json();
        const caseStudy = result.data;
        console.log('Loaded case study:', caseStudy); // Debug log
        
        // Use setValue for each field to ensure they update properly
        setValue('title', caseStudy.title);
        setValue('slug', caseStudy.slug);
        setValue('locale', caseStudy.locale);
        setValue('status', caseStudy.status);
        setValue('category', caseStudy.category || 'caseStudy');
        setValue('client', caseStudy.client || '');
        setValue('sector', caseStudy.sector || '');
        setValue('icon', caseStudy.icon || '');
        setValue('order', caseStudy.order ?? 0);
        
        // Load pages first, then set pageId to ensure the option exists
        if (caseStudy.locale) {
          await loadPages(caseStudy.locale);
        }
        
        // Set pageId after pages are loaded
        setValue('pageId', caseStudy.pageId || '');
        console.log('Setting pageId to:', caseStudy.pageId); // Debug log
        
        // Set blocks if they exist
        if (caseStudy.blocks && Array.isArray(caseStudy.blocks)) {
          setBlocks(caseStudy.blocks.map((block: any) => ({
            ...block.data,
            id: block.id,
            type: block.type,
            order: block.order
          })));
        }
        
      } else {
        console.error('Failed to load case study');
        router.push('/admin/case-studies');
      }
    } catch (error) {
      console.error('Error loading case study:', error);
      router.push('/admin/case-studies');
    } finally {
      setLoadingCaseStudy(false);
    }
  };

  const loadPages = async (locale: string) => {
    setLoadingPages(true);
    try {
      const response = await fetch(`/api/pages?locale=${locale}`);
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        setPages(data.filter((page: any) => page.status === 'published'));
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoadingPages(false);
    }
  };

  const onSubmit = async (data: CaseStudyFormData) => {
    setIsSubmitting(true);
    setSaveStatus('saving');
    try {
      const requestData = {
        ...data,
        blocks: blocks.map((block, index) => ({
          type: block.type,
          data: block,
          order: index
        }))
      };
      
      const response = await fetch(`/api/case-studies/${caseStudyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to update case study');
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save case study:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const itemType = watchedCategory === 'technology' ? 'technology' : 'case study';
    if (!confirm(`Are you sure you want to delete this ${itemType}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/case-studies/${caseStudyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete case study');
      }

      router.push('/admin/case-studies');
    } catch (error) {
      console.error('Failed to delete case study:', error);
      alert('Failed to delete. Please try again.');
    }
  };

  const getCategoryIcon = (category: string) => {
    return category === 'technology' ? '⚙️' : '📊';
  };

  const getCategoryLabel = (category: string) => {
    return category === 'technology' ? 'Technology' : 'Case Study';
  };

  if (loadingCaseStudy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500">Loading case study...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/case-studies"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/admin/case-studies" className="hover:text-gray-700">Case Studies</Link>
                    <span>/</span>
                    <span className="text-gray-900">Edit {getCategoryLabel(watchedCategory)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <h1 className="text-xl font-bold text-gray-900">Edit {getCategoryLabel(watchedCategory)}</h1>
                    <span className="text-lg">{getCategoryIcon(watchedCategory)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Save Status Indicator */}
                {saveStatus === 'saved' && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Saved successfully
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Failed to save
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/case-studies')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
                
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('title')}
                      className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., E-commerce Platform Development"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  {/* URL Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        /{watchedLocale}/{watchedCategory === 'technology' ? 'technologies' : 'case-studies'}/
                      </span>
                      <input
                        {...register('slug')}
                        className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="ecommerce-platform"
                      />
                    </div>
                    {errors.slug && (
                      <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('category')}
                      className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="caseStudy">📊 Case Study</option>
                      <option value="technology">⚙️ Technology</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Technologies appear in the footer for SEO
                    </p>
                  </div>

                  {/* Client and Sector */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {watchedCategory === 'technology' ? 'Company/Context' : 'Client'}
                      </label>
                      <input
                        {...register('client')}
                        className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={watchedCategory === 'technology' ? 'e.g., Internal Project' : 'e.g., Acme Corp'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {watchedCategory === 'technology' ? 'Category/Type' : 'Industry/Sector'}
                      </label>
                      <input
                        {...register('sector')}
                        className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={watchedCategory === 'technology' ? 'e.g., Backend Framework' : 'e.g., E-commerce'}
                      />
                    </div>
                  </div>

                  {/* Icon and Order */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon
                      </label>
                      <div className="flex items-center gap-2">
                        {watchedIcon && (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{watchedIcon}</span>
                          </div>
                        )}
                        <input
                          {...register('icon')}
                          className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder={watchedCategory === 'technology' ? 'e.g., ⚛️ or React' : 'e.g., 🛒 or 📊'}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Leave empty to use default category icon
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        {...register('order', { valueAsNumber: true })}
                        type="number"
                        className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {watchedCategory === 'technology' ? 'Order in footer display' : 'Order in portfolio display'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Management */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Content Management</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Linked Content Page
                  </label>
                  <select
                    {...register('pageId')}
                    disabled={loadingPages}
                    className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">— No page selected —</option>
                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title} (/{page.slug})
                      </option>
                    ))}
                  </select>
                  
                  {loadingPages && (
                    <p className="mt-1 text-sm text-gray-500">Loading available pages...</p>
                  )}
                  
                  {watchedPageId && !loadingPages && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm">
                          <p className="text-green-800 font-medium">Page Linked Successfully</p>
                          <p className="text-green-700">
                            {pages.find(p => p.id === watchedPageId)?.title || 'Selected page'} is linked to this {getCategoryLabel(watchedCategory).toLowerCase()}.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!watchedPageId && !loadingPages && (
                    <p className="mt-2 text-sm text-gray-500">
                      Select a published page to display when users click on this {getCategoryLabel(watchedCategory).toLowerCase()}.
                    </p>
                  )}
                  
                  {watchedPageId && (
                    <Link
                      href={`/admin/pages/${watchedPageId}/edit`}
                      className="inline-flex items-center gap-2 mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Linked Page
                    </Link>
                  )}
                </div>
              </div>

              {/* Block Editor */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Content Blocks</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Build your {getCategoryLabel(watchedCategory).toLowerCase()} page with drag & drop blocks
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {blocks.length} block{blocks.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <BlockEditor
                    blocks={blocks}
                    onChange={setBlocks}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publishing Options */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Publishing</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      {...register('locale')}
                      className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      {...register('status')}
                      className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="inReview">In Review</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                
                <div className="space-y-3">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/${watchedLocale}/${watchedCategory === 'technology' ? 'technologies' : 'case-studies'}/${watchedSlug}`}
                    target="_blank"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">View on Frontend</span>
                  </Link>
                  
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(`/${watchedLocale}/${watchedCategory === 'technology' ? 'technologies' : 'case-studies'}/${watchedSlug}`)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Copy URL</span>
                  </button>
                </div>
              </div>

              {/* Category-specific Help */}
              {watchedCategory === 'technology' ? (
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-sm font-semibold text-purple-900 mb-2">
                    ⚙️ Technology Tips
                  </h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Technologies appear in the website footer</li>
                    <li>• Use clear, recognizable icons or abbreviations</li>
                    <li>• Order controls sequence in footer display</li>
                    <li>• Link to detailed technology pages for SEO</li>
                  </ul>
                </div>
              ) : (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">
                    📊 Case Study Tips
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Include client and sector for context</li>
                    <li>• Detailed case studies improve SEO</li>
                    <li>• Use compelling icons and titles</li>
                    <li>• Link to comprehensive project pages</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}