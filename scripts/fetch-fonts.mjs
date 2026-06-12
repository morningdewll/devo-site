// Downloads latin-subset woff2 for Fraunces (var + italic var) and Caveat 500
// from Google Fonts. Re-run only when changing the type system.
import { writeFileSync, mkdirSync } from 'node:fs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Caveat:wght@500&display=swap';

const cssRes = await fetch(CSS_URL, { headers: { 'User-Agent': UA } });
if (!cssRes.ok) throw new Error(`CSS fetch failed: ${cssRes.status} ${cssRes.statusText}`);
const css = await cssRes.text();
const blocks = css.split('@font-face').slice(1);
mkdirSync('assets/fonts', { recursive: true });
let manifest = [];
for (const b of blocks) {
  if (!/unicode-range:[^;]*U\+0000-00FF/.test(b)) continue; // latin subset only
  const family = b.match(/font-family:\s*'([^']+)'/)[1];
  const style = b.match(/font-style:\s*(\w+)/)[1];
  const url = b.match(/url\((https:[^)]+\.woff2)\)/)[1];
  const name = `${family.toLowerCase()}-${style}-latin.woff2`;
  const fontRes = await fetch(url);
  if (!fontRes.ok) throw new Error(`Font fetch failed for ${name}: ${fontRes.status} ${fontRes.statusText}`);
  const buf = Buffer.from(await fontRes.arrayBuffer());
  writeFileSync(`assets/fonts/${name}`, buf);
  manifest.push(`${name}  ${buf.length} bytes`);
}
if (manifest.length !== 3) { console.error(`Expected 3 font files, got ${manifest.length}:`, manifest); process.exit(1); }
console.log(manifest.join('\n'));
