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

  /* ---- HERO video: mirror the poster as a CSS background so the pill
     never looks empty if the video can't play at all ---- */
  var vheroInsetEl = document.querySelector('[data-vhero-inset]');
  var vheroVideoEl = document.querySelector('[data-vhero-video]');
  if (vheroInsetEl && vheroVideoEl && vheroVideoEl.poster) {
    vheroInsetEl.style.backgroundImage = 'url(' + vheroVideoEl.poster + ')';
  }
  // Self-contained builds (dist/artifact) stash the video as base64 data-*-b64
  // attributes instead of a data: URI directly on <source> — some browsers
  // fail to decode a data: URI video source reliably. Build a Blob URL from
  // it at runtime instead (still zero network requests).
  if (vheroVideoEl) {
    var webmB64 = vheroVideoEl.getAttribute('data-webm-b64');
    var mp4B64 = vheroVideoEl.getAttribute('data-mp4-b64');
    if (webmB64 || mp4B64) {
      try {
        var canWebm = vheroVideoEl.canPlayType && vheroVideoEl.canPlayType('video/webm; codecs="vp9"');
        var pick = (canWebm && webmB64) ? { b64: webmB64, mime: 'video/webm' } : { b64: mp4B64, mime: 'video/mp4' };
        var bin = atob(pick.b64);
        var bytes = new Uint8Array(bin.length);
        for (var bi = 0; bi < bin.length; bi++) bytes[bi] = bin.charCodeAt(bi);
        vheroVideoEl.src = URL.createObjectURL(new Blob([bytes], { type: pick.mime }));
      } catch (e) {}
    }
  }
  // Fail safe: if the video hasn't actually started playing shortly after,
  // hide it so the poster background (already set above) is what shows,
  // instead of a broken/blank box. Covers autoplay-policy, codec, or CSP
  // restrictions in whatever environment renders this page — we don't need
  // to know which one hit; we just need the hero to never look broken.
  if (vheroVideoEl) {
    var vheroVideoOk = false;
    vheroVideoEl.addEventListener('playing', function () { vheroVideoOk = true; });
    vheroVideoEl.addEventListener('error', function () { vheroVideoEl.style.display = 'none'; });
    setTimeout(function () {
      if (!vheroVideoOk && vheroVideoEl.readyState < 2) {
        vheroVideoEl.style.display = 'none';
      }
    }, 2500);
  }

  /* ---- HERO intro timeline (on load) ---- */
  gsap.set('.vhero__title .w', { y: 44, opacity: 0, filter: 'blur(10px)' });
  gsap.set(['.hero__eyebrow', '.vhero__lede', '.vhero__actions', '.hero__meta'], { y: 24, opacity: 0 });
  gsap.set('.hero__scroll', { opacity: 0 });

  var htl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  htl.from('.vhero__inset', { opacity: 0, duration: 1.1, ease: 'power4.out' }, 0)
     .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0.3)
     .to('.vhero__title .w', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.95, stagger: 0.08 }, 0.4)
     .to('.vhero__lede', { opacity: 1, y: 0, duration: 0.7 }, 0.95)
     .to('.vhero__actions', { opacity: 1, y: 0, duration: 0.7 }, 1.1)
     .to('.hero__meta', { opacity: 1, y: 0, duration: 0.7 }, 1.25)
     .to('.hero__scroll', { opacity: 1, duration: 0.6 }, 1.4);

  /* ---- HERO: scroll grows the clipped video pill until it covers the
     whole viewport edge-to-edge, then the section releases (ContainerInset-
     style). The "from" clip reads the CSS resting shape (so the responsive
     media-query values above stay the single source of truth) and animates
     toward inset(0) — true full-bleed, not just a bigger rounded box. ---- */
  var vheroTl = gsap.timeline({
    scrollTrigger: { trigger: '.vhero', start: 'top top', end: '62% top', scrub: 0.6, invalidateOnRefresh: true }
  });
  vheroTl
    .fromTo(vheroInsetEl,
      { clipPath: function () {
          var cs = getComputedStyle(vheroInsetEl);
          var v = cs.getPropertyValue('--vhero-pill').trim();
          var r = cs.getPropertyValue('--vhero-pill-r').trim();
          return 'inset(' + v + ' round ' + r + ')';
        } },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 }, 0)
    .to('.vhero__copy', { autoAlpha: 0, y: -30, ease: 'none' }, 0)
    .to('.vhero__actions', { autoAlpha: 0, y: -14, ease: 'none' }, 0.05)
    .to('.hero__meta', { autoAlpha: 0, y: -14, ease: 'none' }, 0.1)
    .to('.vhero__glow', { opacity: 0, ease: 'none' }, 0);

  /* ---- Split headings into masked words (the signature reveal) ---- */
  function splitWords(el) {
    if (el.dataset.split === 'done') return;
    var frag = document.createDocumentFragment();
    // walk child nodes so inline <span class="script"> keeps its styling
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (tok) {
          if (!tok.trim()) { if (tok) frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'sw';
          var inner = document.createElement('i'); inner.textContent = tok;
          w.appendChild(inner); frag.appendChild(w);
        });
      } else if (node.nodeType === 1) {
        if (node.tagName === 'BR') { frag.appendChild(node.cloneNode(true)); return; }
        var w = document.createElement('span'); w.className = 'sw';
        w.style.color = 'inherit';
        var inner = document.createElement('i');
        inner.appendChild(node.cloneNode(true));
        w.appendChild(inner); frag.appendChild(w);
      }
    });
    el.innerHTML = ''; el.appendChild(frag); el.dataset.split = 'done';
  }
  gsap.utils.toArray('[data-split]').forEach(function (el) {
    splitWords(el);
    gsap.set(el.querySelectorAll('.sw > i'), { yPercent: 115 });
  });

  /* ---- Reveals: IntersectionObserver-driven (robust + jank-free) ---- */
  gsap.set('[data-reveal]', { opacity: 0, y: 30 });
  gsap.utils.toArray('[data-stagger-group]').forEach(function (g) {
    gsap.set(g.children, { opacity: 0, y: 34 });
  });
  gsap.utils.toArray('[data-reveal-img]').forEach(function (el) { var im = el.querySelector('img'); if (im) gsap.set(im, { scale: 1.16 }); });

  function animateIn(el) {
    if (el.hasAttribute('data-split')) {
      gsap.to(el.querySelectorAll('.sw > i'), { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.045 });
    } else if (el.hasAttribute('data-stagger-group')) {
      gsap.to(el.children, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.09 });
    } else if (el.hasAttribute('data-reveal-img')) {
      var im = el.querySelector('img'); if (im) gsap.to(im, { scale: 1, duration: 1.4, ease: 'power3.out' });
    } else {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
    }
  }
  var pending = new Set(gsap.utils.toArray('[data-reveal], [data-split], [data-stagger-group], [data-reveal-img]'));
  function reveal(el) { if (!pending.has(el)) return; pending.delete(el); animateIn(el); }
  // hoisted so the resize/visibility refresh loop below can always call it safely
  var onSettle = function () {};
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); rio.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    pending.forEach(function (el) { rio.observe(el); });
    // debounced safety net: after scroll settles, reveal anything at/above the fold
    var settleT;
    onSettle = function () {
      clearTimeout(settleT);
      settleT = setTimeout(function () {
        var vh = window.innerHeight;
        pending.forEach(function (el) { if (el.getBoundingClientRect().top < vh) reveal(el); });
      }, 140);
    };
    if (lenis) lenis.on('scroll', onSettle);
    window.addEventListener('scroll', onSettle, { passive: true });
    window.addEventListener('resize', onSettle);
    onSettle();
  } else {
    pending.forEach(animateIn);
  }

  /* ---- GALLERY: horizontal scroll, driven 1:1 by scroll position ----
     CSS position:sticky holds the viewport in place; this only sets the
     track's translateX directly off scroll progress (no scrub/easing lag),
     so the row tracks the wheel exactly like the mouse does. */
  var galleryEl = document.querySelector('[data-gallery]');
  var galleryTrack = document.querySelector('[data-gallery-track]');
  // hoisted so the resize/visibility refresh loop below can always call it safely
  var updateGallery = function () {};
  if (galleryEl && galleryTrack) {
    var galleryActive = window.innerWidth > 767;
    var galleryTicking = false;
    updateGallery = function () {
      galleryTicking = false;
      if (!galleryActive) { galleryTrack.style.transform = ''; return; }
      var wrapperRect = galleryEl.getBoundingClientRect();
      var scrollableRange = galleryEl.offsetHeight - window.innerHeight;
      if (scrollableRange <= 0) return;
      var scrolled = -wrapperRect.top;
      var progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
      var maxOffset = Math.max(0, galleryTrack.scrollWidth - window.innerWidth + 32);
      galleryTrack.style.transform = 'translateX(-' + (progress * maxOffset) + 'px)';
    };
    var requestGalleryUpdate = function () {
      if (galleryTicking) return;
      galleryTicking = true;
      requestAnimationFrame(updateGallery);
    };
    var onGalleryResize = function () {
      galleryActive = window.innerWidth > 767;
      requestGalleryUpdate();
    };
    window.addEventListener('scroll', requestGalleryUpdate, { passive: true });
    window.addEventListener('resize', onGalleryResize);
    new ResizeObserver(requestGalleryUpdate).observe(galleryTrack);
    updateGallery();
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

  /* ---- Scroll progress bar ---- */
  var bar = document.querySelector('[data-progress]');
  if (bar) {
    gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.25 } });
  }

  /* ---- Floating CTA: appears once you're past the hero ---- */
  var fcta = document.querySelector('[data-floatcta]');
  if (fcta) {
    gsap.set(fcta, { y: 16, scale: 0.9, autoAlpha: 0 });
    ScrollTrigger.create({
      trigger: '.vhero', start: 'bottom 60%',
      onEnter: function () { fcta.setAttribute('aria-hidden', 'false'); fcta.removeAttribute('tabindex'); gsap.to(fcta, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }); },
      onLeaveBack: function () { fcta.setAttribute('aria-hidden', 'true'); fcta.setAttribute('tabindex', '-1'); gsap.to(fcta, { autoAlpha: 0, y: 16, scale: 0.9, duration: 0.35 }); }
    });
    // hide it once the real booking form is on screen
    ScrollTrigger.create({
      trigger: '#book', start: 'top 70%',
      onEnter: function () { gsap.to(fcta, { autoAlpha: 0, scale: 0.9, duration: 0.3 }); },
      onLeaveBack: function () { gsap.to(fcta, { autoAlpha: 1, scale: 1, duration: 0.3 }); }
    });
  }

  /* ---- In-frame image parallax: photo drifts inside its own mask ---- */
  gsap.utils.toArray('.coach__media, .train__media, .gcard').forEach(function (frame) {
    var im = frame.querySelector('img'); if (!im) return;
    gsap.fromTo(im, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ---- Gallery cards: lift + settle as the row travels ---- */
  gsap.utils.toArray('.gcard').forEach(function (card, i) {
    gsap.fromTo(card, { y: 40, rotate: i % 2 ? 1.2 : -1.2 }, {
      y: 0, rotate: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 92%' }
    });
  });

  /* ---- Card tilt on hover ---- */
  if (finePointer) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var rX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
      var rY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
      var yT = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3' });
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        rX(((e.clientY - r.top) / r.height - 0.5) * -10);
        rY(((e.clientX - r.left) / r.width - 0.5) * 10);
        yT(-6);
      });
      card.addEventListener('pointerleave', function () { rX(0); rY(0); yT(0); });
    });
  }

  /* ---- Timetable rows animate in when a day is switched ---- */
  if (panels) {
    var animateRows = function () {
      var active = panels.querySelector('.tt__panel.is-active');
      if (active) gsap.fromTo(active.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.06, overwrite: true });
    };
    if (tabs) tabs.querySelectorAll('.tt__tab').forEach(function (t) { t.addEventListener('click', animateRows); });
    ScrollTrigger.create({ trigger: '.tt__panels', start: 'top 85%', once: true, onEnter: animateRows });
  }

  // Recalculate once everything (fonts/images) has settled
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  setTimeout(function () { ScrollTrigger.refresh(); }, 600);

  /* ---- Robust re-measure loop ----
     Hosting embeds (e.g. an artifact iframe shown small first, then resized to
     full size once opened) can run this script before the real layout exists.
     Every ScrollTrigger start/end position, and our own gallery/reveal math,
     is measured in pixels and goes stale if that happens. Re-measure on any
     resize, when the tab/frame becomes visible, and a few times shortly after
     load to catch a late promotion to full size. */
  var lastW = window.innerWidth, lastH = window.innerHeight;
  var refreshT;
  function fullRefresh() {
    clearTimeout(refreshT);
    refreshT = setTimeout(function () {
      lastW = window.innerWidth; lastH = window.innerHeight;
      ScrollTrigger.refresh();
      onSettle();
      updateGallery();
    }, 120);
  }
  window.addEventListener('resize', function () {
    // ignore mobile browser chrome show/hide (height-only jitter under 100px)
    if (Math.abs(window.innerWidth - lastW) < 2 && Math.abs(window.innerHeight - lastH) < 100) return;
    fullRefresh();
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) fullRefresh(); });
  [400, 1200, 2500].forEach(function (ms) { setTimeout(fullRefresh, ms); });
})();
