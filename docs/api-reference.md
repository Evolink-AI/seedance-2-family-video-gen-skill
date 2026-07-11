# Seedance 2.0 Complete API Reference

This repository covers the full Seedance 2.0 family: Standard, Fast, and Mini across Text-to-Video, Image-to-Video, and Reference-to-Video. See the [nine-model matrix](./model-matrix.md).

## Create Task

- Method: `POST`
- Endpoint: `https://api.evolink.ai/v1/videos/generations`
- Auth: `Authorization: Bearer ${EVOLINK_API_KEY}`
- Content type: `application/json`

Required attribution headers:

```text
X-EvoLink-Source: skill
X-EvoLink-Skill: seedance-2-video-gen
X-EvoLink-Package: evolink-seedance-2-skill
X-EvoLink-Campaign: seedance-2-video-gen
X-EvoLink-Touchpoint: first-run
```

Example body:

```json
{
  "model": "seedance-2.0-text-to-video",
  "prompt": "A calm product reveal on a white studio background",
  "duration": 4,
  "quality": "480p",
  "aspect_ratio": "16:9"
}
```

## Request fields

| Field | Type | Required | Rules |
|---|---|---|---|
| `model` | string | Yes | One of the nine IDs in `model-matrix.md` |
| `prompt` | string | Yes | Chinese or English; maximum 10,000 tokens |
| `image_urls` | string[] | Conditional | Image: exactly 1-2; Reference: 0-9; Text: unsupported |
| `video_urls` | string[] | Conditional | Reference only, 0-3 |
| `audio_urls` | string[] | Conditional | Reference only, 0-3; cannot be the only media |
| `duration` | integer | No | 4-15, default 5 |
| `quality` | string | No | 480p or 720p for all; 1080p for Standard only |
| `aspect_ratio` | string | No | `16:9`, `9:16`, `1:1`, `4:3`, `3:4`, `21:9`, `adaptive` |
| `generate_audio` | boolean | No | Default `true` |
| `content_filter` | boolean | No | Default `true`; `false` changes billing and does not disable prohibited-content enforcement |
| `model_params` | object | No | Text-to-Video Standard and Fast only |
| `callback_url` | HTTPS URL | No | No private IP; maximum 2,048 characters |

### Text-to-Video

Text models reject `image_urls`, `video_urls`, and `audio_urls`. `model_params.web_search` applies only to Standard and Fast text models.

### Image-to-Video

Provide one image for first-frame animation or two images for first/last-frame interpolation. Video and audio inputs are unsupported.

### Reference-to-Video

Provide at least one image or video. Images, videos, and audio may be combined within the limits documented in `model-matrix.md`; audio alone is invalid.

## Task Status

- Method: `GET`
- Endpoint: `https://api.evolink.ai/v1/tasks/{task_id}`

Poll until `status` is `completed` or `failed`. On success, read the final URL from the response fields documented in `docs/response-schema.md`. Callback response bodies follow the same task schema; failed callback delivery is retried up to three times.
