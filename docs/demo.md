# Demo guide

Seed data, scenarios to try, and a walkthrough for the demo video. Everything here runs against the local stack (`./scripts/stack.sh start`), with core in the `dev` profile, which is the default.

`./scripts/stack.sh reset` restores this exact data at any time.

## Sign in

| Person | Phone | Code | Role |
|---|---|---|---|
| Naledi Mokoena | **082 555 0147** | `123456` | Treasurer of Masakhane and Soweto Grocery Club; invited to Kagiso |
| Bongani Zulu | **061 330 7742** | `123456` | Member of Masakhane (read-only) |

The fixed code and `POST /api/dev/sessions` (a one-call login) only exist in the `dev` profile.

## Seeded stokvels

### Masakhane Debt Freedom (`masakhane`)

A Debt-Payoff stokvel: 10 members, R800 a month each, reserve floor R5,000, freed minimums recycled at 100%, started 1 Aug 2026. Pool **R6,500**, debt remaining **R238,930**. The ledger holds 10 entries (L-0001 to L-0010) and there are 7 agent decisions (D-01 to D-07).

| Queue | Member (id) | Debt | Balance | Rate |
|---|---|---|---|---|
| 1 | Zanele Dlamini (`zanele`) | Payday loan | cleared 9 Oct | 28% |
| 2 | Thabo Nkosi (`thabo`) | Store card | R40,740 | 24% |
| 3 | Kagiso Sithole (`kagiso`) | Store card | R27,090 | 23% |
| 4 | Naledi Mokoena (`naledi`, treasurer) | Credit card | R36,670 | 22% |
| 5 | Bongani Zulu (`bongani`) | Store card | R17,370 | 22% |
| 6 | Lerato Mahlangu (`lerato`) | Credit card | R28,880 | 21% |
| 7 | Sipho Khumalo (`sipho`) | Personal loan | R33,600 | 20% |
| 8 | Mpho Ramaphosa (`mpho`) | Credit card | R21,120 | 20% |
| 9 | Palesa Ngwenya (`palesa`) | Credit card | R14,360 | 19% |
| 10 | Ayanda Buthelezi (`ayanda`) | Personal loan | R19,100 | 18% |

### Soweto Grocery Club (`grocery`)

A grocery stokvel: 12 members, R250 a month each, reserve R2,000, payout on 28 Nov 2026, with a R750 Makro deposit due 20 Nov. Pool **R18,500**, lendable **R15,750**. Busisiwe Mthembu's mandate has failed.

| Request | Borrower | Amount / term / rate | Tier | Agent recommends |
|---|---|---|---|---|
| `REQ-31` | Diepkloof Grocery Society | R8,000 / 30 days / 18% | A | Approve |
| `REQ-32` | Kagiso Investment Collective | R15,000 / 90 days / 16% | A | Decline this term (runs past the payout) |
| `REQ-33` | Alexandra Burial Society | R3,000 / 30 days / 22% | B | Approve |

Loans already out: Tembisa Burial Society (LN-07) and Orlando Rotational Club (LN-05). Borrowed: Meadowlands Investment Club (LN-02, due soon).

### Kagiso Investment Collective (`kagiso`)

Naledi has been invited but hasn't approved her mandate, so it shows as *Invited* and she can't open it yet.

## Scenarios

With `NEXT_PUBLIC_DEMO=true` the dark demo bar runs these from the UI. Without it, `./scripts/demo.sh pause`, `resume`, `fail`, `run` and `balances` send the signed Stitch events and run the agent from a terminal; the API calls at the end do the same by hand.

