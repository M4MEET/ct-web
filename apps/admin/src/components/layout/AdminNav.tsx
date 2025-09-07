'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    permission: 'content.view' as const,
    icon: '📊',
  },
  {
    label: 'Pages',
    href: '/admin/pages',
    permission: 'content.view' as const,
    icon: '📄',
  },
  {
    label: 'Services',
    href: '/admin/services',
    permission: 'content.view' as const,
    icon: '🛠',
  },
  {
    label: 'Case Studies',
    href: '/admin/case-studies',
    permission: 'content.view' as const,
    icon: '💼',
  },
  {
    label: 'Blog Posts',
    href: '/admin/posts',
    permission: 'content.view' as const,
    icon: '✍️',
  },
  {
    label: 'Media',
    href: '/admin/media',
    permission: 'media.view' as const,
    icon: '🖼',
  },
  {
    label: 'Forms',
    href: '/admin/forms',
    permission: 'content.view' as const,
    icon: '📝',
  },
  {
    label: 'Users',
    href: '/admin/users',
    permission: 'users.view' as const,
    icon: '👥',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    permission: 'settings.view' as const,
    icon: '⚙️',
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Show all items for demo (no auth required)
  const visibleItems = navItems;
  
  const user = session?.user;
  const displayName = user?.name || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userRole = user?.role || 'AUTHOR';

  return (
    <nav className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-32 h-20">
            <Image
              src="/codex-logo-color.svg"
              alt="CodeX Logo"
              width={128}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="text-white font-medium">{displayName}</span>
          </div>
          <p className="text-gray-400 text-xs">{userEmail}</p>
          <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
            {userRole} ROLE
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-8">
        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}