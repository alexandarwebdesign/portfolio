# Portfolio Full Audit - Design Spec

**Date:** 2026-04-25  
**Status:** Approved by user  
**Scope:** 8 workstreams - hero shader/mask, SEO, copy, responsive (320px→4K), performance, code cleanup, UX improvements, AIO (AI Search Optimisation)

---

## Context

This is a production portfolio site that also functions as a primary marketing/sales tool. It is deployed on Netlify at `aleksandarpavlov.netlify.app` (custom domain planned for future). The site is a vanilla HTML/CSS/JS stack with a WebGL hero shader, a JSON-driven project CMS, and a glassmorphism design system.

**Positioning (critical for copy and AIO):** Aleksandar is not a web designer who knows UX. He is a UX/UI specialist - with deep expertise in interface psychology, human behaviour, visual hierarchy, and interaction design - who chose websites as his exclusive domain. All of that expertise is channeled entirely into this one niche. The result: websites that most web designers cannot produce, because they lack the UX/UI depth. This is the core differentiator the copy and AIO content must communicate consistently.

**Target audience:** Both business owners (ROI, conversions, growth) and brands (prestige, positioning, identity). Copy must speak to both without diluting either.

---

## Workstream 1 - Hero Shader + Mask Responsive Scaling

### Problem

- Shader resolution has only 3 tiers (≤640: 0.40, ≤980: 0.55, else: 0.70). Anything above 980px - including 1920px, 2560px, and 4K - gets the same 0.70 scale, resulting in a blurry, low-resolution render on large screens.
- CSS mask (`black 75% → transparent 100%` on `100svh`) can eat into hero content on short mobile screens.
- Typography uses hard jumps at 900px and 600px breakpoints instead of fluid scaling.
- Navbar is hardcoded at 880px with no adaptation above 900px or at 4K.

### Solution

**File: `hero-shader.js` - `handleResize()` method**  
Replace the 3-tier `baseScale` with 6 tiers anchored at 1920px = 0.70:

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

**File: `styles.css` - `:root` custom properties**  
Replace the three hard font-size variables with `clamp()` formulas. Delete the hard overrides in the 900px and 600px media queries for these properties.

```css
--text-hero: clamp(40px, calc(2.5vw + 32px), 96px);
--text-section: clamp(36px, calc(2.25vw + 28.8px), 88px);
--text-service: clamp(24px, calc(1vw + 20.8px), 48px);
```

Calibration:
| Variable | 320px | 900px | 1920px | 4K (cap) |
|---|---|---|---|---|
| `--text-hero` | 40px | ~54px | 80px | 96px |
| `--text-section` | 36px | ~49px | 72px | 88px |
| `--text-service` | 24px | ~30px | 40px | 48px |

**File: `styles.css` - `.hero-section` mask**

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

**File: `styles.css` - new 4K structural breakpoint (add at end of responsive section)**

```css
@media (min-width: 1920px) {
  .navbar {
    width: min(1400px, calc(100% - 80px));
  }
  .container {
    max-width: 1600px;
  }
}
```

**Cleanup:** Remove the `--text-hero`, `--text-section`, `--text-service` overrides from the `@media (max-width: 900px)` and `@media (max-width: 600px)` blocks - they are superseded by `clamp()`.

---

## Workstream 2 - SEO

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

**File: `index.html` - `<head>` changes**

1. **Remove** `<link rel="preconnect" href="https://unpkg.com" crossorigin>`
2. **Remove** `<meta name="keywords" content="...">`
3. **Update** title tag:
   ```html
   <title>
     UX/UI Designer & Web Developer Sofia, Bulgaria | Aleksandar Pavlov
   </title>
   ```
4. **Add** OG image dimensions:
   ```html
   <meta property="og:image:width" content="1200" />
   <meta property="og:image:height" content="630" />
   ```
5. **Update** `WebSite` schema - add `description` (currently missing from the live schema):
   ```json
   {
     "@context": "https://schema.org",
     "@type": "WebSite",
     "name": "Aleksandar Pavlov",
     "url": "https://aleksandarpavlov.netlify.app",
     "description": "UX/UI Designer & Web Developer based in Sofia, Bulgaria. Sites engineered around conversion psychology."
   }
   ```
   Note: `potentialAction` / SearchAction is intentionally excluded - it is only correct for sites with a real search function. Adding it to a portfolio would be invalid markup.
