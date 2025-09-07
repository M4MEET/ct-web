'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Page {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: string;
  blocks: any[];
  updatedAt: string;
}

export default function PreviewPagePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

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
        setPage(result.data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-gray-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h1>
          <Link 
            href="/admin/pages"
            className="text-primary-600 hover:text-primary-700"
          >
            ← Back to Pages
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'inReview': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/pages"
              className="text-gray-400 hover:text-gray-600"
            >
              ← Back to Pages
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Page Preview</h1>
              <p className="text-sm text-gray-500">Viewing: {page.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(page.status)}`}>
              {page.status}
            </span>
            
            <div className="text-xs text-gray-500">
              <div>Locale: <span className="font-medium uppercase">{page.locale}</span></div>
              <div>Slug: <span className="font-medium">/{page.slug}</span></div>
            </div>

            {page.status === 'published' && (
              <Link
                href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/${page.locale}/${page.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Live
              </Link>
            )}
            
            <Link
              href={`/admin/pages/${page.id}/edit`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Page Meta Info */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-sm font-semibold text-blue-900 mb-2">📄 Page Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Title:</span>
              <div className="text-blue-900">{page.title}</div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Status:</span>
              <div className="text-blue-900 capitalize">{page.status}</div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Last Updated:</span>
              <div className="text-blue-900">{new Date(page.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Blocks Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {page.blocks && page.blocks.length > 0 ? (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Content Blocks ({page.blocks.length})</h2>
              <div className="space-y-6">
                {page.blocks.map((block, index) => (
                  <div key={block.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded uppercase">
                          {block.type}
                        </span>
                        <span className="text-xs text-gray-500">Block {index + 1}</span>
                      </div>
                      {!block.visible && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Hidden</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                      <pre className="whitespace-pre-wrap font-mono text-xs">
                        {JSON.stringify(block, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Empty Page</h3>
              <p className="text-sm text-gray-500 mb-4">This page doesn't have any content blocks yet.</p>
              <Link
                href={`/admin/pages/${page.id}/edit`}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Content Blocks
              </Link>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/admin/pages"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              ← Back to Pages
            </Link>
            <Link
              href={`/admin/pages/${page.id}/edit`}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors"
            >
              Edit This Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}