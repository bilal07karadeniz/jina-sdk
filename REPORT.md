# Voxgig SDK generator: observations (mini task 1)

Author: Bilal Karadeniz. API: [Jina AI Search Foundation API](https://api.jina.ai/openapi.json) (embeddings, rerank, models, batch). TypeScript target, `test` feature. The spec used is `jina-search-openapi.json`. It was not in your catalogue on 14 Oct 2026. I used AI to run the generator and the checks and did not edit any generated file. Machine time was a few minutes.

## What worked

- The single-file spec went through with no preparation: 7 entities from 11 operations, compiles, offline suite 253 tests (239 pass, 0 fail, 14 skipped).
- Live, through the generated client: `Model().list()` works without a key; with a free key `Embedding().create()` returned 1024-dim vectors and `Rerank().create()` ranked the right document first. A missing key gives a clear `401`.

## Problems

1. **Entity naming drifts.** `POST /v1/batch/embeddings` (create a job) is exposed as `BatchStatus().create`, and two different GETs (`.../output`, `.../errors`) both become `BatchEmbedding().load`.
2. **A weak spec gives a poor SDK.** On Jina's Reader spec the same run produced `Entity1` and `ReaderEnvelopeWrappedFormattedPageDto`, 4 failing generated tests, and a `load()` that throws because it expects an `{id}` path parameter where the endpoint takes `{url}`.
3. **Silent gaps.** apidef printed `flow-step-unreachable ... switched off` for the batch flow, and nothing explains the 14 skipped tests. (In my first attempt, a multi-file OpenAPI spec produced 0 entities with "success" and no warning.)
4. **Boilerplate.** `LICENSE` and `package.json` hard-code Voxgig (copyright, repository, homepage). I left them as generated.

## Developer experience

Good: non-interactive flags, fast generation, free offline tests, `AGENTS.md`/`CLAUDE.md`. Missing: a preview of entity names before generating, and a warning when generation yields 0 methods or when operations share a selector.

## Reproduce

```bash
curl -o jina-search.json https://api.jina.ai/openapi.json
npx @voxgig/create-sdkgen jina-search -d ./jina-search.json -o ./jina-search-sdk -t ts -f test
cd jina-search-sdk/.sdk && npm run generate && cd ../ts && npm install && npm run build && npm test
```
