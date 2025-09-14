'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Copy, Trash2, Key, Calendar, Eye, EyeOff } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions?: string;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export default function ApiKeysPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    permissions: 'read',
    expiresIn: '30', // days
  });

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/settings/api-keys');
      if (!response.ok) throw new Error('Failed to fetch API keys');
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    try {
      const expiresAt = formData.expiresIn !== 'never' 
        ? new Date(Date.now() + parseInt(formData.expiresIn) * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const response = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          permissions: formData.permissions,
          expiresAt,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate API key');
      
      const data = await response.json();
      setNewlyCreatedKey(data.key);
      setShowKeyModal(true);
      setShowModal(false);
      setFormData({ name: '', permissions: 'read', expiresIn: '30' });
      fetchApiKeys();
      toast.success('API key generated successfully');
    } catch (error) {
      toast.error('Failed to generate API key');
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/settings/api-keys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete API key');
      
      fetchApiKeys();
      toast.success('API key deleted successfully');
    } catch (error) {
      toast.error('Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const maskApiKey = (key: string) => {
    if (!key) return '';
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  };

  const getPermissionDisplay = (permission: string) => {
    switch (permission) {
      case 'read':
        return { icon: '🔍', label: 'Read Only', color: 'bg-blue-100 text-blue-800' };
      case 'write':
        return { icon: '✏️', label: 'Read & Write', color: 'bg-green-100 text-green-800' };
      case 'admin':
        return { icon: '🛡️', label: 'Full Access', color: 'bg-purple-100 text-purple-800' };
      default:
        return { icon: '🔍', label: 'Read Only', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Key className="h-6 w-6" />
                API Keys Management
              </h1>
              <p className="text-blue-100 mt-2">
                Manage API keys for external integrations and authentication
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Generate New Key
            </button>
          </div>
        </div>

        <div className="p-6">
          {apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
              <p className="text-gray-600 mb-6">Generate your first API key to get started</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Generate API Key
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      API Key
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Used
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {apiKeys.map((apiKey) => (
                    <tr key={apiKey.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{apiKey.name}</div>
                        <div className="text-xs text-gray-500">
                          Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-slate-100 text-slate-900 px-3 py-2 rounded-md font-mono border border-slate-200">
                            {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                            title={visibleKeys.has(apiKey.id) ? "Hide API key" : "Show API key"}
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                            title="Copy API key"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {(() => {
                          const permissionDisplay = getPermissionDisplay(apiKey.permissions || 'read');
                          return (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${permissionDisplay.color}`}>
                              <span className="mr-1">{permissionDisplay.icon}</span>
                              {permissionDisplay.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {apiKey.lastUsedAt 
                          ? new Date(apiKey.lastUsedAt).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {apiKey.expiresAt 
                          ? new Date(apiKey.expiresAt).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => deleteApiKey(apiKey.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                          title="Delete API key"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Generate API Key Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-xl">
              <h2 className="text-xl font-bold text-white">Generate New API Key</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 transition-colors"
                    placeholder="e.g., Production API Key"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissions
                  </label>
                  <select
                    value={formData.permissions}
                    onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <option value="read" className="text-gray-900 bg-white">🔍 Read Only</option>
                    <option value="write" className="text-gray-900 bg-white">✏️ Read & Write</option>
                    <option value="admin" className="text-gray-900 bg-white">🛡️ Full Access</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration
                  </label>
                  <select
                    value={formData.expiresIn}
                    onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <option value="7" className="text-gray-900 bg-white">⏰ 7 days</option>
                    <option value="30" className="text-gray-900 bg-white">📅 30 days</option>
                    <option value="90" className="text-gray-900 bg-white">📆 90 days</option>
                    <option value="365" className="text-gray-900 bg-white">🗓️ 1 year</option>
                    <option value="never" className="text-gray-900 bg-white">♾️ Never</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateApiKey}
                  disabled={!formData.name}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  Generate Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show New Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-lg w-full mx-4">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-xl">
              <h2 className="text-xl font-bold text-white">API Key Generated Successfully</h2>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Copy this API key now. You won't be able to see it again!
                </p>
              </div>
              <div className="bg-slate-100 rounded-lg p-4 mb-4 border border-slate-200">
                <code className="text-sm font-mono break-all text-slate-900 select-all">{newlyCreatedKey}</code>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    copyToClipboard(newlyCreatedKey);
                    setShowKeyModal(false);
                    setNewlyCreatedKey('');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}