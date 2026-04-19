# cliches.md
### The Cliché Scan Protocol

This file is a living list of techniques that have reached saturation in the
Awwwards / portfolio / premium web space. Saturation means: used on enough
sites that its presence reads as "following the playbook," not as craft.

Update this file. When you notice a new technique appearing on three or more
sites in the same month, add it. When an old technique has been missing for
a year, consider removing it.

---

## HOW TO USE THIS FILE

After you have polished a site through Stages 2–5 of the SOUL protocol, run
the cliché scan. The scan has two parts:

### Part 1 — Literal scan (grep-able)

Open a terminal in the repo root and run:

```bash
# Look for common cliché patterns in CSS and JS
grep -rE "cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\)" .
grep -rE "cubic-bezier\(0\.19,\s*1,\s*0\.22,\s*1\)" .
grep -rE "cubic-bezier\(0\.34,\s*1\.56,\s*0\.64,\s*1\)" .
grep -rE "locomotive" .
grep -rE "magnetic" .
grep -rE "barba" .
grep -rE "grain" .
grep -rE "lerp.*0\.07" .
grep -rE "scaleY.*bottom.*top" .
```

If any grep returns hits, those are flagged for review.

### Part 2 — Visual / behavioral scan

Walk through the site with this checklist. For each item, mark present /
absent. Each "present" either requires removal or a written justification.

---

## 2024–2026 CLICHÉ LIST

These techniques appear on so many sites that their presence no longer
communicates craft. It communicates "trained on the same tutorials."

### Cursor
- [ ] **Two-part cursor (small dot + larger lagging ring)**
      Saturation: extreme. On roughly half of Awwwards-nominated sites.
- [ ] **Cursor scales up on hover over links**
      Saturation: extreme.
- [ ] **Cursor changes to "View" / "Click" / "Drag" label on hover**
      Saturation: high. Was clever in 2022, ubiquitous in 2025.
- [ ] **Custom cursor on a site where nothing else is interactive enough
      to need it**
      Flag: mismatched commitment.

### Button + Link
- [ ] **Magnetic buttons with 0.3–0.4 pull strength and elastic return**
      Saturation: extreme. "Magnetic" as a search term in codebases is a
      strong indicator.
- [ ] **Link underline wipes in from left, out from right**
      Saturation: extreme.
- [ ] **Breathing CTA (scale 1.01–1.03, 2.5–3s loop)**
      Saturation: high. Also genuinely annoying to many users.
- [ ] **Button press scale 0.94–0.96 with elastic return**
      Saturation: high.

### Reveal patterns
- [ ] **clip-path inset(100% 0 0 0) reveal with inner element pre-scaled
      to 1.2–1.3**
      Saturation: extreme. This is the Dennis Snellenberg / Locomotive
      signature and it is now everywhere.
- [ ] **Word-by-word text reveal, power4.out or expo.out, stagger
      40–60ms, translateY 20–40px**
      Saturation: extreme. Default behavior in many starter templates.
- [ ] **Character-by-character reveal of display type**
      Saturation: high.
- [ ] **Opacity-only fade with no transform paired**
      Saturation: not a cliché but often wrong; noted here so you
      consciously choose it when you use it.

### Scroll behavior
- [ ] **Locomotive Scroll at lerp 0.07, multiplier 0.9**
      Saturation: extreme. These exact values are the "correct Locomotive
      setup" from the tutorials.
- [ ] **Lenis with default settings (no customization)**
      Saturation: rising. Default Lenis looks identical across sites.
- [ ] **Horizontal row of images sliding in opposite directions with
      scrub**
      Saturation: extreme. Was a 2020 signature.
- [ ] **Pinned section with horizontal scroll translation**
      Saturation: high.
- [ ] **Scroll-triggered counter animation (numbers counting up)**
      Saturation: extreme.
- [ ] **Scroll progress bar at top of page**
      Saturation: extreme.

### Textures / overlays
- [ ] **Grain / noise overlay as PNG at opacity 0.03–0.05**
      Saturation: extreme. A 16×16 or 128×128 PNG repeated with low opacity
      is the specific pattern.
- [ ] **SVG noise filter used identically (baseFrequency 0.9)**
      Saturation: rising. Same pattern, different tech.

### Transitions
- [ ] **Barba.js curtain transition — scaleY 0→1 from bottom, then
      0→1 from top**
      Saturation: extreme.
- [ ] **Page fade-to-black transition at 400–600ms**
      Saturation: high.
