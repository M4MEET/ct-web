'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ComposedChart } from 'recharts';

interface VisitorAnalytics {
  summary: {
    uniqueVisitors: number;
    totalPageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
    timeframe: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
  timeSeries: Array<{
    date: string;
    visitors: number;
    pageViews: number;
    devices: { [key: string]: number };
  }>;
  demographics: {
    devices: Array<{ device: string; count: number; percentage: number }>;
    browsers: Array<{ browser: string; count: number; percentage: number }>;
    operatingSystems: Array<{ os: string; count: number; percentage: number }>;
    countries: Array<{ country: string; count: number; percentage: number }>;
  };
  content: {
    topPages: Array<{
      path: string;
      views: number;
      visitors: number;
      avgDuration: number;
    }>;
    hourlyDistribution: Array<{
      hour: number;
      views: number;
      visitors: number;
    }>;
  };
}

const DEVICE_COLORS = {
  Desktop: '#3B82F6',
  Mobile: '#10B981', 
  Tablet: '#F59E0B'
};

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

function TimeframeSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const options = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
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

function DeviceFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const options = [
    { value: '', label: 'All Devices' },
    { value: 'Desktop', label: 'Desktop' },
    { value: 'Mobile', label: 'Mobile' },
    { value: 'Tablet', label: 'Tablet' }
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
    <div className="group relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 hover:border-blue-200">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
            <span className="text-xl text-blue-600">{icon}</span>
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
        
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 tracking-wide uppercase">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {change !== undefined && (
            <p className="text-xs text-gray-500 mt-1">vs previous period</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DeviceBreakdownChart({ data }: { data: Array<{ device: string; count: number; percentage: number }> }) {
  return (
    <div className="group bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:shadow-orange-50/50 transition-all duration-300 hover:border-orange-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Device Breakdown</h3>
          <p className="text-sm text-gray-600">Visitor distribution by device type</p>
        </div>
        <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-300">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="count"
              nameKey="device"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={DEVICE_COLORS[entry.device as keyof typeof DEVICE_COLORS] || CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Visitors']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={item.device} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: DEVICE_COLORS[item.device as keyof typeof DEVICE_COLORS] || CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="text-sm font-medium text-gray-900">{item.device}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
              <span className="text-xs text-gray-500 ml-1">({item.count.toLocaleString()})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HourlyDistributionChart({ data }: { data: Array<{ hour: number; views: number; visitors: number }> }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">24-Hour Traffic Pattern</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hour" 
              tickFormatter={(hour) => `${hour}:00`}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              labelFormatter={(hour) => `${hour}:00 - ${hour + 1}:00`}
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
  );
}

function TopPagesTable({ data }: { data: Array<{ path: string; views: number; visitors: number; avgDuration: number }> }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Duration</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((page, index) => (
              <tr key={page.path} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {page.path}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {page.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {page.visitors.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.floor(page.avgDuration / 60)}m {page.avgDuration % 60}s
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BrowserOSCharts({ browsers, operatingSystems }: { 
  browsers: Array<{ browser: string; count: number; percentage: number }>; 
  operatingSystems: Array<{ os: string; count: number; percentage: number }>;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Browsers</h3>
        <div className="space-y-3">
          {browsers.map((browser, index) => (
            <div key={browser.browser} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span className="text-sm font-medium text-gray-900">{browser.browser}</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${browser.percentage}%`,
                      backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">{browser.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Systems</h3>
        <div className="space-y-3">
          {operatingSystems.map((os, index) => (
            <div key={os.os} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span className="text-sm font-medium text-gray-900">{os.os}</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${os.percentage}%`,
                      backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">{os.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VisitorAnalyticsPage() {
  const [data, setData] = useState<VisitorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');
  const [deviceFilter, setDeviceFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ timeframe });
        if (deviceFilter) params.append('device', deviceFilter);
        
        const response = await fetch(`/api/analytics/visitors?${params}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch visitor analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeframe, deviceFilter]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Visitor Analytics</h1>
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
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Visitor Analytics</h1>
          <p className="text-gray-700 font-medium">Track and understand your website visitors behavior</p>
        </div>
        <div className="flex space-x-3">
          <DeviceFilter value={deviceFilter} onChange={setDeviceFilter} />
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Unique Visitors"
          value={data.summary.uniqueVisitors}
          icon="👥"
          subtitle="Total unique sessions"
        />
        <MetricCard
          title="Page Views"
          value={data.summary.totalPageViews}
          icon="📄"
          subtitle="Total page visits"
        />
        <MetricCard
          title="Avg. Session Duration"
          value={`${Math.floor(data.summary.avgSessionDuration / 60)}m ${data.summary.avgSessionDuration % 60}s`}
          icon="⏱️"
          subtitle="Average time on site"
        />
        <MetricCard
          title="Bounce Rate"
          value={`${data.summary.bounceRate}%`}
          icon="🔄"
          subtitle="Single page visits"
        />
      </div>

      {/* Visitor Trends */}
      <div className="group bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:shadow-blue-50/50 transition-all duration-300 hover:border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Visitor Trends</h3>
            <p className="text-sm text-gray-600">Track visitor patterns over time</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
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
                formatter={(value: number, name: string) => [
                  value.toLocaleString(), 
                  name === 'visitors' ? 'Unique Visitors' : 'Page Views'
                ]}
              />
              <Area yAxisId="left" type="monotone" dataKey="visitors" stackId="1" stroke="#3B82F6" fill="#3B82F6" opacity={0.8} />
              <Area yAxisId="right" type="monotone" dataKey="pageViews" stackId="2" stroke="#10B981" fill="#10B981" opacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Breakdown and Hourly Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceBreakdownChart data={data.demographics.devices} />
        <HourlyDistributionChart data={data.content.hourlyDistribution} />
      </div>

      {/* Browser and OS Analysis */}
      <BrowserOSCharts 
        browsers={data.demographics.browsers}
        operatingSystems={data.demographics.operatingSystems}
      />

      {/* Top Countries */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.demographics.countries.map((country, index) => (
            <div key={country.country} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{country.country}</p>
                <p className="text-sm text-gray-500">{country.percentage}% of traffic</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg text-gray-900">{country.count.toLocaleString()}</p>
                <p className="text-sm text-gray-500">visitors</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Pages */}
      <TopPagesTable data={data.content.topPages} />
    </div>
  );
}