// Downloads latin-subset woff2 for Fraunces (var + italic var) and Caveat 500
// from Google Fonts. Re-run only when changing the type system.
import { writeFileSync, mkdirSync } from 'node:fs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Caveat:wght@500&display=swap';

const css = await (await fetch(CSS_URL, { headers: { 'User-Agent': UA } })).text();
const blocks = css.split('@font-face').slice(1);
mkdirSync('assets/fonts', { recursive: true });
let manifest = [];
for (const b of blocks) {
  if (!/unicode-range:[^;]*U\+0000-00FF/.test(b)) continue; // latin subset only
  const family = b.match(/font-family:\s*'([^']+)'/)[1];
  const style = b.match(/font-style:\s*(\w+)/)[1];
  const url = b.match(/url\((https:[^)]+\.woff2)\)/)[1];
  const name = `${family.toLowerCase()}-${style}-latin.woff2`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(`assets/fonts/${name}`, buf);
  manifest.push(`${name}  ${buf.length} bytes`);
}
console.log(manifest.join('\n'));
