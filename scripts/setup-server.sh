#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"
ENV_FILE="$ROOT_DIR/.env.server"

if [[ ! -f "$ENV_FILE" ]]; then
  cp "$ROOT_DIR/.env.server.example" "$ENV_FILE"
  echo "Criado .env.server. Informe BEDROCK_SERVER_URL e execute novamente."
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"
if [[ -z "${BEDROCK_SERVER_URL:-}" ]]; then
  echo "BEDROCK_SERVER_URL não configurada em .env.server."
  echo "Baixe a URL oficial em https://www.minecraft.net/en-us/download/server/bedrock"
  exit 1
fi

mkdir -p "$SERVER_DIR"
if [[ ! -f "$SERVER_DIR/bedrock_server" ]]; then
  tmp_file="$(mktemp)"
  echo "Baixando servidor Bedrock..."
  curl -fL "$BEDROCK_SERVER_URL" -o "$tmp_file"
  unzip -o "$tmp_file" -d "$SERVER_DIR" >/dev/null
  rm -f "$tmp_file"
  chmod +x "$SERVER_DIR/bedrock_server"
fi

cat > "$SERVER_DIR/server.properties" <<PROPERTIES
server-name=${SERVER_NAME:-BuddyBot Bedrock}
gamemode=${GAMEMODE:-survival}
difficulty=${DIFFICULTY:-normal}
allow-cheats=${ALLOW_CHEATS:-false}
online-mode=${ONLINE_MODE:-false}
server-port=${SERVER_PORT:-19132}
server-portv6=${SERVER_PORT:-19132}
PROPERTIES

printf 'eula=true\n' > "$SERVER_DIR/eula.txt"
echo "Servidor configurado em $SERVER_DIR"
echo "Agora execute: ./scripts/start-server.sh"
