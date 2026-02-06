# Web App — Run & Test

This is a minimal static web UI for sellers to create listings, upload evidence via signed URLs, and view public listings.

Run locally (static server):

```bash
cd apps/web
python3 -m http.server 5100
# Open http://localhost:5100
```

Notes
- The page expects the backend services to be available at the default local ports:
  - Listings: `http://localhost:4100`
  - Documents: `http://localhost:4200`
- Paste your Firebase ID token into the top textarea before creating listings or requesting upload URLs.

Flow
1. Create a listing (requires a valid seller ID token).
2. Use the returned listing ID to request an upload URL and upload a file to the signed URL.
3. Confirm the upload to attach the evidence to the listing.
