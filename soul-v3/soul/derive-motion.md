# derive-motion.md
### How to Extract a Motion Language from Real Design Tokens

This is the replacement for archetype-based prescriptions. You will not pick
from a menu of seven dialects. You will read the actual tokens in the repo
and derive a motion language from them.

The premise: a brand's motion is already latent in its typography, color,
spacing, and tone. Your job is to surface it, not invent it.

---

## THE FIVE DERIVATIONS

You will derive five motion properties:

1. **Primary tempo** (base duration for medium-weight animations)
2. **Primary easing** (the curve shape for ~70% of animations)
3. **Stagger rhythm** (how sequences of elements reveal)
4. **Exit ratio** (how quickly things leave vs. enter)
5. **Motion budget** (how many things can move at once)

Each comes from specific evidence.

---

## DERIVATION 1 — PRIMARY TEMPO

Tempo is the heartbeat of the site. Every other duration is a multiple of it.

Derive tempo from typography:

### Look at the primary display typeface. Three questions:

**Q1 — Weight personality:**
- Weights 200-400 (Light / Regular): the brand whispers. Tempo leans slower.
- Weights 500-700 (Medium / Bold): the brand speaks normally. Tempo is moderate.
- Weights 800-950 (Black / Heavy): the brand declares. Tempo is faster or
  oddly slow-and-heavy (see Q3).

**Q2 — Letterform width:**
- Condensed / narrow: the brand is compressed, efficient. Tempo faster.
- Normal width: moderate tempo.
- Wide / extended: the brand has room to breathe. Tempo slower.

**Q3 — Letterform style:**
- Sharp-cornered, high-contrast serif (Didone, modern serif): authoritative,
  slow, deliberate. Tempo slow.
- Humanist serif (Garamond, Sabon, Merriweather): warm, measured. Tempo
  medium-slow.
- Geometric sans (Futura, Circular, Inter-like): rational, clean. Tempo medium.
- Grotesque sans (Helvetica, Neue Haas, Söhne): neutral, flexible. Tempo
  medium — look at other tokens to decide direction.
- Humanist sans (Gill, Myriad, Optima): warm, readable. Tempo medium-slow.
- Display / expressive / variable with strong character: whatever personality
  the type has, that's your tempo personality.
- Monospace: mechanical, often fast and linear-feeling. Tempo fast.

### Derive a range:

Combine the three answers. The output is a tempo range, not a single number.

```
slow        → 650–950ms base
medium-slow → 500–700ms
medium      → 350–550ms
medium-fast → 250–400ms
fast        → 150–280ms
```

### Narrow the range using line-height and letter-spacing:

- Tight leading (1.0–1.2) + tight tracking: compressed, urgent. Pick the
  lower end of the range.
- Generous leading (1.5+) + open tracking: editorial, patient. Pick the upper
  end of the range.
- Normal leading (1.3–1.45): middle of range.

### Pick a number.

Not a round number. The tempo should be specific to this site. `428ms` is a
better tempo than `400ms` because a round number is every site's number.
`587ms` is better than `600ms`. The specificity is part of the signature.

(Nobody will perceive the 28ms difference between 400 and 428 — that's fine.
The point is that your CSS and JS ARE the site's signature, and specific
numbers are harder to accidentally copy.)

Write the derivation into the Charter:

```
PRIMARY TEMPO: 428ms
  DERIVED FROM:
    — Primary typeface: Söhne (grotesque sans, weight 500 primary,
      weight 800 display)
    — Line-height 1.35 (moderate)
    — Letter-spacing 0 (neutral)
    — Reasoning: Grotesque sans at moderate weight with moderate
      leading puts us mid-medium range (~400ms). Tracking is neutral
      so no pull in either direction. Specific value: 428ms (avoiding
      round-number cliché).
```

---

## DERIVATION 2 — PRIMARY EASING

Easing is how things accelerate and decelerate. Different eases communicate
different material properties.

Derive easing from corner radii and color palette together.

### Step 1 — Look at the radii tokens.

If the system uses:
- `0` or near-zero radii everywhere: the brand is sharp, architectural.
  Easing should be sharp — stronger in/out with more decisive stops.
- Small radii (2-6px): moderately sharp. Standard ease-out shapes work.
- Medium radii (8-16px): softer. Ease-outs lean toward smoother curves.
- Large radii (20px+) or pill shapes: soft, friendly, rounded. Easing is
  gentler, often with slight overshoot tolerance.
- Organic / variable / hand-drawn radii: the motion should have asymmetry
  and slight imperfection — consider custom bezier curves, not library
  presets.

### Step 2 — Look at the color palette.

