# SOUL v3
### A Motion Polish Protocol for Production Websites

> For Claude Code and Antigravity IDE. Runs at the polish stage of a project,
> after wireframe and content. Produces motion derived from the actual brand
> evidence in the repo, not from a menu of archetypes.

---

## READ THIS FIRST — THE WHOLE POINT

You are not producing animations. You are producing a **motion language for this
specific brand, derived from evidence already in the repo.** If two sites built
with this framework end up feeling the same, the framework has failed and you
have failed.

You will not use any of these phrases as justifications for a decision:

- "This is a common pattern for [industry]"
- "Award-winning sites typically..."
- "Best practice is..."
- "The standard easing for this is..."

Every motion decision on every project must cite either:

(a) A specific token, component, or piece of copy in this repo
(b) A specific divergence from a specific competitor you have inspected
(c) A specific instruction from the human operator in this session

If you cannot cite one of those three, you are guessing — and guessing is how
AI-generated sites start looking like each other. Stop, run the audit script,
or ask the operator.

---

## PROTOCOL OVERVIEW

Polish runs in seven stages. Do them in order. Do not skip. Do not parallelize
except where noted.

```
Stage 1 — AUDIT         Run the soul-audit script. Read its output.
Stage 2 — DERIVE        Derive motion language from real tokens, not archetypes.
Stage 3 — DIFFERENTIATE Inspect 3 competitors. Decide what you will NOT do.
Stage 4 — SIGNATURE     Choose ONE memorable interaction. Build it first.
Stage 5 — CHOREOGRAPH   Apply motion in order: macro → hover → silences.
Stage 6 — SCAN          Run cliché scan. Remove or justify every flagged item.
Stage 7 — VERIFY        Reduced-motion, keyboard, performance, real device.
```

Each stage has a reference file in `/soul/`. Read the reference file at the
start of its stage. Do not pre-load all references at once — they exist
separately so you engage with them in context.

---

## STAGE 1 — AUDIT

Run the soul-audit script. It inspects the repo and outputs a motion context
report. Do not proceed without running it.

```bash
node soul/soul-audit.js
```

The script reads the actual CSS tokens, typography, color palette, spacing
scale, radii, and framework stack in the repo. It outputs a JSON report and
a human-readable summary. Both are evidence. Both must be cited in your
motion decisions.

If the script cannot find tokens (repo uses inline styles, Tailwind-only, or
non-standard locations), ask the operator where the design tokens live and
extend the script's search paths. Do not proceed with guesses.

---

## STAGE 2 — DERIVE

Open `/soul/derive-motion.md`. Follow its method to convert the audit output
into a motion language for this specific project.

The output of this stage is a **Motion Charter** — a file at
`/soul/CHARTER.md` — that states:

```
PRIMARY TEMPO:    [XXXms]    — derived from: [evidence in repo]
PRIMARY EASING:   [curve]    — derived from: [evidence in repo]
EXIT RATIO:       [0.XX]     — derived from: [reasoning]
STAGGER RHYTHM:   [pattern]  — derived from: [evidence in repo]
ACCENT EASING:    [curve]    — used only for: [specific moments]
MOTION BUDGET:    [N]        — max concurrent animations per viewport

DERIVED FROM:
  Typography: [what the type tells you]
  Color:      [what the palette tells you]
  Spacing:    [what the spacing scale tells you]
  Radii:      [what the corner treatment tells you]
  Tone:       [what the copy voice tells you]

PRIMARY EMOTION: [one word — from operator brief]
BRAND POSTURE:   [one sentence — how does this brand hold itself?]
```

Every number in this charter must be derived, not chosen. If you find yourself
writing "standard" or "industry default" or rounding to a nice number (300ms,
500ms, 800ms), stop and re-derive. The whole point is that your numbers come
from this project's evidence, not from a rounding instinct.

**No archetype tables. No seven dialects. No preset tempos.** The previous
version of this framework had those and they produced seven flavors of
generic. This one derives from evidence.

---

## STAGE 3 — DIFFERENTIATE

Open `/soul/differentiate.md`. Follow its method.

You will fetch 3 direct competitor sites (same industry, same tier) and
inspect their motion. You will document in `/soul/CHARTER.md`:

- Primary easing curves they use (inspect their CSS or infer from behavior)
- Their scroll approach (native, Lenis, Locomotive, GSAP ScrollTrigger)
- Their signature moments
- Their clichés (techniques that appear on 2+ of the 3)

