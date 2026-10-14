

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { JinaSearchSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('BatchStatusEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when JINA_SEARCH_TEST_LIVE=TRUE.
  afterEach(liveDelay('JINA_SEARCH_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = JinaSearchSDK.test()
    const ent = testsdk.BatchStatus()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = JinaSearchSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.BatchStatus().create({"batch_id":1,"created_at":"x","model":"x","status":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.JINA_SEARCH_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'batch_status.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"batch_id":{"a":true,"h":"Batch Id","n":"batch_id","r":true,"sh":"Unique identifier for the batch job.","t":"`$STRING`","key$":"batch_id","index$":0},"completed_at":{"a":true,"h":"Completed At","n":"completed_at","r":false,"sh":"ISO 8601 timestamp when job completed (if finished).","t":"`$ANY`","key$":"completed_at","index$":1},"created_at":{"a":true,"h":"Created At","n":"created_at","r":true,"sh":"ISO 8601 timestamp when job was created.","t":"`$STRING`","key$":"created_at","index$":2},"dimensions":{"a":true,"h":"Dimensions","n":"dimensions","r":false,"sh":"Number of dimensions for output embeddings (1-1024).","t":"`$ANY`","key$":"dimensions","index$":3},"error":{"a":true,"h":"Error","n":"error","r":false,"sh":"Error message if job failed.","t":"`$ANY`","key$":"error","index$":4},"error_file_url":{"a":true,"h":"Error File Url","n":"error_file_url","r":false,"sh":"URL to download error JSONL for failed lines.","t":"`$ANY`","key$":"error_file_url","index$":5},"expires_at":{"a":true,"h":"Expires At","n":"expires_at","r":false,"sh":"ISO 8601 timestamp when output URL expires (created_at + 24h).","t":"`$ANY`","key$":"expires_at","index$":6},"input":{"a":true,"h":"Input","n":"input","r":false,"sh":"Inline JSONL lines for small batches.","t":"`$ANY`","key$":"input","index$":7},"input_url":{"a":true,"h":"Input Url","n":"input_url","r":false,"sh":"URL to input JSONL file (GCS, S3, or HTTP).","t":"`$ANY`","key$":"input_url","index$":8},"model":{"a":true,"h":"Model","n":"model","r":true,"sh":"The model used for embedding.","t":"`$STRING`","key$":"model","index$":9},"normalized":{"a":true,"h":"Normalized","n":"normalized","r":false,"sh":"If true (default), embeddings are L2-normalized to unit length.","t":"`$ANY`","key$":"normalized","index$":10},"output_url":{"a":true,"h":"Output Url","n":"output_url","r":false,"sh":"Signed URL to download output JSONL (24h expiry).","t":"`$ANY`","key$":"output_url","index$":11},"stats":{"a":true,"h":"Stats","n":"stats","r":false,"sh":"Processing statistics.","t":"`$ANY`","key$":"stats","index$":12},"status":{"a":true,"h":"Status","n":"status","r":true,"sh":"Current status of the batch job.","t":"`$STRING`","key$":"status","index$":13},"task":{"a":true,"h":"Task","n":"task","r":false,"sh":"Task optimization: retrieval, text-matching, clustering, or classification.","t":"`$ANY`","key$":"task","index$":14},"webhook_url":{"a":true,"h":"Webhook Url","n":"webhook_url","r":false,"sh":"URL to POST notification when job completes.","t":"`$ANY`","key$":"webhook_url","index$":15}},"name":"batch_status","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["dimensions","input","input_url","model","normalized","task","webhook_url"],"co":{"id":"POST /v1/batch/embeddings","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/v1/batch/embeddings","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"batch"},{"lit":"embeddings"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"batch_status","name__orig":"batch_status","Name":"BatchStatus","name_":"batch_status","name-":"batch-status","NAME":"BATCH_STATUS","index$":2}, {"active":true,"entity":"batch_status","key$":"BasicBatchStatusFlow","kind":"basic","name":"BasicBatchStatusFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"batch_status_ref01"},"m":{},"o":"create","s":[],"v":[]}]}, 'BatchStatus', {"POST /v1/batch/embeddings":{"protocol":"http","requestBody":{"content":{"application/json":{"schema":{"properties":{"model":{"type":"string","enum":["jina-embeddings-v5-text-nano","jina-embeddings-v5-text-small"],"title":"Model","description":"The embedding model to use for batch processing.","key$":"model"},"input_url":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Input Url","description":"URL to input JSONL file (GCS, S3, or HTTP). Either input_url or input must be provided.","key$":"input_url"},"input":{"anyOf":[{"items":{"additionalProperties":true,"type":"object"},"type":"array"},{"type":"null"}],"title":"Input","description":"Inline JSONL lines for small batches. Either input_url or input must be provided.","key$":"input"},"task":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Task","description":"Task optimization: retrieval, text-matching, clustering, or classification.","default":"text-matching","key$":"task"},"dimensions":{"anyOf":[{"type":"integer","maximum":1024,"exclusiveMinimum":0},{"type":"null"}],"title":"Dimensions","description":"Number of dimensions for output embeddings (1-1024).","key$":"dimensions"},"normalized":{"anyOf":[{"type":"boolean"},{"type":"null"}],"title":"Normalized","description":"If true (default), embeddings are L2-normalized to unit length.","default":true,"key$":"normalized"},"webhook_url":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Webhook Url","description":"URL to POST notification when job completes.","key$":"webhook_url"}},"type":"object","required":["model"],"title":"BatchEmbeddingRequest","description":"Request to create a batch embedding job.","examples":[{"dimensions":512,"input_url":"gs://my-bucket/inputs.jsonl","model":"jina-embeddings-v5-text-small","task":"retrieval"},{"input":[{"body":{"input":"Hello world"},"custom_id":"req-1"},{"body":{"input":"Batch embeddings"},"custom_id":"req-2"}],"model":"jina-embeddings-v5-text-nano","task":"text-matching"}],"x-ref":"#/components/schemas/BatchEmbeddingRequest","index$":1}}},"required":true},"parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const batch_status_ref01_ent = client.BatchStatus()
    let batch_status_ref01_data = setup.data.new.batch_status['batch_status_ref01']

    batch_status_ref01_data = (await batch_status_ref01_ent.create(batch_status_ref01_data)).data()
    assert(null != batch_status_ref01_data)


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/batch_status/BatchStatusTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = JinaSearchSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['batch_status01','batch_status02','batch_status03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'JINA_SEARCH_TEST_BATCH_STATUS_ENTID': idmap,
    'JINA_SEARCH_TEST_LIVE': 'FALSE',
    'JINA_SEARCH_TEST_EXPLAIN': 'FALSE',
    'JINA_SEARCH_APIKEY': '',
  })

  idmap = env['JINA_SEARCH_TEST_BATCH_STATUS_ENTID']

  const live = 'TRUE' === env.JINA_SEARCH_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['JINA_SEARCH_TEST_BATCH_STATUS_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new JinaSearchSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.JINA_SEARCH_APIKEY,
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.JINA_SEARCH_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
