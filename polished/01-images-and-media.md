# 01 — Images & Media

The single biggest perceived-quality lever on any site. If images look soft, the whole site feels cheap regardless of how good everything else is.

---

## Goal

Every image on every device should look **better than the visitor expects** while loading faster than they expect. No softness on Retina. No layout shift. No flicker on load.

---

## 1. DPR-aware adaptive serving (mandatory)

The default `srcset` approach serves different sizes but compresses everything the same way. The correct approach combines three things:

- Device Pixel Ratio (1x, 2x, 3x)
- Actual rendered size of the image slot (never full viewport)
- A CDN that generates the exact crop on demand

### Pattern

```html
<img
  src="https://cdn.example.com/photo?w=400&fm=avif&q=85"
  srcset="
    https://cdn.example.com/photo?w=400&fm=avif&q=85 1x,
    https://cdn.example.com/photo?w=800&fm=avif&q=85 2x,
    https://cdn.example.com/photo?w=1200&fm=avif&q=82 3x
  "
  sizes="(max-width: 600px) 100vw, 400px"
  width="400"
  height="300"
  alt="…"
  loading="lazy"
  decoding="async"
/>
```

Notes:
- Slightly lower quality (82) at 3x is invisible because of pixel density, and saves bandwidth.
- AVIF first, WebP fallback via `<picture>` if older Safari support matters.
- `width` and `height` attributes are mandatory — they reserve space and prevent CLS.

### If no CDN is available

Use a build-time tool (`sharp`, `squoosh`, or framework-native image pipelines) to generate the variants statically. Same naming pattern, served from `/assets/`. Never serve a single image and let the browser scale.

### Above-the-fold images

Hero images must NOT be `loading="lazy"`. They should be `fetchpriority="high"` instead:

```html
<img src="…" fetchpriority="high" decoding="sync" alt="…" />
```

And preloaded in the head:

```html
<link rel="preload" as="image" href="…" imagesrcset="…" imagesizes="…" />
```

---

## 2. Aspect ratio reservation (mandatory)

Every image, video, iframe, and embed must reserve its space. CLS (Cumulative Layout Shift) is the most common craft killer.

```css
img, video, iframe {
  display: block;
  max-width: 100%;
  height: auto;
}

.media-slot {
  aspect-ratio: 16 / 9; /* or whatever the source ratio is */
  background: var(--media-bg, #0a0a0a);
  overflow: hidden;
}
```

If the aspect ratio is not known at build time, the image element itself must have `width` and `height` attributes set — the browser uses these to compute aspect-ratio automatically.

---

## 3. LQIP (Low Quality Image Placeholder)

A 20×15px blurred version of the image, base64-encoded, used as the background of the slot. Fades out when the real image loads. Zero white flash. Zero layout shift.

### HTML

```html
<div
  class="lqip"
  style="background-image: url('data:image/jpeg;base64,/9j/4AAQ…');"
>
  <img src="…" srcset="…" sizes="…" onload="this.parentElement.classList.add('loaded')" />
</div>
```

### CSS

```css
.lqip {
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.lqip::before {
  content: "";
  position: absolute;
  inset: 0;
  backdrop-filter: blur(12px);
  transition: opacity 0.4s ease;
}

.lqip img {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.lqip.loaded img {
  opacity: 1;
}

.lqip.loaded::before {
  opacity: 0;
}
```

### Generating LQIP

At build time, use `sharp` or `plaiceholder`:

```js
import sharp from "sharp";
const buffer = await sharp(input).resize(20).blur().jpeg({ quality: 40 }).toBuffer();
const base64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;
```

The result is under 1 KB per image. Inline it directly in the HTML.

---

## 4. Modern formats

Default delivery order: **AVIF → WebP → JPEG/PNG fallback.**

Use `<picture>` when older Safari (pre-16) support is required:

