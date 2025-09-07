# CodeX Terminal - Production Deployment Guide

This guide provides comprehensive instructions for deploying the CodeX Terminal website and CMS to production using Docker on cloud infrastructure.

## 📋 Table of Contents

1. [Deployment Options](#deployment-options)
2. [Infrastructure Requirements](#infrastructure-requirements)
3. [Pre-deployment Checklist](#pre-deployment-checklist)
4. [Docker Deployment (Recommended)](#docker-deployment-recommended)
5. [Hetzner Cloud Setup](#hetzner-cloud-setup)
6. [Environment Configuration](#environment-configuration)
7. [Database Setup](#database-setup)
8. [SSL & Security](#ssl--security)
9. [Monitoring & Backup](#monitoring--backup)
10. [CI/CD Pipeline](#cicd-pipeline)
11. [Troubleshooting](#troubleshooting)

---

## 🚀 Deployment Options

### Recommended: Docker on Hetzner Cloud
- **Cost-effective**: ~€5-20/month for small-medium sites
- **Full control**: Root access, custom configuration
- **Scalable**: Easy to upgrade server specs
- **European data centers**: GDPR compliance

### Alternative Options
- **Vercel**: Ideal for rapid deployment, automatic scaling (higher cost for CMS usage)
- **Railway**: Simple deployment with database included
- **DigitalOcean App Platform**: Managed container deployment
- **AWS ECS/Fargate**: Enterprise-grade with advanced features

---

## 🏗 Infrastructure Requirements

### Minimum Specs (Small Site)
- **CPU**: 1 vCore (2 vCores recommended)
- **RAM**: 2GB (4GB recommended)
- **Storage**: 20GB SSD (40GB recommended)
- **Bandwidth**: 1TB/month

### Production Specs (Medium Traffic)
- **CPU**: 2-4 vCores
- **RAM**: 4-8GB
- **Storage**: 40-80GB SSD
- **Bandwidth**: Unlimited

### Services Required
- **Web Server**: Nginx (reverse proxy)
- **Database**: PostgreSQL 15+
- **Cache**: Redis (optional but recommended)
- **Storage**: Local + Object storage (Hetzner Storage Box/AWS S3)
- **SSL**: Let's Encrypt via Certbot

---

## ✅ Pre-deployment Checklist

### Code Preparation
- [ ] Update database provider from SQLite to PostgreSQL in `packages/database/prisma/schema.prisma`
- [ ] Test build process: `pnpm build`
- [ ] Run type checking: `pnpm typecheck`
- [ ] Run linting: `pnpm lint`
- [ ] Ensure all environment variables are documented

### Security Review
- [ ] Verify all API endpoints have proper authentication
- [ ] Confirm XSS protection is enabled (already implemented)
- [ ] Check CORS configuration
- [ ] Review CSP headers
- [ ] Validate input sanitization

### Performance Optimization
- [ ] Enable Next.js production optimizations
- [ ] Configure image optimization
- [ ] Set up CDN for static assets
- [ ] Implement caching strategy

---

## 🐳 Docker Deployment (Recommended)

### 1. Create Docker Configuration

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: codex-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: codex_terminal
      POSTGRES_USER: codex_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    networks:
      - codex-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: codex-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - codex-network

  # Public Website
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: codex-web
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${WEB_URL}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    networks:
      - codex-network
    volumes:
      - web_uploads:/app/public/uploads

  # Admin CMS
  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
    container_name: codex-admin
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${ADMIN_URL}
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    networks:
      - codex-network
    volumes:
      - admin_uploads:/app/public/uploads

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: codex-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/sites:/etc/nginx/sites-available:ro
      - ./ssl:/etc/ssl/certs:ro
      - web_uploads:/var/www/uploads/web:ro
      - admin_uploads:/var/www/uploads/admin:ro
    depends_on:
      - web
      - admin
    networks:
      - codex-network

volumes:
  postgres_data:
  redis_data:
  web_uploads:
  admin_uploads:

networks:
  codex-network:
    driver: bridge
```

### 2. Create Dockerfiles

Create `apps/web/Dockerfile`:

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@9.5.0

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/content/package.json ./packages/content/
COPY packages/database/package.json ./packages/database/
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build:web

# Runtime
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/web/server.js"]
```

Create `apps/admin/Dockerfile`:

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@9.5.0

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/content/package.json ./packages/content/
COPY packages/database/package.json ./packages/database/
COPY apps/admin/package.json ./apps/admin/
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build:admin

# Runtime
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/admin/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static

USER nextjs
EXPOSE 3001
ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/admin/server.js"]
```

### 3. Update Next.js Configuration

Add to `apps/web/next.config.ts`:

```typescript
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  // ... existing config
};
```

Add to `apps/admin/next.config.ts`:

```typescript
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  // ... existing config
};
```

---

## ☁️ Hetzner Cloud Setup

### 1. Create Server

```bash
# Install Hetzner CLI (optional)
brew install hcloud  # macOS
# or
curl -L https://github.com/hetznercloud/cli/releases/latest/download/hcloud-linux-amd64.tar.gz | tar -xz

# Create server via CLI
hcloud server create --type cx21 --image ubuntu-22.04 --name codex-terminal --ssh-key YOUR_SSH_KEY

# Or use Hetzner Cloud Console:
# 1. Visit https://console.hetzner.cloud
# 2. Create new project "CodeX Terminal"
# 3. Create server: CX21 (2 vCore, 4GB RAM, 40GB SSD) ~€5/month
# 4. Choose Ubuntu 22.04 LTS
# 5. Add your SSH key
# 6. Enable private networking
```

### 2. Server Initial Setup

```bash
# Connect to server
ssh root@YOUR_SERVER_IP

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Create application user
useradd -m -s /bin/bash codex
usermod -aG docker codex
mkdir -p /home/codex/app
chown -R codex:codex /home/codex

# Install Git
apt install git -y

# Setup firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 3. Deploy Application

```bash
# Switch to application user
su - codex

# Clone repository
cd /home/codex
git clone YOUR_REPOSITORY_URL app
cd app

# Create environment file
cp .env.example .env.production

# Edit environment variables
nano .env.production

# Start services
docker compose --env-file .env.production up -d

# Check status
docker compose ps
```

---

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production`:

```bash
# App Configuration
NODE_ENV=production
APP_URL=https://codexterminal.com
WEB_URL=https://codexterminal.com
ADMIN_URL=https://admin.codexterminal.com

# Database
DATABASE_URL=postgresql://codex_user:SECURE_PASSWORD@postgres:5432/codex_terminal

# Redis Cache
REDIS_URL=redis://:REDIS_PASSWORD@redis:6379
REDIS_PASSWORD=SECURE_REDIS_PASSWORD

# Database Passwords
DB_PASSWORD=SECURE_DB_PASSWORD

# Authentication
NEXTAUTH_SECRET=VERY_SECURE_RANDOM_STRING_64_CHARS_MINIMUM
NEXTAUTH_URL_INTERNAL=http://admin:3001

# OAuth Providers (optional)
OAUTH_GITHUB_ID=your_github_oauth_id
OAUTH_GITHUB_SECRET=your_github_oauth_secret

# Email Configuration
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@codexterminal.com

# Analytics & Monitoring
POSTHOG_KEY=your_posthog_key
POSTHOG_HOST=https://app.posthog.com
SENTRY_DSN=your_sentry_dsn

# File Storage
STORAGE_TYPE=local  # or 's3'
# For S3/R2 storage:
# R2_ACCOUNT_ID=your_account_id
# R2_BUCKET=codex-media
# R2_ACCESS_KEY_ID=your_access_key
# R2_SECRET_ACCESS_KEY=your_secret_key

# Security
HCAPTCHA_SITEKEY=your_hcaptcha_sitekey
HCAPTCHA_SECRET=your_hcaptcha_secret
```

### Generate Secure Values

```bash
# Generate NextAuth Secret
openssl rand -base64 64

# Generate Database Password
openssl rand -base64 32

# Generate Redis Password
openssl rand -base64 32
```

---

## 🗄 Database Setup

### 1. Update Prisma Schema

Edit `packages/database/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

### 2. Database Migration

```bash
# Run migrations
docker compose exec admin pnpm prisma migrate deploy

# Seed initial data
docker compose exec admin pnpm prisma db seed
```

### 3. Create Admin User

```bash
# Access admin container
docker compose exec admin /bin/sh

# Create admin user (implement this script)
node scripts/create-admin-user.js
```

Create `scripts/create-admin-user.js`:

```javascript
const { PrismaClient } = require('@codex/database');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const prisma = new PrismaClient();
  
  const email = process.env.ADMIN_EMAIL || 'admin@codexterminal.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Admin',
      password: hashedPassword,
      role: 'OWNER',
      isActive: true,
      emailVerified: new Date(),
    },
  });
  
  console.log('Admin user created:', user.email);
  await prisma.$disconnect();
}

createAdminUser().catch(console.error);
```

---

## 🔒 SSL & Security

### 1. Nginx Configuration

Create `nginx/nginx.conf`:

```nginx
user nginx;
worker_processes auto;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    client_max_body_size 100M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security Headers
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
    limit_req_zone $binary_remote_addr zone=admin:10m rate=60r/m;

    # Include site configurations
    include /etc/nginx/sites-available/*.conf;
}
```

Create `nginx/sites/codexterminal.com.conf`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name codexterminal.com www.codexterminal.com;
    return 301 https://$server_name$request_uri;
}

# Main Website
server {
    listen 443 ssl http2;
    server_name codexterminal.com www.codexterminal.com;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/codexterminal.com.crt;
    ssl_certificate_key /etc/ssl/certs/codexterminal.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Main site proxy
    location / {
        proxy_pass http://web:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static uploads
    location /uploads/ {
        alias /var/www/uploads/web/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Admin Interface
server {
    listen 443 ssl http2;
    server_name admin.codexterminal.com;

    # SSL Configuration (same as above)
    ssl_certificate /etc/ssl/certs/admin.codexterminal.com.crt;
    ssl_certificate_key /etc/ssl/certs/admin.codexterminal.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rate limiting for admin
    limit_req zone=admin burst=20 nodelay;

    # Admin proxy
    location / {
        proxy_pass http://admin:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin uploads
    location /uploads/ {
        alias /var/www/uploads/admin/;
        expires 1y;
    }
}
```

### 2. SSL Certificate Setup

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Stop nginx temporarily
docker compose stop nginx

# Generate certificates
certbot certonly --standalone -d codexterminal.com -d www.codexterminal.com
certbot certonly --standalone -d admin.codexterminal.com

# Copy certificates to project
cp /etc/letsencrypt/live/codexterminal.com/fullchain.pem ./ssl/codexterminal.com.crt
cp /etc/letsencrypt/live/codexterminal.com/privkey.pem ./ssl/codexterminal.com.key
cp /etc/letsencrypt/live/admin.codexterminal.com/fullchain.pem ./ssl/admin.codexterminal.com.crt
cp /etc/letsencrypt/live/admin.codexterminal.com/privkey.pem ./ssl/admin.codexterminal.com.key

# Start nginx
docker compose up -d nginx

# Setup auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet && docker compose restart nginx
```

---

## 📊 Monitoring & Backup

### 1. Database Backup Script

Create `scripts/backup-db.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/codex/backups"
DB_NAME="codex_terminal"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker compose exec postgres pg_dump -U codex_user $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Database backup completed: db_backup_$DATE.sql.gz"
```

### 2. Setup Automated Backups

```bash
# Make script executable
chmod +x scripts/backup-db.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /home/codex/app/scripts/backup-db.sh
```

### 3. Monitoring Setup

Create `docker-compose.monitoring.yml`:

```yaml
version: '3.8'

services:
  # Application monitoring
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    volumes:
      - uptime-kuma:/app/data
    ports:
      - "3002:3001"
    restart: unless-stopped
    networks:
      - codex-network

volumes:
  uptime-kuma:

networks:
  codex-network:
    external: true
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
    
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 9.5.0
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Run tests
      run: pnpm test
    
    - name: Type check
      run: pnpm typecheck
    
    - name: Lint
      run: pnpm lint
    
    - name: Build
      run: pnpm build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.HOST }}
        username: codex
        key: ${{ secrets.PRIVATE_KEY }}
        script: |
          cd /home/codex/app
          git pull origin main
          docker compose --env-file .env.production down
          docker compose --env-file .env.production up -d --build
          docker compose exec admin pnpm prisma migrate deploy
```

---

## 🔧 Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check logs
docker compose logs [service-name]

# Check if ports are in use
netstat -tulpn | grep :3000

# Restart service
docker compose restart [service-name]
```

**Database connection issues:**
```bash
# Check PostgreSQL logs
docker compose logs postgres

# Test database connection
docker compose exec postgres psql -U codex_user -d codex_terminal -c "SELECT 1;"
```

**SSL certificate issues:**
```bash
# Check certificate validity
openssl x509 -in ssl/codexterminal.com.crt -text -noout

# Test SSL configuration
curl -I https://codexterminal.com
```

**Memory issues:**
```bash
# Check memory usage
docker stats

# Increase server memory or optimize Next.js build
```

### Health Checks

Create `scripts/health-check.sh`:

```bash
#!/bin/bash

# Check services
echo "Checking services..."
docker compose ps

# Check website accessibility
echo "Testing main website..."
curl -f https://codexterminal.com > /dev/null || echo "❌ Main website unreachable"

echo "Testing admin interface..."
curl -f https://admin.codexterminal.com > /dev/null || echo "❌ Admin interface unreachable"

# Check database
echo "Testing database..."
docker compose exec postgres pg_isready -U codex_user || echo "❌ Database not ready"

# Check disk space
echo "Disk usage:"
df -h /

echo "✅ Health check complete"
```

---

## 📈 Performance Optimization

### Next.js Configuration

```typescript
// apps/web/next.config.ts
const nextConfig = {
  // Enable standalone output
  output: 'standalone',
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400,
  },
  
  // Enable compression
  compress: true,
  
  // Optimize bundle
  swcMinify: true,
  
  // Enable experimental features
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ],
      },
    ];
  },
};
```

---

## 🎯 Final Deployment Checklist

- [ ] Server provisioned and configured
- [ ] Docker containers running
- [ ] Database migrated and seeded
- [ ] SSL certificates installed
- [ ] DNS records configured
- [ ] Admin user created
- [ ] Backup system configured
- [ ] Monitoring setup
- [ ] Performance testing completed
- [ ] Security scan performed
- [ ] CI/CD pipeline tested

---

## 📞 Support

For deployment support:
- Check logs first: `docker compose logs`
- Review this guide thoroughly
- Check GitHub Issues for known problems
- Contact: support@codexterminal.com

**Estimated deployment time: 2-4 hours for experienced users, 4-8 hours for beginners.**

---

*This guide is maintained alongside the CodeX Terminal project. Last updated: $(date +%Y-%m-%d)*