Phase 1: PLAN — Implementation Plan (draft)
Author: AI Copilot
Date: 2026-02-06

1) Scope Declaration
- What is being built now (MVP Stage 1):
  - Authentication (email/password, JWT), role model: Anonymous, Buyer, Seller, Admin.
  - Listing lifecycle: create, edit, publish, flag, remove.
  - Evidence upload: sellers attach documents to listings; evidence stored privately.
  - Admin review workflow: admins review evidence, assign badges, and record audit logs.
  - Public listing pages: show metadata and badge states; provide clear warnings where evidence is missing or suspicious.

- What is explicitly out of scope now:
  - Any claim of legal title or government verification.
  - Payments, escrow, or transaction settlement.
  - Native mobile apps, heavy analytics, and third-party verification integrations.

- What is deferred (Stage 2+):
  - Buyer-seller messaging and leads management.
  - Advanced fraud analytics and machine learning signals.
  - Integrations with external registries (only after formal agreements).

2) Component Breakdown
- Frontend components
  - `apps/web`: public marketplace UI, listing pages, upload flows, search.
  - `apps/admin`: evidence review UI, audit log viewer, flagging tools.

- Backend services
  - `services/auth`: registration, login, JWT issuance, RBAC enforcement.
  - `services/listings`: listing CRUD, publishing rules, metadata enrichment.
  - `services/documents`: multi-part uploads, virus scanning, storage-pointer management, access mediation.
  - `services/verification`: review queue, badge issuance, automated flagging rules, audit log writes.
  - `services/messaging` (deferred): messaging and lead routing.
  - `services/analytics` (deferred): fraud detection pipelines and dashboards.

- Data models involved (owner/service)
  - `User` (`services/auth`)
  - `Listing` (`services/listings`)
  - `Evidence` (`services/documents`)
  - `Badge` (`services/verification`)
  - `AuditLog` (`services/verification`)

- Trust & verification logic touched
  - Centralized in `services/verification` and `packages/trust-signals`.
  - UI displays only badge states and conservative language; raw documents never served publicly.

3) Data Flow
- High level flow
  - Seller (authenticated) creates a listing via `apps/web` -> `services/listings`.
  - Seller uploads evidence to `services/documents`, which stores file in encrypted object storage and returns an opaque pointer + checksum.
  - `services/documents` notifies `services/verification` (event) to enqueue for review.
  - Admin uses `apps/admin` to fetch evidence metadata via `services/verification` -> `services/documents` (backend-mediated download), reviews, and posts a decision to `services/verification`.
  - `services/verification` writes `Badge` changes and `AuditLog` entries to relational DB and emits events for cache invalidation.

- Storage & sensitivity
  - Evidence: encrypted object storage (private). Access only via authenticated backend endpoints; never an unauthenticated public URL.
  - Metadata & badges: relational DB (public-facing fields allowed for listing pages).
  - Audit logs: append-only table, admin-only access.

- Public vs private vs admin-only
  - Public: listing title, description, non-sensitive metadata, badge states, and safe warnings.
  - Private: raw evidence files, uploader contact details, internal review notes.
  - Admin-only: audit logs, review rationale, download links (served via short-lived presigned URLs issued by backend after auth).

4) Threat & Fraud Awareness
- Relevant fraud vectors
  - Fake/forged documents (title, survey plans, IDs).
  - Identity spoofing / account takeover (seller impersonation).
  - Collusion: single actor creating many listings with minor variations.
  - Recycling: reposting removed/flagged listings under new accounts.

- Detection signals & guardrails
  - File-level checks: checksum duplication, image metadata mismatch, OCR mismatch between declared type and content.
  - Account signals: device/IP rate limits, suspicious creation patterns, reused contact details.
  - Listing signals: many listings from same phone/email, near-identical geolocation/area values, repeated images.
  - Operational guardrails: admin review queue priority, rate limits on uploads, automatic `Suspicious` badge assignment for high-risk patterns.
  - Evidence immutability: keep original upload, store checksum; any modification must create an audit entry.

- Escalation & remediation
  - Auto-flag for manual admin review.
  - Temporary listing quarantine until review completes.
  - Account suspension for repeat offenders; exportable evidence for investigations.

5) Acceptance Criteria (what "done" looks like)
- Functional
  - Seller can create a listing and attach at least one evidence document; listing shows `EvidenceSubmitted`.
  - Admin can view and download evidence via `apps/admin`, record a review (accept/reject/flag), and a corresponding badge is set.
  - Public listing pages show badge state and conservative explanatory text; raw documents are not exposed.

- Security & privacy
  - Evidence files stored encrypted; direct public access prohibited.
  - All sensitive endpoints require authentication and role checks.
  - AuditLog entries are written for all admin actions that alter badge or listing state.

- Trust invariants
  - Badge text in UI matches backend semantics and includes explicit disclaimer "Evidence reviewed — not a legal confirmation.".
  - No API or UI response implies legal title or government verification.

6) Implementation plan & milestones (high level)
- Week 0: Finalize PLAN and obtain product + engineering signoff (this document).
- Week 1: Implement `services/auth` (JWT), DB schemas for User/Listing/Evidence/Badge/AuditLog.
- Week 2: Implement `services/documents` upload flow with storage and opaque pointers; `apps/web` listing creation UI.
- Week 3: Implement `services/verification` review API and `apps/admin` review UI; wire badge assignment and audit logs.
- Week 4: End-to-end testing, security review, and VERIFY checklist execution.

7) Review & signoff
- Required signoffs: Product owner (scope), Engineering lead (architecture), Security (privacy/storage), Legal (if available) for disclaimers.

Notes & open questions (must be resolved before CODE)
- Confirm storage provider and encryption key management approach (KMS) for object storage.
- Confirm retention/backup policy for audit logs and evidence.
- Confirm acceptable evidence file size limits and allowed types for MVP.
