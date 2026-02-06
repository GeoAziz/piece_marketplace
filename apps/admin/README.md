# Admin App — Run & Test

This is a minimal static admin UI to exercise the verification review flows.

Run locally (simple static server)

Option A — Python built-in (quick):

```bash
cd apps/admin
python3 -m http.server 5000
# Open http://localhost:5000 in your browser
```

Option B — npx serve:

```bash
cd apps/admin
npx serve -l 5000 .
```

Usage
- Paste a valid Firebase admin user's ID token into the top textarea. The admin user must have a custom claim `admin: true` set via the Firebase Admin SDK.
- Click "Load Review Queue" to fetch pending evidence items.
- For each item: use "Get Download URL" to retrieve a short-lived signed link, or choose a decision and submit a review.
- Click "Load Audit Logs" to view recent admin actions.

Notes
- Services defaults (change as needed):
  - Verification service: `http://localhost:4300`
  - Documents service: `http://localhost:4200`
- The page assumes CORS is enabled on the backend services (scaffolded services include CORS).
