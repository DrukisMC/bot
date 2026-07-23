#!/usr/bin/env bash
set -eu
cd "$(dirname "$0")"
if [ ! -d node_modules ]; then npm install; fi
if [ ! -f .env ]; then echo "Crie .env a partir de .env.example antes de conectar."; exit 1; fi
exec npm start