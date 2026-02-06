#!/usr/bin/env bash
set -euo pipefail

# Simple manual smoke script for local development.
# Requires environment variables:
#  - ID_TOKEN (seller user)
#  - ADMIN_TOKEN (admin user, optional)
# Configure endpoints if different
LISTINGS_BASE=${LISTINGS_BASE:-http://localhost:4100}
DOCUMENTS_BASE=${DOCUMENTS_BASE:-http://localhost:4200}

if [ -z "${ID_TOKEN:-}" ]; then
  echo "Set ID_TOKEN environment variable (seller ID token)"
  exit 2
fi

echo "Creating listing..."
create_resp=$(curl -s -X POST "$LISTINGS_BASE/api/v1/listings" -H "Authorization: Bearer $ID_TOKEN" -H 'Content-Type: application/json' -d '{"title":"E2E Plot","description":"Smoke test","location":"Nairobi","price":1000}')
echo "$create_resp"
listing_id=$(echo "$create_resp" | jq -r '.id')
if [ "$listing_id" = "null" ] || [ -z "$listing_id" ]; then
  echo "Failed to create listing"
  exit 1
fi
echo "Listing created: $listing_id"

echo "Requesting upload URL..."
upload_resp=$(curl -s -X POST "$DOCUMENTS_BASE/api/v1/listings/$listing_id/upload-url" -H "Authorization: Bearer $ID_TOKEN" -H 'Content-Type: application/json' -d '{"filename":"smoke.txt","contentType":"text/plain","type":"title"}')
echo "$upload_resp"
evidence_id=$(echo "$upload_resp" | jq -r '.evidenceId')
upload_url=$(echo "$upload_resp" | jq -r '.uploadUrl')
if [ -z "$upload_url" ] || [ "$upload_url" = "null" ]; then
  echo "Failed to get upload URL"
  exit 1
fi

echo "Uploading file via PUT..."
echo "smoke test" > /tmp/smoke.txt
curl -s -X PUT "$upload_url" -H 'Content-Type: text/plain' --data-binary @/tmp/smoke.txt

echo "Confirming upload..."
confirm_resp=$(curl -s -X POST "$DOCUMENTS_BASE/api/v1/listings/$listing_id/confirm" -H "Authorization: Bearer $ID_TOKEN" -H 'Content-Type: application/json' -d "{\"evidenceId\":\"$evidence_id\"}")
echo "$confirm_resp"

echo "Smoke flow complete. Listing: $listing_id, Evidence: $evidence_id"

# If ADMIN_TOKEN provided, attempt to review
if [ -n "${ADMIN_TOKEN:-}" ]; then
  echo "Admin review: accepting evidence..."
  review_resp=$(curl -s -X POST "http://localhost:4300/api/v1/reviews/$evidence_id" -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' -d '{"decision":"accept","rationale":"smoke test"}')
  echo "$review_resp"
fi

echo "Done."
