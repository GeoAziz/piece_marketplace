Stakeholder signoff package
Author: AI Copilot
Date: 2026-02-06

Purpose
- Provide a concise checklist and proposed infra decisions for stakeholders to approve so CODE can begin.

Quick summary of what to approve
- Phase 1 PLAN (`copilot/phase1_plan.md`) as the source of truth for scope and acceptance criteria.
- Data model and API contracts in `mds/data_models.md` and `mds/api_contracts.md`.
- Trust language and badges in `mds/verification_badges.md` and `mds/trust_and_safety.md`.

Required approvals (sign and date)
- Product owner: scope & acceptance criteria
- Engineering lead: architecture & implementation approach
- Security/Privacy: storage, encryption, and RBAC controls
- Legal (optional but recommended): disclaimer language for badges/UI

Signoff checklist (tick boxes for approvers)
- [ ] Product owner: approves `copilot/phase1_plan.md` scope and acceptance criteria
- [ ] Engineering lead: approves architecture and milestones
- [ ] Security: approves storage/KMS and access mediation approach
- [ ] Legal: reviews badge and disclaimer wording (if available)

Proposed concrete infra choices (recommendations; changeable before CODE)
- Database: PostgreSQL (managed or self-hosted). Reason: relational integrity, widely supported. Env var: `DATABASE_URL`.
  - Suggested: Postgres 14+, migrations via Prisma or Flyway.

- Object storage for evidence: S3-compatible (AWS S3 recommended) or MinIO for on-prem. Bucket: `EVIDENCE_BUCKET`.
  - Encryption: Server-side encryption with KMS (SSE-KMS) or client-side encryption with keys managed in Vault.
  - Access: Evidence stored private; backend issues short-lived presigned URLs for admin downloads only after auth.

- Key management: Customer-managed keys (CMK) via AWS KMS or HashiCorp Vault. Env var: `KMS_KEY_ID`.

- Backups & retention:
  - Postgres: daily backups with point-in-time recovery (PITR) configured; retain snapshots 30–90 days (suggest 90d).
  - Evidence: lifecycle policy to move to cold storage after 90 days; retain for 1 year by default.

- Evidence upload limits & types (MVP defaults — adjustable):
  - Max file size: 50 MB per file.
  - Allowed types: PDF, PNG, JPEG, TIFF.
  - Max files per listing: 20.

- Presigned URL policy:
  - Admin download URLs expire in 15 minutes.
  - Upload flow: server-mediated upload via presigned PUT URLs that require authenticated token exchange.

- Monitoring & audit:
  - AuditLog table for all admin actions (append-only); logs retained 365 days.
  - Object storage access logs enabled and sent to central logging/monitoring.

Operational roll-out steps
1. Approve infra choices above.
2. Provision DB and object storage, configure KMS.
3. Run schema migrations in a staging environment.
4. Deploy `services/auth` and `services/listings` skeletons to staging.
5. Run end-to-end tests for upload → review → badge assignment.

Next steps after signoff
- Once approvals are recorded here, engineering may begin Week 1 work: scaffold `services/auth`, DB schemas, and CI pipeline.

Signatures
- Product owner: ____________________  Date: ______
- Engineering lead: __________________  Date: ______
- Security: __________________________  Date: ______
- Legal (optional): ___________________  Date: ______
