#!/usr/bin/env bash
# Drive demo scenarios against the local stack (core in the dev profile).
#   ./scripts/demo.sh pause     Lerato's bank cancels her DebiCheck mandate, then the agent runs
#   ./scripts/demo.sh resume    Lerato re-approves, then the agent runs
#   ./scripts/demo.sh fail      Thabo's collection fails, then the agent runs
#   ./scripts/demo.sh run       run the Masakhane agent now
#   ./scripts/demo.sh balances  Arc wallet balances
set -euo pipefail
cd "$(dirname "$0")/.."

A=${CORE_URL:-http://localhost:8080/api}
T=$(curl -sf -XPOST "$A/dev/sessions" -H 'content-type: application/json' -d '{"phone":"0825550147"}' \
  | sed -E 's/.*"idToken":"([^"]+)".*/\1/')

event() {
  curl -sf -XPOST "$A/dev/stitch/events" -H "Authorization: Bearer $T" -H 'content-type: application/json' \
    -d "{\"type\":\"$1\",\"stokvelId\":\"masakhane\",\"memberId\":\"$2\"}" >/dev/null
  echo "Stitch event sent: $1 ($2)"
}
run() {
  curl -sf -XPOST "$A/stokvels/masakhane/agent/evaluations" -H "Authorization: Bearer $T" >/dev/null
  echo "Agent ran for masakhane"
}

case "${1:-}" in
  pause)    event MANDATE_CANCELLED lerato; run ;;
  resume)   event MANDATE_AUTHENTICATED lerato; run ;;
  fail)     event PAYMENT_FAILED thabo; run ;;
  run)      run ;;
  balances) (cd backend/agent && npx tsx scripts/arc-status.ts) ;;
  *) sed -n '2,8p' "$0" | sed 's/^# \{0,1\}//'; exit 1 ;;
esac