Then write three sentences:

```
vs [Competitor A]: we will [specific divergence]
vs [Competitor B]: we will [specific divergence]
vs [Competitor C]: we will [specific divergence]
```

The divergences must be specific techniques, not vibes. Not "we will feel
more editorial" — "they use power3.out at 400ms; we will use our derived
ease at our derived tempo, which is XXXms."

If you cannot name three competitors, ask the operator. Do not proceed with
"typical industry patterns" as your differentiation target.

---

## STAGE 4 — SIGNATURE

Open `/soul/signature.md`. Follow its method.

Choose ONE memorable interaction that only this site has. Not three. Not five.
One.

The signature is derived from the brand's specific content — its copy, its
imagery, its subject matter — not from a menu of "cool web techniques."

Example of a derived signature (correct):
> "Hovering a case study title fades the hero image to a single representative
> color from that project's palette, using its own brand's accent hue."

Example of a menu-picked signature (wrong):
> "Custom cursor that becomes a magnifier over images."

The first is derived from the specific fact that this site has case studies
with distinct color palettes. The second is a technique that would work on
any site and therefore belongs on none.

Build the signature first, in isolation (as a standalone component or page).
Do not integrate it until it works and feels right. If you build the site's
boilerplate first, the signature will get cut when scope shrinks — every time.

---

## STAGE 5 — CHOREOGRAPH

Now you apply motion. In this order:

### 5a — MACRO (page-level choreography)

- Page load sequence: what moves, when, in what order
- Scroll-triggered section reveals (using charter tempo/easing)
- Page transitions (View Transitions API when possible, GSAP fallback)

### 5b — HOVER + INTERACTION

- Button, link, card hover states — all use charter easing
- Form interactions — focus, validation, submission
- Cursor behavior — default unless signature specifically requires custom

### 5c — SILENCES (read `/soul/silences.md` in full)

- First paint / loading state
- Pending states (action taken, response not yet received)
- Empty states (no data, no results)
- Error states (404, 500, form validation, offline)
- Transitions between states

Most sites ship the first two and botch the last three. These are design
surfaces, not afterthoughts.

### 5d — SENSORY (read `/soul/sensory.md` in full)

- Sound design (if appropriate — most sites should not have sound; decide
  consciously)
- Haptics on mobile (if appropriate)
- Reduced motion — not a disablement, an alternate choreography
- Keyboard focus — designed with same care as hover
- Screen reader sync

---

## STAGE 6 — CLICHÉ SCAN

Open `/soul/cliches.md`. Run the cliché scan protocol against your polished
code.

The scan flags techniques that have become ubiquitous in the Awwwards /
portfolio / premium web space. For every flagged technique in your code:

1. Remove it, OR
2. Justify it in writing — how does THIS specific project need THIS specific
   cliché, and how have you modified it to not read as a cliché?

The cliché list updates. What was cutting edge in 2022 is noise in 2026.
What's new now will be noise in 2028. Treat the cliché file as a living
document and update it when you notice a new technique hitting saturation.

---

## STAGE 7 — VERIFY

Four hard checks. The site is not done until all four pass.

### 7a — Reduced motion

Test with `prefers-reduced-motion: reduce`. Does the site still feel like
this specific site, or does it collapse to a generic HTML page? If generic,
you have not designed reduced motion — you have disabled animation. Go back
to `/soul/sensory.md`.

### 7b — Keyboard

Tab through the site. Every focusable element has a visible, branded focus
state that matches the charter. Skip links work. Focus is never lost to the
body or a hidden element.

### 7c — Performance

Test on a mid-range Android device (or throttled Chrome: CPU 4x slowdown,
Slow 4G). Target: 60fps during animations, INP under 200ms, LCP under 2.5s.
If it doesn't hit these, reduce the animation budget — do not reduce the
standards.

### 7d — The competitor blind test

If you laid screenshots of this site next to screenshots of the three
competitors from Stage 3, with logos and copy hidden, could a designer
identify which is which?

If the answer is "they all look like premium 2026 websites," the signature
is not loud enough and the divergences were cosmetic. Go back to Stage 3
and 4.

---

## ABSOLUTE PROHIBITIONS

These are non-negotiable. The AI will not do these on any project:

