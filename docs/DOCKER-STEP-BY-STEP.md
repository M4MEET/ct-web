# Docker Setup - Step-by-Step Guide

This comprehensive guide walks you through setting up the complete CodeX Terminal Docker infrastructure from scratch.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Environment](#development-environment)
4. [Production Environment](#production-environment)
5. [SSL Certificate Setup](#ssl-certificate-setup)
6. [Monitoring Setup](#monitoring-setup)
7. [Backup Configuration](#backup-configuration)
8. [Health Checks](#health-checks)
9. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### System Requirements
- **Operating System**: Ubuntu 22.04 LTS (recommended) or similar Linux distribution
- **RAM**: Minimum 4GB (8GB recommended)
- **CPU**: 2+ cores
- **Storage**: 20GB+ free space
- **Network**: Public IP address with ports 80, 443 open

### Software Installation

#### Step 1.1: Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Step 1.2: Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
```

#### Step 1.3: Install Docker Compose
```bash
sudo apt install docker-compose-plugin -y
```

#### Step 1.4: Install Additional Tools
```bash
sudo apt install -y git curl wget openssl cron
```

#### Step 1.5: Verify Installation
```bash
docker --version
docker compose version
```

Expected output:
```
Docker version 24.0.0+
Docker Compose version v2.20.0+
```

---

## 2. Initial Setup

### Step 2.1: Clone Repository
```bash
git clone <your-repository-url>
cd ct-web
```

### Step 2.2: Create Directory Structure
```bash
# Create necessary directories
mkdir -p nginx/sites
mkdir -p ssl
mkdir -p backups
mkdir -p logs
mkdir -p secrets
mkdir -p certbot-webroot
```

### Step 2.3: Set Permissions
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Set proper directory permissions
sudo chown -R $USER:$USER .
chmod 755 nginx scripts backups logs
```

### Step 2.4: Environment Configuration
```bash
# Copy environment template
cp .env.example .env.production

# Edit production environment variables
nano .env.production
```

**Required variables to configure:**
```bash
# Database
DATABASE_URL=postgresql://codex_user:CHANGE_THIS_PASSWORD@postgres:5432/codex_terminal
DB_PASSWORD=CHANGE_THIS_PASSWORD

# Redis
REDIS_PASSWORD=CHANGE_THIS_PASSWORD

# Authentication (generate with: openssl rand -base64 64)
NEXTAUTH_SECRET=your-64-character-secret-here

# URLs
WEB_URL=https://codexterminal.com
ADMIN_URL=https://admin.codexterminal.com
```

### Step 2.5: Generate Secure Passwords
```bash
# Generate database password
echo "DB_PASSWORD=$(openssl rand -base64 32)" >> .env.production

# Generate Redis password
echo "REDIS_PASSWORD=$(openssl rand -base64 32)" >> .env.production

# Generate NextAuth secret
echo "NEXTAUTH_SECRET=$(openssl rand -base64 64)" >> .env.production
```

---

## 3. Development Environment

### Step 3.1: Start Development Stack
```bash
# Using Make (recommended)
make dev

# Or using Docker Compose directly
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Step 3.2: Verify Services
```bash
# Check all containers are running
docker compose ps

# View logs
docker compose logs -f

# Check health status
make health
```

### Step 3.3: Initialize Database
```bash
# Run migrations
make db-migrate

# Seed with sample data
make db-seed
```

### Step 3.4: Access Applications
- **Web app**: http://localhost:3000
- **Admin app**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Prisma Studio**: `make studio` then http://localhost:5555

### Step 3.5: Development Workflow
```bash
# View logs for specific service
docker compose logs -f web
docker compose logs -f admin

# Restart a service
docker compose restart web

# Shell access
docker compose exec web /bin/sh
docker compose exec admin /bin/sh

# Stop development environment
docker compose down
```

---

## 4. Production Environment

### Step 4.1: Pre-production Checklist
- [ ] Domain DNS points to your server IP
- [ ] Firewall allows ports 80 and 443
- [ ] Environment variables configured
- [ ] SSL email address set in scripts/setup-ssl.sh

### Step 4.2: Configure Domain Names
```bash
# Edit SSL setup script
nano scripts/setup-ssl.sh

# Update these variables:
DOMAIN="codexterminal.com"
ADMIN_DOMAIN="admin.codexterminal.com"
EMAIL="admin@codexterminal.com"
```

### Step 4.3: Build Production Images
```bash
# Build all production images
docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache
```

### Step 4.4: Create Secrets
```bash
# Create database password secret
echo "your-secure-db-password" > secrets/db_password.txt
chmod 600 secrets/db_password.txt
```

---

## 5. SSL Certificate Setup

### Step 5.1: Automated SSL Setup (Recommended)
```bash
# Run the automated SSL setup script
sudo ./scripts/setup-ssl.sh
```

This script will:
1. Start temporary HTTP server
2. Request SSL certificates from Let's Encrypt
3. Configure automatic renewal
4. Start production stack with HTTPS

### Step 5.2: Manual SSL Setup (Alternative)

#### 5.2.1: Start HTTP-only Stack
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d nginx
```

#### 5.2.2: Request Certificates
```bash
# Main domain
docker run --rm \
  -v $(pwd)/ssl:/etc/letsencrypt \
  -v $(pwd)/certbot-webroot:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@codexterminal.com \
  --agree-tos \
  --no-eff-email \
  -d codexterminal.com \
  -d www.codexterminal.com

# Admin domain
docker run --rm \
  -v $(pwd)/ssl:/etc/letsencrypt \
  -v $(pwd)/certbot-webroot:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@codexterminal.com \
  --agree-tos \
  --no-eff-email \
  -d admin.codexterminal.com
```

#### 5.2.3: Start Full Production Stack
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Step 5.3: Verify SSL
```bash
# Test HTTPS connections
curl -I https://codexterminal.com
curl -I https://admin.codexterminal.com

# Check SSL certificate details
openssl x509 -in ssl/live/codexterminal.com/fullchain.pem -noout -dates
```

### Step 5.4: Configure Automatic Renewal
```bash
# The setup script automatically adds this cron job:
# 0 3 * * 1 /path/to/project/scripts/renew-ssl.sh

# Verify cron job exists
crontab -l | grep renew-ssl

# Test renewal (dry run)
docker compose run --rm certbot renew --dry-run
```

---

## 6. Monitoring Setup

### Step 6.1: Start Uptime Kuma
```bash
# Uptime Kuma is included in production stack
# It starts automatically with docker-compose.prod.yml

# Access monitoring interface
# http://your-server-ip:3003
```

### Step 6.2: Configure Uptime Kuma

#### 6.2.1: Initial Setup
1. Open http://your-server-ip:3003
2. Create admin account
3. Set up password and security settings

#### 6.2.2: Add Monitors
Add these monitors in Uptime Kuma:

**Main Website Monitor:**
- **Monitor Type**: HTTP(s)
- **Friendly Name**: Main Website
- **URL**: https://codexterminal.com
- **Heartbeat Interval**: 60 seconds
- **Request Timeout**: 48 seconds

**Admin Panel Monitor:**
- **Monitor Type**: HTTP(s)
- **Friendly Name**: Admin Panel
- **URL**: https://admin.codexterminal.com
- **Heartbeat Interval**: 60 seconds
- **Request Timeout**: 48 seconds

**Health Check Monitors:**
- **Web Health**: https://codexterminal.com/api/health
- **Admin Health**: https://admin.codexterminal.com/api/health

**Database Monitor:**
- **Monitor Type**: Port
- **Hostname**: localhost
- **Port**: 5432

### Step 6.3: Configure Notifications
1. Go to Settings → Notifications
2. Add notification channels (email, Slack, Discord, etc.)
3. Test notifications
4. Assign notifications to monitors

---

## 7. Backup Configuration

### Step 7.1: Automated Backup Setup
```bash
# The backup script is already created at scripts/backup.sh
# Make it executable
chmod +x scripts/backup.sh

# Test backup manually
./scripts/backup.sh
```

### Step 7.2: Schedule Automated Backups
```bash
# Add to crontab for daily backups at 2 AM
crontab -e

# Add this line:
0 2 * * * cd /path/to/your/project && ./scripts/backup.sh >> logs/backup.log 2>&1
```

### Step 7.3: Verify Backup System
```bash
# Check backup directory
ls -la backups/

# Check backup logs
tail -f logs/backup.log

# Verify backup integrity
gzip -t backups/database/db_backup_*.sql.gz
```

### Step 7.4: Backup Restoration Process

#### 7.4.1: Database Restore
```bash
# List available backups
ls -la backups/database/

# Stop applications
docker compose stop web admin

# Restore database
gunzip -c backups/database/db_backup_YYYYMMDD_HHMMSS.sql.gz | \
docker compose exec -T postgres psql -U codex_user -d codex_terminal

# Restart applications
docker compose start web admin
```

#### 7.4.2: File Restore
```bash
# Restore web uploads
docker compose exec web tar xzf - -C /app/public/uploads < backups/uploads/web_uploads_YYYYMMDD_HHMMSS.tar.gz

# Restore admin uploads
docker compose exec admin tar xzf - -C /app/public/uploads < backups/uploads/admin_uploads_YYYYMMDD_HHMMSS.tar.gz
```

---

## 8. Health Checks

### Step 8.1: Application Health Endpoints
Both applications include health check endpoints:

- **Web App**: https://codexterminal.com/api/health
- **Admin App**: https://admin.codexterminal.com/api/health

### Step 8.2: Health Check Response Format
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "web",
  "version": "1.0.0",
  "checks": {
    "database": true,
    "redis": true,
    "auth": true
  }
}
```

### Step 8.3: Manual Health Checks
```bash
# Use the built-in health check command
make health

# Or check individual services
curl -f https://codexterminal.com/api/health
curl -f https://admin.codexterminal.com/api/health

# Docker health status
docker compose ps --format "table {{.Name}}\t{{.Status}}"
```

### Step 8.4: Service-specific Health Checks

#### PostgreSQL
```bash
docker compose exec postgres pg_isready -U codex_user
```

#### Redis
```bash
docker compose exec redis redis-cli ping
```

#### Nginx
```bash
docker compose exec nginx nginx -t
```

---

## 9. Troubleshooting

### Step 9.1: Common Issues

#### Issue: Container won't start
```bash
# Check logs
docker compose logs [service-name]

# Check resource usage
docker stats

# Restart service
docker compose restart [service-name]
```

#### Issue: Database connection failed
```bash
# Check PostgreSQL logs
docker compose logs postgres

# Test connection
docker compose exec postgres psql -U codex_user -d codex_terminal -c "SELECT 1;"

# Check environment variables
docker compose config
```

#### Issue: SSL certificate problems
```bash
# Check certificate validity
openssl x509 -in ssl/live/codexterminal.com/fullchain.pem -noout -dates

# Renew certificates
docker compose run --rm certbot renew

# Check Nginx configuration
docker compose exec nginx nginx -t
```

#### Issue: 502 Bad Gateway
```bash
# Check if backend services are running
docker compose ps

# Check Nginx logs
docker compose logs nginx

# Test backend connectivity
docker compose exec nginx wget -O- http://web:3000/api/health
```

### Step 9.2: Log Analysis
```bash
# View all logs
docker compose logs --tail=100 -f

# Service-specific logs
docker compose logs web
docker compose logs admin
docker compose logs postgres
docker compose logs nginx

# Log locations in containers
# Nginx: /var/log/nginx/
# Application: stdout/stderr (captured by Docker)
```

### Step 9.3: Performance Monitoring
```bash
# Container resource usage
docker stats

# Disk usage
df -h
du -sh backups/

# Network connectivity
docker network ls
docker network inspect ct-web_codex-network
```

### Step 9.4: Clean Restart Process
```bash
# Stop all services
docker compose down

# Remove containers and networks (keeps volumes)
docker compose down --remove-orphans

# Clean build (if needed)
docker compose build --no-cache

# Start fresh
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Verify all services
make health
```

### Step 9.5: Disaster Recovery
```bash
# Complete system restore process:

# 1. Stop all services
docker compose down -v

# 2. Restore from backup
./scripts/backup.sh  # Use your restore script

# 3. Rebuild if needed
docker compose build

# 4. Start services
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 5. Verify restoration
make health
```

---

## 📞 Support Checklist

When seeking support, provide:
- [ ] Docker and Docker Compose versions
- [ ] Operating system version
- [ ] Output of `docker compose ps`
- [ ] Relevant logs from `docker compose logs`
- [ ] Contents of `.env.production` (redacted)
- [ ] Error messages and when they occur

---

## 🔄 Regular Maintenance

### Daily
- [ ] Check health status: `make health`
- [ ] Review backup logs: `tail logs/backup.log`

### Weekly
- [ ] Review Uptime Kuma alerts
- [ ] Check disk space: `df -h`
- [ ] Review security logs: `docker compose logs nginx | grep -i error`

### Monthly
- [ ] Update Docker images: `docker compose pull`
- [ ] Review and clean old backups
- [ ] Test disaster recovery process
- [ ] Check SSL certificate expiry

---

*This guide covers all aspects of the Docker setup. Keep it updated as you modify the infrastructure.*