/* =========================================================
   Buttermilk — interactions (vanilla, dependency-free)
   ========================================================= */
(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- Loader ---------- */
  window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    if (loader) setTimeout(() => loader.classList.add("is-done"), 420);
    if (tabInd) positionIndicator(); // fonts loaded → tabs are final width
  });

  /* ---------- Reveal engine ---------- */
  const revealEls = document.querySelectorAll('[data-reveal], .reveal-mask, .reveal-img, [data-stagger]');
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || "0", 10);
        // stagger children
        if (el.hasAttribute("data-stagger")) {
          Array.from(el.children).forEach((child, i) => {
            child.style.transitionDelay = (delay + i * 80) + "ms";
          });
        } else if (delay) {
          el.style.transitionDelay = delay + "ms";
        }
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Mobile nav (Esc to close, focus return, scroll lock) ---------- */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const setMenu = (open) => {
    links.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (toggle && links) {
    toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && links.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });
  }

  /* ---------- Menu tabs: sliding indicator + ARIA keyboard ---------- */
  const tablist = document.getElementById("menuTabs");
  const tabInd = document.getElementById("tabInd");
  const tabs = tablist ? Array.from(tablist.querySelectorAll(".menu__tab")) : [];
  const panels = document.querySelectorAll(".menu__panel");

  function positionIndicator() {
    const active = tablist.querySelector(".menu__tab.is-active");
    if (!active || !tabInd) return;
    tabInd.style.width = active.offsetWidth + "px";
    tabInd.style.transform = `translateX(${active.offsetLeft}px)`;
  }
  function selectTab(tab, focus) {
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
    });
    panels.forEach((p) => {
      const show = p.dataset.panel === tab.dataset.tab;
      p.classList.toggle("is-active", show);
      p.hidden = !show;
    });
    positionIndicator();
    if (focus) tab.focus();
  }
  if (tabs.length) {
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => selectTab(tab));
      tab.addEventListener("keydown", (e) => {
        let idx = null;
        if (e.key === "ArrowRight") idx = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft") idx = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") idx = 0;
        else if (e.key === "End") idx = tabs.length - 1;
        if (idx !== null) { e.preventDefault(); selectTab(tabs[idx], true); tabs[idx].scrollIntoView({ inline: "center", block: "nearest" }); }
      });
    });
    positionIndicator();
    window.addEventListener("resize", positionIndicator);
    tablist.addEventListener("scroll", positionIndicator, { passive: true });
  }

  /* ---------- Magnetic buttons (desktop only) ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.3;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Scrollspy: current nav link ---------- */
  const navLinkEls = Array.from(document.querySelectorAll("[data-navlink]"));
  const sections = navLinkEls.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = "#" + entry.target.id;
        navLinkEls.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Scroll-expanding video hero ---------- */
  const svTrack = document.querySelector("[data-scrollvid]");
  const svInset = svTrack && svTrack.querySelector("[data-sv-inset]");
  const svVideo = svTrack && svTrack.querySelector("[data-sv-video]");
  const svCopy = svTrack && svTrack.querySelector("[data-sv-copy]");
  const svScroll = svTrack && svTrack.querySelector(".hero__scroll");
  if (svTrack && reduced) {
    if (svVideo) svVideo.style.transform = "scale(1)";
    if (svInset) svInset.style.clipPath = "inset(0% 0% 0% 0% round 0px)";
    if (svCopy) { svCopy.style.transform = "none"; svCopy.style.opacity = "1"; }
  }

  /* ---------- Unified rAF scroll loop ---------- */
  const progress = document.getElementById("progress");
  const toTop = document.getElementById("toTop");
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  const marquee = document.querySelector("[data-marquee]");
  let ticking = false;

  function frame() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight - vh;

    if (nav) nav.classList.toggle("is-scrolled", y > 40);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
    if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";

    if (!reduced) {
      // parallax layers
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });

      // marquee drifts with scroll (handcrafted parallax over the auto-scroll)
      if (marquee) {
        const rect = marquee.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < vh) {
          const rel = (vh - rect.top) / (vh + rect.height);
          marquee.style.transform = `translate3d(${(-rel * 80).toFixed(1)}px, 0, 0)`;
        }
      }

      // scroll-expanding video hero: standard sticky-track progress (0 at top)
      if (svTrack) {
        const rect = svTrack.getBoundingClientRect();
        const dist = rect.height - vh;
        const p = dist > 0 ? clamp(-rect.top / dist, 0, 1) : 0;
        const t = clamp(p / 0.7, 0, 1); // video finishes expanding by 70% of the track
        if (svVideo) svVideo.style.transform = `scale(${lerp(0.7, 1, t).toFixed(3)})`;
        if (svInset) {
          const inset = lerp(45, 0, t).toFixed(2);
          const round = lerp(1000, 0, t).toFixed(1);
          svInset.style.clipPath = `inset(${inset}% ${inset}% ${inset}% ${inset}% round ${round}px)`;
        }
        // brand fades out over the first 45% as the video opens up
        const fade = clamp(1 - p / 0.45, 0, 1);
        if (svCopy) {
          svCopy.style.opacity = fade.toFixed(2);
          svCopy.style.transform = `translateY(${lerp(0, -50, p).toFixed(1)}px) scale(${lerp(1, 1.06, p).toFixed(3)})`;
          svCopy.style.pointerEvents = fade < 0.05 ? "none" : "";
        }
        if (svScroll) svScroll.style.opacity = fade.toFixed(2);
      }
    }
    ticking = false;
  }
  function onScroll() { if (!ticking) { window.requestAnimationFrame(frame); ticking = true; } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
