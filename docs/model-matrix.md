# Seedance 2.0 Model Matrix

Seedance 2.0 is one API family with three workflows and three tiers. All nine models use `POST https://api.evolink.ai/v1/videos/generations`.

| Tier | Workflow | Model ID | Required media | Unsupported media | Resolution |
|---|---|---|---|---|---|
| Standard | Text-to-Video | `seedance-2.0-text-to-video` | None | `image_urls`, `video_urls`, `audio_urls` | 480p, 720p, 1080p |
| Standard | Image-to-Video | `seedance-2.0-image-to-video` | `image_urls`: 1-2 | `video_urls`, `audio_urls` | 480p, 720p, 1080p |
| Standard | Reference-to-Video | `seedance-2.0-reference-to-video` | At least one image or video | Audio-only requests | 480p, 720p, 1080p |
| Fast | Text-to-Video | `seedance-2.0-fast-text-to-video` | None | `image_urls`, `video_urls`, `audio_urls` | 480p, 720p |
| Fast | Image-to-Video | `seedance-2.0-fast-image-to-video` | `image_urls`: 1-2 | `video_urls`, `audio_urls` | 480p, 720p |
| Fast | Reference-to-Video | `seedance-2.0-fast-reference-to-video` | At least one image or video | Audio-only requests | 480p, 720p |
| Mini | Text-to-Video | `seedance-2.0-mini-text-to-video` | None | `image_urls`, `video_urls`, `audio_urls`, `model_params` | 480p, 720p |
| Mini | Image-to-Video | `seedance-2.0-mini-image-to-video` | `image_urls`: 1-2 | `video_urls`, `audio_urls` | 480p, 720p |
| Mini | Reference-to-Video | `seedance-2.0-mini-reference-to-video` | At least one image or video | Audio-only requests | 480p, 720p |

## Choosing a tier

- **Mini**: lowest-cost option and the default recommendation for inexpensive experiments.
- **Fast**: use when generation speed matters more than maximum output quality.
- **Standard**: use for maximum supported quality or when 1080p output is required.

Do not silently select a tier when cost, speed, or quality materially changes the user's result. If the user has no preference, explain the three choices; use Mini only when they explicitly ask for the cheapest option.

## Shared limits

- `duration`: any integer from 4 through 15 seconds.
- `quality`: 480p or 720p on all models; 1080p on Standard only.
- `aspect_ratio`: `16:9`, `9:16`, `1:1`, `4:3`, `3:4`, `21:9`, or `adaptive`.
- `generate_audio`: supported by all nine models and defaults to `true`.
- `callback_url`: HTTPS only; callbacks are sent for completed, failed, or cancelled tasks.

## Media limits

- Image-to-Video: 1-2 JPEG, PNG, or WebP images, each no larger than 30 MB.
- Reference-to-Video: 0-9 images, 0-3 MP4/MOV videos, and 0-3 WAV/MP3 audio clips.
- Each reference video or audio clip must be 2-15 seconds; total referenced video duration and total referenced audio duration must each remain at or below 15 seconds.
- Reference-to-Video cannot be audio-only. Provide at least one image or video.

Source: [EvoLink Seedance 2.0 Complete Parameter Guide](https://docs.evolink.ai/en/api-manual/video-series/seedance2.0/seedance-2.0-overview).
