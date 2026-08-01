const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const targets = document.querySelectorAll<HTMLElement>("[data-reveal], .wave-divider");

if (prefersReducedMotion) {
  targets.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const group = el.closest("[data-reveal-group]");
          if (group) {
            const children = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
            const index = children.indexOf(el);
            el.style.setProperty("--i", String(Math.min(index, 6)));
          }
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      }
    },
    { rootMargin: "0px 0px -15% 0px", threshold: 0.1 }
  );

  targets.forEach((el) => observer.observe(el));
}
