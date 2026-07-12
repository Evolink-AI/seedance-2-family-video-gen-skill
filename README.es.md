# Seedance 2 Video Gen Skill for OpenClaw

<p align="center">
  <strong>Seedance 2.0 AI video generation for OpenClaw, Claude Code, OpenCode, and Cursor — install in one command.</strong>
</p>

<p align="center">
  <a href="#seedance-video-generation">Seedance 2.0</a> •
  <a href="#installation">Install</a> •
  <a href="#getting-an-api-key">API Key</a> •
  <a href="https://evolink.ai/dashboard/keys?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-video-gen">EvoLink</a>
</p>

> **AI Agent?** Skip the README, go straight to [**llms-install.md**](llms-install.md).

<!-- release-agent fixed anchors start -->
<a id="menu"></a>
<a id="agent-skill-first"></a>
<a id="installation"></a>
<a id="agent-auto-install"></a>
<a id="getting-an-api-key"></a>
<a id="api-quick-start"></a>
<a id="full-first-run-flow"></a>
<a id="api-reference"></a>
<a id="showcase"></a>
<a id="troubleshooting"></a>
<a id="compatibility"></a>
<a id="community"></a>
<a id="license"></a>

[EvoLink API key](https://evolink.ai/dashboard/keys?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-video-gen)

This key page handles sign in or create an account, key creation, and dashboard return on the same page.

## 📑 Menu

- [Agent Skill First](#agent-skill-first)
- [Installation](#installation)
- [Agent Auto-Install](#agent-auto-install)
- [Getting an API Key](#getting-an-api-key)
- [API Quick Start](#api-quick-start)
- [Full First-Run Flow](#full-first-run-flow)
- [API Reference](#api-reference)
- [Showcase](#showcase)
- [Troubleshooting](#troubleshooting)
- [Compatibility](#compatibility)
- [Community](#community)
- [License](#license)

## Agent Skill First

Primary Agent install command:

```bash
npx skills add https://github.com/Evolink-AI/seedance-2-family-video-gen-skill
```

The npm installer is a fallback/direct CLI path: `npx evolink-seedance@latest -y --path <skills-dir>`.

## API Quick Start

Use `EVOLINK_API_KEY`, create task -> poll/callback -> final result URL, and inspect [task lifecycle](docs/task-lifecycle.md) plus [API reference](docs/api-reference.md).

## Full First-Run Flow

Run `bash examples/curl/complete-flow.sh`. It creates a task, polls `/v1/tasks/{task_id}`, handles `failed` status and timeout, then prints the final URL.

## API Reference

See [docs/api-reference.md](docs/api-reference.md), [docs/response-schema.md](docs/response-schema.md), [docs/errors.md](docs/errors.md), and [docs/callbacks.md](docs/callbacks.md).

<!-- release-agent fixed anchors end -->



<p align="center">
  <strong>Languages:</strong>
  <a href="README.md">English</a> |
  <a href="README.zh-CN.md">简体中文</a>
</p>

## EvoLink Quick Start

Install the skill, set one key, and let an agent generate Seedance 2.0 videos:

<p align="center">
  <a href="https://evolink.ai/seedance-2-0?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-family-video-gen-skill"><strong>Model Page</strong></a> &nbsp;·&nbsp;
  <a href="https://docs.evolink.ai?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-family-video-gen-skill"><strong>Docs</strong></a> &nbsp;·&nbsp;
  <a href="https://evolink.ai/dashboard/keys?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-video-gen"><strong>API Key</strong></a> &nbsp;·&nbsp;
  <a href="https://github.com/Evolink-AI/Seedance-2.0-Gateway-Service"><strong>API Examples</strong></a> &nbsp;·&nbsp;
  <a href="https://github.com/Evolink-AI/awesome-seedance-2.0-prompts"><strong>Seedance Prompts</strong></a> &nbsp;·&nbsp;
  <a href="https://github.com/Evolink-AI/awesome-seedance-2-guide"><strong>Seedance Guide</strong></a>
</p>

```bash
npx evolink-seedance -y
export EVOLINK_API_KEY="your_key_here"

curl --request POST \
  --url https://api.evolink.ai/v1/videos/generations \
  --header "Authorization: Bearer ${EVOLINK_API_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "seedance-2.0-text-to-video",
    "prompt": "A 5-second cinematic product reveal, slow dolly-in, premium studio lighting",
    "duration": 5,
    "quality": "720p",
    "aspect_ratio": "16:9"
  }'
```

## What is This?

This repository documents the complete first-run lifecycle: create task -> poll/callback -> final result URL. See [task lifecycle](docs/task-lifecycle.md) for `/v1/tasks/{task_id}` polling details.


An [OpenClaw](https://github.com/openclaw/openclaw) / [Claude Code](https://github.com/anthropics/claude-code) / [OpenCode](https://github.com/opencode-ai/opencode) skill powered by [EvoLink](https://evolink.ai?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-family-video-gen-skill). Install the skill and your AI agent gains Seedance 2.0 video generation with three core workflows:

| Skill | Description | Model |
|-------|-------------|-------|
| **Seedance 2 Video Gen** | Text-to-video, image-to-video, reference-to-video, auto audio | Seedance 2.0 (ByteDance) |

### What It Can Do

- **Text-to-video** — describe a scene and generate a video
- **Image-to-video** — animate from 1–2 reference images
- **Reference-to-video** — combine images, video clips, and audio for remix, editing, or extension
- **Auto audio** — generate voice, sound effects, and background music
- **Flexible output** — 4–15 seconds; 480p/720p on all tiers; 1080p on Standard only

📚 Full guide: [awesome-seedance-2-guide](https://github.com/Evolink-AI/awesome-seedance-2-guide)

---

## Installation

### OpenClaw Install

```bash
npx skills add https://github.com/Evolink-AI/seedance-2-family-video-gen-skill
```

### Install via npm (Recommended)

```bash
npx evolink-seedance
```

Or non-interactive (for AI agents / CI):

```bash
npx evolink-seedance -y
```

Install to a specific directory:

```bash
npx evolink-seedance -y --path ~/.claude/skills
```

### Manual Install

```bash
git clone https://github.com/Evolink-AI/seedance-2-family-video-gen-skill.git
cd seedance-2-family-video-gen-skill
openclaw skills add .
```

---

### Agent Auto-Install

```bash
npx skills add https://github.com/Evolink-AI/seedance-2-family-video-gen-skill
```

## Getting an API Key

1. Sign up at [evolink.ai](https://evolink.ai/dashboard/keys?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-video-gen)
2. Go to Dashboard → API Keys
3. Create a new key
4. Set it in your environment:

```bash
export EVOLINK_API_KEY=your_key_here
```

---

## 🖼️ Showcase

| Text to video | Image to video | Reference video |
|---|---|---|
| Use a short prompt | Animate one image | Combine images, video, and audio |

## Seedance Video Generation

Generate AI videos through natural conversation with your agent.

### Example Prompts

> "Generate a 5-second cinematic video of a cat playing piano"

> "Animate this product image into a short ad, 720p, 16:9"

> "Use this image and this clip as references, then extend the scene with ambient music"

### Direct Script Usage

```bash
# Text-to-video
./scripts/seedance-gen.sh "A serene sunset over ocean waves" --duration 5 --quality 720p

# Image-to-video
./scripts/seedance-gen.sh "The camera slowly pushes in" --image "https://assets.evolink.ai/example/scene.jpg" --duration 6 --quality 720p

# Reference-to-video
./scripts/seedance-gen.sh "Replace the product with image 1" --image "https://assets.evolink.ai/example/product.jpg" --video "https://assets.evolink.ai/example/original.mp4" --duration 5 --quality 720p
```

### Requirements

- `curl` and `jq` installed on your system
- `EVOLINK_API_KEY` environment variable set

### File Structure

```text
.
├── README.md
├── README.zh-CN.md
├── SKILL.md
├── _meta.json
├── bin/
│   └── cli.js
├── references/
│   └── api-params.md
└── scripts/
    └── seedance-gen.sh
```

---

## Compatibility

| Agent | Install path |
|---|---|
| Claude Code | `~/.claude/skills` |
| OpenCode | `~/.opencode/skills` |
| OpenClaw | auto-detected |
| Cursor | `.cursor/skills` |

## Troubleshooting

| Issue | What to check |
|------|---------------|
| `401 Unauthorized` | Verify `EVOLINK_API_KEY` in your shell |
| `402 Payment Required` | Add credits in the EvoLink dashboard |
| No output file | Check the returned video URL and task status |
| Bad install path | Re-run with `--path <skills-dir>` |

---

<p align="center">
  Powered by <a href="https://evolink.ai/dashboard/keys?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-video-gen"><strong>EvoLink</strong></a> — Unified AI API Gateway
</p>

<p align="center">Powered by <a href="https://evolink.ai/dashboard/keys?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-video-gen"><strong>EvoLink</strong></a> — Unified AI API Gateway</p>

<p align="center">Powered by EvoLink — Unified AI API Gateway</p>
