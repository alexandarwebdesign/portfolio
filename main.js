/* ==========================================================================
   ALEXANDAR PAVLOV PORTFOLIO - JAVASCRIPT
   Scroll Reveal + Smooth Scroll + Form Handling
   ========================================================================== */

(function () {
  "use strict";

  // ==========================================================================
  // 1. SCROLL REVEAL ANIMATION
  // ==========================================================================

  /**
   * Initialize IntersectionObserver for scroll reveal animations
   */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Unobserve after revealing to improve performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  }

  /**
   * SMIL <animate> ignores prefers-reduced-motion; pause it for users who opt
   * out (footer / contact / about status icons).
   */
  function initReducedMotionSvg() {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll("svg").forEach((svg) => {
      if (
        typeof svg.pauseAnimations === "function" &&
        svg.querySelector("animate, animateTransform, animateMotion")
      ) {
        svg.pauseAnimations();
      }
    });
  }

  function getMotionSettings() {
    const rootStyles = window.getComputedStyle(document.documentElement);

    return {
      tempo:
        parseFloat(rootStyles.getPropertyValue("--duration-normal")) || 600,
    };
  }

  function initPageLoadSequence() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      document.body.classList.add("is-loaded");
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.body.classList.add("is-loaded");
      });
    });
  }

  // ==========================================================================
  // 2. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================================

  /**
   * Lenis smooth scroll (vendored). Skipped for reduced-motion users and if the
   * library failed to load. Other scroll helpers route through window.__lenis
   * when present so anchor offsets + focus still work.
   */
  function initSmoothScrollLenis() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || typeof window.Lenis === "undefined") return;

    const lenis = new window.Lenis({
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
    });
    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }
    window.requestAnimationFrame(raf);
  }

  /**
   * Handle smooth scrolling for navigation links
   */
  function scrollToAnchorTarget(targetElement, navbarHeight) {
    const { tempo } = getMotionSettings();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (window.__lenis && !reduceMotion) {
      window.__lenis.scrollTo(targetElement, { offset: -navbarHeight });
      return tempo;
    }

    const targetPosition =
      targetElement.getBoundingClientRect().top +
      window.pageYOffset -
      navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: reduceMotion ? "auto" : "smooth",
    });

    return reduceMotion ? 0 : tempo;
  }

  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        const focusTargetSelector = link.getAttribute("data-focus-target");

        // Skip if it's just "#" or empty
        if (targetId === "#" || !targetId) return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          // Calculate offset for the fixed nav pill
          const navbarHeight = 120;
          const focusDelay = scrollToAnchorTarget(targetElement, navbarHeight);

          if (focusTargetSelector) {
            window.setTimeout(() => {
              const focusTarget = document.querySelector(focusTargetSelector);
              if (focusTarget && typeof focusTarget.focus === "function") {
                focusTarget.focus({ preventScroll: true });
              }
            }, focusDelay);
          }

          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  /**
   * Focus the first contact field when the page loads on the contact hash.
   */
  function initContactHashFocus() {
    if (window.location.hash !== "#contact") return;

    window.setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        scrollToAnchorTarget(contactSection, 120);
      }

      const nameField = document.getElementById("name");
      if (nameField && typeof nameField.focus === "function") {
        nameField.focus({ preventScroll: true });
      }
    }, 250);
  }

  // ==========================================================================
  // 3. SERVICE ROW CLICK — preselect + focus contact form
  // ==========================================================================

  function initServiceClick() {
    const rows = document.querySelectorAll('.service-row[data-service]');
    if (!rows.length) return;
    const serviceSelect = document.getElementById('service');
    const nameInput = document.getElementById('name');
    const contactSection = document.getElementById('contact');
    if (!serviceSelect || !nameInput || !contactSection) return;

    function activateService(serviceValue) {
      serviceSelect.value = serviceValue;
      const scrollTarget = contactSection.getBoundingClientRect().top + window.scrollY - 80;
      if (window.__lenis) {
        window.__lenis.scrollTo(scrollTarget, { duration: 0.8 });
      } else {
        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
      }
      setTimeout(() => nameInput.focus(), 600);
    }

    rows.forEach(row => {
      row.addEventListener('click', () => activateService(row.dataset.service));
      row.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateService(row.dataset.service); }
      });
    });
  }

  // ==========================================================================
  // 4. FORM HANDLING
  // ==========================================================================

  /**
   * Basic form validation and submission handling
   * Opens user's email client with pre-filled message
   */
  function initFormHandling() {
    const form = document.getElementById("contact-form");

    if (!form) return;

    const statusEl = document.getElementById("form-status");
    const fieldIds = ["name", "email", "service", "message"];

    function clearErrors() {
      fieldIds.forEach((id) => {
        const input = form.querySelector(`#${id}`);
        const errEl = form.querySelector(`#${id}-error`);
        if (input) {
          input.removeAttribute("aria-invalid");
        }
        if (errEl) {
          errEl.hidden = true;
          errEl.textContent = "";
        }
      });
    }

    function showFieldError(id, msg) {
      const input = form.querySelector(`#${id}`);
      const errEl = form.querySelector(`#${id}-error`);
      if (input) input.setAttribute("aria-invalid", "true");
      if (errEl) {
        errEl.textContent = msg;
        errEl.hidden = false;
      }
    }

    function setStatus(msg, state) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      if (state) statusEl.dataset.state = state;
      else delete statusEl.dataset.state;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      clearErrors();
      setStatus("");

      const errors = validateForm(data);

      if (Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([id, msg]) => showFieldError(id, msg));
        const firstInvalidId = Object.keys(errors)[0];
        const firstInvalid = form.querySelector(`#${firstInvalidId}`);
        if (firstInvalid) firstInvalid.focus();
        setStatus(
          `Please correct ${Object.keys(errors).length} field${
            Object.keys(errors).length === 1 ? "" : "s"
          } above.`,
          "error",
        );
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');

      if (!submitBtn.hasAttribute("data-original-content")) {
        submitBtn.setAttribute("data-original-content", submitBtn.innerHTML);
      }

      submitBtn.classList.add("loading");
      submitBtn.innerHTML = `
        <div class="loading-container">
            <svg class="progress-ring" viewBox="0 0 36 36">
                <circle class="progress-ring__circle" cx="18" cy="18" r="15.915"/>
            </svg>
            <span class="spinner-checkmark"></span>
        </div>
      `;
      submitBtn.disabled = true;
      setStatus("Sending your message…", "");

      const minAnimationTime = new Promise((resolve) =>
        setTimeout(resolve, 1000),
      );
      const apiRequest = fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      Promise.all([apiRequest, minAnimationTime])
        .then(async ([response]) => {
          const json = await response.json();

          if (response.status === 200) {
            submitBtn.classList.remove("loading");
            submitBtn.classList.add("success");
            submitBtn.innerHTML = "Thanks for applying 💙";

            form.reset();
            setStatus("Message sent. I'll reply within 24 hours.", "success");

            setTimeout(() => {
              submitBtn.classList.remove("success");
              submitBtn.innerHTML = submitBtn.getAttribute(
                "data-original-content",
              );
              submitBtn.disabled = false;
            }, 3000);
          } else {
            console.error(json);
            throw new Error(json.message || "Something went wrong");
          }
        })
        .catch((error) => {
          console.error(error);
          setStatus(
            error.message ||
              "Something went wrong. Please try again or email me directly.",
            "error",
          );

          submitBtn.classList.remove("loading");
          submitBtn.innerHTML = submitBtn.getAttribute("data-original-content");
          submitBtn.disabled = false;
        });
    });
  }

  /**
   * Validate form data
   * @param {Object} data - Form data object
   * @returns {Object} Map of fieldId -> error message
   */
  function validateForm(data) {
    const errors = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = "Please enter your full name.";
    }

    if (!data.email || !isValidEmail(data.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!data.service) {
      errors.service = "Please select a service.";
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.message =
        "Tell me a little more - 10+ characters helps me reply usefully.";
    }

    return errors;
  }

  /**
   * Validate email format
   * @param {string} email - Email address to validate
   * @returns {boolean} Whether email is valid
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ==========================================================================
  // 7. FAQ ACCORDION (Single Open)
  // ==========================================================================

  /**
   * Initialize FAQ accordion - only one question open at a time
   */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");

    if (!faqItems.length) return;

    function openFaqItem(item) {
      const button = item.querySelector(".faq-question");
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("is-open")) {
          otherItem.classList.remove("is-open");
          const otherButton = otherItem.querySelector(".faq-question");
          if (otherButton) otherButton.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.add("is-open");
      if (button) button.setAttribute("aria-expanded", "true");
      if (item.id) history.replaceState(null, null, "#" + item.id);
    }

    function closeFaqItem(item) {
      const button = item.querySelector(".faq-question");
      item.classList.remove("is-open");
      if (button) button.setAttribute("aria-expanded", "false");
      if (item.id && location.hash === "#" + item.id) {
        history.replaceState(null, null, location.pathname);
      }
    }

    faqItems.forEach((item) => {
      const button = item.querySelector(".faq-question");
      if (!button) return;

      button.addEventListener("click", () => {
        if (item.classList.contains("is-open")) {
          closeFaqItem(item);
        } else {
          openFaqItem(item);
        }
      });
    });

    // Auto-open item matching URL hash on page load
    const hash = location.hash;
    if (hash) {
      const target = document.querySelector(hash + ".faq-item");
      if (target) {
        setTimeout(() => {
          openFaqItem(target);
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }
  }

  // (Section 8, the service-card SVG hover bridge, was removed with the
  // services redesign - no .service-item markup remains.)

  // ==========================================================================
  // 9. SCROLL PARALLAX (data-parallax-speed)
  // Elements with [data-parallax-speed] shift vertically relative to their
  // center vs the viewport center as the user scrolls.
  // ==========================================================================

  function initParallax() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    let items = [];
    let ticking = false;

    function updateParallax() {
      if (!items.length) return;

      const scrollY = window.scrollY || window.pageYOffset;
      const viewportCenter = scrollY + window.innerHeight / 2;
      const isMobile = window.innerWidth <= 900;

      items.forEach((item) => {
        item.style.transform = "none";
        let rawSpeed = Number(item.dataset.parallaxSpeed) || 0;

        // On mobile, disable parallax entirely for phone-column sections
        if (isMobile && item.closest(".mobile-col")) {
          return;
        }

        // Cap all other parallax speeds on mobile for subtlety
        if (isMobile && Math.abs(rawSpeed) > 1) {
          rawSpeed = rawSpeed > 0 ? 1 : -1;
        }

        const speed = rawSpeed / 10;
        const rect = item.getBoundingClientRect();
        const itemMiddle = scrollY + rect.top + rect.height / 2;
        const offset = (viewportCenter - itemMiddle) * -speed;
        item.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    }

    function requestParallaxUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
    }

    function refreshParallaxItems() {
      items = Array.from(document.querySelectorAll("[data-parallax-speed]"));
      requestParallaxUpdate();
    }

    refreshParallaxItems();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", refreshParallaxItems, { passive: true });
    window.addEventListener("portfolio:content-updated", refreshParallaxItems);
  }

  // ==========================================================================

  /**
   * Initialize all modules when DOM is ready
   */
  // ==========================================================================
  //   IMAGE MARQUEE - scroll-linked horizontal parallax (Locomotive-style)
  // ==========================================================================

  function initImageMarquee() {
    const marquees = document.querySelectorAll("[data-marquee]");
    if (!marquees.length) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    marquees.forEach((root) => {
      const track = root.querySelector("[data-marquee-track]");
      const row = root.querySelector("[data-marquee-row]");
      if (!track || !row) return;

      row.querySelectorAll("img").forEach((img) => {
        if (img.complete && img.naturalWidth > 0) {
          img.dataset.loaded = "true";
        } else {
          img.addEventListener(
            "load",
            () => {
              img.dataset.loaded = "true";
            },
            { once: true },
          );
        }
      });

      if (reduceMotion) return;

      const clone = row.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("img").forEach((img) => {
        if (img.complete && img.naturalWidth > 0) img.dataset.loaded = "true";
        else
          img.addEventListener(
            "load",
            () => {
              img.dataset.loaded = "true";
            },
            { once: true },
          );
      });
      track.appendChild(clone);

      const SCROLL_SPEED = 0.49;
      const IDLE_SPEED = 0.056;
      const MOMENTUM_DECAY = 0.93;
      const MOMENTUM_THRESHOLD = 0.05;
      let rowWidth = 0;
      let currentX = 0;
      let lastScrollY = window.scrollY;
      let lastFrame = performance.now();
      let rafId = null;
      let inView = false;

      let isDragging = false;
      let dragStartX = 0;
      let dragLastX = 0;
      let dragLastT = 0;
      let velocity = 0;
      let activePointerId = null;

      const viewport = root.querySelector(".image-marquee__viewport") || root;

      const measure = () => {
        rowWidth = row.getBoundingClientRect().width;
      };
      measure();
      window.addEventListener("resize", measure);

      const onScroll = () => {
        const dy = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        if (!isDragging) currentX -= dy * SCROLL_SPEED;
      };

      const tick = (now) => {
        const dt = now - lastFrame;
        lastFrame = now;
        if (isDragging) {
          // pointer drives currentX directly
        } else if (Math.abs(velocity) > MOMENTUM_THRESHOLD) {
          currentX += velocity * dt;
          velocity *= Math.pow(MOMENTUM_DECAY, dt / 16.67);
        } else {
          velocity = 0;
          currentX -= IDLE_SPEED * dt;
        }
        if (rowWidth > 0) {
          while (currentX <= -rowWidth) currentX += rowWidth;
          while (currentX > 0) currentX -= rowWidth;
        }
        track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
        if (inView) rafId = requestAnimationFrame(tick);
        else rafId = null;
      };

      const onPointerDown = (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        isDragging = true;
        activePointerId = e.pointerId;
        dragStartX = e.clientX;
        dragLastX = e.clientX;
        dragLastT = performance.now();
        velocity = 0;
        viewport.classList.add("is-dragging");
        try {
          viewport.setPointerCapture(e.pointerId);
        } catch (_) {}
      };

      const onPointerMove = (e) => {
        if (!isDragging || e.pointerId !== activePointerId) return;
        const now = performance.now();
        const dx = e.clientX - dragLastX;
        const dt = Math.max(1, now - dragLastT);
        currentX += dx;
        velocity = dx / dt;
        dragLastX = e.clientX;
        dragLastT = now;
        if (rowWidth > 0) {
          while (currentX <= -rowWidth) currentX += rowWidth;
          while (currentX > 0) currentX -= rowWidth;
        }
      };

      const onPointerUp = (e) => {
        if (!isDragging || e.pointerId !== activePointerId) return;
        isDragging = false;
        activePointerId = null;
        viewport.classList.remove("is-dragging");
        try {
          viewport.releasePointerCapture(e.pointerId);
        } catch (_) {}
      };

      viewport.addEventListener("pointerdown", onPointerDown);
      viewport.addEventListener("pointermove", onPointerMove);
      viewport.addEventListener("pointerup", onPointerUp);
      viewport.addEventListener("pointercancel", onPointerUp);
      viewport.addEventListener("dragstart", (e) => e.preventDefault());

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inView = entry.isIntersecting;
            if (inView) {
              window.addEventListener("scroll", onScroll, { passive: true });
              measure();
              lastFrame = performance.now();
              if (!rafId) rafId = requestAnimationFrame(tick);
            } else {
              window.removeEventListener("scroll", onScroll);
              if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
              }
            }
          });
        },
        { rootMargin: "200px 0px" },
      );

      io.observe(root);
    });
  }

  function initCaseCarousels() {
    const carousels = document.querySelectorAll("[data-case-carousel]");
    if (!carousels.length) return;

    carousels.forEach((root) => {
      const slides = Array.from(root.querySelectorAll("[data-carousel-slide]"));
      if (!slides.length) return;

      let activeIndex = slides.findIndex((slide) =>
        slide.classList.contains("is-active"),
      );
      if (activeIndex < 0) activeIndex = 0;

      const buttons = Array.from(
        document.querySelectorAll(".carousel-btn[data-carousel]"),
      ).filter((button) => button.dataset.carousel === root.id);

      function setActive(nextIndex) {
        activeIndex = (nextIndex + slides.length) % slides.length;

        slides.forEach((slide, index) => {
          const isActive = index === activeIndex;
          slide.classList.toggle("is-active", isActive);
          slide.setAttribute("aria-hidden", String(!isActive));
        });

        root.dataset.activeSlide = String(activeIndex + 1);
      }

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const direction = button.dataset.dir === "prev" ? -1 : 1;
          setActive(activeIndex + direction);
        });
      });

      root.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        setActive(activeIndex + (event.key === "ArrowLeft" ? -1 : 1));
      });

      if (!root.hasAttribute("tabindex")) {
        root.setAttribute("tabindex", "0");
      }

      setActive(activeIndex);
    });
  }

  // Sticky-reveal footer: focused links can be occluded by main - scroll to bottom on focus entry
  function initFooterFocusReveal() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    footer.addEventListener('focusin', () => {
      const doc = document.documentElement;
      const target = doc.scrollHeight - window.innerHeight;
      if (window.scrollY >= target - 4) return; // already revealed
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (window.__lenis && !reduced) {
        window.__lenis.scrollTo(target);
      } else {
        window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
      }
    });
  }

  function init() {
    initSmoothScrollLenis();
    initReducedMotionSvg();
    initPageLoadSequence();
    initScrollReveal();
    initSmoothScroll();
    initServiceClick();
    initFormHandling();
    initFaqAccordion();
    initContactHashFocus();
    initParallax();
    initImageMarquee();
    initCaseCarousels();
    initPlates();
    initFooterFocusReveal();
  }

  /**
   * Initialize the "Plates" presentation system used on case-study pages.
   * - Updates the sticky page counter as each plate enters the viewport.
   * - Adds .is-in-view to each plate the first time it crosses 18% from the
   *   top, triggering the CSS entrance animation.
   * - Hides the counter on plates whose chrome would clash (only the final
   *   CTA plate currently - it removes itself).
   */
  function initPlates() {
    const plates = document.querySelectorAll(".plate");
    if (!plates.length) return;

    const counterEl = document.getElementById("plates-counter");
    const counterNumEl = document.getElementById("plates-counter-num");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Reveal-on-view: one-shot, fires once per plate
    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            revealIO.unobserve(entry.target);
          }
        }
      },
      { threshold: reduceMotion ? 0 : 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    plates.forEach((p) => {
      if (reduceMotion) p.classList.add("is-in-view");
      else revealIO.observe(p);
    });

    // Counter tracking - pick the plate whose centerline is closest to the
    // viewport center, then mirror its data-plate.
    if (counterEl && counterNumEl) {
      let rafId = null;
      const candidates = Array.from(plates).filter((p) => p.dataset.plate);

      function updateCounter() {
        rafId = null;
        const viewportMid = window.innerHeight * 0.45;
        let bestPlate = null;
        let bestDistance = Infinity;

        for (const p of candidates) {
          const rect = p.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const distance = Math.abs(center - viewportMid);
          if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
          if (distance < bestDistance) {
            bestDistance = distance;
            bestPlate = p;
          }
        }

        if (bestPlate) {
          const num = bestPlate.dataset.plate;
          if (counterNumEl.textContent !== num) counterNumEl.textContent = num;
          counterEl.classList.add("is-visible");
        } else {
          counterEl.classList.remove("is-visible");
        }
      }

      function onScroll() {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(updateCounter);
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      updateCounter();
    }
  }

  // Run init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
