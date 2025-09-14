'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  roas: number;
  qualityScore: number;
  keywords: string[];
  adGroups: number;
  targetAudience: string;
  lastOptimized: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/analytics/campaigns?timeframe=30d');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.data.campaigns || []);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      toast.error('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClass = {
      'Active': 'bg-green-100 text-green-800',
      'Paused': 'bg-yellow-100 text-yellow-800',
      'Ended': 'bg-gray-100 text-gray-800',
      'Draft': 'bg-blue-100 text-blue-800'
    }[status] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
        {status}
      </span>
    );
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      'Google Ads': '🔍',
      'Facebook Ads': '📘',
      'LinkedIn Ads': '💼',
      'Twitter Ads': '🐦'
    };
    return icons[platform as keyof typeof icons] || '📊';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleToggleStatus = async (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    
    // Update local state immediately
    setCampaigns(campaigns.map(c => 
      c.id === campaignId ? { ...c, status: newStatus } : c
    ));

    toast.success(`Campaign ${newStatus.toLowerCase()}`);
  };

  const CampaignModal = ({ campaign, onClose }: { campaign: Campaign | null, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: campaign?.name || '',
      platform: campaign?.platform || 'Google Ads',
      budget: campaign?.budget || 1000,
      targetAudience: campaign?.targetAudience || '',
      keywords: campaign?.keywords?.join(', ') || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, you'd make an API call here
      toast.success(campaign ? 'Campaign updated successfully' : 'Campaign created successfully');
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {campaign ? 'Edit Campaign' : 'Create New Campaign'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="Google Ads">Google Ads</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="LinkedIn Ads">LinkedIn Ads</option>
                <option value="Twitter Ads">Twitter Ads</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget ($)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., Tech Companies, Startups"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords (comma-separated)
              </label>
              <textarea
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                rows={3}
                placeholder="software development, web development, custom apps"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {campaign ? 'Update' : 'Create'} Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Campaigns</h1>
          <p className="text-gray-600 mt-2">Manage and optimize your advertising campaigns across platforms</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{getPlatformIcon(campaign.platform)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{campaign.name}</h3>
                  <p className="text-sm text-gray-600">{campaign.platform}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(campaign.status)}
                <button
                  onClick={() => setEditingCampaign(campaign)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Edit campaign"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Budget</div>
                <div className="font-semibold text-gray-900">{formatCurrency(campaign.budget)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Spent</div>
                <div className="font-semibold text-gray-900">{formatCurrency(campaign.spent)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">ROAS</div>
                <div className="font-semibold text-green-600">{campaign.roas.toFixed(1)}x</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Conversions</div>
                <div className="font-semibold text-gray-900">{campaign.conversions}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <div className="text-gray-600">CTR</div>
                <div className="font-medium text-gray-900">{campaign.ctr.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-gray-600">CPC</div>
                <div className="font-medium text-gray-900">{formatCurrency(campaign.cpc)}</div>
              </div>
              <div>
                <div className="text-gray-600">Quality Score</div>
                <div className="font-medium text-gray-900">{campaign.qualityScore.toFixed(1)}/10</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Target: {campaign.targetAudience}
              </div>
              <button
                onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  campaign.status === 'Active'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {campaign.status === 'Active' ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CampaignModal 
          campaign={null} 
          onClose={() => setShowCreateModal(false)} 
        />
      )}

      {editingCampaign && (
        <CampaignModal 
          campaign={editingCampaign} 
          onClose={() => setEditingCampaign(null)} 
        />
      )}
    </div>
  );
}