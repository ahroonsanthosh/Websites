/* ==========================================================================
   THE LOUGH CAFÉ — motion system
   GSAP + ScrollTrigger + Draggable, native scroll (no smooth-scroll library —
   deliberate choice for this handmade, budget-honest register). Every
   scroll-linked effect has a reduced-motion off switch below.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.body.classList.remove("no-js");

  var reduceMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
  }

  function prefersReduced() { return reduceMotionMQ.matches; }

  /* Draggable is only needed for the desktop-only hero stickers — loading it
     on every mobile visit would just be dead weight, so it's fetched on
     demand instead of sitting in the initial script list. */
  var draggableLoadPromise = null;
  function loadDraggable() {
    if (window.Draggable) return Promise.resolve();
    if (draggableLoadPromise) return draggableLoadPromise;
    draggableLoadPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "js/vendor/Draggable.min.js";
      s.onload = function () { gsap.registerPlugin(Draggable); resolve(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return draggableLoadPromise;
  }

  /* ---------------------------------------------------------------------
     Reveal system — one reusable attribute, unobserved after firing
  --------------------------------------------------------------------- */
  (function revealSystem() {
    var targets = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
    if (!targets.length) return;

    if (prefersReduced()) {
      targets.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -15% 0px", threshold: 0.05 });

    targets.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------------------------------------------------------------
     SVG stroke draw-on (divider + underline marks)
  --------------------------------------------------------------------- */
  (function drawOn() {
    var paths = document.querySelectorAll(".draw-on path");
    paths.forEach(function (p) {
      try {
        var len = p.getTotalLength();
        p.style.setProperty("--len", len);
      } catch (e) { /* ignore */ }
    });

    var marks = document.querySelectorAll(".mark svg path");
    marks.forEach(function (p) {
      try {
        var len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = prefersReduced() ? 0 : len;
      } catch (e) { /* ignore */ }
    });
    if (prefersReduced() || !marks.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var p = entry.target;
          p.style.transition = "stroke-dashoffset 900ms cubic-bezier(.16,1,.3,1) 150ms";
          p.style.strokeDashoffset = 0;
          io.unobserve(p);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    marks.forEach(function (p) { io.observe(p); });
  })();

  /* ---------------------------------------------------------------------
     Trail — the path around the lough, scrubbed down the left rail
  --------------------------------------------------------------------- */
  (function trail() {
    var svg = document.getElementById("trail-svg");
    var path = document.getElementById("trail-path");
    if (!svg || !path || !hasGSAP) return;
    if (!window.matchMedia("(min-width: 1180px)").matches) return; // hidden by CSS below this width — skip the work entirely

    /* viewBox stays fixed at the authored path's own coordinate space;
       preserveAspectRatio="none" plus CSS height:100% stretches it to
       whatever the fixed viewport-height rail measures — this is a
       decorative progress rail, not a literal trace of full page height. */
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = prefersReduced() ? 0 : len;

    if (prefersReduced()) return;

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: function (self) {
        path.style.strokeDashoffset = len * (1 - self.progress);
      }
    });
  })();

  /* ---------------------------------------------------------------------
     Nav — hide on scroll down / show on scroll up, scrim past hero
  --------------------------------------------------------------------- */
  (function navBehaviour() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      nav.classList.toggle("is-scrimmed", y > window.innerHeight * 0.55);
      if (y > lastY && y > 160) {
        nav.classList.add("is-hidden");
      } else {
        nav.classList.remove("is-hidden");
      }
      lastY = y;
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  })();

  /* ---------------------------------------------------------------------
     Full-screen nav overlay — master timeline, scroll lock, focus trap
  --------------------------------------------------------------------- */
  (function navOverlay() {
    var overlay = document.getElementById("nav-overlay");
    var openBtns = [document.getElementById("nav-toggle"), document.getElementById("bottom-more")].filter(Boolean);
    var closeBtn = document.getElementById("nav-close");
    if (!overlay || !openBtns.length) return;

    var lastFocused = null;
    var tl = null;

    function buildTimeline() {
      if (!hasGSAP) return null;
      var t = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      t.set(overlay, { visibility: "visible" });
      t.to(overlay, { opacity: 1, duration: 0.35 }, 0);
      t.from("[data-ov='1']", { y: 30, opacity: 0, duration: 0.55 }, 0.08);
      t.from("[data-ov='2']", { y: 30, opacity: 0, duration: 0.55 }, 0.14);
      t.from("[data-ov='3']", { y: 30, opacity: 0, duration: 0.55 }, 0.2);
      t.from("[data-ov='4']", { y: 30, opacity: 0, duration: 0.55 }, 0.26);
      t.from("[data-ov='5']", { y: 30, opacity: 0, duration: 0.55 }, 0.32);
      t.from("[data-ov='6']", { y: 20, opacity: 0, duration: 0.5 }, 0.4);
      return t;
    }

    function openOverlay(triggerBtn) {
      lastFocused = triggerBtn || document.activeElement;
      overlay.classList.add("is-open");
      openBtns.forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
      document.body.style.overflow = "hidden";
      if (prefersReduced() || !hasGSAP) {
        overlay.style.visibility = "visible";
        overlay.style.opacity = "1";
      } else {
        tl = buildTimeline();
        tl.play();
      }
      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    }
    function closeOverlay() {
      overlay.classList.remove("is-open");
      openBtns.forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      document.body.style.overflow = "";
      if (prefersReduced() || !hasGSAP) {
        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";
      } else if (tl) {
        tl.eventCallback("onReverseComplete", function () {
          overlay.style.visibility = "hidden";
        });
        tl.reverse();
      }
      document.removeEventListener("keydown", onKeydown);
      if (lastFocused) lastFocused.focus();
    }
    function onKeydown(e) {
      if (e.key === "Escape") { closeOverlay(); return; }
      if (e.key !== "Tab") return;
      var focusables = overlay.querySelectorAll("a[href], button:not([disabled])");
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    openBtns.forEach(function (b) { b.addEventListener("click", function () { openOverlay(b); }); });
    closeBtn.addEventListener("click", closeOverlay);
    overlay.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeOverlay); });
  })();

  /* ---------------------------------------------------------------------
     Marquee — duplicated track, reverses direction with scroll direction
  --------------------------------------------------------------------- */
  (function marquee() {
    var track = document.getElementById("marquee-track");
    if (!track || !hasGSAP) return;
    if (prefersReduced()) return;

    var totalWidth = track.scrollWidth / 2;
    var tween = gsap.to(track, {
      x: -totalWidth,
      duration: 32,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: function (x) {
          var n = parseFloat(x) % totalWidth;
          return (n - totalWidth) + "px";
        }
      }
    });

    var lastY = window.scrollY;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      tween.timeScale(y < lastY ? -1 : 1);
      lastY = y;
    }, { passive: true });
  })();

  /* ---------------------------------------------------------------------
     Hero line-mask reveal (page-load entrance, not scroll-triggered)
  --------------------------------------------------------------------- */
  (function heroEntrance() {
    var lines = document.querySelectorAll(".hero__title .line > span");
    if (!lines.length) return;
    if (!hasGSAP || prefersReduced()) {
      lines.forEach(function (l) { l.style.transform = "none"; });
      return;
    }
    gsap.set(lines, { yPercent: 110 });
    gsap.to(lines, {
      yPercent: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.09,
      delay: 0.15
    });
  })();

  /* ---------------------------------------------------------------------
     Draggable idle-float hero stickers — desktop only (Reference E #1)
  --------------------------------------------------------------------- */
  (function stickers() {
    if (!hasGSAP) return;
    var mm = gsap.matchMedia();
    mm.add("(min-width: 980px)", function () {
      if (prefersReduced()) return;
      var stickers = gsap.utils.toArray(".sticker");
      var floats = [];
      var draggables = [];
      var cancelled = false;

      floats = stickers.map(function (el, i) {
        return gsap.to(el, {
          x: "+=" + (10 + i * 4),
          y: "+=" + (14 + i * 3),
          rotation: (i % 2 ? 1 : -1) * (3 + i),
          duration: 2.4 + i * 0.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.15
        });
      });

      loadDraggable().then(function () {
        if (cancelled) return;
        stickers.forEach(function (el, i) {
          var floatTween = floats[i];
          draggables.push(Draggable.create(el, {
            type: "x,y",
            bounds: el.closest(".hero__frame-wrap"),
            onPress: function () {
              floatTween.pause();
              gsap.to(el, { scale: 1.18, duration: 0.12, ease: "power2.out", filter: "drop-shadow(0 18px 22px rgba(28,23,18,.4))" });
            },
            onRelease: function () {
              gsap.to(el, {
                scale: 1, duration: 0.5, ease: "back.out(3)",
                filter: "drop-shadow(0 10px 14px rgba(28,23,18,.3))",
                onComplete: function () { floatTween.resume(); }
              });
            }
          })[0]);
        });
      });

      return function () {
        cancelled = true;
        floats.forEach(function (t) { t.kill(); });
        draggables.forEach(function (d) { d.kill(); });
      };
    });
  })();

  /* ---------------------------------------------------------------------
     Peel-apart single-play reveal (Reference E #4) — story section
  --------------------------------------------------------------------- */
  (function peelApart() {
    var peel = document.querySelector("[data-peel]");
    var left = document.querySelector("[data-peel-left]");
    var right = document.querySelector("[data-peel-right]");
    if (!peel || !left || !right) return;

    if (!hasGSAP || prefersReduced()) return;

    var isDesktop = window.matchMedia("(min-width: 700px)").matches;
    if (isDesktop) {
      gsap.set(left, { rotation: 0, x: "22%", z: 1 });
      gsap.set(right, { rotation: 0, x: "-22%" });
    } else {
      gsap.set([left, right], { rotation: 0, y: 12 });
    }
    gsap.set(peel, { autoAlpha: 0.001 });

    ScrollTrigger.create({
      trigger: peel,
      start: "top 78%",
      once: true,
      onEnter: function () {
        gsap.to(peel, { autoAlpha: 1, duration: 0.01 });
        if (isDesktop) {
          gsap.to(left, { rotation: -3, x: "6%", duration: 1, ease: "power2.out" });
          gsap.to(right, { rotation: 3, x: "-6%", duration: 1, ease: "power2.out" });
        } else {
          gsap.to([left, right], { y: 0, duration: 0.8, ease: "power2.out", stagger: 0.1 });
        }
      }
    });
  })();

  /* ---------------------------------------------------------------------
     Corkboard testimonials — scrubbed alternating rotation (Reference E #5)
  --------------------------------------------------------------------- */
  (function corkboard() {
    var cards = document.querySelectorAll(".review-card");
    if (!cards.length || !hasGSAP || prefersReduced()) return;

    cards.forEach(function (card, i) {
      var target = i % 2 === 0 ? -6 : 6;
      gsap.fromTo(card, { rotation: 0 }, {
        rotation: target,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 105%",
          end: "top 55%",
          scrub: true
        }
      });
    });
  })();

  /* ---------------------------------------------------------------------
     Menu tabs — lightweight class-toggle slider (budget fallback, 5C-D10)
  --------------------------------------------------------------------- */
  (function menuTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".menu-tab"));
    if (!tabs.length) return;
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });

    function activate(index) {
      tabs.forEach(function (t, i) {
        var selected = i === index;
        t.setAttribute("aria-selected", String(selected));
        t.setAttribute("tabindex", selected ? "0" : "-1");
        panels[i].hidden = !selected;
        panels[i].classList.toggle("is-active", selected);
      });
      tabs[index].focus();
      if (hasGSAP && !prefersReduced()) {
        gsap.fromTo(panels[index], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" });
      }
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { activate(i); t.blur(); t.focus({ preventScroll: true }); });
      t.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (next !== null) { e.preventDefault(); activate(next); }
      });
    });
  })();

  /* ---------------------------------------------------------------------
     Footer oversized wordmark reveal
  --------------------------------------------------------------------- */
  (function footerWordmark() {
    var el = document.querySelector("[data-wordmark]");
    if (!el) return;
    if (!hasGSAP || prefersReduced()) return;
    gsap.set(el, { autoAlpha: 0, y: 40, scale: 0.94 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: function () {
        gsap.to(el, { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" });
      }
    });
  })();

  /* ---------------------------------------------------------------------
     Open-now status + today highlight (real local-time computation)
  --------------------------------------------------------------------- */
  (function openStatus() {
    var dot = document.getElementById("open-dot");
    var label = document.getElementById("open-label");

    // Cork's own clock, not the visitor's — a tourist checking from another
    // timezone should still see whether the door is actually open right now.
    var parts;
    try {
      parts = new Intl.DateTimeFormat("en-IE", {
        timeZone: "Europe/Dublin", weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
    } catch (e) { parts = null; }

    var dayName, mins;
    if (parts) {
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      dayName = map.weekday;
      mins = parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10);
    } else {
      var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var now = new Date();
      dayName = days[now.getDay()];
      mins = now.getHours() * 60 + now.getMinutes();
    }
    var isOpen = mins >= 9 * 60 && mins < 18 * 60;

    if (label) label.textContent = isOpen ? "Open now · till 18:00" : "Closed now · opens 9:00";
    if (dot) dot.style.background = isOpen ? "#4c7a52" : "#a3502b";

    var row = document.querySelector('#hours-list li[data-day="' + dayName + '"]');
    if (row) row.classList.add("today");
  })();

  /* ---------------------------------------------------------------------
     Back to top + footer year
  --------------------------------------------------------------------- */
  (function misc() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    var top = document.getElementById("back-to-top");
    if (top) {
      top.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });
      });
    }
  })();

  /* ---------------------------------------------------------------------
     Reduced-motion global kill switch
  --------------------------------------------------------------------- */
  reduceMotionMQ.addEventListener && reduceMotionMQ.addEventListener("change", function () {
    document.body.classList.toggle("reduced-motion", prefersReduced());
    if (prefersReduced() && hasGSAP) {
      ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
      gsap.globalTimeline.clear();
    }
  });
  if (prefersReduced()) document.body.classList.add("reduced-motion");

  /* ---------------------------------------------------------------------
     Debounced ScrollTrigger.refresh() on resize
  --------------------------------------------------------------------- */
  if (hasGSAP) {
    var resizeT;
    window.addEventListener("resize", function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
    });
  }
})();