| Scenario | Do this | You should see |
|---|---|---|
| Payout | Masakhane → **Run agent** | Pays R1,500 (everything above the R5,000 reserve) to Thabo's store card, the highest rate still open. The pool drops to R5,000. |
| Pause | Lerato's bank cancels her mandate | Agent card turns amber: *"I paused the 2 Nov payout because Lerato Mahlangu's bank cancelled their DebiCheck mandate…"* |
| Resume | Lerato re-approves, then Run agent | A RESUME decision; payouts allowed again |
| Failed collection | Thabo's collection fails | A pause naming Thabo, the amount held and the days overdue |
| Loan on Arc | Soweto Grocery Club → Lend → `REQ-31` → Approve → Confirm | Six Arc transactions (with `ARC_MODE=circle`). Lendable drops to R7,750 and the loan appears under *Lending out*. Agent activity lists the transaction hashes. |
| Over the limit | After `REQ-31`, approve `REQ-32` | Refused: R15,000 is more than the R7,750 you can lend safely |
| Decline | `REQ-32` → Decline → choose a reason | The request leaves the list; the ledger records LOAN_DECLINED with the reason |
| Member view | Sign in as Bongani | His own debt and queue position; no Lend tab; can't change settings |
| Isolation | As Bongani, open `/api/stokvels/grocery/members` | 404: he isn't in that stokvel |

Approving `REQ-31` with `ARC_MODE=circle` makes real testnet transactions and uses a little USDC from both wallets (`npx tsx backend/agent/scripts/arc-status.ts` shows the balances).

## Video walkthrough (under 3 minutes)

1. **Problem (0:00–0:20).** Stokvels pool R50bn a year; 10.5m South Africans have impaired credit. The treasurer runs it from a notebook.
2. **Home (0:20–0:45).** Masakhane: debt remaining, the payoff queue, interest saved. Tap a figure to show it traces to the ledger.
3. **The agent pauses (0:45–1:15).** Lerato's bank cancels her mandate, and the agent pauses with its reasons. Open Agent activity to show *What I saw / What I decided / What happened*.
4. **Lending on Arc (1:15–2:15).** Soweto Grocery Club → Lend: the agent's tier and reasoning for `REQ-31`. Approve it, watch it settle, then open the explorer link and show the six transactions of the ERC-8183 job.
5. **The ledger (2:15–2:40).** Open the LOAN_OUT entry: the Beancount text, its file hash, the Arc transaction.
6. **Close (2:40–3:00).** Built API-first on Arc and Circle wallets; what's next (Stitch live, real stokvels).

Before recording, run `./scripts/stack.sh reset` so `REQ-31` is open and Lerato's mandate is active.

## API shortcuts

```bash
A=http://localhost:8080/api
T=$(curl -s -XPOST $A/dev/sessions -H 'content-type: application/json' -d '{"phone":"0825550147"}' | jq -r .idToken)

# Simulate a signed Stitch event (mock rail): MANDATE_CANCELLED, MANDATE_AUTHENTICATED, PAYMENT_FAILED, PAYMENT_SUCCEEDED
curl -XPOST $A/dev/stitch/events -H "Authorization: Bearer $T" -H 'content-type: application/json' \
  -d '{"type":"MANDATE_CANCELLED","stokvelId":"masakhane","memberId":"lerato"}'

# Run the agent now
curl -XPOST $A/stokvels/masakhane/agent/evaluations -H "Authorization: Bearer $T"

# Approve a loan (settles on Arc when ARC_MODE=circle)
curl -XPOST $A/stokvels/grocery/loan-requests/REQ-31/approval -H "Authorization: Bearer $T"

# A new loan request from another stokvel; the agent grades it on arrival
curl -XPOST $A/stokvels/grocery/loan-requests -H "Authorization: Bearer $T" -H 'content-type: application/json' \
  -d '{"borrower":{"name":"Mamelodi Rotational Circle","type":"ROTATIONAL","members":9,"monthsActive":7,"contributionRecord":"oommoo","priorLoans":0,"defaults":0},"amount":"2000.00","termDays":30,"ratePct":20,"purpose":"Bridge a late payout"}'
```

The ledger (`localhost:4200`) and agent (`localhost:4100`) need `X-Service-Token: $SERVICE_TOKEN` from `.env`.
