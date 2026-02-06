Fraud models (MVP guidance)
Date: 2026-02-06

Purpose
- Enumerate common fraud patterns and detection heuristics to guide automated flags and admin workflows.

1) Forged documents
- Description: Uploaded documents are falsified or manipulated (title deeds, survey plans).
- Indicators:
  - Image metadata mismatch (camera/device EXIF vs upload device IP geography).
  - OCRed text doesn't match declared document fields (e.g., title number patterns).
  - Checksum appears in many different listings from different uploader accounts.
- Detection: OCR + metadata checks, duplicate-file detection, manual admin review.
- Mitigation: Auto-flag, mark `Suspicious`, escalate to admin review.

2) Identity spoofing / account takeover
- Description: Attacker uses stolen credentials or false identity to list.
- Indicators:
  - Rapid changes to account email/phone.
  - Multiple failed login attempts or password resets.
  - New account creating many listings quickly.
- Detection: Authentication anomaly detection, IP/device fingerprinting, rate limits.
- Mitigation: Lockdown flows, require verification (email/phone), admin review.

3) Collusion / mass-listing spam
- Description: Single operator creates many near-identical listings to game visibility.
- Indicators:
  - Similar titles/descriptions across many listings.
  - Reused images/checksums across listings.
  - Similar geolocation clusters with small variations.
- Detection: fuzzy text similarity, image checksum reuse, clustering by owner contact.
- Mitigation: Throttle listings, queue for manual review, apply `Suspicious` badge.

4) Reposting removed listings
- Description: Previously flagged/removed listing reappears under different account.
- Indicators:
  - Near-identical metadata/images as removed listings.
  - New account using same contact details or device fingerprint.
- Detection: similarity checks against historical data, cross-account image hashes.
- Mitigation: Block reposting by hash matches, manual review for borderline cases.

5) Collateral social engineering (fake buyer/seller leads)
- Description: Attackers inject fake leads to extract seller contact details or request payments off-platform.
- Indicators:
  - Leads disproportionately from new or unverified buyer accounts.
  - Requests for off-platform payment or escrow.
- Detection: pattern analysis on leads, content scanning for payment requests.
- Mitigation: Flag leads from unverified buyers, educate sellers via `seller_guide.md`.

Operational notes
- All auto-flags should be conservative (prefer false positives over false negatives) and surface rationale for admins.
- Maintain a configurable ruleset (thresholds) stored in `services/verification` so ops can tune sensitivity.
- Retain raw signals and derived features in `services/analytics` for future ML models (deferred).
