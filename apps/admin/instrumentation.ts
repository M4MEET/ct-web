export async function register() {
  // Import and validate environment variables at startup
  await import('./src/lib/env-validation');
}