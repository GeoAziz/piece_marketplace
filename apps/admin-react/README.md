# apps/admin-react

Lightweight Vite + React scaffold for the admin UI.

Run (development):

```bash
cd apps/admin-react
npm install
VITE_API_BASE=http://localhost:4300 npm run dev
```

Notes:
- The admin app expects an `ADMIN_TOKEN` pasted into the input (for dev). In production, wire Firebase auth + server-side checks.
- The `ReviewQueue` component calls `/api/v1/reviews/queue` and `POST /api/v1/reviews/:evidenceId`.