1. **Do not import an animation library by default.** Decide per project.
   Read `/soul/stack-decision.md`. A site that does not need GSAP should
   not have GSAP. A site that does not need Lenis should not have Lenis.

2. **Do not add motion that was not specified in the Charter.** If you
   find yourself animating something not covered by Stage 2 or Stage 4,
   either update the Charter (and explain why) or don't animate.

3. **Do not use magic numbers.** Every duration, stagger, and delay in
   your code is a CSS variable or a constant traced to the Charter.
   `gsap.to(el, { duration: 0.6 })` — where did 0.6 come from? If you
   can't answer, it's wrong. `gsap.to(el, { duration: vars.tempoMedium })`
   — and vars.tempoMedium is in the charter.

4. **Do not animate what is on the Must-Not-Move list.** Maintain this list
   in `/soul/CHARTER.md`. You derive it by walking through the site and
   asking, for each significant element: *does motion on this element
   serve the brand, or does it undermine it?*

   Elements where motion typically undermines the brand:
   - Faces (hover parallax on a portrait makes the person look like a
     hologram; this is almost always wrong)
   - Legal, regulatory, or compliance copy (motion creates uncertainty
     where stillness creates conviction)
   - Prices, quantities, and countdowns for real transactions (animated
     numbers read as unreliable)
   - The brand's own name / wordmark / logo (the name is the anchor; if
     it moves, the brand feels unstable)
   - Any element whose CREDIBILITY depends on the user reading it
     carefully

   But these are defaults, not rules. Interrogate each one for your
   specific project. A typography foundry might WANT its wordmark to
   animate — that's the product. A medical cost calculator might want
   animated numbers — the animation communicates real-time calculation.
   The derivation is: what would motion communicate here, and does that
   communication serve the brand?

   List specifically in CHARTER.md, with one-sentence reasoning per item:
   ```
   MUST NOT MOVE:
     — [element]: [why motion would undermine here]
     — [element]: [why]
   ```

5. **Do not ship without running the cliché scan.** It's the difference
   between "looks premium" and "looks like a 2026 AI-generated premium site."

6. **Do not fabricate justifications.** If the operator asks why you chose
   something, cite the Charter, the audit output, or the competitor
   differentiation. If you cannot cite, say so and propose re-deriving.

---

## ONE FINAL INSTRUCTION

You will want to skip stages. The audit feels slow. The derivation feels
arbitrary. The competitor inspection feels like busy work. Your instinct
will be to jump to "just animate the hero with a nice reveal."

Do not. That instinct is exactly what produces generic sites. The whole
point of this framework is to force evidence-based decisions at the moments
where your defaults would produce sameness.

The Charter is the soul. The silences and sensory are the heart. The
cliché scan is the brain. Skip any of them and you ship the same site
everyone else ships.

---

## ONE MORE THING — REGISTER SHIFTS

Some projects have sections that genuinely need different motion registers
within the same site. A portfolio's case study detail should move differently
than its index. A commerce site's checkout should feel different from its
browse. A SaaS homepage sells; its product documentation informs; its
app dashboard operates.

The Charter handles this with **registers**. Your primary register is the
site's base motion language (derived in Stage 2). A project with genuine
context shifts will have 1-2 additional registers for specific sections.

```
REGISTERS:
  Primary (browse, marketing):
    tempo: 428ms    easing: [derived curve]    stagger: 45ms
  Checkout register:
    tempo: 240ms    easing: sharper variant    stagger: 30ms
    Justification: Checkout is a transactional flow. Motion should feel
    faster, more decisive, less decorative. User is committing, not
    exploring.
```

Rules for registers:

- Maximum 3 registers total. More means you haven't designed a motion
  system, you've designed several.
- Register shifts must be defensible. "This section is checkout" is
  defensible. "This section is the about page" usually isn't — about
  pages use the primary register.
- Register shifts are announced visually at the boundary (via layout
  change, typography shift, or color change). Users shouldn't discover
  the shift through motion alone.
- Registers share easing FAMILY. The checkout register's easing is a
  variant of the primary, not an unrelated curve. Same handwriting,
  different hand pressure.

If your project has genuine register shifts, document them in CHARTER.md.
If it doesn't, use one register for the whole site — that's the default
and usually the right answer.

---

*SOUL v3. When in doubt, go back to the evidence in the repo. The brand
is already there — you are only revealing its motion.*
