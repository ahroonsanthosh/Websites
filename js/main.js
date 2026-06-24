/* =========================================================
   Wild Café — interactions
   Vanilla JS · no dependencies · reduced-motion aware
   ========================================================= */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (!loader) return;
    setTimeout(() => loader.classList.add('is-done'), prefersReduced ? 0 : 700);
    // kick the hero line animation
    requestAnimationFrame(() => $('#hero')?.classList.add('is-in'));
  });
  // Fallback in case 'load' already fired / is slow
  setTimeout(() => { $('#loader')?.classList.add('is-done'); $('#hero')?.classList.add('is-in'); }, 2600);

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: sticky + mobile toggle ---------- */
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const navLinks = $('#navLinks');

  const onScroll = () => {
    nav.classList.toggle('is-stuck', window.scrollY > 40);
    // progress bar
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? h.scrollTop / max : 0;
    const bar = $('#scrollProgress');
    if (bar) bar.style.transform = `scaleX(${p})`;
    // back to top
    $('#toTop')?.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const closeNav = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  $('#toTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));

  /* ---------- Scroll reveals ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Number(el.dataset.revealDelay || 0);
          setTimeout(() => el.classList.add('is-in'), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Hero parallax ---------- */
  const parallaxImg = $('.hero__media img');
  if (parallaxImg && !prefersReduced) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY * 0.22;
        parallaxImg.style.transform = `translate3d(0, ${y}px, 0)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Stat counters ---------- */
  const counters = $$('[data-count]');
  const runCounter = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    if (prefersReduced) { el.textContent = prefix + target + suffix; return; }
    const dur = 1400; const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  } else counters.forEach(runCounter);

  /* ---------- Menu tabs ---------- */
  const tabs = $$('.menu__tab');
  const panels = $$('.menu__panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.tab;
      tabs.forEach(t => { const on = t === tab; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === key));
    });
  });

  /* ---------- Opening hours: live open/closed ---------- */
  // day index 0=Sun … 6=Sat  ->  [openMinutes, closeMinutes] or null
  const HOURS = {
    0: [11 * 60, 17 * 60],   // Sunday 11:00–17:00
    1: [8 * 60, 18 * 60],
    2: [8 * 60, 18 * 60],
    3: [8 * 60, 18 * 60],
    4: [8 * 60, 18 * 60],
    5: [8 * 60, 18 * 60],
    6: [8 * 60, 18 * 60],
  };
  const statusEl = $('#hoursStatus');
  const fmt = (m) => {
    const h = Math.floor(m / 60), mm = m % 60;
    const ampm = h >= 12 ? 'pm' : 'am';
    const hr = ((h + 11) % 12) + 1;
    return `${hr}${mm ? ':' + String(mm).padStart(2, '0') : ''}${ampm}`;
  };
  if (statusEl) {
    const now = new Date();
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const today = HOURS[day];
    let open = false, msg = '';
    if (today && mins >= today[0] && mins < today[1]) {
      open = true;
      msg = `Open now · until ${fmt(today[1])}`;
    } else {
      // find next opening
      let probe = day, addDays = 0;
      if (today && mins < today[0]) {
        msg = `Closed · opens today at ${fmt(today[0])}`;
      } else {
        for (let i = 1; i <= 7; i++) {
          const d = (day + i) % 7;
          if (HOURS[d]) { addDays = i; probe = d; break; }
        }
        const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const when = addDays === 1 ? 'tomorrow' : names[probe];
        msg = `Closed · opens ${when} at ${fmt(HOURS[probe][0])}`;
      }
    }
    statusEl.textContent = msg;
    statusEl.classList.add(open ? 'is-open' : 'is-closed');

    // highlight today's row
    const row = $(`#hoursList li[data-day="${day}"]`);
    row?.classList.add('is-today');
  }

  /* ---------- Reservation form ---------- */
  const form = $('#reserveForm');
  if (form) {
    // sensible min date = today
    const dateEl = $('#date', form);
    if (dateEl) dateEl.min = new Date().toISOString().split('T')[0];

    const showError = (name, message) => {
      const field = form.querySelector(`[name="${name}"]`)?.closest('.field');
      const errEl = form.querySelector(`[data-error-for="${name}"]`);
      if (field) field.classList.toggle('has-error', Boolean(message));
      if (errEl) errEl.textContent = message || '';
    };
    const validators = {
      name: v => v.trim().length >= 2 || 'Please enter your name.',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
      date: v => Boolean(v) || 'Pick a date.',
      time: v => Boolean(v) || 'Pick a time.',
      guests: v => Boolean(v) || 'How many guests?',
    };

    Object.keys(validators).forEach(name => {
      const input = form.querySelector(`[name="${name}"]`);
      input?.addEventListener('blur', () => {
        const res = validators[name](input.value);
        showError(name, res === true ? '' : res);
      });
      input?.addEventListener('input', () => {
        if (input.closest('.field').classList.contains('has-error')) {
          const res = validators[name](input.value);
          showError(name, res === true ? '' : res);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      Object.keys(validators).forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        const res = validators[name](input.value);
        if (res !== true) { showError(name, res); ok = false; }
        else showError(name, '');
      });
      if (!ok) {
        form.querySelector('.has-error input, .has-error select')?.focus();
        return;
      }
      // Front-end only: surface success. Wire to a backend / email service when ready.
      const success = $('#reserveSuccess');
      form.querySelectorAll('input, select, textarea, button').forEach(el => el.disabled = true);
      if (success) { success.hidden = false; success.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' }); }
    });
  }
})();