```html
<picture>
  <source type="image/avif" srcset="photo.avif 1x, photo@2x.avif 2x" />
  <source type="image/webp" srcset="photo.webp 1x, photo@2x.webp 2x" />
  <img src="photo.jpg" srcset="photo@2x.jpg 2x" alt="…" />
</picture>
```

For PNGs (logos, icons, illustrations with transparency), AVIF and WebP both work and produce dramatically smaller files. SVG is still preferred for vector content.

---

## 5. Video as motion (the gif-replacement pattern)

If a section needs a short looping clip (hero, product demo, ambient motion):

```html
<video
  autoplay
  muted
  loop
  playsinline
  preload="metadata"
  poster="poster.jpg"
  aria-label="…"
>
  <source src="clip.av1.mp4" type="video/mp4; codecs=av01.0.05M.08" />
  <source src="clip.h265.mp4" type="video/mp4; codecs=hvc1" />
  <source src="clip.h264.mp4" type="video/mp4" />
</video>
```

Rules:
- `playsinline` is required for iOS to autoplay (without it, iOS forces fullscreen).
- `muted` is required for autoplay on every browser.
- Keep clips under 6 seconds and under 1.5 MB.
- The poster image follows all the same rules as any other image (DPR-aware, AVIF, etc.).
- For visitors on `prefers-reduced-motion: reduce`, pause the video — see `05-accessibility-and-polish.md`.

### Fade-in from poster

```css
video {
  opacity: 0;
  transition: opacity 0.5s ease;
}
video.ready { opacity: 1; }
```

```js
document.querySelectorAll("video").forEach(v => {
  v.addEventListener("playing", () => v.classList.add("ready"), { once: true });
});
```

---

## 6. Decoding hints

```html
<!-- Above the fold -->
<img decoding="sync" fetchpriority="high" />

<!-- Below the fold -->
<img decoding="async" loading="lazy" />
```

`decoding="async"` lets the browser decode the image off the main thread, reducing jank on initial paint.

---

## 7. SVG handling

Inline SVGs that are part of the UI (icons, logos). Reference external SVGs that are decorative or repeated:

```html
<!-- UI icon, inline -->
<svg viewBox="0 0 24 24" aria-hidden="true">…</svg>

<!-- Decorative, external + cached -->
<img src="/decor.svg" alt="" />
```

For icon systems, inline SVG sprites are fastest:

```html
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="icon-arrow" viewBox="0 0 24 24">…</symbol>
</svg>

<!-- Usage -->
<svg aria-hidden="true"><use href="#icon-arrow" /></svg>
```

---

## 8. Background images

If a background image is decorative and not content, use CSS `image-set()` for DPR-aware serving:

```css
.hero {
  background-image: image-set(
    url("hero.avif")    1x,
    url("hero@2x.avif") 2x,
    url("hero@3x.avif") 3x
  );
}
```

If the image is content (e.g. a photo of a project), use a real `<img>` element, not a background. Backgrounds are not crawled, not indexed, not announced to screen readers.

---

## AVOID

- Serving a single image and relying on browser scaling. This is the #1 cause of soft images on Retina.
- Setting `loading="lazy"` on the hero image. It delays the LCP element and tanks Lighthouse.
- Decorative `background-image` without `image-set()` — looks soft on Retina.
- GIFs. Always. Use a looping muted video instead. GIF is 10–20x larger than an equivalent WebM.
- Using `<img>` without `width` and `height` attributes. Guaranteed CLS.
- Animating filters (`blur`, `brightness`) on large images during scroll — this kills GPU performance. Use opacity and transform only.

---

## Verification

Before deploy, check on a Retina display:
1. Open the site at 100% zoom on a 2x or 3x screen.
2. Inspect any image — its `naturalWidth` should be ≥ 2× its rendered CSS width.
3. The Network tab should show AVIF or WebP being served, not JPG/PNG.
4. Throttle to "Slow 4G" and confirm no white flashes, no layout shifts.
