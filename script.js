const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const themeToggle = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
const heroArt = document.querySelector(".hero-art");
const monitorScene = document.querySelector(".monitor-scene");
const openingSequence = document.querySelector(".opening-sequence");
const openingMouse = openingSequence
  ? openingSequence.querySelector(".opening-mouse")
  : null;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (openingSequence && openingMouse) {
  const lockedElements = [
    document.querySelector(".site-header"),
    document.querySelector("main"),
    document.querySelector(".site-footer")
  ].filter(Boolean);
  const blockedScrollKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
  let isEntering = false;
  let hasEntered = false;

  const preventScroll = (event) => {
    if (!hasEntered) {
      event.preventDefault();
    }
  };
  const keepIntroAtTop = () => {
    if (!hasEntered && window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
  };
  const preventKeyboardScroll = (event) => {
    if (!hasEntered && blockedScrollKeys.has(event.key)) {
      event.preventDefault();
    }
  };
  const enterPortfolio = () => {
    if (isEntering || hasEntered) {
      return;
    }

    isEntering = true;
    openingSequence.classList.add("is-complete");
    openingMouse.disabled = true;
    openingMouse.setAttribute("aria-label", "Opening portfolio");

    window.setTimeout(() => {
      hasEntered = true;
      isEntering = false;
      document.documentElement.classList.remove("intro-locked");
      window.scrollTo(0, 0);
      lockedElements.forEach((element) => {
        element.inert = false;
      });
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyboardScroll);
      window.removeEventListener("scroll", keepIntroAtTop);
    }, prefersReducedMotion ? 50 : 450);
  };

  document.documentElement.classList.add("intro-locked");
  window.scrollTo(0, 0);
  lockedElements.forEach((element) => {
    element.inert = true;
  });
  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });
  window.addEventListener("keydown", preventKeyboardScroll);
  window.addEventListener("scroll", keepIntroAtTop, { passive: true });
  openingMouse.addEventListener("click", enterPortfolio);

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest(".opening-mouse") === null && !hasEntered) {
      openingMouse.focus();
    }
  });
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("is-open");
    }
  });
}

