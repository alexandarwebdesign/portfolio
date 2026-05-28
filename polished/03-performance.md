# 03 — Performance

Performance is not "fast Lighthouse score." Performance is **a feeling** — the site responds before the visitor expects it to.

---

## Goal

Every interaction (page load, link hover, scroll, click) should feel **instant**. Not "fast enough." Not "under 200 ms." Instant — meaning the visitor never notices the delay.

---

## 1. content-visibility: auto (mandatory)

Single highest-impact CSS property almost no one uses. Tells the browser to skip layout, paint, and composite for off-screen sections.

```css
.section {
  content-visibility: auto;
  contain-intrinsic-size: 0 800px; /* estimated section height */
}
```

The `contain-intrinsic-size` is a placeholder that prevents scrollbar jumps when sections render in. Estimate it generously — under-estimating causes scroll glitches, over-estimating is harmless.

### Where to apply

Long-form pages: blog posts, case studies, about pages, FAQs. Anywhere with multiple distinct sections below the fold.

### Where to NOT apply

- Above-the-fold content (the browser already renders it).
- Sections with sticky positioning inside them (`content-visibility` breaks sticky).
- Sections with anchor links targeting their internal elements (browser cannot scroll into a skipped section).

---

## 2. Predictive prefetching

The "instant page load" trick. When the visitor's pointer enters a link, prefetch the destination. By the time they click (50–150 ms later), the page is already in cache.

### Implementation

```js
const prefetchOnHover = () => {
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.dataset.noPrefetch) return;
    if (link.hostname !== location.hostname) return;
    if (link.href === location.href) return;

    link.addEventListener('pointerenter', () => {
      const hint = document.createElement('link');
      hint.rel = 'prefetch';
      hint.href = link.href;
      hint.as = 'document';
      document.head.appendChild(hint);
    }, { once: true, passive: true });
  });
};

// Respect data-saver mode
if (!navigator.connection?.saveData) prefetchOnHover();
```

### Even better — the Speculation Rules API

Chrome 121+ supports prerendering, not just prefetching:

```html
<script type="speculationrules">
{
  "prerender": [{
    "where": { "href_matches": "/*" },
    "eagerness": "moderate"
  }]
}
</script>
```

`eagerness: "moderate"` triggers on pointerdown — gives ~80 ms of head start without burning bandwidth on every hover. `"conservative"` is even safer. `"eager"` prefetches everything visible.

When the visitor clicks, the page swaps in instantly — the navigation is already complete.

---

## 3. Resource hints

In the `<head>`, before any stylesheets:

```html
<!-- DNS resolution for external domains the page will use -->
<link rel="dns-prefetch" href="https://cdn.example.com" />

<!-- Full connection (DNS + TCP + TLS) for critical origins -->
<link rel="preconnect" href="https://cdn.example.com" crossorigin />

<!-- Critical assets the browser cannot discover until later -->
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high" />
<link rel="preload" as="font" href="/Inter.var.woff2" type="font/woff2" crossorigin />
```

Rules:
- Use `preconnect` sparingly — only for origins critical to LCP (image CDN, font host).
- Use `dns-prefetch` for less-critical origins (analytics, third-party widgets).
- Every `preload` must be used within the first ~2 seconds, or the browser warns.

---

## 4. Critical CSS inline

The first paint is blocked by the stylesheet. Inline the CSS needed for above-the-fold content, defer the rest.

### Pattern

```html
<head>
  <style>
    /* Inlined critical CSS — only what is needed for above-the-fold */
    :root { --bg: #0a0a0a; --text: #fafafa; }
    body { background: var(--bg); color: var(--text); font-family: Inter, sans-serif; }
    .hero { min-height: 100svh; display: grid; place-items: center; }
    /* … */
  </style>

  <!-- Full stylesheet, non-blocking -->
  <link rel="preload" href="/styles.css" as="style" onload="this.rel='stylesheet'" />
  <noscript><link rel="stylesheet" href="/styles.css" /></noscript>
</head>
```

### Generating critical CSS

Tools: `critters`, `penthouse`, or `beasties`. Run as a build step. Aim to keep inlined CSS under 14 KB (one TCP round-trip).

---

## 5. JavaScript loading

```html
<!-- Default: load and execute after HTML parsed -->
<script src="/app.js" defer></script>

<!-- Independent of the document, executes when ready -->
<script src="/analytics.js" async></script>

<!-- Conditionally loaded after main content -->
<script>
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const s = document.createElement('script');
      s.src = '/non-critical.js';
      document.body.appendChild(s);
    });
  }
</script>
```

