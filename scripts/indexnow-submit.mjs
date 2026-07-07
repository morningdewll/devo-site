#!/usr/bin/env node
/*
 * indexnow-submit.mjs — tell IndexNow-participating engines (Bing, Yandex,
 * Seznam, Naver) to (re)crawl devo.fyi's pages.
 *
 * WHY THIS EXISTS: devo.fyi is indexed on Google + Exa but was absent from the
 * Bing-family index that feeds several AI answer engines (verified 2026-07-07).
 * IndexNow is the legitimate submit protocol for those engines. This is NOT the
 * banned "force indexation" move in SEO-NOTES.md — that guard is about already-
 * Google-indexed pages. This closes a real Bing coverage gap.
 *
 * PRECONDITION: the key file must be LIVE at
 *   https://devo.fyi/c5d15fccfff14525c07c8a0f218402bc.txt
 * i.e. run this only AFTER this branch is merged to main and GitHub Pages has
 * redeployed. Running it before the key file is public will fail verification.
 *
 * USAGE: node scripts/indexnow-submit.mjs
 * Requires Node 18+ (global fetch). No dependencies.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HOST = 'devo.fyi';
const KEY = 'c5d15fccfff14525c07c8a0f218402bc';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const here = dirname(fileURLToPath(import.meta.url));
const sitemap = readFileSync(join(here, '..', 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (urlList.length === 0) {
  console.error('No <loc> URLs found in sitemap.xml — aborting.');
  process.exit(1);
}

const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

console.log(`Submitting ${urlList.length} URLs to IndexNow…`);
const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

// IndexNow returns 200 (accepted) or 202 (accepted, pending). 403 = key not
// verified (key file not live yet). 422 = URL/host mismatch.
console.log(`IndexNow responded: ${res.status} ${res.statusText}`);
if (res.status === 200 || res.status === 202) {
  console.log('OK — engines will crawl the submitted URLs.');
} else {
  const text = await res.text().catch(() => '');
  console.error(`Not accepted. ${text}`);
  if (res.status === 403) {
    console.error(`403 = key not verified. Confirm ${KEY_LOCATION} is live, then retry.`);
  }
  process.exit(1);
}
