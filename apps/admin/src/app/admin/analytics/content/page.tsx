'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, AreaChart, Area } from 'recharts';

interface ContentAnalytics {
  summary: {
    totalViews: number;
    uniqueVisitors: number;
    totalPages: number;
    avgSessionDuration: number;
    totalConversions: number;
    overallConversionRate: number;
    timeframe: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    uniqueVisitors: number;
    avgDuration: number;
    bounceRate: number;
    conversions: number;
    conversionRate: number;
    countries: string[];
    topDevice: string;
    topReferrer: string;
    engagementScore: number;
  }>;
  contentTypes: Array<{
    type: string;
    views: number;
    pages: number;
    conversions: number;
    avgViewsPerPage: number;
    conversionRate: number;
  }>;
  trends: {
    daily: Array<{
      date: string;
      views: number;
      visitors: number;
    }>;
  };
  insights: {
    mostEngaging: Array<{
      path: string;
      title: string;
      engagementScore: number;
      avgDuration: number;
      bounceRate: number;
    }>;
    highestConverting: Array<{
      path: string;
      title: string;
      conversionRate: number;
      conversions: number;
    }>;
    needsImprovement: Array<{
      path: string;
      title: string;
      bounceRate: number;
      avgDuration: number;
      views: number;
    }>;
  };
}

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

function TimeframeSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const options = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' }
  ];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
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