6. **Update** `Person` schema - expand `knowsAbout` and add `hasOfferCatalog`:
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
     "name": "Aleksandar Pavlov - UX/UI Design & Web Development",
     "description": "UX/UI design and web development services engineered around conversion psychology. Sites that work on people, not just screens.",
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
   ```

**File: `robots.txt`**

```
User-agent: *
Allow: /
Disallow: /signature-playground.html
Disallow: /soul-v3/

Sitemap: https://aleksandarpavlov.netlify.app/sitemap.xml
```

**File: `sitemap.xml`** - update all `<lastmod>` dates to `2026-04-25`.

---

## Workstream 3 - Copy

### Principles Applied

- Core positioning: UX/UI specialist who went all-in on the website niche - not a generalist, not a web designer with surface UX knowledge. Deep expertise, focused application.
- BAB (Before → After → Bridge) macro structure across the page
- Information-gap theory for hero headline
- Outcome-first language (what the client gets, not what the designer does)
- Problem-opening per service (not feature-leading)
- Hybrid tone: emotional + magnetic above the fold; direct + authoritative in services/about

### Hero Section

**Eyebrow** (h1):

> UX/UI Specialist · Website Design & Development · Sofia, Bulgaria

**Headline** (h2):

> What happens when deep UX expertise meets website design? A site that's as beautiful as it is proven to work.

**Subtitle** (p):

> Most web designers know what looks good. I know why it works - and I've taken everything I know about UX psychology, human behaviour, and interface design and applied it entirely to websites. The result is something different: visually powerful, psychologically precise, and built to convert.

### Services Section

**Service 1 - WEB DESIGN & UX STRATEGY**

> This isn't web design with a UX layer on top. It's UX-first thinking applied to every layout, flow, and visual decision from the start. Most designers pick colours and call it a strategy. I map user psychology, eliminate friction, and engineer the journey - then make it look exceptional.

**Service 2 - WEBSITE DEVELOPMENT**

> Beautiful design means nothing if the build lets it down. Every interaction, animation, and transition is coded exactly as designed - no compromises, no workarounds, no "that looked different in Figma." Pixel-perfect, fast, and built to last.

**Service 3 - END-TO-END SOLUTIONS**

> Strategy, design, development, and deployment - handled by one person who owns the outcome. The UX thinking that shaped the design is the same thinking that shaped the code. No handoffs. No lost-in-translation. No version gaps. One person, one standard, one result.

### About Section

Rewrite to communicate the specialist positioning. Replace all existing bio paragraphs:

**Paragraph 1:**

> I'm Aleksandar - a UX/UI designer and web developer based in Bulgaria, working with clients worldwide.

_(Keep as-is - it's grounding and factual.)_

**Paragraph 2 (rewrite):**

> Most people assume web design is about making things look good. I spent years in UX/UI learning that it's about making things work on people - the psychology behind where the eye goes, how spacing builds or breaks trust, what micro-interactions make a product feel alive versus dead.

**Paragraph 3 (rewrite):**

> At some point I made a decision: take everything I know about UX and UI - the research, the psychology, the craft - and apply it entirely to one thing: websites. Not apps, not general product design, not a bit of everything. Just websites, done at the highest level possible.

**Paragraph 4 (rewrite):**

> The result is work that most web designers can't produce, because they don't have the foundation. I take projects from first concept to live site - design, development, and deployment in one place. No handoffs, no miscommunication, no compromises.

**Paragraph 5 (rewrite):**

> I work best with clients who want a site that does something - not just one that looks good in a screenshot. If that's you, let's talk.

**About CTA:**

- Change class: `button-primary` → `button-secondary`
- Change text: "Work With Me" → "See the Process"
- Change href: `#contact` → `#faq`
- Rationale: Contextually relevant to About content; drives visitors to FAQ where objections are answered before hitting the contact form. Distinct from every other primary CTA.

### Contact Section

No changes to the title or subtitle - both are strong as-is.

---

## Workstream 4 - UX Improvements (Implemented)

### Availability Signal

**Placement:** Contact section left column, between `.contact-email` and the end of `.contact-info`. NOT on the hero CTA.

**HTML** (insert after `.contact-email` div):

```html
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

**CSS** (add to `styles.css`):

```css
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

### Form Placeholders

Fix the literal "Placeholder" text in all form inputs:

