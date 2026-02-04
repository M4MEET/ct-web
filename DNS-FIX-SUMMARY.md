# DNS Flooding Fix - Quick Summary

## Problem
Container made excessive DNS queries → Triggered DDoS protection

## Root Cause
- No DNS caching
- Poor connection pooling
- Repeated DNS lookups for postgres/redis

## Solution (3-Layer Defense)

### 1. Docker DNS Settings ✅
```yaml
# docker-compose.yml
dns:
  - 8.8.8.8
  - 8.8.4.4
dns_opt:
  - ndots:1
  - timeout:1
  - attempts:2
```

### 2. Application DNS Cache ✅
```typescript
// packages/database/src/dns-cache.ts
- 60-second TTL in-memory cache
- Intercepts all DNS lookups
- Prevents repeated queries
```

### 3. Connection Pooling ✅
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=20&connect_timeout=10"
```

## Deploy Now

```bash
cd /path/to/ct-web
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d
./scripts/monitor-dns.sh  # Monitor for 30 minutes
```

## Expected Results

| Metric | Before | After |
|--------|--------|-------|
| DNS queries/min | 200-500 | < 10 |
| DDoS alerts | Multiple/hour | Zero |
| DB connections | 50-100 | < 20 |
| Connection time | 50-100ms | < 5ms |

## Verify Success

```bash
# 1. Check DNS cache is active
docker compose logs web | grep "DNS caching enabled"

# 2. Monitor DNS queries
./scripts/monitor-dns.sh

# 3. Check connections
docker compose exec postgres psql -U codex -c \
  "SELECT COUNT(*) FROM pg_stat_activity;"
```

## Files Changed
- `docker-compose.yml` - DNS config
- `packages/database/src/dns-cache.ts` - New cache module
- `packages/database/src/index.ts` - Cache integration
- `Dockerfile.web` - NODE_OPTIONS
- `Dockerfile.admin` - NODE_OPTIONS

## Docs
- `DNS-TROUBLESHOOTING.md` - Detailed guide
- `DEPLOYMENT-CHECKLIST.md` - Step-by-step deployment

## Support
If issues persist after deployment, see DNS-TROUBLESHOOTING.md section "Troubleshooting"
