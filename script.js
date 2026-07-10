(() => {
  const header = document.getElementById("site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (navToggle && nav && header) {
    const setMenuOpen = (open) => {
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      header.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };

    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof target.focus === "function") {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      history.pushState(null, "", id);
    });
  });

  const revealEls = document.querySelectorAll(
    ".stat, .gallery-item, .process-step, .review, .trust-item"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const statNumbers = document.querySelectorAll(".stat-number[data-count]");
  if ("IntersectionObserver" in window && statNumbers.length) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statNumbers.forEach((el) => statsObserver.observe(el));
  } else {
    statNumbers.forEach((el) => {
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const target = parseFloat(el.dataset.count || "0");
      el.textContent = decimals > 0 ? target.toFixed(decimals) : String(Math.round(target));
    });
  }

  if (form && formStatus) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      formStatus.classList.remove("is-success", "is-error");

      if (!form.checkValidity()) {
        formStatus.textContent = "Please complete all required fields.";
        formStatus.classList.add("is-error");
        const firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      formStatus.textContent =
        "Thank you — your estimate request has been received. We’ll be in touch within one business day.";
      formStatus.classList.add("is-success");
      form.reset();
    });
  }

  const initServicesCarousel = () => {
    const root = document.querySelector("[data-services-carousel]");
    if (!root) return;

    const viewport = root.querySelector(".services-carousel-viewport");
    const track = root.querySelector(".services-carousel-track");
    if (!viewport || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      root.classList.add("is-static");
      const hint = root.querySelector(".services-carousel-hint");
      if (hint) hint.textContent = "Swipe to browse services";
      return;
    }

    const originals = Array.from(track.children);
    if (!originals.length) return;

    originals.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("[href], button, input, select, textarea").forEach((el) => {
        el.setAttribute("tabindex", "-1");
      });
      track.appendChild(clone);
    });

    let offset = 0;
    let setWidth = 0;
    const speed = 0.032;
    let dragging = false;
    let running = true;
    let pointerId = null;
    let startX = 0;
    let startOffset = 0;
    let lastX = 0;
    let lastMoveTime = 0;
    let velocity = 0;
    let lastTs = null;
    let resumeAt = 0;
    let moved = false;
    let rafId = 0;

    const measure = () => {
      if (!track.children[0]) {
        setWidth = 0;
        return;
      }
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.gap) || 0;
      let width = 0;
      for (let i = 0; i < originals.length; i += 1) {
        width += track.children[i].getBoundingClientRect().width;
        if (i < originals.length - 1) width += gap;
      }
      setWidth = width + gap;
    };

    const wrapOffset = () => {
      if (setWidth <= 0) return;
      while (offset <= -setWidth) offset += setWidth;
      while (offset > 0) offset -= setWidth;
    };

    const apply = () => {
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    const pauseInteraction = () => {
      resumeAt = performance.now() + 900;
    };

    const onPointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      moved = false;
      pointerId = event.pointerId;
      startX = event.clientX;
      lastX = event.clientX;
      startOffset = offset;
      velocity = 0;
      lastMoveTime = performance.now();
      lastTs = null;
      viewport.classList.add("is-dragging");
      try {
        viewport.setPointerCapture(event.pointerId);
      } catch (_) {
        /* ignore */
      }
    };

    const onPointerMove = (event) => {
      if (!dragging || event.pointerId !== pointerId) return;
      const now = performance.now();
      const dx = event.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      offset = startOffset + dx;
      wrapOffset();
      apply();

      const dt = Math.max(now - lastMoveTime, 1);
      velocity = ((event.clientX - lastX) / dt) * 16;
      lastX = event.clientX;
      lastMoveTime = now;
    };

    const endDrag = (event) => {
      if (!dragging || (event && event.pointerId !== pointerId)) return;
      dragging = false;
      pointerId = null;
      viewport.classList.remove("is-dragging");
      pauseInteraction();

      if (Math.abs(velocity) > 0.2) {
        offset += velocity * 8;
        wrapOffset();
        apply();
      }
      velocity = 0;
      lastTs = null;
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("lostpointercapture", endDrag);

    viewport.addEventListener(
      "click",
      (event) => {
        if (moved) {
          event.preventDefault();
          event.stopPropagation();
          moved = false;
        }
      },
      true
    );

    viewport.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const step = Math.min(viewport.clientWidth * 0.7, 280);
      offset += event.key === "ArrowLeft" ? step : -step;
      wrapOffset();
      apply();
      pauseInteraction();
      lastTs = null;
    });

    const tick = (ts) => {
      if (!running) return;
      if (lastTs == null) lastTs = ts;
      const dt = Math.min(ts - lastTs, 40);
      lastTs = ts;

      if (!dragging && setWidth > 0) {
        const interacting = ts < resumeAt;
        const currentSpeed = interacting ? speed * 0.18 : speed;
        offset -= currentSpeed * dt;
        wrapOffset();
        apply();
      }

      rafId = requestAnimationFrame(tick);
    };

    measure();
    apply();
    rafId = requestAnimationFrame(tick);

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const ratio = setWidth > 0 ? offset / setWidth : 0;
        measure();
        offset = ratio * setWidth;
        wrapOffset();
        apply();
      }, 120);
    });

    reduceMotion.addEventListener("change", (event) => {
      if (!event.matches) return;
      running = false;
      cancelAnimationFrame(rafId);
      root.classList.add("is-static");
      track.style.transform = "";
      const hint = root.querySelector(".services-carousel-hint");
      if (hint) hint.textContent = "Swipe to browse services";
    });
  };

  initServicesCarousel();
})();