- Name input: `placeholder="Your full name"`
- Email input: `placeholder="you@company.com"`
- Message textarea: `placeholder="Tell me about your project - goals, timeline, any existing brand assets..."`

### FAQ Deep-Linking

**HTML changes:** Add semantic `id` to each `.faq-item`:

```
faq-timeline, faq-process, faq-cost, faq-revisions, faq-start, faq-support
```

**JS changes in `main.js`** - extend FAQ accordion logic:

1. On FAQ open: `history.replaceState(null, null, '#' + item.id)` - update URL hash without adding browser history entry.
2. On page load (DOMContentLoaded): read `location.hash`; if it matches a FAQ id, auto-expand that item (trigger the same open logic as a click, skip animation delay).
3. On FAQ close (if currently hashed): `history.replaceState(null, null, location.pathname)` - clean the hash.

No visual change. Zero impact on existing behaviour without a hash.

---

## Workstream 5 - Performance + Code Cleanup

### Dead Code to Remove

| File/Element                                                       | Size     | Reason                                        |
| ------------------------------------------------------------------ | -------- | --------------------------------------------- |
| `hero-particles.js`                                                | 22.5 KB  | Never loaded in any HTML file                 |
| `.hero-particles` + `.hero-particles canvas` CSS                   | ~8 lines | Styles a div that doesn't exist in production |
| `<link rel="preconnect" href="https://unpkg.com">` in `index.html` | 1 line   | CDN not used on homepage                      |
| `<meta name="keywords">` in `index.html`                           | 1 line   | Ignored by Google, potential Bing penalty     |
| `soul-v3/` directory                                               | Unknown  | Documentation only, not a web asset           |

Note: `Rules/` directory is intentionally kept - it contains active design system documentation.

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

| Metric                | Target    | Notes                              |
| --------------------- | --------- | ---------------------------------- |
| Cold start (no cache) | 400–500ms | Fast network, no service worker    |
| Cached load           | 200–250ms | Browser cache, Netlify CDN         |
| No visual changes     | Required  | Performance work must be invisible |

---

---

## Workstream 6 - AIO (AI Search Optimisation)

### Goal

Make the site 110% crawlable and citable by AI assistants (ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews). When someone asks an AI "who is a UX/UI designer specialising in websites in Sofia?" or "find me a conversion-focused web designer," this site surfaces in the answer.

### Why this matters

ChatGPT has 800M weekly active users (2025). AI search tools are now the primary research method for many buyers. Structured, explicit, machine-readable content is the ranking signal - not backlinks.

### Solution

#### File: `robots.txt` - Explicitly allow all major AI crawlers

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

#### New file: `/llms.txt` (root)

Required format per llmstxt.org spec: H1 → blockquote summary → sections with markdown links. Must be served as `text/plain`. On Netlify this is automatic for `.txt` files.

```markdown
# Aleksandar Pavlov

> UX/UI designer and web developer based in Sofia, Bulgaria, working with clients worldwide. Specialist in websites that combine deep UX psychology with high-quality UI craftsmanship - producing sites that are both visually exceptional and conversion-proven. Available for new projects.

## Services

- [Web Design & UX Strategy](https://aleksandarpavlov.netlify.app/#services): UX-first website design grounded in conversion psychology, user behaviour research, and interface design expertise. Wireframes, user flows, and high-fidelity Figma designs.
- [Website Development](https://aleksandarpavlov.netlify.app/#services): Pixel-perfect HTML/CSS/JS implementation. Smooth animations, full responsiveness, and fast load times. Design-to-code with no compromises.
- [End-to-End Solutions](https://aleksandarpavlov.netlify.app/#services): Strategy, design, development, and deployment handled by one person. Custom quote, typical timeline 2–4 weeks.

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

- [About](https://aleksandarpavlov.netlify.app/#about): Background on Aleksandar Pavlov - UX/UI specialist who took deep expertise in interface psychology and applied it exclusively to the website niche. Sofia, Bulgaria. Available worldwide.

## FAQ

- [FAQ](https://aleksandarpavlov.netlify.app/#faq): Project timelines (2–4 weeks typical), process (5 stages: Discovery, Wireframes, Design, Development, Launch), pricing (custom quote, free initial call), revisions (unlimited during design phase), and 30-day post-launch support.

## Contact

- [Contact](https://aleksandarpavlov.netlify.app/#contact): Free consultation call. Email: alexandar.webdesign@gmail.com

## Optional

- [Dribbble](https://dribbble.com/alexandar-webdesign): Visual design work, UI explorations, and design details.
- [LinkedIn](https://www.linkedin.com/in/alexander-pavlov-370261342/): Professional profile and recommendations.
- [X / Twitter](https://x.com/pavvlov_16): Design thoughts and project updates.
```

