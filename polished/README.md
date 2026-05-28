# The Craft Pass

A pre-deploy refinement playbook. These files are read by Claude Code right before a site goes live to add the final 10% of craft that separates "good" from "memorable."

---

## Read this first

Most sites are built to **pass standards** — good Lighthouse score, decent design, ships on time.

This playbook is for sites built to **set standards** — every detail intentional, performance invisible, design with a point of view. The kind of site where a client opens DevTools to figure out how it was made.

The techniques here are not exotic. They are documented, supported, and shippable today. They are rare in production because they require discipline and a second pass — which is exactly what this playbook is for.

---

## How to use this playbook

**When:** Run this pass after the site is functionally complete, after design is locked, and before deployment. Not during initial build — it's a finishing layer.

**Order:**
1. `01-images-and-media.md` — biggest perceived-quality jump, do this first
2. `02-typography.md` — second biggest visual jump
3. `03-performance.md` — render performance and perceived speed
4. `04-interactions-and-motion.md` — how the site responds to the user
5. `05-accessibility-and-polish.md` — the marks of a professional
6. `06-signature-moment.md` — the one unexplainable detail
7. `07-deploy-checklist.md` — verify everything before going live

Each file is self-contained. Claude Code can be pointed at one file at a time, or run the full pass top-to-bottom.

---

## The feeling we are building toward

A first-time visitor should feel three things in the first 5 seconds, in this order:

1. **Weight.** Like everything was placed, not dropped. Nothing accidental.
2. **Speed.** Not "fast enough." Instant. Native-app instant.
3. **Sharpness.** Images, type, edges — everything looks better than it should.

If a designer or developer lands on the site, they should have a fourth feeling: **"how did they do this?"** Not because of a flashy effect, but because they cannot identify what makes it feel different. That feeling is the goal.

---

## The non-negotiables

These appear in every craft pass, no exceptions:

- DPR-aware image serving (no soft images on Retina)
- Fluid typography with `clamp()` (no breakpoint snaps)
- `content-visibility: auto` on long sections
- `:focus-visible` for focus rings (never `:focus` alone)
- `prefers-reduced-motion` respected globally
- Predictive link prefetching on hover
- Real font-loading strategy (no FOIT, no FOUT flash)
- Reserved space for all images and embeds (no CLS)

If any of these are missing, the site is not ready to ship.

---

## What this playbook is NOT

- Not a design system. The design must already exist and have a point of view.
- Not a fix for bad copy or weak positioning.
- Not a substitute for thinking. Every site has a different context — apply judgment, don't apply blindly.
- Not a list of every possible optimization. It's the 10% with the highest perceptual return.

---

## Tone of the work

When Claude Code applies this playbook, it should err on the side of **restraint**. The goal is precision, not maximalism. If a choice is between "more effect" and "more refinement," choose refinement every time.

No bloat. No libraries where vanilla works. No animations that exist for their own sake. Every line of code that ships should justify its weight.

---

## Author's note

This playbook exists because AI-generated code tends to be correct but not exceptional. It solves the problem stated. It does not add the layer of craft that makes a site feel hand-built by someone who cares. These files exist to add that layer back.
