import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { RoleName } from '@codex/database';

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  providers: [
    GitHubProvider({
      clientId: process.env.OAUTH_GITHUB_ID || 'dummy',
      clientSecret: process.env.OAUTH_GITHUB_SECRET || 'dummy',
    }),
    GoogleProvider({
      clientId: process.env.OAUTH_GOOGLE_ID || 'dummy',
      clientSecret: process.env.OAUTH_GOOGLE_SECRET || 'dummy',
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'AUTHOR';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as RoleName;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
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