'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area, ComposedChart
} from 'recharts';
import { CountryMap } from '@/components/analytics/CountryMap';

interface CampaignAnalyticsData {
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalSpend: number;
    totalRevenue: number;
    averageCPC: number;
    roas: number; // Return on Ad Spend
  };
  topCountries: {
    country: string;
    visitors: number;
    conversions: number;
    revenue: number;
    coordinates?: [number, number];
  }[];
  visitorAnalytics: {
    hourlyTraffic: { hour: string; visitors: number; conversions: number }[];
    deviceBreakdown: { device: string; count: number; percentage: number }[];
    browserStats: { browser: string; count: number; percentage: number }[];
  };
  topContent: {
    page: string;
    visitors: number;
    timeOnPage: number;
    bounceRate: number;
    conversions: number;
  }[];
  googleAds: {
    campaigns: {
      name: string;
      clicks: number;
      impressions: number;
      cpc: number;
      ctr: number;
      spend: number;
      conversions: number;
    }[];
    performance: { date: string; clicks: number; spend: number; conversions: number }[];
  };
  externalLinks: {
    domain: string;
    clicks: number;
    visitors: number;
    conversions: number;
    conversionRate: number;
  }[];
  topChannels: {
    channel: string;
    visitors: number;
    conversions: number;
    cost: number;
    roas: number;
  }[];
  featuredCampaigns: {
    id: string;
    name: string;
    platform: string;
    status: string;
    budget: number;
    spent: number;
    clicks: number;
    conversions: number;
    roas: number;
    startDate: string;
    endDate?: string;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend,
  icon,
  loading = false 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  trend?: number;
  icon: string;
  loading?: boolean; 
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '...' : typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && !loading && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
          {trend !== undefined && !loading && (
            <div className={`text-sm flex items-center mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend >= 0 ? '↗' : '↘'}</span>
              <span className="ml-1">{Math.abs(trend)}% vs last period</span>
            </div>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}


export default function CampaignsPage() {
  const [data, setData] = useState<CampaignAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockData: CampaignAnalyticsData = {
        summary: {
          totalCampaigns: 12,
          activeCampaigns: 8,
          totalSpend: 45750,
          totalRevenue: 234500,
          averageCPC: 2.45,
          roas: 5.12
        },
        topCountries: [
          { country: 'Germany', visitors: 12450, conversions: 245, revenue: 98500 },
          { country: 'United States', visitors: 9870, conversions: 198, revenue: 89200 },
          { country: 'United Kingdom', visitors: 6540, conversions: 132, revenue: 56300 },
          { country: 'France', visitors: 5430, conversions: 89, revenue: 34200 },
          { country: 'Netherlands', visitors: 3210, conversions: 67, revenue: 28900 }
        ],
        visitorAnalytics: {
          hourlyTraffic: Array.from({ length: 24 }, (_, i) => ({
            hour: `${i}:00`,
            visitors: Math.floor(Math.random() * 500) + 100,
            conversions: Math.floor(Math.random() * 20) + 2
          })),
          deviceBreakdown: [
            { device: 'Desktop', count: 15400, percentage: 58 },
            { device: 'Mobile', count: 8900, percentage: 33 },
            { device: 'Tablet', count: 2400, percentage: 9 }
          ],
          browserStats: [
            { browser: 'Chrome', count: 18500, percentage: 69 },
            { browser: 'Safari', count: 4200, percentage: 16 },
            { browser: 'Firefox', count: 2800, percentage: 10 },
            { browser: 'Edge', count: 1300, percentage: 5 }
          ]
        },
        topContent: [
          { page: '/', visitors: 18500, timeOnPage: 245, bounceRate: 23, conversions: 89 },
          { page: '/services', visitors: 12400, timeOnPage: 320, bounceRate: 18, conversions: 156 },
          { page: '/case-studies', visitors: 8900, timeOnPage: 420, bounceRate: 15, conversions: 67 },
          { page: '/contact', visitors: 6700, timeOnPage: 180, bounceRate: 12, conversions: 234 },
          { page: '/about', visitors: 4500, timeOnPage: 280, bounceRate: 28, conversions: 23 }
        ],
        googleAds: {
          campaigns: [
            { name: 'Web Development Services', clicks: 2450, impressions: 45600, cpc: 3.25, ctr: 5.4, spend: 7962, conversions: 89 },
            { name: 'Mobile App Development', clicks: 1890, impressions: 38900, cpc: 4.10, ctr: 4.9, spend: 7749, conversions: 67 },
            { name: 'Enterprise Software', clicks: 1560, impressions: 28700, cpc: 5.80, ctr: 5.4, spend: 9048, conversions: 45 },
            { name: 'AI & Machine Learning', clicks: 890, impressions: 15600, cpc: 6.50, ctr: 5.7, spend: 5785, conversions: 23 }
          ],
          performance: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            clicks: Math.floor(Math.random() * 300) + 50,
            spend: Math.floor(Math.random() * 1000) + 200,
            conversions: Math.floor(Math.random() * 20) + 2
          }))
        },
        externalLinks: [
          { domain: 'linkedin.com', clicks: 2450, visitors: 1890, conversions: 89, conversionRate: 4.7 },
          { domain: 'github.com', clicks: 1560, visitors: 1200, conversions: 34, conversionRate: 2.8 },
          { domain: 'twitter.com', clicks: 890, visitors: 670, conversions: 12, conversionRate: 1.8 },
          { domain: 'medium.com', clicks: 540, visitors: 420, conversions: 8, conversionRate: 1.9 }
        ],
        topChannels: [
          { channel: 'Google Ads', visitors: 15600, conversions: 234, cost: 12500, roas: 6.8 },
          { channel: 'Facebook Ads', visitors: 8900, conversions: 145, cost: 7800, roas: 4.2 },
          { channel: 'LinkedIn Ads', visitors: 4500, conversions: 89, cost: 5600, roas: 3.9 },
          { channel: 'Organic Search', visitors: 12400, conversions: 156, cost: 0, roas: 0 },
          { channel: 'Direct Traffic', visitors: 6700, conversions: 67, cost: 0, roas: 0 }
        ],
        featuredCampaigns: [
          {
            id: 'camp_001',
            name: 'Q4 Web Development Push',
            platform: 'Google Ads',
            status: 'active',
            budget: 15000,
            spent: 8900,
            clicks: 2890,
            conversions: 145,
            roas: 5.8,
            startDate: '2024-10-01',
            endDate: '2024-12-31'
          },
          {
            id: 'camp_002',
            name: 'Mobile App Awareness',
            platform: 'Facebook',
            status: 'active',
            budget: 8000,
            spent: 5600,
            clicks: 1560,
            conversions: 67,
            roas: 3.9,
            startDate: '2024-11-01',
            endDate: '2024-12-15'
          },
          {
            id: 'camp_003',
            name: 'Enterprise Solutions',
            platform: 'LinkedIn',
            status: 'paused',
            budget: 12000,
            spent: 3400,
            clicks: 890,
            conversions: 23,
            roas: 2.1,
            startDate: '2024-09-15',
            endDate: '2024-11-30'
          }
        ]
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Campaign analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, [timeframe]);

  if (!data && loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading marketing campaigns...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Campaigns</h1>
          <p className="text-gray-600 mt-2">Comprehensive campaign performance and visitor analytics</p>
        </div>
        <div className="flex space-x-4">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Link 
          href="/admin/analytics"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          📊 Analytics Overview
        </Link>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          🎯 Create Campaign
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <MetricCard
          title="Total Campaigns"
          value={data?.summary.totalCampaigns || 0}
          subtitle={`${data?.summary.activeCampaigns || 0} active`}
          icon="🎯"
          loading={loading}
        />
        <MetricCard
          title="Total Spend"
          value={data?.summary.totalSpend ? `$${data.summary.totalSpend.toLocaleString()}` : '$0'}
          trend={12}
          icon="💰"
          loading={loading}
        />
        <MetricCard
          title="Revenue"
          value={data?.summary.totalRevenue ? `$${data.summary.totalRevenue.toLocaleString()}` : '$0'}
          trend={8}
          icon="📈"
          loading={loading}
        />
        <MetricCard
          title="Average CPC"
          value={data?.summary.averageCPC ? `$${data.summary.averageCPC}` : '$0'}
          trend={-5}
          icon="💳"
          loading={loading}
        />
        <MetricCard
          title="ROAS"
          value={data?.summary.roas ? `${data.summary.roas}x` : '0x'}
          trend={15}
          icon="🔄"
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visitor Analytics - Hourly Traffic */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hourly Visitor Traffic</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data?.visitorAnalytics.hourlyTraffic || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="visitors" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              <Line type="monotone" dataKey="conversions" stroke="#ff7300" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Google Ads Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Google Ads Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.googleAds.performance || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clicks" stroke="#4285f4" strokeWidth={2} name="Clicks" />
              <Line type="monotone" dataKey="conversions" stroke="#34a853" strokeWidth={2} name="Conversions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data?.visitorAnalytics.deviceBreakdown || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ device, percentage }) => `${device}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {(data?.visitorAnalytics.deviceBreakdown || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Channels */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Marketing Channels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.topChannels || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visitors" fill="#8884d8" name="Visitors" />
              <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Countries Map & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CountryMap 
          data={data?.topCountries?.map(country => ({
            country: country.country,
            count: country.visitors,
            percentage: Math.round((country.visitors / (data?.topCountries?.reduce((sum, c) => sum + c.visitors, 0) || 1)) * 100),
            visitors: country.visitors,
            conversions: country.conversions,
            revenue: country.revenue
          })) || []} 
          loading={loading} 
          showMetrics="visitors"
          title="Top Countries by Campaign Performance"
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Content Pages</h2>
          <div className="space-y-4">
            {data?.topContent.slice(0, 5).map((content, index) => (
              <div key={content.page} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{content.page}</p>
                  <p className="text-sm text-gray-500">
                    {content.timeOnPage}s avg time • {content.bounceRate}% bounce rate
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{content.visitors.toLocaleString()}</p>
                  <p className="text-sm text-green-600">{content.conversions} conversions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google Ads Campaigns Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Google Ads Campaigns</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.googleAds.campaigns.map((campaign) => (
                <tr key={campaign.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.impressions.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${campaign.cpc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.ctr}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${campaign.spend.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{campaign.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* External Links & Featured Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">External Link Performance</h2>
          <div className="space-y-4">
            {data?.externalLinks.map((link) => (
              <div key={link.domain} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{link.domain}</p>
                  <p className="text-sm text-gray-500">
                    {link.clicks.toLocaleString()} clicks • {link.conversionRate}% conversion rate
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{link.visitors.toLocaleString()}</p>
                  <p className="text-sm text-green-600">{link.conversions} conversions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Campaigns</h2>
          <div className="space-y-4">
            {data?.featuredCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-500">{campaign.platform}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Budget</p>
                    <p className="font-medium text-gray-900">${campaign.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Spent</p>
                    <p className="font-medium text-gray-900">${campaign.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">ROAS</p>
                    <p className="font-medium text-gray-900">{campaign.roas}x</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Conversions</p>
                    <p className="font-medium text-green-600">{campaign.conversions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}