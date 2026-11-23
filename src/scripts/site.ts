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
          currentX -= IDLE_SPEED * dt;
        }
      }
      wrap();
      track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
      rafId = inView ? requestAnimationFrame(tick) : null;
    };

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

// The client's mark as ASCII art, as a slab seen in perspective, with a faint band of light. The characters stay upright:
// the 3D is done in the grid. For every cell a few rays go through the slab (turned and thick, like
// the CSS transform it replaces) and are followed until they enter the shape. Entering through the
// face gives a character by how dark the mark is there; entering through a side wall gives a lighter
// one, by how the wall is lit and how deep the ray went in.
function initAsciiArt() {
  // Code characters instead of a plain ramp: each level is a small set of them, light to dense, and a
  // fixed pattern picks one inside the set, so the art reads as a page of code.
  const RAMP = [' ', '.,', ':;', '-=+', '<>/\\', '()[]{}', '$#&*'];
  const SIDE = [' ', '.,', ':;', '-/']; // the walls of the slab: lighter than the face
  const code = (set: string, x: number, y: number) =>
    set[(x * 7 + y * 13 + ((x * y) % 5)) % set.length];
  const SOLID = 0.35; // the mask value from which a point is inside the shape
  const TURN = { x: 37, y: -32, z: -8 }; // degrees, as the CSS rotateX / rotateY / rotateZ
  const PERSPECTIVE = 1100; // px, as the CSS perspective()
  const THICK = 0.22; // the depth of the slab, as a part of the mark's width
  const FIT = 0.88; // the width of the mark, as a part of the box
  const LIGHT = { x: -0.55, y: -0.83 }; // where the light comes from, in the mark's own plane
  const SAMPLES = [-1 / 3, 0, 1 / 3]; // rays per cell: 3 x 3
  document.querySelectorAll<HTMLElement>('[data-ascii-art]').forEach((root) => {
    const pre = root.querySelector<HTMLPreElement>('pre.ascii-art');
    const src = root.dataset.asciiArt;
    if (!pre || !src) return;
    // a mark with thin bars and narrow gaps needs a shallower slab, or the walls fill its gaps
    const thick = Number(root.dataset.asciiDepth) || THICK;
    const image = new Image();
    image.onload = () => {
      const MW = 360;
      const MH = Math.round(MW * (image.naturalHeight / image.naturalWidth));
      // the mark as a mask: 0 empty, 1 solid
      const mask = new Float32Array(MW * MH);
      const canvas = document.createElement('canvas');
      canvas.width = MW;
      canvas.height = MH;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, MW, MH);
      ctx.drawImage(image, 0, 0, MW, MH);
      const px = ctx.getImageData(0, 0, MW, MH).data;
      for (let i = 0; i < MW * MH; i++) {
        mask[i] = 1 - (px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114) / 255;
      }
      const at = (x: number, y: number) =>
        x < 0 || y < 0 || x >= MW || y >= MH ? 0 : mask[y * MW + x];
      // smooth: the mask between its pixels, so edges and walls are not stepped
      const sample = (fx: number, fy: number) => {
        const x = Math.floor(fx - 0.5);
        const y = Math.floor(fy - 0.5);
        const tx = fx - 0.5 - x;
        const ty = fy - 0.5 - y;
        return (
          (at(x, y) * (1 - tx) + at(x + 1, y) * tx) * (1 - ty) +
          (at(x, y + 1) * (1 - tx) + at(x + 1, y + 1) * tx) * ty
        );
      };

      // R = Ry * Rx * Rz (the CSS order), then its transpose takes world to object
      const rad = Math.PI / 180;
      const [cx, sx] = [Math.cos(TURN.x * rad), Math.sin(TURN.x * rad)];
      const [cy, sy] = [Math.cos(TURN.y * rad), Math.sin(TURN.y * rad)];
      const [cz, sz] = [Math.cos(TURN.z * rad), Math.sin(TURN.z * rad)];
      type M = number[][];
      const mul = (a: M, b: M): M =>
        a.map((_, i) =>
          b[0].map((_, j) => a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j]),
        );
      const R = mul(
        [
          [cy, 0, sy],
          [0, 1, 0],
          [-sy, 0, cy],
        ],
        mul(
          [
            [1, 0, 0],
            [0, cx, -sx],
            [0, sx, cx],
          ],
          [
            [cz, -sz, 0],
            [sz, cz, 0],
            [0, 0, 1],
          ],
        ),
      );
      const Rt = R[0].map((_, j) => R.map((row) => row[j]));
      const toObject = (v: number[]) =>
        Rt.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);

      let gridCols = 0;
      let gridRows = 0;
      let kind = new Uint8Array(0);
      let level = new Uint8Array(0);
      let sweep = { from: 0, length: 1 }; // where the band starts and how far it travels, in `along`
      const along = (x: number, y: number) => (x / gridCols) * 0.8 + (y / gridRows) * 0.5;

      // Draw the grid. A soft band of light crosses it slowly: inside the band a character is one
      // level lighter and the pick inside its set shifts a little, so it glints. t is in ms.
      const paint = (t: number) => {
        const phase = sweep.from + ((t / 7000) % sweep.length);
        let out = '';
        for (let y = 0; y < gridRows; y++) {
          for (let x = 0; x < gridCols; x++) {
            const i = y * gridCols + x;
            if (!kind[i]) {
              out += ' ';
              continue;
            }
            const near = Math.max(0, 1 - Math.abs(along(x, y) - phase) / 0.14);
            const glint = near * near;
            let lv = level[i];
            if (glint > 0.5) lv = Math.max(kind[i] === 1 ? 1 : 0, lv - 1);
            const set = kind[i] === 1 ? RAMP[lv] : SIDE[lv];
            out += code(set, x + Math.floor(glint * 3), y);
          }
          out += '\n';
        }
        pre.textContent = out;
      };

      let raf = 0;
      let visible = false;
      let lastFrame = 0;
      const loop = (t: number) => {
        raf = 0;
        if (!visible || document.hidden) return;
        if (t - lastFrame > 60) {
          lastFrame = t;
          paint(t);
        }
        raf = requestAnimationFrame(loop);
      };
      const start = () => {
        if (!raf && visible && !reduceMotion()) raf = requestAnimationFrame(loop);
      };

      const build = () => {
        const W = root.clientWidth;
        const H = root.clientHeight;
        if (!W || !H) return;
        // one character of the monospace face, at the size set in CSS
        pre.hidden = false;
        pre.textContent = '';
        const span = document.createElement('span');
        span.textContent = 'M'.repeat(20);
        pre.append(span);
        const cellW = span.getBoundingClientRect().width / 20;
        const lineH = parseFloat(getComputedStyle(pre).lineHeight);
        if (!cellW || !lineH) return;
        const cols = Math.max(24, Math.floor(W / cellW));
        const rows = Math.max(8, Math.floor(H / lineH));
        const aspect = image.naturalHeight / image.naturalWidth;
        let markW = W * FIT;
        let markH = markW * aspect;
        let depth = markW * thick;
        let pixel = markW / MW; // one mask pixel, in px
        let shiftU = 0; // where the turned slab sits on the screen, so it can be centred in the box
        let shiftV = 0;
        const origin = toObject([0, 0, PERSPECTIVE]);
        const maskAt = (ox: number, oy: number) =>
          sample((ox / markW + 0.5) * MW, (oy / markH + 0.5) * MH);

        // Follow one ray through the slab, from its face to its back. Returns the face (with the
        // darkness of the mark), a wall (with its light and depth), or nothing.
        const cast = (u: number, v: number) => {
          const d = toObject([u + shiftU, v + shiftV, -PERSPECTIVE]);
          if (d[2] >= 0) return null;
          const tFace = -origin[2] / d[2];
          const tBack = (-depth - origin[2]) / d[2];
          const length = Math.hypot(d[0], d[1], d[2]) * (tBack - tFace);
          const steps = Math.max(2, Math.min(420, Math.ceil(length / (pixel * 0.5))));
          let before = tFace;
          for (let i = 0; i <= steps; i++) {
            const t = tFace + ((tBack - tFace) * i) / steps;
            const m = maskAt(origin[0] + t * d[0], origin[1] + t * d[1]);
            if (m < SOLID) {
              before = t;
              continue;
            }
            if (i === 0) return { face: true, m, lit: 0, depthAt: 0 };
            // the ray entered through a wall between `before` and `t`: find where
            let lo = before;
            let hi = t;
            for (let j = 0; j < 7; j++) {
              const mid = (lo + hi) / 2;
              if (maskAt(origin[0] + mid * d[0], origin[1] + mid * d[1]) >= SOLID) hi = mid;
              else lo = mid;
            }
            const ox = origin[0] + hi * d[0];
            const oy = origin[1] + hi * d[1];
            // the wall faces where the mask falls away
            const gx = maskAt(ox + pixel, oy) - maskAt(ox - pixel, oy);
            const gy = maskAt(ox, oy + pixel) - maskAt(ox, oy - pixel);
            const len = Math.hypot(gx, gy) || 1;
            const lit = Math.max(0, (-gx / len) * LIGHT.x + (-gy / len) * LIGHT.y);
            const depthAt = Math.min(1, Math.max(0, -(origin[2] + hi * d[2]) / depth));
            return { face: false, m: 0, lit, depthAt };
          }
          return null;
        };

        // The tilt pushes the slab right and down, and a box cuts what leaves it. So measure where the
        // slab lands, then centre it in the box and shrink it if it does not fit.
        const extent = () => {
          let u0 = Infinity;
          let u1 = -Infinity;
          let v0 = Infinity;
          let v1 = -Infinity;
          for (let v = -H; v <= H; v += 10) {
            for (let u = -W; u <= W; u += 10) {
              if (!cast(u, v)) continue;
              u0 = Math.min(u0, u);
              u1 = Math.max(u1, u);
              v0 = Math.min(v0, v);
              v1 = Math.max(v1, v);
            }
          }
          return { u0, u1, v0, v1 };
        };
        for (let pass = 0; pass < 3; pass++) {
          shiftU = 0;
          shiftV = 0;
          const e = extent();
          if (!isFinite(e.u0)) break;
          const scale = Math.min(
            1.3,
            Math.max(0.5, Math.min((W * 0.9) / (e.u1 - e.u0), (H * 0.9) / (e.v1 - e.v0))),
          );
          markW *= scale;
          markH = markW * aspect;
          depth = markW * thick;
          pixel = markW / MW;
        }
        shiftU = 0;
        shiftV = 0;
        const e = extent();
        if (isFinite(e.u0)) {
          shiftU = (e.u0 + e.u1) / 2;
          shiftV = (e.v0 + e.v1) / 2;
        }

        const last = RAMP.length - 1;
        const rays = SAMPLES.length * SAMPLES.length;
        gridCols = cols;
        gridRows = rows;
        kind = new Uint8Array(cols * rows); // 0 empty, 1 face, 2 wall
        level = new Uint8Array(cols * rows); // the level of the character within RAMP or SIDE
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            let face = 0;
            let dark = 0;
            let wall = 0;
            let tone = 0;
            for (const dy of SAMPLES) {
              for (const dx of SAMPLES) {
                const hit = cast((x + 0.5 + dx) * cellW - W / 2, (y + 0.5 + dy) * lineH - H / 2);
                if (!hit) continue;
                if (hit.face) {
                  face++;
                  dark += hit.m;
                } else {
                  wall++;
                  tone += (0.4 + 0.6 * hit.lit) * (1 - 0.6 * hit.depthAt);
                }
              }
            }
            if (face + wall < rays * 0.4) continue;
            const i = y * cols + x;
            if (face >= wall) {
              kind[i] = 1;
              level[i] = Math.max(1, Math.min(last, Math.round((dark / face) ** 0.85 * last)));
            } else {
              kind[i] = 2;
              level[i] = Math.max(
                0,
                Math.min(SIDE.length - 1, Math.round((tone / wall) * (SIDE.length - 1))),
              );
            }
          }
        }
        // the band travels only across the mark, then rests a short while before it starts again
        let first = Infinity;
        let lastAlong = -Infinity;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            if (!kind[y * cols + x]) continue;
            first = Math.min(first, along(x, y));
            lastAlong = Math.max(lastAlong, along(x, y));
          }
        }
        const REST = 0.12; // the pause between two passes, in the same unit as the band's width
        sweep = { from: first - 0.06 - REST / 2, length: lastAlong - first + 0.12 + REST };
        root.classList.add('is-ascii');
        paint(0);
      };

      let timer = 0;
      let lastWidth = root.clientWidth;
      new ResizeObserver(() => {
        if (root.clientWidth === lastWidth) return; // only a change of width needs a new grid
        lastWidth = root.clientWidth;
        clearTimeout(timer);
        timer = window.setTimeout(build, 150);
      }).observe(root);
      build();
      // it only runs while it is on screen, in a visible tab, and never for reduced motion
      new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          start();
        },
        { rootMargin: '10% 0px' },
      ).observe(root);
      document.addEventListener('visibilitychange', start);
    };
    image.src = src;
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

