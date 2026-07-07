# Seedance 2 Video Generation API Reference

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

## Task Status

- Method: `GET`
- Endpoint: `https://api.evolink.ai/v1/tasks/{task_id}`

Poll until `status` is `completed` or `failed`. On success, read the final URL from the response fields documented in `docs/response-schema.md`.
