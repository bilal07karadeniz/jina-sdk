# JinaSearch TypeScript SDK



The TypeScript SDK for the JinaSearch API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Batch()` — each with a small set of operations (`list`, `load`, `create`, `remove`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/jina-search-sdk/tags)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/voxgig-sdk/jina-search-sdk
npm install ./jina-search-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { JinaSearchSDK } from '@voxgig-sdk/jina-search-sdk'

const client = new JinaSearchSDK({
  apikey: process.env.JINA_SEARCH_APIKEY,
})
```

### 2. List batch records

`list()` resolves to an array of Batch ENTITIES — every operation
resolves to entities, not raw records. Iterate them directly, and call
`.data()` on one for the record it holds:

```ts
const batchs = await client.Batch().list()

for (const batch of batchs) {
  console.log(batch.data())
}
```

### 3. Load a batch

`load()` returns the entity and throws on failure; `.data()` reads its record:

```ts
try {
  const batch = await client.Batch().load({ id: 'example_id' })
  console.log(batch.data())
} catch (err) {
  console.error('load failed:', err)
}
```

### 4. Create, update, and remove

```ts
// Remove
await client.Batch().remove({
  id: 'example_id',
})
```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const batchs = await client.Batch().list()
  console.log(batchs.map((item) => item.data()))
} catch (err) {
  console.error('list failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = JinaSearchSDK.test()

const batchs = await client.Batch().list()
// batchs is an array of Batch entities, one per mock record
console.log(batchs.map((batch) => batch.data()))
```

You can also use the instance method:

```ts
const client = new JinaSearchSDK({ apikey: '...' })
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Batch()

// First call runs the operation and stores its result
await entity.list()

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data.id)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new JinaSearchSDK({
  apikey: '...',
  extend: [logger],
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
JINA_SEARCH_TEST_LIVE=TRUE
JINA_SEARCH_APIKEY=<your-key>
```

Then run:

```bash
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### JinaSearchSDK

#### Constructor

```ts
new JinaSearchSDK(options?: {
  apikey?: string
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Batch(data?)` | `BatchEntity` | Create a Batch entity instance. |
| `BatchEmbedding(data?)` | `BatchEmbeddingEntity` | Create a BatchEmbedding entity instance. |
| `BatchStatus(data?)` | `BatchStatusEntity` | Create a BatchStatus entity instance. |
| `Embedding(data?)` | `EmbeddingEntity` | Create an Embedding entity instance. |
| `GenerativeModel(data?)` | `GenerativeModelEntity` | Create a GenerativeModel entity instance. |
| `Model(data?)` | `ModelEntity` | Create a Model entity instance. |
| `Rerank(data?)` | `RerankEntity` | Create a Rerank entity instance. |
| `tester(testopts?, sdkopts?)` | `JinaSearchSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `JinaSearchSDK.test(testopts?, sdkopts?)` | `JinaSearchSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria, and return it. |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria, one per record. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity, and return it. |
| `remove` | `remove(reqmatch?, ctrl?): Promise<Entity>` | Remove an entity, and return it marked as deleted. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): JinaSearchSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's `data()` reads its record:

- `load` and `create` resolve to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).
- `remove` resolves to the entity, marked as deleted.

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### Batch

| Field | Description |
| --- | --- |
| `batch_id` | Unique identifier for the batch job. |
| `completed_at` | ISO 8601 timestamp when job completed (if finished). |
| `created_at` | ISO 8601 timestamp when job was created. |
| `error` | Error message if job failed. |
| `error_file_url` | URL to download error JSONL for failed lines. |
| `expires_at` | ISO 8601 timestamp when output URL expires (created_at + 24h). |
| `id` |  |
| `model` | The model used for embedding. |
| `output_url` | Signed URL to download output JSONL (24h expiry). |
| `stats` | Processing statistics. |
| `status` | Current status of the batch job. |

Operations: list, load, remove.

API path: `/v1/batches`

#### BatchEmbedding

| Field | Description |
| --- | --- |
| `id` |  |

Operations: load.

API path: `/v1/batch/{batch_id}/errors`

#### BatchStatus

| Field | Description |
| --- | --- |
| `batch_id` | Unique identifier for the batch job. |
| `completed_at` | ISO 8601 timestamp when job completed (if finished). |
| `created_at` | ISO 8601 timestamp when job was created. |
| `dimensions` | Number of dimensions for output embeddings (1-1024). |
| `error` | Error message if job failed. |
| `error_file_url` | URL to download error JSONL for failed lines. |
| `expires_at` | ISO 8601 timestamp when output URL expires (created_at + 24h). |
| `input` | Inline JSONL lines for small batches. |
| `input_url` | URL to input JSONL file (GCS, S3, or HTTP). |
| `model` | The model used for embedding. |
| `normalized` | If true (default), embeddings are L2-normalized to unit length. |
| `output_url` | Signed URL to download output JSONL (24h expiry). |
| `stats` | Processing statistics. |
| `status` | Current status of the batch job. |
| `task` | Task optimization: retrieval, text-matching, clustering, or classification. |
| `webhook_url` | URL to POST notification when job completes. |

Operations: create.

API path: `/v1/batch/embeddings`

#### Embedding

| Field | Description |
| --- | --- |
| `data` | List of embeddings, one per input item. |
| `model` | The model used to generate the embeddings. |
| `object` | Object type, always `list`. |
| `usage` | Token usage statistics. |

Operations: create.

API path: `/v1/embeddings`

#### GenerativeModel

| Field | Description |
| --- | --- |
| `frequency_penalty` |  |
| `logit_bias` |  |
| `logprobs` |  |
| `max_completion_tokens` |  |
| `messages` |  |
| `model` | The model to use. |
| `presence_penalty` |  |
| `response_format` |  |
| `seed` |  |
| `stop` |  |
| `stream` |  |
| `stream_options` |  |
| `temperature` |  |
| `top_logprobs` |  |
| `top_p` |  |

Operations: create.

API path: `/v1/chat/completions`

#### Model

| Field | Description |
| --- | --- |
| `context_length` | Maximum context length in tokens. |
| `created` | Unix timestamp when the model was released. |
| `datacenters` | Available datacenter locations. |
| `description` | Model description. |
| `hugging_face_id` | HuggingFace model ID. |
| `id` | Unique model identifier (e.g., `jina-ai/jina-embeddings-v3`). |
| `input_modalities` | Supported input modalities: `text`, `image`, `video`, `audio`. |
| `max_output_length` | Largest output the model produces: embedding dimensions for an embedding model, tokens for a generative one. |
| `name` | Human-readable model name. |
| `output_modalities` | Output types: `embeddings`, `text`. |
| `pricing` | Pricing information. |
| `quantization` | Quantization level, if any. |
| `supported_features` | Supported features. |
| `supported_sampling_parameters` | Supported sampling parameters. |

Operations: list, load.

API path: `/v1/models`

#### Rerank

| Field | Description |
| --- | --- |
| `model` | The model used for reranking. |
| `object` | Object type, always `list`. |
| `results` | Ranked documents, sorted by relevance score descending. |
| `usage` | Token usage statistics. |

Operations: create.

API path: `/v1/rerank`



## Entities


### Batch

Create an instance: `const batch = client.Batch()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |
| `remove(match)` | Remove the matching entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `batch_id` | `string` | Unique identifier for the batch job. |
| `completed_at` | `any` | ISO 8601 timestamp when job completed (if finished). |
| `created_at` | `string` | ISO 8601 timestamp when job was created. |
| `error` | `any` | Error message if job failed. |
| `error_file_url` | `any` | URL to download error JSONL for failed lines. |
| `expires_at` | `any` | ISO 8601 timestamp when output URL expires (created_at + 24h). |
| `id` | `string` |  |
| `model` | `string` | The model used for embedding. |
| `output_url` | `any` | Signed URL to download output JSONL (24h expiry). |
| `stats` | `any` | Processing statistics. |
| `status` | `string` | Current status of the batch job. |

#### Example: Load

```ts
const batch = await client.Batch().load({ id: 'batch_id' })
```

#### Example: List

```ts
const batchs = await client.Batch().list()
```


### BatchEmbedding

Create an instance: `const batch_embedding = client.BatchEmbedding()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` |  |


### BatchStatus

Create an instance: `const batch_status = client.BatchStatus()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `batch_id` | `string` | Unique identifier for the batch job. |
| `completed_at` | `any` | ISO 8601 timestamp when job completed (if finished). |
| `created_at` | `string` | ISO 8601 timestamp when job was created. |
| `dimensions` | `any` | Number of dimensions for output embeddings (1-1024). |
| `error` | `any` | Error message if job failed. |
| `error_file_url` | `any` | URL to download error JSONL for failed lines. |
| `expires_at` | `any` | ISO 8601 timestamp when output URL expires (created_at + 24h). |
| `input` | `any` | Inline JSONL lines for small batches. |
| `input_url` | `any` | URL to input JSONL file (GCS, S3, or HTTP). |
| `model` | `string` | The model used for embedding. |
| `normalized` | `any` | If true (default), embeddings are L2-normalized to unit length. |
| `output_url` | `any` | Signed URL to download output JSONL (24h expiry). |
| `stats` | `any` | Processing statistics. |
| `status` | `string` | Current status of the batch job. |
| `task` | `any` | Task optimization: retrieval, text-matching, clustering, or classification. |
| `webhook_url` | `any` | URL to POST notification when job completes. |

#### Example: Create

```ts
const batch_status = await client.BatchStatus().create({
  batch_id: 'example_batch_id',
  created_at: 'example_created_at',
  model: 'example_model',
  status: 'example_status',
})
```


### Embedding

Create an instance: `const embedding = client.Embedding()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `data` | `any` | List of embeddings, one per input item. |
| `model` | `string` | The model used to generate the embeddings. |
| `object` | `string` | Object type, always `list`. |
| `usage` | `any` | Token usage statistics. |

#### Example: Create

```ts
const embedding = await client.Embedding().create({
  data: 'example_data',
  model: 'example_model',
  usage: 'example_usage',
})
```


### GenerativeModel

Create an instance: `const generative_model = client.GenerativeModel()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `frequency_penalty` | `any` |  |
| `logit_bias` | `any` |  |
| `logprobs` | `any` |  |
| `max_completion_tokens` | `any` |  |
| `messages` | `any[]` |  |
| `model` | `string` | The model to use. |
| `presence_penalty` | `any` |  |
| `response_format` | `any` |  |
| `seed` | `any` |  |
| `stop` | `any` |  |
| `stream` | `boolean` |  |
| `stream_options` | `any` |  |
| `temperature` | `any` |  |
| `top_logprobs` | `any` |  |
| `top_p` | `any` |  |

#### Example: Create

```ts
const generative_model = await client.GenerativeModel().create({
  messages: [],
  model: 'example_model',
})
```


### Model

Create an instance: `const model = client.Model()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `context_length` | `number` | Maximum context length in tokens. |
| `created` | `number` | Unix timestamp when the model was released. |
| `datacenters` | `any[]` | Available datacenter locations. |
| `description` | `string` | Model description. |
| `hugging_face_id` | `string` | HuggingFace model ID. |
| `id` | `string` | Unique model identifier (e.g., `jina-ai/jina-embeddings-v3`). |
| `input_modalities` | `any[]` | Supported input modalities: `text`, `image`, `video`, `audio`. |
| `max_output_length` | `number` | Largest output the model produces: embedding dimensions for an embedding model, tokens for a generative one. |
| `name` | `string` | Human-readable model name. |
| `output_modalities` | `any[]` | Output types: `embeddings`, `text`. |
| `pricing` | `Record<string, any>` | Pricing information. |
| `quantization` | `string` | Quantization level, if any. |
| `supported_features` | `any[]` | Supported features. |
| `supported_sampling_parameters` | `any[]` | Supported sampling parameters. |

#### Example: Load

```ts
const model = await client.Model().load({ id: 'model_id' })
```

#### Example: List

```ts
const models = await client.Model().list()
```


### Rerank

Create an instance: `const rerank = client.Rerank()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `model` | `string` | The model used for reranking. |
| `object` | `string` | Object type, always `list`. |
| `results` | `any[]` | Ranked documents, sorted by relevance score descending. |
| `usage` | `Record<string, any>` | Token usage statistics. |

#### Example: Create

```ts
const rerank = await client.Rerank().create({
  model: 'example_model',
  results: [],
  usage: {},
})
```

## Features

This SDK ships 1 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`test`](#test) | Test transport |

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.


## Open types

3 fields are carried as open values rather than typed structures.
This follows from the API definition, not from a gap in this SDK: the
definition describes them with untagged unions —
`oneOf`/`anyOf` branches with no `discriminator` — so it never states which
variant a given value is. Nothing can select a branch reliably, so the SDK
passes the value through unchanged rather than assert a shape the API does not
guarantee.

| Entity | Field | Variants | Nesting |
| --- | --- | --- | --- |
| `embedding` | `data` | 3 | 5 levels |
| `embedding` | `usage` | 3 | 0 levels |
| `rerank` | `results` | 3 | 3 levels |

These values round-trip unchanged — read them, modify them, send them back. If
the API adds a `discriminator` to the definition, regenerating will type them.
Every other field is typed normally.

## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **TestFeature**: Test transport

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
jina-search/
├── src/
│   ├── JinaSearchSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { JinaSearchSDK } from '@voxgig-sdk/jina-search-sdk'
```

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const batch = client.Batch()
await batch.list()

// batch.data() now returns the batch data from the last `list`
// batch.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
