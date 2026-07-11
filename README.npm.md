# Seedance 2 Video Gen Skill for OpenClaw

<p align="center">
  <strong>Complete Seedance 2.0 Standard, Fast, and Mini API + Agent Skill — install in one command.</strong>
</p>

<p align="center">
  <a href="#seedance-video-generation">Seedance 2.0</a> •
  <a href="#installation">Install</a> •
  <a href="#getting-an-api-key">API Key</a> •
  <a href="https://evolink.ai/dashboard/keys?utm_source=npm&utm_medium=package&utm_campaign=seedance-2-video-gen">EvoLink</a>
</p>

<p align="center">
  <strong>Languages:</strong>
  <a href="README.md">English</a> |
  <a href="README.zh-CN.md">简体中文</a>
</p>

## EvoLink Quick Start

Install the skill, set one key, and let an agent generate Seedance 2.0 videos:

<p align="center">
  <a href="https://evolink.ai/seedance-2-0?utm_source=github&utm_medium=readme&utm_campaign=seedance2-video-gen-skill-for-openclaw"><strong>Model Page</strong></a> &nbsp;·&nbsp;
  <a href="https://docs.evolink.ai?utm_source=github&utm_medium=readme&utm_campaign=seedance2-video-gen-skill-for-openclaw"><strong>Docs</strong></a> &nbsp;·&nbsp;
  <a href="https://evolink.ai/dashboard/keys?utm_source=npm&utm_medium=package&utm_campaign=seedance-2-video-gen"><strong>API Key</strong></a> &nbsp;·&nbsp;
  <a href="https://github.com/Evolink-AI/seedance2-video-gen-skill-for-openclaw/tree/main/docs"><strong>API Docs</strong></a> &nbsp;·&nbsp;
  <a href="https://github.com/Evolink-AI/awesome-seedance-2.0-prompts"><strong>Seedance Prompts</strong></a> &nbsp;·&nbsp;
  <a href="https://github.com/Evolink-AI/awesome-seedance-2-guide"><strong>Seedance Guide</strong></a>
</p>

```bash
npx skills add https://github.com/Evolink-AI/seedance2-video-gen-skill-for-openclaw
export EVOLINK_API_KEY="your_key_here"

curl --request POST \
  --url https://api.evolink.ai/v1/videos/generations \
  --header "Authorization: Bearer ${EVOLINK_API_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "seedance-2.0-mini-text-to-video",
    "prompt": "A simple paper boat gently floating on calm water",
    "duration": 4,
    "quality": "480p",
    "aspect_ratio": "16:9"
  }'
```

## All 9 Seedance 2.0 Models

| Tier | Text-to-Video | Image-to-Video | Reference-to-Video | Resolution |
|---|---|---|---|---|
| Standard | `seedance-2.0-text-to-video` | `seedance-2.0-image-to-video` | `seedance-2.0-reference-to-video` | 480p, 720p, 1080p |
| Fast | `seedance-2.0-fast-text-to-video` | `seedance-2.0-fast-image-to-video` | `seedance-2.0-fast-reference-to-video` | 480p, 720p |
| Mini | `seedance-2.0-mini-text-to-video` | `seedance-2.0-mini-image-to-video` | `seedance-2.0-mini-reference-to-video` | 480p, 720p |

## What is This?

An [OpenClaw](https://github.com/openclaw/openclaw) / [Claude Code](https://github.com/anthropics/claude-code) / [OpenCode](https://github.com/opencode-ai/opencode) skill powered by [EvoLink](https://evolink.ai?utm_source=github&utm_medium=readme&utm_campaign=seedance2-video-gen-skill-for-openclaw). Install the skill and your AI agent gains Seedance 2.0 video generation with three core workflows:

| Skill | Description | Model |
|-------|-------------|-------|
| **Seedance 2 Video Gen** | Text-to-video, image-to-video, reference-to-video, auto audio | Seedance 2.0 (ByteDance) |

### What It Can Do

- **Text-to-video** — describe a scene and generate a video
- **Image-to-video** — animate from 1–2 reference images
- **Reference-to-video** — combine images, video clips, and audio for remix, editing, or extension
- **Auto audio** — generate voice, sound effects, and background music
- **Tier choice** — Mini for lowest cost, Fast for speed, Standard for maximum quality
- **Flexible output** — 4–15 seconds; 480p/720p for every tier; 1080p for Standard

📚 Full guide: [awesome-seedance-2-guide](https://github.com/Evolink-AI/awesome-seedance-2-guide)

---

## Installation

### OpenClaw Install

```bash
npx skills add https://github.com/Evolink-AI/seedance2-video-gen-skill-for-openclaw
```

### Install via npm (Fallback / Direct CLI)

```bash
npx evolink-seedance-2-skill
```

Or non-interactive (for AI agents / CI):

```bash
npx evolink-seedance-2-skill -y
```

Install to a specific directory:

```bash
npx evolink-seedance-2-skill -y --path ~/.claude/skills
```

### Manual Install

```bash
git clone https://github.com/Evolink-AI/seedance2-video-gen-skill-for-openclaw.git
cd seedance2-video-gen-skill-for-openclaw
openclaw skills add .
```

---

## Getting an API Key

1. Sign up at [evolink.ai](https://evolink.ai/dashboard/keys?utm_source=npm&utm_medium=package&utm_campaign=seedance-2-video-gen)
2. Go to Dashboard → API Keys
3. Create a new key
4. Set it in your environment:

```bash
export EVOLINK_API_KEY=your_key_here
```

---

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

# Lowest-cost Mini
./scripts/seedance-gen.sh "A simple paper boat on calm water" --tier mini --mode text --duration 4 --quality 480p

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

## Troubleshooting

| Issue | What to check |
|------|---------------|
| `401 Unauthorized` | Verify `EVOLINK_API_KEY` in your shell |
| `402 Payment Required` | Add credits in the EvoLink dashboard |
| No output file | Check the returned video URL and task status |
| Bad install path | Re-run with `--path <skills-dir>` |

---

<p align="center">
  Powered by <a href="https://evolink.ai/dashboard/keys?utm_source=npm&utm_medium=package&utm_campaign=seedance-2-video-gen"><strong>Skill</strong></a> — Unified AI API Gateway
</p>

<p align="center">Powered by <a href="https://evolink.ai/dashboard/keys?utm_source=npm&utm_medium=package&utm_campaign=seedance-2-video-gen"><strong>EvoLink</strong></a> — Unified AI API Gateway</p>
