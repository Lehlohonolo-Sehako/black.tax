#!/usr/bin/env bash
# black.tax stack control: stop / start / restart / status / reset.
#
#   ./scripts/stack.sh stop               stop the Docker stack and any black.tax processes running natively
#   ./scripts/stack.sh start [--build]    start the Docker stack (rebuild images with --build) and wait until healthy
#   ./scripts/stack.sh restart [--build]  stop, then start
#   ./scripts/stack.sh status             what is running, on which port, and whether it is healthy
#   ./scripts/stack.sh reset [--yes]      stop, WIPE the demo database and ledger volumes, start (reseeds demo data)
#
# Only processes that belong to this repository are stopped. Anything else listening on one of the ports is
# reported and left alone.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# port:name — the compose ports, plus ports used by native dev runs (3210 was an earlier Next.js dev port).
PORTS=("3000:frontend" "3210:frontend-dev" "8080:core" "4100:agent" "4200:ledger" "5434:postgres")

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
ok() { printf '  \033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }
err() { printf '  \033[31m✗\033[0m %s\n' "$*"; }

need_docker() {
  if ! docker info >/dev/null 2>&1; then
    err "Docker isn't running. Start Docker Desktop and try again."
    exit 1
  fi
}

# Is this PID ours? True if its working directory or command line is inside the repository.
is_ours() {
  local pid=$1 cwd cmd
  cwd=$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1)
  cmd=$(ps -o command= -p "$pid" 2>/dev/null || true)
  [[ "$cwd" == "$ROOT"* || "$cmd" == *"$ROOT"* ]]
}

# Docker Desktop's own port forwarders show up as listeners too; compose handles those.
is_docker_proxy() {
  local cmd
  cmd=$(ps -o command= -p "$1" 2>/dev/null || true)
  [[ "$cmd" == *com.docker* || "$cmd" == *vpnkit* || "$cmd" == *docker-proxy* ]]
}

stop_native() {
  local entry port name pids pid cmd stopped=0
  for entry in "${PORTS[@]}"; do
    port=${entry%%:*}
    name=${entry#*:}
    pids=$(lsof -nP -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)
    for pid in $pids; do
      is_docker_proxy "$pid" && continue
      cmd=$(ps -o command= -p "$pid" 2>/dev/null | cut -c1-90 || true)
      if is_ours "$pid"; then
        kill "$pid" 2>/dev/null || true
        ok "stopped native $name on :$port (pid $pid)"
        stopped=1
      else
        warn ":$port is used by another program (pid $pid: $cmd); leaving it alone"
      fi
    done
  done
  # Parent processes that may not hold a port themselves (Maven wrapper, npm, tsx watch).
  for pattern in "spring-boot:run" "tsx src/server.ts" "tsx watch src/server.ts" "uvicorn app.main:app" "next dev"; do
    for pid in $(pgrep -f "$pattern" 2>/dev/null || true); do
      if is_ours "$pid"; then
        kill "$pid" 2>/dev/null || true
        ok "stopped native process: $pattern (pid $pid)"
        stopped=1
      fi
    done
  done
  # Give them a moment, then force anything that ignored SIGTERM.
  if [[ $stopped == 1 ]]; then
    sleep 3
    for entry in "${PORTS[@]}"; do
      port=${entry%%:*}
      for pid in $(lsof -nP -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true); do
        if ! is_docker_proxy "$pid" && is_ours "$pid"; then kill -9 "$pid" 2>/dev/null || true; fi
      done
    done
  fi
}

stop_stack() {
  bold "Stopping black.tax"
  if docker info >/dev/null 2>&1; then
    docker compose down --remove-orphans >/dev/null 2>&1 && ok "Docker stack stopped" || warn "Docker stack was not running"
  else
    warn "Docker isn't running; skipping the Docker stack"
  fi
  stop_native
}

wait_healthy() {
  local deadline=$((SECONDS + 300)) svc state
  bold "Waiting for services"
  for svc in postgres ledger agent core; do
    while :; do
      state=$(docker compose ps "$svc" --format '{{.Status}}' 2>/dev/null || true)
      if [[ "$state" == *"(healthy)"* ]]; then ok "$svc healthy"; break; fi
      if [[ "$state" == *Exited* || "$state" == *Restarting* ]]; then err "$svc failed: $state (docker compose logs $svc)"; return 1; fi
      if (( SECONDS > deadline )); then err "$svc not healthy after 5 minutes: ${state:-not running}"; return 1; fi
      sleep 2
    done
  done
  while ! curl -fs -o /dev/null http://localhost:3000; do
    if (( SECONDS > deadline )); then err "frontend not answering on :3000"; return 1; fi
    sleep 2
  done
  ok "frontend answering"
}

start_stack() {
  need_docker
  [[ -f .env ]] || { err "No .env. Copy .env.example to .env and set the secrets."; exit 1; }
  bold "Starting black.tax"
  local args=(up -d)
  [[ "${1:-}" == "--build" ]] && args+=(--build)
  docker compose "${args[@]}" >/dev/null
  ok "containers started"
  wait_healthy
  status
}

status() {
  bold "black.tax status"
  if docker info >/dev/null 2>&1; then
    docker compose ps --format '  {{.Service}}\t{{.Status}}' 2>/dev/null | column -t -s $'\t' || true
  else
    warn "Docker isn't running"
  fi
  local agent
  agent=$(curl -fs http://localhost:4100/health 2>/dev/null || true)
  [[ -n "$agent" ]] && ok "agent: $agent"
  curl -fs http://localhost:8080/management/health 2>/dev/null | grep -q UP && ok "core: UP on http://localhost:8080"
  curl -fs -o /dev/null http://localhost:3000 2>/dev/null && ok "frontend: http://localhost:3000"
  local entry port pid
  for entry in "${PORTS[@]}"; do
    port=${entry%%:*}
    for pid in $(lsof -nP -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true); do
      is_docker_proxy "$pid" && continue
      if is_ours "$pid"; then warn "native black.tax process on :$port (pid $pid)"; else warn ":$port used by another program (pid $pid)"; fi
    done
  done
}

case "${1:-}" in
  stop) stop_stack ;;
  start) start_stack "${2:-}" ;;
  restart) stop_stack; start_stack "${2:-}" ;;
  status) status ;;
  reset)
    if [[ "${2:-}" != "--yes" ]]; then
      read -r -p "This deletes the demo database and ledger volumes and reseeds them. Continue? [y/N] " answer
      [[ "$answer" == [yY]* ]] || { echo "Cancelled."; exit 0; }
    fi
    need_docker
    stop_native
    bold "Resetting demo data"
    docker compose down -v --remove-orphans >/dev/null && ok "volumes removed"
    # New Arc idempotency scope, so reseeded loan requests open new escrow jobs
    run_id="run-$(date +%Y%m%d%H%M%S)"
    if grep -q '^ARC_RUN_ID=' .env 2>/dev/null; then sed -i.bak "s/^ARC_RUN_ID=.*/ARC_RUN_ID=$run_id/" .env && rm -f .env.bak
    else echo "ARC_RUN_ID=$run_id" >> .env; fi
    ok "Arc run id $run_id"
    start_stack
    ;;
  *)
    sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
    exit 1
    ;;
esac
