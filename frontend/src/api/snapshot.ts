/** Everything one screen set needs for one stokvel, fetched in parallel. */
import { api, call, type Schemas } from './client';

export interface Snapshot {
  me: Schemas['CurrentUser'];
  stokvels: Schemas['StokvelListItem'][];
  stokvel: Schemas['Stokvel'];
  dashboard: Schemas['Dashboard'];
  members: Schemas['Member'][];
  ledger: Schemas['LedgerPage'];
  decisions: Schemas['AgentDecision'][];
  notifications: Schemas['Notification'][];
  lendable?: Schemas['Lendable'];
  requests: Schemas['LoanRequest'][];
  loansOut: Schemas['Loan'][];
  loansIn: Schemas['Loan'][];
}

export async function loadSnapshot(stokvelId: string): Promise<Snapshot> {
  const p = { params: { path: { stokvelId } } };
  const [me, stokvels, stokvel, dashboard, members, ledger, decisions, notifications] = await Promise.all([
    call(api.GET('/me')),
    call(api.GET('/stokvels')),
    call(api.GET('/stokvels/{stokvelId}', p)),
    call(api.GET('/stokvels/{stokvelId}/dashboard', p)),
    call(api.GET('/stokvels/{stokvelId}/members', p)),
    call(api.GET('/stokvels/{stokvelId}/ledger', p)),
    call(api.GET('/stokvels/{stokvelId}/decisions', p)),
    call(api.GET('/stokvels/{stokvelId}/notifications', p)),
  ]);
  let lendable: Schemas['Lendable'] | undefined;
  let requests: Schemas['LoanRequest'][] = [], loansOut: Schemas['Loan'][] = [], loansIn: Schemas['Loan'][] = [];
  const treasurer = me.memberships.some((m) => m.stokvelId === stokvelId && m.role === 'TREASURER');
  if (stokvel.lendingEnabled && treasurer) {
    [lendable, requests, loansOut, loansIn] = await Promise.all([
      call(api.GET('/stokvels/{stokvelId}/lendable', p)),
      call(api.GET('/stokvels/{stokvelId}/loan-requests', p)),
      call(api.GET('/stokvels/{stokvelId}/loans', { params: { path: { stokvelId }, query: { direction: 'OUT' } } })),
      call(api.GET('/stokvels/{stokvelId}/loans', { params: { path: { stokvelId }, query: { direction: 'IN' } } })),
    ]);
  }
  return { me, stokvels, stokvel, dashboard, members, ledger, decisions, notifications, lendable, requests, loansOut, loansIn };
}
