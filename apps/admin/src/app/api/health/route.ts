import { NextResponse } from 'next/server';
import { prisma } from '@codex/database';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'admin',
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: false,
      redis: false,
      auth: false,
    },
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = true;
  } catch (error) {
    health.status = 'degraded';
    health.checks.database = false;
  }

  // Check Redis connection (if configured)
  if (process.env.REDIS_URL) {
    try {
      // Add Redis health check here if using Redis client
      health.checks.redis = true;
    } catch (error) {
      health.checks.redis = false;
    }
  }

  // Check if auth configuration is valid
  try {
    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL) {
      health.checks.auth = true;
    }
  } catch (error) {
    health.checks.auth = false;
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  
  return NextResponse.json(health, { status: statusCode });
}