/* ============================================================
   DRAGON JIU-JITSU ACADEMY — motion
   GSAP + ScrollTrigger + Lenis smooth scroll.
   Degrades gracefully: no-JS / reduced-motion still fully usable.
   ============================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  var finePointer = window.matchMedia('(pointer:fine)').matches;

  /* =========================================================
     Always-on UI (works with or without motion)
     ========================================================= */
  var nav = document.querySelector('[data-nav]');
  var burger = document.querySelector('[data-burger]');
  var drawer = document.querySelector('[data-drawer]');
  var lenis = null; // set later if motion on

  function setDrawer(open) {
    if (!drawer || !nav || !burger) return;
    drawer.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) { open ? lenis.stop() : lenis.start(); }
  }
  if (burger) burger.addEventListener('click', function () { setDrawer(!drawer.classList.contains('open')); });
  document.querySelectorAll('[data-drawer-link]').forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });

  // Accordion
  var acc = document.querySelector('[data-acc]');
  if (acc) {
    var items = acc.querySelectorAll('.acc__item');
    items.forEach(function (item) {
      var head = item.querySelector('.acc__head');
      head.addEventListener('click', function () {
        var open = item.classList.contains('is-open');
        items.forEach(function (it) { it.classList.remove('is-open'); it.querySelector('.acc__head').setAttribute('aria-expanded', 'false'); });
        if (!open) { item.classList.add('is-open'); head.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  // Timetable tabs
  var tabs = document.querySelector('[data-tt-tabs]');
  var panels = document.querySelector('[data-tt-panels]');
  if (tabs && panels) {
    tabs.querySelectorAll('.tt__tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var d = tab.getAttribute('data-day');
        tabs.querySelectorAll('.tt__tab').forEach(function (t) { t.classList.toggle('is-active', t === tab); });
        panels.querySelectorAll('.tt__panel').forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-day-panel') === d); });
      });
    });
    var jsDay = new Date().getDay();
    if (jsDay >= 1 && jsDay <= 6) { var t = tabs.querySelector('.tt__tab[data-day="' + (jsDay - 1) + '"]'); if (t) t.click(); }
  }

  // Spotlight cards
  if (finePointer) {
    document.querySelectorAll('[data-spotlight]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // Trial form
  var form = document.querySelector('[data-trial-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.querySelector('[data-form-note]');
      var name = form.querySelector('#name'), email = form.querySelector('#email');
      if (!name.value.trim() || !email.value.trim()) { if (note) note.textContent = 'Add your name and a way to reach you and we’ll do the rest.'; return; }
      if (note) { note.classList.add('ok'); note.textContent = 'Nice one, ' + name.value.trim().split(' ')[0] + ' — we’ll be in touch within a day to book you in.'; }
      form.querySelector('button[type="submit"]').firstChild.textContent = 'Sent';
    });
  }

  // Footer year
  var yr = document.querySelector('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();

  // Count-up helper
  var stats = document.querySelectorAll('[data-count]');
  function runCount() {
    stats.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suf = el.getAttribute('data-suffix') || '';
      if (reduced || !hasGSAP) { el.textContent = target.toFixed(dec) + suf; return; }
      var o = { v: 0 };
      window.gsap.to(o, { v: target, duration: 1.6, ease: 'power2.out', onUpdate: function () { el.textContent = o.v.toFixed(dec) + suf; }, onComplete: function () { el.textContent = target.toFixed(dec) + suf; } });
    });
  }

  // Train state setter (shared)
  var tItems = document.querySelectorAll('[data-train]');
  var tPanels = document.querySelectorAll('[data-train-panel]');
  var tMedia = document.querySelectorAll('[data-train-media]');
  var tBar = document.querySelector('[data-train-bar]');
  var tCur = -1;
  function setTrain(i) {
    if (i === tCur) return; tCur = i;
    tItems.forEach(function (el) { el.classList.toggle('is-active', +el.getAttribute('data-train') === i); });
    tPanels.forEach(function (el) { el.classList.toggle('is-active', +el.getAttribute('data-train-panel') === i); });
    tMedia.forEach(function (el) { el.classList.toggle('is-active', +el.getAttribute('data-train-media') === i); });
  }
  tItems.forEach(function (el) { el.addEventListener('click', function () { setTrain(+el.getAttribute('data-train')); }); });

  /* =========================================================
     No motion path
     ========================================================= */
  if (reduced || !hasGSAP) {
    root.classList.add('motion-off');
    setTrain(0);
    runCount();
    // basic nav-scrolled toggle
    window.addEventListener('scroll', function () { if (nav) nav.classList.toggle('scrolled', window.scrollY > 30); }, { passive: true });
    return;
  }

  /* =========================================================
     Motion path — GSAP + Lenis
     ========================================================= */
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  root.classList.add('gsap-on');

  // Native scroll (crisp + precise). ScrollTrigger uses native scroll by default;
  // anchor links use CSS scroll-behavior:smooth + scroll-padding-top — no JS needed.
  window.addEventListener('scroll', function () { if (nav) nav.classList.toggle('scrolled', window.scrollY > 30); }, { passive: true });

  /* ---- HERO intro timeline (on load) ---- */
  gsap.set('.hero__title .w', { y: 44, filter: 'blur(10px)' });
  gsap.set(['.hero__eyebrow', '.hero__lede', '.hero__actions', '.hero__meta'], { y: 24 });
  gsap.set('.hero__scroll', { opacity: 0 });

  var htl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  htl.from('.hero__badge', { opacity: 0, scale: 0.55, rotation: -45, duration: 1.3, ease: 'power4.out' }, 0)
     .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0.3)
     .to('.hero__title .w', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.95, stagger: 0.08 }, 0.4)
     .to('.hero__lede', { opacity: 1, y: 0, duration: 0.7 }, 0.95)
     .to('.hero__actions', { opacity: 1, y: 0, duration: 0.7 }, 1.1)
     .to('.hero__meta', { opacity: 1, y: 0, duration: 0.7 }, 1.25)
     .to('.hero__scroll', { opacity: 1, duration: 0.6 }, 1.4);

  // gentle idle bob so the crest is alive at rest (doesn't touch rotation/scale)
  gsap.to('.hero__badge-img', { y: -16, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  /* ---- HERO: scroll drives the crest rotation + scale (Radian-style, no pin) ---- */
  var heroScrub = gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });
  heroScrub
    .to('.hero__badge-img', { rotation: 185, scale: 1.18, ease: 'none' }, 0)
    .to('.hero__badge', { yPercent: 26, ease: 'none' }, 0)
    .to('.hero__copy', { yPercent: -14, ease: 'none' }, 0)
    .to('.blob--1', { yPercent: 65, ease: 'none' }, 0)
    .to('.blob--2', { yPercent: -50, ease: 'none' }, 0);

  /* ---- Reveals / masks / image-scale: IntersectionObserver-driven (robust + jank-free) ---- */
  gsap.set('[data-reveal]', { opacity: 0, y: 30 });
  gsap.utils.toArray('[data-mask]').forEach(function (el) { gsap.set(el, { clipPath: 'inset(0 0 100% 0)', y: 24 }); });
  gsap.utils.toArray('[data-reveal-img]').forEach(function (el) { var im = el.querySelector('img'); if (im) gsap.set(im, { scale: 1.16 }); });

  function animateIn(el) {
    if (el.hasAttribute('data-mask')) {
      gsap.to(el, { clipPath: 'inset(-8% 0% -12% 0%)', y: 0, duration: 1.1, ease: 'power3.out' });
    } else if (el.hasAttribute('data-reveal-img')) {
      var im = el.querySelector('img'); if (im) gsap.to(im, { scale: 1, duration: 1.4, ease: 'power3.out' });
    } else {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
    }
  }
  var pending = new Set(gsap.utils.toArray('[data-reveal], [data-mask], [data-reveal-img]'));
  function reveal(el) { if (!pending.has(el)) return; pending.delete(el); animateIn(el); }
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); rio.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    pending.forEach(function (el) { rio.observe(el); });
    // debounced safety net: after scroll settles, reveal anything at/above the fold
    var settleT;
    function onSettle() {
      clearTimeout(settleT);
      settleT = setTimeout(function () {
        var vh = window.innerHeight;
        pending.forEach(function (el) { if (el.getBoundingClientRect().top < vh) reveal(el); });
      }, 140);
    }
    if (lenis) lenis.on('scroll', onSettle);
    window.addEventListener('scroll', onSettle, { passive: true });
    window.addEventListener('resize', onSettle);
    onSettle();
  } else {
    pending.forEach(animateIn);
  }

  /* ---- GALLERY: pinned horizontal scroll ---- */
  var galleryEl = document.querySelector('[data-gallery]');
  var galleryTrack = document.querySelector('[data-gallery-track]');
  if (galleryEl && galleryTrack && window.innerWidth > 767) {
    // CSS position:sticky holds the viewport; GSAP only translates the track (no pin) — anchors stay correct
    var dist = function () { return Math.max(0, galleryTrack.scrollWidth - window.innerWidth + 32); };
    gsap.to(galleryTrack, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: galleryEl, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true }
    });
  }

  /* ---- Marquee: base loop + scroll-velocity skew ---- */
  var mqTrack = document.querySelector('.marquee__track');
  if (mqTrack) {
    gsap.to(mqTrack, { xPercent: -33.333, ease: 'none', duration: 22, repeat: -1 });
    var skewTo = gsap.quickTo(mqTrack, 'skewX', { duration: 0.5, ease: 'power3' });
    ScrollTrigger.create({
      onUpdate: function (self) {
        var v = gsap.utils.clamp(-12, 12, self.getVelocity() / -260);
        skewTo(v);
      }
    });
  }

  /* ---- Story counters ---- */
  ScrollTrigger.create({ trigger: '.counters', start: 'top 85%', once: true, onEnter: runCount });

  /* ---- TRAIN sticky storytelling (scrubbed) ---- */
  var trainSection = document.getElementById('train');
  if (trainSection && tItems.length) {
    setTrain(0);
    ScrollTrigger.create({
      trigger: trainSection, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: function (self) {
        var n = tItems.length;
        var idx = Math.min(Math.floor(self.progress * n), n - 1);
        setTrain(idx);
        if (tBar) tBar.style.width = (self.progress * 100).toFixed(1) + '%';
      }
    });
    // subtle parallax on the active media wrapper
    gsap.to('.train__media', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: trainSection, start: 'top top', end: 'bottom bottom', scrub: true } });
  }

  /* ---- Banner parallax + scale ---- */
  gsap.to('.banner__media img', { yPercent: 14, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.banner', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---- Magnetic buttons ---- */
  if (finePointer) {
    document.querySelectorAll('.pill--lg').forEach(function (btn) {
      var xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
      var yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.5);
      });
      btn.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });
  }

  // Recalculate once everything (fonts/images) has settled
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  setTimeout(function () { ScrollTrigger.refresh(); }, 600);
})();
