import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@codex/database';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const SignUpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = SignUpSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Domain restriction - only allow @codexterminal.com emails
    if (!email.endsWith('@codexterminal.com')) {
      return NextResponse.json(
        { error: 'Only @codexterminal.com email addresses are allowed' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        verificationToken,
        role: 'AUTHOR', // Default role
        isActive: true,
      },
    });

    // TODO: Send verification email instead of logging sensitive data
    // In production, use an email service to send verification link
    console.log(`Account created for ${email}. Verification email would be sent in production.`);

    return NextResponse.json(
      {
        message: 'Account created successfully. Please check your email for verification instructions.',
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating your account' },
      { status: 500 }
    );
  }
}