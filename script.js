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
    ".service-card, .stat, .gallery-item, .process-step, .review, .trust-item"
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
})();
