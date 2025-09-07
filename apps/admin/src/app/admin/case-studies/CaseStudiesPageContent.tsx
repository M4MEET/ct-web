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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'technology':
      return '⚙️';
    case 'caseStudy':
    default:
      return '📊';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'technology':
      return 'Technology';
    case 'caseStudy':
    default:
      return 'Case Study';
  }
};

export function CaseStudiesPageContent() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseStudies, setSelectedCaseStudies] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLocale = searchParams?.get('locale') || 'en';
  const currentCategory = searchParams?.get('category') || 'all';

  useEffect(() => {
    loadCaseStudies(currentLocale, currentCategory);
    
    // Check for success message from URL params
    const success = searchParams?.get('success');
    if (success === 'created') {
      setSuccessMessage('Case study created successfully!');
      // Clear success param from URL
      const params = new URLSearchParams(searchParams?.toString());
      params.delete('success');
      router.replace(`${pathname}?${params.toString()}`);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [currentLocale, currentCategory, searchParams, router, pathname]);

  const loadCaseStudies = async (locale: string, category: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/case-studies?locale=${locale}`;
      if (category && category !== 'all') {
        url += `&category=${category}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        setCaseStudies(result.data || []);
      } else {
        setError(`Failed to load case studies: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading case studies:', error);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocaleChange = (locale: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('locale', locale);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSelectCaseStudy = (id: string) => {
    setSelectedCaseStudies(prev => 
      prev.includes(id) 
        ? prev.filter(sid => sid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCaseStudies.length === filteredCaseStudies.length && filteredCaseStudies.length > 0) {
      setSelectedCaseStudies([]);
    } else {
      setSelectedCaseStudies(filteredCaseStudies.map((cs: any) => cs.id));
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedCaseStudies.length} case study/studies?`)) {
      return;
    }

    setDeletingIds(selectedCaseStudies);
    try {
      await Promise.all(
        selectedCaseStudies.map(id => 
          fetch(`/api/case-studies/${id}`, { method: 'DELETE' })
        )
      );
      loadCaseStudies(currentLocale, currentCategory);
      setSelectedCaseStudies([]);
    } catch (error) {
      console.error('Error deleting case studies:', error);
      setError('Failed to delete some case studies. Please try again.');
    } finally {
      setDeletingIds([]);
    }
  };

  const handleSingleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeletingIds([id]);
    try {
      const response = await fetch(`/api/case-studies/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadCaseStudies(currentLocale, currentCategory);
      } else {
        setError('Failed to delete case study. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting case study:', error);
      setError('Failed to delete case study. Please try again.');
    } finally {
      setDeletingIds([]);
    }
  };

  // Filter and sort case studies
  const filteredCaseStudies = caseStudies
    .filter((cs: any) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        cs.title?.toLowerCase().includes(searchLower) ||
        cs.client?.toLowerCase().includes(searchLower) ||
        cs.sector?.toLowerCase().includes(searchLower) ||
        cs.slug?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle null/undefined values
      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';
      
      // Handle dates
      if (sortField === 'updatedAt' || sortField === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      
      // Handle strings
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const caseStudiesCount = caseStudies.filter((cs: any) => cs.category === 'caseStudy').length;
  const technologiesCount = caseStudies.filter((cs: any) => cs.category === 'technology').length;
  const filteredCaseStudiesCount = filteredCaseStudies.filter((cs: any) => cs.category === 'caseStudy').length;
  const filteredTechnologiesCount = filteredCaseStudies.filter((cs: any) => cs.category === 'technology').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">
            <svg className="animate-spin h-8 w-8 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading case studies...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Case Studies & Technologies</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your case studies and technology portfolio</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <select
                  value={currentLocale}
                  onChange={(e) => handleLocaleChange(e.target.value)}
                  className="text-sm bg-transparent border-0 text-gray-700 font-medium focus:ring-0 cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              
              <Link
                href="/admin/case-studies/new"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New
              </Link>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 mt-6">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentCategory === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              All ({caseStudies.length})
            </button>
            <button
              onClick={() => handleCategoryChange('caseStudy')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentCategory === 'caseStudy' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              📊 Case Studies ({caseStudiesCount})
            </button>
            <button
              onClick={() => handleCategoryChange('technology')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentCategory === 'technology' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              ⚙️ Technologies ({technologiesCount})
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search case studies and technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {searchTerm ? filteredCaseStudies.length : caseStudies.length}
              </span>
              <span className="text-sm text-gray-500">
                {searchTerm ? 'Matching' : ''} {currentCategory === 'all' ? 'Items' : 
                 currentCategory === 'technology' ? 'Technologies' : 'Case Studies'}
              </span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {(searchTerm ? filteredCaseStudies : caseStudies).filter((cs: any) => cs.status === 'published').length}
              </span>
              <span className="text-sm text-gray-500">Published</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-400">
                {(searchTerm ? filteredCaseStudies : caseStudies).filter((cs: any) => cs.status === 'draft').length}
              </span>
              <span className="text-sm text-gray-500">Drafts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-green-800">{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-green-400 hover:text-green-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Search Results Info */}
      {searchTerm && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-900">
              Found {filteredCaseStudies.length} result{filteredCaseStudies.length === 1 ? '' : 's'} for "{searchTerm}"
            </span>
            {filteredCaseStudies.length < caseStudies.length && (
              <span className="text-sm text-blue-600">
                ({caseStudies.length - filteredCaseStudies.length} hidden)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions Bar */}
      {selectedCaseStudies.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedCaseStudies.length} item(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedCaseStudies([])}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear selection
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={deletingIds.length > 0}
                className="text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
              >
                {deletingIds.length > 0 && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                )}
                {deletingIds.length > 0 ? 'Deleting...' : 'Delete Selected'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case Studies Grid */}
      <div className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-medium text-red-800">{error}</span>
            </div>
            <button
              onClick={() => loadCaseStudies(currentLocale, currentCategory)}
              className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
            >
              Try again
            </button>
          </div>
        )}
        
        {filteredCaseStudies.length === 0 && !error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm 
                  ? `No results found for "${searchTerm}"`
                  : `No ${currentCategory === 'technology' ? 'technologies' : 
                       currentCategory === 'caseStudy' ? 'case studies' : 'items'} found`
                }
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms or browse all items.'
                  : `Get started by creating your first ${currentCategory === 'technology' ? 'technology' : 'case study'}`
                }
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear search
                </button>
              ) : (
                <Link
                  href="/admin/case-studies/new"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create your first {currentCategory === 'technology' ? 'technology' : 'case study'}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card View (Hidden on desktop) */}
            <div className="lg:hidden space-y-4">
              {filteredCaseStudies.map((caseStudy: any) => (
                <div key={caseStudy.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${deletingIds.includes(caseStudy.id) ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCaseStudies.includes(caseStudy.id)}
                        onChange={() => handleSelectCaseStudy(caseStudy.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{caseStudy.icon || getCategoryIcon(caseStudy.category)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{caseStudy.title}</div>
                        <div className="text-xs text-gray-500">/{caseStudy.slug}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/en/${caseStudy.category === 'technology' ? 'technologies' : 'case-studies'}/${caseStudy.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View on frontend"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/case-studies/${caseStudy.id}/edit`}
                        className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit case study"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleSingleDelete(caseStudy.id, caseStudy.title)}
                        disabled={deletingIds.includes(caseStudy.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={`Delete ${getCategoryLabel(caseStudy.category).toLowerCase()}`}
                      >
                        {deletingIds.includes(caseStudy.id) ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">Category:</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${
                          caseStudy.category === 'technology' 
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          <span>{getCategoryIcon(caseStudy.category)}</span>
                          {getCategoryLabel(caseStudy.category)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Status:</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(caseStudy.status)}`}>
                          <span>{getStatusIcon(caseStudy.status)}</span>
                          {caseStudy.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Client:</span>
                      <div className="mt-1 text-gray-900">
                        {caseStudy.client || '-'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Order:</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                          {caseStudy.order ?? '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    Last modified: {new Date(caseStudy.updatedAt).toLocaleDateString()} at {new Date(caseStudy.updatedAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-12 px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedCaseStudies.length === filteredCaseStudies.length && filteredCaseStudies.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('title')}
                        className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                      >
                        Title
                        {sortField === 'title' && (
                          <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('category')}
                        className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                      >
                        Category
                        {sortField === 'category' && (
                          <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                      >
                        Status
                        {sortField === 'status' && (
                          <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('client')}
                        className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                      >
                        Client/Info
                        {sortField === 'client' && (
                          <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('order')}
                        className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                      >
                        Order
                        {sortField === 'order' && (
                          <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('updatedAt')}
                        className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                      >
                        Last Modified
                        {sortField === 'updatedAt' && (
                          <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCaseStudies.map((caseStudy: any) => (
                    <tr key={caseStudy.id} className={`hover:bg-gray-50 transition-colors ${deletingIds.includes(caseStudy.id) ? 'opacity-50 pointer-events-none' : ''}`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCaseStudies.includes(caseStudy.id)}
                          onChange={() => handleSelectCaseStudy(caseStudy.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{caseStudy.icon || getCategoryIcon(caseStudy.category)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{caseStudy.title}</div>
                            <div className="text-xs text-gray-500">/{caseStudy.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${
                          caseStudy.category === 'technology' 
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          <span>{getCategoryIcon(caseStudy.category)}</span>
                          {getCategoryLabel(caseStudy.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(caseStudy.status)}`}>
                          <span>{getStatusIcon(caseStudy.status)}</span>
                          {caseStudy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {caseStudy.client && (
                            <div className="font-medium">{caseStudy.client}</div>
                          )}
                          {caseStudy.sector && (
                            <div className="text-xs text-gray-500">{caseStudy.sector}</div>
                          )}
                          {!caseStudy.client && !caseStudy.sector && (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          {caseStudy.order ?? '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(caseStudy.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(caseStudy.updatedAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/en/${caseStudy.category === 'technology' ? 'technologies' : 'case-studies'}/${caseStudy.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View on frontend"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                          <Link
                            href={`/admin/case-studies/${caseStudy.id}/edit`}
                            className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit case study"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button 
                            onClick={() => handleSingleDelete(caseStudy.id, caseStudy.title)}
                            disabled={deletingIds.includes(caseStudy.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={`Delete ${getCategoryLabel(caseStudy.category).toLowerCase()}`}
                          >
                            {deletingIds.includes(caseStudy.id) ? (
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">📌 How Case Studies & Technologies Work</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Case Studies:</strong> Showcase your successful projects and client work</li>
            <li>• <strong>Technologies:</strong> Display your tech stack and capabilities in the footer</li>
            <li>• Use categories to organize content for different purposes (SEO, portfolio, etc.)</li>
            <li>• Each item can be linked to a detailed content page with blocks</li>
            <li>• Use the order field to control display sequence on your website</li>
          </ul>
        </div>
      </div>
    </div>
  );
}