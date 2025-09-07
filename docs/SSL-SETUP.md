# SSL Certificate Setup Guide

This guide covers setting up SSL certificates using Let's Encrypt for the CodeX Terminal project.

## 🎯 Overview

The SSL setup provides:
- **Free SSL certificates** from Let's Encrypt
- **Automatic renewal** every 90 days
- **A+ SSL security rating** with modern ciphers
- **HTTPS redirect** for all HTTP traffic
- **HSTS headers** for enhanced security

## 🔧 Configuration Files

### 1. SSL Setup Script: `scripts/setup-ssl.sh`

This automated script handles the complete SSL setup process.

#### Configuration Variables
```bash
DOMAIN="codexterminal.com"
ADMIN_DOMAIN="admin.codexterminal.com"
EMAIL="admin@codexterminal.com"
```

#### What the script does:
1. **Creates necessary directories**
   - `./ssl/` for certificates
   - `./certbot-webroot/` for validation

2. **Starts temporary HTTP server**
   - Nginx container with basic configuration
   - Handles Let's Encrypt challenges

3. **Requests SSL certificates**
   - Main domain + www subdomain
   - Admin subdomain
   - Validates domain ownership

4. **Configures automatic renewal**
   - Creates renewal script
   - Sets up cron job for weekly checks

5. **Starts production stack**
   - Full HTTPS-enabled configuration
   - Tests certificate validity

### 2. Nginx Configuration: `nginx/sites/default.conf`

#### HTTP to HTTPS Redirect
```nginx
server {
    listen 80 default_server;
    server_name _;
    
    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}
```

#### HTTPS Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name codexterminal.com www.codexterminal.com;

    # SSL Certificate paths
    ssl_certificate /etc/letsencrypt/live/codexterminal.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/codexterminal.com/privkey.pem;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
}
```

## 🚀 Usage Instructions

### Automated Setup (Recommended)

1. **Configure domains in script:**
   ```bash
   nano scripts/setup-ssl.sh
   # Update DOMAIN, ADMIN_DOMAIN, and EMAIL variables
   ```

2. **Run setup script:**
   ```bash
   sudo ./scripts/setup-ssl.sh
   ```

3. **Verify certificates:**
   ```bash
   # Check certificate details
   openssl x509 -in ssl/live/codexterminal.com/fullchain.pem -noout -dates
   
   # Test HTTPS access
   curl -I https://codexterminal.com
   curl -I https://admin.codexterminal.com
   ```

### Manual Setup

1. **Start HTTP-only nginx:**
   ```bash
   docker compose up -d nginx
   ```

2. **Request certificates:**
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

3. **Restart with SSL:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## 🔄 Certificate Renewal

### Automatic Renewal
Certificates are automatically renewed via cron job:
```bash
# Runs every Monday at 3 AM
0 3 * * 1 /path/to/project/scripts/renew-ssl.sh
```

### Manual Renewal
```bash
# Test renewal (dry run)
docker compose run --rm certbot renew --dry-run

# Force renewal
docker compose run --rm certbot renew --force-renewal

# Reload nginx after renewal
docker compose exec nginx nginx -s reload
```

### Renewal Script: `scripts/renew-ssl.sh`
```bash
#!/bin/bash
# Renew certificates
docker compose run --rm certbot renew

# Reload nginx
docker compose exec nginx nginx -s reload

echo "SSL certificates renewed at $(date)"
```

## 🔒 Security Features

### SSL Configuration
- **TLS 1.2 and 1.3** only (no outdated protocols)
- **Modern cipher suites** for forward secrecy
- **OCSP stapling** for faster certificate validation
- **Session resumption** for better performance

### Security Headers
```nginx
# HSTS (HTTP Strict Transport Security)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# MIME type sniffing protection
add_header X-Content-Type-Options "nosniff" always;

# XSS protection
add_header X-XSS-Protection "1; mode=block" always;
```

### Admin Panel Enhanced Security
```nginx
# Stricter headers for admin
add_header X-Frame-Options "DENY" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Certificate Request Failed
**Error**: `Failed authorization procedure`
**Solution**:
```bash
# Check domain DNS
nslookup codexterminal.com

# Verify port 80 is accessible
curl -I http://codexterminal.com/.well-known/acme-challenge/test

# Check nginx logs
docker compose logs nginx
```

#### 2. Certificate Not Found
**Error**: `ssl_certificate file not found`
**Solution**:
```bash
# Check certificate location
ls -la ssl/live/codexterminal.com/

# Verify certificate permissions
sudo chown -R $USER:$USER ssl/
```

#### 3. Renewal Failed
**Error**: Automatic renewal not working
**Solution**:
```bash
# Check cron job exists
crontab -l | grep renew-ssl

# Test renewal manually
./scripts/renew-ssl.sh

# Check renewal logs
tail -f /var/log/letsencrypt/letsencrypt.log
```

#### 4. Mixed Content Warnings
**Issue**: HTTP resources on HTTPS pages
**Solution**:
```bash
# Check for HTTP links in code
grep -r "http://" apps/

# Update all links to HTTPS or relative URLs
```

### SSL Testing Tools

1. **SSL Server Test**
   - Visit: https://www.ssllabs.com/ssltest/
   - Enter your domain: `codexterminal.com`
   - Target: A+ rating

2. **Certificate Checker**
   ```bash
   # Check certificate validity
   echo | openssl s_client -servername codexterminal.com -connect codexterminal.com:443 2>/dev/null | openssl x509 -noout -dates
   ```

3. **HSTS Preload**
   - Visit: https://hstspreload.org/
   - Submit your domain for HSTS preload list

## 📊 Monitoring

### Certificate Expiry Monitoring
Add to Uptime Kuma:
- **Monitor Type**: Certificate Expiry
- **Hostname**: codexterminal.com
- **Port**: 443
- **Alert Days**: 30

### Log Monitoring
```bash
# Watch renewal logs
tail -f logs/ssl-renewal.log

# Check Let's Encrypt rate limits
cat /var/log/letsencrypt/letsencrypt.log | grep -i "rate limit"
```

## 🔍 Verification Checklist

After SSL setup, verify:

- [ ] **HTTPS access works**: https://codexterminal.com
- [ ] **Admin HTTPS works**: https://admin.codexterminal.com  
- [ ] **HTTP redirects to HTTPS**
- [ ] **No certificate warnings** in browser
- [ ] **SSL Labs grade A+**
- [ ] **HSTS header present**
- [ ] **Automatic renewal scheduled**
- [ ] **Certificate expiry > 60 days**

## 📅 Maintenance Schedule

### Weekly
- [ ] Check certificate expiry dates
- [ ] Review renewal logs

### Monthly  
- [ ] Test manual renewal process
- [ ] Verify HTTPS redirects working
- [ ] Check SSL Labs rating

### Before Expiry (30 days)
- [ ] Test renewal process
- [ ] Verify backup certificates
- [ ] Update emergency contacts

---

*Keep this documentation updated when modifying SSL configuration.*