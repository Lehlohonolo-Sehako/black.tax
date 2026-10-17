# black.tax frontend

Next.js app. Screens follow the Claude Design handoff (`../design`).

- `src/api/` — typed client generated from `../api/core.yaml` (`npm run generate`), the snapshot loader and the
  adapters from API DTOs to view models.
- `src/screens/markup.html` — the screen markup (from the design, with figures bound to API data). `npm run generate:view`
  compiles it to `View.jsx` with `scripts/convert.py`. Edit the markup, not `View.jsx`.
- `src/screens/App.jsx` — view models and actions; every figure comes from the API and every action calls it.
- `npm run smoke` — renders every screen against a running backend.

See the root README for running the whole system.
