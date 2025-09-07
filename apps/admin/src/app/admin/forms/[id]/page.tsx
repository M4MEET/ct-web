'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

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
  notes?: string;
  attachments: FormAttachment[];
  assignedUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const statusOptions = [
  { value: 'unread', label: 'Unread', color: 'bg-blue-100 text-blue-800' },
  { value: 'read', label: 'Read', color: 'bg-green-100 text-green-800' },
  { value: 'inProgress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'responded', label: 'Responded', color: 'bg-purple-100 text-purple-800' },
  { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-800' },
];

export default function FormDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string>('');

  useEffect(() => {
    fetchSubmission();
    fetchUsers();
  }, [resolvedParams.id]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/forms/${resolvedParams.id}`);
      const data = await response.json();

      if (data.success) {
        setSubmission(data.data);
        setNotes(data.data.notes || '');
        setStatus(data.data.status);
        setAssignedTo(data.data.assignedUser?.id || '');
      } else {
        setError(data.message || 'Failed to fetch submission');
      }
    } catch (error) {
      setError('An error occurred while fetching submission');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleUpdate = async () => {
    if (!submission) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/forms/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes: notes || null,
          assignedTo: assignedTo || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmission(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to update submission');
      }
    } catch (error) {
      setError('An error occurred while updating submission');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!submission) return;

    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/forms/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/forms');
      } else {
        setError(data.message || 'Failed to delete submission');
      }
    } catch (error) {
      setError('An error occurred while deleting submission');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    return '📎';
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

  if (!submission) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Submission Not Found</h2>
          <p className="text-gray-600 mb-6">The requested form submission could not be found.</p>
          <Link
            href="/admin/forms"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to Forms
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = statusOptions.find(opt => opt.value === submission.status);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/admin/forms"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Forms
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Form Submission Details</h1>
          <div className="mt-2 flex items-center gap-4">
            <div className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
              <span className="text-sm font-semibold">
                Reference: {submission.id.substring(0, 8).toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600">
              Submitted {format(new Date(submission.createdAt), 'PPpp')}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submission Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{submission.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">
                  <a href={`mailto:${submission.email}`} className="text-primary-600 hover:text-primary-800">
                    {submission.email}
                  </a>
                </p>
              </div>
              {submission.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">
                    <a href={`tel:${submission.phone}`} className="text-primary-600 hover:text-primary-800">
                      {submission.phone}
                    </a>
                  </p>
                </div>
              )}
              {submission.company && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <p className="text-gray-900">{submission.company}</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Details */}
          {(submission.service || submission.budget || submission.timeline) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {submission.service && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Service</label>
                    <p className="text-gray-900">{submission.service}</p>
                  </div>
                )}
                {submission.budget && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Budget</label>
                    <p className="text-gray-900">{submission.budget}</p>
                  </div>
                )}
                {submission.timeline && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Timeline</label>
                    <p className="text-gray-900">{submission.timeline}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Message</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{submission.message}</p>
            </div>
          </div>

          {/* Attachments */}
          {submission.attachments.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h2>
              <div className="space-y-3">
                {submission.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getFileIcon(attachment.mimeType)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {attachment.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(attachment.size)} • {attachment.mimeType}
                        </p>
                      </div>
                    </div>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marketing Attribution & Metadata */}
          {submission.metadata && (
            <div className="space-y-6">
              {/* Marketing Attribution */}
              {(submission.metadata.utmSource || submission.metadata.utmMedium || submission.metadata.utmCampaign || submission.metadata.gclid || submission.metadata.fbclid) && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Marketing Attribution</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {submission.metadata.utmSource && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="font-medium text-blue-900">Source:</span>
                        <span className="ml-2 text-blue-800">{submission.metadata.utmSource}</span>
                      </div>
                    )}
                    {submission.metadata.utmMedium && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <span className="font-medium text-green-900">Medium:</span>
                        <span className="ml-2 text-green-800">{submission.metadata.utmMedium}</span>
                      </div>
                    )}
                    {submission.metadata.utmCampaign && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <span className="font-medium text-purple-900">Campaign:</span>
                        <span className="ml-2 text-purple-800">{submission.metadata.utmCampaign}</span>
                      </div>
                    )}
                    {submission.metadata.utmTerm && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <span className="font-medium text-yellow-900">Term:</span>
                        <span className="ml-2 text-yellow-800">{submission.metadata.utmTerm}</span>
                      </div>
                    )}
                    {submission.metadata.utmContent && (
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <span className="font-medium text-pink-900">Content:</span>
                        <span className="ml-2 text-pink-800">{submission.metadata.utmContent}</span>
                      </div>
                    )}
                    {submission.metadata.gclid && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <span className="font-medium text-red-900">Google Ads:</span>
                        <span className="ml-2 text-red-800 font-mono text-xs">{submission.metadata.gclid.substring(0, 20)}...</span>
                      </div>
                    )}
                    {submission.metadata.fbclid && (
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <span className="font-medium text-indigo-900">Facebook Ads:</span>
                        <span className="ml-2 text-indigo-800 font-mono text-xs">{submission.metadata.fbclid.substring(0, 20)}...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Referrer Analysis */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🌐 Traffic Source Analysis</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Traffic Type:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${submission.metadata.isDirectTraffic ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {submission.metadata.isDirectTraffic ? '🔗 Direct Traffic' : '↩️ Referral Traffic'}
                    </span>
                  </div>
                  
                  {submission.metadata.referrer && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Full Referrer:</span>
                      <div className="mt-1 text-sm text-gray-600 break-all">{submission.metadata.referrer}</div>
                    </div>
                  )}
                  
                  {submission.metadata.referrerDomain && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Referrer Domain:</span>
                      <span className="ml-2 text-gray-900 font-mono">{submission.metadata.referrerDomain}</span>
                    </div>
                  )}
                  
                  {submission.metadata.currentPath && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Form Submitted From:</span>
                      <span className="ml-2 text-gray-900 font-mono">{submission.metadata.currentPath}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* User Journey & Session */}
              {(submission.metadata.sessionId || submission.metadata.pageViews?.length > 0) && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">🛣️ User Journey & Session</h2>
                  <div className="space-y-4">
                    {submission.metadata.sessionId && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Session ID:</span>
                        <span className="ml-2 text-gray-600 font-mono text-sm">{submission.metadata.sessionId}</span>
                      </div>
                    )}
                    
                    {submission.metadata.sessionDuration && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium text-blue-900">Session Duration:</span>
                        <span className="ml-2 text-blue-800">{Math.floor(submission.metadata.sessionDuration / 60)}m {submission.metadata.sessionDuration % 60}s</span>
                      </div>
                    )}
                    
                    {submission.metadata.pageViews && submission.metadata.pageViews.length > 0 && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700 block mb-2">Page Journey ({submission.metadata.pageViews.length} pages):</span>
                        <div className="space-y-2">
                          {submission.metadata.pageViews.slice(-5).map((pageView: any, index: number) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-900 font-mono">{pageView.path || '/'}</span>
                              <span className="text-gray-500 text-xs">
                                {pageView.timestamp ? new Date(pageView.timestamp).toLocaleTimeString() : 'Unknown time'}
                              </span>
                            </div>
                          ))}
                          {submission.metadata.pageViews.length > 5 && (
                            <div className="text-xs text-gray-500 italic">
                              ... and {submission.metadata.pageViews.length - 5} more pages
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Device & Browser Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📱 Device & Browser Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {submission.metadata.language && (
                    <div>
                      <span className="font-medium text-gray-700">Language:</span>
                      <span className="ml-2 text-gray-600">{submission.metadata.language}</span>
                    </div>
                  )}
                  {submission.metadata.platform && (
                    <div>
                      <span className="font-medium text-gray-700">Platform:</span>
                      <span className="ml-2 text-gray-600">{submission.metadata.platform}</span>
                    </div>
                  )}
                  {submission.metadata.screenResolution && (
                    <div>
                      <span className="font-medium text-gray-700">Screen:</span>
                      <span className="ml-2 text-gray-600">{submission.metadata.screenResolution}</span>
                    </div>
                  )}
                  {submission.metadata.viewportSize && (
                    <div>
                      <span className="font-medium text-gray-700">Viewport:</span>
                      <span className="ml-2 text-gray-600">{submission.metadata.viewportSize}</span>
                    </div>
                  )}
                  {submission.metadata.ip && (
                    <div>
                      <span className="font-medium text-gray-700">IP Address:</span>
                      <span className="ml-2 text-gray-600">{submission.metadata.ip}</span>
                    </div>
                  )}
                </div>
                
                {submission.metadata.userAgent && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">User Agent:</span>
                    <div className="mt-1 text-xs text-gray-600 break-all">{submission.metadata.userAgent}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Assignment */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Management</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {currentStatus && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.color}`}>
                      Current: {currentStatus.label}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
                {submission.assignedUser && (
                  <div className="mt-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="font-medium">Currently assigned to:</span> {submission.assignedUser.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internal Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white placeholder-gray-500"
                  placeholder="Add internal notes about this submission..."
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href={`mailto:${submission.email}?subject=Re: Your inquiry&body=Hi ${submission.name},`}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center block"
              >
                Reply via Email
              </a>
              {submission.phone && (
                <a
                  href={`tel:${submission.phone}`}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center block"
                >
                  Call Phone
                </a>
              )}
            </div>
          </div>

          {/* Submission Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Form Type:</span>
                <span className="ml-2 text-gray-600 capitalize">{submission.formType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Submitted:</span>
                <span className="ml-2 text-gray-600">
                  {format(new Date(submission.createdAt), 'PPpp')}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Updated:</span>
                <span className="ml-2 text-gray-600">
                  {format(new Date(submission.updatedAt), 'PPpp')}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Reference ID:</span>
                <span className="ml-2 text-gray-900 font-mono font-semibold">
                  {submission.id.substring(0, 8).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Full ID:</span>
                <span className="ml-2 text-gray-600 font-mono text-xs">
                  {submission.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}