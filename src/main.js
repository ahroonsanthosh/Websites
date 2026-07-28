/* ==========================================================================
   BLONDIE — motion
   Tier 1, Reference C, with the two Reference E patterns worth stealing:
   draggable idle-float marks (E1) and the scrubbed alternating-rotation
   corkboard (E5). Every animation below is attached to a named pattern;
   nothing here is decoration for its own sake.
   ========================================================================== */
(() => {
  "use strict";

  const root = document.documentElement;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  root.classList.add("is-ready");

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const DESKTOP = () => window.matchMedia("(min-width: 62rem)").matches;

  const ENTER = "power3.out";
  let lenis = null;

  /* ── 0. failsafe ─────────────────────────────────────────────────────────
     If anything below throws, the page must still be readable. */
  const revealAll = () => {
    root.classList.add("is-lit");
    $$("[data-reveal]").forEach(el => el.classList.add("done"));
  };
  const finishLoad = () => {
    document.body.removeAttribute("data-loading");
    const pre = $("#pre");
    if (pre) pre.remove();
  };
  setTimeout(() => { if (document.body.hasAttribute("data-loading")) { finishLoad(); revealAll(); } }, 6000);

  /* ── 1. smooth scroll, bound to ScrollTrigger ───────────────────────────── */
  function initScroll() {
    if (!hasGSAP) return;
    gsap.registerPlugin(ScrollTrigger, window.Draggable);

    if (!REDUCED && typeof window.Lenis !== "undefined") {
      lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, smoothTouch: false });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // every in-page anchor routes through lenis so keyboard and click agree
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener("click", ev => {
        const id = a.getAttribute("href");
        if (id === "#" || id === "#main") return;
        const target = document.querySelector(id);
        if (!target) return;
        ev.preventDefault();
        const nav = $("#nav");
        const off = -((nav ? nav.offsetHeight : 72) + 16);
        if (lenis) lenis.scrollTo(target, { offset: off });
        else target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });

    // Tabbing faster than lenis can lerp leaves the focus ring off-screen.
    document.addEventListener("focusin", ev => {
      if (!lenis || !ev.target.closest) return;
      const r = ev.target.getBoundingClientRect();
      if (r.top > 80 && r.bottom < window.innerHeight - 40) return;
      lenis.scrollTo(ev.target, { offset: -140, duration: 0.35 });
    });

    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => ScrollTrigger.refresh(), 220);
    });
  }

  /* ── 2. the ground warms through the day ─────────────────────────────────
     The single structural idea, expressed as one scroll-linked property. */
  function initGround() {
    const g = $(".ground");
    if (!g || REDUCED || !hasGSAP) return;
    gsap.to(g, {
      backgroundPosition: "0 -700vh",
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom",
        scrub: 0.4, invalidateOnRefresh: true }
    });
  }

  /* ── 3. global reveal system (IntersectionObserver, fires once) ─────────── */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || REDUCED) { revealAll(); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add("done");
        obs.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -15% 0px" });
    els.forEach(el => io.observe(el));
  }

  /* ── 4. marquee: duplicated track, reverses with scroll direction ───────── */
  function initMarquee() {
    const wrap = $("#mq"), track = $("#mq-track");
    if (!wrap || !track) return;
    if (REDUCED || !hasGSAP) return;

    const half = () => track.scrollWidth / 2;
    track.style.willChange = "transform";
    const tw = gsap.to(track, {
      x: () => -half(),
      duration: 26,
      ease: "none",
      repeat: -1,
      modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % half()) }
    });

    let dir = 1, hovering = false;
    const apply = () => tw.timeScale(hovering ? dir * 0.12 : dir);
    ScrollTrigger.create({
      onUpdate: self => {
        const d = self.direction === -1 ? -1 : 1;
        if (d !== dir) { dir = d; apply(); }
      }
    });
    wrap.addEventListener("pointerenter", () => { hovering = true; apply(); });
    wrap.addEventListener("pointerleave", () => { hovering = false; apply(); });
  }

  /* ── 5. nav: hides going down, returns going up, solidifies past the hero ─ */
  let navUpdate = null;

  function initNav() {
    const nav = $("#nav"), dock = $("#dock");
    if (!nav) return;
    let last = window.scrollY;

    const onScroll = y => {
      const solid = y > window.innerHeight * 0.72;
      nav.dataset.solid = solid ? "1" : "0";
      const down = y > last && y > 220;
      nav.dataset.hidden = down ? "1" : "0";
      if (dock) dock.dataset.hidden = y < 120 ? "1" : "0";
      last = y;
    };
    onScroll(window.scrollY);

    navUpdate = onScroll;
    if (lenis) lenis.on("scroll", ({ scroll }) => onScroll(scroll));
    else window.addEventListener("scroll", () => onScroll(window.scrollY), { passive: true });
  }

  /* ── 6. hero: line-masked headline, parallax figure, scroll-linked seal ─── */
  function heroTimeline() {
    const lines = $$(".hero__h1 .ln > span");
    if (!hasGSAP || REDUCED) {
      root.classList.add("is-lit");
      gsap && gsap.set(lines, { yPercent: 0, autoAlpha: 1 });
      lines.forEach(l => { l.style.transform = "none"; l.style.opacity = 1; });
      return gsap ? gsap.timeline() : null;
    }
    const tl = gsap.timeline();
    tl.from(".nav > *", { y: -16, autoAlpha: 0, duration: 0.7, stagger: 0.07, ease: ENTER }, 0)
      .from(".hero__eyebrow", { y: 14, autoAlpha: 0, duration: 0.7, ease: ENTER }, 0.05)
      .from(lines, { yPercent: 110, duration: 1.05, stagger: 0.075, ease: "expo.out" }, 0.1)
      .from(".hero__body", { y: 18, autoAlpha: 0, duration: 0.8, ease: ENTER }, 0.45)
      .from(".hero__cta > *", { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: ENTER }, 0.55)
      .from("#now", { autoAlpha: 0, duration: 0.6, ease: ENTER }, 0.65)
      .from(".hero__figure", { yPercent: 8, autoAlpha: 0, duration: 1.1, ease: ENTER }, 0.2)
      .from(".seal", { scale: 0.8, autoAlpha: 0, duration: 0.9, ease: ENTER }, 0.6)
      .add(() => root.classList.add("is-lit"), 0.5);
    return tl;
  }

  function initHeroScroll() {
    if (!hasGSAP || REDUCED) return;
    const fig = $(".hero__figure");
    if (fig) {
      gsap.to(fig.querySelector("img"), {
        yPercent: 9, ease: "none",
        scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: 0.5 }
      });
    }
    const ring = $("#seal-ring");
    if (ring) {
      gsap.to(ring, {
        rotation: 210, transformOrigin: "50% 50%", ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "50% bottom", scrub: 0.8 }
      });
    }
  }

  /* ── 7. pairing: sticky list, only the live line at full contrast ───────── */
  function initPairing() {
    const items  = $$("[data-pair]");
    const frames = $$("[data-frame]");
    const count  = $("#pair-count");
    if (!items.length) return;

    const setActive = i => {
      items.forEach((el, n)  => el.dataset.on = n === i ? "1" : "0");
      frames.forEach((el, n) => el.dataset.on = n === i ? "1" : "0");
      if (count) count.textContent = `${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
    };

    if (!hasGSAP || REDUCED) { items.forEach(el => el.dataset.on = "1"); return; }

    items.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el, start: "top 62%", end: "bottom 45%",
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i)
      });
    });
    setActive(0);
  }

  /* ── 8. the case: draggable idle-float marks (E1) — the one indulgence ──── */
  function initCase() {
    const play = $("#play");
    const crumbs = $$(".crumb");
    if (!play || !crumbs.length) return;

    // chalk underline draws on when the section arrives
    const rule = $("#chalk-rule");
    if (rule && hasGSAP && !REDUCED) {
      const paths = $$("path", rule);
      paths.forEach(p => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      ScrollTrigger.create({
        trigger: rule, start: "top 88%", once: true,
        onEnter: () => gsap.to(paths, { strokeDashoffset: 0, duration: 1.1, stagger: 0.14, ease: ENTER })
      });
    }

    if (REDUCED || !hasGSAP || !window.Draggable) {
      crumbs.forEach(c => c.style.cursor = "default");
      return;
    }

    const float = el => {
      const d = gsap.utils.random(2.1, 3.6);
      gsap.to(el, {
        y: `+=${gsap.utils.random(-22, -12)}`, x: `+=${gsap.utils.random(-13, 13)}`,
        rotation: gsap.utils.random(-5, 5), scale: gsap.utils.random(1.02, 1.07),
        duration: d, ease: "sine.inOut", yoyo: true, repeat: -1
      });
    };

    crumbs.forEach((el, i) => {
      gsap.set(el, { rotation: gsap.utils.random(-11, 11), x: gsap.utils.random(-10, 10), y: gsap.utils.random(-10, 10) });
      gsap.delayedCall(i * 0.15, () => float(el));

      window.Draggable.create(el, {
        type: "x,y", bounds: play, dragResistance: 0.08, allowContextMenu: true,
        onPress() {
          play.dataset.touched = "1";
          gsap.killTweensOf(el);
          el.style.willChange = "transform";
          gsap.to(el, { scale: 1.22, duration: 0.1, filter: "drop-shadow(0 10px 14px rgba(30,21,18,.25))" });
        },
        onRelease() {
          gsap.to(el, {
            scale: 1, filter: "drop-shadow(0 0 0 rgba(30,21,18,0))",
            duration: 0.24, ease: "back.out(3)",
            onComplete() { el.style.willChange = ""; float(el); }
          });
        }
      });
    });

    // keyboard equivalent: nudge with the arrow keys when a mark has focus
    crumbs.forEach(el => {
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      el.setAttribute("aria-roledescription", "draggable mark");
      el.setAttribute("aria-label", el.getAttribute("aria-label").replace(
        "a drawn mark you can drag around", "a drawn mark. Drag it, or nudge it with the arrow keys"));
      el.addEventListener("keydown", ev => {
        const map = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] };
        const d = map[ev.key];
        if (!d) return;
        ev.preventDefault();
        play.dataset.touched = "1";
        gsap.killTweensOf(el);
        const dr = window.Draggable.get(el);
        const cx = +gsap.getProperty(el, "x") + d[0];
        const cy = +gsap.getProperty(el, "y") + d[1];
        const nx = dr ? gsap.utils.clamp(dr.minX, dr.maxX, cx) : cx;
        const ny = dr ? gsap.utils.clamp(dr.minY, dr.maxY, cy) : cy;
        gsap.to(el, { x: nx, y: ny, duration: 0.22, ease: "back.out(2)", onComplete: () => float(el) });
      });
    });
  }

  /* ── 9. menu: pinned horizontal rail on desktop, thumb rail on mobile ───── */
  function initRail() {
    const pin = $("#rail-pin"), track = $("#rail-track");
    if (!pin || !track || !hasGSAP) return;

    ScrollTrigger.matchMedia ? null : null;
    const mm = gsap.matchMedia();
    const cards = $$(".rail-card", track);
    const count = $("#rail-count"), bar = $("#rail-bar");
    const report = p => {
      if (bar) gsap.set(bar, { scaleX: p });
      if (count) {
        const i = Math.min(cards.length, Math.max(1, Math.round(p * (cards.length - 1)) + 1));
        count.textContent = `${String(i).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
      }
    };

    mm.add("(min-width: 62rem) and (prefers-reduced-motion: no-preference)", () => {
      const gutter = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + gutter());
      const tween = gsap.to(track, {
        x: () => -distance(), ease: "none",
        scrollTrigger: {
          trigger: pin, pin: pin, pinSpacing: true, scrub: 0.6,
          invalidateOnRefresh: true, anticipatePin: 1,
          start: "top top+=11%",
          end: () => "+=" + distance(),
          onUpdate: self => report(self.progress)
        }
      });
      return () => tween.scrollTrigger && tween.scrollTrigger.kill();
    });

    // Native scroll drives the same readout wherever the pin does not run:
    // on a phone, and on a desktop that has asked for reduced motion.
    mm.add("(max-width: 61.999rem), (prefers-reduced-motion: reduce)", () => {
      const onScroll = () => {
        const max = track.scrollWidth - track.clientWidth;
        report(max > 0 ? track.scrollLeft / max : 0);
      };
      onScroll();
      track.addEventListener("scroll", onScroll, { passive: true });
      return () => track.removeEventListener("scroll", onScroll);
    });
  }

  /* ── 10. the room: single-play peel-apart (E4), two magnitudes ──────────── */
  function initPeel() {
    if (!hasGSAP || REDUCED) return;
    const L = $('[data-peel="left"]'), R = $('[data-peel="right"]');
    if (!L || !R) return;
    const st = { trigger: "#peel-big", start: "top 88%", toggleActions: "play none none none" };
    gsap.matchMedia().add("(min-width: 44rem)", () => {
      gsap.fromTo(L, { rotation: 0, xPercent: 0 }, { rotation: -2.6, xPercent: -2, duration: 1, ease: "power2.out", scrollTrigger: st });
      gsap.fromTo(R, { rotation: 0, xPercent: 0 }, { rotation: 2.6, xPercent: 2, duration: 1, ease: "power2.out", scrollTrigger: st });
    });
    gsap.fromTo(".room__wide", { rotation: 0 }, { rotation: -1.2, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".room__wide", start: "top 90%", toggleActions: "play none none none" } });
  }

  /* ── 11. asked: corkboard, odd/even rotate opposite ways, 1:1 with scroll ─ */
  function initBoard() {
    const notes = $$("[data-note]");
    if (!notes.length || !hasGSAP || REDUCED) return;
    notes.forEach((n, i) => {
      gsap.fromTo(n, { rotation: i % 2 ? 2.6 : -2.6 }, {
        rotation: i % 2 ? -3 : 3, ease: "none",
        scrollTrigger: { trigger: "#board", start: "top 105%", end: "bottom -5%", scrub: true }
      });
    });
  }

  /* ── 12. the wordmark rises out of the floor ────────────────────────────── */
  function initMark() {
    const m = $("#mark");
    if (!m || !hasGSAP || REDUCED) return;
    gsap.from(m, {
      yPercent: 92, duration: 1.2, ease: ENTER,
      scrollTrigger: { trigger: ".mark", start: "top 96%", once: true }
    });
  }

  /* ── 13. the rail marks the hour you're standing in ─────────────────────── */
  const FLAT = "M1 5H33";
  const WAVE = "M1 5c5-6 6 6 11 0s6 6 11 0 5 4 10 0";

  function initRailMarks() {
    const marks = $$(".rail__mark");
    const links = $$(".nav__link");
    const dock  = $$("#dock a");
    if (!marks.length) return;

    const set = id => {
      marks.forEach(m => {
        const on = m.getAttribute("href") === "#" + id;
        m.dataset.on = on ? "1" : "0";
        const p = $("path", m);
        if (p) p.setAttribute("d", on ? WAVE : FLAT);
      });
      links.forEach(a => a.setAttribute("aria-current", a.getAttribute("href") === "#" + id ? "true" : "false"));
      dock.forEach(a => a.setAttribute("aria-current", a.getAttribute("href") === "#" + id ? "true" : "false"));
    };

    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) set(en.target.id); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    $$("section[data-marker]").forEach(s => io.observe(s));
  }

  /* ── 14. are we open right now? read straight off the printed hours ─────── */
  function initNow() {
    const rows = $$(".hours li[data-day]");
    if (!rows.length) return;
    $$(".now").forEach(el => el.setAttribute("aria-live", "polite"));
    const map = {};
    rows.forEach(r => {
      const times = $$("time", r);
      map[r.dataset.day] = times.length === 2
        ? [times[0].getAttribute("datetime"), times[1].getAttribute("datetime")]
        : null;
    });

    // Ireland: the café keeps local time, so read the clock in Europe/Dublin.
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Dublin", weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    });
    const read = () => Object.fromEntries(fmt.formatToParts(new Date()).map(p => [p.type, p.value]));
    const toMin = t => (+t.slice(0, 2)) * 60 + (+t.slice(3, 5));
    const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const state = () => {
      const parts = read();
      const today = parts.weekday;
      const mins = (+parts.hour) * 60 + (+parts.minute);
      const span = map[today];
      if (span && mins >= toMin(span[0]) && mins < toMin(span[1])) {
        const left = toMin(span[1]) - mins;
        return { today, open: true, msg: left <= 45 ? `Open — last orders in ${left} min` : "Open right now" };
      }
      if (span && mins < toMin(span[0])) {
        return { today, open: false, msg: `Opens at ${span[0].replace(":", ".")} today` };
      }
      const i = order.indexOf(today);
      for (let n = 1; n <= 7; n++) {
        const d = order[(i + n) % 7];
        if (map[d]) return { today, open: false, msg: `Closed — back ${n === 1 ? "tomorrow" : d} at ${map[d][0].replace(":", ".")}` };
      }
      return { today, open: false, msg: "Closed" };
    };

    const paint = () => {
      const { today, open, msg } = state();
      rows.forEach(r => {
        if (r.dataset.day === today) r.dataset.today = "1";
        else r.removeAttribute("data-today");
      });
      $$(".now").forEach(el => {
        el.dataset.open = open ? "1" : "0";
        const span = $("span", el);
        if (span.textContent !== msg) span.textContent = msg;
      });
    };

    paint();
    // a tab left open across half four must not still claim we are serving
    setInterval(paint, 60000);
  }

  /* ── 15. preloader: real load progress, then a shaped clear ─────────────── */
  function initPreloader(onDone) {
    const pre = $("#pre"), bar = $("#pre-bar"), num = $("#pre-n");
    if (!pre) { onDone(); return; }
    if (REDUCED || !hasGSAP) { finishLoad(); onDone(); return; }

    if (!bar || !num) { finishLoad(); onDone(); return; }

    // Watch the hero image element the browser actually resolved from the
    // <picture>, not a hard-coded URL that may be the wrong crop entirely.
    const hero = $(".hero__figure img");
    let done = 0, shown = 0;
    const total = 2;                          // hero image + fonts
    const step = () => {
      done++;
      const p = Math.min(1, done / total);
      gsap.to(bar, { scaleX: p, duration: 0.4, ease: ENTER });
      gsap.to({ v: shown }, {
        v: Math.round(p * 100), duration: 0.4, ease: ENTER,
        onUpdate() {
          shown = Math.max(shown, Math.round(this.targets()[0].v));
          num.textContent = shown;
        }
      });
      if (done >= total) clear();
    };

    let cleared = false;
    const clear = () => {
      if (cleared) return;
      cleared = true;
      gsap.timeline({ onComplete() { finishLoad(); onDone(); } })
        .to(".pre__in", { autoAlpha: 0, y: -14, duration: 0.4, ease: "power2.in" })
        .to(pre, { clipPath: "ellipse(150% 0% at 50% 0%)", duration: 0.9, ease: "expo.inOut" }, 0.2);
    };

    if (!hero || hero.complete) step();
    else {
      hero.addEventListener("load", step, { once: true });
      hero.addEventListener("error", step, { once: true });
    }
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(step);
    setTimeout(clear, 3500);                  // never hold the page hostage
  }

  /* ── 16. reduced motion: stop everything, keep the content ──────────────── */
  function initReducedGuard() {
    if (!hasGSAP) return;
    gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
      if (lenis) {
        lenis.destroy();
        lenis = null;
        // lenis was the only thing driving the header state; hand it back
        if (navUpdate) window.addEventListener("scroll", () => navUpdate(window.scrollY), { passive: true });
      }
      gsap.globalTimeline.getChildren().forEach(t => t.progress(1).kill());
      ScrollTrigger.getAll().forEach(t => t.kill(false));
      revealAll();
      $$("[data-pair]").forEach(el => el.dataset.on = "1");
      $$(".crumb").forEach(el => gsap.set(el, { clearProps: "all" }));
    });
  }

  /* ── boot ────────────────────────────────────────────────────────────────
     Preloader is built last and wired first: nothing else starts until the
     clear finishes, so the hero entrance is one timeline, not two. */
  function boot() {
    try {
      initScroll();
      initReducedGuard();
      initGround();
      initReveal();
      initMarquee();
      initNav();
      initPairing();
      initCase();
      initRail();
      initPeel();
      initBoard();
      initMark();
      initRailMarks();
      initNow();
      initHeroScroll();
      if (lenis) lenis.stop();
      initPreloader(() => {
        if (lenis) lenis.start();
        const tl = heroTimeline();
        if (hasGSAP) ScrollTrigger.refresh();
        return tl;
      });
    } catch (err) {
      console.error("[blondie]", err);
      finishLoad();
      revealAll();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
