

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


describe('RerankEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when JINA_SEARCH_TEST_LIVE=TRUE.
  afterEach(liveDelay('JINA_SEARCH_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = JinaSearchSDK.test()
    const ent = testsdk.Rerank()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = JinaSearchSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Rerank().create({"model":1,"results":"x","usage":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.JINA_SEARCH_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'rerank.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"model":{"a":true,"h":"Model","n":"model","r":true,"sh":"The model used for reranking.","t":"`$STRING`","key$":"model","index$":0},"object":{"a":true,"h":"Object","n":"object","r":false,"sh":"Object type, always `list`.","t":"`$STRING`","key$":"object","index$":1},"results":{"a":true,"h":"Results","n":"results","r":true,"sh":"Ranked documents, sorted by relevance score descending.","t":"`$ARRAY`","union":{"branches":3,"count":1,"depth":3},"key$":"results","index$":2},"usage":{"a":true,"h":"Usage","n":"usage","r":true,"sh":"Token usage statistics.","t":"`$OBJECT`","key$":"usage","index$":3}},"name":"rerank","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["documents","max_doc_length","model","query","return_documents","return_embeddings","top_n"],"co":{"id":"POST /v1/rerank","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/v1/rerank","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"rerank"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"rerank","name__orig":"rerank","Name":"Rerank","name_":"rerank","name-":"rerank","NAME":"RERANK","index$":6}, {"active":true,"entity":"rerank","key$":"BasicRerankFlow","kind":"basic","name":"BasicRerankFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"rerank_ref01"},"m":{},"o":"create","s":[],"v":[]}]}, 'Rerank', {"POST /v1/rerank":{"protocol":"http","requestBody":{"content":{"application/json":{"schema":{"oneOf":[{"properties":{"query":{"type":"string","title":"Query","description":"The search query to rank documents against."},"top_n":{"anyOf":[{},{}],"title":"Top N","description":"Number of top results to return. If not set, returns all documents."},"return_documents":{"anyOf":[{},{}],"title":"Return Documents","description":"If true (default), includes document content in each result.","default":true},"model":{"type":"string","enum":["jina-reranker-v2-base-multilingual","jina-reranker-v1-tiny-en","jina-reranker-v1-turbo-en","jina-reranker-v1-base-en","jina-colbert-v1-en","jina-colbert-v2"],"title":"Model","description":"The reranking model to use."},"documents":{"items":{"anyOf":[]},"type":"array","minItems":1,"title":"Documents","description":"Documents to rank: strings or `TextDoc` objects."}},"type":"object","required":["query","model","documents"],"title":"TextRerankerRequest","description":"Pointwise text reranker: scores each document against the query.","example":{"documents":["Climate Change and Renewable Energy: A Global Perspective. Rising temperatures and extreme weather events are accelerating the transition to solar and wind power worldwide.","Le changement climatique et l'énergie renouvelable : une perspective européenne. L'Union européenne investit massivement dans les technologies vertes pour atteindre la neutralité carbone d'ici 2050.","Klimawandel und erneuerbare Energien: Deutsche Energiewende. Deutschland führt die Transformation des Energiesektors durch innovative Technologien und politische Maßnahmen an.","气候变化对可再生能源的影响：中国的绿色发展战略。中国正在大力推进太阳能和风能项目，以实现碳中和目标。","Artificial Intelligence in Healthcare: Revolutionizing Medical Diagnosis. AI-powered systems are improving accuracy in disease detection and treatment recommendations.","Blockchain Technology: Transforming Financial Services. Decentralized finance applications are reshaping traditional banking and payment systems."],"model":"jina-reranker-v2-base-multilingual","query":"Climate change impact on renewable energy adoption","return_documents":false,"top_n":4},"x-ref":"#/components/schemas/TextRerankerRequest"},{"properties":{"query":{"anyOf":[{},{}],"title":"Query","description":"The query to rank documents against: a text string, or an image object (`{\"image\": <url|base64>}`) for a visual query."},"top_n":{"anyOf":[{},{}],"title":"Top N","description":"Number of top results to return. If not set, returns all documents."},"return_documents":{"anyOf":[{},{}],"title":"Return Documents","description":"If true (default), includes document content in each result.","default":true},"model":{"type":"string","const":"jina-reranker-m0","title":"Model","description":"The multimodal reranking model to use."},"documents":{"items":{"anyOf":[]},"type":"array","minItems":1,"title":"Documents","description":"Documents to rank: strings, `TextDoc`, or `ImageDoc` objects."}},"type":"object","required":["query","model","documents"],"title":"RerankerM0Request","description":"Multimodal reranker: the query and the documents may each be text or an image.","example":{"documents":[{"image":"https://raw.githubusercontent.com/jina-ai/multimodal-reranker-test/main/paper-11.png"},{"text":"Attention Is All You Need: This groundbreaking paper introduced the Transformer architecture, revolutionizing natural language processing and becoming the foundation for modern large language models like GPT and BERT."},"Recent advances in computer vision have led to the development of vision transformers (ViTs) that achieve state-of-the-art performance on image classification tasks by treating images as sequences of patches.",{"image":"https://raw.githubusercontent.com/jina-ai/multimodal-reranker-test/main/wired-preview.png"},{"text":"Graph Neural Networks: A Review of Methods and Applications. This comprehensive survey covers the latest developments in graph-based machine learning, including graph convolutional networks and graph attention mechanisms."},"Traditional database systems struggle with the volume and variety of modern data workloads, leading to the adoption of distributed computing frameworks like Apache Spark and Hadoop for big data processing."],"model":"jina-reranker-m0","query":"innovative artificial intelligence research papers and visual data analysis","return_documents":false,"top_n":4},"x-ref":"#/components/schemas/RerankerM0Request"},{"properties":{"query":{"type":"string","title":"Query","description":"The search query to rank documents against."},"top_n":{"anyOf":[{},{}],"title":"Top N","description":"Number of top results to return. If not set, returns all documents."},"return_documents":{"anyOf":[{},{}],"title":"Return Documents","description":"If true (default), includes document content in each result.","default":true},"model":{"type":"string","enum":["jina-reranker-v3","jina-reranker-v3.5"],"title":"Model","description":"The reranking model to use."},"documents":{"items":{"anyOf":[]},"type":"array","minItems":1,"title":"Documents","description":"Documents to rank: strings or `TextDoc` objects."},"max_doc_length":{"anyOf":[{},{}],"title":"Max Doc Length","description":"Maximum tokens per document (1-8192). Omit to use the model's default (2048 for jina-reranker-v3, 8192 for jina-reranker-v3.5)."},"return_embeddings":{"anyOf":[{},{}],"title":"Return Embeddings","description":"If true, returns the document embedding alongside the relevance score."}},"type":"object","required":["query","model","documents"],"title":"RerankerV3Request","description":"Listwise multilingual reranker: scores the candidate set as a whole\nrather than one document at a time.","example":{"documents":["Climate Change and Renewable Energy: A Global Perspective. Rising temperatures and extreme weather events are accelerating the transition to solar and wind power worldwide.","Le changement climatique et l'énergie renouvelable : une perspective européenne. L'Union européenne investit massivement dans les technologies vertes pour atteindre la neutralité carbone d'ici 2050.","Klimawandel und erneuerbare Energien: Deutsche Energiewende. Deutschland führt die Transformation des Energiesektors durch innovative Technologien und politische Maßnahmen an.","气候变化对可再生能源的影响：中国的绿色发展战略。中国正在大力推进太阳能和风能项目，以实现碳中和目标。","Artificial Intelligence in Healthcare: Revolutionizing Medical Diagnosis. AI-powered systems are improving accuracy in disease detection and treatment recommendations.","Blockchain Technology: Transforming Financial Services. Decentralized finance applications are reshaping traditional banking and payment systems."],"model":"jina-reranker-v3","query":"Climate change impact on renewable energy adoption","return_documents":false,"return_embeddings":false,"top_n":4},"x-ref":"#/components/schemas/RerankerV3Request"}],"title":"Reranking Request","discriminator":{"propertyName":"model","mapping":{"jina-reranker-v2-base-multilingual":"#/components/schemas/TextRerankerRequest","jina-reranker-v1-tiny-en":"#/components/schemas/TextRerankerRequest","jina-reranker-v1-turbo-en":"#/components/schemas/TextRerankerRequest","jina-reranker-v1-base-en":"#/components/schemas/TextRerankerRequest","jina-colbert-v1-en":"#/components/schemas/TextRerankerRequest","jina-colbert-v2":"#/components/schemas/TextRerankerRequest","jina-reranker-m0":"#/components/schemas/RerankerM0Request","jina-reranker-v3":"#/components/schemas/RerankerV3Request","jina-reranker-v3.5":"#/components/schemas/RerankerV3Request"}},"index$":1}}},"required":true},"parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const rerank_ref01_ent = client.Rerank()
    let rerank_ref01_data = setup.data.new.rerank['rerank_ref01']

    rerank_ref01_data = (await rerank_ref01_ent.create(rerank_ref01_data)).data()
    assert(null != rerank_ref01_data)


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
      '../../../../.sdk/test/entity/rerank/RerankTestData.json')

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
    ['rerank01','rerank02','rerank03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'JINA_SEARCH_TEST_RERANK_ENTID': idmap,
    'JINA_SEARCH_TEST_LIVE': 'FALSE',
    'JINA_SEARCH_TEST_EXPLAIN': 'FALSE',
    'JINA_SEARCH_APIKEY': '',
  })

  idmap = env['JINA_SEARCH_TEST_RERANK_ENTID']

  const live = 'TRUE' === env.JINA_SEARCH_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['JINA_SEARCH_TEST_RERANK_ENTID']
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
  
