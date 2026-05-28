# 02 — Typography

After images, type is the second biggest perceived-craft signal. Most sites have "a font." Standout sites have a **typographic system** — sizes that flow, spacing that breathes, letterforms that adapt.

---

## Goal

Type should feel **hand-set at every viewport width**. Never snap. Never feel cramped. Never feel oversized. Never flash unstyled text on load.

---

## 1. Fluid typography (mandatory)

Replace every breakpoint-based font size with `clamp()`. The headline at 320 px and the headline at 1920 px should both feel correct without anyone tuning per breakpoint.

### The clamp formula

```css
font-size: clamp(MIN, PREFERRED, MAX);
```

- **MIN** — the size at the smallest viewport you support
- **MAX** — the size at the largest viewport you support
- **PREFERRED** — a fluid expression that scales between them

### A working type scale

```css
:root {
  /* Display */
  --fs-display: clamp(2.75rem, 1.5rem + 5vw, 6rem);
  --fs-h1:      clamp(2rem,    1.25rem + 3.5vw, 4rem);
  --fs-h2:      clamp(1.5rem,  1rem + 2.5vw, 2.75rem);
  --fs-h3:      clamp(1.25rem, 0.9rem + 1.5vw, 1.875rem);
  --fs-h4:      clamp(1.125rem, 0.95rem + 0.75vw, 1.375rem);

  /* Body */
  --fs-lead:    clamp(1.125rem, 0.95rem + 0.5vw, 1.375rem);
  --fs-body:    clamp(1rem,     0.95rem + 0.2vw, 1.125rem);
  --fs-small:   clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem);
  --fs-micro:   clamp(0.75rem,  0.72rem + 0.1vw, 0.8125rem);
}
```

### Generating a real scale

