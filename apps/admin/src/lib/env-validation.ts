import { z } from 'zod';

// Environment validation schema
const EnvSchema = z.object({
  // Core App
  NODE_ENV: z.enum(['development', 'test', 'production']),
  
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  
  // Authentication
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  
  // Optional OAuth providers
  OAUTH_GITHUB_ID: z.string().optional(),
  OAUTH_GITHUB_SECRET: z.string().optional(),
  OAUTH_GOOGLE_ID: z.string().optional(),
  OAUTH_GOOGLE_SECRET: z.string().optional(),
  
  // Optional external services
  REDIS_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  
  // Optional storage
  R2_ACCOUNT_ID: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

// Validate environment variables
export function validateEnv(): Env {
  try {
    const env = EnvSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
    return env;
  } catch (error) {
    console.error('❌ Environment validation failed:');
    
    if (error instanceof z.ZodError) {
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
      });
    }
    
    console.error('\nPlease check your environment variables and try again.');
    
    throw new Error('Environment validation failed');
  }
}

// Export validated env for use throughout the app
export const env = validateEnv();