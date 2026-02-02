#!/bin/bash
set -e

# ===========================================
# Database Backup Script
# ===========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR=${BACKUP_DIR:-./backups}
RETENTION_DAYS=${RETENTION_DAYS:-30}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN} Database Backup${NC}"
echo -e "${GREEN}======================================${NC}"

# Load environment variables
if [ -f .env ]; then
  source .env
fi

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
echo -e "${YELLOW}Backing up PostgreSQL database...${NC}"
docker compose exec -T postgres pg_dump -U ${POSTGRES_USER:-codex} ${POSTGRES_DB:-codex_terminal} | gzip > $BACKUP_DIR/postgres_$TIMESTAMP.sql.gz

if [ $? -eq 0 ]; then
  echo -e "${GREEN}PostgreSQL backup created: postgres_$TIMESTAMP.sql.gz${NC}"
else
  echo -e "${RED}PostgreSQL backup failed!${NC}"
  exit 1
fi

# Backup Redis (optional)
echo -e "${YELLOW}Backing up Redis data...${NC}"
docker compose exec -T redis redis-cli -a ${REDIS_PASSWORD} BGSAVE
sleep 5
docker cp codex-redis:/data/dump.rdb $BACKUP_DIR/redis_$TIMESTAMP.rdb 2>/dev/null || echo "Redis backup skipped (no data)"

# Clean old backups
echo -e "${YELLOW}Cleaning backups older than $RETENTION_DAYS days...${NC}"
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.rdb" -mtime +$RETENTION_DAYS -delete

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN} Backup Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "Backup location: $BACKUP_DIR"
ls -lh $BACKUP_DIR/*.gz 2>/dev/null | tail -5
