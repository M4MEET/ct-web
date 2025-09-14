'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'draft':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    case 'inReview':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'scheduled':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'published':
      return '✓';
    case 'draft':
      return '✎';
    case 'inReview':
      return '⏱';
    case 'scheduled':
      return '📅';
    default:
      return '•';
  }
};

export function PagesPageContent() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLocale = searchParams?.get('locale') || 'en';

  useEffect(() => {
    loadPages(currentLocale);
  }, [currentLocale]);

  const loadPages = async (locale: string) => {
    try {
      const response = await fetch(`/api/pages?locale=${locale}`);
      if (response.ok) {
        const result = await response.json();
        setPages(result.data || []);
      } else {
        console.error('Failed to load pages:', response.status);
        setPages([]);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocaleChange = (locale: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('locale', locale);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSelectPage = (id: string) => {
    setSelectedPages(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPages.length === pages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(pages.map((p: any) => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedPages.length} page(s)?`)) {
      return;
    }

    try {
      const errors = [];
      for (const id of selectedPages) {
        const response = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (!response.ok) {
          if (response.status === 409) {
            errors.push(`Page linked to services: ${result.message}`);
          } else {
            errors.push(`Failed to delete page: ${result.error || 'Unknown error'}`);
          }
        }
      }
      
      if (errors.length > 0) {
        alert(`Some pages could not be deleted:\n\n${errors.join('\n')}`);
      }
      
      loadPages(currentLocale);
      setSelectedPages([]);
    } catch (error) {
      console.error('Error deleting pages:', error);
      alert('Error occurred while deleting pages. Please try again.');
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (response.ok) {
        loadPages(currentLocale);
      } else if (response.status === 409) {
        // Page is linked to services
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
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">
            <svg className="animate-spin h-8 w-8 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading pages...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📄 Pages</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Create and manage your content pages with the block editor</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Language Switcher */}
              <div className="relative">
                <select
                  value={currentLocale}
                  onChange={(e) => handleLocaleChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="de">🇩🇪 Deutsch</option>
                  <option value="fr">🇫🇷 Français</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <Link
                href="/admin/pages/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Page
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="group relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 hover:border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                    <span className="text-xl">📄</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total Pages</p>
              </div>
            </div>
            
            <div className="group relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:shadow-green-50 transition-all duration-300 hover:border-green-200">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-300">
                    <span className="text-xl">✅</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {pages.filter((p: any) => p.status === 'published').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Published</p>
              </div>
            </div>
            
            <div className="group relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:shadow-yellow-50 transition-all duration-300 hover:border-yellow-200">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-amber-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors duration-300">
                    <span className="text-xl">✏️</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {pages.filter((p: any) => p.status === 'draft').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Drafts</p>
              </div>
            </div>
            
            <div className="group relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:shadow-purple-50 transition-all duration-300 hover:border-purple-200">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-violet-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-300">
                    <span className="text-xl">📦</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {pages.filter((p: any) => p.blocks && p.blocks.length > 0).length}
                </p>
                <p className="text-sm text-gray-600 mt-1">With Content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      {selectedPages.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedPages.length} {selectedPages.length === 1 ? 'item' : 'items'} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPages([])}
                className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pages Grid */}
      <div className="p-4 sm:p-6">
        {pages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
              <p className="text-sm text-gray-500 mb-6">Get started by creating your first content page</p>
              <Link
                href="/admin/pages/new"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create your first page
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Mobile View */}
            <div className="block lg:hidden">
              {pages.map((page: any) => (
                <div key={page.id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(page.id)}
                        onChange={() => handleSelectPage(page.id)}
                        className="mt-1 w-4 h-4 rounded border-gray-400 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{page.title}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="font-mono text-xs">/{page.slug}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      page.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : page.status === 'draft'
                        ? 'bg-gray-100 text-gray-700'
                        : page.status === 'inReview'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {page.status === 'inReview' ? 'In Review' : page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-xs font-medium">
                      {page.locale.toUpperCase()}
                    </span>
                    <span>{page.blocks?.length || 0} blocks</span>
                    <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {page.status === 'published' && (
                      <Link
                        href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/${page.locale}/${page.slug}`}
                        target="_blank"
                        className="inline-flex items-center justify-center w-8 h-8 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    )}
                    <Link
                      href={`/admin/pages/${page.id}/preview`}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                    >
                      Preview
                    </Link>
                    <Link
                      href={`/admin/pages/${page.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="inline-flex items-center justify-center w-8 h-8 text-red-500 bg-white border border-gray-200 rounded-lg hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="w-12 px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPages.length === pages.length && pages.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-400 text-primary-600 focus:ring-primary-500 focus:ring-2"
                      />
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Page Details
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pages.map((page: any) => (
                    <tr key={page.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPages.includes(page.id)}
                          onChange={() => handleSelectPage(page.id)}
                          className="w-4 h-4 rounded border-gray-400 text-primary-600 focus:ring-primary-500 focus:ring-2"
                        />
                      </td>
                      <td className="px-6 py-4 min-w-[250px]">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate max-w-[200px] xl:max-w-[300px]" title={page.title}>
                              {page.title}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
                              <span className="font-mono text-xs truncate max-w-[150px]" title={`/${page.slug}`}>
                                /{page.slug}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                {page.locale.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            page.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : page.status === 'draft'
                              ? 'bg-gray-100 text-gray-700'
                              : page.status === 'inReview'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              page.status === 'published' 
                                ? 'bg-green-500' 
                                : page.status === 'draft' 
                                ? 'bg-gray-500'
                                : page.status === 'inReview'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}></div>
                            {page.status === 'inReview' ? 'In Review' : page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{page.blocks?.length || 0}</span>
                          <span className="text-sm text-gray-500">blocks</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{new Date(page.updatedAt).toLocaleDateString()}</div>
                          <div className="text-gray-500 text-xs">{new Date(page.updatedAt).toLocaleTimeString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {page.status === 'published' && (
                            <Link
                              href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/${page.locale}/${page.slug}`}
                              target="_blank"
                              className="inline-flex items-center justify-center w-8 h-8 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
                              title="View on frontend"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                          )}
                          <Link
                            href={`/admin/pages/${page.id}/preview`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Preview page"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Preview
                          </Link>
                          <Link
                            href={`/admin/pages/${page.id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                            title="Edit page"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDeletePage(page.id)}
                            className="inline-flex items-center justify-center w-8 h-8 text-red-500 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                            title="Delete page"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Tips</h3>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>Pages contain the actual content using the block editor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>Create pages first, then link them to services for organized content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>Use different languages to create localized versions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>Published pages can be viewed directly on the frontend</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}