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

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
