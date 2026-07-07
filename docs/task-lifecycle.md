# Task Lifecycle

The API is asynchronous.

1. Submit a create request.
2. Store the returned `id` or `task_id`.
3. Poll `GET /v1/tasks/{task_id}`.
4. Continue while status is `pending`, `queued`, `processing`, or `running`.
5. Stop on `completed` and print the final URL.
6. Stop on `failed` and show the failure reason.

Use a timeout or max polling attempts. Do not resubmit a create request after `TASK_SUBMITTED`; the task may already consume credits.

Generated asset URLs can expire. Download or copy final assets into durable storage promptly.
