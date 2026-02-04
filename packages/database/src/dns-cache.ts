/**
 * DNS Caching Configuration
 * Prevents excessive DNS lookups that can trigger DDoS protection
 */

import dns from 'dns';

// Enable DNS result caching (60 seconds)
dns.setDefaultResultOrder('ipv4first');

// Configure DNS resolver with caching
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4']);

// Simple in-memory DNS cache
const dnsCache = new Map<string, { address: string; timestamp: number }>();
const DNS_CACHE_TTL = 60000; // 60 seconds

export function configureDNSCache() {
  // Override dns.lookup to use caching
  const originalLookup = dns.lookup;

  (dns as any).lookup = function (
    hostname: string,
    options: any,
    callback?: (err: NodeJS.ErrnoException | null, address: string, family: number) => void
  ) {
    // Handle different function signatures
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    const cached = dnsCache.get(hostname);
    const now = Date.now();

    // Return cached result if valid
    if (cached && now - cached.timestamp < DNS_CACHE_TTL) {
      if (callback) {
        process.nextTick(() => callback!(null, cached.address, 4));
      }
      return;
    }

    // Perform actual DNS lookup
    originalLookup.call(
      dns,
      hostname,
      options,
      (err: NodeJS.ErrnoException | null, address: string, family: number) => {
        if (!err && address) {
          dnsCache.set(hostname, { address, timestamp: now });
        }
        if (callback) {
          callback(err, address, family);
        }
      }
    );
  };

  console.log('✓ DNS caching enabled (TTL: 60s)');
}

// Cleanup old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [hostname, cached] of dnsCache.entries()) {
    if (now - cached.timestamp > DNS_CACHE_TTL) {
      dnsCache.delete(hostname);
    }
  }
}, DNS_CACHE_TTL);
