'use client';
// black.tax web app. Screens follow the Claude Design handoff (design/black.tax App.dc.html); the markup is
// src/screens/markup.html, compiled to View.jsx by scripts/convert.py. Every figure comes from the core API
// (api/core.yaml) via src/api; every action calls it. Nothing here is a source of truth.
import React from 'react';
import View from './View';
import { api, call, session, ApiError, API_URL } from '../api/client';
import { loadSnapshot } from '../api/snapshot';
import * as adapt from '../api/adapt';

const IC = {
  check: 'M3.5 8.5l3 3 6-7',
  x: 'M5 5l6 6M11 5l-6 6',
  clock: 'M8 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12M8 5v3.2l2 1.3',
  pause: 'M8 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12M6.7 6v4M9.3 6v4',
  play: 'M8 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12M6.8 5.8v4.4l3.4-2.2z',
  recycle: 'M13 8a5 5 0 1 1-1.5-3.5M13 3v2.5h-2.5',
  in: 'M11 5l-6 6M5 6v5h5',
  out: 'M5 11l6-6M6 5h5v5',
  cleared: 'M8 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12M5.5 8.2l1.8 1.8 3.2-3.6',
  assess: 'M7 2.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9M10.5 10.5L14 14',
  decline: 'M8 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12M4 12L12 4',
  hold: 'M8 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12M8 7.5v3.5M8 5v.01',
  dot: 'M8 5a3 3 0 1 0 0 6a3 3 0 1 0 0-6',
  home: 'M2.5 7L8 2.5 13.5 7v6.5h-3.5v-4h-4v4H2.5z',
  ledger: 'M3.5 2.5h9v11h-9zM6 5.5h4M6 8h4M6 10.5h2.5',
  lend: 'M2.5 5.5h9L9 3M13.5 10.5h-9L7 13',
  members: 'M6 3a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5M1.5 13.5c.5-2.5 2.3-3.5 4.5-3.5s4 1 4.5 3.5M11 3.5a2.2 2.2 0 0 1 0 4.2M12.5 10.3c1.2.5 1.8 1.6 2 3.2',
  settings: 'M3 4.5h10M3 8h10M3 11.5h10M6 3v3M10.5 6.5v3M5 10v3',
  alert: 'M8 2.5l6 11H2zM8 7v2.5M8 11.5v.01',
  chat: 'M2.5 13.5l.9-2.7A5.5 5.5 0 1 1 5.6 13z',
  copy: 'M5.5 5.5h8v8h-8zM10.5 5.5v-3h-8v8h3',
  agent: 'M8 2.5v3M8 10.5v3M2.5 8h3M10.5 8h3M4.2 4.2l2 2M9.8 9.8l2 2M11.8 4.2l-2 2M6.2 9.8l-2 2',
  grocery: 'M2 4h1.8l1.5 6.5h7L14 5.5H5M6.5 13a.8.8 0 1 0 0 .01M11.5 13a.8.8 0 1 0 0 .01',
  rotational: 'M13 8a5 5 0 0 1-9 3M3 8a5 5 0 0 1 9-3M12 2.5V5H9.5M4 13.5V11h2.5',
  burial: 'M8 2.5l5 2v3.5c0 3-2.2 5-5 5.5-2.8-.5-5-2.5-5-5.5V4.5z',
  investment: 'M2.5 12.5l4-4 2.5 2.5 4.5-5M10 6h3.5v3.5',
  debt: 'M8 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12M8 5v6M5.5 8.5L8 11l2.5-2.5',
};
const fmt = n => 'R' + Math.abs(Math.round(n)).toLocaleString('en-US');
const fmt2 = n => 'R' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const first = s => (s || '').split(' ')[0];
const words = n => {
  n = Math.round(n); if (n === 0) return 'zero';
  const o = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const t = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const h = x => { let s = ''; if (x >= 100) { s += o[Math.floor(x / 100)] + ' hundred'; x %= 100; if (x) s += ' and '; } if (x >= 20) { s += t[Math.floor(x / 10)]; if (x % 10) s += '-' + o[x % 10]; } else if (x) s += o[x]; return s; };
  const p = []; const th = Math.floor(n / 1000), r = n % 1000;
  if (th) p.push(h(th) + ' thousand'); if (r) p.push((th && r < 100 ? 'and ' : '') + h(r));
  return p.join(' ');
};
const rel = iso => {
  const d = new Date(iso.length <= 10 ? iso + 'T09:00' : iso);
  const ms = Date.now() - d;
  const days = Math.floor(ms / 86400000);
  if (days < 1) { if (ms < 3600000) { const m = Math.max(1, Math.round(ms / 60000)); return m + (m === 1 ? ' min ago' : ' min ago'); } const h = Math.round(ms / 3600000); return h + (h === 1 ? ' hour ago' : ' hours ago'); }
  if (days === 1) return 'Yesterday';
  if (days < 7) return days + ' days ago';
  return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
};
const longDate = iso => { const d = new Date(iso + 'T12:00'); return String(d.getDate()).padStart(2, '0') + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); };
const dayMonYear = iso => adapt.dayMonYear(iso);
/** Interest paid if a member only paid their own minimum (same model as core's DashboardService). */
const interestOnMinimums = (bal, ratePct, min) => { let b = bal, i = 0; for (let k = 0; k < 600 && b > 0.005 && min > 0; k++) { const x = b * ratePct / 1200; i += x; b = b + x - min; } return i; };

const TYPE_LABEL = { contribution: 'Contribution', payment: 'Debt payment', cleared: 'Debt cleared', recycle: 'Recycled minimum', failed: 'Collection failed', lend: 'Loan out', declined: 'Loan declined', constitution: 'Constitution change' };
const TYPE_ICON = { contribution: ['in', '#E3EEE8', '#1F5C45'], payment: ['out', '#FAF7F2', '#3D3733'], cleared: ['cleared', '#E3EEE8', '#1F5C45'], recycle: ['recycle', '#E3EEE8', '#1F5C45'], failed: ['x', '#F7E5E1', '#9C3A27'], lend: ['out', '#FAF7F2', '#3D3733'], declined: ['decline', '#F7E5E1', '#9C3A27'], constitution: ['hold', '#FAF7F2', '#3D3733'] };
const DEC_TYPES = {
  recycle: ['recycle', '#E3EEE8', '#1F5C45', 'Contributions'], cleared: ['cleared', '#E3EEE8', '#1F5C45', 'Cleared'],
  payment: ['out', '#FAF7F2', '#3D3733', 'Cleared'], pause: ['pause', '#F7EEDC', '#84591A', 'Pauses'],
  resume: ['play', '#FAF7F2', '#3D3733', 'Pauses'], hold: ['hold', '#FAF7F2', '#3D3733', 'Lending'],
  lend: ['out', '#F5E8DC', '#9E5A22', 'Lending'], decline: ['decline', '#F7E5E1', '#9C3A27', 'Lending'], assess: ['assess', '#FAF7F2', '#3D3733', 'Lending'],
};
const TIER = { A: ['#E3EEE8', '#1F5C45', 'Tier A · Reliable', 'Tier A: 12 months of on-time contributions, no missed loan repayments, and a reserve above its floor.'],
  B: ['#F7EEDC', '#84591A', 'Tier B · Some late months', 'Tier B: no more than 2 late months in the last 12, and no defaults.'],
  C: ['#F7E5E1', '#9C3A27', 'Tier C · Higher risk', 'Tier C: missed contributions or a default in the last 12 months. Your constitution doesn’t lend to Tier C.'] };
const LOAN_PILL = { ontrack: ['On track', '#E3EEE8', '#1F5C45', 'check'], duesoon: ['Due soon', '#F7EEDC', '#84591A', 'clock'], overdue: ['Overdue', '#F7E5E1', '#9C3A27', 'alert'] };
const MANDATE = { ACTIVE: ['Active', '#E3EEE8', '#1F5C45', 'check', '#E3EEE8'], PENDING: ['Pending', '#F7EEDC', '#84591A', 'clock', '#F7EEDC'], FAILED: ['Failed', '#F7E5E1', '#9C3A27', 'x', '#F7E5E1'], PAUSED: ['Paused', '#FFFFFF', '#3D3733', 'pause', '#948779'] };
const LEDGER_GROUP = { contribution: 'Contributions', payment: 'Debt payments', cleared: 'Debt payments', recycle: 'Recycled', failed: 'Failed', lend: 'Loans', declined: 'Loans', constitution: 'Constitution' };
const LEDGER_GROUP_TYPES = { Contributions: ['CONTRIBUTION'], 'Debt payments': ['DEBT_PAYMENT', 'DEBT_CLEARED'], Recycled: ['RECYCLED'], Failed: ['COLLECTION_FAILED'], Loans: ['LOAN_OUT', 'LOAN_REPAID', 'LOAN_DECLINED'], Constitution: ['CONSTITUTION_CHANGE'] };
const STOKVEL_TYPE = { grocery: 'GROCERY', rotational: 'ROTATIONAL', burial: 'BURIAL', investment: 'INVESTMENT', debt: 'DEBT_PAYOFF' };

// Illustration for onboarding only: what the agent's ordering looks like once members declare their debts.
const SAMPLE_QUEUE = [['A member', 28, 'payday loan'], ['A member', 24, 'store card'], ['You', 22, 'credit card'], ['A member', 19, 'personal loan']];
// WhatsApp-style live alerts the demo bar can replay. The same events arrive in the bell inbox from the API.
const NOTIFS = [
  { text: 'Your contribution of R800 is due tomorrow.', sub: 'WhatsApp · Reply YES to confirm', action: 'Confirm', bg: '#FFFFFF', bd: '#E8E1D8', ic: '#1F5C45' },
  { text: 'A member’s DebiCheck mandate was cancelled by their bank.', sub: 'WhatsApp · I sent them a link to re-approve', action: 'View', bg: '#F7EEDC', bd: '#EFDDBA', ic: '#84591A' },
  { text: 'A member is now debt-free.', sub: 'WhatsApp · Their freed minimum joins the pool', action: 'View', bg: '#E3EEE8', bd: '#CFE0D7', ic: '#1F5C45' },
];
const SHOW_DEMO = process.env.NEXT_PUBLIC_DEMO === 'true';
const sleep = ms => new Promise(r => setTimeout(r, ms));

export default class App extends React.Component {
  state = { route: 'boot', stokvelId: null, snap: null, view: 'auto', winW: 1280, offline: false,
    sheet: null, statKey: null, entryId: null, decOpen: null, agentSeg: 'All', ledgerSort: { col: 'date', dir: 'desc' }, groupsClosed: {},
    auth: { phone: '', consent: false, tried: false, code: '', codeErr: 0, codeErrText: '', intent: 'new' }, failNext: false,
    invFailed: false, setFailed: false, ledgerFilter: { range: 'all', types: [] }, agentRange: 'all',
    anim: null, loading: false, error: false, notif: null, notifIdx: 0,
    lendTab: 'out', loanId: null, tipId: null, approveStep: 'confirm', settlePct: 0, declineReason: '', declineNote: '',
    memberId: null, memberDetail: null, editAmt: '', inv: { name: '', phone: '', amount: '' }, invTried: false, invSentTo: '', invSentName: '',
    setOpen: 'basics', draft: null, dissolveText: '', toast: null,
    ob: { type: 'debt', name: 'Masakhane Debt Freedom', amount: '800', freq: 'Monthly', count: '10', reserve: '5,000', byRate: true, recycle: true, pct: 100, grace: 0 },
    newStokvelId: null, invited: {}, busy: false };

