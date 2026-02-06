Constraints (legal, ethical, technical)

Legal / trust
- Never claim legal ownership or government endorsement.
- "Verification" = "evidence reviewed"; UI & API language must reflect this.

Privacy
- Treat uploaded documents as sensitive PII by default. Store encrypted at rest.
- Access only via authenticated, authorized backend endpoints; never serve direct object storage links to public users.

Technical
- Minimum viable stack: RESTful APIs with JWT auth for MVP.
- Evidence immutability: retain originals and store review events in append-only audit logs.

Operational
- Admin actions must be auditable with timestamps, actor id, and rationale.
