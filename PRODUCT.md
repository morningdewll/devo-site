# Product

## Register

brand

## Audience

Christians, mostly 18-30, who already try to keep a daily quiet time and want their
closest friends in it.

## Product Purpose

devo is a free post-first devotional app: write your reflection on today's verse first,
then your closest friends' reflections unlock. No public feed, no followers, no algorithm.

## Brand Personality

Warm, quiet, honest. Morning light, not neon. A notebook on a desk, not a feed.

## Design Principles

- One mechanic per panel, named in plain words. A stranger gets it without reading twice.
- The product is the art: rebuilt real UI as paper objects on the dawn desk, never a
  phone-in-a-frame template.
- Honest everything: demo names lowercase, real verse refs, plausible tiny counts, no
  invented numbers.
- Identity trio committed for life: cream `#FBF6EE` + gold `#D29A47` + Fraunces. These
  are live in the app, the icon, the store set, and this site. They do not rotate with
  trends.

## Anti-references

- SaaS launch slop: no gradient text, no fake metrics, no star-rating mockups, no
  testimonials.
- Corny Christian marketing voice: no "be blessed", no "met me right where I am", no
  sermon cadence in copy.
- Em dashes banned in all user-facing copy (house rule; code and markdown comments exempt).
- Instagram/BeReal energy: no public-feed vibes, no follower counts, no engagement bait.

## Site-specific Constraints

**Stack:** vanilla HTML/CSS/JS, no build step. GH Pages auto-deploys `main`.

**Lighthouse budget:** ~100x4. Fraunces + Caveat are the only webfonts (~200 KB total,
latin subset, wght 400-600 only; no real 700 -- browser clamps). No additional webfont
weight may be added without a full Lighthouse re-check.

**Token source:** `tokens.css` is the single token source. `legal.css` is hex-free;
`style.css` carries two legacy one-off hexes (locked-card #F2E9D7, blur-line #E5D9C4,
both plan-specified scene colors). No NEW raw hex outside tokens.css.

**Sacred surfaces (never touch without explicit sign-off):**
- Inline referral + group-code `<script>` in `index.html` (Googlebot UA guard is
  load-bearing -- removing it causes the homepage to index as a Play Store redirect)
- JSON-LD blocks and canonical tags
- `.well-known/apple-app-site-association` and `assetlinks.json`
- `sitemap.xml`, `robots.txt`, `googlead1953a5fee60e7b.html` (GSC verification)
- Favicon set derived from the app icon (`favicon.ico`, `apple-touch-icon.png`,
  `assets/icon-192.png`, `assets/icon-512.png`)
- All 14 live URLs (adding or removing pages requires sitemap + canonical update)

**Tree SVG:** always regenerated via `Quiettime/scripts/export-tree-svg.ts`. Never
hand-draw or edit the SVG directly.

**Copy changes** to hero/hook lines require a voice pass against devo brand voice
guidelines before ship.
