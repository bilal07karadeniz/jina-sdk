

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


describe('GenerativeModelEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when JINA_SEARCH_TEST_LIVE=TRUE.
  afterEach(liveDelay('JINA_SEARCH_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = JinaSearchSDK.test()
    const ent = testsdk.GenerativeModel()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = JinaSearchSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.GenerativeModel().create({"messages":"x","model":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.JINA_SEARCH_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'generative_model.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"frequency_penalty":{"a":true,"h":"Frequency Penalty","n":"frequency_penalty","r":false,"t":"`$ANY`","key$":"frequency_penalty","index$":0},"logit_bias":{"a":true,"h":"Logit Bias","n":"logit_bias","r":false,"t":"`$ANY`","key$":"logit_bias","index$":1},"logprobs":{"a":true,"h":"Logprobs","n":"logprobs","r":false,"t":"`$ANY`","key$":"logprobs","index$":2},"max_completion_tokens":{"a":true,"h":"Max Completion Tokens","n":"max_completion_tokens","r":false,"t":"`$ANY`","key$":"max_completion_tokens","index$":3},"messages":{"a":true,"h":"Messages","n":"messages","r":true,"t":"`$ARRAY`","union":{"branches":2,"count":1,"depth":3},"key$":"messages","index$":4},"model":{"a":true,"h":"Model","n":"model","r":true,"sh":"The model to use.","t":"`$STRING`","key$":"model","index$":5},"presence_penalty":{"a":true,"h":"Presence Penalty","n":"presence_penalty","r":false,"t":"`$ANY`","key$":"presence_penalty","index$":6},"response_format":{"a":true,"h":"Response Format","n":"response_format","r":false,"t":"`$ANY`","key$":"response_format","index$":7},"seed":{"a":true,"h":"Seed","n":"seed","r":false,"t":"`$ANY`","key$":"seed","index$":8},"stop":{"a":true,"h":"Stop","n":"stop","r":false,"t":"`$ANY`","union":{"branches":2,"count":1,"depth":0},"key$":"stop","index$":9},"stream":{"a":true,"h":"Stream","n":"stream","r":false,"t":"`$BOOLEAN`","key$":"stream","index$":10},"stream_options":{"a":true,"h":"Stream Options","n":"stream_options","r":false,"t":"`$ANY`","key$":"stream_options","index$":11},"temperature":{"a":true,"h":"Temperature","n":"temperature","r":false,"t":"`$ANY`","key$":"temperature","index$":12},"top_logprobs":{"a":true,"h":"Top Logprobs","n":"top_logprobs","r":false,"t":"`$ANY`","key$":"top_logprobs","index$":13},"top_p":{"a":true,"h":"Top P","n":"top_p","r":false,"t":"`$ANY`","key$":"top_p","index$":14}},"name":"generative_model","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["frequency_penalty","logit_bias","logprobs","max_completion_tokens","messages","model","presence_penalty","response_format","seed","stop","stream","stream_options","temperature","top_logprobs","top_p"],"co":{"id":"POST /v1/chat/completions","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/v1/chat/completions","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"chat"},{"lit":"completions"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"generative_model","name__orig":"generative_model","Name":"GenerativeModel","name_":"generative_model","name-":"generative-model","NAME":"GENERATIVE_MODEL","index$":4}, {"active":true,"entity":"generative_model","key$":"BasicGenerativeModelFlow","kind":"basic","name":"BasicGenerativeModelFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"generative_model_ref01"},"m":{},"o":"create","s":[],"v":[]}]}, 'GenerativeModel', {"POST /v1/chat/completions":{"protocol":"http","requestBody":{"content":{"application/json":{"schema":{"properties":{"messages":{"items":{"properties":{"role":{"type":"string","enum":[],"title":"Role"},"content":{"anyOf":[],"title":"Content"}},"type":"object","required":["role"],"title":"ChatMessage","x-ref":"#/components/schemas/ChatMessage"},"type":"array","minItems":1,"title":"Messages","key$":"messages"},"model":{"type":"string","const":"jina-ocr-v1","title":"Model","description":"The model to use.","key$":"model"},"stream":{"type":"boolean","title":"Stream","default":false,"key$":"stream"},"stream_options":{"anyOf":[{"properties":{"include_usage":{}},"type":"object","title":"StreamOptions","x-ref":"#/components/schemas/StreamOptions"},{"type":"null"}],"key$":"stream_options"},"max_completion_tokens":{"anyOf":[{"type":"integer","minimum":1},{"type":"null"}],"title":"Max Completion Tokens","key$":"max_completion_tokens"},"temperature":{"anyOf":[{"type":"number","maximum":2,"minimum":0},{"type":"null"}],"title":"Temperature","key$":"temperature"},"top_p":{"anyOf":[{"type":"number","maximum":1,"minimum":0},{"type":"null"}],"title":"Top P","key$":"top_p"},"presence_penalty":{"anyOf":[{"type":"number","maximum":2,"minimum":-2},{"type":"null"}],"title":"Presence Penalty","key$":"presence_penalty"},"frequency_penalty":{"anyOf":[{"type":"number","maximum":2,"minimum":-2},{"type":"null"}],"title":"Frequency Penalty","key$":"frequency_penalty"},"stop":{"anyOf":[{"type":"string"},{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Stop","key$":"stop"},"seed":{"anyOf":[{"type":"integer"},{"type":"null"}],"title":"Seed","key$":"seed"},"logprobs":{"anyOf":[{"type":"boolean"},{"type":"null"}],"title":"Logprobs","key$":"logprobs"},"top_logprobs":{"anyOf":[{"type":"integer","maximum":20,"minimum":0},{"type":"null"}],"title":"Top Logprobs","key$":"top_logprobs"},"logit_bias":{"anyOf":[{"additionalProperties":{"type":"number"},"type":"object"},{"type":"null"}],"title":"Logit Bias","key$":"logit_bias"},"response_format":{"anyOf":[{"oneOf":[{},{},{}],"discriminator":{"propertyName":"type","mapping":{}}},{"type":"null"}],"title":"Response Format","key$":"response_format"}},"type":"object","required":["messages","model"],"title":"ChatCompletionRequest","description":"The public request body. Every field here reaches the engine.","x-ref":"#/components/schemas/ChatCompletionRequest","index$":1}}},"required":true},"parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const generative_model_ref01_ent = client.GenerativeModel()
    let generative_model_ref01_data = setup.data.new.generative_model['generative_model_ref01']

    generative_model_ref01_data = (await generative_model_ref01_ent.create(generative_model_ref01_data)).data()
    assert(null != generative_model_ref01_data)


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
      '../../../../.sdk/test/entity/generative_model/GenerativeModelTestData.json')

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
    ['generative_model01','generative_model02','generative_model03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'JINA_SEARCH_TEST_GENERATIVE_MODEL_ENTID': idmap,
    'JINA_SEARCH_TEST_LIVE': 'FALSE',
    'JINA_SEARCH_TEST_EXPLAIN': 'FALSE',
    'JINA_SEARCH_APIKEY': '',
  })

  idmap = env['JINA_SEARCH_TEST_GENERATIVE_MODEL_ENTID']

  const live = 'TRUE' === env.JINA_SEARCH_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['JINA_SEARCH_TEST_GENERATIVE_MODEL_ENTID']
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
  
