# 07 — Pre-deploy Checklist

The final pass. Every item on this list must be verified before the site goes live.

---

## How to use this

Work top to bottom. Do not deploy until every box can be checked truthfully. If a box cannot be checked, fix it or document why it is an acceptable exception (rare).

This list assumes the techniques from `01`–`06` have already been applied.

---

## 1. Images and media

- [ ] Every `<img>` has explicit `width` and `height` attributes
- [ ] Every image slot reserves space (aspect-ratio or fixed dimensions)
- [ ] Hero image is preloaded in `<head>` and has `fetchpriority="high"`
- [ ] Below-the-fold images have `loading="lazy"` and `decoding="async"`
- [ ] Images are served as AVIF or WebP, not raw JPG/PNG
- [ ] Retina (`2x`) and high-DPI (`3x`) variants exist for all content images
- [ ] Background images use `image-set()` with DPR variants
- [ ] No GIFs anywhere — looping videos instead
- [ ] All videos: `muted`, `playsinline`, `loop`, `preload="metadata"`, poster image
- [ ] Largest single image is under 200 KB at 2x

---

## 2. Typography

- [ ] All font sizes use `clamp()` — zero hard-coded sizes per breakpoint
- [ ] Fonts are self-hosted as `woff2`, not loaded from a third-party CDN
- [ ] Each font is preloaded in `<head>` with `as="font" crossorigin`
- [ ] `@font-face` includes `size-adjust` / `ascent-override` for fallback matching
- [ ] Font file size: variable font under 100 KB after subsetting
- [ ] `font-display: swap` set on every `@font-face`
- [ ] `text-wrap: balance` applied to headings
- [ ] `text-wrap: pretty` applied to body copy
- [ ] Body copy at least 7:1 contrast against background
- [ ] One typeface (occasionally two) — not three or more

---

## 3. Performance

- [ ] Lighthouse Performance score ≥ 95 on mobile
- [ ] LCP ≤ 1.5 s (Slow 4G throttled)
- [ ] CLS ≤ 0.05
- [ ] INP ≤ 100 ms
- [ ] FCP ≤ 1.0 s
- [ ] Total page weight ≤ 500 KB (target) / ≤ 1 MB (hard limit)
- [ ] Critical CSS inlined in `<head>` (under 14 KB)
- [ ] All scripts are `defer`, `async`, or `type="module"`
- [ ] `content-visibility: auto` on long sections below the fold
- [ ] Predictive prefetching on hover for internal links
- [ ] Speculation Rules or `<link rel="prefetch">` for likely-next pages
- [ ] Service worker registered for shell caching (if appropriate)
- [ ] Brotli compression enabled at the server / CDN
- [ ] Long-cache headers on hashed assets
- [ ] No render-blocking third-party scripts

---

## 4. Interactions

- [ ] Hover transitions on `transform`, `opacity`, `background`, `box-shadow` only
- [ ] No `transition: all` anywhere
- [ ] Buttons have hover, active, and focus-visible states
- [ ] All animations use cubic-bezier easings, not `ease` or `linear`
- [ ] Page-load animations: max one stagger per element, max 600 ms total
- [ ] Scroll-driven animations via CSS `animation-timeline` (where supported)
- [ ] View transitions enabled for same-origin navigation
- [ ] Optimistic UI on every action that doesn't need server data
- [ ] No scroll-jacking
- [ ] No animations on touch devices that lock the screen

---

## 5. Accessibility

- [ ] Lighthouse Accessibility score = 100
- [ ] Zero axe-core violations (`npx @axe-core/cli`)
- [ ] Keyboard-only navigation works end to end (tabbed through entire page)
- [ ] Every interactive element has visible `:focus-visible` ring
- [ ] Skip-to-content link present and functional
- [ ] `prefers-reduced-motion` respected globally
- [ ] `prefers-color-scheme` respected if dark mode exists
- [ ] All images have meaningful `alt` text (or `alt=""` if decorative)
- [ ] All form inputs have visible labels (not placeholder-only)
- [ ] All form inputs have correct `autocomplete` attributes
- [ ] Headings follow logical hierarchy (one h1, no skipped levels)
- [ ] Landmark elements used (`header`, `nav`, `main`, `footer`, `article`, `section`)
- [ ] `<html lang="…">` set correctly
- [ ] Color contrast meets AA minimum (AAA preferred for body)
- [ ] Touch targets ≥ 44 × 44 px

