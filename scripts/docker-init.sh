#!/bin/bash

# Docker Container Initialization Script
# This script runs database migrations and other setup tasks when containers start

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[Docker Init]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to wait for database to be ready
wait_for_db() {
    log "Waiting for database to be ready..."
    
    # Extract database details from DATABASE_URL
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    
    # Default to postgres:5432 if extraction fails
    if [ -z "$DB_HOST" ]; then DB_HOST="postgres"; fi
    if [ -z "$DB_PORT" ]; then DB_PORT="5432"; fi
    
    info "Checking database connectivity at $DB_HOST:$DB_PORT"
    
    # Wait for database to be ready (max 60 seconds)
    for i in {1..60}; do
        if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
            log "✅ Database is ready!"
            break
        fi
        
        if [ $i -eq 60 ]; then
            warning "Database connection timeout - proceeding anyway"
            break
        fi
        
        echo -n "."
        sleep 1
    done
    echo ""
}

# Function to run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Set NODE_ENV to production if not already set
    export NODE_ENV=${NODE_ENV:-production}
    
    # Change to database package directory
    cd /app/packages/database
    
    # Generate Prisma client first
    log "Generating Prisma client..."
    npx prisma generate
    
    # Run migrations
    if [ "$NODE_ENV" = "production" ]; then
        log "Running production migrations..."
        npx prisma migrate deploy
    else
        log "Running development migrations..."
        npx prisma migrate dev --name="docker-init"
    fi
    
    log "✅ Database migrations completed"
}

# Function to seed database if needed
seed_database() {
    if [ "$SEED_DATABASE" = "true" ]; then
        log "Seeding database with initial data..."
        cd /app/packages/database
        npm run db:seed || warning "Database seeding failed - continuing anyway"
        log "✅ Database seeding completed"
    fi
}

# Main initialization process
main() {
    log "Starting Docker container initialization..."
    
    # Only run database operations if DATABASE_URL is set
    if [ -n "$DATABASE_URL" ]; then
        wait_for_db
        run_migrations
        seed_database
    else
        warning "DATABASE_URL not set - skipping database operations"
    fi
    
    log "🎉 Docker initialization completed successfully!"
    
    # Execute the main command passed to the container
    exec "$@"
}

# Run main function with all arguments
main "$@"