# 05 — Accessibility & Polish

The marks of a professional. Most of this is invisible — but its absence is what separates "built fast" from "built right."

---

## Goal

The site should work for **every visitor**, on every input device, at every system preference. Done correctly, accessibility is invisible to able users and life-changing for those who need it.

---

## 1. :focus-visible (mandatory)

Mouse users should never see ugly focus rings. Keyboard users always should. The browser handles the detection — use the right selector.

```css
/* Remove outline only when NOT triggered by keyboard */
*:focus:not(:focus-visible) {
  outline: none;
}

/* The actual focus ring — only for keyboard navigation */
*:focus-visible {
  outline: 2px solid var(--focus, oklch(60% 0.18 250));
  outline-offset: 3px;
  border-radius: 4px;
}

/* For elements with their own focus styling (buttons, inputs) */
.btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
```

The focus ring must:
- Be at least 2 px wide
- Have at least 3:1 contrast against its background AND the focused element
- Not be hidden by other elements (use `outline-offset` if needed)

---

## 2. prefers-reduced-motion (mandatory)

Around 5–10 % of users have vestibular sensitivity or simply prefer less motion. This is also a legal requirement in some jurisdictions (US ADA, EU Accessibility Act 2025).

### Global rule

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### For JavaScript-driven motion

```js
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  // Run cursor effects, parallax, autoplay video, etc.
}
```

### For video

```js
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('video[autoplay]').forEach(v => {
  if (reduceMotion.matches) {
    v.pause();
    v.removeAttribute('autoplay');
  }
});

reduceMotion.addEventListener('change', () => {
  // React to user changing the setting mid-session
});
```

---

## 3. prefers-color-scheme

If the site has a dark mode, respect the OS preference:

```css
:root {
  --bg: #fafafa;
  --text: #0a0a0a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0a0a;
    --text: #fafafa;
  }
}

/* If you provide a manual toggle, the data attribute overrides */
:root[data-theme="light"] { color-scheme: light; --bg: #fafafa; --text: #0a0a0a; }
:root[data-theme="dark"]  { color-scheme: dark;  --bg: #0a0a0a; --text: #fafafa; }
```

Also set `color-scheme` on the root — it tells the browser to use dark scrollbars, form controls, etc.

```css
:root { color-scheme: light dark; }
```

---

## 4. prefers-contrast

For visitors who need higher contrast (often older users, low-vision users):

```css
@media (prefers-contrast: more) {
  :root {
    --text: #000;
    --bg: #fff;
    --border: #000;
  }

  a, button {
    text-decoration: underline;
  }
}
```

---

## 5. Semantic HTML (mandatory)

The single most impactful accessibility decision. Screen readers, browser extensions, search engines, and AI agents all rely on the underlying markup.

```html
<!-- ❌ Wrong -->
<div class="header">
  <div class="logo">…</div>
  <div class="nav">
    <div class="link">About</div>
  </div>
</div>

<!-- ✅ Right -->
<header>
  <a href="/" class="logo" aria-label="Home">…</a>
  <nav aria-label="Primary">
    <ul>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>
```

Required landmarks for every page:
- `<header>` — site header (only one per page at top level)
- `<main>` — primary content (exactly one per page)
- `<nav>` — each navigation block (`aria-label` required if more than one)
- `<footer>` — site footer
- `<article>` — independent content (blog post, project card)
- `<section>` — thematic grouping with a heading

Heading hierarchy: exactly one `<h1>` per page, and never skip levels (h1 → h3 is wrong).

---

## 6. ARIA — minimally, correctly

Rule one: **No ARIA is better than wrong ARIA.** Use native HTML wherever possible. ARIA is for the edge cases.

Common correct uses:

```html
<!-- Icon-only button -->
<button aria-label="Close menu">
  <svg aria-hidden="true">…</svg>
</button>

<!-- Decorative image -->
<img src="…" alt="" /> <!-- empty alt, not omitted -->

<!-- Hidden visually but readable -->
<span class="sr-only">Open in new tab</span>

<!-- Dynamic content region -->
<div aria-live="polite" aria-atomic="true" id="toast"></div>

<!-- Toggle state -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
```

### Screen-reader-only utility

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 7. Skip links

A keyboard user should never have to tab through the entire nav to reach the main content.

```html
<body>
  <a href="#main" class="skip-link">Skip to content</a>
  <header>…</header>
  <main id="main" tabindex="-1">…</main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -100px;
  left: 1rem;
  padding: 0.75rem 1rem;
  background: var(--text);
  color: var(--bg);
  border-radius: 6px;
  z-index: 9999;
  transition: top 0.15s ease;
}

.skip-link:focus-visible {
  top: 1rem;
}
```

---

## 8. Color contrast

WCAG AA minimums:
- 4.5:1 for text under 18 pt (or 14 pt bold)
- 3:1 for text 18 pt+ (or 14 pt bold+)
- 3:1 for interactive elements and their states

