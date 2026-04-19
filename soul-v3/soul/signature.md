# signature.md
### The Signature Moment Protocol

Every site remembered is remembered for one thing. Not five. One. The rest
of the site is the scaffolding that supports, frames, and paces that one
thing.

This protocol forces you to identify, derive, and build the signature before
you animate anything else.

---

## WHAT A SIGNATURE IS

A signature is a single interactive moment that:

1. Only makes sense for THIS brand — not for any site in the category
2. Uses the brand's actual content (copy, images, data) as the material
3. Rewards attention (users want to trigger it again)
4. Can be described in one sentence to a non-designer
5. Does not require a tutorial

Examples that pass (derived from specific brand content):

- **For a wine importer with a vintage-tracked catalog:**
  "Scrolling through the catalog tilts each bottle image based on its
  producer's latitude — wines from steeper vineyards lean more. The
  metadata is the motion."

- **For a literary magazine with audio recordings of every essay:**
  "Hovering an essay title plays the author's voice reading the first
  sentence. You cannot preview the prose without hearing the author's
  voice first."

- **For a law firm specializing in appellate work:**
  "Case study pages open by revealing the final ruling text first, then
  scrolling BACKWARDS through the arguments that led to it. Time runs
  opposite to a typical case study."

- **For a typeface foundry:**
  "The entire site renders in whichever typeface the user last hovered.
  The type on the about page is the type you last touched on the shop
  page. The interaction is becoming the site's typography."

Examples that fail (menu-picked, technique-first):

- ❌ "A custom cursor that acts as a magnifier over images."
  (works on any site, derived from nothing)

- ❌ "View Transitions API with shared-element morphs between pages."
  (a technique, not a moment)

- ❌ "Scroll-triggered 3D scene of floating geometric shapes."
  (describes the animation's surface, not its meaning)

- ❌ "Cursor-drawn path on an infinite canvas."
  (has been shipped by everyone — a technique looking for a home)

The pattern: passing signatures NAME THE CONTENT. Failing signatures
name the technique. If you describe the signature and the description
doesn't include what the content actually is, the signature is wrong.

---

## STEP 1 — INVENTORY THE CONTENT

Before proposing a signature, read the site's actual content. Open:

- The main copy document (about, services, bio, hero text)
- The project / portfolio / catalog data
- The images and their metadata (alt text, captions, file names)
- Any data files (JSON, CSV, CMS exports)

Answer these questions in writing, in `/soul/SIGNATURE-NOTES.md`:

```
1. What is the most interesting FACT about this brand that isn't obvious
   from the homepage?

2. What data does this brand have that could become interactive?
   (dates, coordinates, counts, categories, prices, durations, colors,
   authors, processes)

3. What does this brand do that could become a verb?
   (a law firm argues; a studio composes; a foundry draws; a winery
   ferments; a surgeon cuts)

4. What is the brand's relationship to TIME?
   (anniversary brand? real-time brand? timeless brand? deadline brand?)

5. What is the brand's relationship to TOUCH?
   (craft brand? hands-off digital brand? tactile product?)
```

These answers are the raw material for your signature. A good signature
emerges from the intersection of two of these answers.

---

## STEP 2 — GENERATE AT LEAST FIVE CANDIDATES

Propose at least five possible signatures. Write each as one sentence,
naming the content.

```
Example output:

CANDIDATE 1: Hovering a project title fades the hero image to a single
representative color sampled from that project's main photograph.

CANDIDATE 2: The homepage grid rearranges itself based on what the user
scrolled past most slowly on previous visits, persisted in localStorage.

CANDIDATE 3: Each case study's hero uses the client's logo as a clip-path
mask over the hero image; the logo IS the frame.

CANDIDATE 4: Typing in the contact form echoes each keystroke into the
background as very faded large typography — your message becomes the
temporary wallpaper.

CANDIDATE 5: Scrolling through the timeline section physically accelerates
time: the further you scroll, the more the background grain and texture
ages, as if the page is weathering.
```

Five is the minimum. Generating many disposable ideas is easier than
finding one good one, and the bad candidates clarify what the good one is.

---

## STEP 3 — EVALUATE EACH AGAINST THE FIVE TESTS

For each candidate, answer:

- **Only this brand?** Could this run on a competitor's site unchanged? If
  yes, it fails.

- **Uses actual content?** Is the signature's material made of this brand's
  real copy, images, or data — or is the content interchangeable?

- **Rewards attention?** Will users want to trigger it again? Will they
  show someone? Will they mention it?

- **One sentence to non-designer?** Could your mom or a client's CFO
  describe it after seeing it once?

- **No tutorial?** Is the interaction discoverable through normal browsing,
  or does it require an instruction?

Eliminate candidates that fail any test. Usually 3-4 of 5 will fail.

---

## STEP 4 — PROTOTYPE THE SURVIVOR

Pick the strongest survivor. Build it in isolation — a standalone component,
a separate page (`/signature` or `/sandbox`), a prototype file.

Do NOT integrate into the production site yet. Build it until:

1. It works technically
2. It feels right subjectively
3. You could demo it to the operator in 30 seconds

If it takes more than one polish stage (two iterations) to feel right, it's
probably the wrong signature. Kill it and try the next candidate. Cheap
failure is good.

---

## STEP 5 — DOCUMENT + INTEGRATE

Once the prototype feels right:

1. Write the signature description into `/soul/CHARTER.md` under
   "SIGNATURE MOMENT"
2. Document the specific files where it lives
3. Integrate into the production site
4. Add tests (or at minimum, a manual QA checklist in the signature's
   file) so future work doesn't accidentally break it

The signature is usually worth a significant portion of the motion budget
(Stage 2, Derivation 5). Allocate accordingly — if your motion budget is
3 concurrent animations per viewport, the signature viewport can spend
all 3 on it.

---

## COMMON FAILURE MODES

### "The signature is the hero."

Often the operator wants the signature to be the hero reveal. That's
usually wrong. The hero reveal is seen once. The signature is interacted
with — it's a durable behavior, not a moment.

Put the signature somewhere the user goes to DO something: the portfolio
index, the case study, the contact form, a specific tool or calculator,
the shopping experience. Reveals are gifts; signatures are toys.

### "The signature is too subtle."

If the signature requires a tooltip, pointer instruction, or explanation
text to be discovered, it is not the signature. It is a hidden easter egg
— fine to have, but users will tell five friends about an obvious
beautiful interaction and zero friends about a hidden one.

### "The signature is too loud."

If the signature shouts so loudly it makes the rest of the site feel
quiet by comparison, you have unbalanced the site. The Charter tempo and
easing still govern the rest of the site's motion. The signature is
distinctive, not dominant.

### "There are two signatures."

You said one. There is one. If the operator pushes for two, push back.
Two signatures means neither gets remembered. Commit to one and suggest
the other could be a future feature.

---

## OUTPUT

By end of Stage 4, you have:

- `/soul/SIGNATURE-NOTES.md` — content inventory + five candidates + tests
- `/soul/CHARTER.md` updated with the chosen signature
- A working prototype of the signature (can be in `/components/signature/`
  or `/app/signature-playground/page.tsx` or similar)
- The signature integrated into the production site

Only after this do you proceed to Stage 5 (general choreography).

---

*A site with no signature is a site that looks professional and is
forgotten. A site with one signature is a site that gets shared. A site
with five "signatures" is a showreel nobody finishes watching.*

*Pick one. Derive it from the content. Build it first. Protect it.*
