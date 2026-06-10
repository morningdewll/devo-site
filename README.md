# devo-site

The marketing site for [devo](https://devo.fyi). A small Bible journal you share with your closest friends, where you write your reflection before you can read theirs.

This repo is the apex landing page plus the legal, support, and FAQ pages. It also holds the Universal Links and App Links files that connect web URLs to the iOS and Android apps.

## What lives here

- `index.html`: the apex landing page at [devo.fyi](https://devo.fyi). Headline, failure modes, how-it-works, FAQ, single "Get devo" CTA (App Store / Google Play picked by device, no redirect).
- SEO cluster pages: `post-first-devotionals.html`, `christian-bereal.html`, `christian-quiet-time-app.html`, `read-the-bible-with-friends.html`, `bible-reading-streak.html`, `christian-accountability-app.html`, `small-group-bible-app.html`, `private-christian-social-media.html`.
- `privacy.html`, `terms.html`, `support.html`, `delete-account.html`, `faq.html`: the legal and support pages required by Apple and Google for the app stores.
- `style.css`, `legal.css`: site styles. `style.css` covers the landing pages, `legal.css` covers the document pages.
- `favicon.ico` / `favicon.svg` / `apple-touch-icon.png` / `site.webmanifest` / `assets/`: icons, the OG share image, and the tree SVG. The icon and OG art are hand-authored SVG in the brand palette.
- `.well-known/apple-app-site-association`: Apple Universal Links manifest. Lets `devo.fyi` links open inside the iOS app when it's installed.
- `.well-known/assetlinks.json`: Android App Links manifest. Same idea for Android.
- `CNAME`: sets the custom domain to `devo.fyi`.
- `.nojekyll`: tells GitHub Pages to skip Jekyll processing and serve the files as-is.

## Local preview

Open `index.html` straight in a browser to look at the landing page. For anything that hits paths like `/privacy.html` or `/.well-known/...`, run a local server from the repo root:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. The Universal Links and App Links files only resolve correctly when served over a real domain, so they won't deep-link to the apps from `localhost`. Everything else previews fine.

## Deploy

Pushes to `main` deploy automatically via GitHub Pages. The custom domain `devo.fyi` is set through the `CNAME` file in the repo root. There is no build step. What's in the repo is what's on the site.

## Sister repos

The devo project is split across four repos:

- [`morningdewll/devo`](https://github.com/morningdewll/devo): the iOS and Android app (Expo / React Native).
- [`morningdewll/devo-site`](https://github.com/morningdewll/devo-site): this repo. Marketing site at [devo.fyi](https://devo.fyi).
- [`morningdewll/devo-console`](https://github.com/morningdewll/devo-console): internal marketing console (content queue, distributor checks, voice gates).
- [`morningdewll/devo-ops`](https://github.com/morningdewll/devo-ops): ops, merch fulfillment, specs, plans, and the brand-voice canon.

## Notes

The site is built to stay small and easy to edit. No framework, no bundler, no JS dependencies. The hero text and the hook line are part of the brand voice and shouldn't be rewritten without a voice pass. If a copy change feels off, check `devo-ops/.claude/brand-voice-guidelines.md` first.
