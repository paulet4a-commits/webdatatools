import { priceLabel } from './catalog.mjs';

const esc = value => String(value ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function renderCatalog(groups, total, checkedAt = new Date()) {
    const entries = groups.flatMap(g => g.actors);
    if (entries.length !== total || new Set(entries.map(a => a.slug)).size !== total) throw new Error('Rendered catalog does not match the public Store');
    const cards = groups.map((group, index) => `<section class="catalog-group" data-group="${index}"><h2>${esc(group.name)}</h2><div class="grid">${group.actors.map(a => {
        const d = a.actor;
        const icon = d.pictureUrl ? `<img src="${esc(d.pictureUrl)}" alt="" width="44" height="44" loading="lazy" decoding="async">` : '<div class="ph"></div>';
        return `<a class="card" href="https://apify.com/webdatatools/${a.slug}">${icon}<div><strong>${esc(d.title ?? a.title)}</strong><p>${esc(a.blurb)}</p><span class="price">${esc(priceLabel(d) || 'See pricing on Apify')}</span></div></a>`;
    }).join('')}</div></section>`).join('');
    return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Web data tools for scraping, YouTube &amp; RAG | webdatatools</title>
<meta name="description" content="Find ${total} Apify tools for CSS extraction, YouTube, Markdown, search and company data. Browse by task, compare event rates, and use the API or MCP.">
<link rel="canonical" href="https://paulet4a-commits.github.io/webdatatools/">
<style>
:root{--bg:#fff;--fg:#0f172a;--mut:#64748b;--line:#e2e8f0;--accent:#2563eb}
@media(prefers-color-scheme:dark){:root{--bg:#0b1120;--fg:#e2e8f0;--mut:#94a3b8;--line:#1e293b;--accent:#60a5fa}}
*{box-sizing:border-box}[hidden]{display:none!important}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:1100px;margin:0 auto;padding:48px 20px 80px}
h1{font-size:2rem;line-height:1.2;margin:0 0 1rem}h2{font-size:1.1rem;margin:2.5rem 0 1rem;color:var(--mut);font-weight:600;letter-spacing:.02em}
.lede{color:var(--mut);max-width:70ch;margin:0 0 1.5rem}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))}
.card{display:flex;gap:12px;padding:14px;border:1px solid var(--line);border-radius:12px;text-decoration:none;color:inherit;transition:border-color .15s;overflow-wrap:anywhere}
.card:hover{border-color:var(--accent)}.card img,.ph{border-radius:9px;flex:0 0 44px;height:44px;background:var(--line)}
.card p{margin:.2rem 0 .35rem;color:var(--mut);font-size:.9rem}.price{font-size:.8rem;color:var(--accent)}
pre{background:var(--line);padding:14px;border-radius:10px;overflow-x:auto;font-size:.85rem}
footer{margin-top:3rem;color:var(--mut);font-size:.9rem;border-top:1px solid var(--line);padding-top:1.2rem}
a{color:var(--accent)}a,summary,input,select,button{outline-offset:4px}
.skip{position:absolute;top:-100px}.skip:focus{top:8px;background:var(--bg);padding:10px}
.actions{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0}.button,button{border:1px solid var(--accent);border-radius:8px;padding:10px 15px;text-decoration:none;background:var(--bg);color:var(--accent);font:inherit;cursor:pointer}
.button.primary{background:var(--accent);color:var(--bg)}
.workflow{border:1px solid var(--line);border-radius:12px;padding:18px}.workflow h3{margin:0 0 10px;font-size:1rem}.workflow p{font-size:.9rem;color:var(--mut)}
.filters{display:flex;flex-wrap:wrap;align-items:end;gap:12px}.filters label{display:grid;gap:6px;flex:1;min-width:min(100%,230px)}
input,select{width:100%;padding:11px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--fg);font:inherit}
.note{font-size:.85rem;color:var(--mut)}details{border-top:1px solid var(--line);margin-top:36px;padding-top:20px}summary{cursor:pointer;font-weight:600}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.card{transition:none}}
</style></head><body><div class="wrap">
<a class="skip" href="#catalog">Skip to tools</a><main>
<h1>Web data tools.<br>Choose the task. Get structured output.</h1>
<p class="lede">${total} focused tools on the Apify Store for extracting fields, collecting video listings and preparing website content. Run them from the Apify input form, your code or a compatible AI agent. Each Actor has its own pricing and limits.</p>
<p class="lede"><a href="https://apify.com/webdatatools">Apify Store profile</a> · <a href="https://data.chimeramind.com/guides/">Guides &amp; API examples</a></p>
<div class="actions"><a class="button primary" href="#catalog">Find a tool</a><a class="button" href="#agent-setup">Set up an AI agent</a></div>
<h2>Start with a workflow</h2><div class="grid">
<article class="workflow"><h3>Extract fields from a page</h3><p>Input: page URLs and CSS selectors.<br>Output: named fields, one row per page.<br>Use the static tool when the data is in the HTML; choose the browser version for JavaScript content.</p><a href="https://apify.com/webdatatools/css-selector-extractor">Open CSS Selector Extractor →</a><p><a href="https://apify.com/webdatatools/css-selector-extractor-js">Need JavaScript rendering?</a></p></article>
<article class="workflow"><h3>Build a YouTube inventory</h3><p>Input: a public channel.<br>Output: video, Shorts or live-stream listings.<br>Video listings do not include transcripts; use the separate transcript tool for captions.</p><a href="https://apify.com/webdatatools/youtube-channel-scraper">Open YouTube Channel Scraper →</a></article>
<article class="workflow"><h3>Prepare content for RAG</h3><p>Input: a website and a page limit.<br>Output: clean Markdown per page, with optional chunking and change detection.<br>Uses static HTML; JavaScript-only content may be missing.</p><a href="https://apify.com/webdatatools/website-to-markdown">Open Website to Markdown →</a></article>
</div>
<section id="catalog" tabindex="-1"><h2>Find your tool</h2>
<p class="note">Free-plan event rates from the public Apify catalog, checked ${checkedAt.toISOString().slice(0, 10)}. Additional Actor Start fees may apply and scale with memory. Multiple event rates are added when applicable. Check the Actor's Pricing tab for conditions, plan-specific rates and your run's total budget.</p>
<div class="filters" id="filters" hidden><label>Search tools<input id="search" type="search" placeholder="Try YouTube, CSS, jobs or Markdown" autocomplete="off"></label>
<label>Category<select id="category"><option value="">All categories</option>${groups.map((g, i) => `<option value="${i}">${esc(g.name)}</option>`).join('')}</select></label><button id="clear" type="button">Clear filters</button></div>
<p id="results" role="status" aria-live="polite">${total} tools</p><p id="empty" hidden>No tools match. Try a different name or clear the filters.</p>${cards}</section>
<details id="agent-setup"><summary>Use tools from an AI agent — MCP setup</summary>
<p class="lede">The MCP server exposes eleven selected tools from this catalog to compatible clients such as Claude Desktop, Cursor and Cline. Add the configuration below using your own Apify token. Each call runs on your Apify account and is billed at the chosen Actor's rates; review its input and cost limits first.</p>
<pre>{
  "mcpServers": {
    "webdatatools": {
      "command": "npx",
      "args": ["-y", "github:paulet4a-commits/webdatatools-mcp-server"],
      "env": { "APIFY_TOKEN": "your-apify-token" }
    }
  }
}</pre><p><a href="https://github.com/paulet4a-commits/webdatatools-mcp-server#quick-start-no-install">Installation and supported tools →</a></p></details>
</main><footer>Built by <a href="https://apify.com/webdatatools">Murat Uzun</a>. Explore <a href="https://data.chimeramind.com/guides/">guides and examples</a>. Each Actor's current pricing and limits are listed on Apify.</footer>
<script>
const search = document.querySelector('#search'), category = document.querySelector('#category');
const groups = [...document.querySelectorAll('.catalog-group')];
function filterTools() {
  const terms = search.value.trim().toLocaleLowerCase().split(/\\s+/).filter(Boolean);
  let count = 0;
  for (const group of groups) {
    let visible = 0;
    for (const card of group.querySelectorAll('.card')) {
      const text = (card.textContent + ' ' + card.getAttribute('href')).toLocaleLowerCase();
      const match = (!category.value || category.value === group.dataset.group) && terms.every(term => text.includes(term));
      card.hidden = !match;
      if (match) visible++;
    }
    group.hidden = !visible; count += visible;
  }
  document.querySelector('#results').textContent = count + ' of ${total} tools';
  document.querySelector('#empty').hidden = count !== 0;
}
search.addEventListener('input', filterTools); category.addEventListener('change', filterTools);
document.querySelector('#clear').addEventListener('click', () => { search.value = ''; category.value = ''; filterTools(); search.focus(); });
document.querySelector('#filters').hidden = false;
document.querySelector('a[href="#agent-setup"]').addEventListener('click', () => { document.querySelector('#agent-setup').open = true; });
</script></div></body></html>`;
}
