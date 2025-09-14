'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, FunnelChart, Funnel, LabelList
} from 'recharts';

interface FormAnalyticsData {
  summary: {
    totalSubmissions: number;
    timeframe: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
  trends: {
    daily: { date: string; submissions: number; responded: number; responseRate: number }[];
    byFormType: { formType: string; count: number; percentage: number }[];
    byStatus: { status: string; count: number; percentage: number }[];
  };
  demographics: {
    byCountry: { country: string; count: number }[];
    bySource: { source: string; count: number; percentage: number }[];
  };
  conversion: {
    funnel: { stage: string; count: number; percentage: number }[];
    responseMetrics: {
      averageResponseTime: number;
      responseTimeUnit: string;
    };
  };
  insights: {
    topServices: { service: string; count: number }[];
    budgetDistribution: { budget: string; count: number }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon,
  loading = false 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  icon?: string;
  loading?: boolean; 
}) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 hover:border-blue-200">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
            <span className="text-xl text-blue-600">{icon || '📊'}</span>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2 tracking-wide uppercase">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">
          {loading ? (
            <span className="animate-pulse bg-gray-200 rounded h-8 w-20 block"></span>
          ) : (
            typeof value === 'number' ? value.toLocaleString() : value
          )}
        </p>
        {subtitle && !loading && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
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
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' }
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

export default function AnalyticsPage() {
  const [data, setData] = useState<FormAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedFormType, setSelectedFormType] = useState<string>('');

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        timeframe: timeframe
      });
      
      if (selectedFormType) {
        params.append('formType', selectedFormType);
      }
      
      const response = await fetch(`/api/analytics/forms?${params}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      } else {
        console.error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Analytics data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe, selectedFormType]);

  const formTypes = data?.trends.byFormType.map(item => item.formType) || [];

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 Form Analytics</h1>
          <p className="text-gray-700 font-medium">Comprehensive insights into form submissions and user behavior</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <select 
              value={selectedFormType} 
              onChange={(e) => setSelectedFormType(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              <option value="">All Forms</option>
            {formTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Link 
          href="/admin/forms"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          📝 View All Submissions
        </Link>
        <Link 
          href="/admin/analytics/campaigns"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          🎯 Marketing Campaigns
        </Link>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Submissions"
          value={data?.summary.totalSubmissions || 0}
          subtitle={`${timeframe} period`}
          loading={loading}
        />
        <MetricCard
          title="Avg Response Time"
          value={data?.conversion.responseMetrics.averageResponseTime ? 
            `${Math.round(data.conversion.responseMetrics.averageResponseTime)} hrs` : 
            'N/A'}
          subtitle="Time to first response"
          loading={loading}
        />
        <MetricCard
          title="Response Rate"
          value={data?.trends.byStatus.find(s => s.status === 'responded')?.percentage || 0}
          subtitle="% of submissions responded to"
          loading={loading}
        />
        <MetricCard
          title="Top Source"
          value={data?.demographics.bySource[0]?.source || 'Direct'}
          subtitle={`${data?.demographics.bySource[0]?.count || 0} submissions`}
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submissions Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submissions Over Time</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-gray-500">Loading chart...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.trends.daily || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="Submissions"
                />
                <Line 
                  type="monotone" 
                  dataKey="responded" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Responded"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Form Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submissions by Form Type</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-gray-500">Loading chart...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.trends.byFormType || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ formType, percentage }) => `${formType}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(data?.trends.byFormType || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-gray-500">Loading chart...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.demographics.bySource || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Status</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-gray-500">Loading chart...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.trends.byStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) => `${status}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(data?.trends.byStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Services */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Requested Services</h2>
          {loading ? (
            <div className="text-gray-500">Loading services...</div>
          ) : (
            <div className="space-y-3">
              {data?.insights.topServices.slice(0, 5).map((service, index) => (
                <div key={service.service} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{service.service}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{
                          width: `${(service.count / (data.insights.topServices[0]?.count || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8">{service.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h2>
          {loading ? (
            <div className="text-gray-500">Loading countries...</div>
          ) : (
            <div className="space-y-3">
              {data?.demographics.byCountry.slice(0, 5).map((country, index) => (
                <div key={country.country} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{country.country}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{
                          width: `${(country.count / (data.demographics.byCountry[0]?.count || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8">{country.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h2>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">Loading funnel...</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {data?.conversion.funnel.map((stage, index) => (
              <div key={stage.stage} className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-2">{stage.stage}</h3>
                  <p className="text-3xl font-bold">{stage.count.toLocaleString()}</p>
                  <p className="text-sm opacity-90">{stage.percentage}%</p>
                </div>
                {index < data.conversion.funnel.length - 1 && (
                  <div className="flex justify-center mt-4">
                    <div className="text-2xl text-gray-400">↓</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}