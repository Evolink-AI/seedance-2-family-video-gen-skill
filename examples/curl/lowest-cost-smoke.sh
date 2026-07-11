#!/usr/bin/env bash
set -euo pipefail

: "${EVOLINK_API_KEY:?Set EVOLINK_API_KEY before running real smoke tests}"

ROOT_DIR=$(cd "$(dirname "$0")/../.." && pwd)
GEN="$ROOT_DIR/scripts/seedance-gen.sh"
TIER=${1:?Usage: $0 <standard|fast|mini>}

case "$TIER" in
  standard|fast|mini) ;;
  *) echo "Tier must be standard, fast, or mini" >&2; exit 1 ;;
esac

"$GEN" \
  "A simple blue paper boat gently floating on calm water, fixed camera" \
  --tier "$TIER" \
  --mode text \
  --duration 4 \
  --quality 480p \
  --aspect-ratio 16:9 \
  --no-audio
