
import { BaseFeature } from './feature/base/BaseFeature'
import { TestFeature } from './feature/test/TestFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   test: TestFeature,

}


const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'JinaSearch',
        slug: "jina-search",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     test:     {
      "options": {
        "active": false
      },
      "optspec": {
        "entity": "`$MAP`",
        "net": "`$MAP`"
      },
      "strict": false,
      "transport": "base"
    },

  }


  options = {
    base: "https://api.jina.ai",

    auth: {
      prefix: 'Bearer',
    },

    headers: {
      "content-type": "application/json"
    },

    entity: {
      
        batch: {
        },
  
        batch_embedding: {
        },
  
        batch_status: {
        },
  
        embedding: {
        },
  
        generative_model: {
        },
  
        model: {
        },
  
        rerank: {
        },
  
    }
  }


  entity = {
    "batch": {
      "fields": [
        {
          "name": "batch_id",
          "title": "Batch Id",
          "type": "`$STRING`",
          "req": true,
          "short": "Unique identifier for the batch job."
        },
        {
          "name": "completed_at",
          "title": "Completed At",
          "type": "`$ANY`",
          "short": "ISO 8601 timestamp when job completed (if finished)."
        },
        {
          "name": "created_at",
          "title": "Created At",
          "type": "`$STRING`",
          "req": true,
          "short": "ISO 8601 timestamp when job was created."
        },
        {
          "name": "error",
          "title": "Error",
          "type": "`$ANY`",
          "short": "Error message if job failed."
        },
        {
          "name": "error_file_url",
          "title": "Error File Url",
          "type": "`$ANY`",
          "short": "URL to download error JSONL for failed lines."
        },
        {
          "name": "expires_at",
          "title": "Expires At",
          "type": "`$ANY`",
          "short": "ISO 8601 timestamp when output URL expires (created_at + 24h)."
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$STRING`"
        },
        {
          "name": "model",
          "title": "Model",
          "type": "`$STRING`",
          "req": true,
          "short": "The model used for embedding."
        },
        {
          "name": "output_url",
          "title": "Output Url",
          "type": "`$ANY`",
          "short": "Signed URL to download output JSONL (24h expiry)."
        },
        {
          "name": "stats",
          "title": "Stats",
          "type": "`$ANY`",
          "short": "Processing statistics."
        },
        {
          "name": "status",
          "title": "Status",
          "type": "`$STRING`",
          "req": true,
          "short": "Current status of the batch job."
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "batch",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/v1/batches",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "batches"
                }
              ],
              "parts": [
                "v1",
                "batches"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "query": [
                  {
                    "name": "limit",
                    "orig": "limit",
                    "type": "`$INTEGER`",
                    "kind": "query",
                    "example": 20
                  }
                ]
              },
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        },
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/v1/batch/{batch_id}",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "batch"
                },
                {
                  "var": "id"
                }
              ],
              "parts": [
                "v1",
                "batch",
                "{id}"
              ],
              "rename": {
                "param": {
                  "batch_id": "id"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "batch_id",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "id"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        },
        "remove": {
          "input": "data",
          "name": "remove",
          "points": [
            {
              "kind": "http",
              "method": "DELETE",
              "orig": "/v1/batch/{batch_id}",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "batch"
                },
                {
                  "var": "id"
                }
              ],
              "parts": [
                "v1",
                "batch",
                "{id}"
              ],
              "rename": {
                "param": {
                  "batch_id": "id"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "batch_id",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "id"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "batch_embedding": {
      "fields": [
        {
          "name": "id",
          "title": "Id",
          "type": "`$STRING`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "batch_embedding",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/v1/batch/{batch_id}/errors",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "batch"
                },
                {
                  "var": "id"
                },
                {
                  "lit": "errors"
                }
              ],
              "parts": [
                "v1",
                "batch",
                "{id}",
                "errors"
              ],
              "rename": {
                "param": {
                  "batch_id": "id"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "batch_id",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "$action": "errors",
                "exist": [
                  "id"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            },
            {
              "kind": "http",
              "method": "GET",
              "orig": "/v1/batch/{batch_id}/output",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "batch"
                },
                {
                  "var": "id"
                },
                {
                  "lit": "output"
                }
              ],
              "parts": [
                "v1",
                "batch",
                "{id}",
                "output"
              ],
              "rename": {
                "param": {
                  "batch_id": "id"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "batch_id",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "$action": "output",
                "exist": [
                  "id"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "batch_status": {
      "fields": [
        {
          "name": "batch_id",
          "title": "Batch Id",
          "type": "`$STRING`",
          "req": true,
          "short": "Unique identifier for the batch job."
        },
        {
          "name": "completed_at",
          "title": "Completed At",
          "type": "`$ANY`",
          "short": "ISO 8601 timestamp when job completed (if finished)."
        },
        {
          "name": "created_at",
          "title": "Created At",
          "type": "`$STRING`",
          "req": true,
          "short": "ISO 8601 timestamp when job was created."
        },
        {
          "name": "dimensions",
          "title": "Dimensions",
          "type": "`$ANY`",
          "short": "Number of dimensions for output embeddings (1-1024)."
        },
        {
          "name": "error",
          "title": "Error",
          "type": "`$ANY`",
          "short": "Error message if job failed."
        },
        {
          "name": "error_file_url",
          "title": "Error File Url",
          "type": "`$ANY`",
          "short": "URL to download error JSONL for failed lines."
        },
        {
          "name": "expires_at",
          "title": "Expires At",
          "type": "`$ANY`",
          "short": "ISO 8601 timestamp when output URL expires (created_at + 24h)."
        },
        {
          "name": "input",
          "title": "Input",
          "type": "`$ANY`",
          "short": "Inline JSONL lines for small batches."
        },
        {
          "name": "input_url",
          "title": "Input Url",
          "type": "`$ANY`",
          "short": "URL to input JSONL file (GCS, S3, or HTTP)."
        },
        {
          "name": "model",
          "title": "Model",
          "type": "`$STRING`",
          "req": true,
          "short": "The model used for embedding."
        },
        {
          "name": "normalized",
          "title": "Normalized",
          "type": "`$ANY`",
          "short": "If true (default), embeddings are L2-normalized to unit length."
        },
        {
          "name": "output_url",
          "title": "Output Url",
          "type": "`$ANY`",
          "short": "Signed URL to download output JSONL (24h expiry)."
        },
        {
          "name": "stats",
          "title": "Stats",
          "type": "`$ANY`",
          "short": "Processing statistics."
        },
        {
          "name": "status",
          "title": "Status",
          "type": "`$STRING`",
          "req": true,
          "short": "Current status of the batch job."
        },
        {
          "name": "task",
          "title": "Task",
          "type": "`$ANY`",
          "short": "Task optimization: retrieval, text-matching, clustering, or classification."
        },
        {
          "name": "webhook_url",
          "title": "Webhook Url",
          "type": "`$ANY`",
          "short": "URL to POST notification when job completes."
        }
      ],
      "name": "batch_status",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/v1/batch/embeddings",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "batch"
                },
                {
                  "lit": "embeddings"
                }
              ],
              "parts": [
                "v1",
                "batch",
                "embeddings"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "embedding": {
      "fields": [
        {
          "name": "data",
          "title": "Data",
          "type": "`$ANY`",
          "req": true,
          "short": "List of embeddings, one per input item."
        },
        {
          "name": "model",
          "title": "Model",
          "type": "`$STRING`",
          "req": true,
          "short": "The model used to generate the embeddings."
        },
        {
          "name": "object",
          "title": "Object",
          "type": "`$STRING`",
          "short": "Object type, always `list`."
        },
        {
          "name": "usage",
          "title": "Usage",
          "type": "`$ANY`",
          "req": true,
          "short": "Token usage statistics."
        }
      ],
      "name": "embedding",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/v1/embeddings",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "embeddings"
                }
              ],
              "parts": [
                "v1",
                "embeddings"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "generative_model": {
      "fields": [
        {
          "name": "frequency_penalty",
          "title": "Frequency Penalty",
          "type": "`$ANY`"
        },
        {
          "name": "logit_bias",
          "title": "Logit Bias",
          "type": "`$ANY`"
        },
        {
          "name": "logprobs",
          "title": "Logprobs",
          "type": "`$ANY`"
        },
        {
          "name": "max_completion_tokens",
          "title": "Max Completion Tokens",
          "type": "`$ANY`"
        },
        {
          "name": "messages",
          "title": "Messages",
          "type": "`$ARRAY`",
          "req": true
        },
        {
          "name": "model",
          "title": "Model",
          "type": "`$STRING`",
          "req": true,
          "short": "The model to use."
        },
        {
          "name": "presence_penalty",
          "title": "Presence Penalty",
          "type": "`$ANY`"
        },
        {
          "name": "response_format",
          "title": "Response Format",
          "type": "`$ANY`"
        },
        {
          "name": "seed",
          "title": "Seed",
          "type": "`$ANY`"
        },
        {
          "name": "stop",
          "title": "Stop",
          "type": "`$ANY`"
        },
        {
          "name": "stream",
          "title": "Stream",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "stream_options",
          "title": "Stream Options",
          "type": "`$ANY`"
        },
        {
          "name": "temperature",
          "title": "Temperature",
          "type": "`$ANY`"
        },
        {
          "name": "top_logprobs",
          "title": "Top Logprobs",
          "type": "`$ANY`"
        },
        {
          "name": "top_p",
          "title": "Top P",
          "type": "`$ANY`"
        }
      ],
      "name": "generative_model",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/v1/chat/completions",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "chat"
                },
                {
                  "lit": "completions"
                }
              ],
              "parts": [
                "v1",
                "chat",
                "completions"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "model": {
      "fields": [
        {
          "name": "context_length",
          "title": "Context Length",
          "type": "`$INTEGER`",
          "req": true,
          "short": "Maximum context length in tokens."
        },
        {
          "name": "created",
          "title": "Created",
          "type": "`$INTEGER`",
          "req": true,
          "short": "Unix timestamp when the model was released."
        },
        {
          "name": "datacenters",
          "title": "Datacenters",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Available datacenter locations."
        },
        {
          "name": "description",
          "title": "Description",
          "type": "`$STRING`",
          "req": true,
          "short": "Model description."
        },
        {
          "name": "hugging_face_id",
          "title": "Hugging Face Id",
          "type": "`$STRING`",
          "req": true,
          "short": "HuggingFace model ID."
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$STRING`",
          "req": true,
          "short": "Unique model identifier (e.g., `jina-ai/jina-embeddings-v3`)."
        },
        {
          "name": "input_modalities",
          "title": "Input Modalities",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Supported input modalities: `text`, `image`, `video`, `audio`."
        },
        {
          "name": "max_output_length",
          "title": "Max Output Length",
          "type": "`$INTEGER`",
          "req": true,
          "short": "Largest output the model produces: embedding dimensions for an embedding model, tokens for a generative one."
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$STRING`",
          "req": true,
          "short": "Human-readable model name."
        },
        {
          "name": "output_modalities",
          "title": "Output Modalities",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Output types: `embeddings`, `text`."
        },
        {
          "name": "pricing",
          "title": "Pricing",
          "type": "`$OBJECT`",
          "req": true,
          "short": "Pricing information."
        },
        {
          "name": "quantization",
          "title": "Quantization",
          "type": "`$STRING`",
          "req": true,
          "short": "Quantization level, if any."
        },
        {
          "name": "supported_features",
          "title": "Supported Features",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Supported features."
        },
        {
          "name": "supported_sampling_parameters",
          "title": "Supported Sampling Parameters",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Supported sampling parameters."
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "model",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/v1/models",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "models"
                }
              ],
              "parts": [
                "v1",
                "models"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        },
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/v1/models/{model_id}",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "models"
                },
                {
                  "var": "id"
                }
              ],
              "parts": [
                "v1",
                "models",
                "{id}"
              ],
              "rename": {
                "param": {
                  "model_id": "id"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "model_id",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "id"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "rerank": {
      "fields": [
        {
          "name": "model",
          "title": "Model",
          "type": "`$STRING`",
          "req": true,
          "short": "The model used for reranking."
        },
        {
          "name": "object",
          "title": "Object",
          "type": "`$STRING`",
          "short": "Object type, always `list`."
        },
        {
          "name": "results",
          "title": "Results",
          "type": "`$ARRAY`",
          "req": true,
          "short": "Ranked documents, sorted by relevance score descending."
        },
        {
          "name": "usage",
          "title": "Usage",
          "type": "`$OBJECT`",
          "req": true,
          "short": "Token usage statistics."
        }
      ],
      "name": "rerank",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/v1/rerank",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "rerank"
                }
              ],
              "parts": [
                "v1",
                "rerank"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