  componentDidMount() {
    this.onResize = () => this.setState({ winW: window.innerWidth }); this.onResize(); window.addEventListener('resize', this.onResize);
    if (session.get()) this.boot(); else this.setState({ route: 'welcome' });
  }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); clearTimeout(this.tt); clearTimeout(this.nt); cancelAnimationFrame(this.raf); }

  // ------------------------------------------------------------------ data
  async boot(preferred) {
    try {
      const me = await call(api.GET('/me'));
      const ids = me.memberships.map(m => m.stokvelId);
      const list = await call(api.GET('/stokvels'));
      const active = list.filter(s => s.status === 'ACTIVE').map(s => s.id);
      const pick = [preferred, this.state.stokvelId, 'masakhane', ...active].find(x => x && active.includes(x) && ids.includes(x));
      if (!pick) { this.setState({ route: 'welcome' }); return; }
      await this.load(pick);
      this.setState(s => ({ route: s.route === 'boot' || s.route === 'welcome' || s.route.startsWith('onb') || ['signin', 'otp', 'expired'].includes(s.route) ? 'home' : s.route }));
    } catch (e) { this.fail(e); }
  }
  async load(stokvelId, { silent } = {}) {
    if (!silent) this.setState({ loading: true, error: false });
    try {
      const snap = await loadSnapshot(stokvelId);
      this.setState({ snap, stokvelId, loading: false, error: false });
      return snap;
    } catch (e) { this.fail(e); this.setState({ loading: false, error: !(e instanceof ApiError && e.status === 401) }); }
  }
  refresh = () => this.state.stokvelId && this.load(this.state.stokvelId, { silent: true });
  fail(e) {
    if (e instanceof ApiError && e.status === 401) { session.set(null); this.setState({ route: 'expired', snap: null }); return; }
    console.error(e);
  }
  /** Run an API action: on success toast + refresh; on failure show the server's plain-language reason. */
  async act(fn, okText, { after } = {}) {
    if (this.state.failNext) { this.setState({ failNext: false }); this.toast('That didn’t go through. Nothing was saved. Try again.'); return false; }
    try { const res = await fn(); if (after) after(res); if (okText) this.toast(typeof okText === 'function' ? okText(res) : okText); await this.refresh(); return res ?? true; }
    catch (e) { this.fail(e); if (!(e instanceof ApiError && e.status === 401)) this.toast(e.message || 'That didn’t go through.'); return false; }
  }
  p = () => ({ params: { path: { stokvelId: this.state.stokvelId } } });

  nav = route => () => { this.setState({ route, sheet: null }); this.scrollTop(); };
  scrollTop() { setTimeout(() => document.querySelectorAll('main').forEach(m => { if (m.parentElement) m.parentElement.scrollTop = 0; }), 0); }
  toast(t) { this.setState({ toast: t }); clearTimeout(this.tt); this.tt = setTimeout(() => this.setState({ toast: null }), 4000); }
  setOb(p) { this.setState(s => ({ ob: { ...s.ob, ...p } })); }
  notify = () => { const i = this.state.notifIdx % NOTIFS.length; this.setState({ notif: i, notifIdx: i + 1 }); clearTimeout(this.nt); this.nt = setTimeout(() => this.setState({ notif: null }), 8000); };
  replay = (key, from, to) => {
    cancelAnimationFrame(this.raf);
    this.setState({ route: 'home', sheet: null, anim: { key, val: from } }); this.scrollTop();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { this.setState({ anim: null }); return; }
    const ease = t => 1 - Math.pow(1 - t, 3);
    setTimeout(() => {
      const t0 = performance.now();
      const step = now => { const t = Math.min(1, (now - t0) / 400); this.setState({ anim: { key, val: from + (to - from) * ease(t) } }); if (t < 1) this.raf = requestAnimationFrame(step); else setTimeout(() => this.setState({ anim: null }), 50); };
      this.raf = requestAnimationFrame(step);
    }, 600);
  };
  retry = () => this.load(this.state.stokvelId);

  async devLogin(phone) {
    try { const s = await call(api.POST('/dev/sessions', { body: { phone } })); session.set(s.idToken); this.setState({ snap: null, sheet: null }); await this.boot(this.state.stokvelId); this.setState({ route: 'home' }); this.toast('Signed in as ' + s.user.name + '.'); }
    catch (e) { this.toast(e.message); }
  }
  async simulate(type, memberId, extra = {}) {
    const period = new Date().toISOString().slice(0, 7);
    await this.act(() => call(api.POST('/dev/stitch/events', { body: { type, stokvelId: this.state.stokvelId, memberId, period, ...extra } })), null);
    await sleep(2500); await this.refresh();
  }

  startApprove = async () => {
    const id = this.state.loanId;
    if (this.state.failNext) { this.setState({ approveStep: 'sending', settlePct: 0, failNext: false }); setTimeout(() => this.setState({ settlePct: 60 }), 30); setTimeout(() => this.setState({ approveStep: 'failed', settlePct: 0, approveError: 'Arc didn\u2019t confirm the transaction (simulated failure).' }), 1700); return; }
    this.setState({ approveStep: 'sending', settlePct: 0 });
    setTimeout(() => this.setState({ settlePct: 100 }), 30);
    const t0 = Date.now();
    try {
      const res = await call(api.POST('/stokvels/{stokvelId}/loan-requests/{requestId}/approval', { params: { path: { stokvelId: this.state.stokvelId, requestId: id } } }));
      await sleep(Math.max(0, 1700 - (Date.now() - t0)));
      this.setState({ approveStep: 'settled', lastApproval: res });
      await sleep(1000);
      await this.refresh();
      this.setState({ sheet: null, route: 'lend', approveStep: 'confirm', settlePct: 0, lendTab: 'out' });
      this.toast(res.status === 'FUNDED' ? 'Loan approved. Escrow funded.' : 'Loan approved. Escrow funding submitted to Arc.'); this.scrollTop();
    } catch (e) { this.fail(e); this.setState({ approveStep: 'failed', settlePct: 0, approveError: e.message }); }
  };

  async openMember(id) {
    this.setState({ route: 'member', memberId: id, memberDetail: null, editAmt: '' }); this.scrollTop();
    try { const d = await call(api.GET('/stokvels/{stokvelId}/members/{memberId}', { params: { path: { stokvelId: this.state.stokvelId, memberId: id } } })); this.setState({ memberDetail: d }); }
    catch (e) { this.fail(e); }
  }

  // ------------------------------------------------------------------ view model
  renderVals() {
    const s = this.state, snap = s.snap, rt = s.route;
    const effW = s.view === 'auto' ? s.winW : Math.min(+s.view, s.winW);
    const mode = effW >= 1024 ? 'desk' : effW >= 768 ? 'tablet' : 'mobile';
    const isMobile = mode === 'mobile', isDesk = mode === 'desk';
    const fixed = s.view !== 'auto';
    const bar = SHOW_DEMO ? 56 : 0;
    const L = {
      isMobile, isTablet: mode === 'tablet', isDesk, notDesk: !isDesk, hasRail: !isMobile,
      outerPad: fixed ? '24px 16px' : '0', frameW: fixed ? s.view + 'px' : '100%',
      frameH: s.view === '390' ? '844px' : fixed ? `calc(100vh - ${bar + 48}px)` : `calc(100vh - ${bar}px)`,
      frameR: fixed ? '20px' : '0', frameShadow: fixed ? '0 1px 2px rgba(10,9,8,0.06),0 8px 24px rgba(10,9,8,0.06)' : 'none',
      padX: isMobile ? '16px' : isDesk ? '32px' : '24px',
      mainPad: isMobile ? '16px 16px 104px' : isDesk ? '32px 32px 64px' : '24px 24px 48px',
      heroSize: isMobile ? '2.75rem' : '3.5rem', statFig: isMobile ? '1.25rem' : '1.75rem', statPad: isMobile ? '12px' : '16px', statGap: isMobile ? '8px' : '12px',
      cardPad: isMobile ? '16px' : '24px', homeCols: isDesk ? 'minmax(0,8fr) minmax(0,4fr)' : 'minmax(0,1fr)',
      typeCols: isDesk ? 'repeat(3,minmax(0,1fr))' : mode === 'tablet' ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      queueMax: isMobile ? '448px' : 'none', lendCols: isDesk ? 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)' : mode === 'tablet' ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)',
      loanCols: isDesk ? 'minmax(0,5fr) minmax(0,7fr)' : 'minmax(0,1fr)', twoCols: isMobile ? 'minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1fr)', stickyBottom: isMobile ? '72px' : '0px',
      nfTop: isMobile ? '64px' : '72px', toastBottom: isMobile ? '84px' : '24px',
      sL: isMobile ? '0' : '50%', sR: isMobile ? '0' : 'auto', sB: isMobile ? '0' : 'auto', sT: isMobile ? 'auto' : '50%',
      sW: isMobile ? 'auto' : 'min(480px, calc(100% - 48px))', sM: '0', sRad: isMobile ? '16px 16px 0 0' : '12px',
      sTf: isMobile ? 'none' : 'translate(-50%,-50%)', sAnim: isMobile ? 'bt-up 400ms cubic-bezier(0.2,0,0,1)' : 'bt-fade 250ms cubic-bezier(0.2,0,0,1)',
    };

    // ---- who and what
    const onb = ['boot', 'welcome', 'signin', 'otp', 'expired', 'onb-type', 'onb-details', 'onb-const', 'onb-invite'];
    const isOnboarding = onb.includes(rt) || !snap;
    const stk = s.stokvelId;
    const stokvel = snap?.stokvel;
    const isDebt = stokvel?.type === 'DEBT_PAYOFF';
    const myMembership = snap?.me.memberships.find(m => m.stokvelId === stk);
    const isMember = myMembership?.role === 'MEMBER';
    const MEMBERS = snap ? adapt.members(snap) : [];
    const LEDGER = snap ? adapt.ledger(snap.ledger) : [];
    const DECISIONS = snap ? adapt.decisions(snap.decisions) : [];
    const REQS = snap ? adapt.requests(snap.requests) : [];
    const dash = snap?.dashboard;
    const n = adapt.n;
    const treasurer = MEMBERS.find(m => m.treasurer);
    const meMember = MEMBERS.find(m => m.you);
    const startedOn = stokvel?.startedOn;
    const monthOf = m => { if (!startedOn) return ''; const d = new Date(startedOn + 'T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() + m - 1); return MON[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); };
    const debtors = MEMBERS.filter(m => m.hasDebt);
    const allCleared = isDebt && debtors.length > 0 && debtors.every(m => m.bal === 0);
    const v = !snap ? 'populated' : dash?.agentStatus?.state === 'PAUSED' ? 'paused' : LEDGER.length === 0 ? 'empty' : allCleared ? 'cleared' : 'populated';

    const r = {
      welcome: rt === 'welcome' || rt === 'boot', onbStep: ['onb-type', 'onb-details', 'onb-const', 'onb-invite'].includes(rt),
      signin: rt === 'signin', otp: rt === 'otp', expired: rt === 'expired', authHeader: rt === 'signin' || rt === 'otp',
      onbType: rt === 'onb-type', onbDetails: rt === 'onb-details', onbConst: rt === 'onb-const', onbInvite: rt === 'onb-invite',
    };
    const busy = s.loading || s.error;
    Object.assign(r, {
      homeDebt: rt === 'home' && isDebt && !isMember && !busy, homeMember: rt === 'home' && isDebt && isMember && !busy, homeGrocery: rt === 'home' && !isDebt && !busy,
      agent: rt === 'agent' && !busy, ledger: rt === 'ledger' && !busy,
      lend: rt === 'lend' && !isMember && !!stokvel?.lendingEnabled && !busy, lendOff: rt === 'lend' && !isMember && !stokvel?.lendingEnabled && !busy, lendDenied: rt === 'lend' && isMember && !busy,
      loan: rt === 'loan' && !busy, members: rt === 'members' && !busy, member: rt === 'member' && !busy,
      invite: rt === 'invite' && !busy, inviteSent: rt === 'invite-sent' && !busy, settings: rt === 'settings' && !busy && !isMember,
      skelHome: s.loading && rt === 'home', skelList: s.loading && rt !== 'home', errorOn: s.error && !s.loading,
    });
    const go = { signup: () => this.setState({ route: 'signin', auth: { ...s.auth, intent: 'new', tried: false } }), signinExisting: () => this.setState({ route: 'signin', auth: { ...s.auth, intent: 'existing', tried: false } }),
      onbType: this.nav('onb-type'), onbDetails: this.nav('onb-details'), onbConst: this.nav('onb-const'),
      onbInvite: () => this.createStokvel(),
      home: this.nav('home'), ledger: this.nav('ledger'), lend: this.nav('lend'), agent: () => { this.setState({ route: 'agent', sheet: null, decOpen: null, agentSeg: 'All' }); this.scrollTop(); } };

    // ---- demo bar: viewport + real scenarios against the API (dev endpoints)
    const segStyle = sel => ({ bg: sel ? '#FAF7F2' : 'transparent', fg: sel ? '#0A0908' : '#FAF7F2' });
    const devViews = [['390', '390'], ['768', '768'], ['1280', '1280'], ['auto', 'Fit window']].map(([k, label]) => ({ label, ...segStyle(s.view === k), on: () => this.setState({ view: k, sheet: null }) }));
    const pauseTarget = MEMBERS.find(m => m.id === 'lerato') || MEMBERS.find(m => !m.treasurer && !m.grocery) || MEMBERS.find(m => !m.treasurer);
    const failTarget = MEMBERS.find(m => m.id === 'thabo') || pauseTarget;
    const devStates = (snap ? [
      ['Run agent', () => this.act(() => call(api.POST('/stokvels/{stokvelId}/agent/evaluations', this.p())), res => res.reasoning)],
      pauseTarget && [first(pauseTarget.name) + '’s bank cancels mandate', () => this.simulate('MANDATE_CANCELLED', pauseTarget.id)],
      pauseTarget && [first(pauseTarget.name) + ' re-approves', () => this.simulate('MANDATE_AUTHENTICATED', pauseTarget.id)],
      failTarget && [first(failTarget.name) + '’s collection fails', () => this.simulate('PAYMENT_FAILED', failTarget.id, { amount: String(failTarget.amount), reason: 'Insufficient funds' })],
      failTarget && [first(failTarget.name) + ' collected on retry', () => this.simulate('PAYMENT_SUCCEEDED', failTarget.id, { amount: String(failTarget.amount) })],
    ] : [['Sign in as treasurer', () => this.devLogin('0825550147')]]).filter(Boolean).map(([label, on]) => ({ label, ...segStyle(false), on }));

    // ---- onboarding
    const ob = s.ob;
    const typeDefs = [['grocery', 'Grocery', 'Save toward a bulk grocery buy.'], ['rotational', 'Rotational', 'Members take turns receiving the pool.'], ['burial', 'Burial', 'Cover funeral costs when needed.'], ['investment', 'Investment', 'Pool money to invest in assets.'], ['debt', 'Debt-Payoff', 'Destroy your members’ highest-rate debt first.']];
    const typeCards = typeDefs.map(([k, title, desc]) => { const sel = ob.type === k; return { title, desc, sel, icon: IC[k], bg: sel ? '#F5E8DC' : '#FFFFFF', bd: sel ? '#C97B3C' : '#E8E1D8', radioBd: sel ? '6px solid #9E5A22' : '1.5px solid #948779', on: () => this.setOb({ type: k }) }; });
    const segOf = (opts, cur, set) => opts.map(o => { const sel = cur === o.v; return { label: o.l, sel, bg: sel ? '#FFFFFF' : 'transparent', fg: sel ? '#0A0908' : '#3D3733', sh: sel ? '0 1px 2px rgba(10,9,8,0.06)' : 'none', on: () => set(o.v) }; });
    const freqSegs = segOf(['Weekly', 'Fortnightly', 'Monthly'].map(x => ({ l: x, v: x })), ob.freq, f => this.setOb({ freq: f }));
    const freqHelp = { Weekly: 'We’ll collect this every Friday.', Fortnightly: 'We’ll collect this every second Friday.', Monthly: 'We’ll collect this on the 1st of each month.' }[ob.freq];
    const amt = parseInt(String(ob.amount).replace(/\D/g, '')) || 0, cnt = parseInt(String(ob.count).replace(/\D/g, '')) || 0;
    const queueOpts = [{ k: true, title: 'Agent ranks by highest interest rate', desc: 'Recommended. The most expensive debt is cleared first, so the group pays the least interest overall.' }, { k: false, title: 'Members draw lots', desc: 'A random order, drawn once and recorded in the ledger.' }]
      .map(o => { const sel = ob.byRate === o.k; return { ...o, sel, bg: sel ? '#F5E8DC' : '#FFFFFF', bd: sel ? '#C97B3C' : '#E8E1D8', radioBd: sel ? '6px solid #9E5A22' : '1.5px solid #948779', on: () => this.setOb({ byRate: o.k }) }; });
    const avalanche = SAMPLE_QUEUE.map(([name, rate, kind], i) => ({ n: i + 1, name: name === 'You' ? 'You' : name, rate: rate + '% ' + kind }));
    const pctSegs = segOf([50, 75, 100].map(x => ({ l: x + '%', v: x })), ob.pct, p => this.setOb({ pct: p }));
    const preamble = [
      { n: '1', text: 'The group pays the highest-interest debt first. The order is set when everyone joins and only changes by vote.' },
      { n: '2', text: 'Contribute ' + fmt(amt) + ' ' + ob.freq.toLowerCase() + ' by DebiCheck, and keep paying your own minimum until your debt is cleared.' },
      { n: '3', text: ob.recycle ? 'When your debt is cleared, ' + (ob.pct === 100 ? 'your full minimum' : ob.pct + '% of your minimum') + ' goes into the pool ' + (ob.grace ? 'after ' + ob.grace + (ob.grace === 1 ? ' month' : ' months') : 'from the next month') + ', until everyone is free.' : 'When your debt is cleared, you keep your freed minimum.' },
      { n: '4', text: 'If you leave before everyone is free, you repay what the pool paid on your behalf, less what you contributed.' },
    ];
    // Only the treasurer exists so far; members are invited by name and number on the next screen.
    const inviteRows = [{ name: 'You', ini: 'ME', sub: 'Treasurer', avBg: '#F5E8DC', you: true, invited: false, canInvite: false, on: () => {} }];

    // ---- stokvel identity
    const sv = stokvel ? { name: stokvel.name, typeLabel: adapt.typeName(stokvel.type) } : { name: ob.name, typeLabel: '' };
    const memberCount = MEMBERS.length;

    // ---- home (debt-payoff)
    const pill = kind => ({
      cleared: { pill: 'Cleared', pillBg: '#E3EEE8', pillFg: '#1F5C45', pillBd: '#E3EEE8', pillIcon: IC.check },
      current: { pill: 'Current', pillBg: '#F5E8DC', pillFg: '#9E5A22', pillBd: '#F5E8DC', pillIcon: IC.dot },
      waiting: { pill: 'Waiting', pillBg: '#FAF7F2', pillFg: '#3D3733', pillBd: '#E8E1D8', pillIcon: IC.clock },
    })[kind];
    const queue = debtors.map((m, i) => {
      const st = (m.queueStatus || 'WAITING').toLowerCase();
      const detail = fmt(st === 'cleared' ? m.debt0 : m.bal) + ' · ' + m.rate + '% ' + m.kind;
      const when = st === 'cleared' ? 'Cleared ' + (m.clearedOn ? adapt.dayMon(m.clearedOn) : '') : 'Month ' + m.m + ' · ' + monthOf(m.m);
      return { n: i + 1, name: m.name + (m.you ? ' (you)' : ''), detail, when, cur: st === 'current' ? 'true' : 'false', strike: st === 'cleared' ? 'line-through' : 'none',
        rowBg: st === 'current' ? '#FBF3EC' : 'transparent', numBg: st === 'current' ? '#F5E8DC' : st === 'cleared' ? '#E3EEE8' : '#FFFFFF', numBd: st === 'current' ? '#F5E8DC' : st === 'cleared' ? '#E3EEE8' : '#E8E1D8', ...pill(st) };
    });
    const debt0 = n(dash?.debtAtStart), balNow = n(dash?.debtRemaining), pool = n(dash?.poolBalance), reserve = n(dash?.reserveFloor), above = n(dash?.aboveReserve);
    const clearedC = debtors.filter(m => m.bal === 0);
    const current = debtors.find(m => m.queueStatus === 'CURRENT');
    const nextPayout = dash?.nextPayout;
    const activeContrib = MEMBERS.filter(m => m.mandate === 'ACTIVE').reduce((a, m) => a + m.amount, 0);
    const statSheet = key => () => this.setState({ sheet: 'stat', statKey: key });
    const recycledBars = (dash?.recycledByMonth || []).slice(-10);
    const maxRec = Math.max(1, ...recycledBars.map(x => n(x.amount)));
    const monthLabel = ym => { const [y, m] = ym.split('-'); return MON[+m - 1] + ' ' + y; };
    let home;
    if (v === 'empty') {
      home = { idLine: sv.typeLabel + ' · ' + memberCount + ' members · Starts ' + (startedOn ? dayMonYear(startedOn) : 'soon'), heroLabel: 'Debt to clear', heroValue: fmt(debt0), heroColor: '#0A0908', heroAria: 'Debt to clear, ' + words(debt0) + ' rand',
        delta: debtors.length ? 'As declared by members' : 'Members declare their debts when they accept the invitation', deltaArrow: false, deltaColor: '#3D3733', pct: '0%', pctNum: 0, pctLabel: '0% cleared',
        stats: [['Interest saved', 'R0', '#0A0908', 'interest'], ['Members free', '0 of ' + memberCount, '#0A0908', 'free'], ['Current pool', fmt(pool), '#0A0908', 'pool']],
        showFocus: !!current, showSavings: false,
        recycled: { label: 'Recycled so far', value: 'R0', sub: 'When a member’s debt is cleared, their minimum moves into the pool. It will show here.', hasChart: false } };
    } else if (v === 'cleared') {
      home = { idLine: sv.typeLabel + ' · ' + memberCount + ' members · Month ' + (stokvel.currentMonth || 0) + ' of ' + (stokvel.totalMonths || '—'), heroLabel: 'Pool balance', heroValue: fmt(pool), heroColor: '#1F5C45', heroAria: 'Pool balance, ' + words(pool) + ' rand',
        delta: fmt(debt0) + ' of debt cleared', deltaArrow: false, deltaColor: '#1F5C45', pct: '100%', pctNum: 100, pctLabel: '100% cleared',
        stats: [['Interest saved', fmt(n(dash.interestSaved)), '#1F5C45', 'interest'], ['Members free', memberCount + ' of ' + memberCount, '#0A0908', 'free'], ['Saving monthly', fmt(activeContrib + debtors.reduce((a, m) => a + m.min, 0)), '#0A0908', 'pool']],
        showFocus: false, showSavings: true, recycled: {},
        savingsTitle: 'Savings phase begins next month',
        savingsText: 'Every member is debt-free. From now on, each contribution and every freed minimum builds the pool: ' + fmt(activeContrib + debtors.reduce((a, m) => a + m.min, 0)) + ' a month. Members will vote on what the savings are for.' };
    } else {
      home = { idLine: sv.typeLabel + ' · ' + memberCount + ' members · Month ' + (stokvel?.currentMonth || 0) + ' of ' + (stokvel?.totalMonths || '—'), heroLabel: 'Total debt remaining', heroValue: fmt(balNow), heroColor: '#0A0908', heroAria: 'Total debt remaining, ' + words(balNow) + ' rand',
        delta: fmt(debt0 - balNow) + ' cleared since ' + (startedOn ? dayMonYear(startedOn) : 'the start'), deltaArrow: true, deltaColor: '#1F5C45',
        pct: (debt0 ? (debt0 - balNow) / debt0 * 100 : 0).toFixed(1) + '%', pctNum: Math.round(debt0 ? (debt0 - balNow) / debt0 * 100 : 0), pctLabel: Math.round(debt0 ? (debt0 - balNow) / debt0 * 100 : 0) + '% cleared',
        stats: [['Interest saved', fmt(n(dash?.interestSaved)), '#1F5C45', 'interest'], ['Members free', (dash?.membersFree ?? 0) + ' of ' + debtors.length, '#0A0908', 'free'], ['Current pool', fmt(pool), '#0A0908', 'pool']],
        showFocus: !!current, showSavings: false, recycled: {} };
    }
    if (current) {
      const paid = current.debt0 - current.bal;
      home.focus = { label: v === 'empty' ? 'First in the queue' : 'Paying off next', pill: v === 'empty' ? 'Month 1' : nextPayout ? 'From ' + adapt.dayMon(nextPayout.date) : 'Next', name: current.name,
        line: cap(current.kind) + ' · ' + fmt(current.bal) + ' · ' + current.rate + '%', pct: (current.debt0 ? paid / current.debt0 * 100 : 0).toFixed(0) + '%', pctNum: Math.round(current.debt0 ? paid / current.debt0 * 100 : 0),
        progress: fmt(paid) + ' paid of ' + fmt(current.debt0) + (paid > 0 ? ', from their own minimums' : ''), clear: 'Month ' + current.m + ' · ' + monthOf(current.m),
        avoided: fmt(interestOnMinimums(current.bal, current.rate, current.min)),
        note: nextPayout ? 'The pool’s next payment to ' + first(current.name) + '’s ' + current.kind + ' is ' + fmt(n(nextPayout.amount)) + ' on ' + adapt.dayMon(nextPayout.date) + ': ' + fmt(activeContrib) + ' in contributions plus ' + fmt(above) + ' already above the reserve.' : 'The first payment goes out once every mandate is active and the first contributions are collected.' };
    }
    if (v !== 'empty' && v !== 'cleared') {
      const lastRec = LEDGER.filter(e => e.type === 'recycle').slice(-1)[0];
      home.recycled = { label: 'Recycled this month', value: fmt(n(dash?.recycledThisMonth)), sub: lastRec ? first(lastRec.who) + '’s minimum, redirected into the pool after their debt cleared.' : 'When a member’s debt is cleared, their minimum moves into the pool.',
        hasChart: recycledBars.length > 0, chartAria: 'Recycled per month: ' + recycledBars.map(x => fmt(n(x.amount)) + ' in ' + monthLabel(x.month)).join(', '),
        range: recycledBars.length ? monthLabel(recycledBars[0].month).slice(0, 3) + ' – ' + monthLabel(recycledBars[recycledBars.length - 1].month) : '',
        bars: recycledBars.map(x => ({ h: Math.max(3, Math.round(n(x.amount) / maxRec * 48)) + 'px', bg: n(x.amount) ? '#1F5C45' : '#E8E1D8' })) };
    } else if (v === 'cleared') {
      home.recycled = { label: 'Recycled each month', value: fmt(debtors.reduce((a, m) => a + m.min, 0)), sub: 'Every freed minimum now goes into the pool, alongside contributions.', hasChart: false };
    }
    if (s.anim && (v === 'populated' || v === 'paused')) {
      const val = s.anim.val;
      if (s.anim.key === 'debt') { const c = debt0 - val; home.heroValue = fmt(val); home.delta = fmt(c) + ' cleared since ' + dayMonYear(startedOn); home.pct = (c / debt0 * 100).toFixed(2) + '%'; home.pctLabel = Math.round(c / debt0 * 100) + '% cleared'; }
      else home.stats[2] = [home.stats[2][0], fmt(val), home.stats[2][2], home.stats[2][3]];
    }
    const failedMandates = MEMBERS.filter(m => m.mandate === 'FAILED');
    home.pausedBanner = v === 'paused';
    home.bannerBold = failedMandates.length ? failedMandates[0].name + '’s mandate was cancelled by their bank.' : 'Payouts are paused.';
    home.bannerText = failedMandates.length ? 'The next payout is on hold until they re-approve it. The other ' + (memberCount - failedMandates.length) + ' mandates are active.' : (dash?.agentStatus?.message || '');
    home.queue = queue;
    home.stats = home.stats.map(([label, value, color, key]) => ({ label, value, color, aria: label + ', ' + value + '. Explain.', on: statSheet(key) }));

    // ---- agent status card (from the dashboard)
    const as = dash?.agentStatus || { state: 'WAITING', message: 'Waiting for the first contribution.' };
    const agent = as.state === 'PAUSED'
      ? { frame: '#F7EEDC', fg: '#84591A', icon: IC.pause, state: 'Payout paused', time: as.since ? 'Since ' + adapt.dayMon(as.since.slice(0, 10)) : '', text: as.message, primary: 'See reasoning', canResume: !isMember, decId: as.decisionId }
      : as.state === 'WAITING'
      ? { frame: '#F5E8DC', fg: '#3D3733', icon: IC.clock, state: 'Agent waiting', time: MEMBERS.filter(m => m.mandate === 'ACTIVE').length + ' of ' + memberCount + ' mandates active', text: 'Waiting for the first contribution. Invite your members to begin.', primary: isMember ? 'See reasoning' : 'Invite members', canResume: false, invite: !isMember }
      : { frame: '#F5E8DC', fg: '#3D3733', icon: IC.dot, state: 'Agent active', time: as.checkedAt ? 'Checked ' + rel(as.checkedAt).toLowerCase() : '', text: as.message, primary: 'See reasoning', canResume: false, decId: as.decisionId };
    agent.primaryOn = agent.invite ? () => this.goInvite() : () => { this.setState({ route: 'agent', decOpen: agent.decId, agentSeg: 'All', sheet: null }); this.scrollTop(); };

    // ---- ledger
    const decorate = e => {
      const [ic, ibg, ifg] = TYPE_ICON[e.type];
      const failed = e.type === 'failed', declined = e.type === 'declined', cons = e.type === 'constitution';
      const amtStr = cons ? '—' : failed ? fmt2(e.failAmt) : declined ? 'R0.00' : (e.amt > 0 ? '+' : '−') + fmt2(e.amt);
      const amtColor = cons || declined ? '#6B625B' : failed ? '#9C3A27' : e.amt > 0 ? '#1F5C45' : '#0A0908';
      const d = new Date(e.date + 'T12:00');
      return { ...e, typeLabel: TYPE_LABEL[e.type], failed: failed || declined, icon: IC[ic], iconBg: ibg, iconFg: ifg,
        amt: amtStr, amtShort: cons ? '—' : failed ? 'Failed' : declined ? 'R0' : (e.amt > 0 ? '+' : '−') + fmt(e.amt), amtColor, bal: fmt2(e.balance),
        dateLong: longDate(e.date), dateShort: d.getDate() + ' ' + MON[d.getMonth()], rel: rel(e.date + 'T' + e.time),
        month: MONL[d.getMonth()] + ' ' + d.getFullYear(), on: () => this.setState({ sheet: 'entry', entryId: e.id }) };
    };
    const ledger = LEDGER.map(decorate);
    const desc = [...ledger].reverse();
    const activity = desc.slice(0, 5);
    const { col, dir } = s.ledgerSort;
    const keyOf = e => col === 'date' ? e.date + e.time + e.id : col === 'type' ? e.typeLabel : col === 'desc' ? e.desc : col === 'amount' ? (LEDGER.find(x => x.id === e.id)?.amt ?? 0) : e.balance;
    const today = new Date();
    const lfMin = { week: new Date(today - 7 * 86400000).toISOString().slice(0, 10), month: today.toISOString().slice(0, 8) + '01', all: '0' }[s.ledgerFilter.range];
    const lf = e => e.date >= lfMin && (s.ledgerFilter.types.length === 0 || s.ledgerFilter.types.includes(LEDGER_GROUP[e.type]));
    const ledgerTable = [...ledger].filter(lf).sort((a, b) => { const x = keyOf(a), y = keyOf(b); return (x > y ? 1 : x < y ? -1 : 0) * (dir === 'asc' ? 1 : -1); });
    const ledgerCols = [['date', 'Date', 'left'], ['type', 'Type', 'left'], ['desc', 'Description', 'left'], ['amount', 'Amount', 'right'], ['balance', 'Balance', 'right']].map(([k, label, align]) => {
      const active = col === k;
      return { label, align, justify: align === 'right' ? 'flex-end' : 'flex-start', arrow: active ? (dir === 'asc' ? '▲' : '▼') : '', aria: active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none',
        on: () => this.setState({ ledgerSort: { col: k, dir: active && dir === 'desc' ? 'asc' : 'desc' } }) };
    });
    const groupsMap = {}; desc.filter(lf).forEach(e => { (groupsMap[e.month] = groupsMap[e.month] || []).push(e); });
    const ledgerGroups = Object.keys(groupsMap).map(label => { const open = !s.groupsClosed[label]; return { label, open, rows: groupsMap[label], count: groupsMap[label].length + (groupsMap[label].length === 1 ? ' entry' : ' entries'), chev: open ? 'rotate(180deg)' : 'none', toggle: () => this.setState(st => ({ groupsClosed: { ...st.groupsClosed, [label]: open } })) }; });
    const lastBal = snap ? n(snap.ledger.balance) : 0;

    const entryRaw = LEDGER.find(e => e.id === s.entryId);
    let entry = { rows: [], bean: '', amt: '', amtColor: '#0A0908', typeLabel: '', hasDecision: false, hash: '' };
    if (entryRaw) {
      const e = decorate(entryRaw);
      const dec = DECISIONS.find(d => d.id === e.dec);
      entry = { amt: e.amt, amtColor: e.amtColor, typeLabel: e.typeLabel + (e.who ? ' · ' + e.who : ''),
        rows: [{ k: 'Description', v: e.desc }, { k: 'Running balance', v: e.bal }, { k: 'Recorded', v: e.dateLong + ', ' + e.time + ' · ' + e.rel }, { k: 'Timestamp', v: e.date + 'T' + e.time + ':00+02:00' }, { k: 'Entry ID', v: e.id }]
          .concat(entryRaw.reasoning ? [{ k: 'Reason', v: entryRaw.reasoning }] : []).concat(entryRaw.arcFull ? [{ k: 'Arc transaction', v: entryRaw.arc }] : []),
        hasDecision: !!dec, decisionLabel: dec ? (DEC_TYPES[dec.type][3] === 'Pauses' ? 'Pause rule' : TYPE_LABEL[e.type]) : '',
        openDecision: () => { this.setState({ route: 'agent', sheet: null, decOpen: dec.id, agentSeg: 'All' }); this.scrollTop(); },
        bean: entryRaw.bean || '(not yet written to Beancount)', hash: entryRaw.hash || '—' };
    }

    // ---- agent feed
    const agentSegs = ['All', 'Lending', 'Contributions', 'Pauses', 'Cleared'].map(l => { const sel = s.agentSeg === l; return { label: l, sel, bg: sel ? '#FFFFFF' : 'transparent', fg: sel ? '#0A0908' : '#3D3733', sh: sel ? '0 1px 2px rgba(10,9,8,0.06)' : 'none', on: () => this.setState({ agentSeg: l, decOpen: null }) }; });
    const arMin = s.agentRange === 'all' ? 0 : Date.now() - (+s.agentRange) * 86400000;
    const filtered = DECISIONS.filter(d => new Date(d.when) >= arMin).filter(d => s.agentSeg === 'All' || DEC_TYPES[d.type][3] === s.agentSeg);
    const decisions = filtered.map(d => { const [ic, bg, fg] = DEC_TYPES[d.type]; const open = s.decOpen === d.id; return { ...d, icon: IC[ic], iconBg: bg, iconFg: fg, rel: rel(d.when), open, chev: open ? 'rotate(180deg)' : 'none',
      saw: d.saw.map(([k, v2]) => ({ k, v: v2 })), hasLedger: !!d.ledger && LEDGER.some(e => e.id === d.ledger), hasArc: !!d.arc,
      toggle: () => this.setState({ decOpen: open ? null : d.id }), openLedger: () => this.setState({ sheet: 'entry', entryId: d.ledger }) }; });

    // ---- stat sheets (every figure explains itself)
    const savedRows = clearedC.map(m => [m.name, 'Cleared ' + (m.clearedOn ? dayMonYear(m.clearedOn) : '')]);
    const statDefs = {
      interest: { title: 'Interest saved', value: fmt(n(dash?.interestSaved)), color: n(dash?.interestSaved) ? '#1F5C45' : '#0A0908',
        body: 'The interest cleared members would have paid on their own minimums alone, less the interest that accrued while the group cleared their debts.',
        rows: savedRows.length ? savedRows.concat([['Saved', fmt(n(dash?.interestSaved)), 600]]) : [['Debts cleared', '0']] },
      free: { title: 'Members free', value: (dash?.membersFree ?? 0) + ' of ' + debtors.length, color: '#0A0908', body: 'A member is free when their declared debt reaches zero. Their minimum then goes into the pool.',
        rows: savedRows.concat(current ? [['Next: ' + current.name, 'Month ' + current.m + ' · ' + monthOf(current.m)]] : []) },
      pool: { title: v === 'cleared' ? 'Saving monthly' : 'Current pool', value: fmt(pool), color: '#0A0908', body: 'Money held for the group right now. The reserve floor is never paid out, so a late contribution can’t stop the plan.',
        rows: [['Reserve floor', fmt(reserve)], ['Above the reserve', fmt(above)], ['Total', fmt(pool), 600]] },
    };
    const st = statDefs[s.statKey] || statDefs.pool;
    const stat = { ...st, rows: st.rows.map(([k, v2, w]) => ({ k, v: v2, w: w || 400 })) };

    const switcherRows = (snap?.stokvels || []).map(x => { const cur = x.id === stk; return { name: x.name, sub: cap(adapt.typeName(x.type).replace(' Stokvel', '')) + ' · ' + x.memberCount + ' members · ' + (x.status === 'INVITED' ? fmt(n(x.contributionAmount)) + ' a month' : cap((x.role || '').toLowerCase())),
      tag: x.status === 'INVITED' ? 'Invited' : cur ? 'Current' : '', bg: cur ? '#F5E8DC' : '#FFFFFF', bd: cur ? '#C97B3C' : '#E8E1D8', disabled: false,
      on: x.status === 'INVITED' ? () => this.toast('Open the SMS from ' + x.name + ' to accept the invitation.') : async () => { this.setState({ sheet: null, route: 'home', decOpen: null, stokvelId: x.id }); await this.load(x.id); this.scrollTop(); } }; });

    const navDefs = isMember ? [['home', 'Home', 'home'], ['ledger', 'Ledger', 'ledger'], ['members', 'Members', 'members']] : [['home', 'Home', 'home'], ['ledger', 'Ledger', 'ledger'], ['lend', 'Lend', 'lend'], ['members', 'Members', 'members']];
    const curTab = { loan: 'lend', member: 'members', invite: 'members', 'invite-sent': 'members' }[rt] || rt;
    const tabItems = navDefs.map(([k, label, ic]) => { const cur = curTab === k; return { label, icon: IC[ic], cur: cur ? 'page' : 'false', fg: cur ? '#0A0908' : '#6B625B', bar: cur ? '#C97B3C' : 'transparent', on: this.nav(k) }; });
    L.tabCols = `repeat(${navDefs.length},1fr)`;
    const navItems = [...navDefs, ['agent', 'Agent activity', 'agent']].concat(isMember ? [] : [['settings', 'Stokvel settings', 'settings']]).map(([k, label, ic]) => { const cur = curTab === k; return { label, icon: IC[ic], cur: cur ? 'page' : 'false', fg: cur ? '#0A0908' : '#3D3733', deskBg: cur ? '#F5E8DC' : 'transparent', on: k === 'agent' ? go.agent : this.nav(k) }; });
    const pageTitle = { home: 'Home', ledger: 'Ledger', agent: 'Agent activity', lend: 'Lend', loan: 'Loan request', members: 'Members', member: 'Member', invite: 'Invite a member', 'invite-sent': 'Invite a member', settings: 'Stokvel settings' }[rt] || '';

    // ---- grocery / non-debt home
    const lendable = snap?.lendable;
    const loansOut = snap?.loansOut || [];
    const outstanding = loansOut.reduce((a, l) => a + n(l.principal) - n(l.repaid), 0);
    const target = n(stokvel?.target);
    const failedNow = MEMBERS.filter(m => m.mandate === 'FAILED').length;
    const gh = { idLine: sv.typeLabel + ' · ' + memberCount + ' members' + (stokvel?.payoutDate ? ' · Payout ' + dayMonYear(stokvel.payoutDate) : ''), pool: fmt(pool), poolAria: 'Pool balance, ' + words(pool) + ' rand',
      added: fmt(n(dash?.addedThisMonth)) + ' added this month', pctNum: target ? Math.min(100, Math.round(pool / target * 100)) : 0, pct: (target ? Math.min(100, pool / target * 100) : 0).toFixed(0) + '%',
      progress: (target ? fmt(pool) + ' of the ' + fmt(target) + ' target' : fmt(pool) + ' in the pool') + (outstanding > 0 ? ' · ' + fmt(outstanding) + ' is out on loan' + (loansOut[0] ? ', due back ' + adapt.dayMon(loansOut[0].dueDate) : '') : '') };
    const daysToPayout = stokvel?.payoutDate ? Math.max(0, Math.round((new Date(stokvel.payoutDate + 'T00:00:00Z') - new Date(today.toISOString().slice(0, 10) + 'T00:00:00Z')) / 86400000)) : null;
    const lastContribution = LEDGER.filter(e => e.type === 'contribution').slice(-1)[0];
    const groceryStats = [
      { label: 'Members paid up', value: (memberCount - failedNow) + ' of ' + memberCount, sub: failedNow ? failedNow + ' collection' + (failedNow === 1 ? '' : 's') + ' failed' : 'Everyone is up to date', subColor: failedNow ? '#9C3A27' : '#3D3733' },
      { label: 'Added this month', value: fmt(n(dash?.addedThisMonth)), sub: lastContribution ? 'Collected ' + adapt.dayMon(lastContribution.date) : 'Nothing yet', subColor: '#3D3733' },
      { label: 'Days to payout', value: daysToPayout == null ? '—' : String(daysToPayout), sub: stokvel?.payoutDate ? dayMonYear(stokvel.payoutDate) : 'No payout date', subColor: '#3D3733' },
    ];

    // ---- lend
    const lendableAmt = n(lendable?.lendable), lentToday = n(lendable?.lentToday), lpool = n(lendable?.pool) || 1;
    const obl = (lendable?.obligations || []).reduce((a, o) => a + n(o.amount), 0);
    const tipFor = (id, tier) => ({ tipOpen: s.tipId === id, tip: TIER[tier][3], tipToggle: () => this.setState({ tipId: s.tipId === id ? null : id }) });
    const reqs = REQS.map(q => ({ ...q, line: fmt(q.amount) + ' · ' + q.days + ' days · ' + q.rate + '%', tierBg: TIER[q.tier][0], tierFg: TIER[q.tier][1], tierLabel: TIER[q.tier][2], ...tipFor(q.id, q.tier),
      on: () => { this.setState({ route: 'loan', loanId: q.id, tipId: null }); this.scrollTop(); } }));
    const loanRow = l => { const [pl, pbg, pfg, pic] = LOAN_PILL[l.status]; return { ...l, line: fmt(l.principal) + ' · ' + l.rate + '% · ' + l.days + ' days', pct: Math.round(l.total ? l.repaid / l.total * 100 : 0) + '%', progress: fmt(l.repaid) + ' of ' + fmt(l.total) + ' repaid · due ' + l.due, pill: pl, pillBg: pbg, pillFg: pfg, pillIcon: IC[pic] }; };
    const outs = adapt.loans(loansOut).map(loanRow), bors = adapt.loans(snap?.loansIn || []).map(loanRow);
    const lendTabs = [['out', 'Lending out (' + outs.length + ')'], ['in', 'Borrowed (' + bors.length + ')']].map(([k, label]) => { const sel = s.lendTab === k; return { label, sel, fg: sel ? '#0A0908' : '#6B625B', bar: sel ? '#0A0908' : 'transparent', on: () => this.setState({ lendTab: k }) }; });
    const loans = s.lendTab === 'out' ? outs : bors;
    const firstObl = lendable?.obligations?.[0];
    const lend = { lendable: fmt(lendableAmt), lendableAria: 'Money you can lend safely, ' + words(lendableAmt) + ' rand', pool: fmt(n(lendable?.pool)), reserve: fmt(n(lendable?.reserveFloor)),
      obl: fmt(obl), oblLabel: firstObl ? firstObl.label + ', ' + adapt.dayMon(firstObl.due) : 'No obligations',
      resW: (n(lendable?.reserveFloor) / lpool * 100).toFixed(1) + '%', oblW: (obl / lpool * 100).toFixed(1) + '%', lendW: (lendableAmt / lpool * 100).toFixed(1) + '%', lockedW: (lentToday / lpool * 100).toFixed(1) + '%',
      hasLoaned: lentToday > 0, loanedText: 'Lent today ' + fmt(lentToday),
      barAria: 'Of ' + words(n(lendable?.pool)) + ' rand: ' + words(n(lendable?.reserveFloor)) + ' reserve floor and ' + words(obl) + ' in obligations are locked. The rest can be lent.',
      payout: stokvel?.payoutDate ? adapt.dayMon(stokvel.payoutDate) : 'next',
      outNote: outs.length ? 'Loans already out (' + outs.map(l => fmt(l.total - l.repaid) + ' owed by ' + l.name).join(', ') + ') are due back before the payout, so they aren’t counted against you.' : 'You have no loans out right now.' };
    const q0 = REQS.find(q => q.id === s.loanId) || REQS[0] || { id: '', name: '', type: '', amount: 0, days: 0, rate: 0, tier: 'B', members: 0, months: 0, due: '', interest: 0, record: '', loans: 0, defaults: 0, resBal: 1, resFloor: 0, escrow: '', recommend: false, reasoning: '', purpose: '' };
    const loan = { ...q0, amountText: fmt(q0.amount), termLine: 'for ' + q0.days + ' days at ' + q0.rate + '% a year', tierBg: TIER[q0.tier][0], tierFg: TIER[q0.tier][1], tierLabel: TIER[q0.tier][2], tierTip: TIER[q0.tier][3],
      idLine: q0.type + ' · ' + q0.members + ' members · Active ' + q0.months + ' months', reasonLabel: q0.recommend ? 'Why I’d approve' : 'Why I’d decline this term',
      bars: (q0.record || '').split('').map(c => ({ h: c === 'o' ? '32px' : '14px', bg: c === 'o' ? '#1F5C45' : '#F7EEDC', bd: c === 'o' ? '#1F5C45' : '#A8761F' })),
      recordText: (q0.record || '').split('').filter(c => c === 'o').length + ' of ' + (q0.record || '').length + ' months on time',
      tenureW: Math.min(100, q0.months / 36 * 100).toFixed(0) + '%', tenureText: q0.months + ' of 36 months',
      dots: Array.from({ length: q0.members }, (_, i) => ({ i })), checks: Array.from({ length: q0.loans }, (_, i) => ({ i })),
      repayText: q0.loans + ' prior ' + (q0.loans === 1 ? 'loan' : 'loans') + ', ' + q0.defaults + ' defaults',
      resBalW: '100%', resFloorW: (q0.resBal ? Math.min(100, q0.resFloor / q0.resBal * 100) : 0).toFixed(0) + '%', resText: fmt(q0.resBal) + ' balance vs ' + fmt(q0.resFloor) + ' floor',
      approveLabel: 'Approve ' + fmt(q0.amount), after: fmt(Math.max(0, lendableAmt - q0.amount)), now: fmt(lendableAmt),
      repayLine: 'Repaid by ' + q0.due + ', with ' + fmt(q0.interest) + ' interest. ' + (q0.recommend ? 'Your payout isn’t affected.' : 'Your payout falls inside this term.') };
    const settleLabel = s.approveStep === 'settled' ? 'Settled' + (s.lastApproval?.jobId ? ' · ERC-8183 job ' + s.lastApproval.jobId : '') : 'Sending ' + fmt(q0.amount) + ' to ' + q0.name;
    const declineReasons = ['Payout is too close', 'Their contribution record is too short', 'Rate is too low for the risk', 'Something else'];

    // ---- members
    const roster = MEMBERS.map(m => { const md = MANDATE[m.mandate]; return { id: m.id, name: m.name + (m.you && !isMember ? ' (you)' : ''), ini: m.ini, avBg: m.treasurer ? '#F5E8DC' : '#FAF7F2',
      sub: m.treasurer ? 'Treasurer' + (m.you ? ' · You' : '') : (m.you ? 'You · ' : '') + fmt(m.amount) + '/month', pill: md[0], pillBg: md[1], pillFg: md[2], pillIcon: IC[md[3]], pillBd: md[4],
      on: () => this.openMember(m.id) }; });
    const rosterBanner = failedMandates.length ? failedMandates.map(m => m.name).join(', ') + (failedMandates.length === 1 ? '’s mandate isn’t active. ' : ' don’t have active mandates. ') + 'The other ' + (memberCount - failedMandates.length) + ' mandates are active.' : '';
    const mm = MEMBERS.find(m => m.id === s.memberId) || MEMBERS[0] || { name: '', ini: '', id: '', amount: 0, mandate: 'PENDING', phone: '', debt0: 0, bal: 0, min: 0, rate: 0, kind: '', m: 0 };
    const md = s.memberDetail && s.memberDetail.id === mm.id ? s.memberDetail : null;
    const mmMd = MANDATE[mm.mandate];
    const cellFor = c => ({ COLLECTED: 'ok', RETRIED: 'late', FAILED: 'fail', PENDING: 'due', DUE: 'due', UPCOMING: 'up' })[c.status] || 'up';
    const cell = (label, stt) => ({ label, ...({ ok: { icon: IC.check, bg: '#E3EEE8', fg: '#1F5C45', bd: '#E3EEE8', text: 'On time' }, late: { icon: IC.clock, bg: '#F7EEDC', fg: '#84591A', bd: '#F7EEDC', text: 'Retried' }, fail: { icon: IC.x, bg: '#F7E5E1', fg: '#9C3A27', bd: '#F7E5E1', text: 'Failed' }, due: { icon: IC.clock, bg: '#FFFFFF', fg: '#3D3733', bd: '#948779', text: 'Due' }, up: { icon: '', bg: '#FAF7F2', fg: '#6B625B', bd: '#E8E1D8', text: 'Upcoming' } })[stt] });
    const contribs = md?.contributions || [];
    const history = contribs.slice(-3).map(c => cell(MON[+c.period.slice(5) - 1], cellFor(c)));
    { const lastP = contribs.length ? contribs[contribs.length - 1].period : today.toISOString().slice(0, 7); let [y, mo] = lastP.split('-').map(Number);
      while (history.length < 6) { mo++; if (mo > 12) { mo = 1; y++; } history.push(cell(MON[mo - 1], history.length === contribs.slice(-3).length ? 'due' : 'up')); } }
    const contributed = contribs.filter(c => c.status === 'COLLECTED' || c.status === 'RETRIED').reduce((a, c) => a + n(c.amount), 0);
    const member = { name: mm.name, ini: mm.ini, avBg: mm.treasurer ? '#F5E8DC' : '#FAF7F2', roleLine: (mm.treasurer ? 'Treasurer · ' : 'Member · ') + fmt(mm.amount) + ' a month · ' + mm.phone,
      history, emptyHist: md && contribs.length === 0, emptyHistText: 'No contributions yet. The first is due once ' + first(mm.name) + ' approves the DebiCheck mandate.', mandId: mm.mandateId || 'Not approved yet', mandCreated: mm.mandateCreated ? dayMonYear(mm.mandateCreated) : '—',
      pill: mmMd[0], pillBg: mmMd[1], pillFg: mmMd[2], pillIcon: IC[mmMd[3]], pillBd: mmMd[4], amount: fmt(mm.amount) + ' ' + (stokvel?.frequency || 'MONTHLY').toLowerCase() + ', on the ' + (stokvel?.collectionDay === 14 ? '14th' : '1st'),
      hasDebt: !!mm.hasDebt, debtRows: mm.hasDebt ? [{ k: 'Debt', v: cap(mm.kind) + ' at ' + mm.rate + '%' }, { k: 'Balance', v: mm.bal === 0 ? 'Cleared ' + (mm.clearedOn ? dayMonYear(mm.clearedOn) : '') : fmt(mm.bal) + ' of ' + fmt(mm.debt0) }, { k: 'Own minimum', v: fmt(mm.min) + ' a month' + (mm.bal === 0 ? ', now recycled' : '') }, { k: 'Queue position', v: (debtors.indexOf(mm) + 1) + ' of ' + debtors.length }, { k: 'Projected clear', v: 'Month ' + mm.m + ' · ' + monthOf(mm.m) }] : [],
      paused: mm.mandate === 'PAUSED', pauseLabel: mm.mandate === 'PAUSED' ? 'Resume mandate' : 'Pause mandate', canAct: !isMember,
      togglePause: () => { const p = mm.mandate === 'PAUSED'; const path = { params: { path: { stokvelId: stk, memberId: mm.id } } };
        this.act(() => call(p ? api.POST('/stokvels/{stokvelId}/members/{memberId}/resume', path) : api.POST('/stokvels/{stokvelId}/members/{memberId}/pause', path)),
          p ? 'Mandate resumed. ' + first(mm.name) + ' will be debited on the next collection.' : 'Mandate paused. ' + first(mm.name) + ' won’t be debited until you resume it.'); } };
    const paidFor = mm.hasDebt ? mm.debt0 - mm.bal : 0;
    const removeText = paidFor > 0
      ? first(mm.name) + ' leaves the queue. The pool and their own payments have cleared ' + fmt(paidFor) + ' of their debt and they have contributed ' + fmt(contributed) + ', so under rule 4 they owe the group ' + fmt(Math.max(0, paidFor - contributed)) + '.'
      : first(mm.name) + ' leaves the queue. The pool hasn’t paid anything toward ' + (mm.hasDebt ? 'their debt' : 'their payout') + ' yet, so they owe the group nothing.';
    const reserveText = isDebt ? 'The reserve floor recalculates from ' + fmt(reserve) + ' to ' + fmt(Math.max(0, reserve - 500)) + ' (R500 per member), and R500 is returned to them.' : 'Their contributions this year are refunded at the payout.';

    // ---- invite
    const invDigits = s.inv.phone.replace(/\D/g, '');
    const invPhoneOk = invDigits.length === 10 && invDigits.startsWith('0'), invNameOk = s.inv.name.trim().length > 1;
    const baseAmt = n(stokvel?.contributionAmount);

    // ---- settings (constitution)
    const cfg = stokvel ? { amount: String(n(stokvel.contributionAmount)), reserve: String(n(stokvel.reserveFloor)), recycle: !!stokvel.recycling?.enabled, pct: stokvel.recycling?.percentage ?? 100, grace: stokvel.recycling?.graceMonths ?? 0 } : { amount: '0', reserve: '0', recycle: false, pct: 100, grace: 0 };
    const dr = s.draft || cfg;
    const setDraft = p => this.setState(st2 => ({ draft: { ...(st2.draft || cfg), ...p } }));
    const dirty = k => String(dr[k]) !== String(cfg[k]);
    const save = body => async () => {
      if (this.state.failNext) { this.setState({ setFailed: true, failNext: false }); return; }
      const ok = await this.act(() => call(api.PATCH('/stokvels/{stokvelId}/constitution', { ...this.p(), body })), 'Saved. Logged to the ledger.');
      if (ok) this.setState({ draft: null, setFailed: false }); else this.setState({ setFailed: true });
    };
    const secDefs = [['basics', 'Basics'], ['reserve', 'Reserve floor'], ['queue', isDebt ? 'Queue order' : 'Payout']].concat(isDebt ? [['recycling', 'Recycling']] : []).concat([['members', 'Members'], ['danger', 'Danger zone']]);
    const secSum = { basics: fmt(+cfg.amount) + ' monthly', reserve: fmt(+cfg.reserve), queue: isDebt ? (stokvel?.queueOrder === 'DRAWN_LOTS' ? 'Drawn by lot' : 'Highest rate first') : stokvel?.payoutDate ? dayMonYear(stokvel.payoutDate) : '—', recycling: cfg.recycle ? cfg.pct + '%, ' + (cfg.grace ? cfg.grace + ' month grace' : 'no grace') : 'Off', members: memberCount + ' members', danger: '' };
    const secs = Object.fromEntries(secDefs.map(([k, label]) => { const open = s.setOpen === k; return [k, { label, open, sum: secSum[k], chev: open ? 'rotate(180deg)' : 'none', toggle: () => this.setState({ setOpen: open ? null : k, draft: null }) }]; }));
    const settings = { secs, dr, basicsDirty: dirty('amount'), reserveDirty: dirty('reserve'), recyclingDirty: isDebt && (dirty('recycle') || dirty('pct') || dirty('grace')),
      saveBasics: save({ contributionAmount: (+dr.amount).toFixed(2) }), saveReserve: save({ reserveFloor: (+dr.reserve).toFixed(2) }),
      saveRecycling: save({ recycling: { enabled: dr.recycle, percentage: dr.pct, graceMonths: dr.grace } }),
      setAmount: e => setDraft({ amount: e.target.value.replace(/\D/g, '') }), setReserve: e => setDraft({ reserve: e.target.value.replace(/\D/g, '') }),
      toggleRec: () => setDraft({ recycle: !dr.recycle }), recTrack: dr.recycle ? '#0A0908' : '#948779', recKnob: dr.recycle ? '21px' : '3px',
      pctSegs: segOf([50, 75, 100].map(x => ({ l: x + '%', v: x })), dr.pct, p => setDraft({ pct: p })),
      graceText: dr.grace === 0 ? 'None' : dr.grace + (dr.grace === 1 ? ' month' : ' months'), graceDown: () => setDraft({ grace: Math.max(0, dr.grace - 1) }), graceUp: () => setDraft({ grace: Math.min(3, dr.grace + 1) }),
      isDebt, typeLabel: sv.typeLabel, queue: debtors.map((m, i) => ({ n: i + 1, name: m.name, rate: m.rate + '%' })),
      payoutText: stokvel?.payoutDate ? 'The pool pays out on ' + dayMonYear(stokvel.payoutDate) + '. The agent stops lending ' + (stokvel.lendingCutoffDays ?? 14) + ' days before.' : 'No payout date is set.',
      dissolveMatch: s.dissolveText.trim() === sv.name, dissolveDisabled: s.dissolveText.trim() !== sv.name, dissolveBg: s.dissolveText.trim() === sv.name ? '#B5452F' : '#E8E1D8', dissolveFg: s.dissolveText.trim() === sv.name ? '#FFFFFF' : '#6B625B' };

    // ---- member home
    const pos = meMember ? debtors.indexOf(meMember) + 1 : 0;
    const ahead = meMember ? debtors.filter(m => m.queueStatus !== 'CLEARED' && debtors.indexOf(m) < pos - 1) : [];
    const myContribs = (s.myContribs && s.myContribs.id === meMember?.id) ? s.myContribs.list : null;
    const me = meMember ? { ini: meMember.ini, name: meMember.name, roleLine: (meMember.treasurer ? 'Treasurer' : 'Member') + (snap?.me.town ? ' · ' + snap.me.town : ''), avBg: meMember.treasurer ? '#F5E8DC' : '#FAF7F2' }
      : { ini: snap?.me.initials || '', name: snap?.me.name || '', roleLine: '', avBg: '#FAF7F2' };
    const mMd = MANDATE[meMember?.mandate || 'PENDING'];
    const nextColl = new Date(today.getFullYear(), today.getMonth() + (today.getDate() >= (stokvel?.collectionDay || 1) ? 1 : 0), stokvel?.collectionDay || 1);
    const mv = meMember ? { bal: fmt(meMember.bal), aria: 'My debt remaining, ' + words(meMember.bal) + ' rand', paid: fmt(meMember.debt0 - meMember.bal) + ' paid since ' + dayMonYear(startedOn) + ', from your own minimums',
      pct: (meMember.debt0 ? (meMember.debt0 - meMember.bal) / meMember.debt0 * 100 : 0).toFixed(1) + '%',
      steps: debtors.map(m => ({ bg: m.queueStatus === 'CLEARED' ? '#1F5C45' : m.queueStatus === 'CURRENT' ? '#C97B3C' : m === meMember ? '#0A0908' : '#E8E1D8' })),
      idLine: sv.typeLabel + ' · You’re a member · Month ' + (stokvel?.currentMonth || 0) + ' of ' + (stokvel?.totalMonths || '—'),
      position: pos + ' of ' + debtors.length, positionAria: 'Position ' + pos + ' of ' + debtors.length + '. ' + clearedC.length + ' cleared' + (current ? ', ' + first(current.name) + ' is current.' : '.'),
      clear: 'Month ' + meMember.m + ' · ' + monthOf(meMember.m), ahead: ahead.length + (ahead.length === 1 ? ' member' : ' members'),
      aheadText: (ahead.length ? ahead.map(m => first(m.name)).join(', ').replace(/, ([^,]*)$/, ' and $1') + (ahead.length === 1 ? ' is' : ' are') + ' ahead of you, highest rate first. ' : 'You’re next. ') + 'Keep paying your own ' + fmt(meMember.min) + ' minimum until the group reaches your ' + meMember.kind + '.',
      mandBg: mMd[1], mandFg: mMd[2], mandIcon: IC[mMd[3]], mandLabel: 'Mandate ' + mMd[0].toLowerCase(),
      next: fmt(meMember.amount) + ' on ' + nextColl.getDate() + ' ' + MON[nextColl.getMonth()] + ' ' + nextColl.getFullYear(),
      history: meMember.mandate === 'ACTIVE' ? 'Your DebiCheck mandate is active.' : 'Approve your DebiCheck mandate with your bank to start contributing.',
      groupDebt: fmt(balNow), groupPool: fmt(pool) } : {};

    const sheetTitles = { switcher: 'Your stokvels', stat: stat.title, entry: entryRaw ? entryRaw.desc : 'Entry', join: 'Join a stokvel', notifs: 'Notifications', lfilter: 'Filter the ledger', arange: 'Show decisions from', calc: 'How we calculate this', approve: 'Lend ' + fmt(q0.amount) + ' to ' + q0.name + '?', decline: 'Decline ' + q0.name + '’s request', editAmt: 'Edit ' + first(mm.name) + '’s contribution', remove: 'Remove ' + mm.name + '?' };
    const devExtras = [
      ...(snap ? [{ label: isMember ? 'Sign in as treasurer' : 'Sign in as member', on: () => this.devLogin(isMember ? '0825550147' : '0613307742') }] : []),
      { label: 'WhatsApp alert', on: this.notify },
      { label: s.failNext ? 'Next action will fail' : 'Fail next action', on: () => this.setState({ failNext: !s.failNext }) },
      { label: 'Session expired', on: () => { session.set(null); this.setState({ route: 'expired', sheet: null }); } },
      ...(snap && isDebt ? [{ label: 'Replay: contribution arrives', on: () => this.replay('pool', Math.max(0, pool - 750), pool) }, { label: 'Replay: debt cleared', on: () => this.replay('debt', balNow + 7250, balNow) }] : []),
    ].concat(isMember ? [{ label: 'Deep link /lend', on: this.nav('lend') }] : []);
    const nf = s.notif === null ? null : NOTIFS[s.notif];
    const errCopy = { home: 'We couldn’t load ' + sv.name + '’s dashboard', ledger: 'We couldn’t load the ledger', members: 'We couldn’t load your members', lend: 'We couldn’t load loan requests', agent: 'We couldn’t load the agent’s decisions' }[rt] || 'We couldn’t load this screen';
    const NOTIF = snap ? adapt.notifications(snap.notifications) : [];
    const unread = NOTIF.filter(x => x.unread).length;
    const authDigits = s.auth.phone.replace(/\D/g, '');

    return {
      L, r, go, devViews, devStates, devExtras, showDemo: SHOW_DEMO,
      offline: s.offline && !isOnboarding, offlineLabel: s.offline ? 'Go online' : 'Simulate offline', toggleOffline: () => this.setState({ offline: !s.offline }),
      isOnboarding, isApp: !isOnboarding,
      onbStepNum: { 'onb-type': 1, 'onb-details': 2, 'onb-const': 3, 'onb-invite': 4 }[rt] || 1,
      onbProgress: ({ 'onb-type': 25, 'onb-details': 50, 'onb-const': 75, 'onb-invite': 100 }[rt] || 0) + '%',
      onbBack: () => { if (rt === 'signin') return this.setState({ route: 'welcome' }); if (rt === 'otp') return this.setState({ route: 'signin' }); const order = ['welcome', 'onb-type', 'onb-details', 'onb-const', 'onb-invite']; const i = order.indexOf(rt); this.setState({ route: order[Math.max(0, i - 1)] }); },
      otpHintOn: SHOW_DEMO, otpHint: 'Demo: the code is 123456.',
      authA: s.auth, authIntentNew: s.auth.intent === 'new', authTitle: s.auth.intent === 'new' ? 'Your phone number' : 'Sign in',
      setAuthPhone: e => this.setState({ auth: { ...s.auth, phone: e.target.value.replace(/[^\d ]/g, '') } }),
      toggleConsent: () => this.setState({ auth: { ...s.auth, consent: !s.auth.consent } }),
      consentBg: s.auth.consent ? '#0A0908' : '#FFFFFF', consentBd: s.auth.consent ? '#0A0908' : '#948779',
      authPhoneErr: s.auth.tried && authDigits.length !== 10, authConsentErr: s.auth.tried && s.auth.intent === 'new' && !s.auth.consent,
      authPhoneBd: s.auth.tried && authDigits.length !== 10 ? '#B5452F' : '#948779',
      sendCode: async () => {
        const ok = authDigits.length === 10 && (s.auth.intent !== 'new' || s.auth.consent);
        if (!ok) return this.setState({ auth: { ...s.auth, tried: true } });
        try { await call(api.POST('/auth/otp', { body: { phone: authDigits, intent: s.auth.intent === 'new' ? 'SIGN_UP' : 'SIGN_IN', popiaConsent: s.auth.consent } })); this.setState({ route: 'otp', auth: { ...s.auth, code: '', codeErr: 0 } }); }
        catch (e) { this.toast(e.message); }
      },
      authMasked: '+27 ' + authDigits.slice(1, 3) + ' ' + authDigits.slice(3, 6) + ' ' + authDigits.slice(6),
      setCode: e => this.setState({ auth: { ...s.auth, code: e.target.value.replace(/\D/g, '').slice(0, 6) } }),
      codeErr: s.auth.codeErr > 0, codeErrText: s.auth.codeErrText, codeBd: s.auth.codeErr > 0 ? '#B5452F' : '#948779',
      verifyCode: async () => {
        try {
          const ses = await call(api.POST('/auth/otp/verify', { body: { phone: authDigits, code: s.auth.code } }));
          session.set(ses.idToken);
          if (s.auth.intent === 'new' && ses.user.memberships.length === 0) { this.setState({ route: 'onb-type' }); return; }
          await this.boot(); this.setState({ route: 'home' }); this.toast('Signed in as ' + ses.user.name + '.');
        } catch (e) { this.setState({ auth: { ...s.auth, code: '', codeErr: s.auth.codeErr + 1, codeErrText: e.message } }); }
      },
      resendCode: async () => { try { await call(api.POST('/auth/otp', { body: { phone: authDigits, intent: 'SIGN_IN' } })); this.setState({ auth: { ...s.auth, code: '', codeErr: 0 } }); this.toast('New code sent by SMS.'); } catch (e) { this.toast(e.message); } },
      signInAgain: () => this.setState({ route: 'signin', auth: { ...s.auth, intent: 'existing', tried: false } }),
      openJoin: () => this.setState({ sheet: 'join' }),
      typeCards, ob, freqSegs, freqHelp, obPoolText: fmt(amt * cnt),
      setObName: e => this.setOb({ name: e.target.value }), setObAmount: e => this.setOb({ amount: e.target.value.replace(/[^\d]/g, '') }),
      setObCount: e => this.setOb({ count: e.target.value.replace(/[^\d]/g, '') }), setObReserve: e => this.setOb({ reserve: e.target.value.replace(/[^\d,]/g, '') }),
      queueOpts, avalanche, pctSegs, preamble,
      toggleRecycle: () => this.setOb({ recycle: !ob.recycle }), recycleTrack: ob.recycle ? '#0A0908' : '#948779', recycleKnob: ob.recycle ? '21px' : '3px',
      graceText: ob.grace === 0 ? 'None' : ob.grace + (ob.grace === 1 ? ' month' : ' months'),
      graceDown: () => this.setOb({ grace: Math.max(0, ob.grace - 1) }), graceUp: () => this.setOb({ grace: Math.min(3, ob.grace + 1) }),
      inviteRows, inviteAllLabel: 'Invite your members',
      inviteAll: async () => { await this.boot(s.newStokvelId); this.goInvite(); },
      finishSetup: async () => { await this.boot(s.newStokvelId); this.setState({ route: 'home' }); this.scrollTop(); },
      sv, home, agent, gh, treasurerFirst: first(treasurer?.name) || 'your treasurer',
      resumeAgent: () => this.act(() => call(api.POST('/stokvels/{stokvelId}/agent/resume', this.p())), 'Payouts resumed. Logged to the ledger.'),
      scrollQueue: () => { const el = document.getElementById('bt-queue'); if (el) { const sc = el.closest('main').parentElement; sc.scrollTo({ top: el.offsetTop - 64, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); } },
      activity, hasActivity: activity.length > 0, noActivity: activity.length === 0, firstCollection: startedOn ? dayMonYear(startedOn) : 'the first collection day',
      groceryStats, agentSegs, decisions, hasDecisions: decisions.length > 0, noDecisions: decisions.length === 0,
      emptyDecTitle: DECISIONS.length === 0 ? 'No decisions yet' : 'No decisions match this filter yet',
      emptyDecBody: DECISIONS.length === 0 ? 'Your agent hasn’t made any decisions yet. Once contributions start arriving, every decision it makes will appear here.' : 'Try All to see every decision the agent has made for ' + sv.name + '.',
      preventNav: e => { e.preventDefault(); const d = snap?.decisions.find(x => x.id === s.decOpen); const mock = !d || d.inputs.some(kv => /\(mock\)/.test(kv.value)) || /mock rail/.test(d.ruleApplied);
        if (d?.arcTxHash && !mock) window.open('https://explorer.testnet.arc.io/tx/' + d.arcTxHash, '_blank', 'noopener'); else this.toast('This transaction ran on the mock Arc rail, so there is nothing to open on the explorer.'); },
      hasLedger: ledger.length > 0, noLedger: ledger.length === 0, ledgerTable, ledgerCols, ledgerGroups,
      ledgerBal: fmt2(lastBal), ledgerBalAria: 'Pool balance, ' + words(lastBal) + ' rand', ledgerAsOf: ledger.length ? 'As of ' + longDate(today.toISOString().slice(0, 10)) + ' · last entry ' + desc[0].rel.toLowerCase() : 'No entries yet',
      exportCsv: async () => {
        try { const res = await fetch(`${API_URL}/stokvels/${stk}/ledger/export.csv`, { headers: { Authorization: 'Bearer ' + session.get() } }); if (!res.ok) throw new Error('Export failed');
          const blob = await res.blob(); const name = (res.headers.get('content-disposition') || '').match(/filename="([^"]+)"/)?.[1] || stk + '-ledger.csv';
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); URL.revokeObjectURL(a.href); this.toast('Exported ' + name); }
        catch (e) { this.toast(e.message); }
      },
      entry, copyBean: () => { try { navigator.clipboard.writeText(entry.bean); } catch (e) {} this.toast('Beancount entry copied'); },
      stat, switcherRows, openSwitcher: () => this.setState({ sheet: 'switcher' }),
      sheetOpen: !!s.sheet, sh: { switcher: s.sheet === 'switcher', switcherSettings: s.sheet === 'switcher' && !isMember, stat: s.sheet === 'stat', entry: s.sheet === 'entry', join: s.sheet === 'join', notifs: s.sheet === 'notifs', lfilter: s.sheet === 'lfilter', arange: s.sheet === 'arange', calc: s.sheet === 'calc', approve: s.sheet === 'approve', decline: s.sheet === 'decline', editAmt: s.sheet === 'editAmt', remove: s.sheet === 'remove' },
      declineDisabled: !(s.declineReason && (s.declineReason !== 'Something else' || s.declineNote.trim().length > 2)),
      sheetTitle: sheetTitles[s.sheet] || '', closeSheet: () => this.setState({ sheet: null }),
      tabItems, navItems, pageTitle,
      hasUnread: unread > 0, bellLabel: unread ? 'Notifications, ' + unread + ' unread' : 'Notifications',
      openNotifs: () => this.setState({ sheet: 'notifs' }),
      markRead: async () => { this.setState({ sheet: null }); await this.act(() => call(api.POST('/stokvels/{stokvelId}/notifications/read', this.p())), 'All notifications marked as read.'); },
      notifList: NOTIF.map(x => { const [ic, bg, fg] = DEC_TYPES[x.type] || DEC_TYPES.hold; return { ...x, icon: IC[ic], bg, fg, dotBg: x.unread ? '#B5452F' : 'transparent',
        on: () => { if (!x.dec) return; this.setState({ route: 'agent', sheet: null, decOpen: x.dec, agentSeg: 'All', agentRange: 'all' }); this.scrollTop(); } }; }),
      me, mv, errTitle: errCopy, retry: this.retry, skelRows: ['72%', '55%', '80%', '60%', '75%', '50%'].map(w => ({ w })),
      toastOn: !!s.toast, toastText: s.toast, isTreasurer: !isMember, isMemberRole: isMember, isGroceryStk: !isDebt,
      go2: { members: this.nav('members') },
      nf, nfOn: !!nf,
      nfDismiss: () => { clearTimeout(this.nt); this.setState({ notif: null }); },
      nfAction: () => { const i = s.notif; clearTimeout(this.nt); this.setState({ notif: null });
        if (i === 0) this.toast('Confirmed. We’ll collect your contribution on the next collection day.'); else if (i === 1) { this.setState({ route: 'members' }); this.scrollTop(); } else { this.setState({ route: 'agent', agentSeg: 'Cleared' }); this.scrollTop(); } },
      openAgentRange: () => this.setState({ sheet: 'arange' }), agentRangeActive: s.agentRange !== 'all',
      arOpts: [['7', 'Last 7 days'], ['30', 'Last 30 days'], ['all', 'All time']].map(([k, label]) => { const sel = s.agentRange === k; return { label, sel, bg: sel ? '#F5E8DC' : '#FFFFFF', bd: sel ? '#C97B3C' : '#E8E1D8', radioBd: sel ? '6px solid #9E5A22' : '1.5px solid #948779', on: () => this.setState({ agentRange: k, sheet: null, decOpen: null }) }; }),
      openLedgerFilter: () => this.setState({ sheet: 'lfilter' }),
      lfRanges: segOf([['week', 'Last 7 days'], ['month', 'This month'], ['all', 'All']].map(([k, l]) => ({ l, v: k })), s.ledgerFilter.range, r2 => this.setState(st2 => ({ ledgerFilter: { ...st2.ledgerFilter, range: r2 } }))),
      lfTypes: Object.keys(LEDGER_GROUP_TYPES).map(label => { const on = s.ledgerFilter.types.includes(label); return { label, on, bg: on ? '#0A0908' : '#FFFFFF', fg: on ? '#FAF7F2' : '#0A0908', bd: on ? '#0A0908' : '#948779',
        toggle: () => this.setState(st2 => ({ ledgerFilter: { ...st2.ledgerFilter, types: on ? st2.ledgerFilter.types.filter(x => x !== label) : [...st2.ledgerFilter.types, label] } })) }; }),
      ledgerFilterActive: s.ledgerFilter.range !== 'all' || s.ledgerFilter.types.length > 0, ledgerShown: ledgerTable.length,
      ledgerFilterSummary: [{ week: 'Last 7 days', month: 'This month', all: '' }[s.ledgerFilter.range], ...s.ledgerFilter.types].filter(Boolean).join(' · '),
      lfShowLabel: 'Show ' + ledgerTable.length + (ledgerTable.length === 1 ? ' entry' : ' entries'),
      clearLedgerFilter: () => this.setState({ ledgerFilter: { range: 'all', types: [] }, sheet: null }),
      lend, loan, reqs, hasReqs: reqs.length > 0, noReqs: reqs.length === 0, lendTabs, loans, hasLoans: loans.length > 0, noLoans: loans.length === 0,
      emptyLoansText: s.lendTab === 'out' ? 'You haven’t lent yet. When your surplus grows, requests will appear here.' : 'You haven’t borrowed from another stokvel.',
      switchToGrocery: async () => { const g = (snap?.stokvels || []).find(x => x.status === 'ACTIVE' && x.type !== 'DEBT_PAYOFF'); if (!g) return this.toast('None of your stokvels lends.'); this.setState({ stokvelId: g.id, route: 'lend', sheet: null }); await this.load(g.id); this.scrollTop(); },
      openCalc: () => this.setState({ sheet: 'calc' }),
      openApprove: () => { if (q0.amount > lendableAmt) return this.toast('You can lend ' + fmt(lendableAmt) + ' safely right now, less than ' + fmt(q0.amount) + '.'); this.setState({ sheet: 'approve', approveStep: 'confirm', settlePct: 0 }); },
      closeApprove: () => this.setState({ sheet: null, approveStep: 'confirm', settlePct: 0 }),
      startApprove: this.startApprove,
      approveErrorText: s.approveError ? s.approveError + ' Nothing left your pool.' : 'Nothing left your pool.',
      approveConfirm: s.approveStep === 'confirm', approveFailed: s.approveStep === 'failed', approveBusy: s.approveStep === 'sending' || s.approveStep === 'settled',
      settled: s.approveStep === 'settled', settlePct: s.settlePct + '%', settleLabel,
      copyEscrow: () => { const t = rt === 'loan' ? q0.escrow : member.mandId; try { navigator.clipboard.writeText(t); } catch (e) {} this.toast(rt === 'loan' ? 'Escrow address copied.' : 'Mandate ID copied.'); },
      openDecline: () => this.setState({ sheet: 'decline', declineReason: '', declineNote: '' }),
      declineReasons, declineReason: s.declineReason, declineNote: s.declineNote, declineOther: s.declineReason === 'Something else',
      setDeclineReason: e => this.setState({ declineReason: e.target.value }), setDeclineNote: e => this.setState({ declineNote: e.target.value }),
      declineBtnBg: s.declineReason && (s.declineReason !== 'Something else' || s.declineNote.trim().length > 2) ? '#B5452F' : '#E8E1D8',
      declineBtnFg: s.declineReason && (s.declineReason !== 'Something else' || s.declineNote.trim().length > 2) ? '#FFFFFF' : '#6B625B',
      confirmDecline: async () => {
        const body = { reason: s.declineReason, ...(s.declineReason === 'Something else' ? { note: s.declineNote.trim() } : {}) };
        const ok = await this.act(() => call(api.POST('/stokvels/{stokvelId}/loan-requests/{requestId}/decline', { params: { path: { stokvelId: stk, requestId: q0.id } }, body })), 'Declined. ' + q0.name + ' can see your reason.');
        if (ok) { this.setState({ sheet: null, route: 'lend', declineReason: '', declineNote: '' }); this.scrollTop(); }
      },
      roster, rosterBanner, hasRosterBanner: !!rosterBanner, member, memberCount, removeText, reserveText,
      openEditAmt: () => this.setState({ sheet: 'editAmt', editAmt: String(mm.amount) }), editAmt: s.editAmt,
      setEditAmt: e => this.setState({ editAmt: e.target.value.replace(/\D/g, '') }),
      saveEditAmt: async () => { const v2 = parseInt(s.editAmt, 10); if (!v2) return;
        const ok = await this.act(() => call(api.PATCH('/stokvels/{stokvelId}/members/{memberId}', { params: { path: { stokvelId: stk, memberId: mm.id } }, body: { contributionAmount: v2.toFixed(2) } })), first(mm.name) + ' will get an SMS to approve ' + fmt(v2) + ' with their bank.');
        if (ok) this.setState({ sheet: null }); },
      openRemove: () => this.setState({ sheet: 'remove' }),
      confirmRemove: async () => { const ok = await this.act(() => call(api.DELETE('/stokvels/{stokvelId}/members/{memberId}', { params: { path: { stokvelId: stk, memberId: mm.id } } })), mm.name + ' was removed. Logged to the ledger.');
        if (ok) { this.setState({ sheet: null, route: 'members' }); this.scrollTop(); } },
      goInvite: () => this.goInvite(),
      inv: s.inv, baseFreq: cap((stokvel?.frequency || 'MONTHLY').toLowerCase()) + ', set by the constitution',
      setInvName: e => this.setState({ inv: { ...s.inv, name: e.target.value } }),
      setInvPhone: e => this.setState({ inv: { ...s.inv, phone: e.target.value.replace(/[^\d ]/g, '') } }),
      setInvAmount: e => this.setState({ inv: { ...s.inv, amount: e.target.value.replace(/\D/g, '') } }),
      invNameErr: s.invTried && !invNameOk, invPhoneErr: s.invTried && !invPhoneOk,
      invNameBd: s.invTried && !invNameOk ? '#B5452F' : '#948779', invPhoneBd: s.invTried && !invPhoneOk ? '#B5452F' : '#948779',
      invFailed: s.invFailed, invFailNum: '+27 ' + invDigits.slice(1, 3) + ' ' + invDigits.slice(3, 6) + ' ' + invDigits.slice(6),
      invSentTo: s.invSentTo, invSentName: s.invSentName,
      shareInviteWa: () => { try { navigator.clipboard.writeText(window.location.origin + '/?join=' + stk); } catch (e) {} this.toast('Invite link copied. Paste it into WhatsApp.'); },
      sendInvite: async () => {
        if (!invNameOk || !invPhoneOk) return this.setState({ invTried: true });
        if (this.state.failNext) return this.setState({ invTried: true, invFailed: true, failNext: false });
        try {
          const res = await call(api.POST('/stokvels/{stokvelId}/invitations', { ...this.p(), body: { name: s.inv.name.trim(), phone: invDigits, contributionAmount: (+s.inv.amount || baseAmt).toFixed(2) } }));
          this.setState({ route: 'invite-sent', invTried: false, invFailed: false, invSentTo: res.sentTo, invSentName: first(res.member.name) }); this.scrollTop(); this.refresh();
        } catch (e) { this.fail(e); this.setState({ invTried: true, invFailed: true }); }
      },
      settings, setFailed: s.setFailed, dismissSetFailed: () => this.setState({ setFailed: false }),
      typeRequest: () => this.toast('Changing the stokvel type needs a member vote. I’ve drafted the request for you.'),
      voteRequest: () => this.act(() => call(api.POST('/stokvels/{stokvelId}/queue-votes', this.p())), 'Vote sent by WhatsApp. Members have 7 days to respond.'),
      dissolveText: s.dissolveText, setDissolve: e => this.setState({ dissolveText: e.target.value }),
      dissolve: async () => { if (!settings.dissolveMatch) return; const ok = await this.act(() => call(api.POST('/stokvels/{stokvelId}/dissolution-proposals', { ...this.p(), body: { confirmName: s.dissolveText.trim() } })), 'Proposal sent to all members. Nothing changes unless 7 in 10 approve.'); if (ok) this.setState({ dissolveText: '' }); },
      openSettingsFromSheet: this.nav('settings'),
    };
  }

  goInvite() { this.setState(s => ({ route: 'invite', sheet: null, inv: { name: '', phone: '', amount: String(adapt.n(s.snap?.stokvel.contributionAmount)) }, invTried: false, invFailed: false })); this.scrollTop(); }

  /** Onboarding step 3 → 4: the constitution is created in core, and the treasurer becomes its first member. */
  async createStokvel() {
    const ob = this.state.ob;
    if (this.state.newStokvelId) return this.setState({ route: 'onb-invite' });
    try {
      const created = await call(api.POST('/stokvels', { body: {
        name: ob.name.trim(), type: STOKVEL_TYPE[ob.type], contributionAmount: (+ob.amount || 0).toFixed(2), frequency: ob.freq.toUpperCase(),
        plannedMembers: +ob.count || 2, reserveFloor: (+String(ob.reserve).replace(/\D/g, '') || 0).toFixed(2),
        queueOrder: ob.byRate ? 'HIGHEST_RATE_FIRST' : 'DRAWN_LOTS', recycling: { enabled: ob.recycle, percentage: ob.pct, graceMonths: ob.grace } } }));
      this.setState({ newStokvelId: created.id, stokvelId: created.id, route: 'onb-invite' }); this.scrollTop();
    } catch (e) { this.fail(e); this.toast(e.message); }
  }

  async inviteOnboarding(people) {
    const id = this.state.newStokvelId; if (!id || !people.length) return;
    const amount = (+this.state.ob.amount || 0).toFixed(2);
    let sent = 0;
    for (const [name, phone] of people) {
      try { await call(api.POST('/stokvels/{stokvelId}/invitations', { params: { path: { stokvelId: id } }, body: { name, phone, contributionAmount: amount } })); sent++; this.setState(s => ({ invited: { ...s.invited, [phone]: true } })); }
      catch (e) { this.toast(e.message); break; }
    }
    if (people.length > 1 && sent) this.toast(sent + ' invitations sent by SMS.');
  }

  render() { return <View {...this.renderVals()} />; }
}
