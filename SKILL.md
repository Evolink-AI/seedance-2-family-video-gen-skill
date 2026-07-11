---
name: seedance-2-video-gen
description: Seedance 2.0 AI video generation via EvoLink API. Standard, Fast, and Mini tiers across text-to-video, image-to-video, and reference-to-video. Auto audio (voice, SFX, BGM). Works with OpenClaw, Claude Code, Cursor.
homepage: https://github.com/Evolink-AI/seedance2-video-gen-skill-for-openclaw
metadata: {"openclaw":{"homepage":"https://github.com/Evolink-AI/seedance2-video-gen-skill-for-openclaw","requires":{"bins":["jq","curl"],"env":["EVOLINK_API_KEY"]},"primaryEnv":"EVOLINK_API_KEY"}}
---

# Seedance Video Generation

## When to Activate This Skill

Activate this skill when the user asks to generate, create, animate, remix, edit, or extend AI videos with Seedance 2.0 via EvoLink.

Keywords: seedance, video generation, text-to-video, image-to-video, reference-to-video, AI video, EvoLink video

An interactive AI video generation assistant powered by the Seedance 2.0 model via EvoLink API.

## When Not to Activate

Do not activate this skill for model pricing comparisons, general video-production education, prompt critique without generation intent, account support, or unrelated image-only work. Answer those questions directly or route them to the relevant documentation.

## Supported Inputs and Output

Inputs may include a text concept, 1-2 first/last-frame images, multimodal reference images/video/audio, desired duration, tier, resolution, aspect ratio, and audio preference. The runtime output is an asynchronous task followed by a final video URL. Before submission, translate the user's intent into one coherent generation prompt plus validated API settings.

## Script Location

All script paths in this file are relative to the directory containing this SKILL.md file. Resolve `{SKILL_DIR}` before running commands.

```text
Script = {SKILL_DIR}/scripts/seedance-gen.sh
```

## After Installation

When this skill is first loaded, proactively greet the user and start the setup:

1. Check if `EVOLINK_API_KEY` is set
   - **If not set:** "To generate videos, you'll need an EvoLink API key. It takes 30 seconds to get one — open EVOLINK_KEY_URL=https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen. Want me to walk you through it?"
   - **If already set:** "You're all set! What kind of video would you like to create?"

2. That's it. One question. The user is now in the flow.

Do NOT list features, show a menu, or dump instructions. Just ask one question to move forward.

## Low-Credit Starter Templates

| Template | Estimated credits | Prompt |
|---|---:|---|
| Starter template 1 | about 11 credits on Mini | `Generate a 4-second 480p fixed-camera paper boat video with Mini` |
| Starter template 2 | about 11 credits on Mini | `Generate a 4-second 480p fixed-camera product reveal with Mini` |

The 2026-07-10 real smoke used 10.23 credits for a 4-second 480p Mini text video. This is evidence, not a guaranteed fixed price. Inspect the live `usage` object after every call and remind the user that dashboard billing is the source of truth.

## Core Principles

1. **Guide, don't decide** — Present options and let the user decide. Don't make assumptions about their preferences.
2. **Let the user drive the creative vision** — If they have an idea, use their words. If they need inspiration, offer suggestions and let them choose or refine.
3. **Smart context awareness** — Recognize what the user has already provided and only ask about missing pieces.
4. **Intent first** — If the user's intent is unclear, confirm what they want before proceeding.

## Video Prompt Construction

For every generation prompt, make the time-based behavior explicit and keep it achievable within 4-15 seconds:

- Opening frame: subject, environment, composition, and starting state.
- Main action: one clear action with realistic pacing for the requested duration.
- Camera: shot size and one compatible movement such as fixed camera, pan, orbit, or slow dolly.
- Motion: subject and background movement; avoid contradictory or physically impossible instructions.
- Continuity: preserve the subject, product shape, colors, clothing, environment, and lighting throughout the shot.
- Ending frame: define the intended final state instead of ending mid-action.
- Audio: state dialogue, ambience, sound effects, music, or silence only when relevant.

Prefer one continuous shot for short clips. If the user asks for a multi-shot story, explain that each shot should normally be generated separately, then offer a shot list rather than cramming incompatible camera cuts into one call. Do not promise exact identity, logo, character, lip-sync, or frame-level consistency.

Before submitting, summarize the payload in this stable format:

```text
Tier / workflow:
Duration / resolution / aspect ratio:
Opening frame:
Main action and pacing:
Camera movement:
Continuity constraints:
Ending frame:
Audio:
```

## Flow

### Step 1: Check for API Key

If the user hasn't provided an API key or set `EVOLINK_API_KEY`:

- Tell them they need an EvoLink API Key
- Guide them to open https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen, create a key, then paste it back
- Once they provide a key, proceed to Step 2

If the key is already set or provided, skip directly to Step 2.

### Step 2: Understand Intent

Assess what the user wants based on their message:

- **Intent is clear** (e.g., "generate a video of a cat dancing") → Go to Step 3
- **Intent is ambiguous** (e.g., "I want to try Seedance") → Ask what they'd like to do: generate a new video, learn about model capabilities, etc.

