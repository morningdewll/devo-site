# SEO / GEO notes — read before "improving" SEO

Decisions from the verified GEO+SEO research (2026-06-17, two multi-agent workflows, adversarially fact-checked against primary sources). These exist to stop a future agent from re-proposing dead or harmful moves.

## The strategy in one line
devo.fyi reaches Google page-1 + LLM citation by (1) getting indexed, (2) owning the **unclaimed "christian bereal" long-tail** (not head terms), and (3) building the **third-party corroboration layer** engines actually cite (~80-85% of AI citations are third-party, not your own page). Ranking + citation are downstream of real signals (links, branded clicks, mentions) that accrue over **months** for memorized recall, though live-retrieval engines (Perplexity, AI Overviews) can pick up corroborated content in **days**.

## DO NOT (verified dead or harmful — do not re-add)
- **Do not treat `llms.txt` as a ranking/citation lever.** Confirmed: no major engine consumes it (Google: "no AI system currently uses llms.txt"; ~97% of domains with a valid file got zero crawler requests for it). Keep the file (harmless), assign it ZERO expected lift.
- **Do not add "AI-Overview schema."** Google primary doc: there is no AI-Overview-specific markup; AI-Overview presence is downstream of classic organic rank.
- **Do not run a Bing-first SEO sprint.** Stale: ChatGPT decoupled from Bing in 2025; only Copilot is Bing-gated. Bing Webmaster Tools is worth enabling only as a free Copilot-citation *measurement* channel.
- **Do not add `aggregateRating` / `Review` schema** without real, non-incentivized store data. FTC rule + Google policy. (This is why the schema is intentionally rating-free — see the HTML comment in index.html.)
- **Do not chase the `devo` name collision with anchor-text on every off-site mention.** The fix is on-domain entity ground truth (alternateName + function-encoding description + sameAs + eventually Wikidata/Crunchbase). Already applied to the Organization node.
- **Do not run a "submit to 30-50 directories" blast**, buy PBN/Fiverr/footer/widget links, or do "free product for a review-with-link" deals. Google spam policy; net-negative for a low-authority domain. (Curated, on-topic listings only: AlternativeTo, SaaSHub, faith.tools.)
- **Do not build a first-party "best Christian apps" listicle.** Format mismatch + FTC/credibility. Pursue INCLUSION in existing listicles instead.
- **Do not spin up near-duplicate pages** (e.g. a separate "christian bereal app question" page >40% overlapping christian-bereal.html). Helpful-content is a SITE-WIDE signal since the March 2024 core update — thin/duplicative pages drag the whole cluster down. Fold intents into existing pages.
- **Do not chase head terms** ("bible app", "devotional app", "read the bible with friends", "bible study social app", "christian social media") as pages to out-rank — saturated by YouVersion/Bible.com (DA90+). 6-12 month brand play at best; pursue listicle inclusion there.
- **Do not spend more effort on Lighthouse / Core Web Vitals / adding more schema TYPES as a ranking play.** Page experience is a weak tiebreaker; structured data does not boost rank. Already ~100; reallocate to links + real branded clicks.

## Where the real leverage is (months-long, mostly off-domain)
Reddit (founder-disclosed, #1 AI-cited but platform-specific), faith.tools (paid), listicle inclusion, Product Hunt, Crunchbase/LinkedIn entity homes, genuine press. These need a human (accounts, voice, FTC disclosure, sending) — not the repo.

_Full plan + sources: vault note "Knowledge — devo GEO - LLM-Recommendation Playbook" + the 2026-06-17 master-plan workflow._