#### New file: `/llms-full.txt` (root)

This companion file concatenates the full text content of all key pages into one document so an AI can retrieve the entire corpus in a single request. Content to include (in order):

1. Homepage full text (all sections: hero, services, about, FAQ, contact)
2. Each project page's title, description, brief, and outcome metrics
3. The llms.txt content itself

This file is regenerated whenever copy changes. It is plain text / markdown, no HTML.

#### HTML content improvements for AI parsability

AI crawlers parse raw HTML. Ensure every section has:

- A visible, descriptive heading (already present)
- Body text that can stand alone without visual context (check service icons and images have descriptive nearby text, not just `alt=""`)
- Contact information in plain text form (email already present - keep)
- Location and specialty in at least two distinct text places on the page (for entity recognition)

Add a hidden-from-UI but machine-readable `<meta name="description">` update to match the new copy positioning (already in spec under SEO workstream).

#### Schema markup for AIO (already covered in Workstream 2)

The `ProfessionalService` schema is the primary AIO schema. The `FAQPage` schema answers questions directly in AI responses. The `Person` schema establishes entity identity. All three are included in the SEO workstream - no additional schema needed.

#### Content freshness signal

AI tools (especially Perplexity) heavily weight content recency. Update `sitemap.xml` `lastmod` dates to today (already in spec). After major copy changes go live, consider a lightweight update to the sitemap and a re-submission to Google Search Console.

---

## UX Improvements Flagged (Not Implemented - User Decision Required)

These were identified during audit. Each is a genuine conversion or UX opportunity. Do them or not - no code has been written for these.

1. **No social proof above the fold or near CTA** - The testimonials exist in the project data but nothing appears on the homepage near a CTA. A single line ("Trusted by architects, SaaS founders, and brand studios across Europe") or a logo strip could reduce hesitation at the conversion point.

2. **Project cards show no outcome metric** - Cards display title + category only. Adding a single result stat ("↑ 3.2× conversion rate" or "Launched in 18 days") would make the work section function as proof of results, not just a gallery.

3. **No progress indicator between project pages** - The prev/next project navigation has no sense of position (e.g. "2 of 7"). Visitors don't know how much work there is to explore.

4. **About section CTA competes with hero CTA** - Fixed in Workstream 4, but noted here for completeness.

5. **No availability signal on hero (by user request)** - Implemented in contact section. If future marketing push happens, consider adding a muted variant near the hero CTA as well.

---

## File Change Summary

| File                | Type of Change                                                                                                                                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero-shader.js`    | Extend `baseScale` to 6 tiers anchored at 1920px                                                                                                                                                                       |
| `styles.css`        | `clamp()` for 3 font vars; mask mobile fix; 4K breakpoint; availability-signal styles; remove dead `.hero-particles` CSS                                                                                               |
| `index.html`        | Full copy rewrite (hero, services, about); SEO tag changes; 3 schema updates + 1 new `ProfessionalService` schema; availability signal HTML; form placeholders fix; FAQ `id` attributes; About CTA class + text + href |
| `project.html`      | Update Google Fonts URL (remove weight 300)                                                                                                                                                                            |
| `main.js`           | FAQ deep-linking logic (hash read on load + hash write on toggle)                                                                                                                                                      |
| `robots.txt`        | Add 6 AI crawler Allow rules + 2 Disallow rules                                                                                                                                                                        |
| `sitemap.xml`       | Update all `lastmod` dates to 2026-04-25                                                                                                                                                                               |
| `llms.txt`          | **New file** - AI crawlability index per llmstxt.org spec                                                                                                                                                              |
| `llms-full.txt`     | **New file** - Full text corpus for single-request AI retrieval                                                                                                                                                        |
| `hero-particles.js` | **Delete**                                                                                                                                                                                                             |
| `soul-v3/`          | **Delete directory**                                                                                                                                                                                                   |
| `Rules/`            | Keep - active design system documentation                                                                                                                                                                              |
