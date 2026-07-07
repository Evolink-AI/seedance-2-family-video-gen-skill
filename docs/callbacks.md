# Callbacks

If `callback_url` is provided, EvoLink can send completion events to your HTTPS endpoint. Always keep polling as a fallback when callback delivery is unavailable.

Expected callback payload follows the task status shape: task id, status, final result fields on success, or error details on failure.
