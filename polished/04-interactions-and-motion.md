# 04 — Interactions & Motion

How the site **responds**. The difference between a page and an experience.

---

## Goal

Every interaction should feel **inevitable** — like the only possible response. No janky frames. No animations that exist for their own sake. No "loading" states where there could be instant feedback.

---

## 1. CSS scroll-driven animations (mandatory)

Modern browsers support tying animation progress to scroll position with zero JavaScript. No IntersectionObserver, no GSAP, no scroll event listeners.

### Basic fade-up on entry

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(2.5rem); }
  to   { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fade-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}
```

`animation-timeline: view()` ties the animation to the element's position in the viewport. `animation-range: entry 0% entry 40%` means the animation runs from "element just entered the viewport" to "element 40% into the viewport."

### Scroll-progress headers

```css
@keyframes shrink {
  to { padding-block: 0.5rem; backdrop-filter: blur(20px); }
}

header {
  animation: shrink linear both;
  animation-timeline: scroll(root);
  animation-range: 0 200px;
}
```

### Browser support

Chrome 115+, Edge 115+, Firefox 124+, Safari 18+. For older browsers, the animations simply do not run — the content is still visible. Progressive enhancement.

### Fallback for unsupported browsers

```css
@supports not (animation-timeline: view()) {
  .card { opacity: 1; transform: none; }
}
```

---

## 2. View Transitions API

The Page Swap API + View Transitions API together produce native-app-feeling page navigations. Single declaration enables them for the whole site:

```html
<meta name="view-transition" content="same-origin" />
```

Or in CSS:

```css
@view-transition {
  navigation: auto;
}
```

For specific elements that should morph between pages:

```css
.project-thumbnail {
  view-transition-name: project-card;
}

.project-detail-hero {
  view-transition-name: project-card;
}
```

When the visitor navigates from the index to a detail page, the thumbnail morphs into the hero. Native browser-level animation, no JS framework needed.

### Custom transition timing

```css
::view-transition-old(root) { animation-duration: 0.3s; }
::view-transition-new(root) { animation-duration: 0.3s; }
```

---

## 3. Hardware-accelerated cursor effects

Cursor effects done wrong cause main-thread jank. Done right, they are buttery and free.

```js
let cx = 0, cy = 0, rafId = 0;

addEventListener('pointermove', (e) => {
  cx = e.clientX;
  cy = e.clientY;
  if (!rafId) rafId = requestAnimationFrame(update);
}, { passive: true });

function update() {
  document.documentElement.style.setProperty('--cx', `${cx}px`);
  document.documentElement.style.setProperty('--cy', `${cy}px`);
  rafId = 0;
}
```

```css
.cursor-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 24rem;
  height: 24rem;
  pointer-events: none;
  transform: translate3d(calc(var(--cx, 50vw) - 12rem), calc(var(--cy, 50vh) - 12rem), 0);
  background: radial-gradient(circle, color-mix(in oklch, var(--accent) 12%, transparent) 0%, transparent 70%);
  mix-blend-mode: screen;
  will-change: transform;
  transition: transform 0.08s linear; /* tiny smoothing */
}

@media (hover: none), (prefers-reduced-motion: reduce) {
  .cursor-glow { display: none; }
}
```

Notes:
- `translate3d` (not `top`/`left`) keeps the element on the compositor thread.
- `will-change: transform` promotes to its own GPU layer.
- Disabled on touch devices and for reduced-motion users.

---

## 4. Optimistic UI

Most sites: user clicks → request sent → spinner → response → UI updates.
Result: feels sluggish.

Optimistic: user clicks → UI updates immediately → request sent in background → rollback if it fails.
Result: feels instant.

```js
async function toggleLike(button, postId) {
  const wasLiked = button.dataset.liked === 'true';
  const wasCount = +button.dataset.count;

  // Update UI immediately
  button.dataset.liked = (!wasLiked).toString();
  button.dataset.count = wasLiked ? wasCount - 1 : wasCount + 1;
  button.textContent = button.dataset.count;

  try {
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: wasLiked ? 'DELETE' : 'POST'
    });
    if (!res.ok) throw new Error('Server rejected');
  } catch {
    // Rollback
    button.dataset.liked = wasLiked.toString();
    button.dataset.count = wasCount.toString();
    button.textContent = wasCount.toString();
    showToast('Action failed. Try again.');
  }
}
```

Apply this pattern to: likes, follows, bookmarks, cart add/remove, form save indicators, theme toggles. Any UI state change that does not require server data to compute.

---

## 5. Page-load animations (the right way)

The hero should not pop in. It should reveal — but quickly, and only once.

```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero > * {
  animation: reveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

/* Stagger children */
.hero > *:nth-child(1) { animation-delay: 0s; }
.hero > *:nth-child(2) { animation-delay: 0.08s; }
.hero > *:nth-child(3) { animation-delay: 0.16s; }
.hero > *:nth-child(4) { animation-delay: 0.24s; }
```

Rules:
- Maximum 600 ms duration. Anything longer feels slow.
- Cubic-bezier with overshoot (`0.2, 0.8, 0.2, 1`) — never linear, never default `ease`.
- Stagger 60–80 ms between children. Less = chaotic. More = sluggish.
- One pass only. Never on every section load. Once the hero is shown, the visitor is on the site — stop entertaining them.

---

## 6. Hover and focus states

The most-touched element of any UI. Treat it like real craft.

```css
.btn {
  /* Base */
  --btn-bg: oklch(60% 0.18 250);
  background: var(--btn-bg);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 999px;
  font-weight: 500;
  transition:
    transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1),
    background 0.15s ease,
    box-shadow 0.15s ease;
  will-change: transform;
}

