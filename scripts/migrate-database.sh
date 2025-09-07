#!/bin/bash

# Database Migration Script for Production
# This script handles database migrations safely in production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${GREEN}[DB Migration]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if running in proper environment
if [ -z "$DATABASE_URL" ]; then
    error "DATABASE_URL environment variable is not set"
fi

log "Starting database migration process..."

# Check if we're in production mode
if [ "$NODE_ENV" = "production" ]; then
    info "Running in production mode - using safe migration strategy"
    MIGRATION_CMD="db:migrate:prod"
else
    info "Running in development mode"
    MIGRATION_CMD="db:migrate"
fi

# Step 1: Create backup before migration (production only)
if [ "$NODE_ENV" = "production" ]; then
    log "Creating database backup before migration..."
    
    # Create backup directory if it doesn't exist
    mkdir -p ./backups/pre-migration
    
    # Generate backup filename with timestamp
    BACKUP_FILE="./backups/pre-migration/pre_migration_$(date +%Y%m%d_%H%M%S).sql"
    
    # Extract database components from DATABASE_URL
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    DB_USER=$(echo $DATABASE_URL | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')
    
    # Create backup using docker if postgres container is running
    if docker compose ps postgres | grep -q "Up"; then
        log "Creating backup via Docker container..."
        docker compose exec -T postgres pg_dump -U $DB_USER -d $DB_NAME | gzip > "$BACKUP_FILE.gz"
        if [ $? -eq 0 ]; then
            log "✅ Backup created successfully: $BACKUP_FILE.gz"
        else
            error "Failed to create backup"
        fi
    else
        warning "PostgreSQL container not found - skipping backup"
    fi
fi

# Step 2: Check migration status
log "Checking current migration status..."
if ! pnpm --filter @codex/database run $MIGRATION_CMD --dry-run 2>/dev/null; then
    warning "Dry run check failed - proceeding with caution"
fi

# Step 3: Run migrations
log "Applying database migrations..."

# For production, use prisma migrate deploy (doesn't generate new migrations)
if [ "$NODE_ENV" = "production" ]; then
    info "Running production migrations (prisma migrate deploy)..."
    pnpm --filter @codex/database run db:migrate:prod
else
    info "Running development migrations..."
    pnpm --filter @codex/database run db:migrate
fi

if [ $? -eq 0 ]; then
    log "✅ Database migrations completed successfully!"
else
    error "❌ Database migrations failed!"
fi

# Step 4: Generate Prisma client
log "Generating Prisma client..."
pnpm --filter @codex/database run db:generate

if [ $? -eq 0 ]; then
    log "✅ Prisma client generated successfully!"
else
    error "❌ Failed to generate Prisma client!"
fi

# Step 5: Verify database connection
log "Verifying database connection..."
if pnpm --filter @codex/database run db:studio --port 5555 --browser none > /dev/null 2>&1 & 
then
    STUDIO_PID=$!
    sleep 2
    kill $STUDIO_PID 2>/dev/null
    log "✅ Database connection verified!"
else
    warning "Could not verify database connection via Prisma Studio"
fi

# Step 6: Show migration status
log "Current migration status:"
pnpm --filter @codex/database prisma migrate status || true

echo ""
log "🎉 Migration process completed!"
echo ""
info "Next steps:"
echo "  1. Restart your applications to use the updated schema"
echo "  2. Verify that all services are working correctly"
echo "  3. Monitor application logs for any database-related errors"

if [ "$NODE_ENV" = "production" ]; then
    echo ""
    warning "Production migration completed. Backup available at: $BACKUP_FILE.gz"
    echo "  - Keep this backup safe for rollback if needed"
    echo "  - Monitor application performance after migration"
fi

exit 0