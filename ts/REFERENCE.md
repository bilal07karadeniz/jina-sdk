# JinaSearch TypeScript SDK Reference

Complete API reference for the JinaSearch TypeScript SDK.


## JinaSearchSDK

### Constructor

```ts
new JinaSearchSDK(options?: object)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | SDK configuration options. |
| `options.apikey` | `string` | API key for authentication. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `object` | Custom headers for all requests. |
| `options.feature` | `object` | Feature configuration. |
| `options.system` | `object` | System overrides (e.g. custom fetch). |


### Static Methods

#### `JinaSearchSDK.test(testopts?, sdkopts?)`

Create a test client with mock features active.

```ts
const client = JinaSearchSDK.test()
```

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `testopts` | `object` | Test feature options. |
| `sdkopts` | `object` | Additional SDK options merged with test defaults. |

**Returns:** `JinaSearchSDK` instance in test mode.


### Instance Methods

#### `Batch(data?: object)`

Create a new `Batch` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `BatchEntity` instance.

#### `BatchEmbedding(data?: object)`

Create a new `BatchEmbedding` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `BatchEmbeddingEntity` instance.

#### `BatchStatus(data?: object)`

Create a new `BatchStatus` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `BatchStatusEntity` instance.

#### `Embedding(data?: object)`

Create a new `Embedding` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `EmbeddingEntity` instance.

#### `GenerativeModel(data?: object)`

Create a new `GenerativeModel` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `GenerativeModelEntity` instance.

#### `Model(data?: object)`

Create a new `Model` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `ModelEntity` instance.

#### `Rerank(data?: object)`

Create a new `Rerank` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `RerankEntity` instance.

#### `options()`

Return a deep copy of the current SDK options.

**Returns:** `object`

#### `utility()`

Return a copy of the SDK utility object.

**Returns:** `object`

#### `direct(fetchargs?: object)`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `GET`). |
| `fetchargs.params` | `object` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `object` | Query string parameters. |
| `fetchargs.headers` | `object` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (objects are JSON-serialized). |
| `fetchargs.ctrl` | `object` | Control options (e.g. `{ explain: true }`). |
| `fetchargs.ctrl.signal` | `AbortSignal` | Aborts the request in flight: `ok` is then `false` and `err.code` is `request_aborted`. |

**Returns:** `Promise<{ ok, status, headers, data }>`. On a failure
`ok` is `false` and `err` holds the error.

#### `prepare(fetchargs?: object)`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `Promise<{ url, method, headers, body } | Error>`

#### `tester(testopts?, sdkopts?)`

Alias for `JinaSearchSDK.test()`.

**Returns:** `JinaSearchSDK` instance in test mode.

#### Cancelling a call

Every entity operation takes an optional `ctrl` object after its match or
data, and an `AbortSignal` in `ctrl.signal` cancels the request in flight.
The operation then rejects with an error whose `code` is
`request_aborted` and whose `cause` is the signal's reason. A request
whose signal has already aborted is not sent. `stream()` takes the signal
as `callopts.signal`, and ends when it aborts.


---

## BatchEntity

```ts
const batch = client.Batch()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `batch_id` | `string` | Yes | Unique identifier for the batch job. |
| `completed_at` | `any` | No | ISO 8601 timestamp when job completed (if finished). |
| `created_at` | `string` | Yes | ISO 8601 timestamp when job was created. |
| `error` | `any` | No | Error message if job failed. |
| `error_file_url` | `any` | No | URL to download error JSONL for failed lines. |
| `expires_at` | `any` | No | ISO 8601 timestamp when output URL expires (created_at + 24h). |
| `id` | `string` | No |  |
| `model` | `string` | Yes | The model used for embedding. |
| `output_url` | `any` | No | Signed URL to download output JSONL (24h expiry). |
| `stats` | `any` | No | Processing statistics. |
| `status` | `string` | Yes | Current status of the batch job. |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Batch().list()
```

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Batch().load({ id: 'batch_id' })
```

#### `remove(match: object, ctrl?: object)`

Remove the entity matching the given criteria. Resolves to the entity, marked as deleted.

```ts
const result = await client.Batch().remove({ id: 'batch_id' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `BatchEntity` instance with the same client and
options.

#### `client()`

Return the parent `JinaSearchSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## BatchEmbeddingEntity

```ts
const batch_embedding = client.BatchEmbedding()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | No |  |

### Actions

This entity exposes custom API actions in addition to the standard
operations. Select one with `$action` in the call's argument; the
remaining keys are sent as that action's payload.

| Action | Route | Call |
| --- | --- | --- |
| `errors` | `/v1/batch/{batch_id}/errors` | `client.BatchEmbedding().load({ $action: 'errors', ... })` |
| `output` | `/v1/batch/{batch_id}/output` | `client.BatchEmbedding().load({ $action: 'output', ... })` |

An action returns that action's OWN response, which is not necessarily a
BatchEmbedding record — check the API definition for its shape.

```ts
const result = await client.BatchEmbedding().load({
  $action: 'errors',
  /* ...the action's own arguments */
})
```

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `BatchEmbeddingEntity` instance with the same client and
options.

#### `client()`

Return the parent `JinaSearchSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## BatchStatusEntity

