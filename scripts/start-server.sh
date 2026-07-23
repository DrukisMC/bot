#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"
ENV_FILE="$ROOT_DIR/.env.server"

if [[ ! -x "$SERVER_DIR/bedrock_server" ]]; then
  echo "Servidor Bedrock não instalado. Execute ./scripts/setup-server.sh primeiro."
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"
cd "$SERVER_DIR"
echo "Servidor Bedrock ouvindo na porta UDP ${SERVER_PORT:-19132}."
exec ./bedrock_server
