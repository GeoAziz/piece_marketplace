UI / UX Specification — Kenya Land Marketplace (Phase 1)

Summary
- Goal: Provide simple, usable interfaces for sellers to create listings and upload evidence, and for admins to review evidence and issue badges.
- Deliverables: low-fidelity mockups, component list, accessibility notes, responsive breakpoints, API integration points.

Pages / Flows
- Web (public / seller):
  - Home / Browse listings
  - Listing Create: form to capture title, price, location, description, contact, and evidence upload (presigned URL flow)
  - Listing View: public details plus verification badges and evidence thumbnails

- Admin:
  - Sign-in (dev: paste ID token)
  - Review Queue: list evidence items needing review with thumbnails and metadata
  - Review Detail: view uploaded evidence, accept/reject/flag, add notes, issue badge

Components
- `Header` / `Footer`
- `ListingCard` (image, title, price, badges)
- `ListingForm` (inputs + evidence upload widget)
- `UploadWidget` (progress, client-side validation for MIME/size)
- `ReviewQueue` / `ReviewItem`
- `BadgePill`

Design Tokens
- Colors: Primary #0B5FFF, Secondary #0B6A3D, Accent #F59E0B, Neutral palette 100–900
- Typography: Inter / system fallback; sizes: 16 (base), 20 (h2), 24 (h1)
- Spacing scale: 4,8,12,16,24,32

Responsive
- Mobile: up to 640px
- Tablet: 641–1024px
- Desktop: 1025px+

Accessibility
- All form fields must have labels and aria descriptors
- Contrast ratio >= 4.5:1 for body copy
- Keyboard operable upload and review actions

API integration points
- `VITE_API_BASE` environment variable used by client. Key endpoints:
  - `POST /api/v1/listings` — create listing (returns listing id)
  - `POST /api/v1/listings/:id/upload-url` — request signed PUT url
  - `POST /api/v1/listings/:id/confirm` — confirm evidence uploaded
  - Admin: `GET /api/v1/reviews/queue`, `POST /api/v1/reviews/:evidenceId`

Next steps
- Create low-fidelity mockups (Figma/PNG) and component props spec.
- Scaffold React app with Vite and implement `ListingForm` + `UploadWidget`.

Adopt `shadcn` design system
- Recommendation: use the `shadcn` component approach (Tailwind + Radix + utility components) as the canonical design system for both `apps/web-react` and `apps/admin-react`.
- Benefits: production-ready primitives, consistent tokens, accessible Radix primitives, and an established component workflow.
- Implementation notes:
  - Install Tailwind CSS and required dependencies in both apps.
  - Follow `shadcn/ui` scaffolding for copying component modules into `src/components/ui` and wire the Tailwind config to include the design tokens.
  - Use `lucide-react` for icons and `class-variance-authority` for variant-driven components where appropriate.

