# Portfolio Full Audit — Design Spec
**Date:** 2026-04-25  
**Status:** Approved by user  
**Scope:** 7 workstreams — hero shader/mask, SEO, copy, responsive (320px→4K), performance, code cleanup, UX improvements

---

## Context

This is a production portfolio site that also functions as a primary marketing/sales tool. It is deployed on Netlify at `aleksandarpavlov.netlify.app` (custom domain planned for future). The site is a vanilla HTML/CSS/JS stack with a WebGL hero shader, a JSON-driven project CMS, and a glassmorphism design system. The user sells UX/UI design and web development services to both business owners (ROI-focused) and brands (prestige/identity-focused).

---

## Workstream 1 — Hero Shader + Mask Responsive Scaling

### Problem
- Shader resolution has only 3 tiers (≤640: 0.40, ≤980: 0.55, else: 0.70). Anything above 980px — including 1920px, 2560px, and 4K — gets the same 0.70 scale, resulting in a blurry, low-resolution render on large screens.
- CSS mask (`black 75% → transparent 100%` on `100svh`) can eat into hero content on short mobile screens.
- Typography uses hard jumps at 900px and 600px breakpoints instead of fluid scaling.
- Navbar is hardcoded at 880px with no adaptation above 900px or at 4K.

### Solution

**File: `hero-shader.js` — `handleResize()` method**  
Replace the 3-tier `baseScale` with 6 tiers anchored at 1920px = 0.70:

```javascript
const baseScale = window.innerWidth <= 480  ? 0.30
                : window.innerWidth <= 640  ? 0.38
                : window.innerWidth <= 980  ? 0.52
                : window.innerWidth <= 1920 ? 0.70
                : window.innerWidth <= 2560 ? 0.85
                : 1.00;
```

**File: `styles.css` — `:root` custom properties**  
Replace the three hard font-size variables with `clamp()` formulas. Delete the hard overrides in the 900px and 600px media queries for these properties.

```css
--text-hero:    clamp(40px, calc(2.5vw + 32px), 96px);
--text-section: clamp(36px, calc(2.25vw + 28.8px), 88px);
--text-service: clamp(24px, calc(1vw + 20.8px), 48px);
```

Calibration:
| Variable | 320px | 900px | 1920px | 4K (cap) |
|---|---|---|---|---|
| `--text-hero` | 40px | ~54px | 80px | 96px |
| `--text-section` | 36px | ~49px | 72px | 88px |
| `--text-service` | 24px | ~30px | 40px | 48px |

**File: `styles.css` — `.hero-section` mask**  
```css
.hero-section {
  /* existing: mask-image: linear-gradient(to bottom, black 75%, transparent 100%); */
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
}

@media (max-width: 600px) {
  .hero-section {
    -webkit-mask-image: linear-gradient(to bottom, black 88%, transparent 100%);
    mask-image: linear-gradient(to bottom, black 88%, transparent 100%);
  }
}
```

**File: `styles.css` — new 4K structural breakpoint (add at end of responsive section)**  
```css
@media (min-width: 1920px) {
  .navbar    { width: min(1400px, calc(100% - 80px)); }
  .container { max-width: 1600px; }
}
```

**Cleanup:** Remove the `--text-hero`, `--text-section`, `--text-service` overrides from the `@media (max-width: 900px)` and `@media (max-width: 600px)` blocks — they are superseded by `clamp()`.

---

## Workstream 2 — SEO

### Problem
- Wasted `preconnect` to `unpkg.com` on `index.html` (Three.js/GSAP only load on `project.html`).
- No `og:image:width` / `og:image:height` meta tags.
- Title tag lacks geographic qualifier, limiting local SEO signal.
- Missing `ProfessionalService` structured data (critical for service businesses).
- `WebSite` schema has no `potentialAction` (SearchAction).
- `Person` schema has thin `knowsAbout` and no `hasOfferCatalog`.
- `<meta name="keywords">` is present but irrelevant (Google ignores it).
- `robots.txt` does not block prototype/internal pages.
- `sitemap.xml` `lastmod` dates are stale.

### Solution

**File: `index.html` — `<head>` changes**

1. **Remove** `<link rel="preconnect" href="https://unpkg.com" crossorigin>`
2. **Remove** `<meta name="keywords" content="...">`
3. **Update** title tag:
   ```html
   <title>UX/UI Designer & Web Developer Sofia, Bulgaria | Aleksandar Pavlov</title>
   ```
4. **Add** OG image dimensions:
   ```html
   <meta property="og:image:width" content="1200">
   <meta property="og:image:height" content="630">
   ```
