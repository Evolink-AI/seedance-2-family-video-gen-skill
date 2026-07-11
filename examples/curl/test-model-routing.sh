#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/../.." && pwd)
GEN="$ROOT_DIR/scripts/seedance-gen.sh"
IMAGE_URL="https://example.com/frame.png"
VIDEO_URL="https://example.com/reference.mp4"

assert_model() {
  local expected=$1
  shift
  local payload actual
  payload=$(env -u EVOLINK_API_KEY "$GEN" "Routing verification" "$@" --duration 4 --quality 480p --dry-run)
  actual=$(printf '%s' "$payload" | jq -r '.model')
  if [[ "$actual" != "$expected" ]]; then
    printf 'FAIL expected=%s actual=%s\n' "$expected" "$actual" >&2
    exit 1
  fi
  printf 'PASS %s\n' "$actual"
}

for tier in standard fast mini; do
  prefix="seedance-2.0"
  [[ "$tier" != "standard" ]] && prefix="${prefix}-${tier}"

  assert_model "${prefix}-text-to-video" --tier "$tier" --mode text
  assert_model "${prefix}-image-to-video" --tier "$tier" --mode image --image "$IMAGE_URL"
  assert_model "${prefix}-reference-to-video" --tier "$tier" --mode reference --video "$VIDEO_URL"
done

if env -u EVOLINK_API_KEY "$GEN" "Invalid 1080p" --tier mini --mode text --quality 1080p --dry-run >/dev/null 2>&1; then
  echo "FAIL Mini incorrectly accepted 1080p" >&2
  exit 1
fi

echo "PASS Mini/Fast 1080p rejection"
