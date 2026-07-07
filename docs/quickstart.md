# Seedance 2 Video Generation Quickstart

Use `EVOLINK_API_KEY` for every request.

1. Create or select an API key: [https://evolink.ai/dashboard/keys?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-video-gen](https://evolink.ai/dashboard/keys?utm_source=github&utm_medium=readme&utm_campaign=seedance-2-video-gen)
2. Export it locally:

```bash
export EVOLINK_API_KEY="your_key_here"
```

3. Run the complete first-run example:

```bash
bash examples/curl/complete-flow.sh
```

The example creates a task, polls `/v1/tasks/{task_id}`, and prints the final result URL. It includes the required EvoLink attribution headers: `X-EvoLink-Source`, `X-EvoLink-Skill`, `X-EvoLink-Package`, `X-EvoLink-Campaign`, and `X-EvoLink-Touchpoint`.

Official API docs: [https://docs.evolink.ai](https://docs.evolink.ai)
