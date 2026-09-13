// Builds a single static page listing every published Actor, from the suite manifest + live Store data.
// No dependencies, no build step: writes index.html ready for GitHub Pages.
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..', 'actors');
const TOKEN = fs.readFileSync(path.join(root, '.secrets', 'apify-token.txt'), 'utf8').trim();
const manifest = JSON.parse(fs.readFileSync(path.join(root, '_ops', 'suite-manifest.json'), 'utf8'));

const api = async (p) => (await fetch(`https://api.apify.com/v2/${p}${p.includes('?') ? '&' : '?'}token=${TOKEN}`)).json();
const acts = (await api('acts?my=1&limit=100')).data?.items ?? [];
const detail = new Map();
for (const a of acts) {
    if (a.name === 'feasibility-probe') continue;
    const d = (await api(`acts/${a.id}`)).data ?? {};
    detail.set(a.name, d);
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const price = (d) => {
    const p = (d.pricingInfos ?? []).at(-1);
    const ev = p?.pricingPerEvent?.actorChargeEvents ?? {};
    const primary = Object.values(ev).find((e) => e.isPrimaryEvent) ?? Object.values(ev).find((e) => e.eventTieredPricingUsd);
    const usd = primary?.eventTieredPricingUsd?.FREE?.tieredEventPriceUsd ?? primary?.eventPriceUsd;
    if (!usd) return '';
    const per1000 = (usd * 1000).toFixed(usd * 1000 < 1 ? 2 : 2).replace(/\.00$/, '');
    return `$${per1000} / 1,000 ${primary?.eventTitle ?? 'results'}`;
};

let cards = '';
let published = 0;
for (const group of manifest.groups) {
    const live = group.actors.filter((a) => detail.get(a.slug)?.isPublic);
    if (!live.length) continue;
    cards += `<section><h2>${esc(group.name)}</h2><div class="grid">`;
    for (const a of live) {
        const d = detail.get(a.slug);
        published += 1;
        const icon = d.pictureUrl ? `<img src="${esc(d.pictureUrl)}" alt="" width="44" height="44">` : '<div class="ph"></div>';
        cards += `<a class="card" href="https://apify.com/webdatatools/${a.slug}">
      ${icon}
      <div><strong>${esc(d.title ?? a.title)}</strong><p>${esc(a.blurb)}</p><span class="price">${esc(price(d))}</span></div>
    </a>`;
    }
    cards += '</div></section>';
}

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>webdatatools — web data tools for AI agents</title>
<meta name="description" content="${published} pay-per-result web data tools on Apify: search and page reading for LLMs, contact and company data, domain and e-mail security, app store and developer data. Callable from any AI agent over MCP.">
<link rel="canonical" href="https://paulet4a-commits.github.io/webdatatools/">
<style>
:root{--bg:#fff;--fg:#0f172a;--mut:#64748b;--line:#e2e8f0;--accent:#2563eb}
@media(prefers-color-scheme:dark){:root{--bg:#0b1120;--fg:#e2e8f0;--mut:#94a3b8;--line:#1e293b;--accent:#60a5fa}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:960px;margin:0 auto;padding:48px 20px 80px}
h1{font-size:2rem;margin:0 0 .4rem}h2{font-size:1.1rem;margin:2.5rem 0 1rem;color:var(--mut);font-weight:600;letter-spacing:.02em}
.lede{color:var(--mut);max-width:60ch;margin:0 0 1.5rem}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.card{display:flex;gap:12px;padding:14px;border:1px solid var(--line);border-radius:12px;text-decoration:none;color:inherit;transition:border-color .15s}
.card:hover{border-color:var(--accent)}
.card img,.ph{border-radius:9px;flex:0 0 44px;height:44px;background:var(--line)}
.card p{margin:.2rem 0 .35rem;color:var(--mut);font-size:.9rem}
.price{font-size:.8rem;color:var(--accent)}
pre{background:var(--line);padding:14px;border-radius:10px;overflow-x:auto;font-size:.85rem}
footer{margin-top:3rem;color:var(--mut);font-size:.9rem;border-top:1px solid var(--line);padding-top:1.2rem}
a{color:var(--accent)}
</style></head><body><div class="wrap">
<h1>webdatatools</h1>
<p class="lede">${published} small, dependable web-data tools on the Apify Store. Each one takes a list and returns
one clean row per item — pay per result, no browser, no proxy juggling. They are built to be called by AI agents
as much as by people.</p>
<p class="lede"><a href="https://apify.com/webdatatools">Apify Store profile</a> ·
<a href="https://github.com/paulet4a-commits/webdatatools-mcp-server">MCP server on GitHub</a></p>

<h2>Use them from an AI agent</h2>
<p class="lede">Add this to your Claude Desktop, Cursor or Cline config and ten of the tools appear in the agent's
tool list. Calls run on your own Apify token, so usage is billed to you at the prices below.</p>
<pre>{
  "mcpServers": {
    "webdatatools": {
      "command": "npx",
      "args": ["-y", "github:paulet4a-commits/webdatatools-mcp-server"],
      "env": { "APIFY_TOKEN": "your-apify-token" }
    }
  }
}</pre>
${cards}
<footer>Built by <a href="https://apify.com/webdatatools">Murat Uzun</a>. Prices shown are the free-plan tier;
paid Apify plans get volume discounts automatically.</footer>
</div></body></html>`;

fs.writeFileSync(path.join(import.meta.dirname, 'index.html'), html);
console.log(`wrote index.html with ${published} published actors`);
