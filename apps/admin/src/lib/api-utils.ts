import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

export type ApiResponse<T = unknown> = {
  data?: T;
  error?: string;
  message?: string;
};

export type ApiHandler<T = unknown> = (
  request: NextRequest,
  context?: { params: any }
) => Promise<NextResponse<ApiResponse<T>>>;

// Standard API response helpers
export function apiResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data }, { status });
}

export function apiError(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json({ error }, { status });
}

export function apiSuccess(message: string, status = 200): NextResponse<ApiResponse> {
  return NextResponse.json({ message }, { status });
}

// Validate request body with Zod schema
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      return {
        success: false,
        error: NextResponse.json(
          { 
            error: 'Validation failed',
            details: result.error.flatten()
          },
          { status: 400 }
        )
      };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    };
  }
}

// Validate query parameters
export function validateQueryParam(
  request: NextRequest,
  param: string,
  schema: z.ZodSchema
): { success: true; data: any } | { success: false; error: NextResponse } {
  const { searchParams } = new URL(request.url);
  const value = searchParams.get(param);
  
  const result = schema.safeParse(value);
  
  if (!result.success) {
    return {
      success: false,
      error: NextResponse.json(
        { 
          error: `Invalid ${param} parameter`,
          details: result.error.flatten()
        },
        { status: 400 }
      )
    };
  }
  
  return { success: true, data: result.data };
}

// Validate path parameters
export function validatePathParam(
  param: string,
  value: string,
  schema: z.ZodSchema
): { success: true; data: any } | { success: false; error: NextResponse } {
  const result = schema.safeParse(value);
  
  if (!result.success) {
    return {
      success: false,
      error: NextResponse.json(
        { 
          error: `Invalid ${param} parameter`,
          details: result.error.flatten()
        },
        { status: 400 }
      )
    };
  }
  
  return { success: true, data: result.data };
}

// Role-based authorization
export enum Permission {
  CONTENT_READ = 'content.read',
  CONTENT_EDIT = 'content.edit',
  CONTENT_DELETE = 'content.delete',
  CONTENT_PUBLISH = 'content.publish',
  MEDIA_UPLOAD = 'media.upload',
  USER_MANAGE = 'user.manage',
}

export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN', 
  EDITOR = 'EDITOR',
  AUTHOR = 'AUTHOR',
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.OWNER]: [
    Permission.CONTENT_READ,
    Permission.CONTENT_EDIT,
    Permission.CONTENT_DELETE,
    Permission.CONTENT_PUBLISH,
    Permission.MEDIA_UPLOAD,
    Permission.USER_MANAGE,
  ],
  [Role.ADMIN]: [
    Permission.CONTENT_READ,
    Permission.CONTENT_EDIT,
    Permission.CONTENT_DELETE,
    Permission.CONTENT_PUBLISH,
    Permission.MEDIA_UPLOAD,
  ],
  [Role.EDITOR]: [
    Permission.CONTENT_READ,
    Permission.CONTENT_EDIT,
    Permission.CONTENT_PUBLISH,
    Permission.MEDIA_UPLOAD,
  ],
  [Role.AUTHOR]: [
    Permission.CONTENT_READ,
    Permission.CONTENT_EDIT,
  ],
};

export function hasPermission(userRole: string, permission: Permission): boolean {
  const role = userRole as Role;
  return rolePermissions[role]?.includes(permission) ?? false;
}

// Authentication middleware
export async function requireAuth(
  request: NextRequest,
  requiredPermission?: Permission
): Promise<{ success: true; session: any } | { success: false; error: NextResponse }> {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return {
        success: false,
        error: NextResponse.json(
          { error: 'Unauthorized - Please sign in' },
          { status: 401 }
        )
      };
    }
    
    if (requiredPermission) {
      const userRole = session.user.role || Role.AUTHOR;
      
      if (!hasPermission(userRole, requiredPermission)) {
        return {
          success: false,
          error: NextResponse.json(
            { error: 'Forbidden - Insufficient permissions' },
            { status: 403 }
          )
        };
      }
    }
    
    return { success: true, session };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      )
    };
  }
}

// Error handler wrapper
export function withErrorHandler<T>(
  handler: ApiHandler<T>
): ApiHandler<T> {
  return async (request: NextRequest, context?: { params: any }) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle different error types
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Validation error',
            details: error.flatten()
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Server-side HTML sanitization for rich text content
export function sanitizeRichText(html: string): string {
  if (!html) return '';
  
  const config = {
    ALLOWED_TAGS: [
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'img', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'u', 's',
      'blockquote', 'code', 'pre', 'hr', 'section', 'article',
      'header', 'footer', 'nav', 'aside', 'main', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
      'width', 'height', 'loading', 'decoding', 'fetchpriority', 'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|\/|#)/i,
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'textarea', 'select', 'style'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
    ALLOW_DATA_ATTR: false,
  };

  return DOMPurify.sanitize(html, config);
}

// Deep sanitization for block data that may contain rich text
export function sanitizeBlockData(blockData: any): any {
  if (!blockData || typeof blockData !== 'object') {
    return blockData;
  }

  // First unwrap nested .data layers that come from the editor
  function unwrap(input: any): any {
    let current = input;
    let depth = 0;
    while (
      current &&
      typeof current === 'object' &&
      'data' in current &&
      typeof (current as any).data === 'object' &&
      (current as any).data !== null &&
      depth < 10
    ) {
      const next = (current as any).data;
      // Heuristic: if next looks like a block payload, keep unwrapping
      if (
        next &&
        (typeof next.type === 'string' || typeof next.visible === 'boolean' || typeof next.id === 'string')
      ) {
        current = next;
        depth++;
      } else {
        break;
      }
    }
    return current;
  }

  const unwrapped = unwrap(blockData);

  // Create a deep copy to avoid mutating the original
  const sanitized = JSON.parse(JSON.stringify(unwrapped));

  // Recursively sanitize string values that look like HTML
  function sanitizeRecursive(obj: any): any {
    if (typeof obj === 'string') {
      // Check if string contains HTML tags (basic heuristic)
      if (/<[^>]*>/g.test(obj)) {
        return sanitizeRichText(obj);
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeRecursive);
    }
    
    if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Specifically target known rich text fields
        if (['content', 'description', 'body', 'text', 'html'].includes(key.toLowerCase())) {
          result[key] = typeof value === 'string' ? sanitizeRichText(value) : sanitizeRecursive(value);
        } else {
          result[key] = sanitizeRecursive(value);
        }
      }
      return result;
    }
    
    return obj;
  }

  return sanitizeRecursive(sanitized);
}
