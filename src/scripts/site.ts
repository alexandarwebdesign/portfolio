// The original site script (main.js), ported: scroll reveal, Lenis smooth
// scroll, anchor scrolling, the mobile menu, service rows that preselect the
// contact form, the contact form (Web3Forms), the FAQ accordion, parallax,
// the image marquee, case-study carousels and the sticky footer reveal.
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
    __revealReady?: boolean;
  }
}

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const tempo = () =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--duration-normal')) ||
  600;

// The footer sits fixed behind the page, inside the first screen, so while the web font swaps in
// its text reflows and counts as a layout shift nobody can see. It stays hidden until the fonts
// are in (the failsafe class shows it anyway).
function initFooterReady() {
  const ready = () => document.documentElement.classList.add('footer-ready');
  if (!document.fonts) return ready();
  void document.fonts.ready.then(() => requestAnimationFrame(ready));
}

// 1. Scroll reveal
function initScrollReveal() {
  window.__revealReady = true;
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -100px 0px', threshold: 0.1 },
  );
  items.forEach((item) => observer.observe(item));
}

// Statement ring: when the ring is half visible, the side lines and the
// circle draw themselves (CSS transitions, started by .is-drawn).
function initStatementRing() {
  const ring = document.querySelector('.statement-ring');
  if (!ring) return;
  const observer = new IntersectionObserver(
    (entries) => {
      // half of the ring is visible, or it fills most of a short window
      const half = entries.some(
        (entry) =>
          entry.intersectionRatio >= 0.5 ||
          entry.intersectionRect.height >= window.innerHeight * 0.45,
      );
      if (half) {
        ring.classList.add('is-drawn');
        observer.disconnect();
      }
    },
    { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] },
  );
  observer.observe(ring);
}

// SMIL ignores prefers-reduced-motion: pause it.
// The three process cards start their text on the same line: every row gets the height of the
// tallest one (the rows sit at the bottom, so a shorter row would otherwise start lower).
function initProcessRows() {
  const root = document.querySelector<HTMLElement>('.process');
  const texts = root ? [...root.querySelectorAll<HTMLElement>('.process__text')] : [];
  if (!root || texts.length < 2) return;
  const measure = () => {
    root.style.removeProperty('--process-row');
    let tallest = 0;
    for (const t of texts) {
      for (const child of Array.from(t.children))
        tallest = Math.max(tallest, (child as HTMLElement).offsetHeight);
    }
    if (tallest) root.style.setProperty('--process-row', `${tallest}px`);
  };
  measure();
  void document.fonts?.ready.then(measure);
  let width = root.clientWidth;
  new ResizeObserver(() => {
    if (root.clientWidth === width) return;
    width = root.clientWidth;
    measure();
  }).observe(root);
}

function initReducedMotionSvg() {
  if (!reduceMotion()) return;
  document.querySelectorAll('svg').forEach((svg) => {
    if (svg.querySelector('animate, animateTransform, animateMotion')) svg.pauseAnimations();
  });
}

function initReducedMotionVideo() {
  if (!reduceMotion()) return;
  document.querySelectorAll<HTMLVideoElement>('video[autoplay]').forEach((video) => {
    video.removeAttribute('autoplay');
    video.pause();
  });
}

function initPageLoadSequence() {
  if (reduceMotion()) {
    document.body.classList.add('is-loaded');
    return;
  }
  requestAnimationFrame(() =>
    requestAnimationFrame(() => document.body.classList.add('is-loaded')),
  );
}

// 2. Smooth scroll
function initSmoothScrollLenis() {
  if (reduceMotion()) return;
  const lenis = new Lenis({
    duration: 0.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1,
  });
  window.__lenis = lenis;
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

function scrollToTarget(target: Element, offset: number) {
  if (window.__lenis && !reduceMotion()) {
    window.__lenis.scrollTo(target as HTMLElement, { offset: -offset });
    return tempo();
  }
  const top = target.getBoundingClientRect().top + scrollY - offset;
  scrollTo({ top, behavior: reduceMotion() ? 'auto' : 'smooth' });
  return reduceMotion() ? 0 : tempo();
}

function initSmoothScroll() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const delay = scrollToTarget(target, 120);
      const focusSelector = link.dataset.focusTarget;
      if (focusSelector) {
        setTimeout(() => {
          document.querySelector<HTMLElement>(focusSelector)?.focus({ preventScroll: true });
        }, delay);
      }
      history.pushState(null, '', id);
    });
  });
}

function initContactHashFocus() {
  if (location.hash !== '#contact') return;
  setTimeout(() => {
    const contact = document.getElementById('contact');
    if (contact) scrollToTarget(contact, 120);
    document.getElementById('name')?.focus({ preventScroll: true });
  }, 250);
}

