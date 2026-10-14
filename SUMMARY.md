# Jina Search Foundation API

> Best-in-class embeddings, rerankers and document models for multilingual and multimodal search.
>
> ## Capabilities
>
> - **Text embeddings**, dense vectors for semantic search, similarity, clustering and classification, in 100+ languages.
> - **Multimodal embeddings**, images, video, audio and PDFs embedded into the same space as text, so a query in one modality retrieves another.
> - **Reranking**, score a query against a candidate set and reorder it; more accurate than embedding similarity, and the usual second stage after it.
> - **Document OCR**, read a page image and return its content as text or markdown, with tables and layout preserved, over the OpenAI chat completions schema.
> - **Batch embeddings**, the same embedding models over JSONL, asynchronously, for workloads too large to send inline.
>
> ## Authentication
>
> Every endpoint except `GET /v1/models` requires a key:
>
> ```
> Authorization: Bearer jina_YOUR_API_KEY
> ```
>
> Get one at [jina.ai/api-dashboard/key-manager](https://jina.ai/api-dashboard/key-manager).
>
> ## Rate limits
>
> Requests per minute and tokens per minute. Anything over a limit answers `429`.
>
> | Endpoint | Free | Paid | Premium |
> |---|---|---|---|
> | `/v1/embeddings` | 500 RPM · 1M TPM | 500 RPM · 10M TPM | 5,000 RPM · 100M TPM |
> | `/v1/rerank` | 500 RPM · 1M TPM | 500 RPM · 10M TPM | 5,000 RPM · 100M TPM |
> | `/v1/chat/completions` | 100 RPM · 500K TPM | 100 RPM · 5M TPM | 1,000 RPM · 50M TPM |
>
> ## Errors
>
> Failures carry a `detail`, a `code` from the table below and the `request_id` to quote in a support request. `/v1/chat/completions` is the exception: it answers in OpenAI&#39;s error envelope, with the same code inside it.
>
> | Code | Status | Meaning |
> |---|---|---|
> | `INPUT_INVALID_LABELS` | 400 | Invalid training labels |
> | `INPUT_LABEL_LIMIT_EXCEEDED` | 400 | Label limit exceeded: &lt;current&gt; labels provided, maximum &lt;limit&gt; allowed for your plan |
> | `INPUT_MODEL_NOT_FOUND` | 400 | Model &#39;&lt;model&gt;&#39; not found |
> | `INPUT_TOKEN_LIMIT_EXCEEDED` | 400 | Input text exceeds the model&#39;s maximum of &lt;`max_tokens`&gt; tokens |
> | `AUTH_INVALID_API_KEY` | 401 | Invalid API key |
> | `AUTH_INVALID_FORMAT` | 401 | Invalid authorization format |
> | `AUTH_MISSING_API_KEY` | 401 | Authentication required |
> | `AUTHZ_INSUFFICIENT_BALANCE` | 403 | Insufficient account balance |
> | `AUTHZ_RESOURCE_LIMIT_EXCEEDED` | 403 | Resource limit exceeded for your plan |
> | `RESOURCE_NOT_FOUND` | 404 | &lt;`resource_type`&gt; &#39;&lt;`resource_id`&gt;&#39; not found or access denied |
> | `CONFLICT_RESOURCE_BUSY` | 409 | &lt;`resource_type`&gt; &#39;&lt;`resource_id`&gt;&#39; is currently being modified |
> | `RATE_CONCURRENCY_LIMIT_EXCEEDED` | 429 | Concurrency limit exceeded: &lt;current&gt;/&lt;limit&gt; concurrent requests |
> | `RATE_IP_LIMIT_EXCEEDED` | 429 | IP rate limit exceeded |
> | `RATE_REQUEST_LIMIT_EXCEEDED` | 429 | Request rate limit exceeded: &lt;current&gt;/&lt;limit&gt; requests per minute |
> | `RATE_TOKEN_LIMIT_EXCEEDED` | 429 | Token rate limit exceeded: &lt;current&gt;/&lt;limit&gt; tokens per minute |
> | `INTERNAL_ERROR` | 500 | An unexpected error occurred |
> | `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
> | `SERVICE_TIMEOUT` | 504 | Service request timed out |

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 7 entities and 11 HTTP routes. There are 1 SDK targets.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### Batch

Results: Successful Response.

SDK operations: `list`, `load`, `remove`.

Key fields to recognise:

- `batch_id`: Unique identifier for the batch job.
- `completed_at`: ISO 8601 timestamp when job completed (if finished).
- `created_at`: ISO 8601 timestamp when job was created.
- `error`: Error message if job failed.
- `error_file_url`: URL to download error JSONL for failed lines.

### BatchEmbedding

Results: Successful Response.

SDK operations: `load`.

### BatchStatus

Results: Successful Response.

SDK operations: `create`.

Key fields to recognise:

- `batch_id`: Unique identifier for the batch job.
- `completed_at`: ISO 8601 timestamp when job completed (if finished).
- `created_at`: ISO 8601 timestamp when job was created.
- `dimensions`: Number of dimensions for output embeddings (1-1024).
- `error`: Error message if job failed.

### Embedding

Results: Successful Response.

SDK operations: `create`.

Key fields to recognise:

- `data`: List of embeddings, one per input item. A sparse model returns each as a map of token to weight instead of a vector.
- `model`: The model used to generate the embeddings.
- `object`: Object type, always `list`.
- `usage`: Token usage statistics.

### GenerativeModel

Results: An OpenAI chat completion, or a stream of `chat.completion.chunk` events when `stream` is true.

SDK operations: `create`.

Key fields to recognise:

- `model`: The model to use.

### Model

Results: Successful Response.

SDK operations: `list`, `load`.

Key fields to recognise:

- `context_length`: Maximum context length in tokens.
- `created`: Unix timestamp when the model was released.
- `datacenters`: Available datacenter locations.
- `description`: Model description.
- `hugging_face_id`: HuggingFace model ID.

### Rerank

Results: Successful Response.

SDK operations: `create`.

Key fields to recognise:

- `model`: The model used for reranking.
- `object`: Object type, always `list`.
- `results`: Ranked documents, sorted by relevance score descending.
- `usage`: Token usage statistics.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| Batch | `list` | `GET /v1/batches` | Required |
| Batch | `load` | `GET /v1/batch/{batch_id}` | Required |
| Batch | `remove` | `DELETE /v1/batch/{batch_id}` | Required |
| BatchEmbedding | `load` | `GET /v1/batch/{batch_id}/errors` | Required |
| BatchEmbedding | `load` | `GET /v1/batch/{batch_id}/output` | Required |
| BatchStatus | `create` | `POST /v1/batch/embeddings` | Required |
| Embedding | `create` | `POST /v1/embeddings` | Required |
| GenerativeModel | `create` | `POST /v1/chat/completions` | Required |
| Model | `list` | `GET /v1/models` | See reference |
| Model | `load` | `GET /v1/models/{model_id}` | See reference |
| Rerank | `create` | `POST /v1/rerank` | Required |

## Connect to the API

- API server: `https://api.jina.ai`

The default credential is sent in the `Authorization` header with the `Bearer` prefix.

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `test`: In-memory mock transport for testing without a live server

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

