(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger, Draggable);
    gsap.defaults({ ease: "power3.out" });
  }

  /* ------------------------------------------------------------------ *
   * Lenis smooth scroll, bound to ScrollTrigger.
   * ------------------------------------------------------------------ */
  let lenis = null;
  if (!reduceMotion && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, smoothTouch: false });
    lenis.on("scroll", () => hasGSAP && ScrollTrigger.update());
    if (hasGSAP) {
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(t) { lenis.raf(t); requestAnimationFrame(raf); });
    }
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: -8 });
    else document.querySelector(target)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        scrollToTarget(id);
      }
    });
  });

  /* ------------------------------------------------------------------ *
   * Preloader — gated on the hero image + fonts, then reveals the hero.
   * ------------------------------------------------------------------ */
  const preloader = document.querySelector(".preloader");
  const heroImg = document.querySelector(".hero-media img");

  function finishPreload() {
    if (!preloader) { playHeroIn(); return; }
    const done = () => {
      preloader.classList.add("is-done");
      if (hasGSAP && !reduceMotion) {
        gsap.to(preloader, {
          yPercent: -100, duration: 0.9, ease: "power4.inOut",
          onComplete: () => preloader.remove(),
        });
      } else {
        preloader.style.display = "none";
      }
      playHeroIn();
    };
    if (hasGSAP && !reduceMotion) {
      gsap.to(preloader, { autoAlpha: 0, duration: 0.01, delay: 0.15, onComplete: done });
    } else {
      done();
    }
  }

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const imgReady = new Promise((resolve) => {
    if (!heroImg) return resolve();
    if (heroImg.complete) return resolve();
    heroImg.addEventListener("load", resolve, { once: true });
    heroImg.addEventListener("error", resolve, { once: true });
  });
  const safetyTimeout = new Promise((r) => setTimeout(r, 1800));

  Promise.race([Promise.all([fontsReady, imgReady]), safetyTimeout]).then(finishPreload);

  /* ------------------------------------------------------------------ *
   * Hero line-mask reveal.
   * ------------------------------------------------------------------ */
  function playHeroIn() {
    const lines = document.querySelectorAll(".hero-title .line span");
    if (!hasGSAP || reduceMotion) {
      lines.forEach((l) => (l.style.transform = "none"));
    } else {
      gsap.to(lines, {
        yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.09,
      });
      gsap.to([".hero-eyebrow", ".hero-sub", ".hero-meta", ".hero-cta"], {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.35,
      });
    }
    startIdleFloat();
  }

  if (hasGSAP) {
    gsap.set(".hero-title .line span", { yPercent: 110 });
    gsap.set([".hero-eyebrow", ".hero-sub", ".hero-meta", ".hero-cta"], { autoAlpha: 0, y: 16 });
  }

  /* ------------------------------------------------------------------ *
   * Nav: hide on scroll down, show on scroll up; solidify past hero.
   * ------------------------------------------------------------------ */
  const header = document.querySelector(".site-header");
  const heroEl = document.querySelector(".hero");
  if (header) {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-solid", y > (heroEl?.offsetHeight ?? 400) - 80);
      if (y > lastY + 4 && y > 120) header.classList.add("is-hidden");
      else if (y < lastY - 4) header.classList.remove("is-hidden");
      lastY = y;
    };
    (lenis ? lenis.on("scroll", onScroll) : window.addEventListener("scroll", onScroll, { passive: true }));
    onScroll();
  }

  /* ------------------------------------------------------------------ *
   * Marquee — duplicated track, reverses with scroll direction.
   * ------------------------------------------------------------------ */
  document.querySelectorAll(".marquee-band").forEach((band) => {
    const track = band.querySelector(".marquee-track");
    if (!track) return;
    track.innerHTML += track.innerHTML;
    if (!hasGSAP || reduceMotion) return;

    let direction = 1;
    const speed = 40; // px per second
    let x = 0;
    const halfWidth = () => track.scrollWidth / 2;

    gsap.ticker.add((_, deltaMs) => {
      x -= (direction * speed * deltaMs) / 1000;
      const w = halfWidth();
      if (w > 0) {
        if (x <= -w) x += w;
        if (x > 0) x -= w;
      }
      gsap.set(track, { x });
    });

    let lastY = window.scrollY;
    const updateDir = () => {
      const y = window.scrollY;
      direction = y >= lastY ? 1 : -1;
      lastY = y;
    };
    (lenis ? lenis.on("scroll", updateDir) : window.addEventListener("scroll", updateDir, { passive: true }));
  });

  /* ------------------------------------------------------------------ *
   * Global reveal system.
   * ------------------------------------------------------------------ */
  if (hasGSAP) {
    gsap.utils.toArray("[data-reveal]").forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (reduceMotion) { el.classList.add("is-revealed"); return; }
          gsap.to(el, {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            delay: (i % 6) * 0.06,
            onStart: () => el.classList.add("is-revealed"),
          });
        },
      });
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-revealed"));
  }

  /* ------------------------------------------------------------------ *
   * Heart stroke draw-on (about section).
   * ------------------------------------------------------------------ */
  document.querySelectorAll(".draw-on path").forEach((path) => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = reduceMotion ? 0 : len;
    if (!hasGSAP || reduceMotion) return;
    ScrollTrigger.create({
      trigger: path.closest(".draw-on"),
      start: "top 80%",
      once: true,
      onEnter: () => gsap.to(path, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }),
    });
  });

  /* ------------------------------------------------------------------ *
   * Menu tabs (21st.dev-style animated tabs, restyled to project tokens).
   * ------------------------------------------------------------------ */
  const tablist = document.querySelector(".menu-tabs");
  if (tablist) {
    const tabs = Array.from(tablist.querySelectorAll(".menu-tab"));
    const indicator = tablist.querySelector(".menu-tab-indicator");
    const panels = document.querySelectorAll(".menu-panel");

    function moveIndicator(tab) {
      if (!indicator) return;
      indicator.style.width = tab.offsetWidth + "px";
      indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
    }

    function selectTab(tab, { focus = false } = {}) {
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      panels.forEach((p) => p.classList.toggle("is-active", p.id === tab.getAttribute("aria-controls")));
      moveIndicator(tab);
      if (focus) tab.focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => selectTab(tab));
      tab.addEventListener("keydown", (e) => {
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
        e.preventDefault();
        let next = i;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        selectTab(tabs[next], { focus: true });
      });
    });

    window.addEventListener("resize", () => {
      const current = tabs.find((t) => t.getAttribute("aria-selected") === "true");
      if (current) moveIndicator(current);
    });

    requestAnimationFrame(() => moveIndicator(tabs[0]));
  }

  /* ------------------------------------------------------------------ *
   * Gallery: pinned horizontal rail.
   * ------------------------------------------------------------------ */
  const railSection = document.querySelector(".gallery-section");
  const rail = document.querySelector(".gallery-rail");
  if (hasGSAP && rail && railSection && window.innerWidth >= 900 && !reduceMotion) {
    const getScrollAmount = () => rail.scrollWidth - railSection.querySelector(".gallery-rail-viewport").offsetWidth;
    let tween = gsap.to(rail, {
      x: () => -getScrollAmount(),
      ease: "none",
      scrollTrigger: {
        trigger: railSection,
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  }

  /* ------------------------------------------------------------------ *
   * Testimonials: alternating rotation, scrubbed with scroll (E5).
   * ------------------------------------------------------------------ */
  if (hasGSAP && !reduceMotion) {
    document.querySelectorAll(".testimonial-card").forEach((card, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      gsap.fromTo(card,
        { rotate: 0 },
        {
          rotate: dir * 6,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top 110%", end: "bottom 20%", scrub: true },
        }
      );
    });
  }

  /* ------------------------------------------------------------------ *
   * Footer oversized wordmark reveal.
   * ------------------------------------------------------------------ */
  if (hasGSAP) {
    const fw = document.querySelector(".footer-wordmark svg");
    if (fw) {
      gsap.set(fw, { yPercent: reduceMotion ? 0 : 40, autoAlpha: reduceMotion ? 1 : 0 });
      ScrollTrigger.create({
        trigger: ".footer-wordmark",
        start: "top 90%",
        once: true,
        onEnter: () => gsap.to(fw, { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out" }),
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * E1 — draggable idle-float hero icons (the one delightful thing).
   * ------------------------------------------------------------------ */
  function startIdleFloat() {
    const icons = document.querySelectorAll(".float-icon");
    if (!icons.length) return;
    if (!hasGSAP || reduceMotion || window.innerWidth < 760) return;

    icons.forEach((icon, i) => {
      const floatTween = gsap.to(icon, {
        y: `+=${gsap.utils.random(12, 24)}`,
        x: `+=${gsap.utils.random(-12, 12)}`,
        rotation: gsap.utils.random(-6, 6),
        duration: gsap.utils.random(2, 3.4),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.2,
      });

      Draggable.create(icon, {
        type: "x,y",
        bounds: icon.parentElement,
        onPress() {
          floatTween.pause();
          gsap.to(icon, { scale: 1.15, duration: 0.15, ease: "power2.out" });
        },
        onRelease() {
          gsap.to(icon, {
            scale: 1, duration: 0.5, ease: "back.out(3)",
            onComplete: () => floatTween.restart(),
          });
        },
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Reduced-motion kill switch.
   * ------------------------------------------------------------------ */
  if (hasGSAP) {
    gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
      if (lenis) lenis.destroy();
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-revealed"));
      ScrollTrigger.getAll().forEach((st) => st.kill());
    });
  }

  /* ------------------------------------------------------------------ *
   * Resize: debounced ScrollTrigger refresh.
   * ------------------------------------------------------------------ */
  if (hasGSAP) {
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 220);
    });
  }
})();
