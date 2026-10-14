import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "batch",
    "accessor": "Batch",
    "op": "list",
    "method": "GET",
    "path": "/v1/batches",
    "args": [],
    "select": {
      "limit": 20
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "limit"
    ],
    "queryArgs": [
      {
        "name": "limit",
        "wire": "limit"
      }
    ],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": [
      {
        "batch_id": "x",
        "status": "pending",
        "model": "x",
        "created_at": "x",
        "completed_at": "x",
        "expires_at": "x",
        "output_url": "x",
        "error_file_url": "x",
        "error": "x",
        "stats": {
          "total": 1,
          "completed": 1,
          "failed": 1,
          "total_tokens": 1
        }
      }
    ],
    "idField": "id"
  },
  {
    "entity": "batch",
    "accessor": "Batch",
    "op": "load",
    "method": "GET",
    "path": "/v1/batch/{batch_id}",
    "args": [
      {
        "name": "id",
        "wire": "batch_id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "batch_id": "x",
      "status": "pending",
      "model": "x",
      "created_at": "x",
      "completed_at": "x",
      "expires_at": "x",
      "output_url": "x",
      "error_file_url": "x",
      "error": "x",
      "stats": {
        "total": 1,
        "completed": 1,
        "failed": 1,
        "total_tokens": 1
      }
    },
    "idField": "id"
  },
  {
    "entity": "batch",
    "accessor": "Batch",
    "op": "remove",
    "method": "DELETE",
    "path": "/v1/batch/{batch_id}",
    "args": [
      {
        "name": "id",
        "wire": "batch_id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "batch_id": "x",
      "status": "pending",
      "model": "x",
      "created_at": "x",
      "completed_at": "x",
      "expires_at": "x",
      "output_url": "x",
      "error_file_url": "x",
      "error": "x",
      "stats": {
        "total": 1,
        "completed": 1,
        "failed": 1,
        "total_tokens": 1
      }
    },
    "idField": "id"
  },
  {
    "entity": "batch_embedding",
    "accessor": "BatchEmbedding",
    "op": "load",
    "method": "GET",
    "path": "/v1/batch/{batch_id}/errors",
    "action": "errors",
    "args": [
      {
        "name": "id",
        "wire": "batch_id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "batch_embedding",
    "accessor": "BatchEmbedding",
    "op": "load",
    "method": "GET",
    "path": "/v1/batch/{batch_id}/output",
    "action": "output",
    "args": [
      {
        "name": "id",
        "wire": "batch_id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "batch_status",
    "accessor": "BatchStatus",
    "op": "create",
    "method": "POST",
    "path": "/v1/batch/embeddings",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "batch_id": "x",
      "status": "pending",
      "model": "x",
      "created_at": "x",
      "completed_at": "x",
      "expires_at": "x",
      "output_url": "x",
      "error_file_url": "x",
      "error": "x",
      "stats": {
        "total": 1,
        "completed": 1,
        "failed": 1,
        "total_tokens": 1
      }
    },
    "idField": "id"
  },
  {
    "entity": "embedding",
    "accessor": "Embedding",
    "op": "create",
    "method": "POST",
    "path": "/v1/embeddings",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "model": "x",
      "object": "x",
      "usage": {
        "total_tokens": 1,
        "prompt_tokens": 1,
        "image_tokens": 1,
        "audio_tokens": 1,
        "video_tokens": 1
      },
      "data": [
        {
          "object": "x",
          "index": 1,
          "embedding": "x"
        }
      ]
    },
    "idField": "id"
  },
  {
    "entity": "generative_model",
    "accessor": "GenerativeModel",
    "op": "create",
    "method": "POST",
    "path": "/v1/chat/completions",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "model",
    "accessor": "Model",
    "op": "list",
    "method": "GET",
    "path": "/v1/models",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [],
    "status": 200,
    "sample": {
      "data": [
        {
          "context_length": 8192,
          "created": 1725840000,
          "datacenters": [
            {
              "country_code": "US"
            }
          ],
          "description": "jina-embeddings-v3 is a multilingual embedding model...",
          "hugging_face_id": "jinaai/jina-embeddings-v3",
          "id": "jina-ai/jina-embeddings-v3",
          "input_modalities": [
            "text"
          ],
          "max_output_length": 1024,
          "name": "Jina AI: Jina Embeddings v3",
          "output_modalities": [
            "embeddings"
          ],
          "pricing": {
            "completion": "0",
            "image": "0",
            "input_cache_read": "0",
            "input_cache_write": "0",
            "prompt": "0.00000005",
            "request": "0"
          },
          "quantization": "",
          "supported_features": [],
          "supported_sampling_parameters": []
        }
      ]
    },
    "idField": "id"
  },
  {
    "entity": "model",
    "accessor": "Model",
    "op": "load",
    "method": "GET",
    "path": "/v1/models/{model_id}",
    "args": [
      {
        "name": "id",
        "wire": "model_id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [],
    "status": 200,
    "sample": {
      "id": "x",
      "hugging_face_id": "x",
      "name": "x",
      "created": 1,
      "input_modalities": [
        "x"
      ],
      "output_modalities": [
        "x"
      ],
      "quantization": "x",
      "context_length": 1,
      "max_output_length": 1,
      "pricing": {
        "prompt": "x",
        "completion": "x",
        "image": "x",
        "request": "x",
        "input_cache_read": "x",
        "input_cache_write": "x"
      },
      "supported_sampling_parameters": [
        "x"
      ],
      "supported_features": [
        "x"
      ],
      "description": "x",
      "datacenters": [
        {
          "country_code": "x"
        }
      ]
    },
    "idField": "id"
  },
  {
    "entity": "rerank",
    "accessor": "Rerank",
    "op": "create",
    "method": "POST",
    "path": "/v1/rerank",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "header",
          "name": "authorization",
          "scheme": "bearer"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "model": "x",
      "object": "x",
      "usage": {
        "total_tokens": 1
      },
      "results": [
        {
          "index": 1,
          "relevance_score": 1,
          "document": "x",
          "embedding": [
            1
          ]
        }
      ]
    },
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
