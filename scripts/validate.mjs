import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const htmlPath = path.join(root, 'echappee-gps.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(html.startsWith('<!doctype html>'), 'HTML doctype missing');
check(Buffer.byteLength(html) < 650_000, 'Single-shell HTML should stay below 650 KB');
check((html.match(/data:image\/webp;base64,/g) || []).length === 12, 'Expected 12 optimized embedded WebP scene references');
check(/var ECHO_COUNT=6;/.test(html), 'ECHO_COUNT must remain 6');
check((html.match(/class="echo-item/g) || []).length === 6, 'Home must expose exactly 6 echo cards');
check(!/sur 5|cinq échos|5 balises|for\(var i=0;i<5|k<=5/.test(html), 'Stale five-echo copy/logic found');
check(/function chRhythm\(/.test(html), 'Final Léman rhythm challenge missing');
check(/PROFILE_KEY='echappee\.profile\.v2'/.test(html), 'Persistent explorer profile missing');
check(/navigator\.serviceWorker\.register/.test(html), 'Service worker registration missing');

const staticHtml = html.split('<script>')[0];
const ids = [...staticHtml.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
check(duplicates.length === 0, `Duplicate ids: ${[...new Set(duplicates)].join(', ')}`);
const requiredIds = ['home','nav','challenge','end','setup','start','hero-start','gps-chip','radar','ch-body','game-sheet','sheet-close','native-share','fx-layer'];
for (const id of requiredIds) check(ids.includes(id), `Required element #${id} missing`);

for (const button of html.matchAll(/<button\b([^>]*)>/g)) check(/\btype="button"|\btype="submit"/.test(button[1]), `Button without explicit type: ${button[0].slice(0,80)}`);

const localRefs = [...html.matchAll(/(?:src|href)="((?:assets\/|manifest\.webmanifest)[^"]*)"/g)].map(m => m[1]);
for (const ref of localRefs) check(fs.existsSync(path.join(root, ref)), `Missing local asset: ${ref}`);

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
check(scripts.length === 1, `Expected one inline game script, got ${scripts.length}`);
for (const [i, script] of scripts.entries()) {
  try { new Function(script); } catch (error) { failures.push(`Game script ${i + 1} syntax error: ${error.message}`); }
}

const manifestPath = path.join(root, 'manifest.webmanifest');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
check(manifest.start_url === './echappee-gps.html', 'Manifest start_url mismatch');
for (const icon of manifest.icons || []) check(fs.existsSync(path.join(root, icon.src)), `Missing manifest icon: ${icon.src}`);

const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
for (const ref of [...sw.matchAll(/'\.\/(assets\/[^']+|manifest\.webmanifest|echappee-gps\.html)'/g)].map(m => m[1])) {
  check(fs.existsSync(path.join(root, ref)), `Service worker cache target missing: ${ref}`);
}
try { new Function(sw); } catch (error) { failures.push(`Service worker syntax error: ${error.message}`); }

if (failures.length) {
  console.error(`Validation failed (${failures.length}):`);
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log(`Échappée validation OK · ${ids.length} unique ids · 6 echoes · ${localRefs.length} local asset references · ${Buffer.byteLength(html)} bytes HTML`);
