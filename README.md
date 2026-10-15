# webdatatools.github.io

Source for the landing page at <https://paulet4a-commits.github.io/webdatatools/> — a single static page
listing every published Actor in the [webdatatools](https://apify.com/webdatatools) suite.

`index.html` is generated, not hand-edited. Rebuild it after new Actors go public:

```bash
node build.mjs
```

From an isolated worktree, pass the native manifest explicitly:

```bash
node build.mjs --manifest "../path/to/actors/_ops/suite-manifest.json"
node --test catalog.test.mjs
```

`render.mjs` renders the page. Search and category filters run locally in the browser; no search terms,
tokens or visitor events are sent to a collector. With JavaScript disabled the full catalog remains visible.
Cards show all recurring free-plan charge events, including conditional additions. Actor Start fees and
plan-specific conditions remain on each Actor's Pricing tab; card rates are not an estimate of a run's total.

The build reads `actors/_ops/suite-manifest.json` for the groups and blurbs and the Apify API for each
Actor's live title, icon, price and public flag, so an Actor appears here only once it is actually published.
