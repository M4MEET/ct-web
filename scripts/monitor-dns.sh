#!/bin/bash
# DNS Query Monitoring Script
# Helps identify containers making excessive DNS requests

echo "🔍 Monitoring DNS queries from containers..."
echo "Press Ctrl+C to stop"
echo ""

# Monitor DNS traffic on UDP port 53
docker compose exec -T web sh -c '
apk add --no-cache tcpdump 2>/dev/null
timeout 30 tcpdump -i any -n "udp port 53" -c 100 2>/dev/null || echo "Install tcpdump on host to monitor"
' &

# Alternative: Monitor using container logs
echo "📊 DNS query patterns in last 5 minutes:"
docker compose logs --since 5m web admin 2>/dev/null | grep -i "getaddrinfo\|ENOTFOUND\|dns" | wc -l

echo ""
echo "📈 Connection attempts:"
docker compose exec postgres sh -c "psql -U codex -d codex_terminal -c \"SELECT COUNT(*) as active_connections FROM pg_stat_activity;\"" 2>/dev/null

echo ""
echo "💡 Tips to reduce DNS queries:"
echo "  1. Use connection pooling (already configured)"
echo "  2. Cache DNS results (dns-cache.ts installed)"
echo "  3. Use internal Docker hostnames (postgres, redis)"
echo "  4. Reduce external API calls"
echo "  5. Monitor with: docker stats --no-stream"
