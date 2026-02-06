Selected API contracts (MVP)

Auth
- POST /api/v1/auth/register
  - body: {displayName, email, password}
  - returns: {userId, token}

- POST /api/v1/auth/login
  - body: {email, password}
  - returns: {token, user}

Listings
- POST /api/v1/listings
  - auth required (seller)
  - body: {title, description, location, price}
  - returns: {listing}

- GET /api/v1/listings/:id
  - returns listing metadata and public badge states (no raw documents)

- GET /api/v1/listings
  - query: filters, pagination

Evidence / Documents
- POST /api/v1/listings/:id/evidence
  - auth required (owner)
  - multipart: file, type
  - returns: {evidenceId, uploadStatus}

Verification
- POST /api/v1/verification/review
  - auth required (admin)
  - body: {evidenceId, decision: [accept,reject,flag], rationale}
  - returns: {badgeAssigned, auditEntry}

Admin
- GET /api/v1/admin/audit-logs
  - auth required (admin)
  - returns: list of AuditLog entries

Notes
- All endpoints must enforce RBAC and return conservative messages about badges (e.g., "Evidence reviewed — not a legal confirmation").
