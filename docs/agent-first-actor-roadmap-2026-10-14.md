# Agent-first Apify product roadmap — 2026-10-14

## Decision
Build infrastructure AI agents **need to call**, not generic text generators that agents easily replicate. This is a planning proposal, not authorization to publish, spend, or claim market demand.

## Current evidence / reconciliation
- Owner reports **113 public Actors (2026-10-14)**; existing site `index.html` dated 2026-10-13 says **85**. The current public count must be checked via Apify API before any conclusion.
- Site generator `build.mjs` uses `acts?my=1&limit=100` and may truncate the inventory. Implement pagination, confirm `isPublic`, deduplicate by actor ID, and add an inventory count check before using it as the canonical published inventory.
- User-provided Apify dashboard snapshots show approximately $127.07 profit with strong concentration in one Web Scraper Actor. Do not extrapolate this spike as recurring revenue.
- Native Actor source appears to live outside this landing-page repo: locate `actors/_ops/suite-manifest.json` and the actual Actor code via the documented Tam Kontrol income-route map before modifying anything.

## Prioritized candidates (validate before building)
| Priority | Proposed family | Apify building block | Possible recurring SaaS use | Differentiation / evidence needed |
| --- | --- | --- | --- | --- |
| P1 | Competitor Radar | multi-site product matching, verified price/stock/change extraction | merchant competitive monitoring | measure accuracy, availability, legal/access constraints, and willingness to pay |
| P1 | Agent Data Reliability | schema-diff, freshness, status and anomaly probes | agent integration monitoring and alerts | reliability benchmarks against existing monitoring tools |
| P2 | Regulatory Change Monitor | public authoritative-source diff + citations and dates | regulation watch, human-reviewed alerts | avoid legal advice; provenance, false-positive rate, permissions |
| P2 | Lead Opportunity Engine | lawful public company/technology/hiring signals and provenance | consent-aware B2B opportunity workflows | data protections, customer ROI, false matches |
| P2 | Marketplace Seller Intelligence | marketplace item, seller, price and stock deltas | seller alerts and reporting | platform TOS/robots and sustainable costs |

## Agent selection gate (apply to both factories)
1. Identify paying customer and **repeat** problem; record verifiable demand and competitor alternatives.
2. Show why a generic agent alone cannot match the reliability, coverage, freshness, authorized access, volume, or integrated workflow at similar cost.
3. Inspect the existing catalog for functional duplication (not only name similarity); prefer improvements/extensions where equivalent.
4. Specify data access basis / robots / TOS / copyright / privacy / credential handling. No evasion or unauthorized collection.
5. Define an observable MVP contract: input/output schema, coverage, error rate, data freshness, operational cost per successful output, and customer outcome.
6. Require genuine end-to-end tests, billing sanity checks, and a documented go/no-go. No fabricated metrics.
7. Do not publish just to meet the aspirational five-Actors-per-day cadence; quality gate wins.

## First execution slice
- [ ] Generate canonical inventory of 113 claimed public Actors and explain 85-vs-113 discrepancy with API snapshots, timestamps and pagination.
- [ ] Produce function-based duplicate/overlap map across all Actors.
- [ ] Analyze existing profitable Actors before selecting adjacent products; capture actual paid user retention and last 30-day revenue by Actor.
- [ ] Score the 5 families above for demand, agent-dependence, legal access, differentiation, unit economics, and complexity.
- [ ] Prototype **at most two** distinct validated Actor opportunities behind tests, no publication without existing authorized path and acceptance.
- [ ] Document clear handoff contract to the SaaS factory (versioned datasets, API, rate, freshness SLA, error reporting).
- [ ] Report observed evidence vs assumptions. Update real native source, not this catalog as a second source of truth.

## Six-month goal and financial discipline
113 to 1,000 requires 887 additional public Actors; at 5 per day this is 178 publishing days without breaks. **1,000 is a capacity target, not proof of demand.** Gate growth on recurring paid users, gross margin, incident rate and 30-day revenue concentration. Plan operational expense including Apify subscription and maintenance.

## Scope
Roadmap only. No credentials, scraping bypasses, external account operations, spending, deployment, or claims of completed MVPs.
