# 06 — The Signature Moment

The one unexplainable detail. The thing that makes the visitor stop and go back to do it again.

---

## Goal

Every site must have **exactly one moment** that the visitor cannot identify but cannot forget. Not a gimmick. Not a flashy effect. Something that sits beneath everything else and signals a different level of intention.

---

## What it is, and what it is NOT

**It is:**
- A subtle, repeated interaction that responds to the visitor in a way nothing else on the web does
- A detail that requires effort but reads as effortless
- A choice that shows the maker cared about something most people would not have thought to care about

**It is NOT:**
- A custom cursor (overused, almost always feels gimmicky)
- A loading screen with a progress bar (no one wants to see one)
- An entire 3D world (Bruno Simon did it, nobody else should)
- Confetti, sparkles, or anything that "celebrates"
- A scroll-jacking takeover

The rule: if the visitor can name the effect ("oh, it has a cursor trail"), it is too obvious. The signature moment should be something they can feel but not articulate.

---

## Examples from sites that do this well

- **Linear's homepage:** the gradient beam that follows the cursor through the hero is responsive in a way that feels physical.
- **Stripe:** the gradient backgrounds shift subtly with cursor position; transitions between sections have a custom GPU-rendered animation pipeline.
- **Vercel:** the page transitions are so smooth they feel like a native app.
- **Basement.studio:** the entire site has a slight, almost-imperceptible weight to its scroll feel — like everything has inertia.
- **Apple product pages:** the way images snap into focus as you scroll, with parallax that respects the camera's "focal plane."

What they have in common: **the effect is the medium, not the message.** The visitor is there to learn about the product, and the effect supports that — it does not interrupt.

---

## Choosing yours

Three questions to answer before picking:

1. **What is the site's tone?** Confident and minimal → a single light source. Energetic and bold → a gradient that shifts. Editorial → a typographic detail. Technical → a data-driven motion.
2. **What does the visitor do most?** Move the cursor → cursor-anchored effect. Scroll → scroll-anchored effect. Hover specific elements → hover-anchored effect.
3. **What will not get old?** The signature moment will be experienced on every visit. It must reward repeat viewing, not just first impression.

---

## Patterns

Pick ONE. Implement it across the site with discipline. Do not stack effects.

---

### Pattern A — The light source

A soft, GPU-rendered glow that follows the cursor through dark sections of the site. Mid-blend mode so it interacts with the content beneath.

```css
:root {
  --cx: 50vw;
  --cy: 50vh;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    600px circle at var(--cx) var(--cy),
    color-mix(in oklch, var(--accent) 8%, transparent),
    transparent 60%
  );
  z-index: 1;
  mix-blend-mode: screen;
  transition: opacity 0.3s ease;
}

/* Disable on light backgrounds */
.section-light ~ * body::before { opacity: 0; }

@media (hover: none), (prefers-reduced-motion: reduce) {
  body::before { display: none; }
}
```

```js
addEventListener('pointermove', (e) => {
  document.documentElement.style.setProperty('--cx', e.clientX + 'px');
  document.documentElement.style.setProperty('--cy', e.clientY + 'px');
}, { passive: true });
```

**Why it works:** the visitor's eye follows the cursor naturally. The glow is in their peripheral vision, never in focus, but always present.

---

### Pattern B — Magnetic interactive elements

Buttons, links, and CTAs subtly pull toward the cursor when it gets near. The visitor's hand and the element move toward each other — a physical sense of intention.

```js
function magnetize(el, strength = 0.3, radius = 100) {
  const onMove = (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < radius) {
      const pull = (1 - dist / radius) * strength;
      el.style.setProperty('--mx', `${dx * pull}px`);
      el.style.setProperty('--my', `${dy * pull}px`);
    } else {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    }
  };

  document.addEventListener('pointermove', onMove, { passive: true });
}

if (!matchMedia('(hover: none)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-magnetic]').forEach(el => magnetize(el));
}
```

