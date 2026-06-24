(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-menu");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  requestAnimationFrame(() => body.classList.add("is-ready"));

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const currentPage = body.dataset.page;
  const activeLink = document.querySelector(`[data-nav="${currentPage}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "page");
  }

  const setHeaderState = () => header?.classList.toggle("scrolled", window.scrollY > 18);
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeMenu = () => {
    menu?.classList.remove("open");
    menuButton?.classList.remove("open");
    body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menu?.classList.toggle("open");
    menuButton.classList.toggle("open", isOpen);
    body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => event.key === "Escape" && closeMenu());
  window.addEventListener("resize", () => window.innerWidth > 980 && closeMenu());

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const glow = document.querySelector(".cursor-glow");
  if (glow && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
      glow.style.opacity = "1";
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", () => { glow.style.opacity = "0"; });
  }

  // Premium ambient layers and scroll feedback.
  const ambientVignette = document.createElement("div");
  ambientVignette.className = "ambient-vignette";
  ambientVignette.setAttribute("aria-hidden", "true");
  body.appendChild(ambientVignette);

  const scrollProgress = document.createElement("div");
  scrollProgress.className = "scroll-progress";
  scrollProgress.setAttribute("aria-hidden", "true");
  body.appendChild(scrollProgress);

  const pageCurtain = document.createElement("div");
  pageCurtain.className = "page-curtain";
  pageCurtain.setAttribute("aria-hidden", "true");
  body.appendChild(pageCurtain);

  const updateScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
  };
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  // Accurate, lightweight inline SVG icons. GitHub uses the official mark.
  const iconPaths = {
    github: '<path d="M12 .7C5.7.7.7 5.8.7 12.2c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.3.8-.6v-2.3c-3.2.7-3.9-1.4-3.9-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.5-.3-5.2-1.3-5.2-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C15.8 4.7 16.8 5 16.8 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.2 5.7.4.4.8 1.1.8 2.2v3.4c0 .4.2.7.8.6a11.6 11.6 0 0 0 7.8-10.9C23.3 5.8 18.3.7 12 .7Z"/>',
    linkedin: '<path d="M5.4 21H1V7.2h4.4V21ZM3.2 5.3A2.6 2.6 0 1 1 3.2.1a2.6 2.6 0 0 1 0 5.2ZM23 21h-4.4v-6.7c0-1.6 0-3.7-2.3-3.7s-2.6 1.7-2.6 3.5V21H9.3V7.2h4.2v1.9h.1c.6-1.1 2-2.3 4.1-2.3 4.4 0 5.3 2.9 5.3 6.7V21Z"/>',
    mail: '<path d="M2.5 5.5h19v13h-19v-13Zm1.1 1.2 8.4 6 8.4-6M3.7 17.3l5.8-5m10.8 5-5.8-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  const renderIcon = (element) => {
    const name = element.dataset.icon;
    if (!iconPaths[name]) return;
    element.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${iconPaths[name]}</svg>`;
  };

  document.querySelectorAll("[data-icon]").forEach(renderIcon);

  const techIconPaths = {
    csharp: '<path d="M32 4 55 17v30L32 60 9 47V17L32 4Z" fill="none" stroke="currentColor" stroke-width="3"/><text x="32" y="39" text-anchor="middle" fill="currentColor" font-size="19" font-weight="800" font-family="Arial,sans-serif">C#</text>',
    dotnet: '<rect x="7" y="11" width="50" height="42" rx="10" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="16" cy="42" r="2.5" fill="currentColor"/><text x="34" y="39" text-anchor="middle" fill="currentColor" font-size="15" font-weight="800" font-family="Arial,sans-serif">.NET</text>',
    rest: '<path d="M8 22h34m0 0-8-8m8 8-8 8M56 42H22m0 0 8-8m-8 8 8 8" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="55" cy="42" r="4" fill="none" stroke="currentColor" stroke-width="3"/>',
    sqlserver: '<ellipse cx="32" cy="15" rx="20" ry="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M12 15v32c0 4.4 9 8 20 8s20-3.6 20-8V15M12 31c0 4.4 9 8 20 8s20-3.6 20-8" fill="none" stroke="currentColor" stroke-width="3"/><path d="m39 23 9-4-3 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>',
    efcore: '<path d="M32 5 55 18v28L32 59 9 46V18L32 5Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 23h21M22 32h17M22 41h21" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><text x="13" y="37" fill="currentColor" font-size="9" font-weight="800" font-family="Arial,sans-serif">EF</text>',
    database: '<ellipse cx="32" cy="14" rx="21" ry="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M11 14v36c0 4.4 9.4 8 21 8s21-3.6 21-8V14M11 32c0 4.4 9.4 8 21 8s21-3.6 21-8" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="44" cy="47" r="3" fill="currentColor"/>',
    integration: '<circle cx="14" cy="32" r="7" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="15" r="7" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="49" r="7" fill="none" stroke="currentColor" stroke-width="3"/><path d="M21 29 43 18M21 35l22 11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    analysis: '<rect x="7" y="8" width="18" height="13" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><rect x="39" y="43" width="18" height="13" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="17" cy="49" r="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M25 14h14c6 0 11 5 11 11v12M39 49H25" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    docs: '<path d="M17 7h24l9 9v41H17V7Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M41 7v11h9M25 29h17M25 38h17M25 47h12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M10 15v42h30" fill="none" stroke="currentColor" stroke-width="2.5" opacity=".55"/>',
    flutter: '<path d="m37 5-27 27 9 9L55 5H37Zm0 27-13 13 9 9 9-9 13-13H37Zm-4 22 9-9 9 9-9 9-9-9Z" fill="currentColor" opacity=".95"/>'
  };

  const renderTechIcon = (element) => {
    const name = element.dataset.techIcon;
    if (name === "github") {
      element.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${iconPaths.github}</svg>`;
    } else if (techIconPaths[name]) {
      element.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">${techIconPaths[name]}</svg>`;
    }
  };
  document.querySelectorAll("[data-tech-icon]").forEach(renderTechIcon);
  document.querySelectorAll('.footer-links a[href*="github.com"], .footer-links a[href*="linkedin.com"], .footer-links a[href^="mailto:"]').forEach((link) => {
    if (link.querySelector("[data-icon]")) return;
    const icon = document.createElement("i");
    icon.className = "brand-icon";
    icon.dataset.icon = link.href.includes("github.com") ? "github" : link.href.includes("linkedin.com") ? "linkedin" : "mail";
    icon.setAttribute("aria-hidden", "true");
    renderIcon(icon);
    link.prepend(icon);
  });

  // Smooth transition for internal HTML navigation while preserving normal browser behavior.
  if (!reduceMotion) {
    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (link.target === "_blank" || link.hasAttribute("download")) return;
        event.preventDefault();
        body.classList.add("is-leaving");
        window.setTimeout(() => { window.location.href = link.href; }, 260);
      });
    });
  }

  // Subtle physical depth for cards on precise pointer devices.
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".focus-card, .certificate-card, .contact-card, .project-teaser, .skills-panel").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", `${(-y * 3.2).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(x * 4).toFixed(2)}deg`);
      }, { passive: true });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });

    const portraitStage = document.querySelector(".portrait-stage");
    const portrait = portraitStage?.querySelector(".portrait-card");
    portraitStage?.addEventListener("pointermove", (event) => {
      const rect = portraitStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      portrait?.style.setProperty("--portrait-x", `${(x * 5).toFixed(2)}deg`);
      portrait?.style.setProperty("--portrait-y", `${(-y * 4).toFixed(2)}deg`);
      portrait?.style.setProperty("--light-x", `${((x + 0.5) * 100).toFixed(1)}%`);
      portrait?.style.setProperty("--light-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    }, { passive: true });
    portraitStage?.addEventListener("pointerleave", () => {
      portrait?.style.setProperty("--portrait-x", "0deg");
      portrait?.style.setProperty("--portrait-y", "0deg");
    });
  }

  // Interactive zero-gravity technology constellation.
  const constellation = document.querySelector("[data-constellation]");
  if (constellation) {
    const constellationCanvas = constellation.querySelector(".constellation-canvas");
    const constellationContext = constellationCanvas.getContext("2d");
    const nodeElements = [...constellation.querySelectorAll(".skill-node")];
    const titleOutput = constellation.querySelector("[data-skill-title]");
    const descriptionOutput = constellation.querySelector("[data-skill-description]");
    const indexOutput = constellation.querySelector(".skill-readout-index");
    const pointer = { x: 0, y: 0, active: false };
    let constellationWidth = 0;
    let constellationHeight = 0;
    let constellationRatio = 1;
    let selectedIndex = 0;
    let lockedSelection = false;
    let constellationVisible = true;
    let constellationFrame;

    const states = nodeElements.map((element, index) => ({
      element,
      name: element.dataset.skill,
      related: element.dataset.related.split(","),
      x: 0, y: 0,
      vx: Math.cos(index * 1.91) * (0.08 + (index % 3) * 0.025),
      vy: Math.sin(index * 1.47) * (0.07 + (index % 4) * 0.018),
      width: 100, height: 34,
      phase: index * 0.73
    }));

    const updateReadout = (state, index) => {
      titleOutput.textContent = state.name;
      descriptionOutput.textContent = state.element.dataset.description;
      indexOutput.textContent = `SYS / ${String(index + 1).padStart(2, "0")}`;
    };

    const setSelection = (index, lock = false) => {
      selectedIndex = index;
      lockedSelection = lock;
      const selected = states[index];
      constellation.classList.add("has-focus");
      states.forEach((state, stateIndex) => {
        const isActive = stateIndex === index;
        const isRelated = selected.related.includes(state.name);
        state.element.classList.toggle("is-active", isActive);
        state.element.classList.toggle("is-related", isRelated);
        state.element.classList.toggle("is-dimmed", !isActive && !isRelated);
        state.element.setAttribute("aria-pressed", String(isActive && lockedSelection));
      });
      updateReadout(selected, index);
    };

    const clearSelection = () => {
      lockedSelection = false;
      constellation.classList.remove("has-focus");
      states.forEach((state) => {
        state.element.classList.remove("is-active", "is-related", "is-dimmed");
        state.element.setAttribute("aria-pressed", "false");
      });
    };

    states.forEach((state, index) => {
      state.element.setAttribute("aria-pressed", "false");
      state.element.addEventListener("pointerenter", () => { if (!lockedSelection) setSelection(index); });
      state.element.addEventListener("pointerleave", () => { if (!lockedSelection) clearSelection(); });
      state.element.addEventListener("focus", () => { if (!lockedSelection) setSelection(index); });
      state.element.addEventListener("blur", () => { if (!lockedSelection) clearSelection(); });
      state.element.addEventListener("click", () => {
        if (lockedSelection && selectedIndex === index) clearSelection();
        else setSelection(index, true);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lockedSelection) clearSelection();
    });

    const resizeConstellation = () => {
      const rect = constellation.getBoundingClientRect();
      constellationWidth = rect.width;
      constellationHeight = rect.height;
      constellationRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      constellationCanvas.width = Math.round(constellationWidth * constellationRatio);
      constellationCanvas.height = Math.round(constellationHeight * constellationRatio);
      constellationContext.setTransform(constellationRatio, 0, 0, constellationRatio, 0, 0);

      const centerX = constellationWidth / 2;
      const centerY = constellationHeight * 0.4;
      states.forEach((state, index) => {
        const rectNode = state.element.getBoundingClientRect();
        state.width = rectNode.width;
        state.height = rectNode.height;
        if (!state.x || state.x > constellationWidth) {
          const angle = index * 2.399963;
          const layer = 0.56 + (index % 4) * 0.1;
          state.x = centerX + Math.cos(angle) * constellationWidth * 0.39 * layer;
          state.y = centerY + Math.sin(angle) * constellationHeight * 0.34 * layer;
        }
      });
    };

    const focusedTarget = (state, stateIndex) => {
      const selected = states[selectedIndex];
      const centerX = constellationWidth / 2;
      const centerY = constellationHeight * 0.37;
      if (stateIndex === selectedIndex) return { x: centerX, y: centerY };
      const relatedIndex = selected.related.indexOf(state.name);
      if (relatedIndex >= 0) {
        const count = selected.related.length;
        const angle = -Math.PI / 2 + relatedIndex * (Math.PI * 2 / count);
        const radiusX = Math.min(constellationWidth * 0.27, 190);
        const radiusY = Math.min(constellationHeight * 0.2, 130);
        return { x: centerX + Math.cos(angle) * radiusX, y: centerY + Math.sin(angle) * radiusY };
      }
      return null;
    };

    const drawConstellation = (time = 0) => {
      if (!constellationVisible || document.hidden) {
        constellationFrame = requestAnimationFrame(drawConstellation);
        return;
      }

      constellationContext.clearRect(0, 0, constellationWidth, constellationHeight);
      const focused = constellation.classList.contains("has-focus");
      const bottomLimit = constellationHeight - (window.innerWidth <= 720 ? 122 : 130);

      states.forEach((state, index) => {
        const target = focused ? focusedTarget(state, index) : null;
        if (target) {
          state.vx += (target.x - state.x) * 0.0038;
          state.vy += (target.y - state.y) * 0.0038;
          state.vx *= 0.87;
          state.vy *= 0.87;
        } else {
          state.vx += Math.cos(time * 0.00032 + state.phase) * 0.0013;
          state.vy += Math.sin(time * 0.00028 + state.phase) * 0.0011;

          if (pointer.active) {
            const dx = pointer.x - state.x;
            const dy = pointer.y - state.y;
            const distance = Math.max(Math.hypot(dx, dy), 1);
            if (distance < 190) {
              const strength = (1 - distance / 190) * 0.009;
              state.vx += dx / distance * strength;
              state.vy += dy / distance * strength;
            }
          }
          state.vx *= 0.995;
          state.vy *= 0.995;
        }

        state.x += state.vx;
        state.y += state.vy;
        const halfWidth = state.width / 2;
        const halfHeight = state.height / 2;
        if (state.x < 18 + halfWidth) { state.x = 18 + halfWidth; state.vx = Math.abs(state.vx); }
        if (state.x > constellationWidth - 18 - halfWidth) { state.x = constellationWidth - 18 - halfWidth; state.vx = -Math.abs(state.vx); }
        if (state.y < 20 + halfHeight) { state.y = 20 + halfHeight; state.vy = Math.abs(state.vy); }
        if (state.y > bottomLimit - halfHeight) { state.y = bottomLimit - halfHeight; state.vy = -Math.abs(state.vy); }
      });

      // Gentle collision separation keeps every label readable.
      for (let first = 0; first < states.length; first += 1) {
        for (let second = first + 1; second < states.length; second += 1) {
          const a = states[first];
          const b = states[second];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const minX = (a.width + b.width) / 2 + 7;
          const minY = (a.height + b.height) / 2 + 5;
          if (Math.abs(dx) < minX && Math.abs(dy) < minY) {
            const distance = Math.max(Math.hypot(dx, dy), 1);
            const push = 0.045;
            const px = dx / distance * push;
            const py = dy / distance * push;
            a.vx -= px; a.vy -= py; b.vx += px; b.vy += py;
          }
        }
      }

      // Draw quiet relationships; selected clusters become more visible.
      for (let first = 0; first < states.length; first += 1) {
        for (let second = first + 1; second < states.length; second += 1) {
          const a = states[first];
          const b = states[second];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          const linked = focused && (first === selectedIndex || second === selectedIndex) && (states[selectedIndex].related.includes(a.name) || states[selectedIndex].related.includes(b.name));
          if (distance < 175 || linked) {
            constellationContext.beginPath();
            constellationContext.moveTo(a.x, a.y);
            constellationContext.lineTo(b.x, b.y);
            constellationContext.strokeStyle = linked ? "rgba(56,189,248,.48)" : `rgba(59,130,246,${Math.max(0, .11 * (1 - distance / 175))})`;
            constellationContext.lineWidth = linked ? 1 : .6;
            constellationContext.stroke();
          }
        }
      }

      states.forEach((state, index) => {
        const scale = focused && index === selectedIndex ? 1.08 : 1;
        state.element.style.transform = `translate3d(${(state.x - state.width / 2).toFixed(2)}px,${(state.y - state.height / 2).toFixed(2)}px,0) scale(${scale})`;
      });
      constellationFrame = requestAnimationFrame(drawConstellation);
    };

    constellation.addEventListener("pointermove", (event) => {
      const rect = constellation.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    }, { passive: true });
    constellation.addEventListener("pointerleave", () => { pointer.active = false; });

    if ("ResizeObserver" in window) new ResizeObserver(resizeConstellation).observe(constellation);
    else window.addEventListener("resize", resizeConstellation, { passive: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => { constellationVisible = entry.isIntersecting; }, { rootMargin: "120px" }).observe(constellation);
    }

    resizeConstellation();
    updateReadout(states[0], 0);
    if (!reduceMotion) drawConstellation();
  }

  const canvas = document.querySelector(".network-canvas");
  if (!canvas || reduceMotion) return;
  const context = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let points = [];
  let animationFrame;

  const createPoints = () => {
    const count = Math.min(42, Math.max(16, Math.floor(width / 42)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      radius: Math.random() * 1.1 + 0.4
    }));
  };

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = document.documentElement.clientWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    createPoints();
  };

  const drawNetwork = () => {
    context.clearRect(0, 0, width, height);
    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;

      context.beginPath();
      context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(56, 189, 248, .38)";
      context.fill();

      for (let next = index + 1; next < points.length; next += 1) {
        const other = points[next];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance < 135) {
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - distance / 135)})`;
          context.lineWidth = 0.6;
          context.stroke();
        }
      }
    }
    animationFrame = requestAnimationFrame(drawNetwork);
  };

  resizeCanvas();
  drawNetwork();
  window.addEventListener("resize", resizeCanvas, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animationFrame);
    else drawNetwork();
  });
})();
