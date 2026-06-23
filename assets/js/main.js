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

  /* ---------- Scroll-driven video stage ----------
     Vanilla recreation of the animated-video-on-scroll component.
     Maps scroll progress over the tall track (offset "start center"
     → "end end") onto: video scale, clip-path inset/roundedness,
     and copy/CTA translate + fade. */
  const svTrack = document.querySelector("[data-scrollvid]");
  if (svTrack) {
    const svInset = svTrack.querySelector("[data-sv-inset]");
    const svVideo = svTrack.querySelector("[data-sv-video]");
    const svCopy = svTrack.querySelector("[data-sv-copy]");
    const svCta = svTrack.querySelector("[data-sv-cta]");
    const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
    const lerp = (a, b, t) => a + (b - a) * t;

    if (prefersReduced) {
      // Resolve straight to the final, fully-revealed state.
      if (svVideo) svVideo.style.transform = "scale(1)";
      if (svInset) svInset.style.clipPath = "inset(0% 0% 0% 0% round 16px)";
      [svCopy, svCta].forEach((el) => { if (el) { el.style.transform = "none"; el.style.opacity = "1"; } });
    } else {
      let svTicking = false;
      const svUpdate = () => {
        const rect = svTrack.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.5;          // rect.top at progress 0  ("start center")
        const end = vh - rect.height;    // rect.top at progress 1  ("end end")
        const progress = clamp((start - rect.top) / (start - end), 0, 1);

        const t08 = clamp(progress / 0.8, 0, 1);

        // Video scale 0.7 -> 1 over [0, 0.8]
        if (svVideo) svVideo.style.transform = `scale(${lerp(0.7, 1, t08).toFixed(3)})`;

        // Clip-path: inset 45% -> 0% over [0, 0.8]; roundedness 1000 -> 16 over [0, 1]
        if (svInset) {
          const inset = lerp(45, 0, t08).toFixed(2);
          const round = lerp(1000, 16, progress).toFixed(1);
          svInset.style.clipPath = `inset(${inset}% ${inset}% ${inset}% ${inset}% round ${round}px)`;
        }

        // Copy: translateY 80 -> 0 over [0.2, 0.8], fading in
        if (svCopy) {
          const tc = clamp((progress - 0.2) / 0.6, 0, 1);
          svCopy.style.transform = `translateY(${lerp(80, 0, tc).toFixed(1)}px)`;
          svCopy.style.opacity = clamp(0.2 + tc, 0, 1).toFixed(2);
        }

        // CTA: translateY -120 -> 0 over [0, 0.7], slightly delayed fade
        if (svCta) {
          const tb = clamp(progress / 0.7, 0, 1);
          svCta.style.transform = `translateY(${lerp(-120, 0, tb).toFixed(1)}px)`;
          svCta.style.opacity = clamp((progress - 0.1) / 0.5, 0, 1).toFixed(2);
        }

        svTicking = false;
      };
      const svRequest = () => { if (!svTicking) { window.requestAnimationFrame(svUpdate); svTicking = true; } };
      window.addEventListener("scroll", svRequest, { passive: true });
      window.addEventListener("resize", svRequest);
      svUpdate();
    }
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
