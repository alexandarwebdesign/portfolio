# Image Optimization — Agent Instructions

The user has already dropped a raw image into `images/raw/`. Your job is to run the full pipeline, update the project data, verify the HTML/JS/CSS, and run the audit before marking done.

---

## Step 1 — Run the Optimizer

Open the terminal and run:

```bash
npm run optimize
```

This generates 3 WebP files in `images/projects/`:

```
images/projects/[image-name]-800.webp
images/projects/[image-name]-1440.webp
images/projects/[image-name]-2880.webp
```

The original file in `images/raw/` is deleted automatically after processing.

---

## Step 2 — Update projects.json

Open `data/projects.json` and find the correct project. Set `hero_image` to just the base filename — no path, no extension:

```json
"hero_image": "your-image-name"
```

✅ Correct: `"hero_image": "forma-hero"`
❌ Wrong: `"hero_image": "images/projects/forma-hero.webp"`

---

## Step 3 — Verify projects.js

The hero image must be set dynamically using this exact pattern:

```javascript
const base = project.hero_image;
const dir = 'images/projects/';

heroFullImage.src    = `${dir}${base}-1440.webp`;
heroFullImage.srcset = `${dir}${base}-800.webp 800w, ${dir}${base}-1440.webp 1440w, ${dir}${base}-2880.webp 2880w`;
heroFullImage.sizes  = '100vw';
heroFullImage.alt    = `${project.title} project hero image`;
heroFullImage.loading = 'lazy';
```

No hardcoded filenames. Paths must always be built from `project.hero_image`.

---

## Step 4 — Verify project.html

The hero image element must have these exact attributes:

```html
<img
  src=""
  alt=""
  class="project-hero-image"
  id="project-hero-full-image"
  loading="lazy"
  decoding="async"
  data-scroll
  data-scroll-speed="-1"
/>
```

- `loading` must be `lazy` — never `eager`
- `decoding="async"` must always be present
- `data-scroll` and `data-scroll-speed="-1"` must always be present
- `src` and `alt` stay empty — set dynamically by `projects.js`

---

## Step 5 — Verify styles.css

The image wrapper and image must have these rules:

```css
.project-hero-image-frame {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.project-hero-image {
  position: absolute;
  inset: -20%;
  width: 100%;
  height: 120%;
  object-fit: cover;
  will-change: transform;
}
```

Do not remove `inset: -20%` — it gives the parallax room to move without showing empty edges.

---

## Step 6 — Run the Audit

Check every item before marking the task complete:

### Files
- [ ] 3 WebP files exist in `images/projects/`: `[name]-800.webp`, `[name]-1440.webp`, `[name]-2880.webp`
- [ ] Raw image no longer exists in `images/raw/`

### projects.json
- [ ] `hero_image` is the base name only — no path, no extension

### projects.js
- [ ] `src` is set to `-1440.webp` version
- [ ] `srcset` contains all 3 sizes with correct `w` descriptors
- [ ] `sizes` is set to `'100vw'`
- [ ] `loading` is set to `'lazy'`
- [ ] No hardcoded filenames — paths built from `project.hero_image`

### project.html
- [ ] `loading="lazy"` present — not `eager`
- [ ] `decoding="async"` present
- [ ] `data-scroll` present
- [ ] `data-scroll-speed="-1"` present

### styles.css
- [ ] `.project-hero-image-frame` has `position: relative` and `overflow: hidden`
- [ ] `.project-hero-image` has `position: absolute` and `inset: -20%`
- [ ] `will-change: transform` present
- [ ] `object-fit: cover` present

### Browser
- [ ] Image loads and is visible on the project page
- [ ] Image moves slower than the page on scroll — parallax is working
- [ ] DevTools → Network → Images confirms correct size loads for screen width
- [ ] No broken image icons or alt text placeholders visible
