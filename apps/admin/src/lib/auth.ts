import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@codex/database';
import bcrypt from 'bcryptjs';
import { RoleName } from '@codex/database';

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required');
}

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        totpCode: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Domain restriction - only allow @codexterminal.com emails
        if (!credentials.email.endsWith('@codexterminal.com')) {
          throw new Error('Only @codexterminal.com emails are allowed');
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.password) {
          throw new Error('User account is not set up for password authentication');
        }

        if (!user.isActive) {
          throw new Error('Account is deactivated');
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before signing in');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        // If 2FA is enabled, verify TOTP code
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          if (!credentials.totpCode) {
            throw new Error('2FA code is required');
          }

          const speakeasy = require('speakeasy');
          const isValidTotp = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: credentials.totpCode,
            window: 2, // Allow 2 time windows (60 seconds)
          });

          if (!isValidTotp) {
            throw new Error('Invalid 2FA code');
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'AUTHOR';
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as RoleName;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`);
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Type augmentation for session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role: RoleName;
    };
  }
  
  interface User {
    role: RoleName;
  }
}