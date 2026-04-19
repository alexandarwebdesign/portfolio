# Master Rules — Alexandar Pavlov Portfolio
**Design System + Animations + Accessibility + SEO + Layout**

---

# 1. DESIGN SYSTEM

## Colors

```css
/* Primary */
--color-background: #F4F9FA;
--color-text: #29303D;
--color-accent: #0066FF;
--color-white: #FFFFFF;

/* Secondary */
--color-border: #C2C9D6;
--color-text-muted: rgba(41, 48, 61, 0.8);
--color-text-light: rgba(41, 48, 61, 0.5);

/* Semantic */
--color-success: #34C759;
--color-error: #FF3B30;
--color-warning: #FF9500;
```

## Typography

### Font Families
```css
--font-display: 'Manrope', sans-serif;
--font-body: 'Manrope', sans-serif;
```

### Font Import
```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Font | Size | Weight | Letter Spacing |
|---------|------|------|--------|----------------|
| Hero Title | Manrope | 80px | 700 | -1.6px |
| Section Title | Manrope | 72px | 700 | -0.72px |
| Service Title | Manrope | 40px | 600 | -0.4px |
| Project Title | Manrope | 28px | 700 | 0 |
| Body Large | Manrope | 24px | 400 | -0.24px |
| Body | Manrope | 20px | 400 | -0.2px |
| Button | Manrope | 24px | 600 | 0.24px |
| Button Small | Manrope | 20px | 600 | 0.2px |

### Text Rules
- Section titles: UPPERCASE
- Service titles: UPPERCASE
- Body text: 80% opacity
- Placeholder text: 50% opacity
- Line height for body: 1.5

## Spacing

```css
/* Base unit: 4px */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;

/* Layout */
--page-width: 1200px;
--content-width: 1072px;
--side-margin: 64px;
--section-gap: 200px;

/* Components */
--card-padding: 32px;
--card-gap: 28px;
--button-padding: 16px 32px;
--input-padding: 20px;
--border-radius: 16px;
--border-radius-button: 13.33px;
```

## Components

### Primary Button
```css
.button-primary {
  background: #0066FF;
  color: white;
  padding: 16px 32px;
  border-radius: 13.33px;
  font-family: 'Manrope', sans-serif;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.24px;
  line-height: 1.5;
  box-shadow: inset 0px 4px 8px rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
}
```

### Project Card
```css
.project-card {
  background: linear-gradient(121deg, rgba(194, 201, 214, 0.1) 0%, rgba(41, 48, 61, 0.1) 100%);
  border: 1px solid #C2C9D6;
  border-radius: 16px;
  padding: 32px;
  overflow: hidden;
}

.project-image {
  width: 100%;
  aspect-ratio: 400 / 284;
  border-radius: 8px;
  object-fit: cover;
}
```

### Form Input
```css
.form-input {
  border: 1px solid rgba(19, 25, 39, 0.5);
  border-radius: 16px;
  padding: 20px;
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
  background: transparent;
  width: 100%;
}
```

### Navigation
```css
.navbar {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 13px 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

---

# 2. ANIMATIONS

## Timing
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
```

## Button Hover
```css
.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 
    inset 0px 4px 8px rgba(255, 255, 255, 0.2),
    0 12px 24px rgba(0, 102, 255, 0.24);
  transition: all 300ms cubic-bezier(0.0, 0, 0.2, 1);
}

.button-primary:active {
  transform: translateY(0);
}
```

## Card Hover
```css
.project-card {
  transition: transform 300ms ease-out, box-shadow 300ms ease-out;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 102, 255, 0.16);
  border-color: #0066FF;
}

.project-card:hover .project-image {
  transform: scale(1.05);
  transition: transform 500ms ease-out;
}
```

## Navigation Link
```css
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 2px;
  background: #0066FF;
  transform: translateX(-50%);
  transition: width 300ms ease-out;
}

.nav-link:hover::after {
  width: 100%;
}
```

## Page Load
```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeSlideUp 500ms ease-out both;
}

/* Stagger children */
.animate-in:nth-child(1) { animation-delay: 100ms; }
.animate-in:nth-child(2) { animation-delay: 200ms; }
.animate-in:nth-child(3) { animation-delay: 300ms; }
```

## Scroll Reveal
```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 500ms ease-out, transform 500ms ease-out;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

## Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# 3. ACCESSIBILITY

## Focus States
```css
*:focus-visible {
  outline: 2px solid #0066FF;
  outline-offset: 4px;
}

.button:focus-visible {
  outline-offset: 6px;
}

input:focus-visible {
  outline: none;
  border-color: #0066FF;
  box-shadow: 0 0 0 4px rgba(0, 102, 255, 0.24);
}
```

## Skip Link
```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px 16px;
  background: #0066FF;
  color: white;
  z-index: 9999;
}
.skip-link:focus {
  top: 0;
}
</style>
```

