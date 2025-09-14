'use client';

import { useState } from 'react';

interface CountryData {
  country: string;
  count: number;
  percentage: number;
  visitors?: number;
  conversions?: number;
  revenue?: number;
}

interface CountryMapProps {
  data: CountryData[];
  loading?: boolean;
  showMetrics?: 'visitors' | 'conversions' | 'revenue';
  title?: string;
}

const COUNTRY_CODES: { [key: string]: string } = {
  'United States': 'US',
  'Germany': 'DE',
  'United Kingdom': 'GB',
  'France': 'FR',
  'Canada': 'CA',
  'Australia': 'AU',
  'Japan': 'JP',
  'Brazil': 'BR',
  'India': 'IN',
  'China': 'CN',
  'Netherlands': 'NL',
  'Spain': 'ES',
  'Italy': 'IT',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Belgium': 'BE',
  'Poland': 'PL'
};

const FLAG_EMOJI: { [key: string]: string } = {
  'US': '🇺🇸',
  'DE': '🇩🇪', 
  'GB': '🇬🇧',
  'FR': '🇫🇷',
  'CA': '🇨🇦',
  'AU': '🇦🇺',
  'JP': '🇯🇵',
  'BR': '🇧🇷',
  'IN': '🇮🇳',
  'CN': '🇨🇳',
  'NL': '🇳🇱',
  'ES': '🇪🇸',
  'IT': '🇮🇹',
  'SE': '🇸🇪',
  'NO': '🇳🇴',
  'DK': '🇩🇰',
  'CH': '🇨🇭',
  'AT': '🇦🇹',
  'BE': '🇧🇪',
  'PL': '🇵🇱'
};

function getIntensityColor(value: number, maxValue: number): string {
  const intensity = value / maxValue;
  if (intensity > 0.8) return 'bg-blue-600';
  if (intensity > 0.6) return 'bg-blue-500';
  if (intensity > 0.4) return 'bg-blue-400';
  if (intensity > 0.2) return 'bg-blue-300';
  return 'bg-blue-200';
}

function MetricSelector({ 
  value, 
  onChange, 
  options 
}: { 
  value: string; 
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

export function CountryMap({ data, loading = false, showMetrics = 'visitors', title = "Top Countries by Visitors" }: CountryMapProps) {
  const [selectedMetric, setSelectedMetric] = useState(showMetrics);
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => {
    switch (selectedMetric) {
      case 'conversions': return item.conversions || 0;
      case 'revenue': return item.revenue || 0;
      default: return item.count;
    }
  }));

  const metricOptions = [
    { value: 'visitors', label: 'Visitors' },
    { value: 'conversions', label: 'Conversions' },
    { value: 'revenue', label: 'Revenue' }
  ];

  const getMetricValue = (item: CountryData) => {
    switch (selectedMetric) {
      case 'conversions': return item.conversions || 0;
      case 'revenue': return item.revenue || 0;
      default: return item.count;
    }
  };

  const formatMetricValue = (value: number) => {
    switch (selectedMetric) {
      case 'revenue': return `$${value.toLocaleString()}`;
      default: return value.toLocaleString();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <MetricSelector 
          value={selectedMetric} 
          onChange={setSelectedMetric}
          options={metricOptions}
        />
      </div>

      {/* Interactive World Map Visualization */}
      <div className="relative mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {data.slice(0, 12).map((country, index) => {
            const countryCode = COUNTRY_CODES[country.country];
            const flag = FLAG_EMOJI[countryCode];
            const metricValue = getMetricValue(country);
            const intensityClass = getIntensityColor(metricValue, maxValue);

            return (
              <div
                key={country.country}
                className={`${intensityClass} rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 text-white`}
                onMouseEnter={() => setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xl">{flag || '🌍'}</span>
                    <span className="font-medium text-xs text-white truncate">{country.country}</span>
                  </div>
                  <span className="text-xs bg-white bg-opacity-20 px-1.5 py-0.5 rounded text-center min-w-[24px]">
                    #{index + 1}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-lg font-bold text-white leading-tight">
                    {formatMetricValue(metricValue)}
                  </div>
                  <div className="text-xs text-white opacity-90">
                    {country.percentage}% of total
                  </div>
                  {selectedMetric !== 'visitors' && (
                    <div className="text-xs text-white opacity-75">
                      {country.count.toLocaleString()} visitors
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Tooltip */}
        {hoveredCountry && (
          <div className="absolute top-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm z-10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">
                {FLAG_EMOJI[COUNTRY_CODES[hoveredCountry.country]] || '🌍'}
              </span>
              <h4 className="font-semibold">{hoveredCountry.country}</h4>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Visitors:</span>
                <span className="font-semibold">{hoveredCountry.count.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Percentage:</span>
                <span className="font-semibold">{hoveredCountry.percentage}%</span>
              </div>
              {hoveredCountry.conversions && (
                <div className="flex justify-between">
                  <span>Conversions:</span>
                  <span className="font-semibold">{hoveredCountry.conversions.toLocaleString()}</span>
                </div>
              )}
              {hoveredCountry.revenue && (
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-semibold">${hoveredCountry.revenue.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Color Legend */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Color intensity represents {selectedMetric} volume</span>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Low</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
          </div>
          <span className="text-gray-500">High</span>
        </div>
      </div>

      {/* Detailed List */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Detailed Breakdown</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {data.map((country, index) => (
            <div key={country.country} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                <span className="text-xl">
                  {FLAG_EMOJI[COUNTRY_CODES[country.country]] || '🌍'}
                </span>
                <span className="font-medium text-gray-900">{country.country}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatMetricValue(getMetricValue(country))}
                </div>
                <div className="text-sm text-gray-500">
                  {country.percentage}% of total
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}