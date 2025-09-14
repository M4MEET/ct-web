import { NextRequest, NextResponse } from 'next/server';

interface TrackingEvent {
  event: string;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
  properties: {
    page?: string;
    campaign?: string;
    source?: string;
    medium?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    referrer?: string;
    userAgent?: string;
    ip?: string;
    country?: string;
    device?: string;
    browser?: string;
    os?: string;
    [key: string]: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackingEvent = await request.json();
    
    // Extract headers for additional tracking data
    const userAgent = request.headers.get('user-agent');
    const referer = request.headers.get('referer');
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    
    // Enhance tracking data
    const trackingData = {
      ...body,
      timestamp: body.timestamp || new Date().toISOString(),
      properties: {
        ...body.properties,
        userAgent: userAgent || body.properties.userAgent,
        referrer: referer || body.properties.referrer,
        ip: forwardedFor || realIp || body.properties.ip,
      }
    };

    console.log('Marketing tracking event:', {
      event: trackingData.event,
      timestamp: trackingData.timestamp,
      campaign: trackingData.properties.utm_campaign,
      source: trackingData.properties.utm_source,
      page: trackingData.properties.page
    });

    // In a real implementation, you would:
    // 1. Save to database (PageView, Event, or custom tracking table)
    // 2. Send to analytics services (Google Analytics, PostHog, etc.)
    // 3. Update campaign performance metrics
    // 4. Trigger conversion tracking if applicable

    // Example database save:
    // await prisma.trackingEvent.create({
    //   data: {
    //     event: trackingData.event,
    //     userId: trackingData.userId,
    //     sessionId: trackingData.sessionId,
    //     timestamp: new Date(trackingData.timestamp),
    //     properties: trackingData.properties,
    //     campaign: trackingData.properties.utm_campaign,
    //     source: trackingData.properties.utm_source,
    //     medium: trackingData.properties.utm_medium,
    //   }
    // });

    // Handle specific event types
    switch (trackingData.event) {
      case 'page_view':
        // Track page views for campaign attribution
        break;
      
      case 'form_submit':
        // Track conversions and attribute to campaigns
        break;
      
      case 'click_cta':
        // Track CTA clicks for campaign optimization
        break;
      
      case 'video_play':
        // Track video engagement
        break;
      
      case 'download':
        // Track downloads as conversions
        break;
        
      default:
        // Handle custom events
        break;
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

  } catch (error) {
    console.error('Marketing tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

// Handle GET requests for pixel tracking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const event = searchParams.get('event') || 'pixel_load';
    const campaign = searchParams.get('utm_campaign');
    const source = searchParams.get('utm_source');
    const medium = searchParams.get('utm_medium');

    // Track pixel load event
    const trackingData = {
      event,
      timestamp: new Date().toISOString(),
      properties: {
        utm_campaign: campaign,
        utm_source: source,
        utm_medium: medium,
        userAgent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      }
    };

    console.log('Pixel tracking event:', trackingData);

    // Return 1x1 transparent pixel
    const pixel = Buffer.from([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x21, 0xF9, 0x04,
      0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
    ]);

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Pixel tracking error:', error);
    
    // Still return a valid pixel even on error
    const pixel = Buffer.from([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x21, 0xF9, 0x04,
      0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3B
    ]);

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}