// 3. Service rows preselect the contact form
function initServiceClick() {
  const rows = document.querySelectorAll<HTMLElement>('.service-row[data-service]');
  const select = document.getElementById('service') as HTMLSelectElement | null;
  const name = document.getElementById('name');
  const contact = document.getElementById('contact');
  if (!rows.length || !select || !name || !contact) return;

  const activate = (value: string) => {
    select.value = value;
    const top = contact.getBoundingClientRect().top + scrollY - 80;
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 0.8 });
    else scrollTo({ top, behavior: 'smooth' });
    setTimeout(() => name.focus(), 600);
  };

  rows.forEach((row) => {
    // Mouse convenience: the whole row works; the keyboard uses the visible link.
    row.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).closest('a')) return;
      activate(row.dataset.service!);
    });
    row.querySelector<HTMLAnchorElement>('[data-service-pick]')?.addEventListener('click', () => {
      // The link's own smooth scroll and focus handler does the rest.
      select.value = row.dataset.service!;
    });
    // Row hover drives the SMIL hover animation of its icon.
    const target = row.querySelector('.service-icon [data-hover-target]');
    if (target) {
      row.addEventListener('mouseenter', () => target.dispatchEvent(new MouseEvent('mouseover')));
      row.addEventListener('mouseleave', () => target.dispatchEvent(new MouseEvent('mouseout')));
    }
  });
}

// 4. Contact form (Web3Forms)
function initFormHandling() {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;
  // Messages come from the page in its language (data-msg-* on the form).
  const msg = form.dataset;
  const messages = {
    sending: msg.msgSending!,
    sent: msg.msgSent!,
    success: msg.msgSuccess!,
    failed: msg.msgFailed!,
    fix: (n: number) => (n === 1 ? msg.msgFixOne! : msg.msgFixMany!.replace('{n}', String(n))),
    errors: {
      name: msg.errName!,
      email: msg.errEmail!,
      message: msg.errMessage!,
    },
  };
  const status = document.getElementById('form-status');
  const fields = ['name', 'email', 'message'] as const;

  const setStatus = (text: string, state?: string) => {
    if (!status) return;
    status.textContent = text;
    if (state) status.dataset.state = state;
    else delete status.dataset.state;
  };

  const clearErrors = () => {
    for (const id of fields) {
      form.querySelector(`#${id}`)?.removeAttribute('aria-invalid');
      const error = form.querySelector<HTMLElement>(`#${id}-error`);
      if (error) {
        error.hidden = true;
        error.textContent = '';
      }
    }
  };

  const validate = (data: Record<string, string>) => {
    const errors: Partial<Record<(typeof fields)[number], string>> = {};
    if (!data.name || data.name.trim().length < 2) errors.name = messages.errors.name;
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = messages.errors.email;
    if (!data.message || data.message.trim().length < 10) errors.message = messages.errors.message;
    return errors;
  };

  // Check one field when the visitor leaves it (not per keystroke); clear its
  // message as soon as it is fixed.
  const checkField = (id: (typeof fields)[number]) => {
    const input = form.querySelector<HTMLInputElement>(`#${id}`);
    const error = form.querySelector<HTMLElement>(`#${id}-error`);
    if (!input || !error) return;
    const message = validate(Object.fromEntries(new FormData(form)) as Record<string, string>)[id];
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    error.textContent = message ?? '';
    error.hidden = !message;
  };
  for (const id of fields) {
    const input = form.querySelector<HTMLElement>(`#${id}`);
    input?.addEventListener('blur', () => checkField(id));
    input?.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') checkField(id);
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData) as Record<string, string>;
    clearErrors();
    setStatus('');

    const errors = validate(data);
    const invalid = Object.keys(errors) as (typeof fields)[number][];
    if (invalid.length) {
      for (const id of invalid) {
        form.querySelector(`#${id}`)?.setAttribute('aria-invalid', 'true');
        const error = form.querySelector<HTMLElement>(`#${id}-error`);
        if (error) {
          error.textContent = errors[id]!;
          error.hidden = false;
        }
      }
      form.querySelector<HTMLElement>(`#${invalid[0]}`)?.focus();
      setStatus(messages.fix(invalid.length), 'error');
      return;
    }

    // The service is optional: an empty one is left out of the email.
    if (!data.service) formData.delete('service');

    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const original = button.innerHTML;
    button.classList.add('loading');
    button.innerHTML = `<div class="loading-container"><svg class="progress-ring" viewBox="0 0 36 36"><circle class="progress-ring__circle" cx="18" cy="18" r="15.915"/></svg><span class="spinner-checkmark"></span></div>`;
    button.disabled = true;
    setStatus(messages.sending);

    const wait = new Promise((resolve) => setTimeout(resolve, 1000));
    const request = fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });

    Promise.all([request, wait])
      .then(async ([response]) => {
        const json = await response.json();
        if (response.status !== 200) throw new Error(json.message || messages.failed);
        button.classList.remove('loading');
        button.classList.add('success');
        button.textContent = messages.sent;
        form.reset();
        setStatus(messages.success, 'success');
        setTimeout(() => {
          button.classList.remove('success');
          button.innerHTML = original;
          button.disabled = false;
        }, 3000);
      })
      .catch(() => {
        setStatus(messages.failed, 'error');
        button.classList.remove('loading');
        button.innerHTML = original;
        button.disabled = false;
      });
  });
}

