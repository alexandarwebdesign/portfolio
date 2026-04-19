# SOUL v3 — Quickstart

## Installation

Copy the `soul/` directory into the root of your project.

```
your-project/
├── soul/
│   ├── soul-audit.js
│   ├── derive-motion.md
│   ├── differentiate.md
│   ├── signature.md
│   ├── silences.md
│   ├── sensory.md
│   ├── stack-decision.md
│   └── cliches.md
├── SOUL.md
└── ... (rest of your project)
```

Also place `SOUL.md` at your project root so Claude Code and Antigravity see
it in their initial file scan.

## Using It

When your project is at the polish stage — wireframe done, content in place,
tokens set — open your AI coding tool (Claude Code or Antigravity IDE) and
give it this single instruction:

> "Use SOUL v3 to polish this site's motion. Start at Stage 1. Do not skip
> stages. Do not propose animations until the Charter is written."

The AI will:

1. Run the audit script
2. Read the audit output
3. Open `derive-motion.md` and walk through the five derivations with you
4. Produce a `CHARTER.md` file in `soul/`
5. Open `differentiate.md` and ask for 3 competitor URLs
6. Open `signature.md` and propose candidate signature moments
7. Build the signature first
8. Apply motion stages 5a through 5d
9. Run the cliché scan
10. Verify on reduced motion, keyboard, and performance

At each stage, the AI pauses for your input on the choices that need human
judgment (archetype ambiguity, competitor selection, signature candidates).

## One-line Kickoff (for Claude Code)

```
read SOUL.md and soul/ directory, then run soul/soul-audit.js and begin Stage 1
```

## What You'll End Up With

After the full protocol runs, your repo will have:

```
soul/
├── AUDIT.json              # machine-readable audit output
├── CHARTER.md              # the Motion Charter (the soul of the site)
├── COMPETITOR-SCAN.md      # differentiation notes
├── SIGNATURE-NOTES.md      # signature derivation notes
└── ... (the reference .md files, unchanged)
```

The CHARTER.md is the critical artifact. It documents every motion decision
with its derivation, so future work on the site (by you, a team member, or
a future AI session) inherits the design logic, not just the code.

## Updating SOUL

SOUL is a living framework. Specifically:

- `cliches.md` should be updated as new techniques reach saturation
- `stack-decision.md` should be updated when new tools change the calculus
  (e.g., when a new native browser API makes a library redundant)
- The derivation method in `derive-motion.md` is stable but can be refined
  as you learn what actually works

If you find a technique becoming ubiquitous across sites you browse, open
`cliches.md` and add it. This is how the framework stays sharp.

## When NOT To Use SOUL

- Early wireframe stage — SOUL is a polish protocol, not a design system
- Quick prototypes meant to be thrown away
- Sites with no budget for real motion polish
- Projects where the client specifically wants a template feel

SOUL exists for the 10-20% of polish time that separates a competent site
from a memorable one. If you don't have that time, ship the competent site
and save SOUL for next time.

---

*The soul of a website is in how it moves. Move deliberately.*
