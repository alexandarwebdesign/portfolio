# silences.md
### Designing the Moments When Nothing Is Happening

Amateur sites ship the hero and forget the rest. The moments when a site is
waiting, loading, empty, or broken are where most "premium" work falls apart
— and where genuinely good work asserts itself.

This file covers the five silences. All five must be designed before the
site ships.

---

## THE FIVE SILENCES

1. **First paint** — the moment between request and content
2. **Pending** — user has acted, system has not yet responded
3. **Transition** — moving between pages, sections, or states
4. **Empty** — content exists to be shown but there is none yet
5. **Error** — something went wrong

---

## SILENCE 1 — FIRST PAINT

The first 400ms of a visit is the most important design surface you have.
Do not waste it on a spinner. Do not waste it on a "loading..." text.

### The derivation question

Does this site need a visible loading state at all?

Answer through this sequence:

```
Q1: Is the hero content static (just HTML/CSS/images)?
    YES → No loading state needed. Render the hero immediately.
          Stop. Move to Silence 2.
    NO  → continue

Q2: Does the hero require JavaScript hydration, API calls, video load,
    or WebGL init before it's interactive?
    YES → You need a loading state. Continue.
    NO  → No loading state. Stop.

Q3: Will the blocking load take longer than 400ms on a mid-range device
    on a slow 4G connection?
    YES → Design a full loading state.
    NO  → Design a subtle shim only (a brief skeleton or a 200ms delayed
          reveal on the hero).
```

### Designing the loading state

If you need one, derive the loading state from the brand, not from a
spinner library.

The loading state should:

- Include the brand's primary mark/logo in some form (the user should know
  they're in the right place during the wait)
- Match the Charter's tempo and easing
- Have a determinate progress indicator IF the load is measurable
  (use Resource Hints, Performance API, or the actual asset progress)
- Have an indeterminate but brand-appropriate motion IF the load isn't
  measurable (not a spinning circle — something derived)

### Anti-patterns (do not ship these)

- ❌ Generic spinning circle (SVG or emoji-based)
- ❌ "Loading..." text with animated dots
- ❌ Skeleton UI that doesn't match the real layout (causes layout shift)
- ❌ Splash screen that lingers after content is ready (always tie dismiss
      to actual readiness, not to a timeout)
- ❌ Any loading state longer than 1500ms without a progress indicator or
      cancel option

### Progressive enhancement philosophy

Prefer streaming over loading screens. Modern frameworks (Next.js, Astro,
Remix, SvelteKit) stream HTML. Use it. A site that ships the hero text
immediately and animates in the imagery as it loads will always beat a
site that shows a 600ms loader then everything at once.

### Derive from Charter

Your loading state uses:
- Primary tempo (or tempo × 2 for longer, patient loads)
- Primary easing (for any reveal)
- Primary emotion (a Calm brand doesn't pulse; a Decisive brand doesn't
  wait)

Write into `/soul/CHARTER.md` under SILENCES:
```
FIRST PAINT DESIGN: [description]
  Required: [yes / no / subtle]
  Content: [what is shown]
  Motion: [what moves, using which curve/tempo]
  Dismiss trigger: [what event ends the loading state]
```

---

## SILENCE 2 — PENDING

The user has clicked submit. The form is in flight. What does the button
look like right now?

### The rule of immediate acknowledgment

The user's action must have a visible response within 100ms. Not the
server's response — the UI's acknowledgment that the click was received.

```
TIMELINE OF A CLICK:

t=0ms:     User clicks.
t=≤100ms:  UI shows acknowledgment (button state changes, cursor reacts,
           the element moves).
t=100-??:  System processes. This is the pending duration.
t=resolve: UI transitions to success or error state.
```

If t=≤100ms is missing, the user clicks again. Never make the user wonder
if the click registered.

### The three pending state patterns

Choose one per interaction:

**Pattern A — Optimistic UI** (for low-risk actions)

The UI immediately shows the SUCCESS state. If the server fails, roll back
with an error state. Use for: likes, saves, cart updates, toggles, drag-
reorder.

```
User clicks [Like] → button fills with color instantly → API call runs
async → if fails, button unfills + brief error toast.
```

**Pattern B — Explicit pending** (for medium-risk actions)

