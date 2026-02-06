# Services — Run & Test Instructions

This file contains quick run instructions and example curl commands for the three scaffolded services: `auth`, `listings`, and `documents`.

Prerequisites
- Node.js 18+ and npm installed.
- A Firebase service account JSON with permissions for Auth, Firestore, and Storage. Place it locally and set `FIREBASE_SERVICE_ACCOUNT_PATH` to its path.
- Set `FIREBASE_STORAGE_BUCKET` to your Firebase Storage bucket name.

Common steps
1. Install dependencies:

```bash
cd services/auth && npm install
cd ../listings && npm install
cd ../documents && npm install
```

2. Copy env examples and set values (in each service):

```bash
cp .env.example .env
# Edit .env to set FIREBASE_SERVICE_ACCOUNT_PATH and FIREBASE_STORAGE_BUCKET
```

Run services (each in its own terminal)

Auth service (port 4000)
```bash
cd services/auth
npm run dev
```

Listings service (port 4100)
```bash
cd services/listings
npm run dev
```

Documents service (port 4200)
```bash
cd services/documents
npm run dev
```

Notes
- Admin endpoints require the calling Firebase user to have a custom claim `admin: true`. Set via server-side Firebase Admin operations.
- The services expect `FIREBASE_SERVICE_ACCOUNT_PATH` to be a readable path on the host. Keep service account secrets out of source control.

Useful curl examples

- Health checks
```bash
curl http://localhost:4000/health
curl http://localhost:4100/health
curl http://localhost:4200/health
```

- Auth: get current user (`/api/v1/auth/me`) — requires an ID token obtained from Firebase client SDK
```bash
curl -H "Authorization: Bearer $ID_TOKEN" http://localhost:4000/api/v1/auth/me
```

- Auth: create user (admin-only endpoint)
```bash
curl -X POST http://localhost:4000/api/v1/auth/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{"email":"new@example.com","password":"Secret123!","displayName":"New User"}'
```

- Listings: create listing (authenticated seller)
```bash
curl -X POST http://localhost:4100/api/v1/listings \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Agricultural plot","description":"Near Nairobi","location":"Nairobi","price":1000000}'
```

- Listings: get listing (public)
```bash
curl http://localhost:4100/api/v1/listings/<LISTING_ID>
```

- Documents: request signed upload URL (owner only)
```bash
curl -X POST http://localhost:4200/api/v1/listings/<LISTING_ID>/upload-url \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filename":"deed.pdf","contentType":"application/pdf","type":"title"}'
```

- Documents: confirm uploaded file (owner only)
```bash
curl -X POST http://localhost:4200/api/v1/listings/<LISTING_ID>/confirm \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"evidenceId":"<EVIDENCE_ID>","checksum":"<CHECKSUM>"}'
```

- Documents: admin download signed URL (admin only)
```bash
curl -H "Authorization: Bearer $ADMIN_ID_TOKEN" http://localhost:4200/api/v1/evidence/<EVIDENCE_ID>/download
```

Quick troubleshooting
- If token verification fails, ensure `FIREBASE_SERVICE_ACCOUNT_PATH` is correct and that the service account has proper IAM roles.
- If uploads fail, check that `FIREBASE_STORAGE_BUCKET` exists and Firebase Storage rules allow the service account to write.
