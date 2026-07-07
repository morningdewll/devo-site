# Cloudflare Worker — per-post link previews for `/qt/<uuid>` shares

**Status: NOT DEPLOYED.** This is prepped and ready; it needs a DNS/hosting call (yours).

## What it fixes

devo.fyi is static GitHub Pages. A shared reflection link (`devo.fyi/qt/<uuid>`) is
served by `404.html` and rendered client-side by `assets/share-qt.js`. Social and
chat crawlers don't run JavaScript, so **every shared reflection currently previews
as the generic "devo" 404 card** in iMessage, Slack, Discord, WhatsApp, Facebook,
etc. That is the single weakest point on the actual viral share path — the moment a
user hands devo to a friend, the preview says nothing about what they shared.

`qt-og-worker.js` intercepts **crawler requests only** to `/qt/<uuid>`, fetches the
shared devotion from Supabase (same public RPC + anon key already in `share-qt.js`),
and returns minimal HTML with per-post Open Graph tags. Humans and the app's iOS
Universal Links pass straight through to the existing site — zero change to their
experience.

## Privacy floor (do not weaken without deciding)

The preview shows the **sharer's display name + passage reference + an invitation
line** only. It does **not** put the reflection body into the link preview — previews
get cached and reshared into contexts the sharer never chose. The body stays on the
page, behind a human click. `INCLUDE_BODY_EXCERPT` (top of the Worker) flips this on;
it is `false` by design.

## The one decision: how Cloudflare gets in front of devo.fyi

devo.fyi is currently `CNAME` → GitHub Pages. Two clean options:

1. **Cloudflare as proxy in front of GitHub Pages (smaller change).** Move the domain's
   DNS to Cloudflare, keep GitHub Pages as the origin, enable the orange-cloud proxy,
   and add this Worker on a route (`devo.fyi/qt/*`). GitHub Pages keeps serving
   everything; the Worker only rewrites crawler responses on `/qt/*`. Keep GitHub Pages
   HTTPS working (set Cloudflare SSL to "Full").

2. **Migrate hosting to Cloudflare Pages (bigger change, tidier long-term).** Import the
   same repo into Cloudflare Pages (build command: none; output dir: repo root). Add the
   Worker logic as a Pages Function at `functions/qt/[id].js`. Deploys on push, same as
   GitHub Pages does today.

Recommendation: **option 1** — least disruption, keeps the current deploy flow, reversible.

## Deploy steps (option 1, once you say go)

1. Add `devo.fyi` to Cloudflare, point the registrar's nameservers at Cloudflare.
2. Recreate the DNS records (the GitHub Pages A/AAAA or CNAME), proxy **on** (orange).
3. `npm i -g wrangler` → `wrangler login`.
4. From this folder: `wrangler deploy qt-og-worker.js --name devo-qt-og` (or paste into
   the dashboard Workers editor).
5. Add a route: `devo.fyi/qt/*` → `devo-qt-og`.
6. Verify (below).

## Verify

- `curl -A "facebookexternalhit/1.1" https://devo.fyi/qt/<a-real-public-uuid>` → returns
  per-post OG HTML (name + passage + invitation; **no reflection body**).
- `curl -A "Mozilla/5.0" https://devo.fyi/qt/<same-uuid>` → returns the normal static
  page (`share-qt.js` renders it client-side, unchanged).
- Paste a real `/qt/<uuid>` link into iMessage/Slack and the
  [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — confirm the
  name/passage preview and that the body is absent.
- Confirm iOS app-installed users still deep-link into the app (Universal Links unaffected —
  the Worker only touches crawler UAs).
