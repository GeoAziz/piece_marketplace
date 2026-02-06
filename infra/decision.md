Infra decisions (record)
Date: 2026-02-06

Chosen defaults for MVP (can be changed with stakeholder signoff)


Note: project uses Firebase for authentication and optional user profile storage.

- Database: (for metadata) PostgreSQL (DATABASE_URL) OR Firestore (if prefer serverless unified stack).
  - Recommendation: If committing to Firebase for auth and storage, consider Firestore for listings/evidence metadata to reduce operational overhead. Otherwise continue with Postgres for relational guarantees.

- Object storage: AWS S3 (EVIDENCE_BUCKET) or use Firebase Storage (Cloud Storage for Firebase) depending on platform choice.
  - If using Firebase Storage: leverage Firebase security rules and KMS integration via GCP.

- KMS: AWS KMS, GCP KMS, or HashiCorp Vault depending on cloud choice.
  - If using Firebase/GCP native services, prefer GCP KMS for key management.

- Backup policies:
  - Postgres: PITR enabled, daily snapshots, retain 90 days.
  - Evidence: Move to cold storage after 90 days; retain 1 year by default.

- Security defaults:
  - Evidence access mediated by backend; no direct public object links.
  - Presigned URLs short-lived (admin downloads 15 minutes).

- Dev stack suggestions:
  - Migrations: Prisma or Flyway
  - Logging: structured JSON logs, central aggregator (e.g., ELK or Datadog)

Open infra questions (to decide before CODE)
- Hosted vs self-hosted object storage? (cost vs control)
- Exact retention windows and compliance requirements.
- Whether to enable client-side encryption in addition to SSE.
