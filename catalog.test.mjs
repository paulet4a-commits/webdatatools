import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchPublicActors, groupActors, priceLabel } from './catalog.mjs';

const actor = n => ({ id: `id${n}`, name: `tool-${n}`, username: 'webdatatools', title: `Tool ${n}` });
const page = (items, total, offset) => ({ ok: true, json: async () => ({ data: { items, total, offset } }) });
test('public inventory includes more than 100 actors and advances by returned count', async () => {
    const all = Array.from({ length: 113 }, (_, n) => actor(n));
    const offsets = [];
    const result = await fetchPublicActors({ fetcher: async url => {
        const offset = Number(new URL(url).searchParams.get('offset'));
        offsets.push(offset);
        return page(all.slice(offset, offset + 40), 113, offset);
    } });
    assert.equal(result.length, 113);
    assert.deepEqual(offsets, [0, 40, 80]);
});
test('incomplete, duplicate, wrong-owner, failed and moving snapshots are rejected', async () => {
    for (const fetcher of [
        async () => page([], 1, 0),
        async () => page([actor(0), actor(0)], 2, 0),
        async () => page([{ ...actor(0), username: 'another-owner' }], 1, 0),
        async () => ({ ok: false, status: 503 }),
        async url => new URL(url).searchParams.get('offset') === '0' ? page([actor(0)], 2, 0) : page([actor(1)], 3, 1),
    ]) await assert.rejects(fetchPublicActors({ fetcher }));
});
test('public actors missing from the manifest remain visible and duplicate manifest entries do not repeat', () => {
    const groups = groupActors({ groups: [{ name: 'Known', actors: [{ slug: 'tool-1' }, { slug: 'tool-1' }, { slug: 'private-tool' }] }] }, [actor(1), actor(2)]);
    assert.deepEqual(groups.map(g => g.actors.map(a => a.slug)), [['tool-1'], ['tool-2']]);
});
test('catalog uses the current Store price and never the future or start-event price', () => {
    const a = { currentPricingInfo: { pricingPerEvent: { actorChargeEvents: {
        start: { isOneTimeEvent: true, eventPriceUsd: 0.1 },
        page: { isPrimaryEvent: true, eventTitle: 'pages', eventTieredPricingUsd: { FREE: { tieredEventPriceUsd: 0.002 } } },
    } } }, pricingInfos: [{ startedAt: '2099-01-01', eventPriceUsd: 1 }] };
    assert.equal(priceLabel(a), '$2 / 1,000 pages');
    assert.equal(priceLabel({}), '');
});

test('additional conditional charge events are not hidden behind the primary rate', () => {
    const a = { currentPricingInfo: { pricingPerEvent: { actorChargeEvents: {
        start: { isOneTimeEvent: true, eventPriceUsd: 0.00005 },
        email: { eventTitle: 'E-mail found', eventPriceUsd: 0.003 },
        place: { isPrimaryEvent: true, eventTitle: 'Place', eventTieredPricingUsd: { FREE: { tieredEventPriceUsd: 0.002 } } },
    } } } };
    assert.equal(priceLabel(a), '$2 / 1,000 Place + $3 / 1,000 E-mail found');
});
