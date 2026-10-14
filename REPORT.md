# Voxgig SDK generator: observations (mini task 1)

Author: Bilal Karadeniz. API: [Jina AI Search Foundation API](https://api.jina.ai/openapi.json) (embeddings, rerank, models, batch, chat), spec version `2026.10.13.1624`. Target: TypeScript only, `test` feature only. The spec used is checked in as `jina-search-openapi.json`.

Catalogue check (14 Oct 2026): there is no `voxgig-sdk/jina-sdk` repository. For context, Jina's own JavaScript/Python SDK (`jinaai`, github.com/jina-ai/jinaai-js) was last published in January 2024 and gets about 39 npm downloads a week, so it does not cover the current API. Jina's `jina-cli` is a command-line tool, not a library.

How it was done: I directed Claude Code to run the generator and the checks, and I reviewed the output. Everything below was observed in real runs; I did not hand-edit any generated file. The commands themselves took a few minutes of machine time in total (scaffold about 30 s, generate a few seconds, build and tests under a minute).

## What worked

- A single-file OpenAPI 3.1 spec (no external `$ref`s) went straight through. `npx @voxgig/create-sdkgen jina-search -d ./jina-search.json -o ./jina-search-sdk -t ts -f test`, then `npm run generate` in `.sdk`, gave 7 entities from 11 operations with no bundling step.
- It compiled with `tsc`, and the offline suite ran without a server or credentials: 253 tests, 239 passed, 0 failed, 14 skipped.
- Entity names are readable and follow the API's concepts: `Embedding`, `Rerank`, `Model`, `Batch`, `GenerativeModel`.
- Live checks against api.jina.ai through the generated client:
  - `Model().list({})` returned 30 models **without any key**.
  - With a free key: `Embedding().create({ model: 'jina-embeddings-v3', input: [...] })` returned 1024-dimension vectors; `Rerank().create(...)` ranked "Ankara is the capital of Turkey." first for the query "capital of Turkey".
  - Without a key, `Embedding().create(...)` fails with a clear `401: Unauthorized` instead of a silent empty result.
- The `apikey` option (and `JINA_SEARCH_APIKEY` in the README) is the only auth setup needed for the bearer-token scheme.

## Problems I hit (most important first)

1. **A poorly specified API gives an SDK that is hard to use.** I also ran the generator on Jina's second spec, the Reader API (`https://r.jina.ai/openapi.json`, 6 operations). It produced entities named `Entity1`, `Misc` and `ReaderEnvelopeWrappedFormattedPageDto`, 4 of its 229 generated tests fail ("Accept asks for a type no success response declares: h1"), and `ReaderEnvelopeWrappedFormattedPageDto().load({ url })` throws `URL path has no value for {id}` because the entity API assumes an `{id}` path parameter while the endpoint takes `{url}`. The same endpoint works through `direct()`. Entity names come from response-schema names, so one oddly named response wrapper ruins the surface.
2. **Entity naming and grouping still drifts in the better spec.** `POST /v1/batch/embeddings` (create a batch job) is exposed as `BatchStatus().create`. Two different operations, `GET /v1/batch/{batch_id}/output` and `GET /v1/batch/{batch_id}/errors`, both end up as `BatchEmbedding().load`, so I could not tell from the API which one `load()` calls (I did not test this, because it needs a paid batch job).
3. **One warning, and one flow step silently switched off.** apidef reported `flow-step-unreachable: BasicBatchEmbeddingFlow#0 (load) switched off`. The generated test flow for batch embeddings is not run, and the 14 skipped tests are not explained in the summary.
4. **Licence and ownership boilerplate.** `LICENSE` says "Copyright (c) 2026 Voxgig", and `package.json` points `repository`/`homepage` at `github.com/voxgig-sdk/jina-search-sdk` and names Voxgig as author. For a contributor-owned repo these need manual edits, which seems at odds with "you retain copyright". I left them untouched so the repo shows exactly what the generator produced. Please tell me if you want it changed.

## Developer-experience notes

- Good: flag-based non-interactive mode, fast generation, the offline test suite for free, and `AGENTS.md`/`CLAUDE.md` in the repo for AI-assisted work.
- Docs gap: the input must be a local file (no URL), and the docs do not state a Node version (I used v22).
- Missing: a way to preview, before generating, how operations will be grouped into entities and named; the apidef log line only shows counts.
- Suggestion: when two operations map to the same entity op (selector), say so in the summary instead of only in the log.

## Reproduce

```bash
curl -o jina-search.json https://api.jina.ai/openapi.json
npx @voxgig/create-sdkgen jina-search -d ./jina-search.json -o ./jina-search-sdk -t ts -f test
cd jina-search-sdk/.sdk && npm run generate && cd ../ts && npm install && npm run build && npm test
JINA_SEARCH_APIKEY=<free key from jina.ai> node -e "const {JinaSearchSDK}=require('./dist/JinaSearchSDK.js'); new JinaSearchSDK({apikey:process.env.JINA_SEARCH_APIKEY}).Rerank().create({model:'jina-reranker-v2-base-multilingual',query:'capital of Turkey',documents:['Ankara is the capital of Turkey.','Bananas are yellow.']}).then(console.log)"
```
