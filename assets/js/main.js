/* ============================================================
   DRAGON JIU-JITSU ACADEMY — interactions
   Vanilla JS, no dependencies. GPU-friendly, respects reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero load stagger ---------- */
  var staggers = document.querySelectorAll('[data-stagger]');
  staggers.forEach(function (el, i) { el.style.animationDelay = (0.15 + i * 0.09) + 's'; });
  requestAnimationFrame(function () { document.body.classList.add('stagger-run'); });

  /* ---------- Reveal on scroll (incl. image reveals) ---------- */
  var reveals = document.querySelectorAll('[data-reveal], [data-reveal-img]');
  function showIfNear() {
    var vh = window.innerHeight;
    reveals.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92) el.classList.add('in');
    });
  }
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // Safety net: anything already in view on load reveals immediately,
    // and a scroll fallback guarantees nothing stays stuck hidden.
    showIfNear();
    window.addEventListener('scroll', showIfNear, { passive: true });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Nav scrolled + parallax (rAF) ---------- */
  var nav = document.querySelector('[data-nav]');
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  var ticking = false;
  function frame() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    if (!reduced) {
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.06;
        var off = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });
    }
    trainScroll();
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(frame); ticking = true; }
  }, { passive: true });

  /* ---------- Mobile drawer ---------- */
  var burger = document.querySelector('[data-burger]');
  var drawer = document.querySelector('[data-drawer]');
  function setDrawer(open) {
    if (!drawer || !nav || !burger) return;
    drawer.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { setDrawer(!drawer.classList.contains('open')); });
  document.querySelectorAll('[data-drawer-link]').forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });

  /* ---------- Count-up ---------- */
  var counted = false;
  var stats = document.querySelectorAll('[data-count]');
  function runCount() {
    if (counted) return; counted = true;
    stats.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suf = el.getAttribute('data-suffix') || '';
      if (reduced) { el.textContent = target.toFixed(dec) + suf; return; }
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / 1500, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(step); else el.textContent = target.toFixed(dec) + suf;
      }
      requestAnimationFrame(step);
    });
  }
  if ('IntersectionObserver' in window && stats.length) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { runCount(); so.disconnect(); } });
    }, { threshold: 0.4 });
    so.observe(stats[0]);
  } else { runCount(); }

  /* ---------- Cursor spotlight on cards ---------- */
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('[data-spotlight]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Programmes accordion ---------- */
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

  /* ---------- Timetable day tabs ---------- */
  var tabs = document.querySelector('[data-tt-tabs]');
  var panels = document.querySelector('[data-tt-panels]');
  if (tabs && panels) {
    tabs.querySelectorAll('.tt__tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var d = tab.getAttribute('data-day');
        tabs.querySelectorAll('.tt__tab').forEach(function (t) { t.classList.toggle('is-active', t === tab); });
        panels.querySelectorAll('.tt__panel').forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-day-panel') === d);
        });
      });
    });
    // default to today's column if it's a training day (Mon=0..Sat=5)
    var jsDay = new Date().getDay(); // 0 Sun .. 6 Sat
    if (jsDay >= 1 && jsDay <= 6) {
      var idx = jsDay - 1;
      var t = tabs.querySelector('.tt__tab[data-day="' + idx + '"]');
      if (t) t.click();
    }
  }

  /* ---------- TRAIN sticky storytelling ---------- */
  var trainSection = document.getElementById('train');
  var tItems = document.querySelectorAll('[data-train]');
  var tPanels = document.querySelectorAll('[data-train-panel]');
  var tMedia = document.querySelectorAll('[data-train-media]');
  var tBar = document.querySelector('[data-train-bar]');
  var tCur = -1;
  function setTrain(i, prog) {
    if (tBar) tBar.style.width = Math.round(prog * 100) + '%';
    if (i === tCur) return; tCur = i;
    tItems.forEach(function (el) { el.classList.toggle('is-active', +el.getAttribute('data-train') === i); });
    tPanels.forEach(function (el) { el.classList.toggle('is-active', +el.getAttribute('data-train-panel') === i); });
    tMedia.forEach(function (el) { el.classList.toggle('is-active', +el.getAttribute('data-train-media') === i); });
  }
  function trainScroll() {
    if (!trainSection || !tItems.length) return;
    var rect = trainSection.getBoundingClientRect();
    var total = trainSection.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    var progress = Math.min(Math.max(-rect.top / total, 0), 0.9999);
    var idx = Math.min(Math.floor(progress * tItems.length), tItems.length - 1);
    setTrain(idx, progress);
  }
  tItems.forEach(function (el) { el.addEventListener('click', function () { setTrain(+el.getAttribute('data-train'), tCur >= 0 ? 0 : 0); }); });
  setTrain(0, 0);

  /* ---------- Trial form ---------- */
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

  /* ---------- Footer year ---------- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  frame();
})();
