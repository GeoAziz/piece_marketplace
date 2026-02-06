Phase 1 acceptance checklist

User-visible acceptance
- Create listing: seller can create a listing and see it in their dashboard.
- Evidence upload: seller can upload document(s); listing shows `EvidenceSubmitted` badge.
- Public listing: public users can view listing metadata and badge states but not raw documents.

Admin-visible acceptance
- Evidence review: admin can view evidence, submit a review decision, and a badge is assigned/updated.
- Audit logs: admin actions create immutable audit entries visible to admins.

Security & privacy
- Evidence stored in private object storage; direct public URLs are not served.
- RBAC enforced on all sensitive endpoints.

Trust invariants (must be proven during VERIFY)
- UI text for badges matches backend semantics (no legal claims).
- Evidence cannot be modified without a new audit entry.

Gating
- PLAN signoff required by product + engineering before CODE.