### Step 3: Gather Missing Information

Check what the user has already provided and **only ask about what's missing**:

| Parameter | What to tell the user | Required? |
|-----------|----------------------|-----------|
| **Mode / intent** | Three workflows: (1) **Text-to-video** — prompt only; (2) **Image-to-video** — animate 1-2 images; (3) **Reference-to-video** — remix/edit/extend with images, video, and audio. Determine the workflow from context, or ask if unclear. | Yes |
| **Tier** | **Mini** is lowest cost; **Fast** prioritizes speed; **Standard** supports the highest quality and is required for 1080p. If the user has not expressed a cost/speed/quality preference, explain these choices instead of silently choosing. | Yes |
| **Video content** (prompt) | Ask what they'd like to see. If they need inspiration, suggest a few ideas for them to pick from or build on. | Yes |
| **Duration** | Supported: **4–15 seconds**. Ask how long they want. | Yes |
| **Resolution** | All tiers support **480p / 720p**. Only Standard supports **1080p**. | Yes |
| **Audio** | The model can auto-generate **voice, sound effects, and background music** matching the video. Ask if they want audio enabled. | Yes |
| **Aspect ratio** | Supported: 16:9, 9:16, 1:1, 4:3, 3:4, 21:9, **adaptive** (model chooses best fit). Only mention if relevant or if user asks. | Optional |
| **Reference images** | Image-to-video: 1–2 images (JPEG/PNG/WebP, ≤30MB each). 1 image = first-frame animation; 2 images = first+last frame interpolation. Reference mode: 0–9 images. | Conditional |
| **Reference videos** | Reference mode only: 0–3 videos (.mp4/.mov, 2–15s each, total ≤15s, ≤50MB each). Use for camera reference, motion reference, or as source video for editing/extension. | Conditional |
| **Reference audio** | Reference mode only: 0–3 audio files (.wav/.mp3, 2–15s each, total ≤15s, ≤15MB each). Use for background music, sound effects, or voice reference. | Conditional |
| **Web search** | Text mode only: enables the model to search the web for enhanced timeliness (e.g., current weather, trending topics). Only mention if the user's prompt involves time-sensitive content. | Optional |

**Smart gathering rules — STRICT:**
- **Ask ALL missing parameters in ONE single message.** Never split into multiple rounds of questions.
- **Never ask the same question twice.** If the user already answered a parameter, it is final — do not re-ask it.
- **Offer defaults upfront** so users can say "default is fine": `Standard / 5s / 720p / audio on / 16:9`. If the user explicitly asks for cheapest, use `Mini / 4s / 480p`.
- User gives everything at once → Confirm and generate immediately, no further questions.
- User gives partial info → Ask only the remaining missing required fields, all in one message.
- If user provides images/videos/audio, auto-detect the appropriate mode — no need to ask explicitly.
- **Duration, Resolution, Audio** all have sensible defaults — if the user skips them, use defaults and proceed.

### Step 4: Generate

Once all required information is confirmed:

1. **Before running the script**, immediately send the user a message: "Got it! Starting your video now — this usually takes 1–3 minutes. I'll keep you posted while it generates 🎬"
2. Run the generation script **once**. **NEVER run it a second time** unless the user explicitly asks to retry.
3. **While the script is running**, actively relay progress to the user:
   - When you see `TASK_SUBMITTED:` → send: "✅ Task submitted! Generation has started."
   - When you see each `STATUS_UPDATE:` line → **immediately send it to the user as a natural message**, e.g. "Still generating... about 45 seconds remaining, hang tight!" — do **not** buffer these until the end. The user should never wait more than 30 seconds without hearing from you.
   - If you cannot stream line-by-line, send a reassuring message every ~30 seconds: "Still working on it, almost there..."
4. When complete, share the video URL (valid for 24 hours) and generation time.

## Script Usage

```bash
# Set API key
export EVOLINK_API_KEY=your_key_here

# Text-to-video (basic)
./scripts/seedance-gen.sh "A serene sunset over ocean waves" --duration 5 --quality 720p

# Lowest-cost Mini text-to-video
./scripts/seedance-gen.sh "A calm product reveal" --tier mini --mode text --duration 4 --quality 480p

# Fast text-to-video
./scripts/seedance-gen.sh "A fast cinematic concept test" --tier fast --mode text --duration 4 --quality 480p

# Text-to-video with web search (time-sensitive content)
./scripts/seedance-gen.sh "Today's weather in Tokyo with animated forecast" --duration 8 --quality 720p --web-search

# Image-to-video: 1 image (animate from first frame)
./scripts/seedance-gen.sh "The camera slowly zooms in, the scene comes to life" --image "https://example.com/scene.jpg" --duration 6 --quality 720p

# Image-to-video: 2 images (first + last frame interpolation)
./scripts/seedance-gen.sh "A smooth transition between day and night" --image "https://example.com/day.jpg,https://example.com/night.jpg" --duration 8 --quality 720p

# Reference-to-video: edit a video clip
./scripts/seedance-gen.sh "Replace the item in the box with the product from image 1" --image "https://example.com/product.jpg" --video "https://example.com/original.mp4" --duration 5 --quality 720p

# Reference-to-video: extend/remix with audio
./scripts/seedance-gen.sh "Continue the scene with this background music" --video "https://example.com/clip.mp4" --audio "https://example.com/bgm.mp3" --duration 10 --quality 720p

# Adaptive aspect ratio (model chooses best fit)
./scripts/seedance-gen.sh "A tall waterfall in a narrow canyon" --aspect-ratio adaptive --duration 5 --quality 720p

# Without audio
./scripts/seedance-gen.sh "Abstract art animation" --duration 6 --quality 720p --no-audio

# Force specific mode
./scripts/seedance-gen.sh "Remix these elements" --mode reference --image "url1" --video "url2" --duration 8 --quality 720p
```

