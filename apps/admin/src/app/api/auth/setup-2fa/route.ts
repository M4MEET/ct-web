import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import { auth } from '@/lib/auth';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate secret for TOTP
    const secret = speakeasy.generateSecret({
      name: `CodeX Terminal (${user.email})`,
      issuer: 'CodeX Terminal',
      length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Store temporary secret (not activated yet)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorEnabled: false, // Will be enabled after verification
      },
    });

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntry: secret.base32,
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to set up 2FA' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { totpCode } = await request.json();

    if (!totpCode) {
      return NextResponse.json(
        { error: 'TOTP code is required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: 'No 2FA setup found. Please start the setup process again.' },
        { status: 400 }
      );
    }

    // Verify the TOTP code
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: totpCode,
      window: 2,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid TOTP code. Please try again.' },
        { status: 400 }
      );
    }

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );

    // Enable 2FA and store backup codes
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: true,
        backupCodes: JSON.stringify(backupCodes),
      },
    });

    return NextResponse.json({
      message: '2FA has been successfully enabled',
      backupCodes,
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify 2FA' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required to disable 2FA' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 400 }
      );
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: null,
      },
    });

    return NextResponse.json({
      message: '2FA has been successfully disabled',
    });
  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 }
    );
  }
}