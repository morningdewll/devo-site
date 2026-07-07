/*
 * qt-og-worker.js — Cloudflare Worker that gives shared /qt/<uuid> links a real
 * per-post link preview for social/chat crawlers (iMessage, Slack, Discord,
 * Facebook, Twitter/X, WhatsApp, Telegram, LinkedIn).
 *
 * PROBLEM IT SOLVES: devo.fyi is static GitHub Pages. A /qt/<uuid> path is
 * served by 404.html, whose devotion is rendered client-side by share-qt.js.
 * Crawlers do not run JS, so every shared reflection currently previews as the
 * generic "devo" 404 card. This Worker intercepts crawler requests only,
 * fetches the shared devotion from Supabase, and returns minimal HTML carrying
 * per-post Open Graph tags. Humans (and the app's Universal Links) are passed
 * straight through to the existing static site — unchanged behavior.
 *
 * PRIVACY FLOOR (load-bearing): the preview surfaces the sharer's display name
 * + the passage reference + an invitation line ONLY. It never emits the
 * reflection BODY into a link preview (previews are cached and reshared in
 * contexts the sharer did not choose). The body stays where the sharer put it:
 * on the page itself, behind a human click. To also show a body excerpt, set
 * INCLUDE_BODY_EXCERPT = true below — that is a deliberate product call, off by
 * default.
 *
 * NOT DEPLOYED. Requires putting Cloudflare in front of devo.fyi (proxy the
 * existing GitHub Pages origin, or migrate to Cloudflare Pages). See README.md
 * in this folder. Kyuchan's DNS/hosting call.
 */

const SUPABASE_URL = 'https://eecsgizepwkkudmgdesr.supabase.co';
// Publishable (anon) key — same public key already shipped in share-qt.js and
// the mobile app. Grants only what RLS + the RPC allow (public rows, content
// columns only).
const PUBLISHABLE_KEY = 'sb_publishable_8hC9PlCh3rC9LS0zSNPiPQ_bLyDy6sU';

const INCLUDE_BODY_EXCERPT = false; // privacy floor: keep false unless changed on purpose
const OG_IMAGE = 'https://devo.fyi/assets/og-image.png';

const QT_PATH = /^\/qt\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/?$/;

// Match the common link-preview / social crawlers. Real browsers fall through.
const CRAWLER_UA =
  /(facebookexternalhit|Facebot|Twitterbot|Slackbot|Discordbot|WhatsApp|TelegramBot|LinkedInBot|Pinterest|redditbot|Googlebot|bingbot|Applebot|SkypeUriPreview|vkShare|W3C_Validator|Embedly|Iframely)/i;

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function fetchQt(id) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_public_qt`, {
      method: 'POST',
      headers: {
        apikey: PUBLISHABLE_KEY,
        Authorization: `Bearer ${PUBLISHABLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_qt_id: id }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

function ogHtml({ title, description, url }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const u = escapeHtml(url);
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<title>${t}</title>
<meta name="description" content="${d}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:type" content="article">
<meta property="og:url" content="${u}">
<meta property="og:site_name" content="devo">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
</head><body>
<p>${d} <a href="${u}">Open in devo.</a></p>
</body></html>`;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const match = url.pathname.match(QT_PATH);
    const ua = request.headers.get('user-agent') || '';

    // Only intercept crawler requests to /qt/<uuid>. Everything else — humans,
    // app Universal Links, all other paths — goes to the static origin as-is.
    if (!match || !CRAWLER_UA.test(ua)) {
      return fetch(request);
    }

    const qt = await fetchQt(match[1]);
    const canonical = `https://devo.fyi${url.pathname}`;

    let title, description;
    if (qt && qt.body != null) {
      const who = (qt.author && qt.author.display_name) || 'A friend';
      const ref = qt.verse_ref ? String(qt.verse_ref) : '';
      title = `${who} shared a reflection on devo`;
      if (INCLUDE_BODY_EXCERPT) {
        const excerpt = String(qt.body).replace(/\s+/g, ' ').slice(0, 140).trim();
        description = ref ? `${ref} — ${excerpt}…` : `${excerpt}…`;
      } else {
        description = ref
          ? `${ref}. Open to read ${who}'s reflection and keep your own with friends.`
          : `Open to read ${who}'s reflection and keep your own with friends.`;
      }
    } else {
      // Link expired or made private — a warm generic card, never a bare 404.
      title = 'A devotion shared with you · devo';
      description = 'This reflection link may be old or private. devo is a free app for keeping your Bible reflections with the people who matter.';
    }

    return new Response(ogHtml({ title, description, url: canonical }), {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        // Short cache so a fixed/expired share updates within the hour.
        'cache-control': 'public, max-age=900',
      },
    });
  },
};