// 7. FAQ accordion (several can be open)
function initFaqAccordion() {
  const items = document.querySelectorAll<HTMLElement>('.faq-item');
  if (!items.length) return;

  const set = (item: HTMLElement, open: boolean) => {
    item.classList.toggle('is-open', open);
    item.querySelector('.faq-question')?.setAttribute('aria-expanded', String(open));
  };

  items.forEach((item) => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
      set(item, !item.classList.contains('is-open'));
    });
  });

  // A link to #faq-3 opens that question.
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target?.classList.contains('faq-item')) {
      setTimeout(() => {
        set(target, true);
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }
}

// 9. Parallax (data-parallax-speed)
function initParallax() {
  if (reduceMotion()) return;
  let items: HTMLElement[] = [];
  let ticking = false;

  const update = () => {
    const viewportCenter = scrollY + innerHeight / 2;
    const mobile = innerWidth <= 900;
    for (const item of items) {
      item.style.transform = 'none';
      let speed = Number(item.dataset.parallaxSpeed) || 0;
      if (mobile && item.closest('.mobile-col')) continue;
      if (mobile && Math.abs(speed) > 1) speed = speed > 0 ? 1 : -1;
      const rect = item.getBoundingClientRect();
      const middle = scrollY + rect.top + rect.height / 2;
      item.style.transform = `translate3d(0, ${(viewportCenter - middle) * -(speed / 10)}px, 0)`;
    }
  };
  const request = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };
  const refresh = () => {
    items = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-speed]'));
    request();
  };
  refresh();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', refresh, { passive: true });
}

// Image marquee: scroll-linked, drifting, draggable.
function initImageMarquee() {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-marquee-track]');
    const row = root.querySelector<HTMLElement>('[data-marquee-row]');
    if (!track || !row) return;

    const markLoaded = (scope: ParentNode) =>
      scope.querySelectorAll('img').forEach((img) => {
        if (img.complete && img.naturalWidth > 0) img.dataset.loaded = 'true';
        else img.addEventListener('load', () => (img.dataset.loaded = 'true'), { once: true });
      });
    markLoaded(row);
    if (reduceMotion()) return;

    const clone = row.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach((img) => (img.alt = ''));
    markLoaded(clone);
    track.appendChild(clone);

    const SCROLL_SPEED = 0.49;
    const IDLE_SPEED = 0.056;
    const MOMENTUM_DECAY = 0.93;
    const MOMENTUM_THRESHOLD = 0.05;
    let rowWidth = 0;
    let currentX = 0;
    let lastScrollY = scrollY;
    let lastFrame = performance.now();
    let rafId: number | null = null;
    let inView = false;
    let dragging = false;
    let dragLastX = 0;
    let dragLastT = 0;
    let velocity = 0;
    let pointer: number | null = null;
    let hovering = false; // the drift stops under a mouse so a design can be read
    const viewport = root.querySelector<HTMLElement>('.image-marquee__viewport') ?? root;

    const wrap = () => {
      if (rowWidth <= 0) return;
      while (currentX <= -rowWidth) currentX += rowWidth;
      while (currentX > 0) currentX -= rowWidth;
    };
    const measure = () => (rowWidth = row.getBoundingClientRect().width);
    measure();
    addEventListener('resize', measure);

    const onScroll = () => {
      const dy = scrollY - lastScrollY;
      lastScrollY = scrollY;
      if (!dragging) currentX -= dy * SCROLL_SPEED;
    };

    const tick = (now: number) => {
      const dt = now - lastFrame;
      lastFrame = now;
      if (!dragging) {
        if (Math.abs(velocity) > MOMENTUM_THRESHOLD) {
          currentX += velocity * dt;
          velocity *= Math.pow(MOMENTUM_DECAY, dt / 16.67);
        } else {
          velocity = 0;
          if (!hovering) currentX -= IDLE_SPEED * dt;
        }
      }
      wrap();
      track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
      rafId = inView ? requestAnimationFrame(tick) : null;
    };

    viewport.addEventListener('pointerenter', (event) => {
      hovering = event.pointerType === 'mouse';
    });
    viewport.addEventListener('pointerleave', () => {
      hovering = false;
    });
    viewport.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      dragging = true;
      pointer = event.pointerId;
      dragLastX = event.clientX;
      dragLastT = performance.now();
      velocity = 0;
      viewport.classList.add('is-dragging');
      viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointermove', (event) => {
      if (!dragging || event.pointerId !== pointer) return;
      const now = performance.now();
      const dx = event.clientX - dragLastX;
      currentX += dx;
      velocity = dx / Math.max(1, now - dragLastT);
      dragLastX = event.clientX;
      dragLastT = now;
      wrap();
    });
    const release = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointer) return;
      dragging = false;
      pointer = null;
      viewport.classList.remove('is-dragging');
      if (viewport.hasPointerCapture(event.pointerId))
        viewport.releasePointerCapture(event.pointerId);
    };
    viewport.addEventListener('pointerup', release);
    viewport.addEventListener('pointercancel', release);
    viewport.addEventListener('dragstart', (event) => event.preventDefault());

    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          addEventListener('scroll', onScroll, { passive: true });
          measure();
          lastScrollY = scrollY;
          lastFrame = performance.now();
          if (!rafId) rafId = requestAnimationFrame(tick);
        } else {
          removeEventListener('scroll', onScroll);
          if (rafId) cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { rootMargin: '200px 0px' },
    ).observe(root);
  });
}

