#!/usr/bin/env bash
set -euo pipefail

# Post a published Page + Service for PrestaShop Development via Admin API

# Config (override via env)
ADMIN_BASE_URL=${ADMIN_BASE_URL:-http://localhost:3001}
WEB_BASE_URL=${WEB_BASE_URL:-http://localhost:3000}
EMAIL=${EMAIL:-}
PASSWORD=${PASSWORD:-}
TOTP_CODE=${TOTP_CODE:-}
LOCALE=${LOCALE:-en}
SLUG=${SLUG:-prestashop-development}
SERVICE_NAME=${SERVICE_NAME:-PrestaShop Development}

require() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: required command '$1' not found" >&2
    exit 1
  fi
}

require curl
require jq

if [[ -z "$EMAIL" || -z "$PASSWORD" ]]; then
  echo "Usage: EMAIL=you@domain PASSWORD=secret [LOCALE=en] [ADMIN_BASE_URL=...] [WEB_BASE_URL=...] bash scripts/publish-prestashop.sh" >&2
  exit 1
fi

WORKDIR=$(mktemp -d)
COOKIES="$WORKDIR/cookies.txt"

echo "==> Fetching CSRF token"
CSRF_JSON=$(curl -s -c "$COOKIES" "$ADMIN_BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_JSON" | jq -r '.csrfToken // .csrf_token // empty')
if [[ -z "$CSRF_TOKEN" || "$CSRF_TOKEN" == "null" ]]; then
  echo "Error: could not obtain CSRF token from $ADMIN_BASE_URL/api/auth/csrf" >&2
  echo "$CSRF_JSON" >&2
  exit 1
fi

echo "==> Signing in as $EMAIL"
LOGIN_DATA="email=$EMAIL&password=$PASSWORD&csrfToken=$CSRF_TOKEN"
if [[ -n "$TOTP_CODE" ]]; then
  LOGIN_DATA="$LOGIN_DATA&totpCode=$TOTP_CODE"
fi
LOGIN_RESP=$(curl -s -L -b "$COOKIES" -c "$COOKIES" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -X POST \
  --data "$LOGIN_DATA" \
  "$ADMIN_BASE_URL/api/auth/callback/credentials") || true

# Quick auth check by hitting a protected endpoint
echo "==> Verifying session"
AUTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIES" "$ADMIN_BASE_URL/api/pages?limit=1")
if [[ "$AUTH_CHECK" != "200" ]]; then
  echo "Error: authentication failed (status $AUTH_CHECK)" >&2
  exit 1
fi

echo "==> Creating Page ($SLUG, $LOCALE)"
PAGE_PAYLOAD=$(jq -n \
  --arg slug "$SLUG" \
  --arg locale "$LOCALE" \
  '{
    slug: $slug,
    locale: $locale,
    title: "PrestaShop Development Services",
    status: "published",
    seo: {
      title: "PrestaShop Development Services",
      description: "Custom modules, theme development, migrations, and performance tuning for PrestaShop."
    },
    blocks: [
      {
        type: "hero",
        id: "prestashop-hero",
        visible: true,
        eyebrow: "PrestaShop Specialists",
        headline: "Expert PrestaShop Development",
        subcopy: "Modules, themes, migrations, and optimization for scalable commerce.",
        primaryCTA: { label: "Start Your Project", href: "/contact?service=prestashop" }
      },
      {
        type: "featureGrid",
        id: "prestashop-services",
        visible: true,
        heading: "Comprehensive PrestaShop Services",
        subtitle: "Everything you need for a high‑performing store",
        columns: 3,
        features: [
          { icon: "🧩", title: "Custom Modules", description: "Build or extend functionality to fit your business." },
          { icon: "🎨", title: "Theme Development", description: "Responsive, conversion‑focused themes aligned to your brand." },
          { icon: "🔄", title: "Migrations", description: "Seamless migrations to/from PrestaShop with zero data loss." },
          { icon: "⚡", title: "Performance", description: "Page speed, caching, and DB tuning to boost conversions." },
          { icon: "🔐", title: "Security", description: "Hardened configurations and best practices out of the box." },
          { icon: "🔌", title: "Integrations", description: "ERP, CRM, payments, and shipping integrations." }
        ]
      }
    ]
  }')

PAGE_RESP=$(curl -s -b "$COOKIES" -H "Content-Type: application/json" \
  -X POST "$ADMIN_BASE_URL/api/pages" \
  --data "$PAGE_PAYLOAD")

PAGE_ID=$(echo "$PAGE_RESP" | jq -r '.data.id // empty')
if [[ -z "$PAGE_ID" || "$PAGE_ID" == "null" ]]; then
  echo "Error: failed to create Page" >&2
  echo "$PAGE_RESP" | jq >&2
  exit 1
fi

echo "==> Creating Service ($SERVICE_NAME) linked to Page $PAGE_ID"
SERVICE_PAYLOAD=$(jq -n \
  --arg slug "$SLUG" \
  --arg locale "$LOCALE" \
  --arg name "$SERVICE_NAME" \
  --arg pageId "$PAGE_ID" \
  '{
    slug: $slug,
    locale: $locale,
    name: $name,
    summary: "Modules, themes, migrations, and performance optimization for PrestaShop.",
    pageId: $pageId,
    status: "published"
  }')

SERVICE_RESP=$(curl -s -b "$COOKIES" -H "Content-Type: application/json" \
  -X POST "$ADMIN_BASE_URL/api/services" \
  --data "$SERVICE_PAYLOAD")

SERVICE_ID=$(echo "$SERVICE_RESP" | jq -r '.data.id // empty')
if [[ -z "$SERVICE_ID" || "$SERVICE_ID" == "null" ]]; then
  echo "Error: failed to create Service" >&2
  echo "$SERVICE_RESP" | jq >&2
  exit 1
fi

echo "\nSuccess!"
echo "Admin page edit:   $ADMIN_BASE_URL/admin/pages/$PAGE_ID/edit"
echo "Public service URL: $WEB_BASE_URL/$LOCALE/services/$SLUG"

rm -rf "$WORKDIR"