If the palette is:
- High-contrast black-and-white with one accent: decisive. Eases terminate
  cleanly. Avoid overshoot.
- Muted / desaturated: patient. Eases can be longer and softer.
- Vibrant / saturated: energetic. Eases can be more assertive.
- Warm-biased (reds, oranges, earth tones): slight overshoot is ok.
- Cool-biased (blues, greens, grays): avoid overshoot, keep eases calm.
- Monochromatic dark (black + grays): institutional. Eases are near-material.

### Step 3 — Combine into a curve shape.

Describe the curve you want in plain English first, then write the bezier:

Example 1:
> "Sharp radii + high-contrast B&W + one vivid accent = a decisive brand.
> I want eases that start slightly slow (considered) and end clean (decisive).
> Not curvy. Not bouncy. No overshoot."
>
> Curve: starts at 0, accelerates cleanly to ~0.3 by midpoint, ends at 1
> with slight deceleration. `cubic-bezier(0.3, 0, 0.15, 1)` approximately —
> but test against the specific feel and adjust control points until it
> matches the description.

Example 2:
> "Medium radii + muted warm palette + humanist typography = a warm,
> editorial brand. I want eases that feel like pages turning — soft start,
> gentle arrival, no sharpness."
>
> Curve: a smooth ease-out with most of the deceleration in the final
> third. `cubic-bezier(0.2, 0.8, 0.25, 1)` approximately.

### Step 4 — Do not use known eases without modification.

These bezier curves are on millions of pages — if your derivation lands on
one of them, nudge control points by at least 0.03 on two axes:

```
DO NOT SHIP AS-IS:

cubic-bezier(0.4, 0, 0.2, 1)      — Material standard
cubic-bezier(0.25, 0.1, 0.25, 1)  — CSS ease
cubic-bezier(0, 0, 0.58, 1)       — CSS ease-out
cubic-bezier(0.42, 0, 0.58, 1)    — CSS ease-in-out
cubic-bezier(0.16, 1, 0.3, 1)     — Framer / Vercel / Linear default
cubic-bezier(0.19, 1, 0.22, 1)    — Penner's easeOutExpo
cubic-bezier(0.34, 1.56, 0.64, 1) — Penner's easeOutBack
cubic-bezier(0.25, 1, 0.5, 1)     — easeOutQuart
cubic-bezier(0.68, -0.55, 0.27, 1.55) — easeInOutBack
```

If your derivation lands close to any of these, shift it. The shift can be
tiny (0.03 on one axis) and still be functionally identical visually while
not BEING the same curve. That matters for two reasons:
1. Your CSS is your site's fingerprint. Shared fingerprints mean shared
   identity.
2. You are documenting WHY this curve, which forces you to actually derive
   rather than copy.

### Step 5 — Write into Charter.

```
PRIMARY EASING: cubic-bezier(0.28, 0.02, 0.18, 1.02)
  DERIVED FROM:
    — Radii: 4px standard (sharp but not architectural)
    — Palette: near-black, warm whites, one saturated amber accent
    — Typography pairing: humanist grotesque + editorial serif
    — Intent: decisive but considered — not sharp, not bouncy
    — Note: 0.02 final overshoot gives slight warmth without being
      elastic. Shifted from the near-standard (0.3, 0, 0.2, 1) by
      0.02 on each end so this is not the Linear / Vercel curve.
```

---

## DERIVATION 3 — STAGGER RHYTHM

Stagger is how lists, grids, and multi-element reveals cascade.

### Derive from the spacing scale.

Most design systems use one of a few spacing scales. Look at yours:

- **Linear spacing (4, 8, 12, 16, 20, 24, 28...)**: mechanical, predictable.
  Stagger is even: every item gets the same delay between it and the next.
  Example: 40ms constant.

- **Geometric spacing (4, 8, 16, 32, 64, 128)**: each step doubles.
  Stagger can accelerate: items arrive faster as the sequence progresses.
  GSAP can do this with a distribution function.

- **Modular scale / golden-ratio spacing (4, 6, 10, 16, 26, 42...)**:
  organic, tends to arithmetic growth. Stagger can be slightly eased
  (stagger.ease = "power2.out") so later items arrive with a sense of
  settling.

- **8-point grid (8, 16, 24, 32...)** without modular: neutral. Either
  even stagger or slightly eased.

- **Custom / irregular spacing**: match the irregularity. If the design
  uses unusual spacing relationships, the stagger can mirror them.

### Derive stagger base value from tempo.

Your stagger for medium-weight lists is typically `tempo × 0.1` to
`tempo × 0.2`.