function initCaseCarousels() {
  document.querySelectorAll<HTMLElement>('[data-case-carousel]').forEach((root) => {
    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-carousel-slide]'));
    if (!slides.length) return;
    let active = Math.max(
      0,
      slides.findIndex((slide) => slide.classList.contains('is-active')),
    );
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.carousel-btn[data-carousel]'),
    ).filter((button) => button.dataset.carousel === root.id);

    const set = (next: number) => {
      active = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === active);
        slide.setAttribute('aria-hidden', String(i !== active));
      });
      root.dataset.activeSlide = String(active + 1);
    };
    buttons.forEach((button) =>
      button.addEventListener('click', () =>
        set(active + (button.dataset.dir === 'prev' ? -1 : 1)),
      ),
    );
    root.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      set(active + (event.key === 'ArrowLeft' ? -1 : 1));
    });
    if (!root.hasAttribute('tabindex')) root.setAttribute('tabindex', '0');
    set(active);
  });
}

// The footer sits under the page; a focused link there scrolls it into view.
function initFooterFocusReveal() {
  const footer = document.querySelector('.footer');
  footer?.addEventListener('focusin', () => {
    const target = document.documentElement.scrollHeight - innerHeight;
    if (scrollY >= target - 4) return;
    if (window.__lenis && !reduceMotion()) window.__lenis.scrollTo(target);
    else scrollTo({ top: target, behavior: reduceMotion() ? 'auto' : 'smooth' });
  });
}

function initMobileNav() {
  const burger = document.querySelector<HTMLButtonElement>('.nav-burger');
  const menu = document.getElementById('nav-mobile-menu');
  if (!burger || !menu) return;

  const open = () => {
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', burger.dataset.closeLabel!);
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', burger.dataset.openLabel!);
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () =>
    burger.getAttribute('aria-expanded') === 'true' ? close() : open(),
  );
  menu
    .querySelectorAll('.nav-mobile-link')
    .forEach((link) => link.addEventListener('click', close));
  menu.addEventListener('click', (event) => {
    if (event.target === menu) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      close();
      burger.focus();
    }
  });
}

function init() {
  initFooterReady();
  initSmoothScrollLenis();
  initReducedMotionSvg();
  initReducedMotionVideo();
  initPageLoadSequence();
  initScrollReveal();
  initStatementRing();
  initProcessRows();
  initSmoothScroll();
  initMobileNav();
  initFormHandling();
  initContactHashFocus();

  // Below-the-fold behaviour waits for idle time (shorter start-up task).
  const deferred = () => {
    initServiceClick();
    initFaqAccordion();
    initParallax();
    initImageMarquee();
    initCaseCarousels();
    initFooterFocusReveal();
  };
  if ('requestIdleCallback' in window) requestIdleCallback(deferred, { timeout: 1500 });
  else setTimeout(deferred, 1);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