---

## 6. Signature moment

- [ ] Exactly ONE signature interaction exists on the site
- [ ] Disabled on touch devices
- [ ] Disabled when `prefers-reduced-motion: reduce`
- [ ] Runs at 60 fps with DevTools Performance recording
- [ ] Does not block interaction (`pointer-events: none` where appropriate)
- [ ] Tone matches the site

---

## 7. Polish details

- [ ] Custom `::selection` color
- [ ] Custom (subtle) scrollbar matching the design
- [ ] Custom `caret-color` on inputs
- [ ] Print stylesheet exists and produces a clean printed page
- [ ] Favicon: SVG, ICO, Apple touch icon, theme color
- [ ] Open Graph meta tags with 1200 × 630 image
- [ ] Twitter card meta tags
- [ ] Site manifest (`site.webmanifest`) for installable PWA-lite
- [ ] 404 page exists and is on-brand
- [ ] `robots.txt` and `sitemap.xml` present and valid

---

## 8. Browser and device testing

Real testing on real devices, not just simulators.

- [ ] Chrome (desktop, latest)
- [ ] Safari (macOS, latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (iOS, latest, on real iPhone)
- [ ] Chrome (Android, latest, on real device)
- [ ] Tablet (iPad portrait + landscape)
- [ ] Small phone (375 × 667 — iPhone SE size)
- [ ] Large desktop (1920 × 1080 minimum, 2560+ preferred)
- [ ] Retina display (no soft images)
- [ ] System dark mode + light mode
- [ ] System "reduce motion" enabled
- [ ] System "increase contrast" enabled

---

## 9. Network conditions

- [ ] Loads cleanly on "Slow 4G" throttle (DevTools)
- [ ] Loads on "Slow 3G" without breaking (degraded, but functional)
- [ ] Works offline for previously visited pages (if service worker active)
- [ ] No console errors on any page
- [ ] No 404s in network tab on any page

---

## 10. Content and copy

- [ ] Every page has a unique, descriptive `<title>`
- [ ] Every page has a unique `<meta name="description">` under 160 characters
- [ ] No "Lorem ipsum" anywhere
- [ ] No "TODO" or placeholder content
- [ ] All external links open in new tab with `rel="noopener noreferrer"` (where appropriate)
- [ ] All internal links use relative or absolute paths consistently
- [ ] Spelling and grammar checked
- [ ] Dates and contact information current

---

## 11. Security

- [ ] HTTPS enforced (HSTS header set)
- [ ] Content Security Policy header configured
- [ ] No exposed API keys or secrets in client-side code
- [ ] No `console.log` debug output in production build
- [ ] Form submissions validated server-side, not just client-side
- [ ] No mixed content warnings (http:// resources on https:// pages)

---

## 12. Analytics and monitoring (if used)

- [ ] Analytics loaded `async`, never blocking
- [ ] Privacy-respecting (Plausible, Fathom, or self-hosted) where possible
- [ ] Cookie banner only if actually setting cookies (and compliant — GDPR/UK/Swiss)
- [ ] Error tracking configured (Sentry or similar) — silent, not annoying

---

## 13. Final sanity pass

Five minutes, before deployment:

- [ ] Open the site in an incognito window on a phone
- [ ] Scroll the entire homepage. Does anything jank?
- [ ] Tap every button. Does anything feel slow?
- [ ] Open a project case study. Does it feel as polished as the homepage?
- [ ] Read the copy out loud on one page. Does it sound human?
- [ ] Close the tab. Wait 10 seconds. Reopen.

If, after that final reopen, the site still feels different from anything else you have seen recently — it is ready.

If it feels "fine," go back to `06-signature-moment.md`. The site is missing the thing.

---

## After deploy

- [ ] Run Lighthouse against the live URL (production environment can score differently from local)
- [ ] Run WebPageTest from at least 3 global locations
- [ ] Verify Open Graph image actually displays correctly on Twitter, LinkedIn, Slack, iMessage
- [ ] Test the live site on a mid-range Android phone over LTE
- [ ] Set up uptime monitoring
- [ ] Submit sitemap to Google Search Console

---

## The honest test

Send the URL to one developer and one designer you respect. Do not explain anything. Wait for unprompted reactions.

If both say "this looks nice" — it is not done.
If at least one says "wait, how did you do X?" — it is done.
