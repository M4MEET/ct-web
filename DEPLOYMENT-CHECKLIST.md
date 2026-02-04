# DNS Fix Deployment Checklist

## Pre-Deployment Verification

- [ ] All changes committed to git
- [ ] Local testing completed
- [ ] Backup of production database taken
- [ ] Maintenance window scheduled (if needed)

## Files Modified

### Critical Changes
- [x] `docker-compose.yml` - Added DNS settings to web and admin services
- [x] `packages/database/src/dns-cache.ts` - New DNS caching module
- [x] `packages/database/src/index.ts` - Integrated DNS cache
- [x] `Dockerfile.web` - Added NODE_OPTIONS and ca-certificates
- [x] `Dockerfile.admin` - Added NODE_OPTIONS and ca-certificates

### Documentation
- [x] `DNS-TROUBLESHOOTING.md` - Complete troubleshooting guide
- [x] `.env.production.example` - Optimized environment template
- [x] `scripts/monitor-dns.sh` - DNS monitoring script

## Deployment Steps

### 1. Update Production Server

```bash
# SSH into production server
ssh user@your-production-server

# Navigate to project directory
cd /path/to/ct-web

# Pull latest changes
git pull origin main

# Verify changes
git log -1 --oneline
```

### 2. Update Environment Variables

```bash
# Backup current .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Update DATABASE_URL with connection pooling
nano .env
```

Add these parameters to your DATABASE_URL:
```
?connection_limit=20&pool_timeout=20&connect_timeout=10
```

Example:
```env
DATABASE_URL="postgresql://user:pass@postgres:5432/codex_terminal?connection_limit=20&pool_timeout=20&connect_timeout=10"
```

### 3. Rebuild Containers

```bash
# Stop current containers
docker compose down

# Remove old images (optional but recommended)
docker compose rm -f
docker image prune -f

# Rebuild with no cache
docker compose build --no-cache

# Start containers
docker compose up -d

# Watch logs for errors
docker compose logs -f web admin
```

### 4. Verify Deployment

```bash
# Check container health
docker compose ps

# Check DNS cache initialization
docker compose logs web | grep "DNS caching"
# Expected: "✓ DNS caching enabled (TTL: 60s)"

# Check database connections
docker compose exec postgres psql -U codex -d codex_terminal -c \
  "SELECT COUNT(*) as active_connections FROM pg_stat_activity;"
# Expected: < 20 connections

# Test application
curl -I https://codexterminal.com
curl -I https://admin.codexterminal.com
```

### 5. Monitor for 30 Minutes

```bash
# Run monitoring script
./scripts/monitor-dns.sh

# Check for DNS errors
docker compose logs --since 10m | grep -i "ENOTFOUND\|dns"
# Expected: No errors or very few

# Monitor system resources
docker stats --no-stream

# Check hosting provider dashboard
# Expected: No DDoS alerts
```

## Success Criteria

✅ **Deployment successful if:**

1. Containers start without errors
2. Applications respond correctly (HTTP 200)
3. "DNS caching enabled" message in web logs
4. < 10 DNS queries per minute (use monitoring script)
5. Database connections stable (< 20 active)
6. No DDoS alerts from hosting provider
7. No "ENOTFOUND" errors in logs

## Rollback Procedure

If issues occur:

```bash
# Quick rollback
docker compose down
git checkout HEAD~1  # Or specific commit
docker compose up -d --build

# Or restore from backup
docker compose down
cp .env.backup.YYYYMMDD_HHMMSS .env
git checkout production  # Or stable tag
docker compose up -d --build
```

## Post-Deployment Tasks

### Hour 1
- [ ] Monitor logs continuously
- [ ] Check DNS query rate every 10 minutes
- [ ] Verify no DDoS alerts
- [ ] Test all critical user flows

### Hour 24
- [ ] Review error logs
- [ ] Check database connection pool stats
- [ ] Verify performance metrics
- [ ] Document any issues

### Day 7
- [ ] Confirm DNS query rate stable
- [ ] Review hosting provider reports
- [ ] Update documentation if needed
- [ ] Plan for any additional optimizations

## Troubleshooting

### Issue: "DNS caching enabled" not in logs

```bash
# Check if dns-cache.ts is included in build
docker compose exec web ls -la /app/packages/database/src/dns-cache.ts

# Rebuild if missing
docker compose down
docker compose build --no-cache web admin
docker compose up -d
```

### Issue: High connection count

```bash
# Check for connection leaks
docker compose exec postgres psql -U codex -d codex_terminal -c \
  "SELECT state, COUNT(*) FROM pg_stat_activity GROUP BY state;"

# Kill idle connections if needed
docker compose exec postgres psql -U codex -d codex_terminal -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND state_change < NOW() - INTERVAL '10 minutes';"
```

### Issue: Still seeing high DNS queries

```bash
# Check if DNS settings are applied
docker compose exec web cat /etc/resolv.conf

# Verify NODE_OPTIONS
docker compose exec web printenv NODE_OPTIONS

# Check for external API calls
docker compose logs --since 5m | grep -E "fetch|https?://" | head -20
```

## Contact

For critical issues during deployment:
- Escalate to DevOps lead
- Check hosting provider support
- Review DNS-TROUBLESHOOTING.md for detailed fixes

## Notes

- DNS caching TTL: 60 seconds
- Connection pool limit: 20
- Docker DNS timeout: 1 second
- Expected DNS queries: < 10/minute per container
