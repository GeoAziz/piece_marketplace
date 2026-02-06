# apps/web-react

Lightweight Vite + React scaffold for the web UI.

Run (development):

```bash
cd apps/web-react
npm install
VITE_API_BASE=http://localhost:4100 npm run dev
```

Notes:
- The client reads `import.meta.env.VITE_API_BASE` for the API base URL.
- The current `ListingForm` component is minimal and demonstrates the presigned upload flow.

Shadcn/UI integration:
- To integrate the official shadcn/ui components run the generator in this folder and follow prompts:

```bash
cd apps/web-react
npx shadcn-ui@latest init
```

After generating components you can replace the local primitives by updating `src/components/shadcn.js` to re-export the generated components.
