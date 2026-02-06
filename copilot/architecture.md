Canonical architecture (high level)

Overview
- Frontend: `apps/web` (public marketplace) and `apps/admin` (admin tools).
- Backend services (microservices):
  - `services/auth` — authentication and RBAC.
  - `services/listings` — listing CRUD and metadata.
  - `services/documents` — evidence upload, storage pointers, access mediation.
  - `services/verification` — evidence review workflow and badge issuance.
  - `services/messaging` — buyer-seller messaging (deferred to Stage 2).
  - `services/analytics` — usage and fraud analytics (deferred).
- Shared packages: `packages/ui`, `packages/validation`, `packages/trust-signals`, `packages/utils`.

Storage
- Relational DB (primary metadata, ownership links).
- Object storage (encrypted) for uploaded evidence; documents are private by default.
- Audit log (append-only) for evidence reviews and badge changes.

Design constraints
- Trust decisions centralized in `services/verification` and `packages/trust-signals`.
- Do not expose raw documents publicly; provide derived metadata and badge states.
