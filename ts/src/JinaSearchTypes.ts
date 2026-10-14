// Typed models for the JinaSearch SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Batch {
  batch_id: string
  completed_at?: any
  created_at: string
  error?: any
  error_file_url?: any
  expires_at?: any
  id?: string
  model: string
  output_url?: any
  stats?: any
  status: string
}

export interface BatchLoadMatch {
  id: string
}

export interface BatchListMatch {
  limit?: number
}

export interface BatchRemoveMatch {
  id: string
}

export interface BatchEmbedding {
  id?: string
}

export interface BatchEmbeddingLoadMatch {
  id: string

  // Selects a custom action instead of the plain load:
  //   'errors' | 'output'
  // The remaining keys are that action's own payload.
  $action?: string
  [action: string]: any
}

export interface BatchStatus {
  batch_id: string
  completed_at?: any
  created_at: string
  dimensions?: any
  error?: any
  error_file_url?: any
  expires_at?: any
  input?: any
  input_url?: any
  model: string
  normalized?: any
  output_url?: any
  stats?: any
  status: string
  task?: any
  webhook_url?: any
}

export interface BatchStatusCreateData {
  batch_id: string
  completed_at?: any
  created_at: string
  dimensions?: any
  error?: any
  error_file_url?: any
  expires_at?: any
  input?: any
  input_url?: any
  model: string
  normalized?: any
  output_url?: any
  stats?: any
  status: string
  task?: any
  webhook_url?: any
}

export interface Embedding {
  data: any
  model: string
  object?: string
  usage: any
}

export interface EmbeddingCreateData {
  data: any
  model: string
  object?: string
  usage: any
}

export interface GenerativeModel {
  frequency_penalty?: any
  logit_bias?: any
  logprobs?: any
  max_completion_tokens?: any
  messages: any[]
  model: string
  presence_penalty?: any
  response_format?: any
  seed?: any
  stop?: any
  stream?: boolean
  stream_options?: any
  temperature?: any
  top_logprobs?: any
  top_p?: any
}

export interface GenerativeModelCreateData {
  frequency_penalty?: any
  logit_bias?: any
  logprobs?: any
  max_completion_tokens?: any
  messages: any[]
  model: string
  presence_penalty?: any
  response_format?: any
  seed?: any
  stop?: any
  stream?: boolean
  stream_options?: any
  temperature?: any
  top_logprobs?: any
  top_p?: any
}

export interface Model {
  context_length: number
  created: number
  datacenters: any[]
  description: string
  hugging_face_id: string
  id: string
  input_modalities: any[]
  max_output_length: number
  name: string
  output_modalities: any[]
  pricing: Record<string, any>
  quantization: string
  supported_features: any[]
  supported_sampling_parameters: any[]
}

export interface ModelLoadMatch {
  id: string
}

export interface ModelListMatch {
  context_length?: number
  created?: number
  datacenters?: any[]
  description?: string
  hugging_face_id?: string
  id?: string
  input_modalities?: any[]
  max_output_length?: number
  name?: string
  output_modalities?: any[]
  pricing?: Record<string, any>
  quantization?: string
  supported_features?: any[]
  supported_sampling_parameters?: any[]
}

export interface Rerank {
  model: string
  object?: string
  results: any[]
  usage: Record<string, any>
}

export interface RerankCreateData {
  model: string
  object?: string
  results: any[]
  usage: Record<string, any>
}

