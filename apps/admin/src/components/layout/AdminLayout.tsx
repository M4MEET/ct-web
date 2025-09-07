'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { AdminNav } from './AdminNav';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AuthenticatedLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (status !== 'loading' && !session) {
      // Don't redirect if already on auth pages
      if (!pathname.startsWith('/auth')) {
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      }
    }
  }, [session, status, router, pathname]);

  // Show loading screen while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render admin layout if not authenticated (will redirect)
  if (!session && !pathname.startsWith('/auth')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  // If on auth pages, render without admin nav
  if (pathname.startsWith('/auth')) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // Render full admin layout for authenticated users
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SessionProvider>
      <AuthenticatedLayout>
        {children}
      </AuthenticatedLayout>
    </SessionProvider>
  );
}