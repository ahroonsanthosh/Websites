/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ── MOBILE NAV ── */
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  navLinks.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

/* ── HERO IMAGE PARALLAX + LOAD ── */
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  heroImg.addEventListener('load', () => heroImg.classList.add('loaded'), { once: true });
  if (heroImg.complete) heroImg.classList.add('loaded');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.5) {
      heroImg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
    }
  }, { passive: true });
}

/* ── REVEAL ON SCROLL ── */
const revealEls = document.querySelectorAll(
  '.reveal-fade, .reveal-up, .reveal-left, .reveal-right'
);
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.setAttribute('data-revealed', '');
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);
revealEls.forEach(el => revealObs.observe(el));

/* ── MENU TABS ── */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.menu-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});

/* ── CONTACT FORM ── */
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      form.reset();
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1200);
  });
}

/* ── SMOOTH ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const activeObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--cream)' : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => activeObs.observe(s));