```ts
const batch_status = client.BatchStatus()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `batch_id` | `string` | Yes | Unique identifier for the batch job. |
| `completed_at` | `any` | No | ISO 8601 timestamp when job completed (if finished). |
| `created_at` | `string` | Yes | ISO 8601 timestamp when job was created. |
| `dimensions` | `any` | No | Number of dimensions for output embeddings (1-1024). |
| `error` | `any` | No | Error message if job failed. |
| `error_file_url` | `any` | No | URL to download error JSONL for failed lines. |
| `expires_at` | `any` | No | ISO 8601 timestamp when output URL expires (created_at + 24h). |
| `input` | `any` | No | Inline JSONL lines for small batches. |
| `input_url` | `any` | No | URL to input JSONL file (GCS, S3, or HTTP). |
| `model` | `string` | Yes | The model used for embedding. |
| `normalized` | `any` | No | If true (default), embeddings are L2-normalized to unit length. |
| `output_url` | `any` | No | Signed URL to download output JSONL (24h expiry). |
| `stats` | `any` | No | Processing statistics. |
| `status` | `string` | Yes | Current status of the batch job. |
| `task` | `any` | No | Task optimization: retrieval, text-matching, clustering, or classification. |
| `webhook_url` | `any` | No | URL to POST notification when job completes. |

### Operations

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data. Resolves to the created entity.

```ts
const result = await client.BatchStatus().create({
  batch_id: 'example_batch_id',
  created_at: 'example_created_at',
  model: 'example_model',
  status: 'example_status',
})
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `BatchStatusEntity` instance with the same client and
options.

#### `client()`

Return the parent `JinaSearchSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## EmbeddingEntity

```ts
const embedding = client.Embedding()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `any` | Yes | List of embeddings, one per input item. |
| `model` | `string` | Yes | The model used to generate the embeddings. |
| `object` | `string` | No | Object type, always `list`. |
| `usage` | `any` | Yes | Token usage statistics. |

### Operations

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data. Resolves to the created entity.

```ts
const result = await client.Embedding().create({
  data: 'example_data',
  model: 'example_model',
  usage: 'example_usage',
})
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `EmbeddingEntity` instance with the same client and
options.

#### `client()`

Return the parent `JinaSearchSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## GenerativeModelEntity

```ts
const generative_model = client.GenerativeModel()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `frequency_penalty` | `any` | No |  |
| `logit_bias` | `any` | No |  |
| `logprobs` | `any` | No |  |
| `max_completion_tokens` | `any` | No |  |
| `messages` | `any[]` | Yes |  |
| `model` | `string` | Yes | The model to use. |
| `presence_penalty` | `any` | No |  |
| `response_format` | `any` | No |  |
| `seed` | `any` | No |  |
| `stop` | `any` | No |  |
| `stream` | `boolean` | No |  |
| `stream_options` | `any` | No |  |
| `temperature` | `any` | No |  |
| `top_logprobs` | `any` | No |  |
| `top_p` | `any` | No |  |

### Operations

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data. Resolves to the created entity.

```ts
const result = await client.GenerativeModel().create({
  messages: [],
  model: 'example_model',
})
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `GenerativeModelEntity` instance with the same client and
options.

#### `client()`

Return the parent `JinaSearchSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## ModelEntity

```ts
const model = client.Model()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `context_length` | `number` | Yes | Maximum context length in tokens. |
| `created` | `number` | Yes | Unix timestamp when the model was released. |
| `datacenters` | `any[]` | Yes | Available datacenter locations. |
| `description` | `string` | Yes | Model description. |
| `hugging_face_id` | `string` | Yes | HuggingFace model ID. |
| `id` | `string` | Yes | Unique model identifier (e.g., `jina-ai/jina-embeddings-v3`). |
| `input_modalities` | `any[]` | Yes | Supported input modalities: `text`, `image`, `video`, `audio`. |
| `max_output_length` | `number` | Yes | Largest output the model produces: embedding dimensions for an embedding model, tokens for a generative one. |
| `name` | `string` | Yes | Human-readable model name. |
| `output_modalities` | `any[]` | Yes | Output types: `embeddings`, `text`. |
| `pricing` | `Record<string, any>` | Yes | Pricing information. |
| `quantization` | `string` | Yes | Quantization level, if any. |
| `supported_features` | `any[]` | Yes | Supported features. |
| `supported_sampling_parameters` | `any[]` | Yes | Supported sampling parameters. |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Model().list()
```

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Model().load({ id: 'model_id' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `ModelEntity` instance with the same client and
options.

#### `client()`

Return the parent `JinaSearchSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## RerankEntity

```ts
const rerank = client.Rerank()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `model` | `string` | Yes | The model used for reranking. |
| `object` | `string` | No | Object type, always `list`. |
| `results` | `any[]` | Yes | Ranked documents, sorted by relevance score descending. |
| `usage` | `Record<string, any>` | Yes | Token usage statistics. |

### Operations

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data. Resolves to the created entity.

```ts
const result = await client.Rerank().create({
  model: 'example_model',
  results: [],
  usage: {},
})
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `RerankEntity` instance with the same client and
options.

#### `client()`

Return the parent `JinaSearchSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `test` | 0.0.1 | Test transport |


Features are activated via the `feature` option:

```ts
const client = new JinaSearchSDK({
  feature: {
    test: { active: true },
  }
})
```


### Configuring features

Each feature is inactive until switched on, and an SDK with no feature
configured does no feature work at all. Every option below keeps its default
unless you name it.

The array form of \`feature\` is significant: several features wrap the
transport, and the order you list them in is the order they nest.

#### `test`

Test transport.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |

| Option | Type |
|---|---|
| `entity` | map |
| `net` | map |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.test.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Installs the BASE transport that the wrapping features wrap, so it must be
  activated before them.
- Inactive by default: leaving it out costs nothing at runtime.