function MetricCard({ title, value, subtitle, icon, change }: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  icon: string; 
  change?: number;
}) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:shadow-purple-50 transition-all duration-300 hover:border-purple-200">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-300">
            <span className="text-xl text-purple-600">{icon}</span>
          </div>
          {change !== undefined && (
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              change >= 0 
                ? 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100' 
                : 'bg-red-50 text-red-700 group-hover:bg-red-100'
            } transition-colors duration-300`}>
              <span className="text-sm mr-1">{change >= 0 ? '↗' : '↘'}</span>
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2 tracking-wide uppercase">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function TopPagesTable({ pages }: { pages: ContentAnalytics['topPages'] }) {
  const [sortBy, setSortBy] = useState<'views' | 'conversions' | 'engagement'>('views');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedPages = [...pages].sort((a, b) => {
    let aValue = a[sortBy === 'engagement' ? 'engagementScore' : sortBy];
    let bValue = b[sortBy === 'engagement' ? 'engagementScore' : sortBy];
    
    if (sortOrder === 'desc') {
      return bValue - aValue;
    }
    return aValue - bValue;
  });

  const handleSort = (column: 'views' | 'conversions' | 'engagement') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('views')}
              >
                Views {sortBy === 'views' && (sortOrder === 'desc' ? '↓' : '↑')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bounce Rate</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('conversions')}
              >
                Conversions {sortBy === 'conversions' && (sortOrder === 'desc' ? '↓' : '↑')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('engagement')}
              >
                Engagement {sortBy === 'engagement' && (sortOrder === 'desc' ? '↓' : '↑')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPages.slice(0, 15).map((page, index) => (
              <tr key={page.path} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-xs" title={page.title}>
                      {page.title}
                    </p>
                    <p className="text-gray-500 text-xs truncate max-w-xs" title={page.path}>
                      {page.path}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {page.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {page.uniqueVisitors.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.floor(page.avgDuration / 60)}m {page.avgDuration % 60}s
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`${page.bounceRate > 70 ? 'text-red-600' : page.bounceRate > 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {page.bounceRate}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div>
                    <span className="font-medium text-gray-900">{page.conversions}</span>
                    <span className="text-gray-500 ml-1">({page.conversionRate}%)</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <span className={`font-medium ${page.engagementScore > 5 ? 'text-green-600' : page.engagementScore > 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {page.engagementScore}
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                      <div 
                        className={`h-2 rounded-full ${page.engagementScore > 5 ? 'bg-green-500' : page.engagementScore > 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(page.engagementScore * 10, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContentTypeBreakdown({ data }: { data: ContentAnalytics['contentTypes'] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Type Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="views"
                nameKey="type"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Views']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <div>
                  <p className="font-medium text-gray-900">{item.type}</p>
                  <p className="text-sm text-gray-500">{item.pages} pages</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{item.views.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{item.avgViewsPerPage}/page</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightCards({ insights }: { insights: ContentAnalytics['insights'] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-green-600">🎯 Most Engaging</h3>
        <div className="space-y-3">
          {insights.mostEngaging.slice(0, 5).map((page, index) => (
            <div key={page.path} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900 truncate" title={page.title}>
                  {page.title}
                </p>
                <p className="text-xs text-gray-500 truncate" title={page.path}>
                  {page.path}
                </p>
              </div>
              <div className="text-right ml-2">
                <p className="font-semibold text-green-600">{page.engagementScore}</p>
                <p className="text-xs text-gray-500">{Math.floor(page.avgDuration / 60)}m</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">💰 Highest Converting</h3>
        <div className="space-y-3">
          {insights.highestConverting.slice(0, 5).map((page, index) => (
            <div key={page.path} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900 truncate" title={page.title}>
                  {page.title}
                </p>
                <p className="text-xs text-gray-500 truncate" title={page.path}>
                  {page.path}
                </p>
              </div>
              <div className="text-right ml-2">
                <p className="font-semibold text-blue-600">{page.conversionRate}%</p>
                <p className="text-xs text-gray-500">{page.conversions} conv</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Needs Improvement</h3>
        <div className="space-y-3">
          {insights.needsImprovement.slice(0, 5).map((page, index) => (
            <div key={page.path} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900 truncate" title={page.title}>
                  {page.title}
                </p>
                <p className="text-xs text-gray-500 truncate" title={page.path}>
                  {page.path}
                </p>
              </div>
              <div className="text-right ml-2">
                <p className="font-semibold text-red-600">{page.bounceRate}%</p>
                <p className="text-xs text-gray-500">{Math.floor(page.avgDuration / 60)}m</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ContentAnalyticsPage() {
  const [data, setData] = useState<ContentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ timeframe });
        const response = await fetch(`/api/analytics/content?${params}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch content analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Content Analytics</h1>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div>Error loading data</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Content Analytics</h1>
        <TimeframeSelector value={timeframe} onChange={setTimeframe} />
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Page Views"
          value={data.summary.totalViews}
          icon="👁️"
          subtitle={`${data.summary.totalPages} pages tracked`}
        />
        <MetricCard
          title="Unique Visitors"
          value={data.summary.uniqueVisitors}
          icon="👥"
          subtitle="Unique sessions"
        />
        <MetricCard
          title="Avg. Session Duration"
          value={`${Math.floor(data.summary.avgSessionDuration / 60)}m ${data.summary.avgSessionDuration % 60}s`}
          icon="⏱️"
          subtitle="Time spent per session"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.summary.overallConversionRate}%`}
          icon="🎯"
          subtitle={`${data.summary.totalConversions} total conversions`}
        />
      </div>

      {/* Traffic Trends */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Traffic Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.trends.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value.toLocaleString(), 
                  name === 'views' ? 'Page Views' : 'Unique Visitors'
                ]}
              />
              <Bar yAxisId="left" dataKey="views" fill="#3B82F6" opacity={0.7} />
              <Line yAxisId="right" type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content Type Performance and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentTypeBreakdown data={data.contentTypes} />
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-800">Best Performing Type</span>
              <span className="text-green-600 font-semibold">
                {data.contentTypes[0]?.type} ({data.contentTypes[0]?.avgViewsPerPage}/page)
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-800">Highest Converting Type</span>
              <span className="text-blue-600 font-semibold">
                {data.contentTypes.sort((a, b) => b.conversionRate - a.conversionRate)[0]?.type} 
                ({data.contentTypes.sort((a, b) => b.conversionRate - a.conversionRate)[0]?.conversionRate}%)
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-yellow-800">Most Engaging</span>
              <span className="text-yellow-600 font-semibold">
                {data.insights.mostEngaging[0]?.title.substring(0, 25)}...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <InsightCards insights={data.insights} />

      {/* Top Pages Table */}
      <TopPagesTable pages={data.topPages} />
    </div>
  );
}