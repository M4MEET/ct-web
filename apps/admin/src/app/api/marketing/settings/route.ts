import { NextRequest, NextResponse } from 'next/server';

interface MarketingSettings {
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

const defaultSettings: MarketingSettings = {
  enableMarketing: true,
  googleAdsAccountId: '',
  googleAdsApiKey: '',
  googleAnalyticsId: 'G-XXXXXXXXXX',
  facebookPixelId: '',
  enableCampaignTracking: true,
  defaultCampaignBudget: '1000',
  marketingEmail: 'marketing@codexterminal.com',
  enableConversionTracking: true,
  conversionGoals: ['Contact Form', 'Newsletter Signup', 'Service Inquiry'],
};

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching marketing settings');
    
    // In a real app, you'd fetch from database
    // For now, return mock data
    
    return NextResponse.json({
      success: true,
      data: defaultSettings
    });
  } catch (error) {
    console.error('Marketing settings fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch marketing settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Updating marketing settings:', body);

    // In a real app, you'd save to database
    // For now, just return success
    
    return NextResponse.json({
      success: true,
      message: 'Marketing settings updated successfully',
      data: body
    });
  } catch (error) {
    console.error('Marketing settings update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update marketing settings' },
      { status: 500 }
    );
  }
}