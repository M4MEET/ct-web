'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    permission: 'content.view' as const,
    icon: '📊',
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    permission: 'content.view' as const,
    icon: '📈',
    submenu: [
      { label: 'Form Analytics', href: '/admin/analytics', icon: '📝' },
      { label: 'Visitor Analytics', href: '/admin/analytics/visitors', icon: '👥' },
      { label: 'Content Analytics', href: '/admin/analytics/content', icon: '📄' },
      { label: 'Marketing Campaigns', href: '/admin/analytics/campaigns', icon: '🚀' },
    ]
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
    label: 'Marketing',
    href: '/admin/marketing',
    permission: 'content.view' as const,
    icon: '🚀',
    submenu: [
      { label: 'Campaigns', href: '/admin/marketing/campaigns', icon: '📢' },
      { label: 'Analytics', href: '/admin/analytics/campaigns', icon: '📊' },
    ]
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
    submenu: [
      { label: 'General Settings', href: '/admin/settings', icon: '⚙️' },
      { label: 'API Keys', href: '/admin/settings/api-keys', icon: '🔑' },
    ]
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show all items for demo (no auth required)
  const visibleItems = navItems;
  
  const user = session?.user;
  const displayName = user?.name || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userRole = user?.role || 'AUTHOR';

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700 hover:bg-gray-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation */}
      <nav className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white shadow-2xl border-r border-gray-700/50 z-40 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-hidden`}>
        <div className="p-4 flex flex-col h-full overflow-y-auto">
      <div className="mb-6 flex-shrink-0">
        <div className="flex justify-center mb-4 p-2">
          <div className="w-28 h-16 transform hover:scale-105 transition-transform duration-200">
            <Image
              src="/codex-logo-color.svg"
              alt="CodeX Logo"
              width={112}
              height={64}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-3 text-sm border border-gray-600/30 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full"></div>
            </div>
            <span className="text-white font-semibold text-sm">{displayName}</span>
          </div>
          <p className="text-gray-300 text-xs mb-2 ml-11">{userEmail}</p>
          <div className="ml-11">
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-300 text-xs font-medium">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mr-2 animate-pulse"></span>
              {userRole} ROLE
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-2">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isOpen = openDropdowns.includes(item.label);
          
          return (
            <li key={item.href}>
              {hasSubmenu ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`group w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive || (item.submenu && item.submenu.some(sub => pathname === sub.href))
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 text-gray-300 hover:text-white hover:shadow-md hover:shadow-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className={`transform transition-all duration-200 text-xs ${
                      isOpen ? 'rotate-180 text-white' : 'text-gray-400 group-hover:text-gray-200'
                    }`}>
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <ul className="mt-2 ml-6 space-y-1 border-l border-gray-700 pl-4">
                      {item.submenu.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm relative ${
                                isSubActive
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                                  : 'hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 text-gray-400 hover:text-white'
                              }`}
                            >
                              <span className="text-sm group-hover:scale-110 transition-transform duration-200">{subItem.icon}</span>
                              <span className="font-medium">{subItem.label}</span>
                              {isSubActive && (
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-indigo-300 rounded-r-full"></div>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 text-gray-300 hover:text-white hover:shadow-md hover:shadow-gray-800/50'
                  }`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                  )}
                </Link>
              )}
            </li>
          );
          })}
        </ul>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-700/50 flex-shrink-0 pb-4 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent">
        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">🚪</span>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
        </div>
      </nav>
    </>
  );
}