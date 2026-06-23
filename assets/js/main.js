/* =========================================================
   Buttermilk — interactions
   Lightweight, dependency-free, mobile-friendly.
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Page loader ---------- */
  window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    if (loader) setTimeout(() => loader.classList.add("is-done"), 450);
  });

  /* ---------- Sticky nav state ---------- */
  const nav = document.getElementById("nav");
  const toTop = document.getElementById("toTop");
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("is-scrolled", y > 40);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const closeMenu = () => {
    toggle.classList.remove("is-open");
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.dataset.delay || "0", 10);
            setTimeout(() => el.classList.add("is-in"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Menu tabs ---------- */
  const tabs = document.querySelectorAll(".menu__tab");
  const panels = document.querySelectorAll(".menu__panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === target));
    });
  });

  /* ---------- Parallax (rAF-throttled) ---------- */
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if (!prefersReduced && parallaxEls.length) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    const requestTick = () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    };
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
    update();
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