- [ ] **Logo animates to top-left corner on page enter**
      Saturation: moderate and rising.

### Hover states on media
- [ ] **Project card image scales 1.05–1.08 on hover with smooth easing**
      Saturation: extreme.
- [ ] **Image hover + title color shift + card elevation all together**
      Saturation: high. The "Active Theory hover recipe."
- [ ] **Image parallax within card on mousemove (translate 8–14px)**
      Saturation: high.

### Typography motion
- [ ] **Massive heading that scales down slightly on scroll**
      Saturation: moderate.
- [ ] **Variable font weight animating 300 → 700 on hover**
      Saturation: rising fast. Was novel in 2023, now common.
- [ ] **Marquee / ticker of brand words sliding horizontally forever**
      Saturation: extreme.

### Layout
- [ ] **Bento-box grid of case studies with irregular sizes**
      Saturation: extreme since ~2023.
- [ ] **Mouse-reactive 3D tilt on cards (rotateX/rotateY 5-10°)**
      Saturation: extreme.

### WebGL / shader
- [ ] **Ripple/distortion effect on images following cursor (standard
      flowmap shader)**
      Saturation: rising. Was cutting edge in 2022, now common.
- [ ] **RGB split/chromatic aberration on hover**
      Saturation: high.
- [ ] **Fluid simulation cursor trail**
      Saturation: rising.

### 3D
- [ ] **Three.js hero scene with floating brand-colored geometric shapes**
      Saturation: extreme.
- [ ] **Model-viewer with a single 3D product that rotates slowly**
      Saturation: rising.

---

## THE JUSTIFICATION REQUIREMENT

If any technique on the list is present in your polished code, you must
either REMOVE it or write a justification in `/soul/CHARTER.md` under a
"JUSTIFIED CLICHÉS" section.

The justification must answer three questions:

1. **Why does THIS specific project need this cliché?**
   Not "it looks nice." A specific connection to the brand's content,
   voice, or purpose.

2. **How have you MODIFIED it to not read as the stock version?**
   Different trigger, different duration, different paired behavior,
   different visual treatment. At least one dimension shifted.

3. **What does its presence cost?**
   If another agency's AI-generated site has the same technique, users
   and designers will associate your site with theirs. What are you
   accepting in exchange?

Example (correct justification):

```
JUSTIFIED CLICHÉ: Word-by-word headline reveal

Why: The hero headline is specifically a manifesto ("We make things you
won't forget") where the verb "forget" needs rhetorical weight. Word-
stagger serves the meaning.

Modification: We extend the stagger to 110ms (double the common value)
and add an extra 400ms hold on the final word. The reveal is about the
pause before "forget", not the stagger itself.

Cost: Accepts partial familiarity, earns rhetorical delivery.
```

Example (rejected, would require removal):

```
JUSTIFIED CLICHÉ: Custom cursor with dot and ring

Why: It feels premium.

— Rejected. "Feels premium" is not a brand-specific reason. Remove or
  replace with native cursor and invest the motion budget elsewhere.
```

---

## HOW TO ADD A NEW CLICHÉ

As you work, you'll notice techniques starting to appear everywhere.
Update this file.

Format:

```
- [ ] **[Name of technique]**
      Saturation: [rising / high / extreme]
      [Brief description or identifying pattern]
```

When you add, note the approximate date so future you can see the trend.

```
- [ ] **[technique]**   Added 2026-02-15
      Saturation: rising (seen on 4 sites this quarter)
      ...
```

---

## WHAT IS NOT A CLICHÉ

A technique is not a cliché just because it's common. HTML `<button>` is
common. `prefers-reduced-motion` is common. `position: sticky` is common.
These are primitives, not signatures.

A cliché is a **compositional technique**: the specific combination of
parameters, timing, and context that became recognizable. Magnetic buttons
are not a cliché because they attract to the cursor — that's just physics.
They're a cliché because they all use 0.3–0.4 pull, elastic return, and
appear on the same kinds of sites with the same kinds of CTAs.

When you modify a compositional cliché — a button that attracts to the
cursor but with 0.8 pull and an abrupt snap-back, or a link underline that
expands from the center and takes a full 600ms — you have made something
different. Different is fine. Different is the whole point.

---

*Techniques become clichés because they work. Using them is not a sin.
Using them without acknowledging they are clichés, and shipping the stock
parameters, is the sin. Everything in this file has been beautiful at
some point. Beauty becomes wallpaper only when it stops being specific
to this brand.*
