# Portfolio Full Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all 8 workstreams: hero shader/mask responsive scaling (1920px base), SEO overhaul, copy rewrite (UX/UI specialist positioning), fluid typography 320px→4K, performance + dead-code cleanup, 4 UX improvements, and AIO (llms.txt, AI crawler permissions).

**Architecture:** Static HTML/CSS/JS site on Netlify. No build step - edit source files directly. Verification is browser-based (Chrome DevTools). Commit after each task.

**Tech Stack:** HTML5, CSS3 (custom properties + `clamp()`), vanilla JS (IIFE), WebGL (hero-shader.js), Netlify hosting.

**Spec:** `docs/superpowers/specs/2026-04-25-portfolio-full-audit-design.md`

---

## File Map

| File                | Tasks                            |
| ------------------- | -------------------------------- |
| `hero-shader.js`    | Task 5                           |
| `styles.css`        | Tasks 2, 3, 4                    |
| `index.html`        | Tasks 6, 7, 8, 9, 11, 12, 13, 14 |
| `project.html`      | Task 15                          |
| `main.js`           | Task 10                          |
| `robots.txt`        | Task 16                          |
| `sitemap.xml`       | Task 17                          |
| `llms.txt`          | Task 18 (new)                    |
| `llms-full.txt`     | Task 19 (new)                    |
| `hero-particles.js` | Task 1 (delete)                  |
| `soul-v3/`          | Task 1 (delete)                  |

---

## Task 1: Dead Code Cleanup

**Files:**

- Delete: `hero-particles.js`
- Delete: `soul-v3/` (entire directory)
- Modify: `styles.css` - remove `.hero-particles` block
- Modify: `index.html` - remove `preconnect unpkg.com` and `meta keywords`

- [ ] **Step 1: Delete hero-particles.js**

```bash
rm "D:/Website/hero-particles.js"
```

- [ ] **Step 2: Delete soul-v3 directory**

```bash
rm -rf "D:/Website/soul-v3"
```

- [ ] **Step 3: Remove `.hero-particles` CSS block from `styles.css`**

Find and remove this exact block (lines ~941–956):

```css
/* Hero Particle Effect Background */
.hero-particles {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  pointer-events: auto;
}

.hero-particles canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
```

Replace with nothing (delete the entire block).

- [ ] **Step 4: Remove `preconnect unpkg.com` from `index.html`**

Find and remove this line from `<head>`:

```html
<link rel="preconnect" href="https://unpkg.com" crossorigin />
```

- [ ] **Step 5: Remove `meta keywords` from `index.html`**

Find and remove this line from `<head>`:

```html
<meta
  name="keywords"
  content="UX designer, UI designer, web designer, website developer, Sofia, Bulgaria"
/>
```

- [ ] **Step 6: Verify browser console is clean**

