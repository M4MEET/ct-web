'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Settings {
  notificationEmail: string;
  senderEmail: string;
  siteName: string;
  siteUrl: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  enableEmailNotifications: boolean;
  enableAutoReply: boolean;
  autoReplySubject: string;
  autoReplyMessage: string;
  // Marketing Configuration
  enableMarketing: boolean;
  googleAdsAccountId: string;
  googleAdsApiKey: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  enableCampaignTracking: boolean;
  defaultCampaignBudget: string;
  marketingEmail: string;
  enableConversionTracking: boolean;
  conversionGoals: string[];
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    notificationEmail: 'info@codexterminal.com',
    senderEmail: 'noreply@codexterminal.com',
    siteName: 'CodeX Terminal',
    siteUrl: 'https://codexterminal.com',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    enableEmailNotifications: true,
    enableAutoReply: true,
    autoReplySubject: 'Thank you for contacting CodeX Terminal',
    autoReplyMessage: 'We have received your message and will get back to you within 24 hours.',
    // Marketing defaults
    enableMarketing: true,
    googleAdsAccountId: '',
    googleAdsApiKey: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    enableCampaignTracking: true,
    defaultCampaignBudget: '1000',
    marketingEmail: 'marketing@codexterminal.com',
    enableConversionTracking: true,
    conversionGoals: ['Contact Form', 'Newsletter Signup', 'Service Inquiry'],
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [settingsResponse, marketingResponse] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/marketing/settings')
      ]);
      
      if (settingsResponse.ok) {
        const data = await settingsResponse.json();
        if (data.data) {
          setSettings(prev => ({ ...prev, ...data.data }));
        }
      }

      if (marketingResponse.ok) {
        const marketingData = await marketingResponse.json();
        if (marketingData.data) {
          setSettings(prev => ({ ...prev, ...marketingData.data }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { enableMarketing, googleAdsAccountId, googleAdsApiKey, googleAnalyticsId, facebookPixelId, enableCampaignTracking, defaultCampaignBudget, marketingEmail, enableConversionTracking, conversionGoals, ...generalSettings } = settings;
      
      const marketingSettings = {
        enableMarketing,
        googleAdsAccountId,
        googleAdsApiKey,
        googleAnalyticsId,
        facebookPixelId,
        enableCampaignTracking,
        defaultCampaignBudget,
        marketingEmail,
        enableConversionTracking,
        conversionGoals
      };

      const [settingsResponse, marketingResponse] = await Promise.all([
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(generalSettings),
        }),
        fetch('/api/marketing/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(marketingSettings),
        })
      ]);

      if (settingsResponse.ok && marketingResponse.ok) {
        toast.success('Settings saved successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure your site settings, email notifications, and marketing integrations</p>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {/* General Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site URL
              </label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableEmail"
                checked={settings.enableEmailNotifications}
                onChange={(e) => setSettings({ ...settings, enableEmailNotifications: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="enableEmail" className="text-sm font-medium text-gray-700">
                Enable email notifications for form submissions
              </label>
            </div>

            {settings.enableEmailNotifications && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notification Email Address
                    <span className="text-xs text-gray-500 ml-2">(Where to send form submissions)</span>
                  </label>
                  <input
                    type="email"
                    value={settings.notificationEmail}
                    onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                    placeholder="info@codexterminal.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sender Email Address
                    <span className="text-xs text-gray-500 ml-2">(From address for emails)</span>
                  </label>
                  <input
                    type="email"
                    value={settings.senderEmail}
                    onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                    placeholder="noreply@codexterminal.com"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* SMTP Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">SMTP Configuration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Host
              </label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Port
              </label>
              <input
                type="text"
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                placeholder="587"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Username
              </label>
              <input
                type="text"
                value={settings.smtpUser}
                onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Password
              </label>
              <input
                type="password"
                value={settings.smtpPass}
                onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Auto Reply Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Auto Reply Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableAutoReply"
                checked={settings.enableAutoReply}
                onChange={(e) => setSettings({ ...settings, enableAutoReply: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="enableAutoReply" className="text-sm font-medium text-gray-700">
                Send auto-reply to form submitters
              </label>
            </div>

            {settings.enableAutoReply && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auto Reply Subject
                  </label>
                  <input
                    type="text"
                    value={settings.autoReplySubject}
                    onChange={(e) => setSettings({ ...settings, autoReplySubject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auto Reply Message
                  </label>
                  <textarea
                    value={settings.autoReplyMessage}
                    onChange={(e) => setSettings({ ...settings, autoReplyMessage: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Marketing Configuration */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Marketing Configuration</h2>
          <div className="space-y-6">
            {/* Enable Marketing */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableMarketing"
                checked={settings.enableMarketing}
                onChange={(e) => setSettings({ ...settings, enableMarketing: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="enableMarketing" className="text-sm font-medium text-gray-700">
                Enable marketing analytics and campaign tracking
              </label>
            </div>

            {settings.enableMarketing && (
              <>
                {/* Google Ads Configuration */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Google Ads Integration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Ads Account ID
                      </label>
                      <input
                        type="text"
                        value={settings.googleAdsAccountId}
                        onChange={(e) => setSettings({ ...settings, googleAdsAccountId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                        placeholder="123-456-7890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Ads API Key
                      </label>
                      <input
                        type="password"
                        value={settings.googleAdsApiKey}
                        onChange={(e) => setSettings({ ...settings, googleAdsApiKey: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Analytics Configuration */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Analytics & Tracking</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        value={settings.googleAnalyticsId}
                        onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Facebook Pixel ID
                      </label>
                      <input
                        type="text"
                        value={settings.facebookPixelId}
                        onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                        placeholder="123456789012345"
                      />
                    </div>
                  </div>
                </div>

                {/* Campaign Settings */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Campaign Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="enableCampaignTracking"
                        checked={settings.enableCampaignTracking}
                        onChange={(e) => setSettings({ ...settings, enableCampaignTracking: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enableCampaignTracking" className="text-sm font-medium text-gray-700">
                        Enable campaign tracking and UTM parameters
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Default Campaign Budget ($)
                        </label>
                        <input
                          type="number"
                          value={settings.defaultCampaignBudget}
                          onChange={(e) => setSettings({ ...settings, defaultCampaignBudget: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                          placeholder="1000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Marketing Team Email
                        </label>
                        <input
                          type="email"
                          value={settings.marketingEmail}
                          onChange={(e) => setSettings({ ...settings, marketingEmail: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                          placeholder="marketing@codexterminal.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversion Tracking */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Conversion Tracking</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="enableConversionTracking"
                        checked={settings.enableConversionTracking}
                        onChange={(e) => setSettings({ ...settings, enableConversionTracking: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enableConversionTracking" className="text-sm font-medium text-gray-700">
                        Track conversion goals and revenue attribution
                      </label>
                    </div>

                    {settings.enableConversionTracking && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Conversion Goals
                        </label>
                        <div className="space-y-2">
                          {settings.conversionGoals.map((goal, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={goal}
                                onChange={(e) => {
                                  const newGoals = [...settings.conversionGoals];
                                  newGoals[index] = e.target.value;
                                  setSettings({ ...settings, conversionGoals: newGoals });
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                                placeholder="Enter conversion goal"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newGoals = settings.conversionGoals.filter((_, i) => i !== index);
                                  setSettings({ ...settings, conversionGoals: newGoals });
                                }}
                                className="px-2 py-2 text-red-600 hover:text-red-800 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setSettings({ 
                                ...settings, 
                                conversionGoals: [...settings.conversionGoals, '']
                              });
                            }}
                            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                          >
                            + Add Conversion Goal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}