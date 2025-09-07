#!/bin/bash

# Production Deployment Script with Safe Migrations
# This script handles deployment with database migrations in production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${GREEN}[Deploy]${NC} $1"
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

# Configuration
BACKUP_BEFORE_DEPLOY=${BACKUP_BEFORE_DEPLOY:-true}
RUN_MIGRATIONS=${RUN_MIGRATIONS:-true}
WAIT_FOR_HEALTH_CHECK=${WAIT_FOR_HEALTH_CHECK:-true}

log "Starting production deployment with migrations..."

# Step 1: Pre-deployment backup (if enabled)
if [ "$BACKUP_BEFORE_DEPLOY" = "true" ]; then
    log "Creating pre-deployment backup..."
    if ./scripts/backup.sh; then
        log "✅ Pre-deployment backup completed"
    else
        error "❌ Pre-deployment backup failed!"
    fi
fi

# Step 2: Build new images
log "Building Docker images..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

if [ $? -eq 0 ]; then
    log "✅ Docker images built successfully"
else
    error "❌ Docker image build failed!"
fi

# Step 3: Run database migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
    log "Running database migrations..."
    
    # First ensure PostgreSQL is running
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d postgres
    sleep 10
    
    # Run migrations using the migration service
    docker compose --profile migration -f docker-compose.yml -f docker-compose.prod.yml run --rm migrate
    
    if [ $? -eq 0 ]; then
        log "✅ Database migrations completed"
    else
        error "❌ Database migrations failed!"
    fi
fi

# Step 4: Deploy applications
log "Deploying applications..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d web admin

if [ $? -eq 0 ]; then
    log "✅ Applications deployed"
else
    error "❌ Application deployment failed!"
fi

# Step 5: Deploy nginx (if using SSL/production profile)
if docker compose --profile production -f docker-compose.yml -f docker-compose.prod.yml ps | grep -q nginx; then
    log "Deploying nginx reverse proxy..."
    docker compose --profile production -f docker-compose.yml -f docker-compose.prod.yml up -d nginx
fi

# Step 6: Wait for health checks
if [ "$WAIT_FOR_HEALTH_CHECK" = "true" ]; then
    log "Waiting for applications to be healthy..."
    
    # Wait up to 60 seconds for health checks
    for i in {1..60}; do
        WEB_HEALTHY=false
        ADMIN_HEALTHY=false
        
        # Check web app health
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            WEB_HEALTHY=true
        fi
        
        # Check admin app health
        if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
            ADMIN_HEALTHY=true
        fi
        
        if $WEB_HEALTHY && $ADMIN_HEALTHY; then
            log "✅ All applications are healthy!"
            break
        fi
        
        if [ $i -eq 60 ]; then
            warning "Health check timeout - applications may need more time to start"
        fi
        
        echo -n "."
        sleep 1
    done
    echo ""
fi

# Step 7: Clean up old images and containers
log "Cleaning up old Docker resources..."
docker system prune -f
docker image prune -f

# Step 8: Final verification
log "Running final verification..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps

echo ""
log "🎉 Deployment completed successfully!"
echo ""
info "Services status:"
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""

if [ -f "/Users/demon/ct-web/.env.production" ]; then
    source /Users/demon/ct-web/.env.production
    echo "Your applications should be available at:"
    echo "  - Web: ${WEB_URL:-http://localhost:3000}"
    echo "  - Admin: ${ADMIN_URL:-http://localhost:3001}"
    echo ""
fi

warning "Remember to:"
echo "  1. Monitor application logs for any issues"
echo "  2. Check SSL certificates if using HTTPS"
echo "  3. Verify all features work correctly"
echo "  4. Review backup status and ensure it's working"

exit 0