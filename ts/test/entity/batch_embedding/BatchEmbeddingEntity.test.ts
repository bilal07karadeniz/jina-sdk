

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


describe('BatchEmbeddingEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when JINA_SEARCH_TEST_LIVE=TRUE.
  afterEach(liveDelay('JINA_SEARCH_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = JinaSearchSDK.test()
    const ent = testsdk.BatchEmbedding()
    assert(null != ent)
  })




  test('basic', async (t) => {

    const live = 'TRUE' === process.env.JINA_SEARCH_TEST_LIVE
    for (const op of []) {
      if (!live && maybeSkipControl(t, 'entityOp', 'batch_embedding.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":0}},"id":{"field":"id","name":"id"},"name":"batch_embedding","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /v1/batch/{batch_id}/errors","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"batch_id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/v1/batch/{batch_id}/errors","q":{"$action":"errors","exist":["id"]},"r":{"param":{"batch_id":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"batch"},{"var":"id"},{"lit":"errors"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0},{"a":true,"co":{"id":"GET /v1/batch/{batch_id}/output","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"batch_id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/v1/batch/{batch_id}/output","q":{"$action":"output","exist":["id"]},"r":{"param":{"batch_id":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"batch"},{"var":"id"},{"lit":"output"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":1}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"batch_embedding","name__orig":"batch_embedding","Name":"BatchEmbedding","name_":"batch_embedding","name-":"batch-embedding","NAME":"BATCH_EMBEDDING","index$":1}, {"active":true,"entity":"batch_embedding","key$":"BasicBatchEmbeddingFlow","kind":"basic","name":"BasicBatchEmbeddingFlow","param":{},"step":[{"a":false,"d":{},"i":{"ref":"batch_embedding_ref01","srcdatavar":"batch_embedding_ref01_data","suffix":"_dt0"},"m":{"id":"batch_embedding01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-batch_embedding_ref01"}}],"unreachable":true}]}, 'BatchEmbedding', {"GET /v1/batch/{batch_id}/errors":{"protocol":"http","parameters":[{"name":"batch_id","in":"path","required":true,"schema":{"type":"string","title":"Batch Id"},"index$":0}]},"GET /v1/batch/{batch_id}/output":{"protocol":"http","parameters":[{"name":"batch_id","in":"path","required":true,"schema":{"type":"string","title":"Batch Id"},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let batch_embedding_ref01_data = Object.values(setup.data.existing.batch_embedding)[0] as any

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
      '../../../../.sdk/test/entity/batch_embedding/BatchEmbeddingTestData.json')

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
    ['batch_embedding01','batch_embedding02','batch_embedding03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'JINA_SEARCH_TEST_BATCH_EMBEDDING_ENTID': idmap,
    'JINA_SEARCH_TEST_LIVE': 'FALSE',
    'JINA_SEARCH_TEST_EXPLAIN': 'FALSE',
    'JINA_SEARCH_APIKEY': '',
  })

  idmap = env['JINA_SEARCH_TEST_BATCH_EMBEDDING_ENTID']

  const live = 'TRUE' === env.JINA_SEARCH_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['JINA_SEARCH_TEST_BATCH_EMBEDDING_ENTID']
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
  
