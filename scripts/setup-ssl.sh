#!/bin/bash

# Let's Encrypt SSL Certificate Setup Script
# This script automates the SSL certificate generation process

set -e

# Configuration
DOMAIN="codexterminal.com"
ADMIN_DOMAIN="admin.codexterminal.com"
EMAIL="admin@codexterminal.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${GREEN}[SSL Setup]${NC} $1"
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

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error "Please run as root (use sudo)"
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    error "Docker is not installed"
fi

log "Starting SSL certificate setup for CodeX Terminal..."

# Create necessary directories
log "Creating SSL directories..."
mkdir -p ./ssl
mkdir -p ./certbot-webroot

# Step 1: Start nginx without SSL first (HTTP only)
log "Starting Nginx in HTTP-only mode for certificate validation..."
cat > ./nginx/sites/certbot-temp.conf <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN $ADMIN_DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 200 'SSL setup in progress...';
        add_header Content-Type text/plain;
    }
}
EOF

# Start nginx container temporarily
docker run -d \
    --name nginx-temp \
    -p 80:80 \
    -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
    -v $(pwd)/nginx/sites:/etc/nginx/sites-available:ro \
    -v $(pwd)/certbot-webroot:/var/www/certbot:ro \
    nginx:alpine

sleep 5

# Step 2: Run Certbot to get certificates
log "Requesting SSL certificates from Let's Encrypt..."

# Main domain certificate
info "Getting certificate for $DOMAIN and www.$DOMAIN..."
docker run --rm \
    -v $(pwd)/ssl:/etc/letsencrypt \
    -v $(pwd)/certbot-webroot:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN \
    -d www.$DOMAIN

if [ $? -eq 0 ]; then
    log "Main domain certificate obtained successfully!"
else
    error "Failed to obtain certificate for main domain"
fi

# Admin domain certificate
info "Getting certificate for $ADMIN_DOMAIN..."
docker run --rm \
    -v $(pwd)/ssl:/etc/letsencrypt \
    -v $(pwd)/certbot-webroot:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $ADMIN_DOMAIN

if [ $? -eq 0 ]; then
    log "Admin domain certificate obtained successfully!"
else
    error "Failed to obtain certificate for admin domain"
fi

# Step 3: Stop temporary nginx
log "Stopping temporary Nginx..."
docker stop nginx-temp
docker rm nginx-temp
rm ./nginx/sites/certbot-temp.conf

# Step 4: Generate strong DH parameters for enhanced security
if [ ! -f ./ssl/dhparam.pem ]; then
    log "Generating DH parameters (this may take a few minutes)..."
    openssl dhparam -out ./ssl/dhparam.pem 2048
fi

# Step 5: Create renewal script
log "Creating automatic renewal script..."
cat > ./scripts/renew-ssl.sh <<'EOF'
#!/bin/bash
# SSL Certificate Renewal Script

# Renew certificates
docker compose run --rm certbot renew

# Reload nginx to use new certificates
docker compose exec nginx nginx -s reload

echo "SSL certificates renewed at $(date)"
EOF

chmod +x ./scripts/renew-ssl.sh

# Step 6: Set up cron job for automatic renewal
log "Setting up automatic renewal (cron job)..."
CRON_JOB="0 3 * * 1 cd $(pwd) && ./scripts/renew-ssl.sh >> ./logs/ssl-renewal.log 2>&1"

# Check if cron job already exists
if ! crontab -l 2>/dev/null | grep -q "renew-ssl.sh"; then
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    log "Cron job added for automatic SSL renewal"
else
    warning "SSL renewal cron job already exists"
fi

# Step 7: Verify certificates
log "Verifying SSL certificates..."
if [ -f "./ssl/live/$DOMAIN/fullchain.pem" ] && [ -f "./ssl/live/$DOMAIN/privkey.pem" ]; then
    info "Main domain certificates found ✓"
    openssl x509 -in "./ssl/live/$DOMAIN/fullchain.pem" -noout -dates
else
    error "Main domain certificates not found!"
fi

if [ -f "./ssl/live/$ADMIN_DOMAIN/fullchain.pem" ] && [ -f "./ssl/live/$ADMIN_DOMAIN/privkey.pem" ]; then
    info "Admin domain certificates found ✓"
    openssl x509 -in "./ssl/live/$ADMIN_DOMAIN/fullchain.pem" -noout -dates
else
    error "Admin domain certificates not found!"
fi

# Step 8: Start production stack with SSL
log "Starting production stack with SSL enabled..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for services to start
sleep 10

# Step 9: Test HTTPS connections
log "Testing HTTPS connections..."
if curl -I https://$DOMAIN 2>/dev/null | grep -q "200\|301\|302"; then
    log "✅ Main site HTTPS is working!"
else
    warning "Main site HTTPS test failed - please check manually"
fi

if curl -I https://$ADMIN_DOMAIN 2>/dev/null | grep -q "200\|301\|302"; then
    log "✅ Admin site HTTPS is working!"
else
    warning "Admin site HTTPS test failed - please check manually"
fi

# Final message
echo ""
log "🎉 SSL Setup Complete!"
echo ""
info "Your sites are now accessible at:"
echo "  - Main site: https://$DOMAIN"
echo "  - Admin panel: https://$ADMIN_DOMAIN"
echo ""
info "SSL certificates will auto-renew every Monday at 3 AM"
info "Renewal logs: ./logs/ssl-renewal.log"
echo ""
warning "Remember to:"
echo "  1. Update your DNS records to point to this server"
echo "  2. Configure firewall to allow ports 80 and 443"
echo "  3. Monitor the first automatic renewal to ensure it works"
echo ""

exit 0