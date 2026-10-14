

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


describe('EmbeddingEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when JINA_SEARCH_TEST_LIVE=TRUE.
  afterEach(liveDelay('JINA_SEARCH_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = JinaSearchSDK.test()
    const ent = testsdk.Embedding()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = JinaSearchSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Embedding().create({"data":"x","model":1,"usage":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.JINA_SEARCH_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'embedding.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"data":{"a":true,"h":"Data","n":"data","r":true,"sh":"List of embeddings, one per input item.","t":"`$ANY`","union":{"branches":3,"count":3,"depth":5},"key$":"data","index$":0},"model":{"a":true,"h":"Model","n":"model","r":true,"sh":"The model used to generate the embeddings.","t":"`$STRING`","key$":"model","index$":1},"object":{"a":true,"h":"Object","n":"object","r":false,"sh":"Object type, always `list`.","t":"`$STRING`","key$":"object","index$":2},"usage":{"a":true,"h":"Usage","n":"usage","r":true,"sh":"Token usage statistics.","t":"`$ANY`","union":{"branches":3,"count":1,"depth":0},"key$":"usage","index$":3}},"name":"embedding","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["dimensions","embedding_type","input","input_type","late_chunking","model","normalized","return_multivector","return_tokenized_input","task","truncate"],"co":{"id":"POST /v1/embeddings","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/v1/embeddings","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"embeddings"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"embedding","name__orig":"embedding","Name":"Embedding","name_":"embedding","name-":"embedding","NAME":"EMBEDDING","index$":3}, {"active":true,"entity":"embedding","key$":"BasicEmbeddingFlow","kind":"basic","name":"BasicEmbeddingFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"embedding_ref01"},"m":{},"o":"create","s":[],"v":[]}]}, 'Embedding', {"POST /v1/embeddings":{"protocol":"http","requestBody":{"content":{"application/json":{"schema":{"oneOf":[{"properties":{"embedding_type":{"anyOf":[{},{},{}],"title":"Embedding Type","description":"Output encoding format: `float`, `base64`, `binary`, `ubinary`, or a list of these."},"normalized":{"anyOf":[{},{}],"title":"Normalized","description":"If true (default), embeddings are L2-normalized to unit length.","default":true},"truncate":{"anyOf":[{},{}],"title":"Truncate","description":"If true, truncates input exceeding the model's max token limit instead of returning an error.","default":false},"model":{"type":"string","enum":["jina-embeddings-v2-base-en","jina-embeddings-v2-base-zh","jina-embeddings-v2-base-de","jina-embeddings-v2-base-es","jina-embeddings-v2-base-code"],"title":"Model","description":"The embedding model to use."},"input":{"anyOf":[{},{},{}],"title":"Input","description":"Text to embed: a string, `TextDoc`, or a list of items."}},"type":"object","required":["model","input"],"title":"EmbeddingsV2Request","description":"Jina Embeddings v2 text embedding models.","example":{"embedding_type":"float","input":["A beautiful sunset over the beach","Jina AI - Your Search Foundation - Supercharged"],"model":"jina-embeddings-v2-base-en","normalized":true,"truncate":false},"x-ref":"#/components/schemas/EmbeddingsV2Request"},{"properties":{"embedding_type":{"anyOf":[{},{},{}],"title":"Embedding Type","description":"Output encoding format: `float`, `base64`, `binary`, `ubinary`, or a list of these."},"normalized":{"anyOf":[{},{}],"title":"Normalized","description":"If true (default), embeddings are L2-normalized to unit length.","default":true},"truncate":{"anyOf":[{},{}],"title":"Truncate","description":"If true, truncates input exceeding the model's max token limit instead of returning an error.","default":false},"model":{"type":"string","const":"jina-embeddings-v3","title":"Model","description":"The embedding model to use."},"input":{"anyOf":[{},{},{}],"title":"Input","description":"Text to embed: a string, `TextDoc`, or a list of items."},"task":{"anyOf":[{},{}],"title":"Task","description":"Task optimization: `retrieval.query` for queries, `retrieval.passage` for documents, `text-matching` for similarity, `classification`, or `separation` for clustering."},"late_chunking":{"anyOf":[{},{}],"title":"Late Chunking","description":"If true, concatenates all inputs and processes as one sequence before splitting. Useful for context across chunks."},"dimensions":{"anyOf":[{},{}],"title":"Dimensions","description":"Number of dimensions for the output embedding. Range: 1-1024."}},"type":"object","required":["model","input"],"title":"EmbeddingsV3Request","description":"Jina Embeddings v3 with task-specific optimization and flexible dimensions.","example":{"dimensions":512,"embedding_type":"float","input":["A beautiful sunset over the beach"],"late_chunking":false,"model":"jina-embeddings-v3","normalized":true,"task":"retrieval.query"},"x-ref":"#/components/schemas/EmbeddingsV3Request"},{"properties":{"embedding_type":{"anyOf":[{},{},{}],"title":"Embedding Type","description":"Output encoding format: `float`, `base64`, `binary`, `ubinary`, or a list of these."},"model":{"type":"string","const":"jina-embeddings-v4","title":"Model","description":"The embedding model to use."},"input":{"anyOf":[{},{},{},{},{}],"title":"Input","description":"Content to embed: a string, `TextDoc`, `ImageDoc`, `PDFDoc`, or a list of items. PDFs must be sent individually. Images up to 8MB; PDFs up to 8MB."},"truncate":{"anyOf":[{},{}],"title":"Truncate","description":"If true, truncates input exceeding the model's max token limit instead of returning an error.","default":false},"late_chunking":{"anyOf":[{},{}],"title":"Late Chunking","description":"If true, concatenates all text inputs and processes as one sequence before splitting. Only works with text."},"dimensions":{"anyOf":[{},{}],"title":"Dimensions","description":"Number of dimensions for the output embedding. Range: 1-2048."},"task":{"anyOf":[{},{}],"title":"Task","description":"Task optimization: `text-matching` (default), `retrieval.query`, `retrieval.passage`, `code.query`, or `code.passage`.","default":"text-matching"},"return_multivector":{"anyOf":[{},{}],"title":"Return Multivector","description":"If true, returns one embedding per token. Cannot be used with `dimensions`.","default":false},"return_tokenized_input":{"anyOf":[{},{}],"title":"Return Tokenized Input","description":"If true, returns tokens alongside multi-vector embeddings. Requires `return_multivector=true`.","default":false}},"type":"object","required":["model","input"],"title":"EmbeddingsV4Request","description":"Jina Embeddings v4 multimodal model for text, images, and PDFs.","examples":[{"dimensions":512,"embedding_type":"float","input":[{},{}],"model":"jina-embeddings-v4"},{"embedding_type":"float","input":["Jina AI - Your Search Foundation - Supercharged"],"late_chunking":true,"model":"jina-embeddings-v4","task":"retrieval.passage"},{"dimensions":512,"embedding_type":"float","input":{"pdf":"https://example.com/sample.pdf"},"model":"jina-embeddings-v4"}],"x-ref":"#/components/schemas/EmbeddingsV4Request"},{"properties":{"embedding_type":{"anyOf":[{},{},{}],"title":"Embedding Type","description":"Output encoding format: `float`, `base64`, `binary`, `ubinary`, or a list of these."},"normalized":{"anyOf":[{},{}],"title":"Normalized","description":"If true (default), embeddings are L2-normalized to unit length.","default":true},"truncate":{"anyOf":[{},{}],"title":"Truncate","description":"If true, truncates input exceeding the model's max token limit instead of returning an error.","default":false},"model":{"type":"string","enum":["jina-embeddings-v5-text-nano","jina-embeddings-v5-text-small","jina-embeddings-v5-omni-small","jina-embeddings-v5-omni-nano"],"title":"Model","description":"The embedding model to use."},"input":{"anyOf":[{},{},{},{},{},{},{}],"title":"Input","description":"Content to embed: a string, `TextDoc`, `ImageDoc`, `VideoDoc`, `AudioDoc`, `PDFDoc`, or a list of these. A list item may also be a `{content: [...]}` group, fused into one embedding. A PDF must be sent on its own, not inside a list."},"task":{"anyOf":[{},{}],"title":"Task","description":"Task optimization: `retrieval.query` for queries, `retrieval.passage` for documents, `text-matching` for similarity, `clustering`, or `classification`.","default":"text-matching"},"dimensions":{"anyOf":[{},{}],"title":"Dimensions","description":"Number of dimensions for the output embedding. Range: 1-1024."}},"type":"object","required":["model","input"],"title":"EmbeddingsV5Request","description":"Jina Embeddings v5, with task-specific adapters and truncatable\ndimensions. Text, images, video, audio and PDFs share one vector space, so\na query in any of them retrieves any other; the `omni` names are the ones\nto reach for when the corpus is not text.\n\nEach list item is one modality, except a `MergedContentGroup`\n(`{\"content\": [...]}`), which fuses several chunks into a single embedding\nin one forward pass.","examples":[{"dimensions":512,"embedding_type":"float","input":["A beautiful sunset over the beach"],"model":"jina-embeddings-v5-text-small","normalized":true,"task":"retrieval.query"},{"embedding_type":"float","input":[{},{}],"model":"jina-embeddings-v5-omni-small","task":"retrieval.passage"}],"x-ref":"#/components/schemas/EmbeddingsV5Request"},{"properties":{"embedding_type":{"anyOf":[{},{},{}],"title":"Embedding Type","description":"Output encoding format: `float`, `base64`, `binary`, `ubinary`, or a list of these."},"model":{"type":"string","const":"jina-code-embeddings-0.5b","title":"Model","description":"The code embedding model to use."},"input":{"anyOf":[{},{},{}],"title":"Input","description":"Code or text to embed: a string, `TextDoc`, or a list of items."},"truncate":{"anyOf":[{},{}],"title":"Truncate","description":"If true, truncates input exceeding the model's max token limit instead of returning an error.","default":false},"dimensions":{"anyOf":[{},{}],"title":"Dimensions","description":"Number of dimensions for the output embedding. Range: 1-896."},"task":{"anyOf":[{},{}],"title":"Task","description":"Task type: `nl2code`, `qa`, `code2code`, `code2nl`, or `code2completion`. Use `.query` for queries, `.passage` for documents.","default":"nl2code.query"}},"type":"object","required":["model","input"],"title":"CodeEmbeddings500MRequest","description":"Code embeddings (0.5b) for search over source, and between source and prose.","examples":[{"dimensions":512,"embedding_type":"float","input":["import * as ElementPlusIconsVue from '@element-plus/icons-vue'\nconst app = createApp(App)\nfor (const [key, component] of Object.entries(ElementPlusIconsVue)) {\n  app.component(key, component)\n}"],"model":"jina-code-embeddings-0.5b","task":"nl2code.passage"}],"x-ref":"#/components/schemas/CodeEmbeddings500MRequest"},{"properties":{"embedding_type":{"anyOf":[{},{},{}],"title":"Embedding Type","description":"Output encoding format: `float`, `base64`, `binary`, `ubinary`, or a list of these."},"model":{"type":"string","const":"jina-code-embeddings-1.5b","title":"Model","description":"The code embedding model to use."},"input":{"anyOf":[{},{},{}],"title":"Input","description":"Code or text to embed: a string, `TextDoc`, or a list of items."},"truncate":{"anyOf":[{},{}],"title":"Truncate","description":"If true, truncates input exceeding the model's max token limit instead of returning an error.","default":false},"dimensions":{"anyOf":[{},{}],"title":"Dimensions","description":"Number of dimensions for the output embedding. Range: 1-1536."},"task":{"anyOf":[{},{}],"title":"Task","description":"Task type: `nl2code`, `qa`, `code2code`, `code2nl`, or `code2completion`. Use `.query` for queries, `.passage` for documents.","default":"nl2code.query"}},"type":"object","required":["model","input"],"title":"CodeEmbeddings1500MRequest","description":"Code embeddings (1.5b) for search over source, and between source and prose.","examples":[{"dimensions":512,"input":["import * as ElementPlusIconsVue from '@element-plus/icons-vue'\nconst app = createApp(App)\nfor (const [key, component] of Object.entries(ElementPlusIconsVue)) {\n  app.component(key, component)\n}"],"model":"jina-code-embeddings-1.5b","task":"nl2code.passage"}],"x-ref":"#/components/schemas/CodeEmbeddings1500MRequest"},{"properties":{"embedding_type":{"anyOf":[{},{},{}],"title":"Embedding Type","description":"Output encoding format: `float`, `base64`, `binary`, `ubinary`, or a list of these."},"normalized":{"anyOf":[{},{}],"title":"Normalized","description":"If true (default), embeddings are L2-normalized to unit length.","default":true},"truncate":{"anyOf":[{},{}],"title":"Truncate","description":"If true, truncates input exceeding the model's max token limit instead of returning an error.","default":false},"model":{"type":"string","const":"jina-clip-v1","title":"Model","description":"The CLIP model to use."},"input":{"anyOf":[{},{},{},{},{}],"title":"Input","description":"Content to embed: a string, `TextDoc`, `ImageDoc`, `PDFDoc`, or a list of items. PDFs must be sent individually. Images up to 8MB."}},"type":"object","required":["model","input"],"title":"ClipV1Request","description":"CLIP v1 multimodal model for images and text in a shared vector space.","example":{"embedding_type":"float","input":[{"image":"https://i.ibb.co/nQNGqL0/beach1.jpg"},"A beautiful sunset over the beach"],"model":"jina-clip-v1","normalized":true},"x-ref":"#/components/schemas/ClipV1Request"},{"properties":{"embedding_type":{"anyOf":[{},{},{}],"title":"Embedding Type","description":"Output encoding format: `float`, `base64`, `binary`, `ubinary`, or a list of these."},"normalized":{"anyOf":[{},{}],"title":"Normalized","description":"If true (default), embeddings are L2-normalized to unit length.","default":true},"truncate":{"anyOf":[{},{}],"title":"Truncate","description":"If true, truncates input exceeding the model's max token limit instead of returning an error.","default":false},"model":{"type":"string","const":"jina-clip-v2","title":"Model","description":"The CLIP model to use."},"input":{"anyOf":[{},{},{},{},{}],"title":"Input","description":"Content to embed: a string, `TextDoc`, `ImageDoc`, `PDFDoc`, or a list of items. PDFs must be sent individually. Images up to 8MB."},"task":{"anyOf":[{},{}],"title":"Task","description":"Set to `retrieval.query` to optimize for search queries. Leave unset for documents."},"dimensions":{"anyOf":[{},{}],"title":"Dimensions","description":"Number of dimensions for the output embedding. Range: 1-1024."}},"type":"object","required":["model","input"],"title":"ClipV2Request","description":"CLIP v2 with Matryoshka representation learning for flexible dimensions.","example":{"dimensions":512,"embedding_type":"float","input":[{"image":"https://i.ibb.co/nQNGqL0/beach1.jpg"},"Jina AI - Your Search Foundation - Supercharged"],"model":"jina-clip-v2","normalized":true,"task":"retrieval.query"},"x-ref":"#/components/schemas/ClipV2Request"},{"properties":{"embedding_type":{"anyOf":[{},{},{}],"title":"Embedding Type","description":"Output encoding format: `float`, `base64`, `binary`, `ubinary`, or a list of these."},"model":{"type":"string","const":"jina-colbert-v1-en","title":"Model","description":"The ColBERT model to use."},"input":{"anyOf":[{},{},{}],"title":"Input","description":"Text to embed: a string, `TextDoc`, or a list of items."},"input_type":{"anyOf":[{},{}],"title":"Input Type","description":"Role of the input: `query` for search queries, `document` for passages.","default":"document"}},"type":"object","required":["model","input"],"title":"ColbertV1Request","description":"ColBERT v1 for token-level late interaction retrieval.","example":{"embedding_type":"float","input":["A beautiful sunset over the beach","Jina AI - Your Search Foundation - Supercharged"],"input_type":"document","model":"jina-colbert-v1-en"},"x-ref":"#/components/schemas/ColbertV1Request"},{"properties":{"embedding_type":{"anyOf":[{},{},{}],"title":"Embedding Type","description":"Output encoding format: `float`, `base64`, `binary`, `ubinary`, or a list of these."},"model":{"type":"string","const":"jina-colbert-v2","title":"Model","description":"The ColBERT model to use."},"input":{"anyOf":[{},{},{}],"title":"Input","description":"Text to embed: a string, `TextDoc`, or a list of items."},"input_type":{"anyOf":[{},{}],"title":"Input Type","description":"Role of the input: `query` for search queries, `document` for passages.","default":"document"},"dimensions":{"anyOf":[{},{}],"title":"Dimensions","description":"Dimensions per token: `64`, `96`, or `128`. Defaults to 128."}},"type":"object","required":["model","input"],"title":"ColbertV2Request","description":"ColBERT v2 with Matryoshka representation learning for flexible dimensions.","example":{"dimensions":128,"embedding_type":"float","input":["A beautiful sunset over the beach"],"input_type":"query","model":"jina-colbert-v2"},"x-ref":"#/components/schemas/ColbertV2Request"}],"title":"Embedding Request","discriminator":{"propertyName":"model","mapping":{"jina-embeddings-v2-base-en":"#/components/schemas/EmbeddingsV2Request","jina-embeddings-v2-base-zh":"#/components/schemas/EmbeddingsV2Request","jina-embeddings-v2-base-de":"#/components/schemas/EmbeddingsV2Request","jina-embeddings-v2-base-es":"#/components/schemas/EmbeddingsV2Request","jina-embeddings-v2-base-code":"#/components/schemas/EmbeddingsV2Request","jina-embeddings-v3":"#/components/schemas/EmbeddingsV3Request","jina-embeddings-v4":"#/components/schemas/EmbeddingsV4Request","jina-embeddings-v5-text-nano":"#/components/schemas/EmbeddingsV5Request","jina-embeddings-v5-text-small":"#/components/schemas/EmbeddingsV5Request","jina-embeddings-v5-omni-small":"#/components/schemas/EmbeddingsV5Request","jina-embeddings-v5-omni-nano":"#/components/schemas/EmbeddingsV5Request","jina-code-embeddings-0.5b":"#/components/schemas/CodeEmbeddings500MRequest","jina-code-embeddings-1.5b":"#/components/schemas/CodeEmbeddings1500MRequest","jina-clip-v1":"#/components/schemas/ClipV1Request","jina-clip-v2":"#/components/schemas/ClipV2Request","jina-colbert-v1-en":"#/components/schemas/ColbertV1Request","jina-colbert-v2":"#/components/schemas/ColbertV2Request"}},"index$":1}}},"required":true},"parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const embedding_ref01_ent = client.Embedding()
    let embedding_ref01_data = setup.data.new.embedding['embedding_ref01']

    embedding_ref01_data = (await embedding_ref01_ent.create(embedding_ref01_data)).data()
    assert(null != embedding_ref01_data)


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
      '../../../../.sdk/test/entity/embedding/EmbeddingTestData.json')

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
    ['embedding01','embedding02','embedding03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'JINA_SEARCH_TEST_EMBEDDING_ENTID': idmap,
    'JINA_SEARCH_TEST_LIVE': 'FALSE',
    'JINA_SEARCH_TEST_EXPLAIN': 'FALSE',
    'JINA_SEARCH_APIKEY': '',
  })

  idmap = env['JINA_SEARCH_TEST_EMBEDDING_ENTID']

  const live = 'TRUE' === env.JINA_SEARCH_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['JINA_SEARCH_TEST_EMBEDDING_ENTID']
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
  
