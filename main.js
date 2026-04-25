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
      tempo: parseFloat(rootStyles.getPropertyValue("--motion-tempo-primary")) || 436,
      exitRatio: parseFloat(rootStyles.getPropertyValue("--motion-exit-ratio")) || 0.63,
      primaryEasing: rootStyles.getPropertyValue("--motion-ease-primary").trim() || "cubic-bezier(0.33, 0.06, 0.12, 0.97)",
      accentEasing: rootStyles.getPropertyValue("--motion-ease-accent").trim() || "cubic-bezier(0.38, 0.10, 0.16, 0.98)",
    };
  }

  function initPageLoadSequence() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Basic validation
      const errors = validateForm(data);

      if (errors.length > 0) {
        // Show errors
        alert(errors.join('\n'));
        return;
      }

      // Submit to Web3Forms via fetch
      const submitBtn = form.querySelector('button[type="submit"]');
      
      // Store original content
      if (!submitBtn.hasAttribute('data-original-content')) {
        submitBtn.setAttribute('data-original-content', submitBtn.innerHTML);
      }
      
      // Update UI to Loading
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = `
        <div class="loading-container">
            <svg class="progress-ring" viewBox="0 0 36 36">
                <circle class="progress-ring__circle" cx="18" cy="18" r="15.915"/>
            </svg>
            <span class="spinner-checkmark"></span>
        </div>
      `;
      submitBtn.disabled = true;

      // Minimum animation time promise
      const minAnimationTime = new Promise(resolve => setTimeout(resolve, 1000));
      
      // API request promise
      const apiRequest = fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      // Wait for BOTH to complete
      Promise.all([apiRequest, minAnimationTime])
      .then(async ([response]) => {
        const json = await response.json();
        
        if (response.status === 200) {
          // Success
          submitBtn.classList.remove('loading');
          submitBtn.classList.add('success');
          submitBtn.innerHTML = 'Thanks for applying 💙';
          
          // Reset form
          form.reset();
          
          // Restore button after delay
          setTimeout(() => {
            submitBtn.classList.remove('success');
            submitBtn.innerHTML = submitBtn.getAttribute('data-original-content');
            submitBtn.disabled = false;
          }, 3000);
          
        } else {
          // Error handling
          console.error(json);
          throw new Error(json.message || 'Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
        alert(error.message || 'Something went wrong. Please try again.');
        
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = submitBtn.getAttribute('data-original-content');
        submitBtn.disabled = false;
      });
    });
  }

  /**
   * Validate form data
   * @param {Object} data - Form data object
   * @returns {Array} Array of error messages
   */
  function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push("Please enter your full name");
    }

    if (!data.email || !isValidEmail(data.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!data.service) {
      errors.push("Please select a service");
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push("Please tell us more about your project");
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
    window.addEventListener("scroll", () => {
      if (!ticking2) {
        window.requestAnimationFrame(() => {
          updateNavbarAtY(window.scrollY);
          ticking2 = false;
        });
        ticking2 = true;
      }
    }, { passive: true });

    updateNavbarAtY(window.scrollY);
  }

  // ==========================================================================
  // 6. MOBILE NAVIGATION — Lightweight Overlay Transition
  // ==========================================================================

  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (!toggle || !mobileNav) return;

    const mobileViewport = window.matchMedia('(max-width: 900px)');
    const { tempo, exitRatio } = getMotionSettings();
    const navOpenDuration = Math.max(280, Math.round(tempo * 0.82));
    const navCloseDuration = Math.max(180, Math.round(navOpenDuration * Math.max(exitRatio, 0.7)));

    mobileNav.style.setProperty('--mobile-nav-open-duration', `${navOpenDuration}ms`);
    mobileNav.style.setProperty('--mobile-nav-close-duration', `${navCloseDuration}ms`);

    function setOpenState(isOpen) {
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      mobileNav.classList.toggle('is-open', isOpen);
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      document.documentElement.style.overflow = isOpen ? 'hidden' : '';
    }

    function openNav() {
      if (!mobileViewport.matches) return;
      setOpenState(true);
    }

    function closeNav() {
      setOpenState(false);
    }

    function closeNavOnDesktop(event) {
      const matches = typeof event?.matches === 'boolean' ? event.matches : mobileViewport.matches;
      if (!matches) {
        closeNav();
      }
    }

    setOpenState(false);

    toggle.addEventListener('click', () => {
      toggle.classList.contains('is-open') ? closeNav() : openNav();
    });

    mobileNav.querySelectorAll('.mobile-nav-link, .mobile-nav-cta').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.classList.contains('is-open')) closeNav();
    });

    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) {
        closeNav();
      }
    });

    if (typeof mobileViewport.addEventListener === 'function') {
      mobileViewport.addEventListener('change', closeNavOnDesktop);
    } else if (typeof mobileViewport.addListener === 'function') {
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
    const faqItems = document.querySelectorAll('.faq-item');

    if (!faqItems.length) return;

    function openFaqItem(item) {
      const button = item.querySelector('.faq-question');
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('is-open')) {
          otherItem.classList.remove('is-open');
          const otherButton = otherItem.querySelector('.faq-question');
          if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.add('is-open');
      if (button) button.setAttribute('aria-expanded', 'true');
      if (item.id) history.replaceState(null, null, '#' + item.id);
    }

    function closeFaqItem(item) {
      const button = item.querySelector('.faq-question');
      item.classList.remove('is-open');
      if (button) button.setAttribute('aria-expanded', 'false');
      if (item.id && location.hash === '#' + item.id) {
        history.replaceState(null, null, location.pathname);
      }
    }

    faqItems.forEach(item => {
      const button = item.querySelector('.faq-question');
      if (!button) return;

      button.addEventListener('click', () => {
        if (item.classList.contains('is-open')) {
          closeFaqItem(item);
        } else {
          openFaqItem(item);
        }
      });
    });

    // Auto-open item matching URL hash on page load
    const hash = location.hash;
    if (hash) {
      const target = document.querySelector(hash + '.faq-item');
      if (target) {
        setTimeout(() => {
          openFaqItem(target);
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    const serviceIcons = document.querySelectorAll('img.service-bg-icon[src$=".svg"]');

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
          item.matches(":hover, :focus-within")
        );

        if (servicesList) {
          servicesList.classList.toggle("has-service-interaction", Boolean(activeItem));
        }

        serviceItems.forEach((item) => {
          item.classList.toggle("is-interaction-active", item === activeItem);
        });
      });
    };

    window.addEventListener("resize", scheduleServiceCardUpdate, { passive: true });
    window.addEventListener("scroll", scheduleServiceCardUpdate, { passive: true });
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
          const svgDocument = new DOMParser().parseFromString(svgMarkup, "image/svg+xml");
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
            .querySelectorAll("circle:not(#hoverArea), path, polygon, polyline, rect, ellipse")
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

    window.addEventListener("load", () => {
      scheduleServiceCardUpdate();
      scheduleServiceCardInteractionUpdate();
    }, { once: true });
  }


  // ==========================================================================
  // 9. SCROLL PARALLAX (data-parallax-speed)
  // Same approach as the reference layout study.
  // Elements with [data-parallax-speed] shift vertically relative to their
  // center vs the viewport center as the user scrolls.
  // ==========================================================================

  function initParallax() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let items = [];
    let ticking = false;

    function updateParallax() {
      if (!items.length) return;

      const scrollY = window.scrollY || window.pageYOffset;
      const viewportCenter = scrollY + window.innerHeight / 2;

      items.forEach((item) => {
        item.style.transform = 'none';
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
      items = Array.from(document.querySelectorAll('[data-parallax-speed]'));
      requestParallaxUpdate();
    }

    refreshParallaxItems();
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', refreshParallaxItems, { passive: true });
    window.addEventListener('portfolio:content-updated', refreshParallaxItems);
  }
  // ==========================================================================

  /**
   * Initialize all modules when DOM is ready
   */
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
  }

  // Run init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