For craft, aim higher:
- 7:1 for body copy (WCAG AAA)
- 4.5:1 for large display copy

Tools: Use a contrast checker plugin in the browser. `@axe-core/cli` or Lighthouse will flag failures automatically.

### OKLCH for predictable contrast

```css
:root {
  --accent: oklch(60% 0.18 250);
  --accent-hover: oklch(from var(--accent) calc(l + 0.05) c h);
  --accent-active: oklch(from var(--accent) calc(l - 0.05) c h);
}
```

`oklch()` gives perceptually uniform lightness — adjusting the L channel produces consistent visible contrast changes across hues, unlike HSL or RGB.

---

## 9. Touch targets

Minimum interactive area: 44 × 44 px (iOS / Android guidelines).

```css
.btn, .icon-btn, a.link {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

If the visual element is smaller (small icon button), pad the hit area without changing the visual:

```css
.icon-btn {
  position: relative;
}
.icon-btn::before {
  content: "";
  position: absolute;
  inset: -8px; /* expand hit area without affecting layout */
}
```

---

## 10. Forms accessibility

Every input must have:
- A visible `<label>` linked via `for`/`id` (NOT just a placeholder)
- An accessible name (label or `aria-label`)
- Validation messaging linked via `aria-describedby`
- A logical tab order

```html
<label for="email">
  Email address
  <input
    id="email"
    name="email"
    type="email"
    autocomplete="email"
    required
    aria-describedby="email-help email-error"
  />
  <small id="email-help">We'll never share your email.</small>
  <span id="email-error" class="error" hidden>Please enter a valid email.</span>
</label>
```

`autocomplete` attributes are critical — they let password managers, accessibility tools, and mobile keyboards offer better suggestions. Use the full list at [html.spec.whatwg.org/multipage/form-control-infrastructure.html](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html).

---

## 11. Polish details

These are tiny things that signal a professional touched the site.

### Selection color

```css
::selection {
  background: var(--accent);
  color: white;
}
```

### Scrollbar (subtle, on-brand)

```css
@supports (scrollbar-width: thin) {
  html {
    scrollbar-width: thin;
    scrollbar-color: var(--text-muted) transparent;
  }
}

/* WebKit */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: color-mix(in oklch, var(--text) 30%, transparent);
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: color-mix(in oklch, var(--text) 50%, transparent);
}
```

### Caret color

```css
input, textarea {
  caret-color: var(--accent);
}
```

### Print stylesheet

```css
@media print {
  nav, footer, .no-print { display: none; }
  body { font-size: 11pt; line-height: 1.5; color: black; background: white; }
  a::after { content: " (" attr(href) ")"; font-size: 0.9em; color: #666; }
}
```

A print stylesheet costs 20 lines. A surprising number of clients print key pages. They will notice.

### Favicon set

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#0a0a0a" />
```

### Open Graph + Twitter cards

```html
<meta property="og:title" content="…" />
<meta property="og:description" content="…" />
<meta property="og:image" content="https://example.com/og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://example.com" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="…" />
<meta name="twitter:description" content="…" />
<meta name="twitter:image" content="https://example.com/og.png" />
```

The OG image is the first impression on social media. Make it as polished as the homepage.

### Language attribute

```html
<html lang="en"> <!-- always required -->
<html lang="bg"> <!-- Bulgarian -->
<html lang="de-CH"> <!-- Swiss German -->
```

---

## AVOID

- `outline: none` without a replacement focus style.
- Placeholder text as the only label (disappears on focus, low contrast, lost to autofill).
- `aria-label` on a `<div>` to make it sound like a button — use a real `<button>`.
- Tab traps (modals that do not restore focus when closed).
- Animating into the viewport with `opacity: 0` as the start state without a fallback — keyboard users may tab into invisible content.
- `<a href="javascript:void(0)">` or `<a onclick="…">` — use `<button>` instead.
- Color as the only indicator of state. Always pair with an icon, label, or shape.
- Ignoring `prefers-reduced-motion` while running parallax or autoplay video.

---

## Verification

Before deploy:
1. **Keyboard-only test.** Unplug the mouse. Tab through the entire page. Can you reach every interactive element? Is the focus always visible? Can you submit every form?
2. **Screen reader test.** macOS: VoiceOver (Cmd+F5). Windows: NVDA (free). Read through the page top to bottom. Does it make sense?
3. **OS settings test.** Enable "reduce motion" and reload. All non-essential motion should stop.
4. **Lighthouse Accessibility audit.** Score should be 100. Anything less means something specific is wrong — fix it, do not ignore it.
5. **axe-core scan.** Run `npx @axe-core/cli https://yoursite.com` — zero violations is the target.
6. **Real assistive tech test.** If shipping anything serious, hire or borrow time from someone who uses a screen reader daily. 30 minutes will catch what audits miss.
