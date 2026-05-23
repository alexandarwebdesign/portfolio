# About Section Spacing Token Alignment

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every hardcoded spacing value in the about section with the correct design token (or add missing tokens to the scale).

**Architecture:** All changes live in `styles.css`. Two missing tokens (`--space-14`, `--space-40`) are added to `:root` to complete the 4px-multiple scale. No HTML changes needed.

**Tech Stack:** Vanilla CSS, design token system (`--space-N` = N×4px).

---

## Violation Inventory

| Location | Property | Raw value | Token to use | Status |
|---|---|---|---|---|
| `.about-section` | `padding-bottom` | `160px` | `var(--space-40)` | needs new token |
| `.about-heading-content` | `gap` | `28px` | `var(--card-gap)` | token exists |
| `.about-body-row` | `gap` | `56px` | `var(--space-14)` | needs new token |
| `.about-bio-new` | `line-height` | `32px` | `var(--space-8)` | token exists |
| `@media 768px .about-section` | `padding-bottom` | `80px` | `var(--space-20)` | token exists |
| `@media 768px .about-heading-row` | `padding` | `48px 0 40px` | `var(--space-12) 0 var(--space-10)` | token exists |
| `@media 768px .about-body-row` | `gap` | `16px` | `var(--space-4)` | token exists |
| `@media 768px .about-cta-row` | `padding-top` | `40px` | `var(--space-10)` | token exists |

**Not changed:** `.about-cta-btn` `padding: 19px 49px` and `line-height: 30px` - intentional per-component visual tuning, not spacing-scale values.

---

## File Map

- Modify: `styles.css:74-86` - add `--space-14` and `--space-40` to `:root` spacing tokens
- Modify: `styles.css:1161-1332` - replace hardcoded values with tokens

---

### Task 1: Add Missing Tokens to Scale

**Files:**
- Modify: `styles.css:74-86` (`:root` spacing block)

The existing scale (4px multiples):

```
--space-12: 48px   (×12)
--space-16: 64px   (×16)
--space-20: 80px   (×20)
--space-24: 96px   (×24)
```

Insert two missing entries to complete the scale:

- `--space-14: 56px` (14×4 = 56) - used by `.about-body-row` gap
- `--space-40: 160px` (40×4 = 160) - used by `.about-section` padding-bottom

- [ ] **Step 1: Add tokens after `--space-12` and after `--space-24`**

In `styles.css`, find the spacing block at ~line 74. Edit:

```css
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-14: 56px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-40: 160px;
```

- [ ] **Step 2: Verify token values**

Open browser devtools → computed styles on any element → confirm `--space-14` resolves to `56px` and `--space-40` resolves to `160px`.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add --space-14 and --space-40 tokens to complete spacing scale"
```

---

### Task 2: Fix Desktop About Section Values

**Files:**
- Modify: `styles.css:1161-1228`

- [ ] **Step 1: Fix `.about-section` padding-bottom**

Find (line ~1162):
```css
.about-section {
  padding-bottom: 160px;
}
```
Change to:
```css
.about-section {
  padding-bottom: var(--space-40);
}
```

- [ ] **Step 2: Fix `.about-heading-content` gap**

Find (line ~1175):
```css
.about-heading-content {
  display: flex;
  align-items: center;
  gap: 28px;
}
```
Change `gap: 28px` to `gap: var(--card-gap)`.

- [ ] **Step 3: Fix `.about-body-row` gap**

Find (line ~1208):
```css
.about-body-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  padding: var(--space-16) 0;
}
```
Change `gap: 56px` to `gap: var(--space-14)`.

- [ ] **Step 4: Fix `.about-bio-new` line-height**

Find (line ~1222):
```css
.about-bio-new {
  font-size: var(--text-body-sm);
  font-weight: 400;
  line-height: 32px;
  letter-spacing: -0.1px;
  color: var(--color-text-soft);
  margin: 0;
}
```
Change `line-height: 32px` to `line-height: var(--space-8)`.

- [ ] **Step 5: Visual check**

Open `index.html` in browser. About section should look identical - values are numerically the same, only references changed.

- [ ] **Step 6: Commit**

```bash
git add styles.css
git commit -m "fix: align about section desktop spacing to design tokens"
```

---

### Task 3: Fix Mobile Media Query Values

**Files:**
- Modify: `styles.css:1306-1332` (`@media (max-width: 768px)` block)

- [ ] **Step 1: Fix all four mobile values**

Find the `@media (max-width: 768px)` block starting ~line 1306. Replace:

```css
@media (max-width: 768px) {
  .about-section {
    padding-bottom: 80px;
  }

  .about-heading-row {
    padding: 48px 0 40px;
  }

  .about-display-title {
    font-size: clamp(48px, 14vw, 148px);
  }

  .about-photo-circle {
    width: 64px;
    height: 64px;
  }

  .about-body-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .about-cta-row {
    padding-top: 40px;
  }
}
```

With:

```css
@media (max-width: 768px) {
  .about-section {
    padding-bottom: var(--space-20);
  }

  .about-heading-row {
    padding: var(--space-12) 0 var(--space-10);
  }

  .about-display-title {
    font-size: clamp(48px, 14vw, 148px);
  }

  .about-photo-circle {
    width: 64px;
    height: 64px;
  }

  .about-body-row {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .about-cta-row {
    padding-top: var(--space-10);
  }
}
```

- [ ] **Step 2: Visual check at 375px**

Resize browser to 375px width. About section layout should be unchanged.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "fix: align about section mobile spacing to design tokens"
```

---

## Self-Review

**Spec coverage:**
- All 8 violations from inventory → covered across Tasks 1–3 ✓
- CTA button intentional values → documented as excluded ✓

**Placeholder scan:** None found.

**Type consistency:** No type mismatches - CSS only, token names consistent with `:root` definitions.
