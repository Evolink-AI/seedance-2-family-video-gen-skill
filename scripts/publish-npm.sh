#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAGE_DIR="$ROOT_DIR/.release/npm"

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR"
rsync -a --delete   --exclude '.git'   --exclude '.github'   --exclude 'node_modules'   --exclude 'reports'   --exclude '.release'   --exclude 'README.*.md'   "$ROOT_DIR/" "$STAGE_DIR/"

cp "$ROOT_DIR/README.npm.md" "$STAGE_DIR/README.md"
cd "$STAGE_DIR"
npm pack --dry-run --json --ignore-scripts

if [[ "${DRY_RUN:-}" == "1" ]]; then
  echo "DRY_RUN=1; not publishing."
  exit 0
fi

if [[ -n "${NPM_TOKEN:-}" ]]; then
  npm publish --access public --//registry.npmjs.org/:_authToken="$NPM_TOKEN"
elif [[ -n "${NODE_AUTH_TOKEN:-}" ]]; then
  npm publish --access public --//registry.npmjs.org/:_authToken="$NODE_AUTH_TOKEN"
elif [[ -n "${npm_token:-}" ]]; then
  npm publish --access public --//registry.npmjs.org/:_authToken="$npm_token"
else
  echo "No NPM_TOKEN, NODE_AUTH_TOKEN, or npm_token found. Use npm browser/web auth outside this script if approved." >&2
  exit 2
fi

# Browser/web fallback, when owner-approved after token auth is missing or failed:
# npm publish --access public --auth-type=web
if grep -qi "EOTP" "${NPM_PUBLISH_LOG:-/dev/null}" 2>/dev/null; then
  echo "publish remediation blocked: npm requested EOTP; use owner-approved browser/web authentication instead of collecting OTP." >&2
  exit 3
fi
