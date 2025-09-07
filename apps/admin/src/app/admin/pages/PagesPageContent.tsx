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
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pages</h1>
              <p className="text-base text-gray-600">Create and manage your content pages with the block editor</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <select
                  value={currentLocale}
                  onChange={(e) => handleLocaleChange(e.target.value)}
                  className="text-sm bg-transparent border-0 text-gray-800 font-medium focus:ring-0 cursor-pointer pr-2"
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              
              <Link
                href="/admin/pages/new"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Page
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-blue-600">{pages.length}</span>
                  <p className="text-sm font-medium text-blue-700">Total Pages</p>
                </div>
                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-green-600">
                    {pages.filter((p: any) => p.status === 'published').length}
                  </span>
                  <p className="text-sm font-medium text-green-700">Published</p>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-yellow-600">
                    {pages.filter((p: any) => p.status === 'draft').length}
                  </span>
                  <p className="text-sm font-medium text-yellow-700">Drafts</p>
                </div>
                <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-purple-600">
                    {pages.filter((p: any) => p.blocks && p.blocks.length > 0).length}
                  </span>
                  <p className="text-sm font-medium text-purple-700">With Content</p>
                </div>
                <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      {selectedPages.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-blue-900">
                {selectedPages.length} page{selectedPages.length === 1 ? '' : 's'} selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedPages([])}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear selection
              </button>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pages Grid */}
      <div className="p-6">
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300">
                    <th className="w-12 px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPages.length === pages.length && pages.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-400 text-primary-600 focus:ring-primary-500 focus:ring-2"
                      />
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Page Details
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pages.map((page: any) => (
                    <tr key={page.id} className="hover:bg-blue-50/50 transition-all duration-200 border-b border-gray-100">
                      <td className="px-6 py-5">
                        <input
                          type="checkbox"
                          checked={selectedPages.includes(page.id)}
                          onChange={() => handleSelectPage(page.id)}
                          className="w-4 h-4 rounded border-gray-400 text-primary-600 focus:ring-primary-500 focus:ring-2"
                        />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="text-base font-semibold text-gray-900 truncate">{page.title}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="font-mono">/{page.slug}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full uppercase">
                                {page.locale}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                            page.status === 'published' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : page.status === 'draft' 
                              ? 'bg-gray-100 text-gray-800 border border-gray-200'
                              : page.status === 'inReview'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              page.status === 'published' 
                                ? 'bg-green-500' 
                                : page.status === 'draft' 
                                ? 'bg-gray-500'
                                : page.status === 'inReview'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}></div>
                            {page.status === 'inReview' ? 'In Review' : page.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <span className="text-base font-bold text-gray-900">{page.blocks?.length || 0}</span>
                            <div className="text-sm text-gray-600">blocks</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-semibold text-gray-900">{new Date(page.updatedAt).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{new Date(page.updatedAt).toLocaleTimeString()}</div>
                            {page.updatedBy && (
                              <div className="text-xs text-gray-400 mt-1">by {page.updatedBy.name}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          {page.status === 'published' && (
                            <Link
                              href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/${page.locale}/${page.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 px-2 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm"
                              title="View on frontend"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                          )}
                          <Link
                            href={`/admin/pages/${page.id}/preview`}
                            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm"
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
                            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 border border-primary-600 rounded-lg hover:bg-primary-700 hover:border-primary-700 transition-all duration-200 shadow-sm"
                            title="Edit page"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDeletePage(page.id)}
                            className="inline-flex items-center gap-1 px-2 py-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 shadow-sm"
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
        <div className="mt-8 bg-purple-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-900 mb-2">📄 How Pages Work</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Pages contain the actual content using the block editor</li>
            <li>• Create pages first, then link them to services for organized content</li>
            <li>• Use different languages to create localized versions</li>
            <li>• Published pages can be viewed directly on the frontend</li>
          </ul>
        </div>
      </div>
    </div>
  );
}