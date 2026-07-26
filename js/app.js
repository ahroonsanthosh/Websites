/* ============================================================
   MORSO NAPOLETANO — MOTION SYSTEM
   Lenis (smooth scroll) + GSAP/ScrollTrigger/Draggable.
   Reduced-motion respected throughout via gsap.matchMedia().
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isDesktop = window.matchMedia("(min-width: 1024px)");

  gsap.registerPlugin(ScrollTrigger);

  /* Draggable (35KB) only powers the desktop-only sticker toy — load it
     lazily on desktop rather than shipping it to every mobile visitor. */
  var draggableLoad = null;
  function loadDraggable() {
    if (draggableLoad) return draggableLoad;
    draggableLoad = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "js/vendor/Draggable.min.js";
      s.onload = function () { gsap.registerPlugin(Draggable); resolve(); };
      s.onerror = reject;
      document.body.appendChild(s);
    });
    return draggableLoad;
  }

  /* ---------------- Lenis smooth scroll ---------------- */
  var lenis = null;
  if (!reduceMotion) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, smoothTouch: false, wheelMultiplier: 0.95 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollTo(target) {
    if (lenis) { lenis.scrollTo(target, { offset: -70, duration: 1.2 }); }
    else { var el = typeof target === "string" ? document.querySelector(target) : target; if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }
  }

  /* route in-page anchors through lenis, never scrollIntoView directly */
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href");
    if (id.length < 2) return;
    var el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    scrollTo(el);
    history.pushState(null, "", id);
  });

  /* ---------------- Preloader: gated on real asset load ---------------- */
  var preloader = document.getElementById("preloader");
  var pct = document.getElementById("preloaderPct");
  var ring = preloader ? preloader.querySelector(".preloader__ring circle") : null;
  var RING_LEN = 264;

  function setProgress(p) {
    p = Math.min(1, Math.max(0, p));
    if (pct) pct.textContent = Math.round(p * 100) + "%";
    if (ring) ring.style.strokeDashoffset = String(RING_LEN * (1 - p));
  }

  function trackAssetLoad() {
    /* Only gate on above-the-fold, eagerly-loaded images (the hero) —
       below-the-fold images are loading="lazy" and won't fetch until
       scrolled into view, so waiting on them would strand the preloader
       on every load. */
    /* Deliberately NOT gated on document.fonts.ready: that resolves only
       once every referenced font is fully downloaded — including large
       decorative faces like the Caveat script — which would hold the
       preloader (and therefore first paint) hostage well past what
       font-display: swap already handles gracefully. */
    var imgs = Array.prototype.slice.call(document.querySelectorAll('img:not([loading="lazy"])'));
    var total = Math.max(imgs.length, 1);
    var done = 0;

    return new Promise(function (resolve) {
      var settled = false;
      function finish() { if (settled) return; settled = true; resolve(); }
      function tick() { done++; setProgress(done / total); if (done >= total) finish(); }
      if (imgs.length === 0) { setProgress(1); finish(); return; }
      imgs.forEach(function (img) {
        if (img.complete) { tick(); }
        else {
          img.addEventListener("load", tick, { once: true });
          img.addEventListener("error", tick, { once: true });
        }
      });
      /* safety timeout so a slow/broken asset never strands the preloader */
      setTimeout(finish, 2500);
    });
  }

  function runHeroEntrance() {
    if (reduceMotion) {
      gsap.set(".line-mask__inner", { y: "0%" });
      gsap.set(".hero__sub, .hero__ctas", { opacity: 1, y: 0 });
      return;
    }
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(".line-mask__inner", { y: "0%", duration: 0.6, stagger: 0.05 })
      .to(".hero__ctas", { opacity: 1, y: 0, duration: 0.45 }, "-=0.35");
  }

  function hidePreloader() {
    if (!preloader) { runHeroEntrance(); return; }
    if (reduceMotion) {
      preloader.classList.add("is-done");
      preloader.setAttribute("hidden", "");
      runHeroEntrance();
      return;
    }
    var tl = gsap.timeline({
      onComplete: function () { preloader.classList.add("is-done"); preloader.setAttribute("hidden", ""); if (lenis) lenis.start(); }
    });
    tl.to(preloader, { clipPath: "inset(0 0 100% 0)", duration: 0.45, ease: "power4.inOut" })
      .call(runHeroEntrance, null, "-=0.25");
  }

  if (preloader) {
    if (lenis) lenis.stop();
    trackAssetLoad().then(hidePreloader);
  } else {
    runHeroEntrance();
  }

  /* ---------------- data-scroll-next: auto-advance out of hero ---------------- */
  document.querySelectorAll("[data-scroll-next]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      scrollTo(el.getAttribute("href"));
    });
  });

  /* ---------------- Header: hide on scroll down / show on scroll up ---------------- */
  var header = document.getElementById("siteHeader");
  if (header) {
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onUpdate: function (self) {
        header.classList.toggle("is-scrolled", self.scroll() > 80);
        if (self.direction === 1 && self.scroll() > 200) header.classList.add("is-hidden");
        else header.classList.remove("is-hidden");
      }
    });
  }

  /* ---------------- Global scroll-reveal system ---------------- */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: function () { el.classList.add("is-revealed"); }
    });
  });

  /* ---------------- SVG stroke draw-on for ornaments ---------------- */
  if (!reduceMotion) {
    gsap.utils.toArray(".ornament path, .ornament circle").forEach(function (shape) {
      var len = shape.getTotalLength ? shape.getTotalLength() : 0;
      if (!len) return;
      gsap.set(shape, { strokeDasharray: len, strokeDashoffset: len });
      ScrollTrigger.create({
        trigger: shape.closest(".ornament"),
        start: "top 85%",
        once: true,
        onEnter: function () { gsap.to(shape, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }); }
      });
    });
  }

  /* ---------------- Marquee: reverse direction with scroll direction ---------------- */
  var marquee = document.getElementById("marquee");
  if (marquee) {
    ScrollTrigger.create({
      start: 0, end: 99999,
      onUpdate: function (self) { marquee.classList.toggle("is-reverse", self.direction === -1); }
    });
  }

  /* ---------------- Draggable idle-float stickers (desktop only) ---------------- */
  function initStickers() {
    if (!isDesktop.matches || reduceMotion) return;
    loadDraggable().then(setUpStickerDrag);
  }
  function setUpStickerDrag() {
    var stickers = gsap.utils.toArray(".sticker");
    stickers.forEach(function (el) {
      Draggable.create(el, {
        type: "x,y",
        bounds: el.closest(".stickers__stage"),
        inertia: false,
        onPress: function () {
          el.style.animationPlayState = "paused";
          gsap.to(el, { scale: 1.22, duration: 0.15, filter: "drop-shadow(0 18px 26px rgba(0,0,0,.32))" });
        },
        onRelease: function () {
          gsap.to(el, {
            x: 0, y: 0, scale: 1, filter: "drop-shadow(0 10px 18px rgba(0,0,0,.18))",
            duration: 0.6, ease: "elastic.out(1, 0.45)",
            onComplete: function () { el.style.animationPlayState = "running"; }
          });
        }
      });
    });
  }
  initStickers();

  /* ---------------- Menu cycler: pinned scroll-scrubbed on desktop, tap tabs elsewhere ---------------- */
  (function initMenuCycler() {
    var cycler = document.querySelector("[data-cycler]");
    if (!cycler) return;
    var items = gsap.utils.toArray(cycler.querySelectorAll("[data-cycler-target]"));
    var frames = gsap.utils.toArray(cycler.querySelectorAll("[data-cycler-frame]"));

    function activate(i) {
      items.forEach(function (it, idx) { it.classList.toggle("is-active", idx === i); });
      frames.forEach(function (f, idx) { f.classList.toggle("is-active", idx === i); });
    }
    items.forEach(function (item, i) {
      item.addEventListener("click", function () { activate(i); });
    });

    if (isDesktop.matches && !reduceMotion) {
      ScrollTrigger.create({
        trigger: cycler,
        start: "top 30%",
        end: "bottom 60%",
        onUpdate: function (self) {
          var i = Math.min(items.length - 1, Math.floor(self.progress * items.length));
          activate(i);
        }
      });
    }
  })();

  /* ---------------- Story: single-play peel-apart reveal ---------------- */
  (function initPeel() {
    var peel = document.querySelector("[data-peel]");
    if (!peel) return;
    var back = peel.querySelector('[data-peel-item="back"]');
    var front = peel.querySelector('[data-peel-item="front"]');
    if (reduceMotion) return;
    gsap.set(back, { rotate: 0, x: 0, y: 0 });
    gsap.set(front, { rotate: 0, x: 0, y: 0 });
    ScrollTrigger.create({
      trigger: peel,
      start: "top 70%",
      once: true,
      onEnter: function () {
        gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } })
          .to(back, { rotate: -4, x: "6%", y: "4%" }, 0)
          .to(front, { rotate: 3, x: "-4%", y: "-3%" }, 0);
      }
    });
  })();

  /* ---------------- Gallery: pinned horizontal rail (desktop only) ---------------- */
  (function initGalleryRail() {
    var rail = document.querySelector("[data-rail]");
    if (!rail || !isDesktop.matches || reduceMotion) return;
    var scrollDistance = function () { return rail.scrollWidth - window.innerWidth + 96; };
    var tween = gsap.to(rail, { x: function () { return -scrollDistance(); }, ease: "none" });
    /* Trigger on the rail itself, not the whole section — the section-head
       heading scrolls past normally first, and the horizontal takeover only
       engages once the photo row has settled near the top of the viewport
       (photos already properly in view), not the instant the section (still
       mostly heading) starts entering. */
    ScrollTrigger.create({
      trigger: rail,
      start: "top top",
      end: function () { return "+=" + scrollDistance(); },
      pin: true,
      scrub: 0.6,
      animation: tween,
      invalidateOnRefresh: true
    });
  })();

  /* ---------------- Corkboard: scrubbed alternating rotation (desktop only) ---------------- */
  (function initCorkboard() {
    var board = document.querySelector("[data-corkboard]");
    if (!board || reduceMotion) return;
    var cards = gsap.utils.toArray(board.querySelectorAll(".corkboard__card"));
    if (!isDesktop.matches) return;
    cards.forEach(function (card, i) {
      var dir = card.dataset.rotate === "odd" ? -1 : 1;
      gsap.fromTo(card, { rotate: dir * 4 }, {
        rotate: dir * 10,
        ease: "none",
        scrollTrigger: { trigger: board, start: "top 110%", end: "bottom -10%", scrub: true }
      });
    });
  })();

  /* ---------------- Footer: oversized wordmark reveal ---------------- */
  (function initFooterWordmark() {
    var mark = document.querySelector("[data-footer-wordmark]");
    if (!mark) return;
    if (reduceMotion) { gsap.set(mark, { opacity: 1, y: 0, scale: 1 }); return; }
    ScrollTrigger.create({
      trigger: mark,
      start: "top 90%",
      once: true,
      onEnter: function () {
        gsap.to(mark, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out" });
      }
    });
  })();

  /* ---------------- Back to top ---------------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", function () { scrollTo(0); });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- Debounced resize refresh for pinned/scrubbed sections ---------------- */
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
  });

  /* ---------------- Reduced-motion kill switch ---------------- */
  var mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: reduce)", function () {
    if (lenis) lenis.destroy();
    document.querySelectorAll(".sticker").forEach(function (el) { el.style.animation = "none"; });
    document.querySelectorAll(".marquee__track").forEach(function (el) { el.style.animation = "none"; });
    if (preloader) { preloader.setAttribute("hidden", ""); }
    document.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("is-revealed"); });
    document.querySelectorAll(".line-mask__inner").forEach(function (el) { el.style.transform = "none"; });
    var fm = document.querySelector("[data-footer-wordmark]");
    if (fm) gsap.set(fm, { opacity: 1, y: 0, scale: 1 });
  });
})();
