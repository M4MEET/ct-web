import { RoleName } from '@codex/database';
import { Session } from 'next-auth';

// Role hierarchy: OWNER > ADMIN > EDITOR > AUTHOR
const roleHierarchy: Record<RoleName, number> = {
  OWNER: 4,
  ADMIN: 3,
  EDITOR: 2,
  AUTHOR: 1,
};

export function hasPermission(
  userRole: RoleName,
  requiredRole: RoleName
): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canEdit(session: Session | null): boolean {
  if (!session?.user) return false;
  return hasPermission(session.user.role, 'EDITOR');
}

export function canPublish(session: Session | null): boolean {
  if (!session?.user) return false;
  return hasPermission(session.user.role, 'ADMIN');
}

export function canManageUsers(session: Session | null): boolean {
  if (!session?.user) return false;
  return hasPermission(session.user.role, 'ADMIN');
}

export function canDeleteContent(session: Session | null): boolean {
  if (!session?.user) return false;
  return hasPermission(session.user.role, 'ADMIN');
}

export function isOwner(session: Session | null): boolean {
  return session?.user?.role === 'OWNER';
}

// Permissions map for UI
export const permissions = {
  // Content permissions
  'content.view': ['AUTHOR', 'EDITOR', 'ADMIN', 'OWNER'],
  'content.create': ['AUTHOR', 'EDITOR', 'ADMIN', 'OWNER'],
  'content.edit': ['EDITOR', 'ADMIN', 'OWNER'],
  'content.delete': ['ADMIN', 'OWNER'],
  'content.publish': ['ADMIN', 'OWNER'],
  
  // Media permissions
  'media.view': ['AUTHOR', 'EDITOR', 'ADMIN', 'OWNER'],
  'media.upload': ['AUTHOR', 'EDITOR', 'ADMIN', 'OWNER'],
  'media.delete': ['EDITOR', 'ADMIN', 'OWNER'],
  
  // User permissions
  'users.view': ['ADMIN', 'OWNER'],
  'users.create': ['ADMIN', 'OWNER'],
  'users.edit': ['ADMIN', 'OWNER'],
  'users.delete': ['OWNER'],
  
  // Settings permissions
  'settings.view': ['ADMIN', 'OWNER'],
  'settings.edit': ['OWNER'],
} as const;

export type Permission = keyof typeof permissions;

export function hasPermissionFor(
  session: Session | null,
  permission: Permission
): boolean {
  if (!session?.user) return false;
  return permissions[permission].includes(session.user.role);
}