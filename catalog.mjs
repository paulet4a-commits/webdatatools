// Public Store metadata only: catalog builds do not need an account credential.
export async function fetchPublicActors({ fetcher = fetch, limit = 100, onPage = () => {} } = {}) {
    const actors = new Map();
    let offset = 0, expectedTotal = null;
    for (let page = 0; page < 1000; page++) {
        const response = await fetcher(`https://api.apify.com/v2/store?username=webdatatools&limit=${limit}&offset=${offset}`, {
            signal: AbortSignal.timeout(20_000), redirect: 'error',
        });
        if (!response.ok) throw new Error(`Public Store HTTP ${response.status}`);
        const { data } = await response.json();
        if (!Array.isArray(data?.items) || !Number.isSafeInteger(data.total) || data.total < 0) throw new Error('Invalid Store inventory');
        if (expectedTotal !== null && data.total !== expectedTotal) throw new Error('Store inventory changed during pagination; rebuild');
        expectedTotal = data.total;
        if (data.offset !== undefined && data.offset !== offset) throw new Error('Store returned an unexpected page offset');
        onPage({ offset, count: data.items.length, total: data.total });
        for (const actor of data.items) {
            if (!actor?.id || !/^[a-z0-9][a-z0-9-]*$/i.test(actor.name ?? '') || actor.username !== 'webdatatools') throw new Error('Invalid Store actor identity');
            actors.set(actor.id, actor);
        }
        offset += data.items.length;
        if (offset >= expectedTotal) {
            if (actors.size !== expectedTotal) throw new Error('Incomplete or duplicate Store inventory; old catalog preserved');
            return [...actors.values()];
        }
        if (!data.items.length) throw new Error('Store pagination ended before the reported total');
    }
    throw new Error('Store pagination safety limit reached');
}

export function groupActors(manifest, actors) {
    const remaining = new Map(actors.map(a => [a.name, a]));
    const groups = [];
    for (const group of manifest.groups ?? []) {
        const entries = [];
        for (const entry of group.actors ?? []) {
            const actor = remaining.get(entry.slug);
            if (!actor) continue;
            remaining.delete(entry.slug);
            entries.push({ ...entry, actor });
        }
        if (entries.length) groups.push({ name: group.name, actors: entries });
    }
    if (remaining.size) groups.push({ name: 'More data tools', actors: [...remaining.values()].sort((a, b) => a.name.localeCompare(b.name)).map(actor => ({
        slug: actor.name, title: actor.title, blurb: actor.description, actor,
    })) });
    return groups;
}

export function priceLabel(actor) {
    const events = Object.values(actor.currentPricingInfo?.pricingPerEvent?.actorChargeEvents ?? {});
    const recurring = events.filter(e => !e.isOneTimeEvent).sort((a, b) => Number(!!b.isPrimaryEvent) - Number(!!a.isPrimaryEvent));
    return recurring.map(event => {
        const usd = event.eventTieredPricingUsd?.FREE?.tieredEventPriceUsd ?? event.eventPriceUsd;
        if (typeof usd !== 'number' || !Number.isFinite(usd) || usd < 0) return '';
        return `$${(usd * 1000).toFixed(2).replace(/\.00$/, '')} / 1,000 ${event.eventTitle ?? 'results'}`;
    }).filter(Boolean).join(' + ');
}
