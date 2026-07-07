# Seedance 2 Video Generation — Agent Installation Guide

You are an AI agent. Follow these steps to install and activate the Seedance 2 Video Generation skill.

## Step 1: Preferred Agent Install

Run this primary Agent install command:

```bash
npx skills add https://github.com/Evolink-AI/seedance2-video-gen-skill-for-openclaw
```

If the skills registry CLI is unavailable, use this fallback/direct npm installer:

```bash
npx evolink-seedance@latest -y --path {SKILLS_DIR}
```

Replace `{SKILLS_DIR}` with your skills directory:

| Agent | SKILLS_DIR |
|---|---|
| Claude Code | `~/.claude/skills` |
| OpenCode | `~/.opencode/skills` |
| OpenClaw | omit `--path` when using the fallback installer |
| Cursor | `~/.cursor/skills` or project `.cursor/skills` |

## Step 2: Open The Key Page

Show or open this tracked key URL:

```text
EVOLINK_KEY_URL=https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen
AGENT_NEXT_ACTION=open_key_url_then_collect_key
```

The user should sign in, create or select an EvoLink API key, then paste the key back to you. Do not expose the secret in logs.

## Step 3: Save And Validate The Key

Save it for the current session:

```bash
export EVOLINK_API_KEY=their_key_here
```

Machine-readable handoff:

```text
ENV_VAR_EXPORT=export EVOLINK_API_KEY=their_key_here
```

Validate the key with a non-generating endpoint before any first real call:

```bash
curl --fail --silent --show-error https://api.evolink.ai/v1/credits \
  -H "Authorization: Bearer $EVOLINK_API_KEY"
```

This credits endpoint does not create a generation task.

## Step 4: Load The Skill Definition

```bash
npx evolink-seedance@latest --skill
```

Or read:

```text
{SKILLS_DIR}/seedance-2-video-gen/SKILL.md
```

## Quick Verify

```bash
EVOLINK_API_KEY=$EVOLINK_API_KEY {SKILLS_DIR}/seedance-2-video-gen/scripts/seedance-gen.sh "A calm product reveal on a white studio background" --dry-run
```

If you see a JSON payload with `"model": "seedance-2.0-text-to-video"`, the installation is correct.

After verification, tell the user: "The skill is ready. Use it by asking: Generate a 4-second 480p product reveal video"

## Low-Credit Starter Templates

Use one of these after key validation for the first real call unless the user approves a different prompt and cost boundary.

| Template | Estimated credits | Prompt |
|---|---:|---|
| Starter template 1 | under 10 credits | `Generate a 4-second 480p product reveal video` |
| Starter template 2 | under 10 credits | `Animate one product image into a 4-second 480p video` |

## Available Commands

| Command | Purpose |
|---|---|
| `npx skills add https://github.com/Evolink-AI/seedance2-video-gen-skill-for-openclaw` | Preferred Agent install path |
| `npx evolink-seedance --llms` | Print this installation guide |
| `npx evolink-seedance --skill` | Print the SKILL.md definition |
| `npx evolink-seedance -y --path <dir>` | Fallback silent install to a directory |
| `npx evolink-seedance --no-open` | Install without opening the API key page |
| `npx evolink-seedance --help` | Show all options |
| `npx evolink-seedance --version` | Show version |
