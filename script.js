/* ============================================================
   Parkgate Coffee — interactions
   - page loader
   - sticky nav + mobile menu
   - scroll reveal (IntersectionObserver)
   - lazy background images
   - subtle parallax on hero glow
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Loader ---------- */
  const loader = document.getElementById("loader");
  function hideLoader() {
    if (loader) loader.classList.add("is-done");
    document.body.style.overflow = "";
  }
  document.body.style.overflow = "hidden";
  window.addEventListener("load", () => setTimeout(hideLoader, 650));
  // Safety net in case `load` is delayed by slow images
  setTimeout(hideLoader, 3500);

  /* ---------- Lazy background images ---------- */
  const lazyEls = document.querySelectorAll("[data-img]");
  const loadImg = (el) => {
    const url = el.getAttribute("data-img");
    if (!url) return;
    const pre = new Image();
    pre.onload = () => {
      el.style.backgroundImage = `url("${url}")`;
      el.style.transition = "opacity .7s ease";
    };
    pre.src = url;
    el.removeAttribute("data-img");
  };

  if ("IntersectionObserver" in window) {
    const imgObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { loadImg(e.target); obs.unobserve(e.target); }
      });
    }, { rootMargin: "200px" });
    lazyEls.forEach((el) => imgObs.observe(el));
  } else {
    lazyEls.forEach(loadImg);
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); observer.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => obs.observe(el));
  }

  /* ---------- Sticky nav ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add("is-stuck");
    else nav.classList.remove("is-stuck");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const closeMenu = () => {
    links.classList.remove("is-open");
    nav.classList.remove("is-menu-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    nav.classList.toggle("is-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";   // lock scroll behind drawer
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 760) closeMenu(); });

  /* ---------- Hero glow parallax ---------- */
  const glow = document.querySelector(".hero__glow");
  if (glow && !prefersReduced) {
    let raf = null;
    window.addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) glow.style.transform = `translateY(${y * 0.18}px)`;
        raf = null;
      });
    }, { passive: true });
  }

  /* ---------- Hero cup card: 3D tilt ---------- */
  const tiltCard = document.querySelector("[data-tilt-card]");
  const hero = document.getElementById("home");
  const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clampN = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  if (tiltCard && hero && !prefersReduced && hasHover) {
    /* Desktop: rests flat, leans toward the cursor */
    const baseX = 0, baseY = 0;
    const apply = (rx, ry) => {
      tiltCard.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    let raf = null, nextRx = baseX, nextRy = baseY;
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 … 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      nextRx = baseX - py * 10;
      nextRy = baseY + px * 14;
      tiltCard.style.transition = "none";                // track the cursor live
      if (raf) return;
      raf = requestAnimationFrame(() => { apply(nextRx, nextRy); raf = null; });
    });
    hero.addEventListener("mouseleave", () => {
      tiltCard.style.transition = "";                    // smooth ease back to rest
      apply(baseX, baseY);
    });
  } else if (tiltCard && hero && !prefersReduced) {
    /* Touch (no pointer): gentle scroll-driven tilt — flattens as it nears centre */
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = tiltCard.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const fromCentre = (r.top + r.height / 2 - vh / 2) / (vh / 2); // -1 … 1
        const rx = clampN(fromCentre * 9, -6, 9);
        tiltCard.style.transform = `perspective(1200px) rotateX(${rx}deg)`;
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
