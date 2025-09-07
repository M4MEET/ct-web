'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [pages, setPages] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPages, setLoadingPages] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isValidatingSlug, setIsValidatingSlug] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CaseStudyFormData>({
    resolver: zodResolver(caseStudyFormSchema),
    defaultValues: {
      locale: 'en',
      status: 'draft',
      category: 'caseStudy',
      order: 0,
    },
  });

  const watchedTitle = watch('title');
  const watchedLocale = watch('locale');
  const watchedCategory = watch('category');

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Load pages for the selected locale
  React.useEffect(() => {
    loadPages(watchedLocale);
  }, [watchedLocale]);

  // Update slug when title changes
  React.useEffect(() => {
    if (watchedTitle) {
      setValue('slug', generateSlug(watchedTitle));
    }
  }, [watchedTitle, setValue]);

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

  // Validate slug uniqueness
  const validateSlug = async (slug: string, locale: string) => {
    if (!slug) return;
    
    setIsValidatingSlug(true);
    setSlugError(null);
    
    try {
      const response = await fetch(`/api/case-studies?slug=${slug}&locale=${locale}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setSlugError('This slug is already in use. Please choose a different one.');
        }
      }
    } catch (error) {
      console.error('Error validating slug:', error);
    } finally {
      setIsValidatingSlug(false);
    }
  };

  // Debounced slug validation
  React.useEffect(() => {
    const slug = watch('slug');
    const locale = watch('locale');
    
    if (slug && slug.length > 2) {
      const timeoutId = setTimeout(() => {
        validateSlug(slug, locale);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [watch('slug'), watch('locale')]);

  const onSubmit = async (data: CaseStudyFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/case-studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create case study');
      }

      // Show success message and redirect
      router.push('/admin/case-studies?success=created');
    } catch (error: any) {
      console.error('Failed to save case study:', error);
      setSubmitError(error.message || 'Failed to save case study. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    return category === 'technology' ? '⚙️' : '📊';
  };

  const getCategoryLabel = (category: string) => {
    return category === 'technology' ? 'Technology' : 'Case Study';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
                <div className="h-6 w-px bg-gray-200" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white text-lg font-semibold">
                    {getCategoryIcon(watchedCategory)}
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Create New {getCategoryLabel(watchedCategory)}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {watchedCategory === 'technology' ? 'Add a new technology to your portfolio' : 'Document a successful client project'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !!slugError || isValidatingSlug}
                  className={`inline-flex items-center gap-2 px-6 py-2 text-sm font-medium border rounded-lg transition-colors ${
                    isSubmitting || !!slugError || isValidatingSlug
                      ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'text-white bg-primary-600 border-transparent hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                  }`}
                >
                  {isSubmitting && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  )}
                  {isSubmitting ? 'Creating...' : `Create ${getCategoryLabel(watchedCategory)}`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Error Alert */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm font-medium text-red-800 flex-1">{submitError}</span>
                    <button
                      onClick={() => setSubmitError(null)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                    <p className="text-sm text-gray-500">Essential details for your {getCategoryLabel(watchedCategory).toLowerCase()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('title')}
                      placeholder={`Enter ${getCategoryLabel(watchedCategory).toLowerCase()} title...`}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 text-lg ${
                        errors.title 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                      }`}
                    />
                    {errors.title && (
                      <div className="flex items-center gap-1 mt-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-red-500 text-sm">{errors.title.message}</p>
                      </div>
                    )}
                  </div>

                  {/* URL Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">/</span>
                      </div>
                      <input
                        {...register('slug')}
                        placeholder="url-friendly-slug"
                        className={`w-full pl-8 pr-10 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                          errors.slug || slugError
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : isValidatingSlug
                            ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-200'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                        }`}
                      />
                      {/* Status Icons */}
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {isValidatingSlug && (
                          <svg className="animate-spin h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                        )}
                        {!isValidatingSlug && !errors.slug && !slugError && watch('slug') && (
                          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {(errors.slug || slugError) && (
                          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    {(errors.slug || slugError) && (
                      <div className="flex items-center gap-1 mt-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-red-500 text-sm">{errors.slug?.message || slugError}</p>
                      </div>
                    )}
                    {isValidatingSlug && (
                      <p className="text-yellow-600 text-sm mt-2 flex items-center gap-1">
                        <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Checking availability...
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">This will be used in the URL: /{watchedCategory === 'technology' ? 'technologies' : 'case-studies'}/{watch('slug') || 'your-slug'}</p>
                  </div>

                  {/* Two column grid for smaller fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <div className="relative">
                        <select
                          {...register('locale')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                        >
                          <option value="en">🇺🇸 English</option>
                          <option value="de">🇩🇪 Deutsch</option>
                          <option value="fr">🇫🇷 Français</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Publication Status
                      </label>
                      <div className="relative">
                        <select
                          {...register('status')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                        >
                          <option value="draft">📝 Draft</option>
                          <option value="inReview">👀 In Review</option>
                          <option value="scheduled">📅 Scheduled</option>
                          <option value="published">✅ Published</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category & Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Category & Details</h2>
                    <p className="text-sm text-gray-500">Specify the type and additional information</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        watchedCategory === 'caseStudy'
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <input
                          {...register('category')}
                          type="radio"
                          value="caseStudy"
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                            📊
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Case Study</div>
                            <div className="text-sm text-gray-500">Client project showcase</div>
                          </div>
                        </div>
                        {watchedCategory === 'caseStudy' && (
                          <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>
                      
                      <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        watchedCategory === 'technology'
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <input
                          {...register('category')}
                          type="radio"
                          value="technology"
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-lg">
                            ⚙️
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Technology</div>
                            <div className="text-sm text-gray-500">Tech stack item</div>
                          </div>
                        </div>
                        {watchedCategory === 'technology' && (
                          <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {watchedCategory === 'technology' 
                        ? 'Technologies appear in the website footer and tech stack sections' 
                        : 'Case studies are featured in your portfolio and project showcase sections'
                      }
                    </p>
                  </div>

                  {/* Conditional Fields based on category */}
                  {watchedCategory === 'caseStudy' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Client Name
                        </label>
                        <input
                          {...register('client')}
                          placeholder="Enter client or company name..."
                          className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                            errors.client 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                          }`}
                        />
                        {errors.client && (
                          <div className="flex items-center gap-1 mt-2">
                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p className="text-red-500 text-sm">{errors.client.message}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Industry/Sector
                        </label>
                        <input
                          {...register('sector')}
                          placeholder="e.g., Healthcare, Fintech, E-commerce..."
                          className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                            errors.sector 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                          }`}
                        />
                        {errors.sector && (
                          <div className="flex items-center gap-1 mt-2">
                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p className="text-red-500 text-sm">{errors.sector.message}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Additional Settings</h2>
                    <p className="text-sm text-gray-500">Customize display and content options</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Icon */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Icon
                      </label>
                      <input
                        {...register('icon')}
                        placeholder="🚀 or custom text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty to use default {getCategoryIcon(watchedCategory)}
                      </p>
                    </div>

                    {/* Display Order */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        {...register('order', { valueAsNumber: true })}
                        type="number"
                        placeholder="0"
                        min="0"
                        step="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Lower numbers appear first
                      </p>
                    </div>
                  </div>
                  
                  {/* Content Page */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Linked Content Page
                      {loadingPages && (
                        <span className="ml-2 text-xs text-gray-400">
                          <svg className="inline animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          Loading pages...
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <select
                        {...register('pageId')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-500"
                        disabled={loadingPages}
                      >
                        <option value="">📄 No page selected (standalone item)</option>
                        {pages.map((page) => (
                          <option key={page.id} value={page.id}>
                            📝 {page.title}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Select a published page with detailed content, or leave empty for a standalone listing item.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Info & Help */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Create Content Page</div>
                        <div className="text-sm text-gray-500">Build detailed content with blocks</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Upload Media</div>
                        <div className="text-sm text-gray-500">Add images, videos, files</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Workflow Guide */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    💡 Content Management Workflow
                  </h3>
                </div>
                <div className="text-blue-800 text-sm space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold text-xs mt-0.5">1</div>
                    <div>
                      <p className="font-medium">Fill out this form</p>
                      <p className="text-blue-600">Add basic information, category, and settings</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold text-xs mt-0.5">2</div>
                    <div>
                      <p className="font-medium">Create detailed content (optional)</p>
                      <p className="text-blue-600">Build a full page using the block editor for rich content</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold text-xs mt-0.5">3</div>
                    <div>
                      <p className="font-medium">Link & publish</p>
                      <p className="text-blue-600">Connect your content page and set status to published</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category-specific tips */}
              {watchedCategory === 'technology' && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">⚙️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-purple-900">Technology Tips</h3>
                  </div>
                  <div className="text-purple-800 text-sm space-y-2">
                    <p>• <strong>Footer Display:</strong> Technologies appear in your website footer</p>
                    <p>• <strong>Order Matters:</strong> Use the display order to control sequence</p>
                    <p>• <strong>Icon Ideas:</strong> Try tech emojis like 🚀 ⚛️ 🔧 or abbreviations</p>
                    <p>• <strong>SEO Boost:</strong> Helps showcase your technical expertise</p>
                  </div>
                </div>
              )}

              {watchedCategory === 'caseStudy' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📊</span>
                    </div>
                    <h3 className="text-lg font-semibold text-green-900">Case Study Tips</h3>
                  </div>
                  <div className="text-green-800 text-sm space-y-2">
                    <p>• <strong>Client & Sector:</strong> Essential for showcasing project context</p>
                    <p>• <strong>Portfolio Display:</strong> Featured prominently in your work section</p>
                    <p>• <strong>Content Strategy:</strong> Link to detailed pages with results & metrics</p>
                    <p>• <strong>SEO Benefits:</strong> Detailed case studies improve rankings</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}