The UI shows a distinct pending state. Button is disabled (can't be
re-clicked). A subtle motion communicates "working." Success or error
state follows. Use for: form submissions, payments, subscriptions.

```
User clicks [Subscribe] → button becomes disabled with a subtle pulsing
motion or text changes to "Subscribing..." → on success: checkmark
animation + "Subscribed" → on error: shake + inline error message.
```

**Pattern C — Full-state transition** (for high-stakes actions)

The action triggers a distinct UI state change — a modal, a drawer, an
entire screen change. Use for: checkout, deletion confirmations, large
file uploads.

```
User clicks [Delete Account] → confirmation modal opens → on confirm:
loading overlay with progress → on complete: redirect to goodbye page.
```

### Anti-patterns

- ❌ Button becomes a spinner (loses label context)
- ❌ Disabled button with no visual feedback that anything is happening
- ❌ Loading state that uses different motion language than the rest of
      the site (out of character)
- ❌ Success animation that's so exuberant it feels condescending
      ("Yay! You subscribed!" with confetti is almost always wrong)

### Derive from Charter

Pending states:
- Use the Charter's primary easing for all transitions
- Use half the primary tempo for acknowledgment (fast feedback)
- Use the primary tempo for settled success states
- Match the brand's emotional register (a medical brand's success state
  is quiet; a gaming brand's can be louder)

---

## SILENCE 3 — TRANSITION

Between pages. Between sections (if using scroll-pinned sections).
Between states within a single view.

### Prefer View Transitions API (2026+)

Native View Transitions API is supported in most current browsers. It's:
- Faster than library-based page transitions
- Handles shared-element morphing for free
- Not yet a cliché in the portfolio space
- Progressively enhanced (falls back to instant nav)

```javascript
function navigate(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }
  document.startViewTransition(async () => {
    // Fetch + update DOM
  });
}
```

For shared elements across pages:
```css
.hero-image {
  view-transition-name: hero-image;
}
```

### When to use JavaScript page transitions

You need GSAP or similar for page transitions if:
- The transition requires scrubbed scroll or timeline scrubbing
- Shared-element morphing needs to work alongside a complex sequence
- The animation involves multiple independent elements with precise
  timing offsets

Otherwise: native View Transitions.

### Section transitions (within a page)

Most section transitions should use scroll-triggered reveals, not explicit
transitions. Use:

- Native CSS scroll-driven animations (`animation-timeline: view()`) where
  supported
- IntersectionObserver + the Charter's primary easing for fallback
- GSAP ScrollTrigger only if you need scrubbed scroll (animation tied
  to scroll position continuously)

### State transitions within a view

Modals, drawers, tabs, accordions, carousels.

Design these with the Charter. The modal uses the primary tempo and
easing. The drawer enters from the side with the primary easing. Tabs
switch content using a fade + small translate at half the primary tempo.

None of these are where the signature lives. Keep them competent and
invisible.

---

## SILENCE 4 — EMPTY STATES

The page loaded. The data is empty. What now?

This is the most-skipped design surface. Most sites ship:
- "No results found."
- [Generic stock illustration]
- A blank area that implies the app is broken

All of these are failures. Empty states are where the brand gets to
show up when there is nothing else on the page.

### The empty state template

Every empty state must have these four elements. Derive each from the brand.

```
┌─────────────────────────────────────────────┐
│                                             │
│  1. A short explanation                     │
│     Why is this empty? (in the brand's voice) │
│                                             │
│  2. A visual element                        │
│     Something from the brand's visual       │
│     system — NOT a stock illustration       │
│                                             │
│  3. A clear next action                     │
│     What should the user do?                │
│                                             │
│  4. A tone match                            │
│     The empty state sounds like the rest    │
│     of the site                             │
│                                             │
└─────────────────────────────────────────────┘
```

### Where empty states live (make sure you cover all of them)

- Search with no results
- Filtered list with no matches
- User profile with no activity yet
- Cart with no items
- Inbox / notifications with nothing unread
- Dashboard with no data yet (first-time user)
- Comments section with no comments
- Any list / feed / grid that can be empty

### Examples

Good (brand-specific):

> **For a literary magazine, empty search:**
> "We haven't published anything about that. But we have 1,247 other
> essays — here are the three we'd suggest instead:"
> [three curated essay links, using the primary typeface]