5. **Update** `WebSite` schema — add `description` (currently missing from the live schema):
   ```json
   {
     "@context": "https://schema.org",
     "@type": "WebSite",
     "name": "Aleksandar Pavlov",
     "url": "https://aleksandarpavlov.netlify.app",
     "description": "UX/UI Designer & Web Developer based in Sofia, Bulgaria. Sites engineered around conversion psychology."
   }
   ```
   Note: `potentialAction` / SearchAction is intentionally excluded — it is only correct for sites with a real search function. Adding it to a portfolio would be invalid markup.
6. **Update** `Person` schema — expand `knowsAbout` and add `hasOfferCatalog`:
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
7. **Add new** `ProfessionalService` schema block:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "ProfessionalService",
     "name": "Aleksandar Pavlov — UX/UI Design & Web Development",
     "description": "UX/UI design and web development services engineered around conversion psychology. Sites that work on people, not just screens.",
     "url": "https://aleksandarpavlov.netlify.app",
     "email": "alexandar.webdesign@gmail.com",
     "provider": { "@type": "Person", "name": "Aleksandar Pavlov" },
     "areaServed": "Worldwide",
     "serviceType": ["UX Design", "UI Design", "Web Development", "End-to-End Web Solutions"],
     "priceRange": "Custom Quote"
   }
   ```

**File: `robots.txt`**
```
User-agent: *
Allow: /
Disallow: /signature-playground.html
Disallow: /soul-v3/

Sitemap: https://aleksandarpavlov.netlify.app/sitemap.xml
```

**File: `sitemap.xml`** — update all `<lastmod>` dates to `2026-04-25`.

---

## Workstream 3 — Copy

### Principles Applied
- BAB (Before → After → Bridge) macro structure across the page
- Information-gap theory for hero headline
- Outcome-first language (what the client gets, not what the designer does)
- Problem-opening per service (not feature-leading)
- Hybrid tone: emotional + magnetic above the fold; direct + authoritative in services/about

### Hero Section

**Eyebrow** (h1):
> UX Strategy & Web Design · Sofia, Bulgaria

**Headline** (h2):
> Your website has 3 seconds to make someone feel something. Make sure it's the right feeling.

**Subtitle** (p):
> When every layout, interaction, and word is engineered around how people actually think and decide — your website stops being a cost and starts being your most powerful sales tool.

### Services Section

**Service 1 — WEB DESIGN & UX STRATEGY**
> Most sites are designed around what the client likes. These are designed around what the user does. Every layout, flow, and visual decision is rooted in conversion psychology — guiding attention, building trust, and moving people toward action.

**Service 2 — WEBSITE DEVELOPMENT**
> The best design means nothing if the build lets it down. Pixel-perfect implementation, fluid animations, and load times that won't punish your users or your search ranking. What's designed is what gets built. No compromises.

**Service 3 — END-TO-END SOLUTIONS**
> Strategy, design, development, and deployment — handled by one person who owns the outcome. No handoffs. No lost-in-translation. No "that's not what I designed." Just results.

### About Section

Keep all existing paragraphs. Update last paragraph only:

**Old:**
> I work best with clients who trust the process and want a website that actually moves numbers - not just something that looks good in a screenshot.

**New:**
> I work best with clients who understand that a great website is the highest-ROI investment their business can make — and want a partner who thinks that way too.

**About CTA:**
- Change class: `button-primary` → `button-secondary`
- Change text: "Work With Me" → "See the Process"
- Change href: `#contact` → `#faq`
- Rationale: Drives visitors to the FAQ where objections are answered before hitting the contact form. Distinct from every other primary CTA on the page.

### Contact Section
No changes to the title — "Have a project that deserves to be done right?" is strong. No changes to subtitle.

---

## Workstream 4 — UX Improvements (Implemented)

### Availability Signal
**Placement:** Contact section left column, between `.contact-email` and the end of `.contact-info`. NOT on the hero CTA.

**HTML** (insert after `.contact-email` div):
```html
<div class="availability-signal">
  <img src="images/projects/Frame 69.svg" width="19" height="19" alt="" aria-hidden="true" class="availability-icon">
  <span>Currently available for new projects</span>
</div>
```

**CSS** (add to `styles.css`):
```css
.availability-signal {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: var(--space-6);
  font-size: 14px;
  font-weight: 500;
  color: #34C759;
  letter-spacing: 0.2px;
}

.availability-icon {
  flex-shrink: 0;
  display: block;
}
```

