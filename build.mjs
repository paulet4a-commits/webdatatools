// Builds a single static page listing every published Actor, from the suite manifest + live Store data.
// No dependencies, no build step: writes index.html ready for GitHub Pages.
import fs from 'node:fs';
import path from 'node:path';
import { fetchPublicActors, groupActors } from './catalog.mjs';
import { renderCatalog } from './render.mjs';

const root = path.join(import.meta.dirname, '..', 'actors');
const manifestArg = process.argv.indexOf('--manifest');
const manifestPath = manifestArg < 0 ? path.join(root, '_ops', 'suite-manifest.json') : path.resolve(process.argv[manifestArg + 1] ?? '');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : { groups: [] };
const acts = await fetchPublicActors();
const groups = groupActors(manifest, acts);

const html = renderCatalog(groups, acts.length);
const output = path.join(import.meta.dirname, 'index.html');
fs.writeFileSync(output + '.tmp', html);
fs.renameSync(output + '.tmp', output);
console.log(`Public Store ${acts.length}; rendered ${acts.length} unique Actors`);
