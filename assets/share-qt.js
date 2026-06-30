/*
 * share-qt.js — renders a single shared devotion at devo.fyi/qt/<id>.
 *
 * GitHub Pages is static and has no server rewrites, so a request for the
 * path form /qt/<uuid> is served by 404.html. This script runs there: if the
 * path is a /qt/<uuid> link it swaps the not-found content for the shared
 * devotion, fetched anon via the get_public_qt RPC (only returns rows whose
 * is_public = true; never enumerable, content columns only). Users who have
 * the app never reach this page — the Universal Link opens the app instead.
 *
 * No framework, no bundler (site rule). All author/body text is written with
 * textContent, never innerHTML, so a devotion can never inject markup.
 */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://eecsgizepwkkudmgdesr.supabase.co';
  // Publishable (anon) key — public by design, same class of key shipped in
  // the mobile app. Only grants what RLS + the RPC allow.
  var PUBLISHABLE_KEY = 'sb_publishable_8hC9PlCh3rC9LS0zSNPiPQ_bLyDy6sU';

  var APP_STORE = 'https://apps.apple.com/us/app/devo-quiet-time/id6768868360';
  var PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.morningdewll.devo';

  // Extract the qt id from /qt/<uuid> (optional trailing slash). Returns the
  // uuid string or null. Exported for testing if a harness is ever added.
  function parseQtId(pathname) {
    var m = /^\/qt\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/?$/.exec(
      pathname || ''
    );
    return m ? m[1] : null;
  }

  function storeUrl() {
    var ua = navigator.userAgent || '';
    var isAndroid = /Android/.test(ua);
    return isAndroid ? PLAY_STORE : APP_STORE;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text; // text only — never innerHTML
    return node;
  }

  function getCta() {
    var ticket = el('div', 'ticket');
    var left = el('div');
    left.appendChild(el('h2', null, 'Keep your own with friends.'));
    left.appendChild(
      el('p', null, 'devo is a free app for sharing your Bible reflections with the people who matter.')
    );
    ticket.appendChild(left);
    var btn = el('a', 'btn-primary', 'Get devo');
    btn.setAttribute('href', storeUrl());
    ticket.appendChild(btn);
    return ticket;
  }

  function renderDevotion(root, qt) {
    var wrap = el('div', 'wrap share-wrap');

    wrap.appendChild(el('p', 'annotation share-kicker', 'A devotion shared with you'));

    var card = el('article', 'qt-card qt-card--unlocked share-card');
    var who = (qt.author && qt.author.display_name) ? qt.author.display_name : 'A friend';
    card.appendChild(el('p', 'qt-author', who));
    if (qt.verse_ref) card.appendChild(el('p', 'verse-ref', qt.verse_ref));
    if (qt.body) card.appendChild(el('p', 'qt-body', qt.body));
    if (qt.has_image) {
      card.appendChild(el('p', 'share-photo-note', 'There is a photo with this reflection. Open it in the devo app.'));
    }
    wrap.appendChild(card);

    wrap.appendChild(getCta());
    root.appendChild(wrap);
    document.title = who + ' on devo';
  }

  function renderUnavailable(root) {
    var wrap = el('div', 'wrap share-wrap');
    var card = el('article', 'qt-card qt-card--unlocked share-card');
    card.appendChild(el('p', 'qt-author', 'This devotion is not available'));
    card.appendChild(
      el('p', 'qt-body', 'The link may be old, or the author made it private. Nothing was lost.')
    );
    wrap.appendChild(card);
    wrap.appendChild(getCta());
    root.appendChild(wrap);
    document.title = 'devo';
  }

  function fetchQt(id) {
    return fetch(SUPABASE_URL + '/rest/v1/rpc/get_public_qt', {
      method: 'POST',
      headers: {
        apikey: PUBLISHABLE_KEY,
        Authorization: 'Bearer ' + PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_qt_id: id }),
    }).then(function (res) {
      if (!res.ok) return null;
      return res.json();
    });
  }

  // Public entry: returns true if it handled a /qt/<id> path, false otherwise
  // (so 404.html can leave its normal not-found content in place).
  function boot() {
    var id = parseQtId(window.location.pathname);
    if (!id) return false;

    var host = document.getElementById('main');
    if (!host) return false;
    // Clear the not-found markup; we own this surface now.
    while (host.firstChild) host.removeChild(host.firstChild);

    var loading = el('div', 'wrap share-wrap');
    loading.appendChild(el('p', 'annotation', 'Opening a devotion'));
    host.appendChild(loading);

    fetchQt(id)
      .then(function (qt) {
        host.removeChild(loading);
        if (qt && qt.body != null) {
          renderDevotion(host, qt);
        } else {
          renderUnavailable(host);
        }
      })
      .catch(function () {
        if (loading.parentNode) host.removeChild(loading);
        renderUnavailable(host);
      });

    return true;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseQtId: parseQtId };
  } else {
    window.__devoShareQt = { boot: boot, parseQtId: parseQtId };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }
})();