## Script Output Protocol

The script writes structured lines to stdout that you must parse and act on:

| Line format | When | Your action |
|-------------|------|-------------|
| `TASK_SUBMITTED: task_id=<id> estimated=<Ns>` | Right after submission | **Confirm to the user that generation has started.** This means the API call succeeded — do NOT retry. |
| `STATUS_UPDATE: <message>` | Every ~30s during generation | **Relay to the user** — e.g., *"Still working on your video, about 45 seconds remaining..."* |
| `VIDEO_URL=<url>` | On success | Extract the URL and present the video to the user |
| `ELAPSED=<Ns>` | On success | Optionally mention how long it took |
| `POLL_TIMEOUT: task_id=<id>` | Polling exceeded 10 min | Tell user: "Your video may already be done — check https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen (task: `<id>`)" |
| `WARNING: ...` | On timeout (>10 min) | Inform user generation may still be running, suggest checking back |
| `ERROR: ...` (stderr) | On failure | Surface the error message to the user |

**Critical**: Once you see `TASK_SUBMITTED:`, the task is queued on the server. **Do NOT run the script again.** Retrying wastes the user's API credits. If the script times out locally, the video may still complete — tell the user to check their dashboard at https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen.

## Error Handling

Provide friendly, actionable messages:

| Error | What to tell the user |
|-------|----------------------|
| Invalid/missing key (401) | "Your API key doesn't seem to work. You can check it at https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen" |
| Insufficient balance (402) | "Your account balance is low. You can add credits at https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen" |
| Rate limited (429) | "Too many requests — let's wait a moment and try again" |
| Content blocked (400) | "This prompt was flagged (realistic human faces are restricted). Try adjusting the description" |
| Video file too large (400) | "One of the video files is too large. Each video must be ≤50MB and total video duration ≤15 seconds" |
| Image file too large (400) | "One of the images is too large. Each image must be ≤30MB" |
| Service unavailable (503) | "The service is temporarily busy. Let's try again in a minute" |

## Safety, Copyright, and Reference Boundaries

- Refuse disallowed sexual content involving minors, extremist promotion, instructions facilitating serious wrongdoing, and other prohibited generation requests.
- Do not claim the user owns a reference image, video, logo, character, voice, or music. Ask them to confirm permission when commercial use or identity rights are unclear.
- Do not fabricate missing reference assets or replace inaccessible URLs with invented ones.
- Avoid presenting generated depictions as authentic evidence of real events or real people.
- For copyrighted characters, celebrity likenesses, brands, and logos, avoid guarantees and flag potential commercial-use or personality-right risks.
- Preserve user-provided constraints across revisions; change only what the user asks to revise.

## Edge Cases and Revision Handling

- If the requested action cannot fit the duration, reduce the number of events or propose separate shots.
- If camera and subject movement conflict, keep the user's primary action and simplify the camera.
- If a user requests 1080p on Fast or Mini, explain that 1080p requires Standard.
- If reference media violates count, size, duration, or format limits, stop before submission and state the exact correction.
- On revision, retain approved tier, workflow, subject, duration, framing, visual identity, and audio choices unless the user explicitly changes them.

## Model Capabilities Summary

Use this when the user asks what the model can do:

- **Tiers**: Mini for lowest cost, Fast for speed, Standard for maximum supported quality and 1080p.
- **Text-to-video**: Standard `seedance-2.0-text-to-video`, Fast `seedance-2.0-fast-text-to-video`, Mini `seedance-2.0-mini-text-to-video`.
- **Image-to-video**: Standard/Fast/Mini IDs follow the same tier naming; 1 image = first frame, 2 images = first+last frame.
- **Reference-to-video**: Standard/Fast/Mini IDs accept images (0–9), videos (0–3), audio (0–3), but require at least one image or video.
- **Audio generation**: Auto-generates synchronized voice, sound effects, and background music (enabled by default).
- **Duration**: 4–15 seconds
- **Resolution**: 480p and 720p for all tiers; 1080p for Standard only
- **Aspect ratios**: 16:9, 9:16, 1:1, 4:3, 3:4, 21:9, adaptive
- **Limitation**: Realistic human faces are restricted

## References

- `references/api-params.md`: Complete API parameter reference for all three models
- `scripts/seedance-gen.sh`: Generation script with automatic model selection, polling, and error handling
