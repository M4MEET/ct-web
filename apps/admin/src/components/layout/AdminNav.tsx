'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    label: 'Blog Posts',
    href: '/admin/posts',
    permission: 'content.view' as const,
    icon: '✍️',
  },
  {
    label: 'Services',
    href: '/admin/services',
    permission: 'content.view' as const,
    icon: '🛠',
  },
  {
    label: 'Case Studies',
    href: '/admin/cases',
    permission: 'content.view' as const,
    icon: '💼',
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

  // Show all items for demo (no auth required)
  const visibleItems = navItems;

  return (
    <nav className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">CodeX Admin</h1>
        <div className="mt-2 text-sm text-gray-400">
          <p>demo@codexterminal.com</p>
          <p className="text-xs uppercase tracking-wider mt-1">
            ADMIN
          </p>
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
        <div className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 cursor-not-allowed opacity-50">
          <span>🚪</span>
          <span>Sign Out (Demo)</span>
        </div>
      </div>
    </nav>
  );
}