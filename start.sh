#!/bin/bash

echo "=== OSINT World Feed - Inicio rápido ==="

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[1/4] Deteniendo procesos en puertos 3000 y 4000..."

# Método agresivo: lsof + fuser + pkill
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:4000 2>/dev/null | xargs kill -9 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
fuser -k 4000/tcp 2>/dev/null
pkill -f "next dev" 2>/dev/null
pkill -f "tsx src/index" 2>/dev/null

sleep 2

# Verificar que los puertos están libres
if lsof -ti:3000 >/dev/null 2>&1 || lsof -ti:4000 >/dev/null 2>&1; then
  echo "  ⚠️  No se pudieron liberar los puertos. Intenta manualmente:"
  echo "     sudo fuser -k 3000/tcp 4000/tcp"
  exit 1
fi
echo "  Puertos libres ✓"

echo "[2/4] Iniciando backend (puerto 4000)..."
cd "$ROOT_DIR/backend" || exit 1
npx tsx src/index.ts &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"

sleep 4

echo "[3/4] Iniciando frontend (puerto 3000)..."
cd "$ROOT_DIR/frontend" || exit 1
npx next dev -p 3000 &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID"

echo ""
echo "[4/4] Servicios en ejecución:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:4000/api/health"
echo "  Admin:    admin@osintfeed.com / admin123"
echo ""
echo "Presiona Ctrl+C para detener ambos servicios."
echo "Para ver los logs en tiempo real:"
echo "  tail -f /tmp/backend.log"
echo "  tail -f /tmp/frontend.log"

wait
