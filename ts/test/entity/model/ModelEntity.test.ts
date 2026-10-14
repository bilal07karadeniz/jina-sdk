

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


describe('ModelEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when JINA_SEARCH_TEST_LIVE=TRUE.
  afterEach(liveDelay('JINA_SEARCH_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = JinaSearchSDK.test()
    const ent = testsdk.Model()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('model hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of JinaSearchSDK.test(offline).Model().stream('list')) { }
    }, /offline/)

    for await (const _item of JinaSearchSDK.test(offline).Model()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = JinaSearchSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Model().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of JinaSearchSDK.test().Model().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new JinaSearchSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Model().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Model().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = JinaSearchSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Model().list({"context_length":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.JINA_SEARCH_TEST_LIVE
    for (const op of ['list', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'model.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"context_length":{"a":true,"h":"Context Length","n":"context_length","r":true,"sh":"Maximum context length in tokens.","t":"`$INTEGER`","key$":"context_length","index$":0},"created":{"a":true,"h":"Created","n":"created","r":true,"sh":"Unix timestamp when the model was released.","t":"`$INTEGER`","key$":"created","index$":1},"datacenters":{"a":true,"h":"Datacenters","n":"datacenters","r":true,"sh":"Available datacenter locations.","t":"`$ARRAY`","key$":"datacenters","index$":2},"description":{"a":true,"h":"Description","n":"description","r":true,"sh":"Model description.","t":"`$STRING`","key$":"description","index$":3},"hugging_face_id":{"a":true,"h":"Hugging Face Id","n":"hugging_face_id","r":true,"sh":"HuggingFace model ID.","t":"`$STRING`","key$":"hugging_face_id","index$":4},"id":{"a":true,"h":"Id","n":"id","r":true,"sh":"Unique model identifier (e.g., `jina-ai/jina-embeddings-v3`).","t":"`$STRING`","key$":"id","index$":5},"input_modalities":{"a":true,"h":"Input Modalities","n":"input_modalities","r":true,"sh":"Supported input modalities: `text`, `image`, `video`, `audio`.","t":"`$ARRAY`","key$":"input_modalities","index$":6},"max_output_length":{"a":true,"h":"Max Output Length","n":"max_output_length","r":true,"sh":"Largest output the model produces: embedding dimensions for an embedding model, tokens for a generative one.","t":"`$INTEGER`","key$":"max_output_length","index$":7},"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"Human-readable model name.","t":"`$STRING`","key$":"name","index$":8},"output_modalities":{"a":true,"h":"Output Modalities","n":"output_modalities","r":true,"sh":"Output types: `embeddings`, `text`.","t":"`$ARRAY`","key$":"output_modalities","index$":9},"pricing":{"a":true,"h":"Pricing","n":"pricing","r":true,"sh":"Pricing information.","t":"`$OBJECT`","key$":"pricing","index$":10},"quantization":{"a":true,"h":"Quantization","n":"quantization","r":true,"sh":"Quantization level, if any.","t":"`$STRING`","key$":"quantization","index$":11},"supported_features":{"a":true,"h":"Supported Features","n":"supported_features","r":true,"sh":"Supported features.","t":"`$ARRAY`","key$":"supported_features","index$":12},"supported_sampling_parameters":{"a":true,"h":"Supported Sampling Parameters","n":"supported_sampling_parameters","r":true,"sh":"Supported sampling parameters.","t":"`$ARRAY`","key$":"supported_sampling_parameters","index$":13}},"id":{"field":"id","name":"id"},"name":"model","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /v1/models","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/v1/models","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"models"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /v1/models/{model_id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"model_id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/v1/models/{model_id}","q":{"exist":["id"]},"r":{"param":{"model_id":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"models"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"model","name__orig":"model","Name":"Model","name_":"model","name-":"model","NAME":"MODEL","index$":5}, {"active":true,"entity":"model","key$":"BasicModelFlow","kind":"basic","name":"BasicModelFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"model_ref01"}}]},{"a":true,"d":{},"i":{"ref":"model_ref01","srcdatavar":"model_ref01_data","suffix":"_dt0"},"m":{"id":"model01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-model_ref01"}}]}]}, 'Model', {"GET /v1/models":{"protocol":"http","parameters":[]},"GET /v1/models/{model_id}":{"protocol":"http","parameters":[{"name":"model_id","in":"path","required":true,"schema":{"type":"string","title":"Model Id"},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let model_ref01_data = Object.values(setup.data.existing.model)[0] as any

    // LIST
    const model_ref01_ent = client.Model()
    const model_ref01_match: any = {}

    const model_ref01_list = (await model_ref01_ent.list(model_ref01_match)).map((e: any) => e.data())


    // LOAD
    const model_ref01_match_dt0: any = {}
    model_ref01_match_dt0.id = model_ref01_data.id
    const model_ref01_data_dt0 = (await model_ref01_ent.load(model_ref01_match_dt0)).data()
    assert(model_ref01_data_dt0.id === model_ref01_data.id)


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
      '../../../../.sdk/test/entity/model/ModelTestData.json')

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
    ['model01','model02','model03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'JINA_SEARCH_TEST_MODEL_ENTID': idmap,
    'JINA_SEARCH_TEST_LIVE': 'FALSE',
    'JINA_SEARCH_TEST_EXPLAIN': 'FALSE',
    'JINA_SEARCH_APIKEY': '',
  })

  idmap = env['JINA_SEARCH_TEST_MODEL_ENTID']

  const live = 'TRUE' === env.JINA_SEARCH_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['JINA_SEARCH_TEST_MODEL_ENTID']
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
  
