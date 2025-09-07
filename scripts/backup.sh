#!/bin/bash

# CodeX Terminal Automated Backup Script
# This script performs daily backups of the database and uploaded files

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=${RETENTION_DAYS:-7}
DB_NAME="codex_terminal"
DB_USER="codex_user"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR/database"
mkdir -p "$BACKUP_DIR/uploads"
mkdir -p "$BACKUP_DIR/migrations"

log "Starting backup process..."

# 1. Database Backup
log "Backing up PostgreSQL database..."
if docker compose exec -T postgres pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/database/db_backup_$DATE.sql"; then
    # Compress the backup
    gzip "$BACKUP_DIR/database/db_backup_$DATE.sql"
    log "Database backup completed: db_backup_$DATE.sql.gz"
    
    # Calculate backup size
    SIZE=$(du -h "$BACKUP_DIR/database/db_backup_$DATE.sql.gz" | cut -f1)
    log "Backup size: $SIZE"
else
    error "Database backup failed!"
    exit 1
fi

# 2. Uploads Backup
log "Backing up uploaded files..."
if docker compose exec -T web tar czf - /app/public/uploads 2>/dev/null > "$BACKUP_DIR/uploads/web_uploads_$DATE.tar.gz"; then
    log "Web uploads backup completed"
else
    warning "Web uploads backup failed or no files to backup"
fi

if docker compose exec -T admin tar czf - /app/public/uploads 2>/dev/null > "$BACKUP_DIR/uploads/admin_uploads_$DATE.tar.gz"; then
    log "Admin uploads backup completed"
else
    warning "Admin uploads backup failed or no files to backup"
fi

# 3. Migration Status Backup
log "Backing up migration status..."
if pnpm --filter @codex/database prisma migrate status > "$BACKUP_DIR/migrations/migration_status_$DATE.txt" 2>/dev/null; then
    log "Migration status backup completed"
    
    # Also backup the migrations directory
    if [ -d "packages/database/prisma/migrations" ]; then
        tar czf "$BACKUP_DIR/migrations/migrations_$DATE.tar.gz" packages/database/prisma/migrations/
        log "Migration files backup completed"
    fi
else
    warning "Migration status backup failed"
fi

# 4. Configuration Backup
log "Backing up configuration files..."
tar czf "$BACKUP_DIR/config_backup_$DATE.tar.gz" \
    .env.production \
    docker-compose.yml \
    docker-compose.prod.yml \
    nginx/ \
    scripts/ \
    2>/dev/null || warning "Some configuration files not found"

# 5. Clean old backups
log "Cleaning old backups (keeping last $RETENTION_DAYS days)..."
find "$BACKUP_DIR/database" -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR/uploads" -name "*_uploads_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR/migrations" -name "migration_status_*.txt" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR/migrations" -name "migrations_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "config_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# 6. Verify backup integrity
log "Verifying backup integrity..."
if gzip -t "$BACKUP_DIR/database/db_backup_$DATE.sql.gz" 2>/dev/null; then
    log "Database backup integrity verified"
else
    error "Database backup corrupted!"
    exit 1
fi

# 7. Generate backup report
REPORT="$BACKUP_DIR/backup_report_$DATE.txt"
{
    echo "Backup Report - $DATE"
    echo "================================"
    echo "Database Backup: db_backup_$DATE.sql.gz"
    echo "Migration Status: migration_status_$DATE.txt"
    echo "Migration Files: migrations_$DATE.tar.gz"
    echo "Web Uploads: web_uploads_$DATE.tar.gz"
    echo "Admin Uploads: admin_uploads_$DATE.tar.gz"
    echo "Config Backup: config_backup_$DATE.tar.gz"
    echo ""
    echo "Backup Sizes:"
    du -h "$BACKUP_DIR/database/db_backup_$DATE.sql.gz" 2>/dev/null || echo "Database: N/A"
    du -h "$BACKUP_DIR/migrations/migrations_$DATE.tar.gz" 2>/dev/null || echo "Migrations: N/A"
    du -h "$BACKUP_DIR/uploads/web_uploads_$DATE.tar.gz" 2>/dev/null || echo "Web Uploads: N/A"
    du -h "$BACKUP_DIR/uploads/admin_uploads_$DATE.tar.gz" 2>/dev/null || echo "Admin Uploads: N/A"
    du -h "$BACKUP_DIR/config_backup_$DATE.tar.gz" 2>/dev/null || echo "Config: N/A"
    echo ""
    echo "Total Backup Size:"
    du -sh "$BACKUP_DIR"
} > "$REPORT"

log "Backup report generated: $REPORT"

# 8. Optional: Upload to remote storage (S3, B2, etc.)
# Uncomment and configure if using remote backup storage
# if command -v aws >/dev/null 2>&1; then
#     log "Uploading to S3..."
#     aws s3 cp "$BACKUP_DIR/database/db_backup_$DATE.sql.gz" s3://your-backup-bucket/database/
#     aws s3 cp "$BACKUP_DIR/migrations/migrations_$DATE.tar.gz" s3://your-backup-bucket/migrations/
#     aws s3 cp "$BACKUP_DIR/uploads/" s3://your-backup-bucket/uploads/ --recursive --exclude "*" --include "*_$DATE.tar.gz"
#     log "Remote backup completed"
# fi

# 9. Send notification (optional)
# You can add email notification here using mail, sendmail, or curl to webhook
# Example with curl to Discord webhook:
# if [ ! -z "$DISCORD_WEBHOOK_URL" ]; then
#     curl -H "Content-Type: application/json" \
#          -d "{\"content\":\"✅ Backup completed successfully for $DATE\"}" \
#          "$DISCORD_WEBHOOK_URL"
# fi

log "Backup process completed successfully!"

# Exit successfully
exit 0