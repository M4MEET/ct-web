import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    
    console.log('Using mock campaign data');
    
    // Mock marketing campaign data
    const mockData = {
      overview: {
        totalSpent: 12450.75,
        totalImpressions: 145220,
        totalClicks: 3240,
        totalConversions: 89,
        averageCPC: 3.84,
        averageCTR: 2.23,
        conversionRate: 2.75,
        costPerConversion: 139.90,
        roas: 3.8,
        qualityScore: 8.2
      },
      campaigns: [
        {
          id: '1',
          name: 'CodeX Terminal - Software Development Services',
          platform: 'Google Ads',
          status: 'Active',
          budget: 5000,
          spent: 4250.30,
          impressions: 58240,
          clicks: 1320,
          conversions: 38,
          ctr: 2.27,
          cpc: 3.22,
          conversionRate: 2.88,
          roas: 4.2,
          qualityScore: 8.5,
          keywords: ['software development', 'custom apps', 'web development'],
          adGroups: 3,
          targetAudience: 'Tech Companies, Startups',
          lastOptimized: '2024-01-07'
        },
        {
          id: '2',
          name: 'Web Development - Next.js Specialists',
          platform: 'Facebook Ads',
          status: 'Active',
          budget: 3000,
          spent: 2890.45,
          impressions: 42150,
          clicks: 890,
          conversions: 24,
          ctr: 2.11,
          cpc: 3.25,
          conversionRate: 2.70,
          roas: 3.8,
          qualityScore: 7.8,
          keywords: ['nextjs development', 'react development', 'frontend'],
          adGroups: 2,
          targetAudience: 'Business Owners, Marketing Teams',
          lastOptimized: '2024-01-06'
        },
        {
          id: '3',
          name: 'Terminal UI/UX Design Services',
          platform: 'LinkedIn Ads',
          status: 'Paused',
          budget: 2500,
          spent: 2310.00,
          impressions: 28830,
          clicks: 650,
          conversions: 15,
          ctr: 2.25,
          cpc: 3.55,
          conversionRate: 2.31,
          roas: 3.2,
          qualityScore: 7.2,
          keywords: ['ui design', 'ux design', 'terminal interface'],
          adGroups: 4,
          targetAudience: 'CTOs, Product Managers',
          lastOptimized: '2024-01-05'
        },
        {
          id: '4',
          name: 'Custom Software Solutions',
          platform: 'Google Ads',
          status: 'Active',
          budget: 4000,
          spent: 3000.00,
          impressions: 16000,
          clicks: 380,
          conversions: 12,
          ctr: 2.38,
          cpc: 7.89,
          conversionRate: 3.16,
          roas: 2.9,
          qualityScore: 6.8,
          keywords: ['custom software', 'enterprise solutions', 'api development'],
          adGroups: 5,
          targetAudience: 'Enterprise Companies',
          lastOptimized: '2024-01-04'
        }
      ],
      topChannels: [
        { channel: 'Google Ads', visitors: 2840, conversions: 68, revenue: 28560, cpc: 3.45, impressionShare: 78.5 },
        { channel: 'Facebook Ads', visitors: 1620, conversions: 32, revenue: 18240, cpc: 2.89, impressionShare: 65.2 },
        { channel: 'LinkedIn Ads', visitors: 890, conversions: 18, revenue: 12450, cpc: 4.12, impressionShare: 45.8 },
        { channel: 'Twitter Ads', visitors: 320, conversions: 5, revenue: 2890, cpc: 5.67, impressionShare: 23.1 }
      ],
      performanceOverTime: [
        { date: '2024-01-01', impressions: 12450, clicks: 280, conversions: 8, spent: 890.50, revenue: 3240 },
        { date: '2024-01-02', impressions: 13200, clicks: 295, conversions: 12, spent: 945.30, revenue: 4850 },
        { date: '2024-01-03', impressions: 11800, clicks: 265, conversions: 6, spent: 820.75, revenue: 2430 },
        { date: '2024-01-04', impressions: 14500, clicks: 320, conversions: 15, spent: 1050.25, revenue: 6075 },
        { date: '2024-01-05', impressions: 13850, clicks: 310, conversions: 11, spent: 980.60, revenue: 4455 },
        { date: '2024-01-06', impressions: 12650, clicks: 285, conversions: 9, spent: 890.45, revenue: 3645 },
        { date: '2024-01-07', impressions: 15200, clicks: 340, conversions: 18, spent: 1120.80, revenue: 7290 }
      ],
      countryPerformance: [
        { country: 'United States', visitors: 2840, conversions: 68, revenue: 28560, cpc: 3.22, percentage: 45.2 },
        { country: 'Germany', visitors: 1620, conversions: 32, revenue: 18240, cpc: 2.89, percentage: 25.8 },
        { country: 'United Kingdom', visitors: 890, conversions: 18, revenue: 12450, cpc: 4.12, percentage: 14.2 },
        { country: 'France', visitors: 520, conversions: 12, revenue: 8930, cpc: 3.78, percentage: 8.3 },
        { country: 'Canada', visitors: 380, conversions: 8, revenue: 6240, cpc: 4.23, percentage: 6.1 },
        { country: 'Australia', visitors: 290, conversions: 6, revenue: 4580, cpc: 3.95, percentage: 4.6 }
      ],
      keywordPerformance: [
        { keyword: 'software development', impressions: 18450, clicks: 420, conversions: 28, cpc: 4.25, qualityScore: 9.2 },
        { keyword: 'web development', impressions: 15200, clicks: 380, conversions: 22, cpc: 3.85, qualityScore: 8.7 },
        { keyword: 'custom apps', impressions: 12800, clicks: 295, conversions: 18, cpc: 4.50, qualityScore: 8.1 },
        { keyword: 'nextjs development', impressions: 9650, clicks: 240, conversions: 15, cpc: 3.95, qualityScore: 7.9 },
        { keyword: 'react development', impressions: 8200, clicks: 185, conversions: 12, cpc: 4.10, qualityScore: 7.5 }
      ],
      audienceInsights: [
        { segment: 'Tech Startups', visitors: 1840, conversions: 45, revenue: 18250, avgSessionDuration: '4:32' },
        { segment: 'Enterprise Companies', visitors: 1520, conversions: 32, revenue: 16800, avgSessionDuration: '5:18' },
        { segment: 'Small Businesses', visitors: 890, conversions: 18, revenue: 7200, avgSessionDuration: '3:45' },
        { segment: 'Freelancers', visitors: 520, conversions: 8, revenue: 2890, avgSessionDuration: '2:58' }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockData,
      timeframe
    });
  } catch (error) {
    console.error('Campaign analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaign analytics' },
      { status: 500 }
    );
  }
}