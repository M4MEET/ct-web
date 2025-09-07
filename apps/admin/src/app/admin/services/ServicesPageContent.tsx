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

export function ServicesPageContent() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLocale = searchParams?.get('locale') || 'en';

  useEffect(() => {
    loadServices(currentLocale);
  }, [currentLocale]);

  const loadServices = async (locale: string) => {
    try {
      const response = await fetch(`/api/services?locale=${locale}`);
      if (response.ok) {
        const result = await response.json();
        setServices(result.data || []);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocaleChange = (locale: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('locale', locale);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSelectService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) 
        ? prev.filter(sid => sid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedServices.length === services.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(services.map((s: any) => s.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedServices.length} service(s)?`)) {
      return;
    }

    try {
      for (const id of selectedServices) {
        await fetch(`/api/services/${id}`, { method: 'DELETE' });
      }
      loadServices(currentLocale);
      setSelectedServices([]);
    } catch (error) {
      console.error('Error deleting services:', error);
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
            Loading services...
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
              <h1 className="text-2xl font-bold text-gray-900">Services</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your service offerings and link them to content pages</p>
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
                href="/admin/services/new"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Service
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{services.length}</span>
              <span className="text-sm text-gray-500">Total Services</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {services.filter((s: any) => s.status === 'published').length}
              </span>
              <span className="text-sm text-gray-500">Published</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-400">
                {services.filter((s: any) => s.status === 'draft').length}
              </span>
              <span className="text-sm text-gray-500">Drafts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      {selectedServices.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedServices.length} service(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedServices([])}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear selection
              </button>
              <button
                onClick={handleBulkDelete}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-medium"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="p-6">
        {services.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-sm text-gray-500 mb-6">Get started by creating your first service</p>
              <Link
                href="/admin/services/new"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create your first service
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-12 px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedServices.length === services.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Linked Page
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map((service: any) => (
                    <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleSelectService(service.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{service.icon || '🔧'}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            <div className="text-xs text-gray-500">/{service.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(service.status)}`}>
                          <span>{getStatusIcon(service.status)}</span>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {service.page ? (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <div className="text-sm text-gray-900">{service.page.title}</div>
                              <div className="text-xs text-gray-500">/{service.page.slug}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm text-gray-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            No page linked
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          {service.order ?? '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(service.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(service.updatedAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/en/services/${service.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View on frontend"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                          <Link
                            href={`/admin/services/${service.id}/edit`}
                            className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit service"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button 
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this service?')) {
                                await fetch(`/api/services/${service.id}`, { method: 'DELETE' });
                                loadServices(currentLocale);
                              }
                            }}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete service"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">📌 How Services Work</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Services are your main offerings displayed on the frontend</li>
            <li>• Each service can be linked to a content page created in the Pages section</li>
            <li>• Use the order field to control the display sequence on your website</li>
            <li>• Icons help visually distinguish services in listings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}