- Tempo 428ms → stagger 43–85ms range
- Tempo 650ms → stagger 65–130ms range
- Tempo 220ms → stagger 22–44ms range

Pick a specific value in the range based on content density:

- Dense lists (navigation items, 5+ items): lower end of range
- Sparse lists (3–4 large cards): upper end of range
- Very sparse (2–3 hero items): middle

### Write into Charter.

```
STAGGER RHYTHM:
  Navigation (5-7 items): 45ms constant
  Card grid (6-12 cards): 72ms with stagger.ease "power2.out"
  Words in hero: 38ms constant
  Characters in display: 22ms constant (use sparingly)
  DERIVED FROM:
    — Modular scale in spacing tokens (hints at eased stagger)
    — Primary tempo 428ms (stagger base 43-85ms range)
    — Content density varies by context, values chosen per context
```

---

## DERIVATION 4 — EXIT RATIO

How much faster do things leave than they enter?

Derive from the brand's posture. Look at the copy tone, the color confidence,
the typography weight.

- **Decisive brand** (heavy type, high contrast, short direct copy):
  Exits are much faster. Exit ratio 0.4–0.5. The site doesn't linger.

- **Considered brand** (editorial type, moderate contrast, longer copy):
  Exits are moderately faster. Exit ratio 0.6–0.7. The site holds briefly
  before releasing.

- **Warm brand** (rounded type, muted colors, friendly copy):
  Exits are close to entrance. Exit ratio 0.7–0.8. Nothing is rushed, even
  on the way out.

- **Institutional brand** (restrained everything, formal copy):
  Exits are longer than you'd expect — sometimes 0.7–0.9. Exits that feel
  hurried read as unprofessional in this context.

Avoid 0.5 and 0.7 exactly — they're round. Pick something like 0.58 or 0.64.

### Write into Charter.

```
EXIT RATIO: 0.58
  DERIVED FROM:
    — Copy tone: direct, short sentences, declarative
    — Type: heavy display weight (800) with medium body (400)
    — Palette: high contrast
    — Reasoning: decisive brand leans toward 0.4-0.5, but the editorial
      typography pulls it up toward considered. Landed at 0.58.
```

---

## DERIVATION 5 — MOTION BUDGET

How many things can move at once in a single viewport?

Derive from visual density (layout) and content hierarchy (copy).

### Step 1 — Count visible information per viewport at hero and content-heavy sections.

Use the repo. Open the actual hero component. Count:
- Number of distinct interactive elements
- Number of distinct image / media assets
- Number of distinct text blocks

### Step 2 — Apply the rule.

Motion budget per viewport = roughly `ceil(sqrt(visible information))`.

- 4 elements → budget 2
- 9 elements → budget 3
- 16 elements → budget 4
- 25+ elements → budget 5 (cap)

This is a coarse heuristic, not a law. It produces sensible numbers. Adjust
by brand posture:

- Decisive brands: subtract 1 from the budget (restraint amplifies impact)
- Wonder / experiential brands: add 1 (layered motion is the point)
- Everyone else: use the computed number

### Write into Charter.

```
MOTION BUDGET: 3
  DERIVED FROM:
    — Hero viewport: 8 visible elements (logo, nav 4 items, H1,
      subhead, CTA)
    — sqrt(8) ≈ 2.83, ceil → 3
    — Brand is moderately decisive, no adjustment
    — Ruling: at most 3 elements can animate prominently in any
      viewport at the same time.
```

---

## DERIVATION CHECKLIST

Before writing CHARTER.md, verify:

- [ ] Every number is specific (not round)
- [ ] Every number has a "DERIVED FROM" paragraph citing repo evidence
- [ ] The primary easing has been compared to the common-curve list and
      shifted if it was close
- [ ] The stagger values are derived from tempo, not picked from a table
- [ ] The motion budget is derived from the actual hero component in
      this repo, not from a generic rule
- [ ] You have not used the word "archetype" anywhere
- [ ] You have not used the phrase "industry standard"

If any box is unchecked, redo that derivation.

---

## A NOTE ON HUMILITY

Derivation is not magic. Two derivers might produce different charters for
the same repo. That is FINE. The point is not to find the One True Motion
Language for a brand — there isn't one. The point is to produce a motion
language that is CONNECTED to this specific brand's evidence, so it feels
coherent with the rest of the design work, so it doesn't feel imported from
a trend collection.

Any coherent, derived, evidence-cited motion language will beat any
archetype-picked or preset-imported one. The coherence is what users feel.

---

*When in doubt, open the CSS tokens file and read them slowly. The tempo is
already in the typography. The easing is already in the radii. The stagger
is already in the spacing scale. You are transcribing, not inventing.*
