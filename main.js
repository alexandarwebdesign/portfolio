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

  // ==========================================================================
  // 2. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================================

  /**
   * Handle smooth scrolling for navigation links
   */
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");

        // Skip if it's just "#" or empty
        if (targetId === "#" || !targetId) return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          // Calculate offset for fixed navbar
          const navbarHeight = 120;
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
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

    function updateNavbar() {
      if (window.scrollY > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    // Throttle scroll event
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNavbar();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check
    updateNavbar();
  }

  // ==========================================================================
  // 6. MOBILE NAVIGATION — Curved Wipe Transition
  // ==========================================================================

  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (!toggle || !mobileNav) return;

    let currentAnim = null;

    // Enter: visible area grows from right (vw-x → vw), leading left edge curves left
    function enterPath(vw, vh, x, curve) {
      const q1 = Math.round(vh * 0.25);
      const q3 = Math.round(vh * 0.75);
      const rx = vw - x;
      return `path('M ${vw} 0 L ${vw} ${vh} L ${rx} ${vh} C ${rx - curve} ${q3} ${rx - curve} ${q1} ${rx} 0 Z')`;
    }

    // Exit: visible area shrinks from right (0 → x), right edge curves left
    function exitPath(vh, x, curve) {
      const q1 = Math.round(vh * 0.25);
      const q3 = Math.round(vh * 0.75);
      return `path('M 0 0 L 0 ${vh} L ${x} ${vh} C ${x - curve} ${q3} ${x - curve} ${q1} ${x} 0 Z')`;
    }


    function openNav() {
      if (currentAnim) currentAnim.cancel();

      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
      mobileNav.setAttribute('aria-hidden', 'false');
      mobileNav.style.pointerEvents = 'all';
      document.body.style.overflow = 'hidden';

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const c  = Math.round(vw * 0.14);
      const mid = Math.round(vw * 0.5);

      currentAnim = mobileNav.animate(
        [
          { clipPath: enterPath(vw, vh, 0, 0) },
          { clipPath: enterPath(vw, vh, mid, c), offset: 0.45 },
          { clipPath: enterPath(vw, vh, vw, 0) }
        ],
        { duration: 650, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
      );
    }

    function closeNav() {
      if (currentAnim) currentAnim.cancel();

      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const c  = Math.round(vw * 0.14);
      const mid = Math.round(vw * 0.5);

      currentAnim = mobileNav.animate(
        [
          { clipPath: exitPath(vh, vw, 0) },
          { clipPath: exitPath(vh, mid, c), offset: 0.55 },
          { clipPath: exitPath(vh, 0, 0) }
        ],
        { duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
      );


      currentAnim.onfinish = () => {
        mobileNav.style.pointerEvents = 'none';
      };
    }

    // Set initial hidden state (matches enter animation start)
    mobileNav.style.clipPath = enterPath(window.innerWidth, window.innerHeight, 0, 0);

    toggle.addEventListener('click', () => {
      toggle.classList.contains('is-open') ? closeNav() : openNav();
    });

    mobileNav.querySelectorAll('.mobile-nav-link, .mobile-nav-cta').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.classList.contains('is-open')) closeNav();
    });
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
    
    faqItems.forEach(item => {
      const button = item.querySelector('.faq-question');
      
      if (!button) return;
      
      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        
        // Close all other items first
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('is-open')) {
            otherItem.classList.remove('is-open');
            const otherButton = otherItem.querySelector('.faq-question');
            if (otherButton) {
              otherButton.setAttribute('aria-expanded', 'false');
            }
          }
        });
        
        // Toggle current item
        if (isOpen) {
          item.classList.remove('is-open');
          button.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ==========================================================================
  // 7. INITIALIZE
  // ==========================================================================

  /**
   * Initialize all modules when DOM is ready
   */
  function init() {
    initScrollReveal();
    initSmoothScroll();
    initActiveNavigation();
    initFormHandling();
    initNavbarScroll();
    initMobileNav();
    initFaqAccordion();
  }

  // Run init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
