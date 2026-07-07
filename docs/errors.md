# Error Handling

| Status | Meaning | Recovery |
|---:|---|---|
| 400 | Invalid request or unsupported input | Check the request schema and model limits. |
| 401 | Missing or invalid API key | Open [EvoLink API Keys](https://evolink.ai/dashboard/keys?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-video-gen), create or select a key, then export `EVOLINK_API_KEY`. |
| 402 | Insufficient balance | Add credits from [EvoLink API Keys](https://evolink.ai/dashboard/keys?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-video-gen). |
| 429 | Rate limit | Wait and retry with backoff. |
| 5xx | Temporary service issue | Retry later; do not duplicate a submitted task. |

Key validation should use a non-generating endpoint such as `GET https://api.evolink.ai/v1/credits`. It does not create a generation task.