if (themeToggle) {
  const themeIcon = themeToggle.querySelector(".theme-icon");
  const themeLabel = themeToggle.querySelector(".theme-label");

  themeToggle.addEventListener("click", () => {
    const isLight = document.documentElement.dataset.theme !== "light";
    document.documentElement.dataset.theme = isLight ? "light" : "dark";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} mode`);

    if (themeColor) {
      themeColor.setAttribute("content", isLight ? "#cbd1dc" : "#090b12");
    }

    if (themeIcon && themeLabel) {
      themeIcon.textContent = isLight ? "☾" : "☼";
      themeLabel.textContent = isLight ? "Dark mode" : "Light mode";
    }
  });
}

const skillCards = document.querySelectorAll(".skill-card");
skillCards.forEach((item, index) => {
  item.style.setProperty("--stack-top", `${112 + index * 20}px`);
  item.style.setProperty("--stack-z", String(index + 1));
});

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealGroups = document.querySelectorAll(".education-grid, .skills-grid, .projects-grid");
  const revealItems = [];

  revealGroups.forEach((group) => {
    group.querySelectorAll(".education-card, .skill-card, .project-card").forEach((item, index) => {
      item.classList.add("reveal-item");
      const revealDelay = group.classList.contains("skills-grid") ? 0 : index * 110;
      item.style.setProperty("--reveal-delay", `${revealDelay}ms`);
      revealItems.push(item);
    });
  });

  document.querySelectorAll(".section-heading, .about-content > p, .about-stats > div, .about-focus").forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.setProperty("--reveal-delay", `${index * 90}ms`);
    revealItems.push(item);
  });

  document.querySelectorAll(".hero-copy, .hero-art").forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.setProperty("--reveal-delay", `${index * 120}ms`);
    revealItems.push(item);
  });

  if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -35px 0px" });

    document.documentElement.classList.add("has-scroll-reveal");
    revealItems.forEach((item) => revealObserver.observe(item));
  }
}

if ("requestAnimationFrame" in window) {
  let pointerFrame = 0;
  let pointerPosition = null;

  const resetPointerEffects = () => {
    document.documentElement.style.setProperty("--cursor-x", "50vw");
    document.documentElement.style.setProperty("--cursor-y", "42vh");
    document.documentElement.style.setProperty("--pointer-shift-x", "0px");
    document.documentElement.style.setProperty("--pointer-shift-y", "0px");
    document.documentElement.style.setProperty("--pointer-tilt-x", "0deg");
    document.documentElement.style.setProperty("--pointer-tilt-y", "0deg");

    if (!monitorScene) {
      return;
    }

    monitorScene.style.setProperty("--monitor-tilt-x", "0deg");
    monitorScene.style.setProperty("--monitor-tilt-y", "0deg");
    monitorScene.style.setProperty("--monitor-move-x", "0px");
    monitorScene.style.setProperty("--monitor-move-y", "0px");
  };

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") {
      return;
    }

    pointerPosition = { x: event.clientX, y: event.clientY };
    if (pointerFrame) {
      return;
    }

    pointerFrame = window.requestAnimationFrame(() => {
      pointerFrame = 0;
      if (!pointerPosition) {
        return;
      }

      document.documentElement.style.setProperty("--cursor-x", `${pointerPosition.x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${pointerPosition.y}px`);
      const viewportX = pointerPosition.x / window.innerWidth * 2 - 1;
      const viewportY = pointerPosition.y / window.innerHeight * 2 - 1;
      document.documentElement.style.setProperty("--pointer-shift-x", `${(-viewportX * 9).toFixed(2)}px`);
      document.documentElement.style.setProperty("--pointer-shift-y", `${(-viewportY * 9).toFixed(2)}px`);
      if (!prefersReducedMotion) {
        document.documentElement.style.setProperty("--pointer-tilt-x", `${(-viewportY * 2.5).toFixed(2)}deg`);
        document.documentElement.style.setProperty("--pointer-tilt-y", `${(viewportX * 2.5).toFixed(2)}deg`);
      }

      if (prefersReducedMotion || !heroArt || !monitorScene) {
        return;
      }

      const bounds = heroArt.getBoundingClientRect();
      const deltaX = pointerPosition.x - (bounds.left + bounds.width / 2);
      const deltaY = pointerPosition.y - (bounds.top + bounds.height / 2);
      const distance = Math.hypot(deltaX, deltaY);
      const radius = Math.max(bounds.width, bounds.height) * 1.15;

      if (distance >= radius) {
        monitorScene.style.setProperty("--monitor-tilt-x", `${(-viewportY * 3).toFixed(2)}deg`);
        monitorScene.style.setProperty("--monitor-tilt-y", `${(viewportX * 3).toFixed(2)}deg`);
        monitorScene.style.setProperty("--monitor-move-x", `${(viewportX * 5).toFixed(2)}px`);
        monitorScene.style.setProperty("--monitor-move-y", `${(viewportY * 4).toFixed(2)}px`);
        return;
      }

      const proximity = 1 - distance / radius;
      const influence = proximity * proximity * (3 - 2 * proximity);
      const directionX = distance === 0 ? 0 : deltaX / distance;
      const directionY = distance === 0 ? 0 : deltaY / distance;

      monitorScene.style.setProperty("--monitor-tilt-x", `${(-directionY * 7 * influence - viewportY * 2).toFixed(2)}deg`);
      monitorScene.style.setProperty("--monitor-tilt-y", `${(directionX * 9 * influence + viewportX * 2).toFixed(2)}deg`);
      monitorScene.style.setProperty("--monitor-move-x", `${(viewportX * 5 + directionX * 12 * influence).toFixed(2)}px`);
      monitorScene.style.setProperty("--monitor-move-y", `${(viewportY * 4 + directionY * 9 * influence).toFixed(2)}px`);
    });
  });

  if (heroArt && monitorScene && !prefersReducedMotion) {
    let activeTouchId = null;

    const updateTouchTilt = (event) => {
      const bounds = heroArt.getBoundingClientRect();
      const horizontal = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
      const vertical = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));

      monitorScene.style.setProperty("--monitor-tilt-x", `${(-vertical * 8).toFixed(2)}deg`);
      monitorScene.style.setProperty("--monitor-tilt-y", `${(horizontal * 10).toFixed(2)}deg`);
      monitorScene.style.setProperty("--monitor-move-x", `${(horizontal * 8).toFixed(2)}px`);
      monitorScene.style.setProperty("--monitor-move-y", `${(vertical * 6).toFixed(2)}px`);
    };

    heroArt.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "touch") {
        return;
      }

      activeTouchId = event.pointerId;
      heroArt.classList.add("is-touching");
      heroArt.setPointerCapture(event.pointerId);
      updateTouchTilt(event);
    });

    heroArt.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch" && event.pointerId === activeTouchId) {
        updateTouchTilt(event);
      }
    });

    const resetTouchTilt = (event) => {
      if (event.pointerId !== activeTouchId) {
        return;
      }

      activeTouchId = null;
      heroArt.classList.remove("is-touching");
      resetPointerEffects();
    };

    heroArt.addEventListener("pointerup", resetTouchTilt);
    heroArt.addEventListener("pointercancel", resetTouchTilt);
  }

  const resetPointerPosition = () => {
    pointerPosition = null;
    resetPointerEffects();
  };

  window.addEventListener("blur", resetPointerPosition);
  document.addEventListener("pointerout", (event) => {
    if (event.pointerType !== "touch" && event.relatedTarget === null) {
      resetPointerPosition();
    }
  });
}