## Semantic HTML
```html
<header> — Navigation
<main> — Main content (one per page)
<section> — Each major section
<article> — Project cards
<footer> — Footer
<nav> — Navigation menus
<h1> — One per page (hero title)
<h2> — Section titles
<h3> — Card/item titles
```

## ARIA Labels
```html
<nav aria-label="Primary navigation">
<button aria-label="Open menu">
<input aria-required="true" aria-describedby="email-hint">
<a aria-current="page"> — Current page in nav
```

## Form Accessibility
```html
<label for="name">Full Name</label>
<input id="name" name="name" required aria-required="true">

<label for="email">Email</label>
<input id="email" type="email" required aria-required="true">

<button type="submit">Send Message</button>
```

## Screen Reader Only
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

# 4. SEO

## Meta Tags
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Alexandar Pavlov — UX/UI Designer & Framer Developer</title>
<meta name="description" content="UX/UI designer and Framer developer creating beautiful, conversion-focused websites. Based in Bulgaria, working globally.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://yourwebsite.com/">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="Alexandar Pavlov — UX/UI Designer & Framer Developer">
<meta property="og:description" content="Creating beautiful, conversion-focused websites.">
<meta property="og:image" content="https://yourwebsite.com/og-image.jpg">
<meta property="og:url" content="https://yourwebsite.com/">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Alexandar Pavlov — UX/UI Designer & Framer Developer">
<meta name="twitter:description" content="Creating beautiful, conversion-focused websites.">

<!-- Theme -->
<meta name="theme-color" content="#0066FF">
```

## Schema Markup
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Alexandar Pavlov",
  "url": "https://yourwebsite.com",
  "jobTitle": "UX/UI Designer & Framer Developer",
  "sameAs": [
    "https://linkedin.com/in/yourprofile",
    "https://dribbble.com/yourprofile"
  ]
}
</script>
```

## Heading Hierarchy
```
h1 — Hero title (one per page)
  h2 — Section titles (WORK, ABOUT, Services, etc.)
    h3 — Project titles, service titles
```

## Image Optimization
```html
<img 
  src="image.webp" 
  alt="Descriptive alt text"
  width="800" 
  height="600"
  loading="lazy"
>
```

---

# 5. LAYOUT REFERENCE (from Figma)

## Page Structure

```
Page (1200px)
│
├── Navbar (fixed, centered, 803px wide)
│   ├── Logo: "© ALEKSANDAR P."
│   ├── Links: Work, About, Services
│   └── CTA: "Contact Me →"
│
├── Hero Section (800px height, centered)
│   ├── Title: "Design that feels effortless"
│   ├── Subtitle: "From design to live site—all in one place"
│   └── CTA: "Let's Work Together"
│
├── Work Section (1072px content)
│   ├── Header: "WORK" + "(06)"
│   └── Grid: 2 columns × 3 rows
│       └── Project Card ×6
│           ├── Image (400×284 ratio)
│           ├── Title + Arrow
│           └── Category
│
├── About Section (1072px content)
│   ├── Title: "ABOUT"
│   ├── Bio (579px max-width)
│   │   └── "beautiful websites convert" = highlighted in blue
│   └── CTA: "Let's Work Together"
│
├── Services Section (1072px content)
│   ├── Title: "Services"
│   ├── Service ×3 (stacked)
│   │   ├── Title (uppercase)
│   │   └── Description
│   └── CTA: "Let's Work Together"
│
├── Contact Section (split layout)
│   ├── Left Column
│   │   ├── Title: "Let's / Work / Together"
│   │   ├── Subtitle: "Open to freelance & collaborations"
│   │   └── Email link
│   └── Right Column (522px form)
│       ├── Full name input
│       ├── Email input
│       ├── Service dropdown
│       ├── Message textarea
│       ├── Submit button (full width)
│       └── Helper text
│
└── Footer
    ├── Copyright: "© 2026 Alexandar Pavlov • Design & Development"
    └── Nav: Home, Work, Services, About, Contact
```

## Figma Link
```
https://www.figma.com/design/gqKVKGWVU2rh5QUauSMIC2/Untitled?node-id=209-2367
```

---

# 6. QUICK REFERENCE

## Color Tokens
| Token | Value |
|-------|-------|
| Background | #F4F9FA |
| Text | #29303D |
| Accent | #0066FF |
| Border | #C2C9D6 |

## Font Tokens
| Token | Value |
|-------|-------|
| Display | Manrope |
| Body | Manrope |

## Spacing Tokens
| Token | Value |
|-------|-------|
| Page width | 1200px |
| Content width | 1072px |
| Section gap | 200px |
| Card gap | 28px |
| Card padding | 32px |

---

**Version**: 1.0  
**Created**: January 30, 2026
