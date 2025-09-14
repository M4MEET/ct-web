import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { auth } from '@/lib/auth';
import { startOfDay, subDays, subMonths, format, parseISO } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const timeframe = url.searchParams.get('timeframe') || '30d';
    const formType = url.searchParams.get('formType');

    // Calculate date ranges
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case '6m':
        startDate = subMonths(now, 6);
        break;
      case '1y':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subDays(now, 30);
    }

    // Build where clause
    const whereClause: any = {
      createdAt: { gte: startDate }
    };

    if (formType) {
      whereClause.formType = formType;
    }

    const [
      submissionsByFormType,
      submissionsByStatus,
      topServices,
      budgetDistribution,
      totalSubmissions
    ] = await Promise.all([
      // Submissions by form type
      prisma.formSubmission.groupBy({
        by: ['formType'],
        _count: { id: true },
        where: whereClause,
        orderBy: { _count: { id: 'desc' } }
      }),

      // Submissions by status with percentages
      prisma.formSubmission.groupBy({
        by: ['status'],
        _count: { id: true },
        where: whereClause
      }),

      // Top requested services
      prisma.formSubmission.groupBy({
        by: ['service'],
        _count: { id: true },
        where: {
          ...whereClause,
          service: { not: null }
        },
        orderBy: { _count: { id: 'desc' } },
        take: 10
      }),

      // Budget distribution
      prisma.formSubmission.groupBy({
        by: ['budget'],
        _count: { id: true },
        where: {
          ...whereClause,
          budget: { not: null }
        },
        orderBy: { _count: { id: 'desc' } }
      }),

      // Total submissions count
      prisma.formSubmission.count({
        where: whereClause
      })
    ]);

    // Get daily trend using Prisma aggregation
    const dailySubmissions = await prisma.formSubmission.findMany({
      where: whereClause,
      select: {
        createdAt: true,
        status: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Process daily data
    const dailyData = dailySubmissions.reduce((acc: any, submission) => {
      const date = submission.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { submissions: 0, responded: 0 };
      }
      acc[date].submissions++;
      if (submission.status === 'responded') {
        acc[date].responded++;
      }
      return acc;
    }, {});

    const submissionsByDay = Object.entries(dailyData).map(([date, data]: [string, any]) => ({
      date,
      submissions: data.submissions,
      responded: data.responded
    }));

    // Mock geographic and source data for now
    const submissionsByCountry = [
      { country: 'Germany', count: Math.floor(totalSubmissions * 0.4) },
      { country: 'United States', count: Math.floor(totalSubmissions * 0.3) },
      { country: 'United Kingdom', count: Math.floor(totalSubmissions * 0.2) },
      { country: 'France', count: Math.floor(totalSubmissions * 0.1) }
    ];

    const submissionsByReferrer = [
      { source: 'Google', count: Math.floor(totalSubmissions * 0.5) },
      { source: 'Direct', count: Math.floor(totalSubmissions * 0.3) },
      { source: 'LinkedIn', count: Math.floor(totalSubmissions * 0.15) },
      { source: 'Other', count: Math.floor(totalSubmissions * 0.05) }
    ];

    // Mock funnel data
    const conversionFunnel = [
      { stage: 'Form Views', count: totalSubmissions * 3, percentage: 100 },
      { stage: 'Form Started', count: totalSubmissions * 2, percentage: 67 },
      { stage: 'Form Completed', count: totalSubmissions, percentage: 33 }
    ];

    // Calculate average response time from actual data
    const respondedSubmissions = await prisma.formSubmission.findMany({
      where: {
        ...whereClause,
        status: { in: ['responded', 'archived'] }
      },
      select: {
        createdAt: true,
        updatedAt: true
      }
    });

    let avgResponseHours = 0;
    if (respondedSubmissions.length > 0) {
      const totalHours = respondedSubmissions.reduce((sum, submission) => {
        const hours = (submission.updatedAt.getTime() - submission.createdAt.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      avgResponseHours = totalHours / respondedSubmissions.length;
    }

    const averageResponseTime = [{ avgResponseHours }];

    // Process the data
    const trendData = submissionsByDay.map(item => ({
      date: format(new Date(item.date), 'MMM dd'),
      submissions: item.submissions,
      responded: item.responded,
      responseRate: item.submissions > 0 ? Math.round((item.responded / item.submissions) * 100) : 0
    }));

    const formTypeData = submissionsByFormType.map(item => ({
      formType: item.formType,
      count: item._count.id,
      percentage: totalSubmissions > 0 ? Math.round((item._count.id / totalSubmissions) * 100) : 0
    }));

    const statusData = submissionsByStatus.map(item => ({
      status: item.status,
      count: item._count.id,
      percentage: totalSubmissions > 0 ? Math.round((item._count.id / totalSubmissions) * 100) : 0
    }));

    const countryData = submissionsByCountry.map(item => ({
      country: item.country || 'Unknown',
      count: item.count
    }));

    const sourceData = submissionsByReferrer.map(item => ({
      source: item.source,
      count: item.count,
      percentage: totalSubmissions > 0 ? Math.round((item.count / totalSubmissions) * 100) : 0
    }));

    const funnelData = conversionFunnel.map(item => ({
      stage: item.stage,
      count: item.count,
      percentage: item.percentage
    }));

    const responseMetrics = {
      averageResponseTime: Math.round(avgResponseHours * 100) / 100,
      responseTimeUnit: 'hours'
    };

    const serviceData = topServices.map(item => ({
      service: item.service || 'Not specified',
      count: item._count.id
    }));

    const budgetData = budgetDistribution.map(item => ({
      budget: item.budget || 'Not specified',
      count: item._count.id
    }));

    return NextResponse.json({
      summary: {
        totalSubmissions,
        timeframe,
        dateRange: {
          start: startDate.toISOString(),
          end: now.toISOString()
        }
      },
      trends: {
        daily: trendData,
        byFormType: formTypeData,
        byStatus: statusData
      },
      demographics: {
        byCountry: countryData,
        bySource: sourceData
      },
      conversion: {
        funnel: funnelData,
        responseMetrics
      },
      insights: {
        topServices: serviceData,
        budgetDistribution: budgetData
      }
    });

  } catch (error) {
    console.error('Form analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form analytics' },
      { status: 500 }
    );
  }
}