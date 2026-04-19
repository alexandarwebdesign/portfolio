# sensory.md
### The Sensory Stack — Beyond Visual Motion

Motion on screen is one channel. The difference between a polished site
and a premium one is the site that uses two or three channels coherently.

This file covers:

1. Sound design
2. Haptics (mobile)
3. Reduced motion as an alternate choreography
4. Keyboard focus as motion
5. Screen reader synchronization

---

## 1 — SOUND DESIGN

### The hard question: does this site need sound?

Default answer: **no**.

Most sites should not have sound. Sound is bandwidth, it's friction (it
requires a gesture to unlock), it's a maintenance burden, and it's out
of place on most of the web.

Sound earns its place when:

- The brand has a sonic identity (music labels, audio brands, acoustic
  products, media companies with produced sound IP)
- The site includes audio-first content (podcasts, music, film, audio
  books)
- The interaction genuinely benefits from it (a DJ deck, a music
  instrument demo, a sound-design portfolio)
- The brand has decided it wants sound as a signature

If none of the above apply: **no sound**. Move on to haptics.

### If sound is justified

Requirements:

1. **Use Web Audio API, not HTML audio tags.**
   Web Audio has ~20ms latency. HTML `<audio>` has 100-300ms. For
   interaction sounds, only Web Audio is acceptable.

2. **Require a user gesture to initialize.**
   Modern browsers block autoplay. Don't fight them. Initialize the
   AudioContext on the first click or keypress, not on load.

3. **Mute toggle is mandatory.**
   Visible, accessible, remembered (localStorage). Respects system
   settings when possible.

4. **Respect `prefers-reduced-motion`.**
   Yes, sound is motion in this context. Users with vestibular issues
   often want sound muted too.

5. **Size limit.**
   No individual sound file over 50KB compressed. No sound library over
   200KB total. Lazy-load the library (load on first gesture, not at
   init).

### The sonic language

If you have sound, derive the palette from the brand's voice (copy tone,
visual palette, typography). Same derivation logic as motion.

- Sharp-cornered brand (B&W, architectural type) → percussive, clean
  tones (tick, snap, tap)
- Warm brand (muted palette, humanist type) → analog-feeling tones,
  softer attacks
- Mechanical brand (monospace, grid-heavy) → synthetic, clock-like,
  precise
- Organic brand (flowing type, natural palette) → recorded sounds, not
  synthesized

Minimum viable sound library (if you add sound, these are the palette):

```
- Hover (very soft, -30dB, 30-60ms): a whisper before click
- Click: the primary interaction confirmation (50-120ms)
- Success: a distinct positive resolution (150-300ms)
- Error: a distinct negative signal — quiet, not alarming (100-200ms)
- Arrival: page-level transition sound (optional, 200-500ms)
```

All sounds should:
- Match each other in character (same synth, same recording aesthetic)
- Be tuned to a single musical key (if musical)
- Have consistent mix levels (-18 to -30 dB generally)

### Anti-patterns

- ❌ Stock "UI click" sounds from free sound libraries (recognizable,
      generic)
- ❌ Sounds on hover that trigger every time the cursor passes (fatiguing)
- ❌ Sounds that don't match the brand (playful sounds on an Authority
      brand read as wrong)
- ❌ Ambient background music without an obvious mute control
- ❌ Sound on mobile by default (touch interfaces have haptics; sound
      is redundant and disruptive)

### Derive from Charter

Write into `/soul/CHARTER.md`:

```
SOUND:
  Decision: [enabled / disabled]
  If enabled:
    Justification: [why this brand, one sentence]
    Palette: [description of tonal character]
    Files: [list of sound files and their triggers]
    Mute default: [on / off — default should be ON for non-audio brands]
```

---

## 2 — HAPTICS (MOBILE)

Haptics on supported devices (Android, and iOS where Taptic Engine is
accessible via Web APIs — currently limited):

```javascript
if ('vibrate' in navigator) {
  // Primary CTA press
  navigator.vibrate(10);  // 10ms, imperceptible consciously, 
                          // perceptible to the skin
  
  // Error
  navigator.vibrate([20, 40, 20]);
  
  // Success
  navigator.vibrate(25);
}
```

### Rules

- Only on touch — no haptics on hover (there's no hover on touch devices
  that support vibrate)
- Keep pulses under 30ms for feedback (longer reads as alarm)
- Respect `prefers-reduced-motion` — treat haptics as motion
- Allow users to disable via a site-level setting if you use them
  prominently
- Never rely on haptics for critical feedback (must also have visual and
  sometimes aural feedback)

### When to use

- Primary CTAs (purchase, submit, confirm)
- Errors (brief triple-pulse)
- Successful completion of significant actions
- Long-press confirmations

### When not to use

- Every tap (fatiguing)
- Scroll interactions (annoying)
- Hover equivalents (pointless on touch)

### Derive from Charter

Write into `/soul/CHARTER.md`:

```
HAPTICS:
  Decision: [enabled / disabled]
  If enabled:
    Triggers: [list of interactions that haptic]
    Pulse durations: [specific ms values per type]
```

---

## 3 — REDUCED MOTION AS ALTERNATE CHOREOGRAPHY

This is the section that matters most and that every project gets wrong.

### The old way (wrong)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

This is not accessibility. This is surrender. It's a designer saying
"users with vestibular issues get a broken site."

A reduced-motion user still deserves a site that feels like THIS site —
branded, polished, alive. They just can't experience it through spatial
motion (things sliding, scaling, flying in).

### The new way: substitute channels

When `prefers-reduced-motion: reduce` is true, replace spatial motion with
non-spatial transitions. The site continues to feel like itself through:

- **Opacity** (fade in, fade out, fade between states)
- **Color** (shifts, warm-up, cool-down)
- **Typography weight** (variable font `font-weight` animations — the
  word thickens instead of moving)
