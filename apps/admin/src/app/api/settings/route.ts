import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { auth } from '@/lib/auth';

// Get settings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all settings
    const settings = await prisma.siteSetting.findMany();
    
    // Convert array of settings to object
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({ data: settingsObject });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// Update settings
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await request.json();

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { 
          value: typeof value === 'object' ? value : { value },
          updatedAt: new Date()
        },
        create: { 
          key, 
          value: typeof value === 'object' ? value : { value }
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}