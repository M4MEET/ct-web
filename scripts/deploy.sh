#!/bin/bash
set -e

# ===========================================
# CodeX Terminal Production Deployment Script
# ===========================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN} CodeX Terminal Deployment Script${NC}"
echo -e "${GREEN}======================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (sudo)${NC}"
  exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${RED}.env file not found!${NC}"
  echo -e "${YELLOW}Copy .env.production.example to .env and configure it${NC}"
  exit 1
fi

# Load environment variables
source .env

# Validate required variables
required_vars=("POSTGRES_PASSWORD" "REDIS_PASSWORD" "NEXTAUTH_SECRET")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${RED}Missing required environment variable: $var${NC}"
    exit 1
  fi
done

echo -e "${GREEN}Environment validated${NC}"

# Create necessary directories
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p nginx/ssl nginx/certbot

# Build and start services
echo -e "${YELLOW}Building Docker images...${NC}"
docker compose build --no-cache

echo -e "${YELLOW}Starting database and cache services...${NC}"
docker compose up -d postgres redis

echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 10

echo -e "${YELLOW}Running database migrations...${NC}"
docker compose --profile migrate run --rm migrate

echo -e "${YELLOW}Starting application services...${NC}"
docker compose up -d web admin nginx

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN} Deployment Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "Web:   http://localhost (or your domain)"
echo -e "Admin: http://localhost:3001 (or admin subdomain)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Set up SSL certificates with: ./scripts/setup-ssl.sh"
echo -e "2. Configure DNS to point to this server"
echo -e "3. Check logs with: docker compose logs -f"
