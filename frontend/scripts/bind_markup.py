"""One-off: replace literal figures in the design markup with bindings to API-backed view models."""
import sys

path = sys.argv[1]
s = open(path, encoding="utf-8").read()

R = [
    # ---- Member home
    ('<span style="font-size:1.25rem;font-weight:600;letter-spacing:-0.01em;line-height:1.3">Masakhane Debt Freedom</span><span style="font-size:12px;color:#6B625B">Debt-Payoff Stokvel · You\'re a member · Month 3 of 21</span>',
     '<span style="font-size:1.25rem;font-weight:600;letter-spacing:-0.01em;line-height:1.3">{{ sv.name }}</span><span style="font-size:12px;color:#6B625B">{{ mv.idLine }}</span>'),
    ('letter-spacing:-0.02em;font-variant-numeric:tabular-nums">5 of 10</span>', 'letter-spacing:-0.02em;font-variant-numeric:tabular-nums">{{ mv.position }}</span>'),
    ('aria-label="Position 5 of 10. One member cleared, Thabo is current."', 'aria-label="{{ mv.positionAria }}"'),
    ('<span style="font-size:15px;font-weight:500">Month 13 · Aug 2027</span>', '<span style="font-size:15px;font-weight:500">{{ mv.clear }}</span>'),
    ('<span style="font-size:15px;font-weight:500">3 members</span>', '<span style="font-size:15px;font-weight:500">{{ mv.ahead }}</span>'),
    ('<span style="font-size:13px;color:#3D3733;line-height:1.5">Thabo, Kagiso and Naledi are ahead of you, highest rate first. Keep paying your own R540 minimum until the group reaches your store card.</span>',
     '<span style="font-size:13px;color:#3D3733;line-height:1.5">{{ mv.aheadText }}</span>'),
    ('<span style="display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 10px;border-radius:999px;background:#E3EEE8;color:#1F5C45;font-size:12px;font-weight:500"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"></path></svg>Mandate active</span>',
     '<span style="display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:500;background:{{ mv.mandBg }};color:{{ mv.mandFg }}"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{{ mv.mandIcon }}"></path></svg>{{ mv.mandLabel }}</span>'),
    ('font-variant-numeric:tabular-nums">R800 on 1 Nov 2026</span>', 'font-variant-numeric:tabular-nums">{{ mv.next }}</span>'),
    ('<span style="font-size:13px;color:#3D3733">August, September and October paid on time.</span>', '<span style="font-size:13px;color:#3D3733">{{ mv.history }}</span>'),
    ('letter-spacing:-0.02em;font-variant-numeric:tabular-nums">R238,930</span></button>', 'letter-spacing:-0.02em;font-variant-numeric:tabular-nums">{{ mv.groupDebt }}</span></button>'),
    ('letter-spacing:-0.02em;font-variant-numeric:tabular-nums">R6,500</span></button>', 'letter-spacing:-0.02em;font-variant-numeric:tabular-nums">{{ mv.groupPool }}</span></button>'),
    # ---- Grocery home
    ('<span style="font-size:1.25rem;font-weight:600;letter-spacing:-0.01em;line-height:1.3">Soweto Grocery Club</span><span style="font-size:12px;color:#6B625B">Grocery Stokvel · 12 members · Payout 28 Nov 2026</span>',
     '<span style="font-size:1.25rem;font-weight:600;letter-spacing:-0.01em;line-height:1.3">{{ sv.name }}</span><span style="font-size:12px;color:#6B625B">{{ gh.idLine }}</span>'),
    ('aria-label="Pool balance, eighteen thousand five hundred rand. View ledger."', 'aria-label="{{ gh.poolAria }}. View ledger."'),
    ('color:#0A0908;align-self:flex-start;font-size:{{ L.heroSize }}">R18,500</button>', 'color:#0A0908;align-self:flex-start;font-size:{{ L.heroSize }}">{{ gh.pool }}</button>'),
    ('font-variant-numeric:tabular-nums">R2,750 added this month</span>', 'font-variant-numeric:tabular-nums">{{ gh.added }}</span>'),
    ('aria-valuenow="56" aria-valuemin="0" aria-valuemax="100" aria-label="Progress to November target"', 'aria-valuenow="{{ gh.pctNum }}" aria-valuemin="0" aria-valuemax="100" aria-label="Progress to payout target"'),
    ('<div style="height:100%;width:56%;background:#0A0908;border-radius:999px"></div>', '<div style="height:100%;background:#0A0908;border-radius:999px;width:{{ gh.pct }}"></div>'),
    ('R18,500 of the R33,000 November target · R4,000 is out on loan, due back 2 Nov', '{{ gh.progress }}'),
    ('<section aria-label="Agent status" style="background:#FFFFFF;border:1px solid #F5E8DC;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(10,9,8,0.04)">\n                      <div style="padding:8px 16px;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:500;background:#F5E8DC;color:#3D3733">\n                        <span style="width:8px;height:8px;border-radius:999px;background:#1F5C45"></span><span>Agent active</span><span style="margin-left:auto;font-weight:400">Checked 6 min ago</span>',
     '<section aria-label="Agent status" style="background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(10,9,8,0.04);border:1px solid {{ agent.frame }}">\n                      <div style="padding:8px 16px;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:500;background:{{ agent.frame }};color:{{ agent.fg }}">\n                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{{ agent.icon }}"></path></svg><span>{{ agent.state }}</span><span style="margin-left:auto;font-weight:400;color:#3D3733">{{ agent.time }}</span>'),
    ("<p style=\"margin:0;font-size:15px;line-height:1.55\">I lent R4,000 to Tembisa Burial Society for 30 days. Your pool stays above the R2,000 reserve until it's repaid on 2 Nov, well before the payout.</p>",
     '<p style="margin:0;font-size:15px;line-height:1.55">{{ agent.text }}</p>'),
    # ---- Lend
    ("<span style=\"font-size:12px;color:#6B625B\">From Soweto Grocery Club's pool</span>", '<span style="font-size:12px;color:#6B625B">From {{ sv.name }}\'s pool</span>'),
    ('<span>Pool balance</span><span>R18,500</span>', '<span>Pool balance</span><span>{{ lend.pool }}</span>'),
    ('aria-label="Of eighteen thousand five hundred rand: two thousand reserve floor and seven hundred and fifty in obligations are locked. The rest can be lent."', 'aria-label="{{ lend.barAria }}"'),
    ('<span style="flex:1;color:#3D3733">Reserve floor · locked</span><span>R2,000</span>', '<span style="flex:1;color:#3D3733">Reserve floor · locked</span><span>{{ lend.reserve }}</span>'),
    ('<span style="flex:1;color:#3D3733">Makro deposit, 20 Nov · locked</span><span>R750</span>', '<span style="flex:1;color:#3D3733">{{ lend.oblLabel }} · locked</span><span>{{ lend.obl }}</span>'),
    # ---- Calc sheet
    ('<span style="color:#3D3733">Pool balance</span><span>R18,500</span>', '<span style="color:#3D3733">Pool balance</span><span>{{ lend.pool }}</span>'),
    ('<span style="color:#3D3733">Reserve floor, never lent</span><span>−R2,000</span>', '<span style="color:#3D3733">Reserve floor, never lent</span><span>−{{ lend.reserve }}</span>'),
    ('<span style="color:#3D3733">Makro deposit due 20 Nov</span><span>−R750</span>', '<span style="color:#3D3733">{{ lend.oblLabel }}</span><span>−{{ lend.obl }}</span>'),
    ("What's left can go out without delaying the 28 Nov payout.", "What's left can go out without delaying the {{ lend.payout }} payout."),
    ('Loans already out (R4,000 to Tembisa Burial Society, R811 still owed by Orlando Rotational Club) are due back before 28 Nov, so they aren\'t counted against you.',
     '{{ lend.outNote }}'),
    # ---- Approve sheet
    ('<span style="color:#3D3733">Reserve floor</span><span>R2,000 · untouched</span>', '<span style="color:#3D3733">Reserve floor</span><span>{{ lend.reserve }} · untouched</span>'),
    # ---- Settings (grocery payout)
    ('The pool pays for one bulk buy at Makro on 28 Nov 2026. The agent stops lending 14 days before.', '{{ settings.payoutText }}'),
    # ---- Lend denied
    ("Ask Naledi to share the reasoning if you're curious.", "Ask {{ treasurerFirst }} to share the reasoning if you're curious."),
]
missing = [a[:70] for a, _ in R if a not in s]
if missing:
    print("NOT FOUND:\n" + "\n".join(missing))
    sys.exit(1)
for a, b in R:
    s = s.replace(a, b)
open(path, "w", encoding="utf-8").write(s)
print("bound", len(R))
