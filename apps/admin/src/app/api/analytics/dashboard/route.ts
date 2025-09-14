import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { auth } from '@/lib/auth';
import { startOfDay, startOfWeek, startOfMonth, endOfMonth, subDays, subMonths, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const timeframe = url.searchParams.get('timeframe') || '30d';

    // Calculate date ranges
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;

    switch (timeframe) {
      case '7d':
        startDate = subDays(now, 7);
        previousStartDate = subDays(startDate, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        previousStartDate = subDays(startDate, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        previousStartDate = subDays(startDate, 90);
        break;
      case 'month':
        startDate = startOfMonth(now);
        previousStartDate = startOfMonth(subMonths(now, 1));
        break;
      default:
        startDate = subDays(now, 30);
        previousStartDate = subDays(startDate, 30);
    }

    // Parallel queries for dashboard metrics
    const [
      totalSubmissions,
      previousSubmissions,
      totalUsers,
      totalPages,
      totalBlogPosts,
      totalServices,
      totalCaseStudies,
      recentSubmissions,
      submissionsByStatus,
      submissionsTrend,
      topReferrers,
      deviceStats
    ] = await Promise.all([
      // Current period submissions
      prisma.formSubmission.count({
        where: { createdAt: { gte: startDate } }
      }),
      
      // Previous period submissions for comparison
      prisma.formSubmission.count({
        where: { 
          createdAt: { 
            gte: previousStartDate, 
            lt: startDate 
          } 
        }
      }),
      
      // Total counts
      prisma.user.count({ where: { isActive: true } }),
      prisma.page.count({ where: { status: 'published' } }),
      prisma.blogPost.count({ where: { status: 'published' } }),
      prisma.service.count({ where: { status: 'published' } }),
      prisma.caseStudy.count({ where: { status: 'published' } }),
      
      // Recent submissions
      prisma.formSubmission.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          formType: true,
          status: true,
          createdAt: true,
          company: true
        }
      }),
      
      // Submissions by status
      prisma.formSubmission.groupBy({
        by: ['status'],
        _count: { id: true },
        where: { createdAt: { gte: startDate } }
      }),
      
      // Get submissions for trend analysis
      prisma.formSubmission.findMany({
        where: { createdAt: { gte: startDate } },
        select: {
          createdAt: true,
          metadata: true
        },
        orderBy: { createdAt: 'asc' }
      }),
      
      // Mock data for referrers (will process from metadata)
      prisma.formSubmission.findMany({
        where: { 
          createdAt: { gte: startDate },
          metadata: { not: null }
        },
        select: {
          metadata: true
        }
      }),
      
      // Mock data for device stats (will process from metadata)
      prisma.formSubmission.findMany({
        where: { 
          createdAt: { gte: startDate },
          metadata: { not: null }
        },
        select: {
          metadata: true
        }
      })
    ]);

    // Calculate conversion rate and growth
    const conversionGrowth = previousSubmissions === 0 
      ? (totalSubmissions > 0 ? 100 : 0)
      : ((totalSubmissions - previousSubmissions) / previousSubmissions) * 100;

    // Process submissions trend data
    const dailyData = submissionsTrend.reduce((acc: any, submission: any) => {
      const date = submission.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    const trendData = Object.entries(dailyData).map(([date, count]) => ({
      date: format(new Date(date), 'MMM dd'),
      submissions: count as number
    })).slice(-14); // Last 14 days

    // Process status data
    const statusData = submissionsByStatus.map(item => ({
      status: item.status,
      count: item._count.id
    }));

    // Process referrer data from metadata
    const referrerCounts: { [key: string]: number } = {};
    topReferrers.forEach((submission: any) => {
      if (submission.metadata) {
        try {
          const metadata = typeof submission.metadata === 'string' 
            ? JSON.parse(submission.metadata) 
            : submission.metadata;
          
          let source = 'Direct';
          if (metadata.referrer) {
            if (metadata.referrer.includes('google')) source = 'Google';
            else if (metadata.referrer.includes('facebook')) source = 'Facebook';
            else if (metadata.referrer.includes('linkedin')) source = 'LinkedIn';
            else if (metadata.referrer.includes('twitter')) source = 'Twitter';
            else source = 'Other';
          }
          
          referrerCounts[source] = (referrerCounts[source] || 0) + 1;
        } catch (e) {
          referrerCounts['Direct'] = (referrerCounts['Direct'] || 0) + 1;
        }
      } else {
        referrerCounts['Direct'] = (referrerCounts['Direct'] || 0) + 1;
      }
    });

    const referrerData = Object.entries(referrerCounts).map(([referrer, count]) => ({
      referrer,
      count: count as number
    })).slice(0, 5);

    // Process device data from metadata
    const deviceCounts: { [key: string]: number } = { Desktop: 0, Mobile: 0, Tablet: 0 };
    deviceStats.forEach((submission: any) => {
      if (submission.metadata) {
        try {
          const metadata = typeof submission.metadata === 'string' 
            ? JSON.parse(submission.metadata) 
            : submission.metadata;
          
          const ua = metadata.userAgent || '';
          let deviceType = 'Desktop';
          if (/Mobile|Android|iPhone/.test(ua)) {
            deviceType = 'Mobile';
          } else if (/iPad/.test(ua)) {
            deviceType = 'Tablet';
          }
          
          deviceCounts[deviceType]++;
        } catch (e) {
          deviceCounts['Desktop']++;
        }
      } else {
        deviceCounts['Desktop']++;
      }
    });

    const deviceData = Object.entries(deviceCounts)
      .filter(([_, count]) => count > 0)
      .map(([device, count]) => ({
        device,
        count: count as number
      }));

    const dashboardData = {
      metrics: {
        totalSubmissions,
        submissionGrowth: Math.round(conversionGrowth * 100) / 100,
        totalUsers,
        totalPages,
        totalBlogPosts,
        totalServices,
        totalCaseStudies
      },
      charts: {
        submissionsTrend: trendData,
        submissionsByStatus: statusData,
        topReferrers: referrerData.slice(0, 5),
        deviceBreakdown: deviceData
      },
      recentActivity: recentSubmissions.map(submission => ({
        id: submission.id,
        type: 'form_submission',
        title: `New ${submission.formType} submission`,
        description: `${submission.name} from ${submission.company || 'Unknown'}`,
        status: submission.status,
        timestamp: submission.createdAt,
        metadata: {
          email: submission.email,
          formType: submission.formType
        }
      }))
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard analytics' },
      { status: 500 }
    );
  }
}