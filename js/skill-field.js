(() => {
  "use strict";

  const field = document.querySelector("[data-skill-field]");
  if (!field) return;

  const nodes = [...field.querySelectorAll(".skill-orb")];
  const categories = ["languages", "backend", "databases", "tools", "productivity", "other"];
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let organized = !finePointer || window.innerWidth <= 720 || reduceMotion;
  let visible = true;

  const states = nodes.map((node, index) => ({
    node,
    category: node.dataset.category,
    x: 0,
    y: 0,
    vx: Math.cos(index * 1.73) * (0.1 + (index % 3) * 0.02),
    vy: Math.sin(index * 1.37) * (0.08 + (index % 4) * 0.02),
    size: 72,
    phase: index * 0.81
  }));

  const targetFor = (state) => {
    const categoryIndex = categories.indexOf(state.category);
    const group = states.filter((item) => item.category === state.category);
    const index = group.indexOf(state);
    const mobile = window.innerWidth <= 720;
    if (mobile) {
      const rows = [92, 250, 390, 535, 705, 850];
      const columns = Math.min(3, group.length);
      return {
        x: width * ((index % columns) + 1) / (columns + 1),
        y: rows[categoryIndex] + Math.floor(index / columns) * 82
      };
    }
    const rows = [105, 245, 385, 525, 665, 805];
    const padding = Math.max(125, width * 0.12);
    const available = width - padding * 2;
    return {
      x: group.length === 1 ? width / 2 : padding + available * index / (group.length - 1),
      y: rows[categoryIndex]
    };
  };

  const setOrganized = (value) => {
    if (!finePointer && !value) return;
    organized = value;
    field.classList.toggle("is-organized", value);
  };

  const resize = () => {
    const rect = field.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    states.forEach((state, index) => {
      state.size = state.node.getBoundingClientRect().width;
      if (!state.x || state.x > width) {
        const angle = index * 2.399963;
        state.x = width / 2 + Math.cos(angle) * width * (0.27 + index % 3 * 0.045);
        state.y = height * 0.44 + Math.sin(angle) * height * (0.27 + index % 2 * 0.035);
      }
    });
    if (!finePointer || window.innerWidth <= 720) organized = true;
    field.classList.toggle("is-organized", organized);
    if (window.innerWidth <= 720) {
      states.forEach((state) => {
        const target = targetFor(state);
        state.x = target.x;
        state.y = target.y;
        state.vx = 0;
        state.vy = 0;
        state.node.style.transform = `translate3d(${target.x - state.size / 2}px,${target.y - state.size / 2}px,0)`;
      });
    }
  };

  field.addEventListener("pointerenter", () => setOrganized(true));
  field.addEventListener("mousemove", () => {
    if (!organized) setOrganized(true);
  }, { passive: true });
  document.addEventListener("mousemove", (event) => {
    if (!finePointer || field.matches(":focus-within")) return;
    const rect = field.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (inside !== organized) setOrganized(inside);
  }, { passive: true });
  field.addEventListener("pointerleave", () => {
    if (!field.matches(":focus-within") && window.innerWidth > 720) setOrganized(false);
  });
  field.addEventListener("focusin", () => setOrganized(true));
  field.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!field.matches(":focus-within") && window.innerWidth > 720) setOrganized(false);
    }, 0);
  });

  const animate = (time = 0) => {
    if (visible && !document.hidden) {
      states.forEach((state) => {
        if (organized) {
          const target = targetFor(state);
          state.vx += (target.x - state.x) * 0.006;
          state.vy += (target.y - state.y) * 0.006;
          state.vx *= 0.82;
          state.vy *= 0.82;
        } else {
          state.vx += Math.cos(time * 0.00035 + state.phase) * 0.00125;
          state.vy += Math.sin(time * 0.00029 + state.phase) * 0.00105;
          state.vx *= 0.996;
          state.vy *= 0.996;
        }

        state.x += state.vx;
        state.y += state.vy;
        const radius = state.size / 2;
        if (state.x < 22 + radius) { state.x = 22 + radius; state.vx = Math.abs(state.vx); }
        if (state.x > width - 22 - radius) { state.x = width - 22 - radius; state.vx = -Math.abs(state.vx); }
        if (state.y < 25 + radius) { state.y = 25 + radius; state.vy = Math.abs(state.vy); }
        if (state.y > height - 25 - radius) { state.y = height - 25 - radius; state.vy = -Math.abs(state.vy); }
        state.node.style.transform = `translate3d(${(state.x - radius).toFixed(2)}px,${(state.y - radius).toFixed(2)}px,0)`;
      });
    }
    requestAnimationFrame(animate);
  };

  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(field);
  else window.addEventListener("resize", resize, { passive: true });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "120px" }).observe(field);
  }

  resize();
  if (reduceMotion) {
    states.forEach((state) => {
      const target = targetFor(state);
      state.node.style.transform = `translate3d(${target.x - state.size / 2}px,${target.y - state.size / 2}px,0)`;
    });
  } else {
    requestAnimationFrame(animate);
  }
})();