- **Typography width** (variable font width axis)
- **Blur** (small amounts — large blurs can trigger migraines)
- **Letter-spacing** (tightens/loosens without moving position)
- **Contrast** (a subtle brightness change on hover)

These do not trigger vestibular responses and do not require movement.

### Implementation pattern

For every meaningful motion, design the reduced-motion substitute at the
same time.

```css
/* Default: spatial motion */
.hero-title {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--tempo) var(--ease-primary),
              transform var(--tempo) var(--ease-primary);
}

.hero-title.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Reduced motion: substitute channels */
@media (prefers-reduced-motion: reduce) {
  .hero-title {
    opacity: 0;
    transform: none;
    font-variation-settings: "wght" 400;
    transition: opacity var(--tempo) var(--ease-primary),
                font-variation-settings var(--tempo) var(--ease-primary);
  }
  .hero-title.visible {
    opacity: 1;
    font-variation-settings: "wght" 700;
  }
}
```

```javascript
// GSAP pattern
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  gsap.from(hero, {
    opacity: 0,
    fontVariationSettings: "'wght' 300",
    duration: charter.tempo,
    ease: charter.easing
  });
} else {
  gsap.from(hero, {
    opacity: 0,
    y: 40,
    duration: charter.tempo,
    ease: charter.easing
  });
}
```

### The test

After implementing, toggle `prefers-reduced-motion: reduce` in your
browser dev tools. Scroll through the whole site.

- Does it still feel like this specific site? (If no, you've failed.)
- Are any elements now stuck invisible because their appearance relied
  on motion? (If yes, fix — opacity-only reveals still need to fire.)
- Does the site tell its story without spatial motion? (It should.)
- Is the pacing preserved? (Durations stay the same. Only the properties
  change.)

### Derive from Charter

Add a "REDUCED MOTION" section to `/soul/CHARTER.md`:

```
REDUCED MOTION SUBSTITUTIONS:
  translateY / translateX reveals → opacity + font-weight
  scale reveals → opacity + letter-spacing
  parallax → opacity fade between layers
  elastic/bounce → linear ease at same duration
  cursor-follow effects → disable entirely
  [any project-specific substitutions]
```

---

## 4 — KEYBOARD FOCUS AS MOTION

Keyboard focus is not an accessibility checkbox. It's a design surface.
Users who tab through your site experience a version of the site you
may have never seen.

### Rules

1. **Every focusable element has a visible focus state.**
   Not the browser default (a faint blue outline). Your site's focus
   ring, derived from the Charter.

2. **The focus ring is branded.**
   Color, thickness, offset, animation — all derived. The focus ring
   on an Authority site is thin and restrained. On a Rebellion site,
   it might be thick and overshoot.

3. **Focus state is at least as visible as hover.**
   A user who focused an element deliberately (via keyboard) has
   committed more than a user who hovered by accident. Reward that
   commitment with clarity.

4. **Focus transitions animate.**
   When focus moves from one element to the next, the new focus state
   appears using the Charter's primary easing and a short duration
   (half the primary tempo or less). Not instant.

5. **Focus order is logical.**
   Tab order follows reading order. Skip links exist for large
   navigation blocks.

### Skip links

Every site with any meaningful navigation has a skip link. It's the
first focusable element. It's visually hidden until focused, then it
appears using the Charter's motion language.

```html
<a href="#main" class="skip-link">Skip to main content</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  padding: 8px 16px;
  z-index: 100;
  transition: top var(--tempo-small) var(--ease-primary);
}
.skip-link:focus {
  top: 8px;
}
</style>
```

### Derive from Charter

Write into `/soul/CHARTER.md`:

```
KEYBOARD FOCUS:
  Focus ring: [color, thickness, offset]
  Transition: [duration, easing]
  Skip link: [yes — style description]
  Tab order verified: [yes / no]
```

---

## 5 — SCREEN READER SYNCHRONIZATION

Content that appears via animation must be announced to screen readers at
the right moment — not before it's visible (confusing), not long after
(late).

### Rules

1. **aria-live regions update when content appears, not when animation
   starts.**
   If a reveal takes 600ms, announce at 600ms, not at 0ms.

2. **aria-busy during heavy transitions.**
   For page transitions that change large amounts of DOM, set
   `aria-busy="true"` at start, `aria-busy="false"` when stable.

3. **Don't hide animated content from screen readers.**
   Avoid `aria-hidden="true"` on content that is animated in and then
   becomes part of the reading flow.

4. **Live regions for state changes.**
   Form submission success, error messages, pending state changes — all
   go into an `aria-live="polite"` region.

### Testing

Use a screen reader. VoiceOver (Mac), NVDA (Windows), TalkBack (Android).
Tab through. Listen. If the narration feels disconnected from the visual
story, something is wrong.

### Derive from Charter

Write into `/soul/CHARTER.md`:

```
SCREEN READER:
  Live region pattern: [description]
  Reveal announcements: [timing — sync to visual reveal]
  Tested with: [VoiceOver / NVDA / both]
```

---

## FINAL CHECK

Before proceeding from Stage 5d to Stage 6 (Cliché scan), verify:

- [ ] Sound decision is documented (even if "not needed")
- [ ] Haptic decision is documented
- [ ] Reduced motion has designed substitutions, not just disable-all CSS
- [ ] Reduced motion test has been performed
- [ ] Keyboard focus ring is branded and visible
- [ ] Skip link exists and is tested
- [ ] Screen reader live regions are implemented for dynamic content
- [ ] Screen reader test has been performed

---

*A site that looks great with animation but collapses into a generic
HTML page with reduced-motion has been designed for only some users.
Design for all users. The brand is present in every channel, or it isn't
really a brand.*
