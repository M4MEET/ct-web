'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

interface DashboardData {
  metrics: {
    totalSubmissions: number;
    submissionGrowth: number;
    totalUsers: number;
    totalPages: number;
    totalBlogPosts: number;
    totalServices: number;
    totalCaseStudies: number;
    // Marketing metrics
    totalAdSpend?: number;
    adSpendGrowth?: number;
    totalConversions?: number;
    conversionGrowth?: number;
    averageROAS?: number;
    roasGrowth?: number;
    activeCampaigns?: number;
  };
  charts: {
    submissionsTrend: { date: string; submissions: number }[];
    submissionsByStatus: { status: string; count: number }[];
    topReferrers: { referrer: string; count: number }[];
    deviceBreakdown: { device: string; count: number }[];
    // Marketing charts
    campaignPerformance?: { campaign: string; roas: number; spent: number }[];
    conversionTrend?: { date: string; conversions: number }[];
  };
  recentActivity: {
    id: string;
    type: string;
    title: string;
    description: string;
    status: string;
    timestamp: string;
    metadata: any;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function MetricCard({ 
  title, 
  value, 
  growth, 
  icon, 
  loading = false 
}: { 
  title: string; 
  value: number | string; 
  growth?: number; 
  icon: string; 
  loading?: boolean; 
}) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 hover:border-blue-200">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
            <span className="text-xl text-blue-600">{icon}</span>
          </div>
          {growth !== undefined && !loading && (
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              growth >= 0 
                ? 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100' 
                : 'bg-red-50 text-red-700 group-hover:bg-red-100'
            } transition-colors duration-300`}>
              <span className="text-sm mr-1">{growth >= 0 ? '↗' : '↘'}</span>
              <span>{Math.abs(growth)}%</span>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 tracking-wide uppercase">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {loading ? (
              <span className="animate-pulse bg-gray-200 rounded h-8 w-20 block"></span>
            ) : (
              typeof value === 'number' ? value.toLocaleString() : value
            )}
          </p>
          {growth !== undefined && !loading && (
            <p className="text-xs text-gray-500">vs previous period</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TimeframeSelector({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void; 
}) {
  const options = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'month', label: 'This month' }
  ];

  return (
    <div className="relative">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, campaignsResponse] = await Promise.all([
        fetch(`/api/analytics/dashboard?timeframe=${timeframe}`),
        fetch(`/api/analytics/campaigns?timeframe=${timeframe}`)
      ]);
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        
        // If campaigns response is successful, merge marketing data
        if (campaignsResponse.ok) {
          const campaignsData = await campaignsResponse.json();
          dashboardData.metrics = {
            ...dashboardData.metrics,
            totalAdSpend: campaignsData.data?.overview?.totalSpent,
            adSpendGrowth: 12.5, // Mock growth data
            totalConversions: campaignsData.data?.overview?.totalConversions,
            conversionGrowth: 8.3, // Mock growth data  
            averageROAS: campaignsData.data?.overview?.roas,
            roasGrowth: 15.2, // Mock growth data
            activeCampaigns: campaignsData.data?.campaigns?.filter((c: any) => c.status === 'Active')?.length || 0,
          };
        }
        
        setData(dashboardData);
      } else {
        console.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-700 text-sm font-medium">Welcome back! Here's what's happening with your site.</p>
        </div>
        <TimeframeSelector value={timeframe} onChange={setTimeframe} />
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Form Submissions"
          value={data?.metrics.totalSubmissions || 0}
          growth={data?.metrics.submissionGrowth}
          icon="📝"
          loading={loading}
        />
        <MetricCard
          title="Total Users"
          value={data?.metrics.totalUsers || 0}
          icon="👥"
          loading={loading}
        />
        <MetricCard
          title="Published Pages"
          value={data?.metrics.totalPages || 0}
          icon="📄"
          loading={loading}
        />
        <MetricCard
          title="Blog Posts"
          value={data?.metrics.totalBlogPosts || 0}
          icon="✍️"
          loading={loading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <MetricCard
          title="Services"
          value={data?.metrics.totalServices || 0}
          icon="🛠"
          loading={loading}
        />
        <MetricCard
          title="Case Studies"
          value={data?.metrics.totalCaseStudies || 0}
          icon="💼"
          loading={loading}
        />
      </div>

      {/* Marketing Metrics */}
      {(data?.metrics.totalAdSpend !== undefined || loading) && (
        <>
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">🚀</span>
              Marketing Performance
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Ad Spend"
              value={data?.metrics.totalAdSpend ? `$${data.metrics.totalAdSpend.toLocaleString()}` : '$0'}
              growth={data?.metrics.adSpendGrowth}
              icon="💰"
              loading={loading}
            />
            <MetricCard
              title="Conversions"
              value={data?.metrics.totalConversions || 0}
              growth={data?.metrics.conversionGrowth}
              icon="🎯"
              loading={loading}
            />
            <MetricCard
              title="Average ROAS"
              value={data?.metrics.averageROAS ? `${data.metrics.averageROAS.toFixed(1)}x` : '0x'}
              growth={data?.metrics.roasGrowth}
              icon="📈"
              loading={loading}
            />
            <MetricCard
              title="Active Campaigns"
              value={data?.metrics.activeCampaigns || 0}
              icon="📢"
              loading={loading}
            />
          </div>
        </>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submissions Trend */}
        <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-blue-50/50 transition-all duration-300 hover:border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Submissions Trend</h2>
              <p className="text-sm text-gray-600">Track form submissions over time</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-sm">Loading chart...</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.charts.submissionsTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Submissions by Status */}
        <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-emerald-50/50 transition-all duration-300 hover:border-emerald-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Submissions by Status</h2>
              <p className="text-sm text-gray-600">Distribution of submission statuses</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors duration-300">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
                <span className="text-sm">Loading chart...</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data?.charts.submissionsByStatus || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(data?.charts.submissionsByStatus || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Referrers */}
        <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-purple-50/50 transition-all duration-300 hover:border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Top Traffic Sources</h2>
              <p className="text-sm text-gray-600">Where your visitors come from</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-300">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                <span className="text-sm">Loading chart...</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.charts.topReferrers || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="referrer" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#8b5cf6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-orange-50/50 transition-all duration-300 hover:border-orange-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Device Breakdown</h2>
              <p className="text-sm text-gray-600">Desktop vs mobile vs tablet usage</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-300">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                <span className="text-sm">Loading chart...</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data?.charts.deviceBreakdown || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ device, count }) => `${device}: ${count}`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(data?.charts.deviceBreakdown || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300 hover:border-indigo-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Recent Activity</h2>
            <p className="text-sm text-gray-600">Latest actions and submissions</p>
          </div>
          <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-300">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
              <span className="text-sm">Loading recent activity...</span>
            </div>
          </div>
        ) : data?.recentActivity && data.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="group/item flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50/30 transition-all duration-200 hover:border-indigo-200">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full flex items-center justify-center group-hover/item:from-indigo-200 group-hover/item:to-blue-200 transition-colors duration-200">
                    <span className="text-indigo-600 text-sm">📝</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">{activity.title}</p>
                  <p className="text-sm text-gray-500 mb-3">{activity.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                      activity.status === 'unread' ? 'bg-red-100 text-red-700 group-hover/item:bg-red-200' :
                      activity.status === 'read' ? 'bg-yellow-100 text-yellow-700 group-hover/item:bg-yellow-200' :
                      activity.status === 'inProgress' ? 'bg-blue-100 text-blue-700 group-hover/item:bg-blue-200' :
                      activity.status === 'responded' ? 'bg-emerald-100 text-emerald-700 group-hover/item:bg-emerald-200' :
                      'bg-gray-100 text-gray-700 group-hover/item:bg-gray-200'
                    }`}>
                      {activity.status}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                  <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No recent activity to display</p>
            <p className="text-sm text-gray-400 mt-1">Activity will appear here as users interact with your site</p>
          </div>
        )}
      </div>
    </div>
  );
}