// Language switch: the other language opens where you were. On click the section at the top of the
// screen (its index among the page's sections, and how far through it you are) is kept in
// sessionStorage; the other language has the same sections, so the same place is found there.
const LANG_SCROLL_KEY = 'lang-switch-scroll';
const samePath = (a: string, b: string) => a.replace(/\/+$/, '') === b.replace(/\/+$/, '');

function initLanguageSwitchScroll() {
  const show = () => document.documentElement.classList.remove('lang-pending');
  const sections = () => Array.from(document.querySelectorAll<HTMLElement>('main section'));
  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;

  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[hreflang]');
    if (!link || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    try {
      const list = sections();
      let index = -1;
      list.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= 0) index = i;
      });
      const atEnd = maxScroll() > 0 && scrollY >= maxScroll() - 2;
      const box = index >= 0 ? list[index].getBoundingClientRect() : null;
      const fraction = box && box.height > 0 ? Math.min(1, -box.top / box.height) : 0;
      sessionStorage.setItem(
        LANG_SCROLL_KEY,
        JSON.stringify({ to: link.pathname, index, fraction, atEnd, at: Date.now() }),
      );
    } catch {
      /* no storage: the switch simply opens at the top */
    }
  });

  let saved: { to: string; index: number; fraction: number; atEnd: boolean; at: number } | null =
    null;
  try {
    saved = JSON.parse(sessionStorage.getItem(LANG_SCROLL_KEY) || 'null');
    sessionStorage.removeItem(LANG_SCROLL_KEY);
  } catch {
    saved = null;
  }
  if (!saved || !samePath(saved.to, location.pathname) || Date.now() - saved.at > 15000) {
    show();
    return;
  }
  if (saved.index < 0 && !saved.atEnd) {
    show();
    return;
  }

  const target = () => {
    if (!saved) return 0;
    if (saved.atEnd) return maxScroll();
    const el = sections()[saved.index];
    if (!el) return scrollY;
    return el.getBoundingClientRect().top + scrollY + saved.fraction * el.offsetHeight;
  };
  const go = (top: number) => scrollTo({ top, behavior: 'instant' });
  document.documentElement.classList.add('lang-restored');
  let placed = target();
  go(placed);
  show();
  // images and sections that were not drawn yet change the heights: once the page has loaded, place it
  // again, unless the reader has already moved
  addEventListener(
    'load',
    () => {
      if (Math.abs(scrollY - placed) > 2) return;
      placed = target();
      go(placed);
    },
    { once: true },
  );
}

function init() {
  initFooterReady();
  initLanguageSwitchScroll();
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
    initAsciiArt();
    initFooterFocusReveal();
  };
  if ('requestIdleCallback' in window) requestIdleCallback(deferred, { timeout: 1500 });
  else setTimeout(deferred, 1);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
