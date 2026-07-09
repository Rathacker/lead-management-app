# Lead Manager — Client

React + TypeScript SPA built with Vite, [Mantine](https://mantine.dev) UI, and
[Recharts](https://recharts.org). See the [root README](../README.md) for full
setup instructions.

```bash
npm install
npm run dev     # http://localhost:5173 (expects the API on :4000)
npm run build   # production build to dist/
```

Structure highlights:

- `src/api/` — typed service layer over axios (JWT attached via interceptor)
- `src/components/form/` — JSON-schema-driven FormBuilder with a field-component registry
- `src/context/` — auth, DB-backed settings, toast wrapper
- `src/constants/` — theme + status/colour tokens (single source of truth)
