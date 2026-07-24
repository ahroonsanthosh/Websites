/* ============================================================
   DRAGON JIU-JITSU ACADEMY — interactions
   Vanilla JS. Zero dependencies. GPU-friendly (transform/opacity).
   Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  reveals.forEach(function (el) {
    var d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--d', d);
  });

  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Nav: scrolled state ---------- */
  var nav = document.querySelector('[data-nav]');
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 40);
        parallax();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Hero parallax ---------- */
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  function parallax() {
    if (reduced) return;
    var y = window.scrollY;
    if (y > window.innerHeight * 1.2) return; // only near hero
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      el.style.transform = 'translate3d(0,' + (y * speed) + 'px,0)';
    });
  }

  /* ---------- Mobile drawer ---------- */
  var burger = document.querySelector('[data-burger]');
  var drawer = document.querySelector('[data-drawer]');
  function setDrawer(open) {
    if (!drawer || !nav || !burger) return;
    drawer.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () {
      setDrawer(!drawer.classList.contains('is-open'));
    });
  }
  document.querySelectorAll('[data-drawer-link]').forEach(function (a) {
    a.addEventListener('click', function () { setDrawer(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setDrawer(false);
  });

  /* ---------- Count-up stats ---------- */
  var counted = false;
  var stats = document.querySelectorAll('[data-count]');
  function runCount() {
    if (counted) return; counted = true;
    stats.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduced) { el.textContent = target.toFixed(decimals) + suffix; return; }
      var start = null, dur = 1500;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    });
  }
  if ('IntersectionObserver' in window && stats.length) {
    var statObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCount(); statObs.disconnect(); } });
    }, { threshold: 0.4 });
    statObs.observe(stats[0].closest('.about__stats') || stats[0]);
  } else { runCount(); }

  /* ---------- WHY: sticky scroll storytelling ---------- */
  var whySection = document.getElementById('why');
  var whyItems = document.querySelectorAll('[data-why]');
  var whyPanels = document.querySelectorAll('[data-why-panel]');
  var whyMedia = document.querySelectorAll('[data-why-media]');
  var whyCurrent = -1;

  function setWhy(i) {
    if (i === whyCurrent) return;
    whyCurrent = i;
    whyItems.forEach(function (el) { el.classList.toggle('is-active', +el.getAttribute('data-why') === i); });
    whyPanels.forEach(function (el) { el.classList.toggle('is-active', +el.getAttribute('data-why-panel') === i); });
    whyMedia.forEach(function (el) { el.classList.toggle('is-active', +el.getAttribute('data-why-media') === i); });
  }
  setWhy(0);

  function whyScroll() {
    if (!whySection) return;
    var rect = whySection.getBoundingClientRect();
    var total = whySection.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    var progress = Math.min(Math.max(-rect.top / total, 0), 0.999);
    var idx = Math.floor(progress * whyItems.length);
    setWhy(Math.min(idx, whyItems.length - 1));
  }
  if (whySection && whyItems.length) {
    window.addEventListener('scroll', function () {
      window.requestAnimationFrame(whyScroll);
    }, { passive: true });
    whyScroll();
  }
  // Allow tapping the list items to jump
  whyItems.forEach(function (el) {
    el.addEventListener('click', function () { setWhy(+el.getAttribute('data-why')); });
  });

  /* ---------- Trial form (front-end only) ---------- */
  var form = document.querySelector('[data-trial-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('[data-form-note]');
      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      if (!name.value.trim() || !email.value.trim()) {
        if (note) note.textContent = 'Please add your name and a way to reach you.';
        return;
      }
      if (note) {
        note.classList.add('is-success');
        note.textContent = 'Nice one, ' + name.value.trim().split(' ')[0] + '! We’ll be in touch within a day to book you in.';
      }
      form.querySelector('button[type="submit"]').textContent = 'Sent ✓';
    });
  }

  /* ---------- Footer year ---------- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  // initial paint
  onScroll();
})();
