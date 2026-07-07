#!/usr/bin/env bash
set -euo pipefail

API_BASE="https://api.evolink.ai"
PACKAGE="evolink-seedance-2-skill"
SKILL="seedance-2-video-gen"
CAMPAIGN="seedance-2-video-gen"

if [[ -z "${EVOLINK_API_KEY:-}" ]]; then
  echo "EVOLINK_API_KEY is required. Create one at https://evolink.ai/dashboard/keys?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-video-gen" >&2
  exit 1
fi

payload='{"model":"seedance-2.0-text-to-video","prompt":"A calm product reveal on a white studio background","duration":4,"quality":"480p","aspect_ratio":"16:9"}'

response=$(curl --fail-with-body --show-error --silent   --connect-timeout 15 --max-time 30   -X POST "https://api.evolink.ai/v1/videos/generations"   -H "Authorization: Bearer ${EVOLINK_API_KEY}"   -H "Content-Type: application/json"   -H "X-EvoLink-Source: skill"   -H "X-EvoLink-Skill: $SKILL"   -H "X-EvoLink-Package: $PACKAGE"   -H "X-EvoLink-Campaign: $CAMPAIGN"   -H "X-EvoLink-Touchpoint: first-run"   -d "$payload")

task_id=$(echo "$response" | jq -r '.id // .task_id // empty')
if [[ -z "$task_id" ]]; then
  echo "Could not find task id in response:" >&2
  echo "$response" >&2
  exit 1
fi

echo "TASK_SUBMITTED: task_id=$task_id"
started=$(date +%s)
while true; do
  now=$(date +%s)
  elapsed=$((now - started))
  if (( elapsed > 600 )); then
    echo "POLL_TIMEOUT: task_id=$task_id dashboard=https://evolink.ai/dashboard"
    exit 2
  fi
  sleep 8
  status_body=$(curl --fail-with-body --show-error --silent     --connect-timeout 15 --max-time 30     -X GET "$API_BASE/v1/tasks/$task_id"     -H "Authorization: Bearer ${EVOLINK_API_KEY}"     -H "X-EvoLink-Source: skill"     -H "X-EvoLink-Skill: $SKILL"     -H "X-EvoLink-Package: $PACKAGE"     -H "X-EvoLink-Campaign: $CAMPAIGN"     -H "X-EvoLink-Touchpoint: status-poll")
  status=$(echo "$status_body" | jq -r '.status // empty')
  case "$status" in
    completed|succeeded|success)
      result=$(echo "$status_body" | jq -r '.results[0] // .result_data[0].video_url // .result_data[0].url // .output.video_url // .video_url // .result.video_url // .url // empty')
      echo "FINAL_URL=$result"
      exit 0
      ;;
    failed|error)
      echo "$status_body" >&2
      exit 1
      ;;
    *)
      echo "STATUS_UPDATE: status=${status:-unknown} elapsed=${elapsed}s"
      ;;
  esac
done
