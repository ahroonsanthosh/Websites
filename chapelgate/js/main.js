(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  const body = document.body;

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- preloader ---------------- */
  function initPreloader() {
    const preloader = document.getElementById("preloader");
    const bar = preloader ? preloader.querySelector(".preloader-bar span") : null;
    const heroImg = document.querySelector(".hero-media img");

    if (!preloader) { root.classList.remove("is-loading"); return Promise.resolve(); }

    if (reduceMotion) {
      preloader.style.display = "none";
      root.classList.remove("is-loading");
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let progress = 0;
      const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
      const imgReady = new Promise((res) => {
        if (!heroImg) return res();
        if (heroImg.complete) return res();
        heroImg.addEventListener("load", res, { once: true });
        heroImg.addEventListener("error", res, { once: true });
      });

      const tick = () => {
        progress = Math.min(progress + (100 - progress) * 0.12 + 1.2, 96);
        if (bar) bar.style.width = progress + "%";
      };
      const ticker = setInterval(tick, 90);

      Promise.all([fontsReady, imgReady]).then(() => {
        clearInterval(ticker);
        if (bar) bar.style.width = "100%";
        setTimeout(() => {
          preloader.style.transition = "clip-path 0.7s cubic-bezier(0.6,0.08,0.02,0.99)";
          preloader.style.clipPath = "inset(0 0 100% 0)";
          preloader.addEventListener("transitionend", () => {
            root.classList.remove("is-loading");
            resolve();
          }, { once: true });
        }, 220);
      });

      // safety net: never block the site for more than 3.5s
      setTimeout(() => {
        clearInterval(ticker);
        root.classList.remove("is-loading");
        resolve();
      }, 3500);
    });
  }

  /* ---------------- lenis + scrolltrigger ---------------- */
  let lenis = null;
  function initSmoothScroll() {
    if (reduceMotion || typeof Lenis === "undefined") return;
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, smoothTouch: false });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
    root.classList.add("has-lenis");

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1 && document.querySelector(id)) {
          e.preventDefault();
          lenis.scrollTo(id, { offset: -20 });
        }
      });
    });
  }

  /* ---------------- hero line-mask reveal ---------------- */
  // Lines start visible in the HTML/CSS (so no-JS visitors always see the
  // headline). If GSAP is driving the reveal, hide them the instant we can
  // script it -- while the opaque preloader still covers the viewport --
  // then animate them up once the preloader clears.
  const heroLines = document.querySelectorAll(".line-inner");
  if (!reduceMotion && window.gsap && heroLines.length) {
    gsap.set(heroLines, { yPercent: 110 });
  }

  function revealHero() {
    if (reduceMotion || !window.gsap) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-revealed"));
      return;
    }
    gsap.to(heroLines, {
      yPercent: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.08,
    });
    gsap.to("[data-reveal]", {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06, delay: 0.25,
    });
  }

  /* ---------------- global reveal system (IntersectionObserver) ---------------- */
  function initRevealSystem() {
    body.classList.add("reveal-ready");
    const targets = document.querySelectorAll("[data-reveal], [data-reveal-child]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.05 }
    );
    targets.forEach((el) => {
      // hero elements are revealed by the load-in timeline, not scroll
      if (el.closest(".hero")) { el.classList.add("is-revealed"); return; }
      io.observe(el);
    });
  }

  /* ---------------- SVG stroke draw-on ---------------- */
  function initOrnaments() {
    const ornaments = document.querySelectorAll("[data-draw-on]");
    if (!ornaments.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      ornaments.forEach((el) => el.classList.add("is-drawn"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-drawn");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    ornaments.forEach((el) => io.observe(el));
  }

  /* ---------------- nav: hide on scroll down, show on scroll up, solidify ---------------- */
  function initNav() {
    const nav = document.getElementById("siteNav");
    if (!nav) return;
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
      const y = window.scrollY;
      if (y > lastY + 4 && y > 120) nav.classList.add("nav-hidden");
      else if (y < lastY - 4) nav.classList.remove("nav-hidden");
      nav.classList.toggle("nav-solid", y > window.innerHeight * 0.7);
      lastY = y;
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    const sections = document.querySelectorAll("main .section[id]");
    const links = document.querySelectorAll(".nav-links a[data-nav-link]");
    if ("IntersectionObserver" in window && sections.length) {
      const navIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
            }
          });
        },
        { rootMargin: "-45% 0px -45% 0px" }
      );
      sections.forEach((s) => navIo.observe(s));
    }
  }

  /* ---------------- marquee: reverse direction with scroll direction ---------------- */
  function initMarquee() {
    const marquee = document.querySelector("[data-marquee]");
    if (!marquee || reduceMotion) return;
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      marquee.setAttribute("data-dir", y < lastY ? "reverse" : "forward");
      lastY = y;
    }, { passive: true });
  }

  /* ---------------- difference cycler: activate panes on scroll ---------------- */
  function initCycler() {
    const panes = document.querySelectorAll("[data-cycler-pane]");
    if (!panes.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("active", entry.isIntersecting);
        });
      },
      { threshold: 0.55 }
    );
    panes.forEach((p) => io.observe(p));
  }

  /* ---------------- footer: oversized wordmark reveal + seal rotation ---------------- */
  function initFooter() {
    const wordmark = document.querySelector(".footer-wordmark-inner");
    const seal = document.querySelector("[data-seal]");
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
      if (wordmark) { wordmark.style.opacity = 1; wordmark.style.transform = "none"; }
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    if (wordmark) {
      gsap.to(wordmark, {
        y: 0, opacity: 1, duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: wordmark, start: "top 90%" },
      });
    }
    if (seal) {
      gsap.to(seal, {
        rotate: 360,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });
    }
  }

  /* ---------------- menu glyphs (hand-drawn, no icon libraries) ---------------- */
  const GLYPHS = {
    breakfast: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="32" cy="34" rx="24" ry="15"/><path d="M14 30c2-6 9-10 18-10s16 4 18 10"/><circle cx="26" cy="30" r="4.5"/><path d="M40 24c3 1 6 4 6 8"/><path d="M12 40c8 3 32 3 40 0"/></svg>`,
    sandwiches: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 26 L32 12 L54 26 Z"/><path d="M10 26c0 4 4 6 22 6s22-2 22-6"/><path d="M12 30 L15 42 L49 42 L52 30"/><path d="M15 42 L18 50 L46 50 L49 42"/><path d="M20 30c2 2 2 4 0 6M32 30c2 2 2 4 0 6M44 30c2 2 2 4 0 6"/></svg>`,
    "jacket-potatoes": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 34c-2-10 6-18 20-18s22 8 20 18-10 16-20 16-22-6-20-16Z"/><path d="M24 26c4-2 12-2 16 1"/><path d="M22 34c6 3 14 3 20 0"/><path d="M26 41c4 2 8 2 12 0"/></svg>`,
  };
  function initMenuGlyphs() {
    document.querySelectorAll(".menu-card-glyph[data-glyph]").forEach((el) => {
      const key = el.getAttribute("data-glyph");
      if (GLYPHS[key]) el.innerHTML = GLYPHS[key];
    });
  }

  /* ---------------- coffee bean easter egg (Matter.js, lazy-loaded) ---------------- */
  function initBeanEgg() {
    const trigger = document.getElementById("beanTrigger");
    const canvas = document.getElementById("beanCanvas");
    if (!trigger || !canvas) return;

    if (reduceMotion) {
      trigger.addEventListener("click", () => {
        trigger.textContent = "beans stay in the jar (reduced motion is on)";
      });
      return;
    }

    let engine, world, render, runner, loaded = false;
    const MAX_BEANS = 45;
    let beanCount = 0;

    function loadMatter() {
      return new Promise((resolve) => {
        if (window.Matter) return resolve();
        const s = document.createElement("script");
        s.src = "js/vendor/matter.min.js";
        s.onload = resolve;
        document.body.appendChild(s);
      });
    }

    function setup() {
      const Matter = window.Matter;
      const { Engine, World, Bodies, Runner } = Matter;
      engine = Engine.create();
      world = engine.world;
      world.gravity.y = 1;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");

      const ground = Bodies.rectangle(canvas.width / 2, canvas.height + 20, canvas.width * 2, 40, { isStatic: true });
      const wallL = Bodies.rectangle(-20, canvas.height / 2, 40, canvas.height * 2, { isStatic: true });
      const wallR = Bodies.rectangle(canvas.width + 20, canvas.height / 2, 40, canvas.height * 2, { isStatic: true });
      World.add(world, [ground, wallL, wallR]);

      runner = Runner.create();
      Runner.run(runner, engine);

      (function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const bodies = Matter.Composite.allBodies(world);
        ctx.fillStyle = "#3C3A35";
        bodies.forEach((b) => {
          if (b.isStatic) return;
          ctx.save();
          ctx.translate(b.position.x, b.position.y);
          ctx.rotate(b.angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, b.circleRadius || 7, (b.circleRadius || 7) * 0.75, 0, 0, Math.PI * 2);
          ctx.fillStyle = "#4a3223";
          ctx.fill();
          ctx.strokeStyle = "#2a1c14";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -(b.circleRadius || 7) * 0.7);
          ctx.lineTo(0, (b.circleRadius || 7) * 0.7);
          ctx.stroke();
          ctx.restore();
        });
        requestAnimationFrame(draw);
      })();

      window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    }

    function drop() {
      const Matter = window.Matter;
      const { Bodies, World, Body } = Matter;
      const dropCount = 12;
      for (let i = 0; i < dropCount; i++) {
        if (beanCount >= MAX_BEANS) {
          const bodies = Matter.Composite.allBodies(world).filter((b) => !b.isStatic);
          if (bodies[0]) { World.remove(world, bodies[0]); beanCount--; }
        }
        const x = window.innerWidth * 0.3 + Math.random() * window.innerWidth * 0.4;
        const bean = Bodies.circle(x, -20 - Math.random() * 100, 6 + Math.random() * 2, {
          restitution: 0.35,
          friction: 0.6,
        });
        Body.setAngle(bean, Math.random() * Math.PI);
        World.add(world, bean);
        beanCount++;
      }
    }

    trigger.addEventListener("click", async () => {
      canvas.style.pointerEvents = "none";
      if (!loaded) {
        trigger.disabled = true;
        await loadMatter();
        setup();
        loaded = true;
        trigger.disabled = false;
      }
      drop();
    });
  }

  /* ---------------- resize: debounced ScrollTrigger refresh ---------------- */
  function initResizeRefresh() {
    if (!window.ScrollTrigger) return;
    let t;
    window.addEventListener("resize", () => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
  }

  /* ---------------- boot ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initMenuGlyphs();
    initRevealSystem();
    initOrnaments();
    initNav();
    initMarquee();
    initCycler();
    initBeanEgg();

    initPreloader().then(() => {
      initSmoothScroll();
      revealHero();
      initFooter();
      initResizeRefresh();
    });
  });
})();
