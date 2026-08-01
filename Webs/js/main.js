/* =====================================================================
   Chez Christophe — interactions & animations
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ===================================================================== */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Page loader ---------- */
  const loader = $("#loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader && loader.classList.add("is-done"), prefersReduced ? 0 : 450);
    playHeroWords();
  });
  // Fallback so the curtain never sticks if `load` is delayed.
  setTimeout(() => loader && loader.classList.add("is-done"), 2500);

  /* ---------- Hero word reveal ---------- */
  function playHeroWords() {
    const words = $$("[data-reveal-word]");
    words.forEach((w, i) => {
      if (prefersReduced) { w.style.transform = "none"; return; }
      w.style.transition = "transform 0.9s cubic-bezier(0.16,1,0.3,1)";
      w.style.transitionDelay = 60 * i + "ms";
      requestAnimationFrame(() => (w.style.transform = "translateY(0)"));
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Header state, scroll progress, FAB, scroll-spy ---------- */
  const header = $("#header");
  const progress = $("#scrollProgress");
  const fab = $("#fab");
  const navLinks = $$(".nav__link");
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-scrolled", y > 40);
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (fab) fab.classList.toggle("is-visible", y > window.innerHeight * 0.9);

    // Scroll-spy
    let current = "";
    for (const sec of sections) {
      if (sec.offsetTop - 120 <= y) current = "#" + sec.id;
    }
    navLinks.forEach((l) =>
      l.classList.toggle("is-current", l.getAttribute("href") === current)
    );
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Hero parallax (cheap transform, rAF-throttled) ---------- */
  const parallax = $("[data-parallax]");
  if (parallax && !prefersReduced) {
    let pTick = false;
    window.addEventListener(
      "scroll",
      () => {
        if (pTick) return;
        pTick = true;
        requestAnimationFrame(() => {
          const offset = Math.min(window.scrollY, window.innerHeight) * 0.18;
          parallax.style.transform = "translate3d(0," + offset + "px,0)";
          pTick = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------- Mobile nav ---------- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  function closeNav() {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest(".nav__link")) closeNav();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- Menu tabs ---------- */
  const tabs = $$(".menu__tab");
  const panels = $$(".menu__panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const name = tab.dataset.tab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach((p) =>
        p.classList.toggle("is-active", p.dataset.panel === name)
      );
    });
  });

  /* ---------- Animated stat counters ---------- */
  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          animateCount(e.target);
          obs.unobserve(e.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = c.dataset.count));
  }
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    if (prefersReduced) { el.textContent = target; return; }
    const dur = 1400;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Reservation form (opens a pre-filled email) ---------- */
  const form = $("#reserveForm");
  const status = $("#reserveStatus");
  if (form) {
    // Prevent past dates
    const dateInput = $("#r-date");
    if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.className = "reserve__status";
      if (!form.checkValidity()) {
        status.textContent = "Please complete the required fields.";
        status.classList.add("is-err");
        form.reportValidity();
        return;
      }
      const d = new FormData(form);
      const subject = encodeURIComponent(
        "Table request — " + d.get("name") + " (" + d.get("guests") + " guests)"
      );
      const body = encodeURIComponent(
        "Hello Chez Christophe,\n\nI'd like to request a table.\n\n" +
          "Name: " + d.get("name") + "\n" +
          "Email: " + d.get("email") + "\n" +
          "Phone: " + (d.get("phone") || "—") + "\n" +
          "Date: " + d.get("date") + "\n" +
          "Time: " + d.get("time") + "\n" +
          "Guests: " + d.get("guests") + "\n" +
          "Notes: " + (d.get("notes") || "—") + "\n\nThank you!"
      );
      window.location.href =
        "mailto:Chezchristophe3@gmail.com?subject=" + subject + "&body=" + body;
      status.textContent =
        "Opening your email app to send the request… If nothing happens, please call 087 414 0974.";
      status.classList.add("is-ok");
    });
  }

  /* ---------- Footer year ---------- */
  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
