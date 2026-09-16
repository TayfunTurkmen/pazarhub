#!/bin/bash
set -euo pipefail
DEST="${1:-/app/evolution}"
if [ -f "${DEST}/package.json" ] && [ -d "${DEST}/node_modules" ]; then
  echo "[skonutal] Evolution already bundled at ${DEST}"
  exit 0
fi
echo "[skonutal] Cloning Evolution API into ${DEST}..."
rm -rf "$DEST"
git clone --depth 1 https://github.com/EvolutionAPI/evolution-api.git "$DEST"
cd "$DEST"
npm ci
npm run build
echo "[skonutal] Evolution API ready at ${DEST}"
