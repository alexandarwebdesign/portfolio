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

  function getMotionSettings() {
    const rootStyles = window.getComputedStyle(document.documentElement);

    return {
      tempo:
        parseFloat(rootStyles.getPropertyValue("--motion-tempo-primary")) ||
        436,
      exitRatio:
        parseFloat(rootStyles.getPropertyValue("--motion-exit-ratio")) || 0.63,
      primaryEasing:
        rootStyles.getPropertyValue("--motion-ease-primary").trim() ||
        "cubic-bezier(0.33, 0.06, 0.12, 0.97)",
      accentEasing:
        rootStyles.getPropertyValue("--motion-ease-accent").trim() ||
        "cubic-bezier(0.38, 0.10, 0.16, 0.98)",
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
   * Handle smooth scrolling for navigation links
   */
  function scrollToAnchorTarget(targetElement, navbarHeight) {
    const { tempo } = getMotionSettings();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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

          // Calculate offset for fixed navbar
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
  // 3. ACTIVE NAVIGATION STATE
  // ==========================================================================

  /**
   * Highlight active navigation link based on scroll position
   */
  function initActiveNavigation() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!sections.length || !navLinks.length) return;

    function updateActiveLink() {
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active");
            }
          });
        }
      });
    }

    // Throttle scroll event for performance
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check
    updateActiveLink();
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
  // 5. NAVBAR SCROLL EFFECT
  // ==========================================================================

  /**
   * Add/remove class on navbar based on scroll position
   */
  function initNavbarScroll() {
    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    let lastScrollY = 0;

    function updateNavbarAtY(currentScrollY) {
      if (currentScrollY > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        navbar.classList.add("navbar--hidden");
      } else {
        navbar.classList.remove("navbar--hidden");
      }

      lastScrollY = currentScrollY;
    }

    let ticking2 = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking2) {
          window.requestAnimationFrame(() => {
            updateNavbarAtY(window.scrollY);
            ticking2 = false;
          });
          ticking2 = true;
        }
      },
      { passive: true },
    );

    updateNavbarAtY(window.scrollY);
  }

  // ==========================================================================
  // 6. MOBILE NAVIGATION - Lightweight Overlay Transition
  // ==========================================================================

  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    if (!toggle || !mobileNav) return;

    const mobileViewport = window.matchMedia("(max-width: 900px)");
    const { tempo, exitRatio } = getMotionSettings();
    const navOpenDuration = Math.max(280, Math.round(tempo * 0.82));
    const navCloseDuration = Math.max(
      180,
      Math.round(navOpenDuration * Math.max(exitRatio, 0.7)),
    );

    mobileNav.style.setProperty(
      "--mobile-nav-open-duration",
      `${navOpenDuration}ms`,
    );
    mobileNav.style.setProperty(
      "--mobile-nav-close-duration",
      `${navCloseDuration}ms`,
    );

    function setOpenState(isOpen) {
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu",
      );
      mobileNav.classList.toggle("is-open", isOpen);
      mobileNav.setAttribute("aria-hidden", String(!isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
      document.documentElement.style.overflow = isOpen ? "hidden" : "";
      // a11y: make background content inert while menu is open so screen
      // readers + keyboard cannot interact with content behind the dialog.
      // Skip <header> - it contains the nav-toggle which must stay live
      // to close the menu.
      const mainEl = document.getElementById("main-content");
      const footerEl = document.querySelector("footer");
      [mainEl, footerEl].forEach((el) => {
        if (!el) return;
        if (isOpen) el.setAttribute("inert", "");
        else el.removeAttribute("inert");
      });
    }

    function openNav() {
      if (!mobileViewport.matches) return;
      setOpenState(true);
    }

    function closeNav() {
      setOpenState(false);
    }

    function closeNavOnDesktop(event) {
      const matches =
        typeof event?.matches === "boolean"
          ? event.matches
          : mobileViewport.matches;
      if (!matches) {
        closeNav();
      }
    }

    setOpenState(false);

    toggle.addEventListener("click", () => {
      toggle.classList.contains("is-open") ? closeNav() : openNav();
    });

    mobileNav
      .querySelectorAll(".mobile-nav-link, .mobile-nav-cta")
      .forEach((link) => {
        link.addEventListener("click", closeNav);
      });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.classList.contains("is-open"))
        closeNav();
    });

    mobileNav.addEventListener("click", (e) => {
      if (e.target === mobileNav) {
        closeNav();
      }
    });

    if (typeof mobileViewport.addEventListener === "function") {
      mobileViewport.addEventListener("change", closeNavOnDesktop);
    } else if (typeof mobileViewport.addListener === "function") {
      mobileViewport.addListener(closeNavOnDesktop);
    }
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

  // ==========================================================================
  // 8. SERVICE CARD SVG HOVER BRIDGE
  // Inline decorative SVGs so the parent card hover can control their strokes.
  // ==========================================================================

  function updateServiceCardIconHeights() {
    document.querySelectorAll(".service-item").forEach((item) => {
      const title = item.querySelector(".service-title");
      const description = item.querySelector(".service-description");
      const icon = item.querySelector(".service-bg-icon");

      if (!title || !description || !icon) return;

      const titleHeight = title.getBoundingClientRect().height;
      const descriptionHeight = description.getBoundingClientRect().height;
      const iconHeight = Math.ceil(titleHeight + descriptionHeight + 20);

      item.style.setProperty("--service-icon-height", `${iconHeight}px`);
    });
  }

  function updateServiceCardViewportPriority() {
    const serviceItems = Array.from(document.querySelectorAll(".service-item"));

    if (!serviceItems.length) return;

    const viewportCenterY = window.innerHeight / 2;
    let closestItem = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    serviceItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenterY = rect.top + rect.height / 2;
      const distance = Math.abs(itemCenterY - viewportCenterY);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });

    const threshold = window.innerHeight * 0.4;
    const activeItem = closestDistance <= threshold ? closestItem : null;

    serviceItems.forEach((item) => {
      item.classList.toggle("is-viewport-active", item === activeItem);
    });
  }

  function initServiceCardIcons() {
    const serviceItems = document.querySelectorAll(".service-item");
    if (!serviceItems.length) return;
    const servicesList = serviceItems[0].closest(".services-list");

    const serviceIcons = document.querySelectorAll(
      'img.service-bg-icon[src$=".svg"]',
    );

    let serviceCardFrame = null;
    const scheduleServiceCardUpdate = () => {
      if (serviceCardFrame) {
        cancelAnimationFrame(serviceCardFrame);
      }

      serviceCardFrame = requestAnimationFrame(() => {
        updateServiceCardIconHeights();
        updateServiceCardViewportPriority();
      });
    };

    let serviceCardInteractionFrame = null;
    const scheduleServiceCardInteractionUpdate = () => {
      if (serviceCardInteractionFrame) {
        cancelAnimationFrame(serviceCardInteractionFrame);
      }

      serviceCardInteractionFrame = requestAnimationFrame(() => {
        const activeItem = Array.from(serviceItems).find((item) =>
          item.matches(":hover, :focus-within"),
        );

        if (servicesList) {
          servicesList.classList.toggle(
            "has-service-interaction",
            Boolean(activeItem),
          );
        }

        serviceItems.forEach((item) => {
          item.classList.toggle("is-interaction-active", item === activeItem);
        });
      });
    };

    window.addEventListener("resize", scheduleServiceCardUpdate, {
      passive: true,
    });
    window.addEventListener("scroll", scheduleServiceCardUpdate, {
      passive: true,
    });
    window._serviceCardViewportUpdate = scheduleServiceCardUpdate;

    serviceItems.forEach((item) => {
      item.addEventListener("mouseenter", scheduleServiceCardInteractionUpdate);
      item.addEventListener("mouseleave", scheduleServiceCardInteractionUpdate);
      item.addEventListener("focusin", scheduleServiceCardInteractionUpdate);
      item.addEventListener("focusout", scheduleServiceCardInteractionUpdate);
    });

    if (!serviceIcons.length) {
      scheduleServiceCardUpdate();
      scheduleServiceCardInteractionUpdate();
      return;
    }

    serviceIcons.forEach((icon) => {
      const src = icon.getAttribute("src");
      if (!src) return;

      fetch(src)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load SVG: ${src}`);
          }

          return response.text();
        })
        .then((svgMarkup) => {
          const svgDocument = new DOMParser().parseFromString(
            svgMarkup,
            "image/svg+xml",
          );
          const svg = svgDocument.documentElement;

          if (!svg || svg.nodeName.toLowerCase() !== "svg") return;

          const hoverArea = svg.querySelector("#hoverArea");
          if (hoverArea) {
            hoverArea.remove();
          }

          svg
            .querySelectorAll("animate, animateTransform")
            .forEach((animation) => {
              const begin = animation.getAttribute("begin");

              if (begin && /(mouseover|mouseout)/i.test(begin)) {
                animation.remove();
              }
            });

          svg.classList.add("service-bg-icon-svg");
          svg.setAttribute("aria-hidden", "true");
          svg.setAttribute("focusable", "false");
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

          svg
            .querySelectorAll(
              "circle:not(#hoverArea), path, polygon, polyline, rect, ellipse",
            )
            .forEach((shape) => {
              shape.classList.add("service-icon-shape");
            });

          const wrapper = document.createElement("div");
          wrapper.className = icon.className;
          wrapper.setAttribute("aria-hidden", "true");
          wrapper.appendChild(svg);

          icon.replaceWith(wrapper);
          scheduleServiceCardUpdate();
          scheduleServiceCardInteractionUpdate();
        })
        .catch((error) => {
          console.error(error);
        });
    });

    if (document.fonts && typeof document.fonts.ready?.then === "function") {
      document.fonts.ready.then(scheduleServiceCardUpdate).catch(() => {});
    }

    window.addEventListener(
      "load",
      () => {
        scheduleServiceCardUpdate();
        scheduleServiceCardInteractionUpdate();
      },
      { once: true },
    );

    serviceItems.forEach((item) => {
      const serviceValue = item.dataset.service;
      if (!serviceValue) return;

      const activate = () => {
        const select = document.getElementById("service");
        const nameField = document.getElementById("name");
        const contact = document.getElementById("contact");

        if (select) {
          select.value = serviceValue;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (contact) {
          contact.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start",
          });
        }

        const focusName = () => {
          if (nameField) nameField.focus({ preventScroll: true });
        };
        if (reduceMotion) focusName();
        else setTimeout(focusName, 700);
      };

      item.addEventListener("click", activate);
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
    });
  }

  // ==========================================================================
  // 9. SCROLL PARALLAX (data-parallax-speed)
  // Same approach as the reference layout study.
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

      items.forEach((item) => {
        item.style.transform = "none";
        let rawSpeed = Number(item.dataset.parallaxSpeed) || 0;
        if (window.innerWidth <= 900 && rawSpeed > 1) {
          rawSpeed = 1;
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

  function initAboutPhotoInteraction() {
    const cta = document.querySelector("#about .about-cta-btn");
    const circle = document.querySelector("#about .about-photo-circle");
    if (!cta || !circle) return;

    cta.addEventListener("mouseenter", () =>
      circle.classList.add("about-photo-circle--square"),
    );
    cta.addEventListener("mouseleave", () =>
      circle.classList.remove("about-photo-circle--square"),
    );
  }

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

  function init() {
    initPageLoadSequence();
    initScrollReveal();
    initServiceCardIcons();
    initSmoothScroll();
    initActiveNavigation();
    initFormHandling();
    initNavbarScroll();
    initMobileNav();
    initFaqAccordion();
    initContactHashFocus();
    initParallax();
    initAboutPhotoInteraction();
    initImageMarquee();
    initPlates();
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
