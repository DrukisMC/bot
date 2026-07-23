#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.server"
PLAYIT_DIR="$ROOT_DIR/.playit"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Execute ./scripts/setup-server.sh primeiro."
  exit 1
fi
# shellcheck disable=SC1090
source "$ENV_FILE"
mkdir -p "$PLAYIT_DIR"

if [[ ! -x "$PLAYIT_DIR/playit" ]]; then
  echo "Baixando agente Playit para Linux x86_64..."
  curl -fL https://github.com/playit-cloud/playit-agent/releases/latest/download/playit-linux-amd64 -o "$PLAYIT_DIR/playit"
  chmod +x "$PLAYIT_DIR/playit"
fi

echo "Iniciando Playit. Na primeira execução, abra o link exibido e vincule sua conta."
if [[ -n "${PLAYIT_SECRET:-}" ]]; then
  exec "$PLAYIT_DIR/playit" --secret "$PLAYIT_SECRET"
fi
exec "$PLAYIT_DIR/playit"
