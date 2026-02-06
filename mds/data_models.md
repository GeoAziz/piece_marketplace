Core data models (conceptual)

User
- id: UUID
- role: enum [anonymous, buyer, seller, admin]
- displayName, email (if registered), metadata

Listing
- id: UUID
- ownerId: User.id
- title, description, location (freeform + geohash optional)
- price, status [draft,published,flagged,removed]
- evidenceIds: list of Evidence.id

Evidence (document)
- id: UUID
- listingId: Listing.id
- uploaderId: User.id
- type: enum [title, sale_agreement, survey_plan, id_document, photo]
- storagePointer: opaque reference (no public URL)
- checksum, uploadedAt

Badge
- id: UUID
- listingId: Listing.id
- name: enum [EvidenceSubmitted, EvidenceReviewed, TrustedSignal, Suspicious]
- issuedBy: User.id (admin/automated)
- issuedAt, rationale

AuditLog
- id, actorId, action, targetType, targetId, timestamp, details