Rules:
- Never use a synchronous `<script>` tag in `<head>` (blocks parsing).
- `defer` for ordered scripts that depend on DOM.
- `async` for independent scripts (analytics, error tracking).
- Use `type="module"` where possible — modern browsers, smaller bundles, native deferral.

---

## 6. Lazy-load entire sections (not just images)

Beyond `loading="lazy"` on images. Load the JS, CSS, and data for entire features only when they scroll into view.

```js
const sectionObserver = new IntersectionObserver(async (entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;

    const section = entry.target;
    const module = section.dataset.module;
    if (!module) continue;

    const [{ init }, data] = await Promise.all([
      import(`/sections/${module}.js`),
      fetch(`/api/sections/${module}`).then(r => r.json()).catch(() => null)
    ]);

    init(section, data);
    sectionObserver.unobserve(section);
  }
}, { rootMargin: '300px 0px' }); // start loading 300 px before visible

document.querySelectorAll('[data-module]').forEach(s => sectionObserver.observe(s));
```

The `rootMargin: '300px 0px'` gives a head start so by the time the section is actually visible, it is already mounted. Visitors never see a loading state.

---

## 7. Reduce main-thread work

Single-thread JS is the most common cause of jank. Move heavy work off the main thread:

```js
// Long task → break into chunks
function processBatch(items, batchSize = 50) {
  return new Promise(resolve => {
    let i = 0;
    function next() {
      const end = Math.min(i + batchSize, items.length);
      for (; i < end; i++) process(items[i]);
      if (i < items.length) {
        // Yield to the browser between chunks
        if ('scheduler' in window) {
          scheduler.postTask(next, { priority: 'background' });
        } else {
          setTimeout(next, 0);
        }
      } else {
        resolve();
      }
    }
    next();
  });
}
```

For genuinely heavy work (image processing, large data), use a Web Worker:

```js
const worker = new Worker('/worker.js', { type: 'module' });
worker.postMessage({ type: 'process', data });
worker.onmessage = (e) => { /* … */ };
```

---

## 8. Image performance recap

(Detailed in `01-images-and-media.md`, but reiterating the perf-critical parts.)

- Hero image: `fetchpriority="high"`, `decoding="sync"`, preloaded in `<head>`.
- Below the fold: `loading="lazy"`, `decoding="async"`.
- Always include `width` and `height` to reserve space (prevents CLS).
- Serve AVIF or WebP from a CDN. Never serve raw JPG/PNG above 100 KB.

---

## 9. Service worker (for return visits)

Repeat visitors should see the site instantly — no network needed for shell, CSS, fonts.

```js
// sw.js
const CACHE = 'shell-v1';
const ASSETS = ['/', '/styles.css', '/app.js', '/Inter.var.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // pass through cross-origin

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
```

```js
// In the main page
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
```

For a portfolio or marketing site, this turns a return visit into a sub-100ms load.

---

## 10. Compression and delivery

At the server / CDN level:
- **Brotli compression** for text assets (HTML, CSS, JS, SVG). Smaller than Gzip.
- **HTTP/2 or HTTP/3** — required, not optional.
- **Long-cache immutable assets** with hashed filenames: `Cache-Control: public, max-age=31536000, immutable`.
- **Short-cache HTML** with stale-while-revalidate: `Cache-Control: public, max-age=60, stale-while-revalidate=86400`.

---

## AVOID

- Synchronous third-party scripts (analytics, chat widgets, etc.) blocking page load.
- Large JS libraries used for one feature (e.g. importing all of lodash for a single utility).
- Animation libraries (GSAP, Framer Motion) when CSS animations would work.
- Custom fonts loaded from a third-party CDN (Google Fonts hosted) without `preconnect`.
- More than one webfont family per project.
- Background images on the hero (cannot be preloaded as effectively as `<img>`).
- Hidden elements that still run their animations (`display: none` does not stop CSS animations from triggering reflows on parent).
- Mounting all sections at page load on a long page.

---

## Verification

Before deploy, in Chrome DevTools:

1. **Lighthouse** — Performance score should be ≥ 95. LCP ≤ 1.5 s, CLS ≤ 0.05, INP ≤ 100 ms.
2. **Network tab, "Slow 4G" throttle** — first contentful paint ≤ 1.5 s, fully loaded ≤ 3 s.
3. **Performance tab recording** — main thread should be idle most of the time. No long tasks (> 50 ms) during scroll.
4. **Coverage tab** — unused CSS should be under 30 %, unused JS under 40 %.
5. **WebPageTest** — Speed Index ≤ 2.0 s on a moderate connection.

Real test: open the site on a 3-year-old mid-range Android phone over LTE. If it still feels instant, it is ready.
