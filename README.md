# webdatatools.github.io

Source for the landing page at <https://paulet4a-commits.github.io/webdatatools/> — a single static page
listing every published Actor in the [webdatatools](https://apify.com/webdatatools) suite.

`index.html` is generated, not hand-edited. Rebuild it after new Actors go public:

```bash
node build.mjs
```

The build reads `actors/_ops/suite-manifest.json` for the groups and blurbs and the Apify API for each
Actor's live title, icon, price and public flag, so an Actor appears here only once it is actually published.
