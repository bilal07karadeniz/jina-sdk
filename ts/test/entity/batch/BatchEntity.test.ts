

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


describe('BatchEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when JINA_SEARCH_TEST_LIVE=TRUE.
  afterEach(liveDelay('JINA_SEARCH_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = JinaSearchSDK.test()
    const ent = testsdk.Batch()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('batch hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of JinaSearchSDK.test(offline).Batch().stream('list')) { }
    }, /offline/)

    for await (const _item of JinaSearchSDK.test(offline).Batch()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = JinaSearchSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Batch().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of JinaSearchSDK.test().Batch().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new JinaSearchSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Batch().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Batch().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = JinaSearchSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Batch().list({"limit":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.JINA_SEARCH_TEST_LIVE
    for (const op of ['list', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'batch.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"batch_id":{"a":true,"h":"Batch Id","n":"batch_id","r":true,"sh":"Unique identifier for the batch job.","t":"`$STRING`","key$":"batch_id","index$":0},"completed_at":{"a":true,"h":"Completed At","n":"completed_at","r":false,"sh":"ISO 8601 timestamp when job completed (if finished).","t":"`$ANY`","key$":"completed_at","index$":1},"created_at":{"a":true,"h":"Created At","n":"created_at","r":true,"sh":"ISO 8601 timestamp when job was created.","t":"`$STRING`","key$":"created_at","index$":2},"error":{"a":true,"h":"Error","n":"error","r":false,"sh":"Error message if job failed.","t":"`$ANY`","key$":"error","index$":3},"error_file_url":{"a":true,"h":"Error File Url","n":"error_file_url","r":false,"sh":"URL to download error JSONL for failed lines.","t":"`$ANY`","key$":"error_file_url","index$":4},"expires_at":{"a":true,"h":"Expires At","n":"expires_at","r":false,"sh":"ISO 8601 timestamp when output URL expires (created_at + 24h).","t":"`$ANY`","key$":"expires_at","index$":5},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":6},"model":{"a":true,"h":"Model","n":"model","r":true,"sh":"The model used for embedding.","t":"`$STRING`","key$":"model","index$":7},"output_url":{"a":true,"h":"Output Url","n":"output_url","r":false,"sh":"Signed URL to download output JSONL (24h expiry).","t":"`$ANY`","key$":"output_url","index$":8},"stats":{"a":true,"h":"Stats","n":"stats","r":false,"sh":"Processing statistics.","t":"`$ANY`","key$":"stats","index$":9},"status":{"a":true,"h":"Status","n":"status","r":true,"sh":"Current status of the batch job.","t":"`$STRING`","key$":"status","index$":10}},"id":{"field":"id","name":"id"},"name":"batch","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /v1/batches","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":20,"k":"query","n":"limit","or":"limit","r":false,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"GET","o":"/v1/batches","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"batches"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /v1/batch/{batch_id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"batch_id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/v1/batch/{batch_id}","q":{"exist":["id"]},"r":{"param":{"batch_id":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"batch"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"},"remove":{"input":"data","name":"remove","points":[{"a":true,"co":{"id":"DELETE /v1/batch/{batch_id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"batch_id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"DELETE","o":"/v1/batch/{batch_id}","q":{"exist":["id"]},"r":{"param":{"batch_id":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"batch"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"remove"}},"relations":{"ancestors":[]},"key$":"batch","name__orig":"batch","Name":"Batch","name_":"batch","name-":"batch","NAME":"BATCH","index$":0}, {"active":true,"entity":"batch","key$":"BasicBatchFlow","kind":"basic","name":"BasicBatchFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"batch_ref01"}}]},{"a":true,"d":{},"i":{"ref":"batch_ref01","srcdatavar":"batch_ref01_data","suffix":"_dt0"},"m":{"id":"batch01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-batch_ref01"}}]}]}, 'Batch', {"GET /v1/batches":{"protocol":"http","parameters":[{"name":"limit","in":"query","required":false,"schema":{"type":"integer","default":20,"title":"Limit"},"index$":0}]},"GET /v1/batch/{batch_id}":{"protocol":"http","parameters":[{"name":"batch_id","in":"path","required":true,"schema":{"type":"string","title":"Batch Id"},"index$":0}]},"DELETE /v1/batch/{batch_id}":{"protocol":"http","parameters":[{"name":"batch_id","in":"path","required":true,"schema":{"type":"string","title":"Batch Id"},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let batch_ref01_data = Object.values(setup.data.existing.batch)[0] as any

    // LIST
    const batch_ref01_ent = client.Batch()
    const batch_ref01_match: any = {}

    const batch_ref01_list = (await batch_ref01_ent.list(batch_ref01_match)).map((e: any) => e.data())


    // LOAD
    const batch_ref01_match_dt0: any = {}
    batch_ref01_match_dt0.id = batch_ref01_data.id
    const batch_ref01_data_dt0 = (await batch_ref01_ent.load(batch_ref01_match_dt0)).data()
    assert(batch_ref01_data_dt0.id === batch_ref01_data.id)


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
      '../../../../.sdk/test/entity/batch/BatchTestData.json')

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
    ['batch01','batch02','batch03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'JINA_SEARCH_TEST_BATCH_ENTID': idmap,
    'JINA_SEARCH_TEST_LIVE': 'FALSE',
    'JINA_SEARCH_TEST_EXPLAIN': 'FALSE',
    'JINA_SEARCH_APIKEY': '',
  })

  idmap = env['JINA_SEARCH_TEST_BATCH_ENTID']

  const live = 'TRUE' === env.JINA_SEARCH_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['JINA_SEARCH_TEST_BATCH_ENTID']
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
  