Open `index.html` in browser. Open DevTools → Console. Confirm no errors about missing scripts or broken preconnects.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove dead files, dead CSS, and wasted preconnect"
```

---

## Task 2: CSS - Fluid Typography with `clamp()`

**Files:**

- Modify: `styles.css` - `:root` block and two media query blocks

- [ ] **Step 1: Replace hard font-size values in `:root` with `clamp()` formulas**

In `styles.css`, find (around line 34):

```css
--text-hero: 80px;
--text-section: 72px;
--text-service: 40px;
```

Replace with:

```css
--text-hero: clamp(40px, calc(2.5vw + 32px), 96px);
--text-section: clamp(36px, calc(2.25vw + 28.8px), 88px);
--text-service: clamp(24px, calc(1vw + 20.8px), 48px);
```

Calibration reference:

- `--text-hero`: 320px→40px · 1920px→80px · 4K cap→96px
- `--text-section`: 320px→36px · 1920px→72px · 4K cap→88px
- `--text-service`: 320px→24px · 1920px→40px · 4K cap→48px

- [ ] **Step 2: Remove `--text-hero`, `--text-section`, `--text-service` from the `max-width: 900px` block**

Find this block in the responsive section:

```css
@media (max-width: 900px) {
  :root {
    --text-hero: 56px;
    --text-section: 48px;
    --text-service: 32px;
    --section-gap: 120px;
  }
```

Replace with (keep `--section-gap`, remove the three font vars):

```css
@media (max-width: 900px) {
  :root {
    --section-gap: 120px;
  }
```

- [ ] **Step 3: Remove `--text-hero`, `--text-section`, `--text-service` from the `max-width: 600px` block**

Find this block:

```css
@media (max-width: 600px) {
  :root {
    --text-hero: 40px;
    --text-section: 36px;
    --text-service: 24px;
    --text-body-lg: 20px;
    --text-body: 18px;
```

Replace with (keep `--text-body-lg`, `--text-body`, and everything after):

```css
@media (max-width: 600px) {
  :root {
    --text-body-lg: 20px;
    --text-body: 18px;
```

- [ ] **Step 4: Verify fluid scaling in browser**

Open site in Chrome. Open DevTools → resize the viewport from 320px to 4K (use the responsive mode). Confirm:

- At 320px: hero title is ~40px, no text overflows
- At 900px: hero title is ~54px (smooth, no jump)
- At 1920px: hero title is ~80px
- At 3840px: hero title caps at ~96px (if you have a 4K display or can emulate)

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "feat: replace hard breakpoint font sizes with clamp() for fluid 320px-4K scaling"
```

---

## Task 3: CSS - Hero Mask Fix + 4K Structural Breakpoint

**Files:**

- Modify: `styles.css` - `.hero-section` rule and end of responsive section

- [ ] **Step 1: Fix hero mask on desktop**

Find in `styles.css` (around line 896):

```css
-webkit-mask-image: linear-gradient(to bottom, black 75%, transparent 100%);
mask-image: linear-gradient(to bottom, black 75%, transparent 100%);
```

Replace with:

```css
-webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
```

- [ ] **Step 2: Add mobile mask override**

Find the `.hero-section` rule inside `@media (max-width: 600px)` - it has `padding-top` and `padding-bottom` changes. Add the mask override to that same block.

Find:

```css
.hero-section {
  padding-top: 100px;
  padding-bottom: 80px;
}
```

Replace with:

```css
.hero-section {
  padding-top: 100px;
  padding-bottom: 80px;
  -webkit-mask-image: linear-gradient(to bottom, black 88%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 88%, transparent 100%);
}
```

- [ ] **Step 3: Add 4K structural breakpoint**

Add this block at the very end of the responsive section in `styles.css`, before the `BUTTON INTERACTIVE STATES` comment block:

```css
/* ==========================================================================
   4K / ULTRA-WIDE (≥ 1920px)
   ========================================================================== */

@media (min-width: 1920px) {
  .navbar {
    width: min(1400px, calc(100% - 80px));
  }

  .container {
    max-width: 1600px;
  }
}
```

- [ ] **Step 4: Verify in browser**

Resize viewport to 320px → confirm hero bottom edge fades gently only in the last 12% of section height.
Resize to a wide viewport (1920px+) → confirm navbar and container don't stretch edge-to-edge.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "feat: fix hero mask at mobile, add 4K structural breakpoint"
```

---

## Task 4: CSS - Availability Signal Styles

**Files:**

- Modify: `styles.css` - add `.availability-signal` component styles

- [ ] **Step 1: Add availability signal CSS**

Find the contact section styles area in `styles.css`. Add the following block after the `.contact-email` styles (search for `.contact-email` or add near the end of section 6 components):

```css
/* --------------------------------------------------------------------------
   Availability Signal
   -------------------------------------------------------------------------- */

.availability-signal {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: var(--space-6);
  font-size: 14px;
  font-weight: 500;
  color: #34c759;
  letter-spacing: 0.2px;
}

.availability-icon {
  flex-shrink: 0;
  display: block;
}
```

- [ ] **Step 2: Verify no existing `.availability-signal` style conflicts**

```bash
grep -n "availability" "D:/Website/styles.css"
```

Expected: only the lines you just added.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add availability signal component CSS"
```

---

## Task 5: JS - Hero Shader 6-Tier Resolution Scaling

**Files:**

- Modify: `hero-shader.js` - `handleResize()` method, lines ~320–322

- [ ] **Step 1: Update `baseScale` from 3 tiers to 6 tiers**

In `hero-shader.js`, find `handleResize()` method and locate:

```javascript
const baseScale =
  window.innerWidth <= 640 ? 0.4 : window.innerWidth <= 980 ? 0.55 : 0.7;
```

Replace with:

```javascript
const baseScale =
  window.innerWidth <= 480
    ? 0.3
    : window.innerWidth <= 640
      ? 0.38
      : window.innerWidth <= 980
        ? 0.52
        : window.innerWidth <= 1920
          ? 0.7
          : window.innerWidth <= 2560
            ? 0.85
            : 1.0;
```

- [ ] **Step 2: Verify shader renders at correct resolution**

Open site in Chrome DevTools. Open Console and paste:

```javascript
document.querySelector(".hero-shader__canvas").width;
```

- At 1920px viewport: expected value ≈ `1920 * devicePixelRatio * 0.70` (e.g. on 1x display = ~1344)
- At 1440px viewport: expected value ≈ `1440 * devicePixelRatio * 0.70` (e.g. ~1008)
- At 375px viewport: expected value ≈ `375 * devicePixelRatio * 0.38` (e.g. on 2x = ~285)

Confirm the shader looks crisp (not pixelated) at each size. At mobile, some softness is expected and acceptable due to the 0.30–0.38 scale - it's a deliberate power/performance tradeoff.

- [ ] **Step 3: Commit**

```bash
git add hero-shader.js
git commit -m "feat: extend hero shader to 6-tier resolution scaling anchored at 1920px"
```

---

## Task 6: HTML - Availability Signal in Contact Section

**Files:**

- Modify: `index.html` - contact section left column

- [ ] **Step 1: Add availability signal HTML**

In `index.html`, find the `.contact-email` div in the contact section:

```html
<div class="contact-email">
  <p class="email-label">Prefer Email?</p>
  <a
    href="mailto:alexandar.webdesign@gmail.com"
    class="email-link"
    aria-label="Send email to Aleksandar"
  >
    alexandar.webdesign@gmail.com
  </a>
</div>
```

Replace with:

```html
<div class="contact-email">
  <p class="email-label">Prefer Email?</p>
  <a
    href="mailto:alexandar.webdesign@gmail.com"
    class="email-link"
    aria-label="Send email to Aleksandar"
  >
    alexandar.webdesign@gmail.com
  </a>
</div>

<div class="availability-signal">
  <img
    src="images/projects/Frame 69.svg"
    width="19"
    height="19"
    alt=""
    aria-hidden="true"
    class="availability-icon"
  />
  <span>Currently available for new projects</span>
</div>
```

- [ ] **Step 2: Verify in browser**

Open the contact section. Confirm the green pulsing dot SVG renders next to the "Currently available for new projects" text. Confirm the green colour matches (`#34C759`). Confirm it does NOT appear in the hero section.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add availability signal with animated icon to contact section"
```

---

## Task 7: HTML - Fix Form Placeholders

**Files:**

- Modify: `index.html` - contact form inputs

- [ ] **Step 1: Fix name input placeholder**

Find:

```html
                  placeholder="Placeholder"
                  required
                  aria-required="true"
                />
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="form-input"
                  placeholder="Placeholder"
```

Replace with:

```html
                  placeholder="Your full name"
                  required
                  aria-required="true"
                />
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="form-input"
                  placeholder="you@company.com"
```

- [ ] **Step 2: Fix message textarea placeholder**

Find the textarea element. It currently has no `placeholder` attribute (or has "Placeholder"). Add/update:

```html
placeholder="Tell me about your project - goals, timeline, any existing brand
assets..."
```

The textarea element looks like:

```html
                <textarea
                  id="message"
```

Find the closing `>` of the textarea opening tag and ensure the placeholder attribute is set to:
`placeholder="Tell me about your project - goals, timeline, any existing brand assets..."`

- [ ] **Step 3: Verify in browser**

Open the contact form. Confirm all three input fields (name, email, message) show the new placeholder text when empty. Confirm the select dropdown still shows "Select Service".

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "fix: replace literal 'Placeholder' text in contact form inputs"
```

---

## Task 8: HTML - About Section CTA Change

**Files:**

- Modify: `index.html` - about section CTA button

- [ ] **Step 1: Update About CTA button**

Find in `index.html` the About section CTA (inside `.about-text-column`):

```html
<a href="#contact" class="button-primary">
  <span class="btn-content">
    <span class="btn-text">Work With Me</span>
    <span class="btn-hover-text">Work With Me</span>
  </span>
</a>
```

Replace with:

```html
<a href="#faq" class="button-secondary">
  <span class="btn-content">
    <span class="btn-text">See the Process</span>
    <span class="btn-hover-text">See the Process</span>
  </span>
</a>
```

- [ ] **Step 2: Verify `button-secondary` style exists**

```bash
grep -n "button-secondary" "D:/Website/styles.css" | head -5
```

Expected: multiple matches showing the class is defined.

- [ ] **Step 3: Verify in browser**

Open About section. Confirm the CTA is now styled as secondary (not the solid blue primary button). Confirm clicking it scrolls to the FAQ section. Confirm the hero "Start a Project" and services "Let's work together" CTAs are still primary.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: change About CTA to secondary style pointing to FAQ"
```

---

## Task 9: HTML - FAQ Item IDs for Deep-Linking

**Files:**

- Modify: `index.html` - FAQ section

- [ ] **Step 1: Add `id` attributes to each FAQ item**

Find each `.faq-item` div and add the corresponding `id`:

```html
<!-- Change from: -->
<div class="faq-item glass-panel reveal">
  <button class="faq-question" aria-expanded="false">
    <span>How long does a typical project take?</span>

    <!-- Change to: -->
    <div id="faq-timeline" class="faq-item glass-panel reveal">
      <button class="faq-question" aria-expanded="false">
        <span>How long does a typical project take?</span>
      </button>
    </div>
  </button>
</div>
```

Apply the same pattern to all 6 FAQ items:

| Question                                   | `id` to add     |
| ------------------------------------------ | --------------- |
| How long does a typical project take?      | `faq-timeline`  |
| What does your process actually look like? | `faq-process`   |
| How much does a website cost?              | `faq-cost`      |
| How many revisions do I get?               | `faq-revisions` |
| What do you need from me to get started?   | `faq-start`     |
| Do you provide support after launch?       | `faq-support`   |

- [ ] **Step 2: Verify IDs are present**

```bash
grep -n 'id="faq-' "D:/Website/index.html"
```

Expected: 6 matches, one per FAQ item.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add semantic IDs to FAQ items for deep-linking"
```

---

## Task 10: JS - FAQ Deep-Linking Logic

**Files:**

- Modify: `main.js` - `initFaqAccordion()` function (lines 452–486)

- [ ] **Step 1: Replace `initFaqAccordion` with the deep-link-aware version**

In `main.js`, find the entire `initFaqAccordion` function (lines 452–486):

```javascript
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");

    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Close all other items first
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("is-open")) {
          otherItem.classList.remove("is-open");
          const otherButton = otherItem.querySelector(".faq-question");
          if (otherButton) {
            otherButton.setAttribute("aria-expanded", "false");
          }
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });
}
```

Replace with:

```javascript
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
      // Slight delay so the page has scrolled to the section first
      setTimeout(() => {
        openFaqItem(target);
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }
}
```

- [ ] **Step 2: Verify deep-linking works**

Open browser. Navigate to `index.html#faq-cost`. Confirm:

- The page scrolls to the FAQ section
- The "How much does a website cost?" question is automatically expanded
- The URL bar shows `#faq-cost`

Click on another question. Confirm URL updates to the new `#faq-*` hash.
Click the same question to close. Confirm URL reverts to the base path.

- [ ] **Step 3: Verify original accordion still works**

Navigate to `index.html` (no hash). Click FAQ questions. Confirm single-open behaviour still works correctly.

- [ ] **Step 4: Commit**

```bash
git add main.js
git commit -m "feat: add FAQ deep-linking - URL hash on open, auto-expand on load"
```

---

## Task 11: HTML - SEO Head Changes

**Files:**

- Modify: `index.html` - `<head>` section

- [ ] **Step 1: Update the page title**

Find:

```html
<title>UX/UI Designer & Website Developer | Aleksandar Pavlov</title>
```

Replace with:

```html
<title>
  UX/UI Designer & Web Developer Sofia, Bulgaria | Aleksandar Pavlov
</title>
```

- [ ] **Step 2: Update Open Graph title and Twitter title to match**

Find:

```html
<meta
  property="og:title"
  content="UX/UI Designer & Website Developer | Aleksandar Pavlov"
/>
```

Replace with:

```html
<meta
  property="og:title"
  content="UX/UI Designer & Web Developer Sofia, Bulgaria | Aleksandar Pavlov"
/>
```

Find:

```html
<meta
  name="twitter:title"
  content="UX/UI Designer & Website Developer | Aleksandar Pavlov"
/>
```

Replace with:

```html
<meta
  name="twitter:title"
  content="UX/UI Designer & Web Developer Sofia, Bulgaria | Aleksandar Pavlov"
/>
```

- [ ] **Step 3: Add OG image dimensions**

Find:

```html
<meta
  property="og:image"
  content="https://aleksandarpavlov.netlify.app/og-image.png"
/>
```

Replace with:

```html
<meta
  property="og:image"
  content="https://aleksandarpavlov.netlify.app/og-image.png"
/>
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

- [ ] **Step 4: Update `WebSite` schema - add description**

Find the WebSite schema block:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aleksandar Pavlov",
  "url": "https://aleksandarpavlov.netlify.app",
  "description": "UX/UI Designer & Website Developer based in Sofia, Bulgaria"
}
```

Replace with:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aleksandar Pavlov",
  "url": "https://aleksandarpavlov.netlify.app",
  "description": "UX/UI Designer & Web Developer based in Sofia, Bulgaria. Websites engineered around conversion psychology."
}
```

- [ ] **Step 5: Update `Person` schema - expand `knowsAbout` and add `hasOfferCatalog`**

Find the `Person` schema block. Replace the `knowsAbout` array and add `hasOfferCatalog` before the closing `}`:

Find:

```json
      "knowsAbout": ["UX Design", "UI Design", "Web Development", "Framer", "Web Design"]
```

Replace with:

```json
      "knowsAbout": [
        "UX Design", "UI Design", "Web Development", "Conversion Rate Optimisation",
        "Psychology of Design", "Frontend Development", "Framer", "Figma", "Web Design"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Design & Development Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Design & UX Strategy" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "End-to-End Solutions" } }
        ]
      }
```

- [ ] **Step 6: Add new `ProfessionalService` schema block**

After the closing `</script>` of the `FAQPage` schema, add a new `<script type="application/ld+json">` block:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Aleksandar Pavlov - UX/UI Design & Web Development",
    "description": "UX/UI design and web development services engineered around conversion psychology. Websites that are both visually exceptional and proven to convert.",
    "url": "https://aleksandarpavlov.netlify.app",
    "email": "alexandar.webdesign@gmail.com",
    "provider": { "@type": "Person", "name": "Aleksandar Pavlov" },
    "areaServed": "Worldwide",
    "serviceType": [
      "UX Design",
      "UI Design",
      "Web Development",
      "End-to-End Web Solutions"
    ],
    "priceRange": "Custom Quote"
  }
</script>
```

- [ ] **Step 7: Validate schemas**

Open Google Rich Results Test: https://search.google.com/test/rich-results
Enter the live URL or paste the HTML. Confirm:

- Person schema: valid
- WebSite schema: valid
- FAQPage schema: valid
- ProfessionalService schema: valid (may show as "non-rich-result type" - that is fine, it is still indexed)

- [ ] **Step 8: Commit**

```bash
git add index.html
git commit -m "feat: SEO overhaul - title, OG dimensions, expanded schemas, ProfessionalService"
```

---

## Task 12: HTML - Hero Section Copy Rewrite

**Files:**

- Modify: `index.html` - hero section content

- [ ] **Step 1: Update hero eyebrow**

Find:

```html
<h1 class="hero-eyebrow hero-stage-item">UX / Web Design · Sofia, Bulgaria</h1>
```

Replace with:

```html
<h1 class="hero-eyebrow hero-stage-item">
  UX/UI Specialist · Website Design & Development · Sofia, Bulgaria
</h1>
```

- [ ] **Step 2: Update hero headline**

Find:

```html
<h2 class="hero-title hero-stage-item">
  Your website has 3 seconds to trigger the right feeling.
</h2>
```

Replace with:

```html
<h2 class="hero-title hero-stage-item">
  What happens when deep UX expertise meets website specialisation? A site
  that's as beautiful as it is built to convert.
</h2>
```

- [ ] **Step 3: Update hero subtitle**

Find:

```html
<p class="hero-subtitle hero-stage-item">
  I design and build websites that work on people - not just screens. Every
  layout, every word, every interaction is engineered around how your users
  actually think, feel, and decide.
</p>
```

Replace with:

```html
<p class="hero-subtitle hero-stage-item">
  Most web designers know what looks good. I know why it works - and I've taken
  everything I know about UX psychology, human behaviour, and interface design
  and applied it entirely to websites. The result is something different:
  visually powerful, psychologically precise, and built to convert.
</p>
```

- [ ] **Step 4: Update meta description and OG/Twitter descriptions to match new positioning**

Find:

```html
<meta
  name="description"
  content="I design and build websites that work on people - not just screens. Every layout, every word, every interaction is engineered around how your users actually think, feel, and decide."
/>
```

Replace with:

```html
<meta
  name="description"
  content="UX/UI specialist who channels deep expertise in interface psychology and visual design entirely into websites. Beautiful, conversion-proven, and built to last. Based in Sofia, Bulgaria."
/>
```

Do the same for `og:description` and `twitter:description` - replace both with:

```
UX/UI specialist who channels deep expertise in interface psychology and visual design entirely into websites. Beautiful, conversion-proven, and built to last. Based in Sofia, Bulgaria.
```

- [ ] **Step 5: Verify in browser**

Open the site. Read the hero headline and subtitle. Confirm the specialist/niche positioning is clear. Confirm text does not overflow at 375px mobile width.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: hero copy rewrite - UX/UI specialist positioning"
```

---

## Task 13: HTML - Services Section Copy Rewrite

**Files:**

- Modify: `index.html` - services section

- [ ] **Step 1: Update Service 1 description**

Find:

```html
Every layout decision is backed by UX research and conversion psychology - not
personal taste. You get wireframes, user flows, and high-fidelity designs that
guide visitors exactly where you need them to go.
```

Replace with:

```html
This isn't web design with a UX layer on top. It's UX-first thinking applied to
every layout, flow, and visual decision from the start. Most designers pick
colours and call it a strategy. I map user psychology, eliminate friction, and
engineer the journey - then make it look exceptional.
```

- [ ] **Step 2: Update Service 2 description**

Find:

```html
Clean, semantic HTML/CSS/JS with smooth animations, flawless responsiveness, and
load times that don't punish your SEO. What's designed is what gets built - no
compromises.
```

Replace with:

```html
Beautiful design means nothing if the build lets it down. Every interaction,
animation, and transition is coded exactly as designed - no compromises, no
workarounds, no "that looked different in Figma." Pixel-perfect, fast, and built
to last.
```

- [ ] **Step 3: Update Service 3 description**

Find:

```html
Design, development, and deployment handled entirely by me. Faster timelines,
consistent quality, and a single point of contact who understands the full
picture - from the first wireframe to the live URL.
```

Replace with:

```html
Strategy, design, development, and deployment - handled by one person who owns
the outcome. The UX thinking that shaped the design is the same thinking that
shaped the code. No handoffs. No lost-in-translation. No version gaps. One
person, one standard, one result.
```

- [ ] **Step 4: Verify in browser**

Open Services section. Read all three descriptions. Confirm the problem-first, authority-close structure is clear. Confirm no text overflows on mobile.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: services copy rewrite - problem-first, UX specialist authority"
```

---

## Task 14: HTML - About Section Copy Rewrite

**Files:**

- Modify: `index.html` - about section

- [ ] **Step 1: Replace all `.about-bio` paragraphs**

Find the `.about-text` div containing the existing bio paragraphs:

```html
<div class="about-text">
  <p class="about-bio">
    I'm Aleksandar - a UX/UI designer and web developer based in Bulgaria,
    working with clients worldwide.
  </p>
  <p class="about-bio">
    Most people think web design is about how a site looks. It isn't. It's about
    how it makes people feel - and what it makes them do next. I design with
    that in mind at every step: the hierarchy that tells your eye where to go,
    the spacing that creates trust before a single word is read, the
    micro-interactions that make a product feel alive.
  </p>
  <p class="about-bio">
    I take projects from first concept to live site - design, development, and
    deployment in one place. No handoffs. No miscommunication. No "it looked
    different in Figma." Just one person who owns the entire outcome and cares
    about the result as much as you do.
  </p>
  <p class="about-bio">
    I work best with clients who trust the process and want a website that
    actually moves numbers - not just something that looks good in a screenshot.
  </p>
</div>
```

Replace with:

```html
<div class="about-text">
  <p class="about-bio">
    I'm Aleksandar - a UX/UI designer and web developer based in Bulgaria,
    working with clients worldwide.
  </p>
  <p class="about-bio">
    Most people assume web design is about making things look good. I spent
    years in UX/UI learning that it's about making things work on people - the
    psychology behind where the eye goes, how spacing builds or breaks trust,
    what micro-interactions make a product feel alive versus dead.
  </p>
  <p class="about-bio">
    At some point I made a decision: take everything I know about UX and UI -
    the research, the psychology, the craft - and apply it entirely to one
    thing: websites. Not apps, not general product design, not a bit of
    everything. Just websites, done at the highest level possible.
  </p>
  <p class="about-bio">
    The result is work that most web designers can't produce, because they don't
    have the foundation. I take projects from first concept to live site -
    design, development, and deployment in one place. No handoffs, no
    miscommunication, no compromises.
  </p>
  <p class="about-bio">
    I work best with clients who want a site that does something - not just one
    that looks good in a screenshot. If that's you, let's talk.
  </p>
</div>
```

- [ ] **Step 2: Verify in browser**

Open About section. Read all paragraphs. Confirm the story arc: UX/UI foundation → specialisation decision → what that means for the client → who this is for. Confirm text layout is correct at all viewport sizes.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: about copy rewrite - UX/UI specialist niche positioning story arc"
```

---

## Task 15: Font Weight Reduction

**Files:**

- Modify: `index.html` - Google Fonts URL
- Modify: `project.html` - Google Fonts URL

- [ ] **Step 1: Update font URL in `index.html`**

Find (two occurrences - preload and noscript):

```
family=Manrope:wght@300;400;500;600;700&display=swap
```

Replace both with:

```
family=Manrope:wght@400;500;600;700&display=swap
```

- [ ] **Step 2: Update font URL in `project.html`**

Find the same pattern in `project.html` (line ~17):

```
family=Manrope:wght@300;400;500;600;700&display=swap
```

Replace with:

```
family=Manrope:wght@400;500;600;700&display=swap
```

- [ ] **Step 3: Verify no weight-300 usage broke**

Open the site in browser. Visually scan all text - headings, body, labels, buttons. Confirm nothing looks unexpectedly lighter or thinner. If any element looks wrong, search `styles.css` for `font-weight: 300` or `font-weight: lighter` and either remove it or change it to `400`.

Expected: no visual change, because weight 300 is confirmed unused.

- [ ] **Step 4: Commit**

```bash
git add index.html project.html
git commit -m "perf: drop Manrope weight 300 - saves ~30KB, confirmed unused in CSS"
```

---

## Task 16: `robots.txt` - AI Crawler Rules

**Files:**

- Modify: `robots.txt`

- [ ] **Step 1: Replace `robots.txt` content entirely**

Current content:

```
User-agent: *
Allow: /
Sitemap: https://aleksandarpavlov.netlify.app/sitemap.xml
```

Replace with:

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: *
Allow: /
Disallow: /signature-playground.html
Disallow: /soul-v3/

Sitemap: https://aleksandarpavlov.netlify.app/sitemap.xml
```

- [ ] **Step 2: Verify robots.txt is valid**

Open `https://aleksandarpavlov.netlify.app/robots.txt` (after deploy) or open the file locally. Confirm it is plain text, no HTML wrapper.

- [ ] **Step 3: Commit**

```bash
git add robots.txt
git commit -m "feat: add AI crawler Allow rules and Disallow prototype pages to robots.txt"
```

---

## Task 17: `sitemap.xml` - Update `lastmod` Dates

**Files:**

- Modify: `sitemap.xml`

- [ ] **Step 1: Update all `<lastmod>` dates**

Open `sitemap.xml`. Find every `<lastmod>` element and update its value to `2026-04-25`.

Example - find patterns like:

```xml
    <lastmod>2024-01-01</lastmod>
```

or any other date. Replace all with:

```xml
    <lastmod>2026-04-25</lastmod>
```

- [ ] **Step 2: Verify XML is valid**

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('D:/Website/sitemap.xml'); print('Valid XML')" 2>/dev/null || node -e "require('fs').readFileSync('D:/Website/sitemap.xml','utf8'); console.log('File readable')"
```

- [ ] **Step 3: Commit**

```bash
git add sitemap.xml
git commit -m "chore: update sitemap lastmod dates to 2026-04-25"
```

---

## Task 18: New File - `llms.txt`

**Files:**

- Create: `llms.txt` at site root

- [ ] **Step 1: Create `llms.txt`**

Create `D:/Website/llms.txt` with the following content exactly (UTF-8 encoding):

```markdown
# Aleksandar Pavlov

> UX/UI designer and web developer based in Sofia, Bulgaria, working with clients worldwide. Specialist in websites that combine deep UX psychology with high-quality UI craftsmanship - producing sites that are both visually exceptional and conversion-proven. Available for new projects.

## Services

- [Web Design & UX Strategy](https://aleksandarpavlov.netlify.app/#services): UX-first website design grounded in conversion psychology, user behaviour research, and interface design expertise. Wireframes, user flows, and high-fidelity Figma designs.
- [Website Development](https://aleksandarpavlov.netlify.app/#services): Pixel-perfect HTML/CSS/JS implementation. Smooth animations, full responsiveness, and fast load times. Design-to-code with no compromises.
- [End-to-End Solutions](https://aleksandarpavlov.netlify.app/#services): Strategy, design, development, and deployment handled by one person. Custom quote. Typical timeline 2–4 weeks.

## Portfolio

- [All Work](https://aleksandarpavlov.netlify.app/#work): Featured projects spanning architecture, SaaS, e-commerce, branding, and portfolio websites.
- [FORMA Architects](https://aleksandarpavlov.netlify.app/forma-architects): Luxury architecture website - refined UX, premium visual language, conversion-focused layout.
- [CoreCloud](https://aleksandarpavlov.netlify.app/corecloud): Enterprise SaaS platform - trust-building design, complex information hierarchy, high-conversion UI.
- [Kaito Araki](https://aleksandarpavlov.netlify.app/kaito-araki): Minimalist architect portfolio - whitespace, restraint, typographic precision.
- [MotionCraft](https://aleksandarpavlov.netlify.app/motioncraft): Motion-design-focused web project - dynamic layouts, animation-first UI.
- [Viva Architecture](https://aleksandarpavlov.netlify.app/viva-architecture): Luxury real estate web design - aspirational photography, premium feel.
- [Audio Product](https://aleksandarpavlov.netlify.app/audio-product): Audiophile e-commerce - product-led storytelling, technical credibility.
- [Gravity Zero](https://aleksandarpavlov.netlify.app/gravity-zero): Space-themed branding and web - bold identity, immersive experience.

## About

- [About](https://aleksandarpavlov.netlify.app/#about): Aleksandar Pavlov is a UX/UI specialist who took deep expertise in interface psychology, visual design, and human behaviour and applied it exclusively to the website niche. Based in Sofia, Bulgaria. Available worldwide.

## FAQ

- [FAQ](https://aleksandarpavlov.netlify.app/#faq): Common questions - project timelines (2–4 weeks typical), process (5 stages: Discovery, Wireframes, Design, Development, Launch), pricing (custom quote, free initial call), revisions (unlimited during design phase), and 30-day post-launch support included.

## Contact

- [Contact](https://aleksandarpavlov.netlify.app/#contact): Free consultation. Direct email: alexandar.webdesign@gmail.com

## Optional

- [Dribbble](https://dribbble.com/alexandar-webdesign): Visual design work and UI samples.
- [LinkedIn](https://www.linkedin.com/in/alexander-pavlov-370261342/): Professional profile.
- [X / Twitter](https://x.com/pavvlov_16): Design thoughts and updates.
```

- [ ] **Step 2: Verify file is accessible**

After deploying to Netlify, open `https://aleksandarpavlov.netlify.app/llms.txt` in a browser. Confirm it returns plain text (not HTML). Netlify serves `.txt` files as `text/plain` automatically.

Locally, confirm the file exists:

```bash
ls -la "D:/Website/llms.txt"
```

- [ ] **Step 3: Commit**

```bash
git add llms.txt
git commit -m "feat: add llms.txt for AI crawler discoverability (llmstxt.org spec)"
```

---

## Task 19: New File - `llms-full.txt`

**Files:**

- Create: `llms-full.txt` at site root

- [ ] **Step 1: Create `llms-full.txt`**

This file is the complete plain-text corpus of the site - all key content concatenated. Create `D:/Website/llms-full.txt`:

```markdown
# Aleksandar Pavlov - Full Site Content

> Complete text content of aleksandarpavlov.netlify.app for AI retrieval. Last updated: 2026-04-25.

---

## Homepage - Hero

**Eyebrow:** UX/UI Specialist · Website Design & Development · Sofia, Bulgaria

**Headline:** What happens when deep UX expertise meets website specialisation? A site that's as beautiful as it is built to convert.

**Subtitle:** Most web designers know what looks good. I know why it works - and I've taken everything I know about UX psychology, human behaviour, and interface design and applied it entirely to websites. The result is something different: visually powerful, psychologically precise, and built to convert.

---

## Homepage - Services

### Web Design & UX Strategy

This isn't web design with a UX layer on top. It's UX-first thinking applied to every layout, flow, and visual decision from the start. Most designers pick colours and call it a strategy. I map user psychology, eliminate friction, and engineer the journey - then make it look exceptional.

### Website Development

Beautiful design means nothing if the build lets it down. Every interaction, animation, and transition is coded exactly as designed - no compromises, no workarounds, no "that looked different in Figma." Pixel-perfect, fast, and built to last.

### End-to-End Solutions

Strategy, design, development, and deployment - handled by one person who owns the outcome. The UX thinking that shaped the design is the same thinking that shaped the code. No handoffs. No lost-in-translation. No version gaps. One person, one standard, one result.

---

## Homepage - About

I'm Aleksandar - a UX/UI designer and web developer based in Bulgaria, working with clients worldwide.

Most people assume web design is about making things look good. I spent years in UX/UI learning that it's about making things work on people - the psychology behind where the eye goes, how spacing builds or breaks trust, what micro-interactions make a product feel alive versus dead.

At some point I made a decision: take everything I know about UX and UI - the research, the psychology, the craft - and apply it entirely to one thing: websites. Not apps, not general product design, not a bit of everything. Just websites, done at the highest level possible.

The result is work that most web designers can't produce, because they don't have the foundation. I take projects from first concept to live site - design, development, and deployment in one place. No handoffs, no miscommunication, no compromises.

I work best with clients who want a site that does something - not just one that looks good in a screenshot. If that's you, let's talk.

---

## Homepage - FAQ

**Q: How long does a typical project take?**
A: Most projects go live in 2–4 weeks. A focused landing page takes 1–2 weeks; a full multi-page website takes 3–4. I'll give you a precise timeline after understanding your scope - no vague estimates.

**Q: What does your process actually look like?**
A: Five stages: Discovery (your goals, your users, your constraints), Wireframes (structure and flow), Design (high-fidelity visuals in Figma), Development (built in code, pixel-perfect), and Launch (live, with support). You're involved at every feedback stage - nothing ships that you haven't approved.

**Q: How much does a website cost?**
A: Pricing depends on scope, not a fixed menu. I give you a detailed quote after understanding what you actually need - no surprise charges mid-project. Book a free call and we'll figure it out in 20 minutes.

**Q: How many revisions do I get?**
A: Unlimited during the design phase. I'd rather spend extra rounds getting it right than ship something you're only half-happy with. In practice, most projects land in 2–3 rounds because the discovery phase does its job.

**Q: What do you need from me to get started?**
A: Your goals, any existing brand assets (logo, colours), your content, and 3–5 websites you like. That's enough to start. I'll guide you through everything else - including what to do if you don't have all of it yet.

**Q: Do you provide support after launch?**
A: 30 days of free post-launch support is included in every project. After that, I offer maintenance packages or one-off updates - whatever fits your situation.

---

## Homepage - Contact

**Heading:** Have a project that deserves to be done right?

**Subtitle:** Tell me what you're building. I'll tell you exactly how I'd approach it.

**Email:** alexandar.webdesign@gmail.com

**Availability:** Currently available for new projects.

---

## Portfolio Projects

### FORMA Architects (2026)

Category: Architecture / Web Design
Tags: Architecture, Luxury, Minimal, Quiet Design
Description: Luxury architecture website with refined UX, premium visual language, and conversion-focused layout. Designed around the persona of a client who values precision and restraint.

### Kaito Araki (2025)

Category: Portfolio
Tags: Architecture, Portfolio, Minimalist, Whitespace
Description: Minimalist architect portfolio - typographic precision, generous whitespace, and a visual hierarchy that lets the work breathe.

### MotionCraft (2025)

Category: Web Design
Tags: Motion, Animation, Dynamic, Bold
Description: Motion-design-focused web project - dynamic layouts, animation-first UI, designed for a creative audience.

### CoreCloud (2024)

Category: SaaS / Web Design
Tags: SaaS, Enterprise, Trust, Conversion
Description: Enterprise SaaS platform - trust-building design, complex information hierarchy, high-conversion UI for business buyers.

### Viva Architecture (2024)

Category: Web Design / Architecture
Tags: Luxury, Real Estate, Architecture, Premium
Description: Luxury real estate web design - aspirational photography, premium feel, conversion-optimised layout.

### Audio Product (2024)

Category: E-commerce
Tags: Audiophile, E-commerce, Product Design, Technical
Description: Audiophile e-commerce - product-led storytelling, technical credibility, conversion-focused product pages.

### Gravity Zero (2023)

Category: Branding & Web
Tags: Space, Futuristic, Branding, Immersive
Description: Space-themed branding and web - bold identity system, immersive experience design.

---

## About Aleksandar Pavlov

**Name:** Aleksandar Pavlov
**Profession:** UX/UI Designer & Web Developer
**Location:** Sofia, Bulgaria
**Available:** Worldwide, currently accepting new projects
**Email:** alexandar.webdesign@gmail.com
**Specialisation:** Websites designed from a deep UX/UI foundation - not surface-level web design.

**Social profiles:**

- Dribbble: https://dribbble.com/alexandar-webdesign
- LinkedIn: https://www.linkedin.com/in/alexander-pavlov-370261342/
- X/Twitter: https://x.com/pavvlov_16
```

- [ ] **Step 2: Verify file exists**

```bash
ls -la "D:/Website/llms-full.txt"
```

- [ ] **Step 3: Commit**

```bash
git add llms-full.txt
git commit -m "feat: add llms-full.txt - full text corpus for single-request AI retrieval"
```

---

## Task 20: Final Verification Pass

**No file changes - this task is verification only.**

- [ ] **Step 1: Check responsive behaviour at key breakpoints**

Open Chrome DevTools → Responsive mode. Test at:

- 320px: hero title readable, no overflow, mask fade is gentle
- 375px (iPhone): same
- 768px (tablet): navbar switches to mobile toggle, hero looks good
- 1024px: desktop layout, nav links visible
- 1440px: comfortable scaling, navbar fits
- 1920px: hero title ~80px, navbar max-width correct
- 3840px (if possible): hero title caps at ~96px, container max-width applied

- [ ] **Step 2: Hero shader quality check**

At each breakpoint from Step 1, confirm the WebGL shader renders without pixelation (at 1920px+) and without crashing (at 320px mobile).

Open DevTools Console. Confirm no WebGL errors.

- [ ] **Step 3: SEO tag check**

Open Chrome DevTools → Elements → `<head>`. Confirm:

- Title: "UX/UI Designer & Web Developer Sofia, Bulgaria | Aleksandar Pavlov"
- Description: new positioning copy
- og:title, og:image:width, og:image:height present
- Canonical: correct URL
- No `preconnect unpkg.com`
- No `meta keywords`

- [ ] **Step 4: Schema validation**

Visit: https://validator.schema.org/
Paste the URL or page source. Confirm 4 schemas validate: Person, WebSite, FAQPage, ProfessionalService.

- [ ] **Step 5: AIO check**

Open `https://aleksandarpavlov.netlify.app/llms.txt` in browser.
Open `https://aleksandarpavlov.netlify.app/llms-full.txt` in browser.
Both should return plain text, not HTML.

Open `https://aleksandarpavlov.netlify.app/robots.txt`.
Confirm GPTBot, ClaudeBot, anthropic-ai, Google-Extended, PerplexityBot are listed with `Allow: /`.

- [ ] **Step 6: FAQ deep-linking**

Navigate to `https://aleksandarpavlov.netlify.app/#faq-cost`. Confirm the "How much does a website cost?" question auto-expands.

Navigate to `https://aleksandarpavlov.netlify.app/#faq-process`. Confirm the "What does your process actually look like?" question auto-expands.

- [ ] **Step 7: Availability signal**

Open the Contact section. Confirm the green pulsing dot + "Currently available for new projects" text appears below the email address.

- [ ] **Step 8: Performance check**

Open Chrome DevTools → Network tab. Hard reload (Ctrl+Shift+R). Note total load time.
Then do a cached reload (Ctrl+R). Note cached load time.

For a realistic cold-start estimate, use Lighthouse (DevTools → Lighthouse → Mobile):

- Performance score should be ≥ 80
- LCP (Largest Contentful Paint) should be under 2.5s on fast 3G

- [ ] **Step 9: Final commit**

```bash
git add -A
git status
# Confirm no unexpected files staged
git commit -m "chore: final verification pass - portfolio full audit complete"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement                             | Task                     |
| -------------------------------------------- | ------------------------ |
| Hero shader 6-tier scaling (1920px base)     | Task 5                   |
| CSS mask mobile fix (88% on ≤600px)          | Task 3                   |
| Fluid typography clamp()                     | Task 2                   |
| 4K structural breakpoint (min-width: 1920px) | Task 3                   |
| Remove preconnect unpkg.com                  | Task 1                   |
| Remove meta keywords                         | Task 1                   |
| Title tag geographic qualifier               | Task 11                  |
| OG image dimensions                          | Task 11                  |
| WebSite schema description update            | Task 11                  |
| Person schema knowsAbout + hasOfferCatalog   | Task 11                  |
| ProfessionalService schema (new)             | Task 11                  |
| robots.txt Disallow prototype pages          | Task 16                  |
| sitemap.xml lastmod update                   | Task 17                  |
| Hero copy rewrite                            | Task 12                  |
| Services copy rewrite                        | Task 13                  |
| About copy rewrite                           | Task 14                  |
| Meta description update                      | Task 12                  |
| Availability signal CSS + HTML               | Tasks 4 + 6              |
| Form placeholders fix                        | Task 7                   |
| About CTA button change                      | Task 8                   |
| FAQ id attributes                            | Task 9                   |
| FAQ deep-linking JS                          | Task 10                  |
| robots.txt AI crawler Allow rules            | Task 16                  |
| llms.txt                                     | Task 18                  |
| llms-full.txt                                | Task 19                  |
| Font weight 300 removal                      | Task 15                  |
| Delete hero-particles.js                     | Task 1                   |
| Delete soul-v3/                              | Task 1                   |
| Remove .hero-particles CSS                   | Task 1                   |
| Keep Rules/                                  | ✓ Not in any delete task |

All 30 spec requirements are covered. No gaps found.
