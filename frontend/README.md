# frontend

The Next.js app. Screens follow the Claude Design handoff in [`../design`](../design); every figure on screen comes from the core API and every action calls it.

| Path | Role |
|---|---|
| `src/api/generated.ts` | Types generated from [`../api/core.yaml`](../api/core.yaml) (`npm run generate`) |
| `src/api/client.ts`, `snapshot.ts`, `adapt.ts` | Typed `openapi-fetch` client, the per-stokvel snapshot loader, and the mapping from API data to view models |
| `src/screens/markup.html` | Screen markup, from the design with its figures bound to data. **Edit this, not `View.jsx`.** |
| `src/screens/View.jsx` | Generated from the markup by `scripts/convert.py` (`npm run generate:view`) |
| `src/screens/App.jsx` | View models and actions |
| `scripts/smoke.mts` | Renders every screen, sheet and breakpoint against a running backend (`npm run smoke`) |

Environment, fixed at build time:
- `NEXT_PUBLIC_API_URL`: the core API, default `http://localhost:8080/api`.
- `NEXT_PUBLIC_DEMO=true`: shows the demo bar (viewport switcher, scenario buttons, one-click sign-in) and the OTP hint. Off by default. It needs core's `dev` profile.

```bash
npm run generate && npm run dev     # http://localhost:3000
```