Good (brand-specific):

> **For a law firm, empty case history page (first visit):**
> "No cases yet in this view. Filter by [practice area] or see [our
> most recent 10]."
> (Quiet, no illustration, typographic only.)

Bad (generic):

> "No results found. Try a different search."
> [empty folder icon]

### Motion in empty states

Minimal. An empty state is not where motion shines — it's where restraint
shines. If anything moves, it's the one element you want the user to
click next. Everything else is still.

### Derive from Charter

Write into `/soul/CHARTER.md`:

```
EMPTY STATES:
  Pattern: [describe the visual approach for empty states on this site]
  Copy voice: [sample line]
  Visual element: [typographic / iconographic / illustrative / none]
  Motion: [typically minimal — what, if anything, animates?]

  Per context:
    Search empty: [specific design]
    Filtered empty: [specific design]
    First-visit empty: [specific design]
    [other contexts as needed]
```

---

## SILENCE 5 — ERRORS

Error states are brand surfaces. The 404 is a brand surface. The failed
form submission is a brand surface. How a site fails tells the user more
about its quality than how it succeeds.

### The three error tiers

**Tier 1 — Inline errors** (field-level, non-blocking)

A form field is invalid. An email is malformed. A password is too short.

Pattern:
- Subtle color shift on the field (not necessarily red — derive from brand)
- Inline helper text below the field
- No shake, no aggressive motion
- Clear path to fix

**Tier 2 — Block errors** (component-level, blocking that component)

The submission failed. The payment was declined. The upload didn't complete.

Pattern:
- Clear error message in plain language (no error codes unless you also
  explain them)
- Retry button or alternative action
- Brief brand-consistent motion to draw attention (not a shake — a
  purposeful small motion derived from the Charter)
- Preserve all user input so they don't have to re-enter

**Tier 3 — Page-level errors** (404, 500, network offline)

Full-page errors are brand surfaces. These get design attention equal to
the home page.

### 404 design

Every site needs a custom 404. Elements:

1. Clear statement that the page doesn't exist
2. Orientation — where is the user now? (brand mark, navigation)
3. Rescue — where can the user go? (3-5 useful links, not just a link
   to home)
4. Character match — the 404 sounds like the rest of the site

Avoid:
- ❌ A giant "404" in huge type with nothing else (generic)
- ❌ An illustration of a sad robot / broken page / astronaut
- ❌ "Page not found" with no useful next action
- ❌ A redirect back to home after 3 seconds (frustrating, removes
      user agency)

### 500 / server error

Include:
1. Acknowledgment that it's the site's fault, not the user's
2. What to do next (retry, come back, contact)
3. A reference ID if applicable (so support can triage)

### Offline state

If the site works offline at all (PWA, service worker):
- Clear banner that you're offline
- Clear indication of what's still accessible
- Graceful handling of actions that need the network

### Motion in error states

Reserved. Errors should not celebrate themselves. The motion is:
- Brief (half the primary tempo)
- Attention-drawing but not alarming
- Using the Charter's primary easing
- No elastic, bounce, or exaggeration

### Derive from Charter

Write into `/soul/CHARTER.md`:

```
ERROR STATES:
  Tier 1 inline error:
    Visual treatment: [color / typography]
    Motion: [typically none or very small]

  Tier 2 block error:
    Layout: [description]
    Motion: [description]
    Retry affordance: [yes / no / conditional]

  404 page: [one sentence description of the approach]
  500 page: [one sentence description]
  Offline: [handled / not applicable]
```

---

## FINAL CHECK

Before proceeding from Stage 5c to Stage 5d (Sensory), verify:

- [ ] First paint is designed OR explicitly marked as "not needed"
- [ ] Every button that triggers async work has a pending state
- [ ] Page transitions use View Transitions API where possible
- [ ] Every page has an identifiable, branded empty state design
- [ ] 404 exists with brand-consistent design
- [ ] 500 exists (can reuse 404 pattern or have its own)
- [ ] Form validation has a defined pattern
- [ ] Offline handling is specified (even if "not needed")

If any box is unchecked, the silence is not designed. A site shipping with
default browser error messages and generic "No results" text is a site
that ignored its design surface. Go back.

---

*The hero is seen once. The silences are seen every time something
doesn't work. Design accordingly.*
