// Smoke test: sign in through the dev endpoint, load real snapshots from the core API, and server-render every
// screen, sheet and breakpoint for a treasurer and a member. Needs the backend running with dev endpoints on.

import React from 'react';
import { renderToString } from 'react-dom/server';
const store: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => (store[k] = v), removeItem: (k: string) => delete store[k] };
const { default: App } = await import('../src/screens/App.jsx');
const { loadSnapshot } = await import('../src/api/snapshot.ts');
const { session } = await import('../src/api/client.ts');
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';
let failures = 0, renders = 0;
for (const [who, phone] of [['treasurer', '0825550147'], ['member', '0613307742']]) {
  const s = await (await fetch(API + '/dev/sessions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone }) })).json();
  session.set(s.idToken);
  for (const stk of who === 'treasurer' ? ['masakhane', 'grocery'] : ['masakhane']) {
    const snap = await loadSnapshot(stk);
    for (const route of ['home', 'agent', 'ledger', 'lend', 'loan', 'members', 'member', 'invite', 'invite-sent', 'settings', 'welcome', 'signin', 'otp', 'expired', 'onb-type', 'onb-details', 'onb-const', 'onb-invite']) {
      for (const winW of [390, 800, 1280]) for (const sheet of [null, 'switcher', 'stat', 'entry', 'notifs', 'lfilter', 'arange', 'calc', 'approve', 'decline', 'editAmt', 'remove', 'join']) {
        const app: any = new App({});
        app.state = { ...app.state, snap, stokvelId: stk, route, winW, sheet, entryId: snap.ledger.entries.at(-1)?.id, loanId: snap.requests[0]?.id, memberId: snap.members[1]?.id, decOpen: snap.decisions[0]?.id, statKey: 'interest' };
        try { renderToString(React.createElement(() => app.render())); renders++; }
        catch (e: any) { failures++; if (failures < 6) console.log(`FAIL ${who} ${stk} ${route} ${winW} ${sheet}: ${e.message}`); }
      }
    }
    const app: any = new App({}); app.state = { ...app.state, snap, stokvelId: stk, route: 'home' };
    const html = renderToString(React.createElement(() => app.render()));
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log(`${who}/${stk} home: ` + text.slice(text.indexOf(snap.stokvel.name), text.indexOf(snap.stokvel.name) + 230));
  }
}
console.log(`renders ok: ${renders}, failures: ${failures}`);
if (failures) process.exit(1);
