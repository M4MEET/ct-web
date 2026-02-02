#!/bin/bash
set -e

# ===========================================
# SSL Certificate Setup Script (Let's Encrypt)
# ===========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
DOMAIN=${1:-codexterminal.com}
EMAIL=${2:-admin@codexterminal.com}

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN} SSL Certificate Setup${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "Domain: ${YELLOW}$DOMAIN${NC}"
echo -e "Email:  ${YELLOW}$EMAIL${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (sudo)${NC}"
  exit 1
fi

# Create temporary nginx config for initial certificate
echo -e "${YELLOW}Creating temporary nginx config...${NC}"

cat > nginx/nginx-init.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name codexterminal.com www.codexterminal.com admin.codexterminal.com;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 200 'SSL setup in progress';
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Start nginx with temporary config
echo -e "${YELLOW}Starting nginx for certificate challenge...${NC}"
docker run -d --name certbot-nginx \
  -p 80:80 \
  -v $(pwd)/nginx/nginx-init.conf:/etc/nginx/nginx.conf:ro \
  -v $(pwd)/nginx/certbot:/var/www/certbot \
  nginx:alpine

sleep 5

# Request certificate
echo -e "${YELLOW}Requesting SSL certificate...${NC}"
docker run --rm \
  -v $(pwd)/nginx/certbot:/var/www/certbot \
  -v codex-certbot-certs:/etc/letsencrypt \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN \
  -d www.$DOMAIN \
  -d admin.$DOMAIN

# Stop temporary nginx
echo -e "${YELLOW}Cleaning up...${NC}"
docker stop certbot-nginx
docker rm certbot-nginx
rm nginx/nginx-init.conf

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN} SSL Certificate Installed!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "Certificates are stored in Docker volume: codex-certbot-certs"
echo ""
echo -e "${YELLOW}Now restart the application:${NC}"
echo -e "  docker compose down"
echo -e "  docker compose up -d"
