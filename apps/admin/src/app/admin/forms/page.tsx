'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface FormAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

interface FormSubmission {
  id: string;
  formType: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  status: 'unread' | 'read' | 'inProgress' | 'responded' | 'archived';
  attachments: FormAttachment[];
  assignedUser?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface FormsResponse {
  success: boolean;
  data: {
    submissions: FormSubmission[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

const statusColors = {
  unread: 'bg-blue-100 text-blue-800',
  read: 'bg-green-100 text-green-800',
  inProgress: 'bg-yellow-100 text-yellow-800',
  responded: 'bg-purple-100 text-purple-800',
  archived: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  unread: 'Unread',
  read: 'Read',
  inProgress: 'In Progress',
  responded: 'Responded',
  archived: 'Archived',
};

export default function FormsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/forms?${params}`);
      const data: FormsResponse = await response.json();

      if (data.success) {
        setSubmissions(data.data.submissions);
        setTotalPages(data.data.pagination.pages);
        setTotalCount(data.data.pagination.total);
      } else {
        setError('Failed to fetch form submissions');
      }
    } catch (error) {
      setError('An error occurred while fetching form submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage, statusFilter, searchTerm]);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} submission(s)?`)) {
      return;
    }

    try {
      const response = await fetch('/api/forms', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const result = await response.json();

      if (result.success) {
        setSelectedIds([]);
        fetchSubmissions();
      } else {
        setError(result.message || 'Failed to delete submissions');
      }
    } catch (error) {
      setError('An error occurred while deleting submissions');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === submissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(submissions.map(s => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Submissions</h1>
        <p className="text-gray-600">Manage contact form submissions and inquiries</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, company, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="inProgress">In Progress</option>
            <option value="responded">Responded</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-blue-700">
              {selectedIds.length} item(s) selected
            </p>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
        </div>
        {Object.entries(statusLabels).map(([status, label]) => (
          <div key={status} className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {submissions.filter(s => s.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={submissions.length > 0 && selectedIds.length === submissions.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No form submissions found
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(submission.id)}
                        onChange={() => toggleSelect(submission.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-semibold text-gray-900">
                        {submission.id.substring(0, 8).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-700 font-medium">
                              {submission.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {submission.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.email}
                          </div>
                          {submission.company && (
                            <div className="text-sm text-gray-500">
                              {submission.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {submission.service && (
                          <div className="mb-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {submission.service}
                            </span>
                          </div>
                        )}
                        {submission.budget && (
                          <div className="text-sm text-gray-600 mb-1">
                            Budget: {submission.budget}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {submission.message}
                        </div>
                        {submission.attachments.length > 0 && (
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span>📎</span>
                            <span className="ml-1">
                              {submission.attachments.length} attachment(s)
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[submission.status]}`}>
                        {statusLabels[submission.status]}
                      </span>
                      {submission.assignedUser && (
                        <div className="mt-1 text-xs text-gray-500">
                          Assigned to {submission.assignedUser.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link
                        href={`/admin/forms/${submission.id}`}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded-lg text-sm ${
                  page === currentPage
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}