### Form Placeholders
Fix the literal "Placeholder" text in all form inputs:
- Name input: `placeholder="Your full name"`
- Email input: `placeholder="you@company.com"`
- Message textarea: `placeholder="Tell me about your project — goals, timeline, any existing brand assets..."`

### FAQ Deep-Linking
**HTML changes:** Add semantic `id` to each `.faq-item`:
```
faq-timeline, faq-process, faq-cost, faq-revisions, faq-start, faq-support
```

**JS changes in `main.js`** — extend FAQ accordion logic:
1. On FAQ open: `history.replaceState(null, null, '#' + item.id)` — update URL hash without adding browser history entry.
2. On page load (DOMContentLoaded): read `location.hash`; if it matches a FAQ id, auto-expand that item (trigger the same open logic as a click, skip animation delay).
3. On FAQ close (if currently hashed): `history.replaceState(null, null, location.pathname)` — clean the hash.

No visual change. Zero impact on existing behaviour without a hash.

---

## Workstream 5 — Performance + Code Cleanup

### Dead Code to Remove
| File/Element | Size | Reason |
|---|---|---|
| `hero-particles.js` | 22.5 KB | Never loaded in any HTML file |
| `.hero-particles` + `.hero-particles canvas` CSS | ~8 lines | Styles a div that doesn't exist in production |
| `<link rel="preconnect" href="https://unpkg.com">` in `index.html` | 1 line | CDN not used on homepage |
| `<meta name="keywords">` in `index.html` | 1 line | Ignored by Google, potential Bing penalty |
| `soul-v3/` directory | Unknown | Documentation only, not a web asset |
| `Rules/` directory | Unknown | Design documentation, not a web asset |

### Font Weight Reduction
Currently loading weights: 300, 400, 500, 600, 700.  
Weight 300 has been confirmed absent from all `font-weight` declarations in `styles.css`.  
**Update Google Fonts URL** from `wght@300;400;500;600;700` → `wght@400;500;600;700`.  
Also update the same URL in `project.html` (it loads fonts independently).  
Estimated saving: ~25–35 KB of font data per cold visit.

### Verification Pass
Before marking performance complete, verify:
- `body.is-loaded` class is set at the correct time (after DOMContentLoaded, not blocking on shader compile)
- All `defer` script ordering is correct: `main.js` → `hero-shader.js` → `projects.js`
- No render-blocking resources remain in `<head>` other than `styles.css` (expected)

### Target Metrics
| Metric | Target | Notes |
|---|---|---|
| Cold start (no cache) | 400–500ms | Fast network, no service worker |
| Cached load | 200–250ms | Browser cache, Netlify CDN |
| No visual changes | Required | Performance work must be invisible |

---

## UX Improvements Flagged (Not Implemented — User Decision Required)

These were identified during audit. Each is a genuine conversion or UX opportunity. Do them or not — no code has been written for these.

1. **No social proof above the fold or near CTA** — The testimonials exist in the project data but nothing appears on the homepage near a CTA. A single line ("Trusted by architects, SaaS founders, and brand studios across Europe") or a logo strip could reduce hesitation at the conversion point.

2. **Project cards show no outcome metric** — Cards display title + category only. Adding a single result stat ("↑ 3.2× conversion rate" or "Launched in 18 days") would make the work section function as proof of results, not just a gallery.

3. **No progress indicator between project pages** — The prev/next project navigation has no sense of position (e.g. "2 of 7"). Visitors don't know how much work there is to explore.

4. **About section CTA competes with hero CTA** — Fixed in Workstream 4, but noted here for completeness.

5. **No availability signal on hero (by user request)** — Implemented in contact section. If future marketing push happens, consider adding a muted variant near the hero CTA as well.

---

## File Change Summary

| File | Type of Change |
|---|---|
| `hero-shader.js` | Extend `baseScale` to 6 tiers |
| `styles.css` | `clamp()` for 3 font vars; mask mobile fix; 4K breakpoint; availability-signal styles; remove dead `.hero-particles` CSS |
| `index.html` | Copy rewrites; SEO tag changes; 3 schema updates; 1 new schema block; availability signal HTML; form placeholders; FAQ ids; About CTA change |
| `main.js` | FAQ deep-linking logic (hash read on load + hash write on toggle) |
| `robots.txt` | Add 2 Disallow rules |
| `sitemap.xml` | Update lastmod dates |
| `hero-particles.js` | **Delete** |
| `soul-v3/` | **Delete directory** |
| `Rules/` | **Delete directory** |