```css
[data-magnetic] {
  --mx: 0; --my: 0;
  transform: translate3d(var(--mx), var(--my), 0);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

**Why it works:** the visitor does not consciously notice the pull, but their clicks land with eerie precision. They feel competent. They like the site.

Apply only to primary CTAs (1–3 elements per page). More dilutes the effect.

---

### Pattern C — Image as window

When the visitor hovers a project thumbnail, the image inside subtly parallaxes against the cursor — as if the thumbnail is a window the visitor is leaning to look through.

```css
.thumb {
  --tx: 0; --ty: 0;
  overflow: hidden;
  border-radius: 12px;
}

.thumb img {
  transform: scale(1.06) translate3d(var(--tx), var(--ty), 0);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}
```

```js
document.querySelectorAll('.thumb').forEach(thumb => {
  thumb.addEventListener('pointermove', (e) => {
    const rect = thumb.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    thumb.style.setProperty('--tx', `${x * -16}px`);
    thumb.style.setProperty('--ty', `${y * -16}px`);
  });

  thumb.addEventListener('pointerleave', () => {
    thumb.style.setProperty('--tx', '0');
    thumb.style.setProperty('--ty', '0');
  });
});
```

**Why it works:** it gives every project thumbnail a tactile sense of dimension. The portfolio feels physical without being skeuomorphic.

---

### Pattern D — Letter-by-letter hover

On link hover, each letter of the link text shifts up slightly in sequence, like a small wave.

```html
<a href="/about" class="word-hover">
  <span aria-hidden="true">
    <span class="letter">A</span><span class="letter">b</span><span class="letter">o</span><span class="letter">u</span><span class="letter">t</span>
  </span>
  <span class="sr-only">About</span>
</a>
```

```css
.word-hover .letter {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.word-hover:hover .letter {
  transform: translateY(-2px);
}

.word-hover:hover .letter:nth-child(1) { transition-delay: 0ms; }
.word-hover:hover .letter:nth-child(2) { transition-delay: 30ms; }
.word-hover:hover .letter:nth-child(3) { transition-delay: 60ms; }
.word-hover:hover .letter:nth-child(4) { transition-delay: 90ms; }
.word-hover:hover .letter:nth-child(5) { transition-delay: 120ms; }
```

Generate the spans at build time, not at runtime. Aria-hide the split version, keep the original word for screen readers.

**Why it works:** the visitor feels rewarded for the smallest possible interaction — pointing at a word.

---

### Pattern E — Inertia-aware scroll cue

A subtle indicator (a thin line, a small icon) that responds to the **velocity** of the user's scroll, not just position. Fast scroll → it stretches. Slow scroll → it stays compact. Stop scrolling → it pulses once.

```js
let lastY = 0;
let lastT = performance.now();
let velocity = 0;

addEventListener('scroll', () => {
  const y = scrollY;
  const t = performance.now();
  const dt = t - lastT;
  velocity = (y - lastY) / Math.max(dt, 1);
  document.documentElement.style.setProperty('--scroll-velocity', velocity.toFixed(3));
  lastY = y;
  lastT = t;
}, { passive: true });
```

```css
.scroll-cue {
  height: calc(2rem + (abs(var(--scroll-velocity)) * 30px));
  transition: height 0.2s ease;
}
```

**Why it works:** scrolling becomes an expressive act. The site responds to *how* the visitor moves, not just *whether* they moved.

---

## Implementation rules

1. **One signature moment per site.** Pick it. Commit. Do not stack.
2. **Disable on touch and reduced-motion.** Always, no exceptions.
3. **The effect must not block interaction.** `pointer-events: none` on the visual layer.
4. **The effect must run on the compositor thread.** `transform` and `opacity` only. No layout properties animated.
5. **It must be tied to the site's tone.** A funeral-home site does not need magnetic buttons.
6. **It must not break in dark mode, light mode, low-power mode, or older browsers.** Test all four.

---

## How to know it landed

You will not get a wow text message about the signature moment. What you will get:

- DevTools open in your visitor's browser
- Twitter screenshots
- "How did you make this?" questions
- New clients saying "I saw your site and thought…"

If those happen, you nailed it.

---

## What if the visitor doesn't notice?

That is the goal. The signature moment is a slow-burn — they notice it on visit two, screenshot it on visit three, ask about it on visit four. The visitor does not need to consciously register the effect for it to do its job.

The wrong sign is: visitor notices immediately and says "cool effect." That means it is too loud.
The right sign is: visitor cannot say why the site feels different.