For production, use [utopia.fyi](https://utopia.fyi) to generate a mathematically consistent scale based on:
- Min viewport (typically 320 px)
- Max viewport (typically 1440 or 1920 px)
- A type-scale ratio (1.25 = major third, 1.333 = perfect fourth)

Copy the generated CSS variables into the project. Do not hand-tune individual `clamp()` values — that defeats the system.

---

## 2. Variable fonts + optical sizing

Most variable font usage stops at weight. The real power is **optical sizing (`opsz`)** — the font itself is redesigned for different sizes (tighter spacing and thinner strokes at large sizes, opener spacing and thicker strokes at small sizes).

### Enable browser-auto optical sizing

```css
html {
  font-optical-sizing: auto;
}
```

That single declaration tells the browser to pass the rendered font size into the font's `opsz` axis automatically. Works with any variable font that supports `opsz` (Inter, Recursive, Source Serif, Playfair Display, Roboto Flex, and many more).

### Manual axes

For more control:

```css
h1 {
  font-family: "Inter Variable", sans-serif;
  font-variation-settings:
    "wght" 600,
    "opsz" 72,        /* designed for display sizes */
    "slnt" 0;         /* upright */
}

p {
  font-variation-settings:
    "wght" 400,
    "opsz" 14;        /* designed for body sizes */
}
```

### Custom axes (Recursive, Roboto Flex)

```css
.callout {
  font-family: "Recursive Variable", sans-serif;
  font-variation-settings:
    "MONO" 0,
    "CASL" 0.5,       /* casualness */
    "CRSV" 0,
    "slnt" -4;
}
```

Used sparingly, custom axes give the site a typographic personality no one else has.

---

## 3. Font loading strategy

The biggest perceived-craft killer in type is the flash on load — either a flash of invisible text (FOIT) or unstyled text (FOUT).

### Pattern

1. Self-host the variable font as `woff2`.
2. Preload it in the head.
3. Use `font-display: swap` with a tuned fallback metric.

```html
<link
  rel="preload"
  href="/fonts/Inter.var.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter.var.woff2") format("woff2-variations");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  /* Metric-adjusted fallback so the layout does not shift on swap */
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

The `size-adjust` and override values must be tuned per font to match the system fallback. Use [Fontaine](https://github.com/unjs/fontaine) or [Fontpie](https://github.com/pixel-point/fontpie) to compute them automatically.

### Result

The fallback (system sans-serif) renders instantly with the same metrics as the real font. When the real font swaps in, nothing moves. Zero CLS, zero flash.

---

## 4. Font subsetting

A full variable font is 300–600 KB. A subset containing only the glyphs the site actually uses is typically 20–80 KB.

### Command

```bash
glyphhanger https://yoursite.com --subset --formats=woff2 --output=./fonts/
```

This crawls the site, finds every character rendered, and outputs a font containing only those glyphs. For a marketing site in a single language, this typically removes 80–90 % of the file size.

### Google Fonts subsetting

If using Google Fonts (avoid if possible — self-host instead), use the `text=` parameter:

```
https://fonts.googleapis.com/css2?family=Playfair+Display&text=ABCDEF…
```

Or pick the `subset=latin` or specific Unicode ranges.

---

## 5. Line height, letter spacing, measure

Per-size adjustments matter more than any single value.

```css
:root {
  /* Line heights — tighter at display sizes, looser at body */
  --lh-display: 1.05;
  --lh-h1:      1.1;
  --lh-h2:      1.15;
  --lh-h3:      1.25;
  --lh-body:    1.5;
  --lh-small:   1.55;

  /* Letter spacing — negative at large sizes, slight positive at micro */
  --tracking-display: -0.03em;
  --tracking-h1:      -0.025em;
  --tracking-h2:      -0.02em;
  --tracking-body:    0;
  --tracking-micro:   0.02em;
  --tracking-caps:    0.08em;
}

h1 { line-height: var(--lh-h1); letter-spacing: var(--tracking-h1); }
p  { line-height: var(--lh-body); }
```

### Measure (line length)

Body copy reads best between 50–75 characters per line. Use `ch` units to enforce it:

```css
p, li {
  max-width: 65ch;
}

.lead {
  max-width: 55ch;
}
```

---

## 6. Text rendering quality

```css
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

`text-rendering: optimizeLegibility` enables proper kerning and ligatures. It is slow on long body copy, so apply it to headings only if performance is tight:

```css
h1, h2, h3 { text-rendering: optimizeLegibility; }
body { text-rendering: auto; }
```

---

## 7. OpenType features

Variable fonts ship with OpenType features (tabular numbers, oldstyle figures, stylistic alternates). Use them.

```css
.tabular {
  font-feature-settings: "tnum" 1; /* tabular numerals for tables, prices */
}

.numbers-pretty {
  font-feature-settings: "lnum" 1, "ss01" 1;
}

.headline {
  font-feature-settings: "ss01" 1, "calt" 1, "liga" 1, "dlig" 1;
}
```

Check the font's documentation for available features. Inter, for example, has alternate "a", "g", and disambiguated "1lI" glyphs.

---

## 8. Headline craft

Headlines are where typographic decisions are most visible.

```css
h1, h2, h3 {
  /* Balance line lengths so the last line is not an orphan */
  text-wrap: balance;
}

p {
  /* Avoid widows */
  text-wrap: pretty;
}
```

`text-wrap: balance` is one of the most impactful single declarations available — it automatically distributes words across lines so headlines do not have a single dangling word.

`text-wrap: pretty` is the body-copy equivalent (Chrome 117+, Safari 17.4+).

---

## 9. Color contrast for type

WCAG AA requires:
- 4.5:1 for body text
- 3:1 for large text (18 pt+ or 14 pt+ bold)

But for craft, aim higher: 7:1+ for body. Light gray text on white is the most common amateur tell.

```css
:root {
  --text:        #0a0a0a;   /* near-black, not #000 */
  --text-muted:  #4a4a4a;   /* still 9:1 against white */
  --text-faint:  #767676;   /* AA-large only */
}
```

Pure black (#000) on pure white feels harsh and "vibrates" on OLED screens. Use #0a0a0a or similar.

---

## AVOID

- Hard-coded font sizes per breakpoint. Use `clamp()`.
- Loading 4 different weights of a static font when one variable font does the same job.
- `font-display: block` (causes FOIT — text invisible until font loads).
- Using Google Fonts hosted (CDN) without self-hosting fallback metrics. The flash is brutal.
- Using more than 2 font families on one site. One is often better.
- Setting `letter-spacing` on a small body size — kills readability.
- `text-transform: uppercase` without adding letter-spacing — feels cramped.
- Pure black `#000` on pure white `#fff` for body copy.

---

## Verification

Before deploy:
1. Throttle the network to "Slow 3G" and reload. There should be no FOIT (invisible text) and no FOUT (visible shift when font swaps).
2. Resize the browser slowly from 320 px to 1920 px — headlines and body copy should scale smoothly without snaps.
3. View at a 4K monitor and a phone — the type should feel correctly proportioned at both.
4. Run Lighthouse — no "Avoid invisible text" or "Reduce unused font" warnings.
