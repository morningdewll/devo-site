/* Homepage motion (GSAP, vendored at assets/js/gsap.min.js — v3.15.0, free
   standard license). Design intent: paper settling on a desk, not tech. Small
   distances, soft eases, nothing loops except the locked card's idle float.

   Hard rules this file keeps:
   - prefers-reduced-motion: bail before touching a single style.
   - Invite links (?ref= / ?g=): the referral script owns the screen — bail.
   - Content must never be hidden without JS: initial hidden states are set
     here at runtime, so no-JS visitors and crawlers get the static page.
   - GSAP writes inline transforms every frame; elements with a CSS
     `transition: transform` (the .qt-card pair) get transition:none while a
     tween runs, restored via clearProps when it settles. Reveal items get the
     same guard; .learn-links animates the <li>, so the <a>'s own hover
     transition is never touched.
   - Deliberate non-fix: on a throttled connection the page can paint once
     before these scripts run, so reveals may briefly show-then-fade. The
     alternative (CSS pre-hide behind a .js class) turns a failed gsap fetch
     into hidden content on a conversion page — fail-safe beats flash-free. */
(function () {
  'use strict';

  if (!window.gsap || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('ref') || params.get('g')) return;
  } catch (e) { /* very old browser — let it animate */ }

  var gsap = window.gsap;

  /* ── Hero entrance: copy rises, cards laid on the desk one after the other.
     Cards keep their CSS tilt: GSAP reads rotate(var(--tilt)) out of the
     computed matrix, so relative rotation offsets settle back onto it. */
  var unlocked = document.querySelector('.qt-card--unlocked');
  var locked = document.querySelector('.qt-card--locked');
  gsap.set([unlocked, locked], { transition: 'none' });

  var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  /* h1 is the LCP element — it rises but never fades, so LCP timing is
     untouched by the entrance. */
  tl.from('.hero-copy h1', { y: 16, duration: 0.7, clearProps: 'all' }, 0)
    .from('.hero-copy > *:not(h1)', { y: 16, opacity: 0, duration: 0.7, stagger: 0.09, clearProps: 'all' }, 0.09)
    .from('.coffee-ring', { opacity: 0, duration: 1.1, clearProps: 'all' }, 0.15)
    .from(unlocked, { y: 26, opacity: 0, rotation: '-=2.5', duration: 0.8, ease: 'power3.out', clearProps: 'all' }, 0.35)
    .from(locked, { y: 22, opacity: 0, rotation: '+=2', duration: 0.8, ease: 'power3.out' }, 0.55)
    .from('.hero-note', { y: 8, opacity: 0, duration: 0.6, clearProps: 'all' }, 1.0)
    /* Locked card idles: it's the thing on the desk you haven't opened yet.
       Keeps its inline transform (and transition:none) for the float's sake —
       the hover un-tilt is deliberately traded away on this one card. The
       float pauses while the hero is off-screen so an infinite tween doesn't
       keep rAF busy for the life of the page. */
    .call(function () {
      var float = gsap.to(locked, { y: '+=4', rotation: '+=0.4', duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true });
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { float.play(); } else { float.pause(); }
      }).observe(locked);
    }, null, 1.5);

  /* ── Scroll reveals: one observer, per-item. A batch of entries arriving in
     the same callback (desktop: a whole section enters at once) staggers by
     DOM order; on mobile items arrive one by one and the scroll is the
     stagger. Reveal once, then unobserve. */
  var REVEAL = [
    '.why h2', '.notes-row .paper-note', '.definition',
    '.how h2', '.how-sub', '.chip', '.passage-chips .annotation--sage',
    '.flow-arrow', '.unlock-stack .paper-note', '.unlock-stack .annotation',
    '.tree-wrap img', '.tree-copy h2', '.tree-copy p',
    '.band-inner h2', '.band-inner p',
    '.fact',
    '.faq-home h2', '.faq-item', '.faq-more',
    '.learn h2', '.learn-links li',
    '.ticket'
  ].join(', ');

  var items = Array.prototype.slice.call(document.querySelectorAll(REVEAL));
  var TREE = document.querySelector('.tree-wrap img');

  gsap.set(items, { opacity: 0, y: 14, transition: 'none' });
  if (TREE) gsap.set(TREE, { scale: 0.96, transformOrigin: '50% 100%' });

  var io = new IntersectionObserver(function (entries) {
    var seen = entries.filter(function (e) { return e.isIntersecting; })
      .sort(function (a, b) {
        return (a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
      });
    seen.forEach(function (entry, i) {
      io.unobserve(entry.target);
      gsap.to(entry.target, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: entry.target === TREE ? 0.9 : 0.65,
        delay: i * 0.07,
        ease: 'power2.out',
        clearProps: 'all'
      });
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });

  items.forEach(function (el) { io.observe(el); });
})();
