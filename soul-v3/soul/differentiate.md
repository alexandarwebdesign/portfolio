# differentiate.md
### The Competitor Inspection Protocol

Your site is not built in a vacuum. Users arrive having seen competitor
sites. If your motion language resembles theirs, your site registers as
"another one of those" regardless of its actual quality.

This protocol forces you to inspect real competitors and document specific
divergences. Not "we will feel different" — specific techniques they use
that you will specifically not use, and specific techniques you will use
instead.

---

## STEP 1 — IDENTIFY THREE COMPETITORS

Ask the operator for three competitor URLs. Insist on URLs, not descriptions.
"A typical fintech site" is not a competitor. `revolut.com` is.

If the operator cannot provide three, the protocol is:

```
Operator response: "I don't know competitors."
→ You respond: "I'll find three. Tell me the exact category of the
  client's business in one sentence."
→ You then web_search for that category + "site" or "agency" and propose
  three URLs. Operator confirms or replaces.
```

The three should be:

- **Direct category match** (same industry, same tier of quality)
- **Ideally recent** (launched or meaningfully updated in the last 18 months
  — older sites are not reliable indicators of current saturation)
- **Quality-comparable** (if you're building for a boutique watchmaker,
  don't pick Timex — pick peers)

---

## STEP 2 — INSPECT EACH COMPETITOR

For each of the three, open the site and inspect. You are looking for:

### The motion signature

- What's the hero reveal? (text stagger, image clip-path, scale-from-small,
  fade, 3D scene, video)
- What's the primary easing feel? (sharp, bouncy, editorial, mechanical)
- What's the base tempo? (rough estimate from watching — fast / medium / slow)
- How does scroll work? (native, smoothed with Lenis/Locomotive, scroll-
  hijacked, pinned sections)
- What's their custom cursor situation? (none, dot+ring, labeled, other)
- How do page transitions work? (full-page curtain, view transition, fade,
  none)

### The technical stack (inspect with DevTools)

- Open DevTools → Sources. Look for: `gsap`, `locomotive-scroll`, `lenis`,
  `barba`, `three`, `ogl`, `motion`, `framer-motion`.
- Check the CSS. Search for `cubic-bezier`. Note the specific curves.
- Check Network tab for `.mp3`, `.ogg`, `.wav` — do they have sound?
- Note any unusual libraries.

### The saturation check

For each technique you observe on a competitor, cross-reference with
`/soul/cliches.md`. If the technique is on our cliché list AND the competitor
uses it in its stock form, that's a double signal — the technique is out for
this project.

---

## STEP 3 — DOCUMENT OBSERVATIONS

Create `/soul/COMPETITOR-SCAN.md`. Fill out this template for each competitor:

```markdown
## Competitor 1: [Name]
URL: [url]
Inspected: [date]

### What they do
- Hero: [description]
- Easing signature: [observation]
- Tempo feel: [fast / medium / slow] — rough base ~[XXXms]
- Scroll: [native / Lenis / Locomotive / custom]
- Cursor: [none / dot+ring / labeled / custom]
- Page transitions: [description]
- Sound: [yes / no]

### Stack observed
- Animation libraries: [list]
- Specific cubic-beziers spotted: [list]
- Notable techniques: [list]

### Clichés present (from cliches.md)
- [technique 1]
- [technique 2]

### What's distinctive about them
[1-2 sentences on what actually makes their motion identifiable]
```

Do all three. Yes, it takes time. It's the cheapest insurance against
shipping an indistinguishable site.

---

## STEP 4 — IDENTIFY SHARED TERRITORY

After documenting all three, write a "SHARED MOTION TERRITORY" section —
techniques that appear on 2 or more of the three.

Example:

```
SHARED TERRITORY (present in 2+ competitors):
- Custom cursor (2/3 — dot + ring, standard)
- Grain overlay (2/3)
- Locomotive or Lenis smooth scroll (3/3)
- Word-by-word headline reveal with power4.out (3/3)
- Clip-path image reveals with inner-scale (2/3)
- Magnetic CTA buttons (2/3)
```

This is the territory you cannot enter without losing differentiation. If
you enter it, your site becomes the fourth of four.

---

## STEP 5 — COMMIT TO DIVERGENCES

Now write three divergence commitments in `/soul/CHARTER.md`:

```
DIVERGENCES:

vs [Competitor A]:
  They: [specific technique with parameters]
  We:   [specific alternative we will use instead]
  Why:  [one sentence tying to the Charter or the brand]

vs [Competitor B]:
  They: [specific technique]
  We:   [specific alternative]
  Why:  [reasoning]

vs [Competitor C]:
  They: [specific technique]
  We:   [specific alternative]
  Why:  [reasoning]
```

The divergences MUST be specific. Not "we'll feel calmer" — "they use
power4.out at 400ms for text reveals; we will use our derived ease at
our derived 428ms tempo and reveal by line rather than by word, because
our copy is editorial longform and word-stagger makes it feel like a
pitch deck."

If your divergences read as vibes, redo them. Specific or nothing.

---

## STEP 6 — CHECK YOUR CHARTER FOR CONTAMINATION

Now re-read your Motion Charter from Stage 2. Cross-reference with the
SHARED TERRITORY list. If any of your derived decisions land in shared
territory:

1. Is the overlap unavoidable (e.g., everyone uses `translateY` on reveals
   because it's the correct transform property)? If yes, ignore — this is
   primitive overlap, not cliché overlap.

2. Is the overlap meaningful (e.g., you derived a tempo of 400ms and
   competitors use a power4.out at 400ms)? If yes, shift your derivation.
   Either adjust your tempo (if you have slack in the derivation range) or
   adjust your easing curve. The shift can be small but must be deliberate.

3. Is the overlap a cliché from `/soul/cliches.md`? If yes, remove from
   charter or justify with the process in cliches.md.

Update the Charter accordingly. Note the adjustments so you can trace the
decision later.

---

## ON "INSPIRATION" VS COMPETITOR INSPECTION

The operator may also give you "reference sites the client liked." Treat
these differently from competitors.

- **Competitors** (Step 1) = sites you must differentiate FROM.
- **References** = sites the client is emulating TOWARD.

You want to understand the reference's appeal, not copy it. Ask:

- What specifically does the client like? (if they say "the feel," push
  back — what feel? slow? editorial? sharp?)
- Is the reference in the same category or different? (A fintech loving a
  Japanese design studio's site is fine inspiration but a bad copy target.)
- What in the reference matches this brand's tokens, and what doesn't?

Document references separately in COMPETITOR-SCAN.md under a "REFERENCES"
heading. Call out explicitly which aspects of the reference are compatible
with the Charter and which aren't.

You do not let a reference override a derived Charter. The Charter comes
from this brand's evidence. The reference is a shared language to
communicate with the client, not a template.

---

## OUTPUT

By end of Stage 3, you have:

- `/soul/COMPETITOR-SCAN.md` — documented observations of 3 competitors +
  shared territory + any references
- `/soul/CHARTER.md` updated with three specific divergence commitments
- `/soul/CHARTER.md` updated if derivation contamination was found

You do not proceed to Stage 4 (Signature) until this is done.

---

*If you find yourself doing Stage 3 as a box-check — opening sites,
writing short notes, moving on — you are doing it wrong. Inspect long
enough to feel the site's motion. Your job here is to absorb what the
competitive space sounds like so that your site can sound like something
else.*
