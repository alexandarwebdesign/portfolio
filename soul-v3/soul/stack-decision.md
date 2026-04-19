# stack-decision.md
### Choosing the Animation Stack Per Project

You will not install an animation library by default. You will decide per
project, based on what the project actually requires.

This file walks you through the decision. Run through it once at the start
of polish, document the result in CHARTER.md, and don't revisit unless
requirements change.

---

## THE DEFAULT: NATIVE CSS

Start from zero. Assume you will use:

- CSS transitions and animations
- CSS `animation-timeline: scroll()` and `animation-timeline: view()` for
  scroll-driven animation (where supported)
- Web Animations API (via `element.animate()`) for imperative control
  from JavaScript
- View Transitions API for page/state transitions
- IntersectionObserver for reveal triggers (fallback when CSS scroll-
  timeline isn't supported)

These cover most sites. If the project can be built with only these
primitives, you don't need a library.

### What native handles well (no library needed)

- Hover states and micro-interactions
- Page-load sequences (stagger via `animation-delay` or JS timeline with
  `element.animate()`)
- Scroll-triggered reveals (IntersectionObserver + CSS, or scroll-timeline)
- Simple page transitions (View Transitions API)
- State machines (CSS classes toggled from JS)
- Most "appearance" and "disappearance" animations

### What native does NOT handle well

You need a library when you have:

- **Scrubbed scroll animations** (animation position tied continuously to
  scroll position — native scroll-timeline does this for simple cases,
  but complex scrubbed timelines with multiple overlapping sequences are
  much easier in GSAP)
- **Complex timeline sequencing** (many elements with precise offsets,
  overlaps, and relative positioning in time)
- **Path morphing** (SVG path-to-path interpolation)
- **Physics-based motion** (springs with mass/damping, not just
  cubic-beziers)
- **Advanced text splitting** with per-character animation (SplitText)
- **Morph transitions** beyond what View Transitions API provides

If none of the above, stay native.

---

## WHEN TO ADD GSAP

Add GSAP + ScrollTrigger if the project needs:

- ScrollTrigger with scrub (continuous scroll-tied animation)
- Complex sequenced timelines (5+ elements with precise overlap math)
- SplitText for advanced per-char / per-word / per-line text animation
  (if your Charter signature requires it)
- Draggable, MorphSVG, or other premium plugins for specific features

**Do not install GSAP to do things CSS can do.** A fade-in on hover does
not require GSAP. A card that scales on enter does not require GSAP.

### GSAP installation pattern

```bash
npm install gsap
```

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

If using in a framework (Next.js, Nuxt, SvelteKit): register plugins
once, in a client-only entry point. Don't register in components that
render server-side.

---

## WHEN TO ADD A SCROLL SMOOTHING LIBRARY

Default: **don't**. Native scroll is:
- Faster
- More accessible
- Matches OS scroll settings
- Works with every device's trackpad/touchscreen conventions
- Doesn't require reinitialization on framework route changes

Add Lenis (preferred over Locomotive in 2026) ONLY if:
- The brand signature genuinely requires scroll smoothing that differs
  from the OS default
- The motion design involves heavy scroll-tied animations where the
  "feel" of the smoothing is the signature
- The operator has specifically requested it and understands the trade-
  offs

**Do not install Locomotive Scroll** in new projects. Lenis is smaller,
more maintained, and has a more modern API. Locomotive is legacy.

If you add Lenis:

```javascript
import Lenis from 'lenis';
const lenis = new Lenis({
  duration: /* derive from charter tempo, not default 1.2 */,
  easing: /* charter primary easing as a function */,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
```

Do NOT use Lenis default values. If Lenis is on your site with default
duration 1.2 and default easing, you have the same scroll feel as 200
other sites. Customize from the Charter.

---

## WHEN TO ADD MOTION ONE / FRAMER MOTION

**Motion One** (`motion.dev`): lightweight Web Animations API wrapper. A
middle ground between native and GSAP. Use if:
- You're already using native Web Animations API and want a nicer syntax
- You need staggers, springs, and timelines but not ScrollTrigger
- You want a smaller bundle than GSAP

**Framer Motion** (`framer.com/motion`): React-specific animation library.
Use if:
- The project is React and you want component-oriented animation syntax
- You need spring physics that feel natural with user gestures (drag,
  swipe, tap)
- The project uses a state-machine pattern (`<AnimatePresence>`, etc.)

For Vue, Svelte, or Angular projects, consider Motion One over Framer
Motion (framework-agnostic).

---

## WHEN TO ADD WEBGL / SHADER LIBRARIES

If your Charter signature requires shader effects:

- **OGL** (`github.com/oframe/ogl`) — lightweight WebGL, ~15KB, preferred
  for custom shader work
- **Three.js** — heavier (~150KB+ depending on features), use if you need
  full 3D scenes with built-in primitives, GLTF loading, lighting, etc.

Rule: if the signature is a shader effect on a 2D surface (distortion,
flowmap, ASCII post-processing), use OGL. If the signature is a 3D scene
with meshes and lights, use Three.js.

These libraries are heavy. Lazy-load them. The WebGL canvas and its
library should load only when the signature comes into view, not on page
load.

---

## WHEN TO ADD STATE MACHINE LIBRARIES

For complex interactions with multiple states (nav menus with open/
closing/disabled, multi-step forms, drawers, modals with async content):

- **XState** — heavyweight, extremely powerful, full state machine and
  statechart implementation. Use when state transitions have significant
  business logic or async coordination.

- **Zag** (`zagjs.com`) — headless UI state machines for common components
  (menu, dialog, combobox, etc.). Use when you want robust interaction
  logic without building it from scratch.

These are not animation libraries — they're interaction libraries that
coordinate with your animation layer. Use when the interaction's state
graph is complex enough that implementing it with ad-hoc booleans would
be error-prone.

---

## DECISION TREE

```
Does the project need any of these?
  - Scrubbed scroll animation
  - 5+ element timeline sequences
  - SVG path morphing
  - Physics-based motion

├─ NO → Stay native. Skip to "FINAL STACK DECISION".
│
└─ YES → Which framework?
         ├─ React: consider Framer Motion
         ├─ Other / framework-agnostic: GSAP
         └─ Lightweight, already using WAAPI: Motion One

Does the project need scroll smoothing (genuinely, as signature)?
├─ NO → Native scroll.
└─ YES → Lenis (NOT Locomotive).

Does the signature involve shaders / WebGL?
├─ NO → Skip.
├─ YES, 2D surface effects → OGL.
└─ YES, 3D scenes → Three.js.

Does the project have complex interaction state?
├─ NO → Plain JS state.
├─ YES, simple component patterns → Zag.
└─ YES, with business logic / async → XState.
```

---

## FINAL STACK DECISION

Write into `/soul/CHARTER.md`:

```
STACK:
  Animation: [native / GSAP / Motion One / Framer Motion]
  Scroll:    [native / Lenis]
  Transitions: [View Transitions API / GSAP / other]
  WebGL:     [none / OGL / Three.js]
  State:     [plain / Zag / XState]
  
  JUSTIFICATION: [one paragraph explaining why each choice over the
                  alternative]
  
  TOTAL BUNDLE ADDED: [estimate the KB added by these choices]
```

Every stack choice is a bundle-size tax. Every tax must be justified. A
site with GSAP + Locomotive + Lenis + Three.js + Framer Motion installed
"just in case" is a site with a 300KB JavaScript tax before you've
written any actual animation code.

---

*The best animation stack is the smallest one that does the job. Native
beats libraries when native suffices. Lenis beats Locomotive. One well-
chosen library beats three generic ones. Decide once, document, build.*
