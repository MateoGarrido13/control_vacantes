#!/usr/bin/env bash
# Levanta backend (8080) y frontend (3000), y abre el navegador.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT/backend/vacante"
FRONTEND_DIR="$ROOT/frontend"
BACKEND_URL="http://localhost:8080/api/v1/vacantes"
FRONTEND_URL="http://localhost:3000"
LOG_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/control_vacantes"

export PATH="$HOME/.local/node/bin:$PATH"

BACKEND_PID=""
FRONTEND_PID=""
STARTED_BACKEND=0
STARTED_FRONTEND=0

mkdir -p "$LOG_DIR"

kill_tree() {
  local pid="${1:-}"
  [[ -z "$pid" ]] && return 0
  local child
  for child in $(pgrep -P "$pid" 2>/dev/null || true); do
    kill_tree "$child"
  done
  kill "$pid" 2>/dev/null || true
}

cleanup() {
  trap - EXIT INT TERM
  if [[ "$STARTED_BACKEND" -eq 1 ]]; then
    kill_tree "$BACKEND_PID"
    pgrep -f 'com.build.vacante.VacanteApplication' >/dev/null 2>&1 &&
      pkill -f 'com.build.vacante.VacanteApplication' || true
  fi
  if [[ "$STARTED_FRONTEND" -eq 1 ]]; then
    kill_tree "$FRONTEND_PID"
  fi
}

trap cleanup EXIT INT TERM

port_open() {
  local url="$1"
  curl -sf -o /dev/null --connect-timeout 1 "$url" 2>/dev/null
}

wait_for() {
  local url="$1"
  local name="$2"
  local timeout="${3:-90}"
  local i
  for ((i = 1; i <= timeout; i++)); do
    if port_open "$url"; then
      echo "  $name listo"
      return 0
    fi
    sleep 1
  done
  echo "Error: $name no respondió en ${timeout}s" >&2
  return 1
}

open_browser() {
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$FRONTEND_URL" >/dev/null 2>&1 || true
  elif command -v gio >/dev/null 2>&1; then
    gio open "$FRONTEND_URL" >/dev/null 2>&1 || true
  else
    echo "Abrí el navegador en $FRONTEND_URL"
  fi
}

echo "control_vacantes"
echo "  backend  $BACKEND_URL -> http://localhost:8080"
echo "  frontend $FRONTEND_URL"
echo "  logs     $LOG_DIR"
echo

if ! port_open "$BACKEND_URL"; then
  echo "Arrancando backend..."
  chmod +x "$BACKEND_DIR/mvnw" 2>/dev/null || true
  (
    cd "$BACKEND_DIR"
    ./mvnw spring-boot:run
  ) >"$LOG_DIR/backend.log" 2>&1 &
  BACKEND_PID=$!
  STARTED_BACKEND=1
else
  echo "Backend ya estaba en el puerto 8080"
fi

if ! port_open "$FRONTEND_URL"; then
  echo "Arrancando frontend..."
  if [[ ! -d "$FRONTEND_DIR/node_modules/vite" ]]; then
    (
      cd "$FRONTEND_DIR"
      npm install
    )
  fi
  (
    cd "$FRONTEND_DIR"
    node node_modules/vite/bin/vite.js --port 3000 --host
  ) >"$LOG_DIR/frontend.log" 2>&1 &
  FRONTEND_PID=$!
  STARTED_FRONTEND=1
else
  echo "Frontend ya estaba en el puerto 3000"
fi

if [[ "$STARTED_BACKEND" -eq 1 ]]; then
  wait_for "$BACKEND_URL" "Backend" 90 || {
    echo "Últimas líneas de $LOG_DIR/backend.log:" >&2
    tail -n 40 "$LOG_DIR/backend.log" >&2 || true
    exit 1
  }
fi

if [[ "$STARTED_FRONTEND" -eq 1 ]]; then
  wait_for "$FRONTEND_URL" "Frontend" 30 || {
    echo "Últimas líneas de $LOG_DIR/frontend.log:" >&2
    tail -n 40 "$LOG_DIR/frontend.log" >&2 || true
    exit 1
  }
fi

echo
echo "Abriendo $FRONTEND_URL"
open_browser

if [[ "$STARTED_BACKEND" -eq 0 && "$STARTED_FRONTEND" -eq 0 ]]; then
  echo "Ambos servidores ya estaban levantados."
  trap - EXIT INT TERM
  exit 0
fi

echo "Ctrl+C detiene los servidores que arrancó este comando."
wait
