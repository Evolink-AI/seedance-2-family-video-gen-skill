# Response Schema

## Create Response

```json
{
  "id": "task_123",
  "status": "pending",
  "task_info": { "estimated_time": 60 }
}
```

## Pending Status

```json
{
  "id": "task_123",
  "status": "processing",
  "progress": 42
}
```

## Completed Status

```json
{
  "id": "task_123",
  "status": "completed",
  "output": {"video_url": "https://.../video.mp4"}
}
```

## Failed Status

```json
{
  "id": "task_123",
  "status": "failed",
  "error": { "message": "Validation failed" }
}
```