.btn:hover {
  background: oklch(from var(--btn-bg) calc(l + 0.05) c h);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px -8px oklch(from var(--btn-bg) l c h / 0.4);
}

.btn:active {
  transform: translateY(0);
  transition-duration: 0.05s; /* snappier on press */
}
```

Rules:
- Transitions on `transform`, `opacity`, `background`, `box-shadow` only. Never on layout properties.
- Hover lift = max 2 px. More feels gimmicky.
- Active state is faster (50 ms) than hover (150 ms) — the press should feel immediate.

---

## 7. Smooth, opinionated scrolling

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 4rem; /* avoids sticky-header overlap on anchor scroll */
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

For section navigation (anchor links to `#about`, `#contact`), `scroll-behavior: smooth` is free and feels right. Do NOT add JS smooth-scroll libraries — they always feel worse.

### Scroll snap (use sparingly)

```css
.gallery {
  scroll-snap-type: x mandatory;
  overflow-x: auto;
}

.gallery > * {
  scroll-snap-align: start;
}
```

Excellent for horizontal galleries. Avoid `scroll-snap-type: y mandatory` on full pages — it removes user control and feels intrusive.

---

## 8. :has() for state without JS

`:has()` (parent selector) eliminates a huge category of JS-only effects.

```css
/* Highlight a card when its checkbox is checked */
.card:has(input:checked) {
  border-color: var(--accent);
  background: color-mix(in oklch, var(--accent) 8%, transparent);
}

/* Dim siblings when one card is hovered */
.cards:has(.card:hover) .card:not(:hover) {
  opacity: 0.4;
}

/* Form has any error → show summary */
form:has(:user-invalid) .error-summary {
  display: block;
}
```

Browser support: all modern browsers (Chrome 105+, Firefox 121+, Safari 15.4+).

---

## 9. Form interactions

Forms are where most sites lose craft points instantly.

```css
input, textarea, select {
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
}

input:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 20%, transparent);
}

/* Show validation only after user has interacted */
input:user-invalid {
  border-color: var(--danger);
}

input:user-valid {
  border-color: var(--success);
}
```

`:user-invalid` and `:user-valid` (Firefox + Safari, Chrome 119+) only style after the user has actually interacted — no red borders on first paint.

### Inline error placement

```html
<label for="email">
  Email
  <input id="email" type="email" required aria-describedby="email-error" />
  <span id="email-error" class="error" hidden>Enter a valid email address</span>
</label>
```

```js
const input = document.getElementById('email');
const error = document.getElementById('email-error');

input.addEventListener('blur', () => {
  error.hidden = input.validity.valid;
});
```

---

## 10. Easing curves

Default `ease`, `ease-in`, `ease-out` are fine. They are also boring.

Standard craft set:

```css
:root {
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1); /* slight overshoot */
  --ease-snap:      cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

Use `--ease-out-expo` for entrance animations (fast start, slow finish — feels confident).
Use `--ease-snap` for hover/press feedback (decisive).
Use `--ease-spring` for "delight" moments (modal opens, toast appears).

---

## AVOID

- Adding scroll-jacking libraries (Locomotive, Lenis) unless there is a specific need. They almost always feel worse than native scroll on modern browsers.
- Long entrance animations on every section as the user scrolls. One per section is the limit, and it should be subtle.
- `transition: all` — animates layout properties accidentally and causes jank. Always list the specific properties.
- Animating `width`, `height`, `top`, `left`, `margin`, or `padding`. Use `transform` and `opacity` only.
- Hover effects on touch devices (use `@media (hover: hover)`).
- Custom scroll behavior that breaks `Cmd+Down` / `End` key navigation.
- Adding `pointer-events: none` to elements that need keyboard interaction. Use `inert` instead.
- Animating with JS what CSS can do.

---

## Verification

Before deploy:
1. Record a Performance trace while scrolling — frames should be ≤ 16.7 ms. No long tasks during scroll.
2. Hover and click every interactive element. Each should respond in under 100 ms.
3. Tab through the page. Focus rings should be visible and follow logical order.
4. Toggle `prefers-reduced-motion` in OS settings. All non-essential motion should stop.
5. On a slow connection, page navigation should still feel responsive (thanks to prefetching from `03-performance.md`).
