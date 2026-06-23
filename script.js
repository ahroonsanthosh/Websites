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
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    nav.classList.toggle("is-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

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

  /* ---------- Scroll-tilt showcase ---------- */
  const tiltCard = document.querySelector("[data-tilt-card]");
  const tiltScope = document.querySelector(".showcase__inner");
  if (tiltCard && tiltScope && !prefersReduced) {
    const isMobile = () => window.innerWidth <= 768;
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const lerp = (a, b, t) => a + (b - a) * t;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = tiltScope.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 as the section enters (top at 85% vh) → 1 as it settles (top at 15% vh)
      const p = clamp((vh * 0.85 - rect.top) / (vh * 0.7));

      const rotate = lerp(20, 0, p);
      const scale = isMobile() ? lerp(0.7, 0.9, p) : lerp(1.05, 1, p);

      tiltCard.style.transform =
        `perspective(1200px) rotateX(${rotate}deg) scale(${scale})`;
    };

    const onTiltScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    // Only listen while the section is near the viewport
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.addEventListener("scroll", onTiltScroll, { passive: true });
            update();
          } else {
            window.removeEventListener("scroll", onTiltScroll);
          }
        });
      }, { rootMargin: "100px" });
      io.observe(tiltScope);
    } else {
      window.addEventListener("scroll", onTiltScroll, { passive: true });
    }
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
