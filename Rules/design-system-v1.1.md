# Design System
**UX/UI Designer & Framer Developer Portfolio**

---

## 🎨 Color System

### Foundation Colors

#### Primary Palette
```css
--color-white: #FFFFFF;           /* Primary background */
--color-black: #1D1D1F;           /* Primary text (Apple inspired) */
--color-accent: #0066FF;          /* Brand accent - interactions, CTAs */
```

#### Neutral Scale
```css
--neutral-50: #FAFAFC;            /* Subtle background variations */
--neutral-100: #F5F5F7;           /* Card backgrounds, sections */
--neutral-200: #E8E8ED;           /* Borders, dividers */
--neutral-300: #D2D2D7;           /* Disabled states */
--neutral-400: #86868B;           /* Muted text */
--neutral-500: #424245;           /* Secondary text */
--neutral-600: #333336;           /* Tertiary text (navigation) */
--neutral-700: #1D1D1F;           /* Primary text */
```

#### Functional Colors
```css
--color-success: #34C759;         /* Success states */
--color-error: #FF3B30;           /* Error states */
--color-warning: #FF9500;         /* Warning states */
--color-info: #0066CC;            /* Informational links */
```

### Semantic Usage

```css
/* Backgrounds */
--bg-primary: var(--color-white);
--bg-secondary: var(--neutral-100);
--bg-tertiary: var(--neutral-50);
--bg-accent: var(--color-accent);
--bg-overlay: rgba(29, 29, 31, 0.72);

/* Text */
--text-primary: var(--neutral-700);        /* Body text, headings */
--text-secondary: rgba(0, 0, 0, 0.56);     /* Supporting text, captions */
--text-tertiary: var(--neutral-600);       /* Navigation, subtle text */
--text-accent: var(--color-accent);        /* Highlighted text, CTAs */
--text-on-accent: var(--color-white);      /* Text on accent backgrounds */

/* Borders & Dividers */
--border-light: var(--neutral-200);
--border-medium: var(--neutral-300);
--border-accent: var(--color-accent);

/* Interactive States - Updated for #0066FF */
--interactive-hover: rgba(0, 102, 255, 0.12);
--interactive-active: rgba(0, 102, 255, 0.24);
--interactive-disabled: var(--neutral-300);

/* Focus ring - Updated for #0066FF */
--focus-ring: 0 0 0 4px rgba(0, 102, 255, 0.24);
```

### Dark Mode Variables (Future Expansion)
```css
/* Dark mode colors - ready for future implementation */
@media (prefers-color-scheme: dark) {
  :root {
    --color-white: #1D1D1F;
    --color-black: #F5F5F7;
    --bg-primary: #1D1D1F;
    --bg-secondary: #2C2C2E;
    --bg-tertiary: #3A3A3C;
    --text-primary: #F5F5F7;
    --text-secondary: rgba(255, 255, 255, 0.6);
    --border-light: #3A3A3C;
    --border-medium: #48484A;
  }
}
```

---

## ✍️ Typography

### Font Families

```css
--font-display: 'Marcellus', serif;
--font-body: 'Manrope', sans-serif;
```

**Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale (Fibonacci Sequence)

Based on the golden ratio (1.618) for harmonious hierarchy.

```css
/* Display - Marcellus */
--text-display-xl: 89px;      /* 55 × 1.618 */
--text-display-lg: 55px;      /* Fibonacci */
--text-display-md: 34px;      /* Fibonacci */
--text-display-sm: 21px;      /* Fibonacci */

/* Headings - Marcellus */
--text-h1: 55px;              /* Hero sections */
--text-h2: 34px;              /* Section headings */
--text-h3: 21px;              /* Card titles, subsections */
--text-h4: 18px;              /* Small headings */

/* Body - Manrope */
--text-body-xl: 21px;         /* Lead paragraphs, emphasis */
--text-body-lg: 18px;         /* Primary body text */
--text-body-md: 16px;         /* Standard body text */
--text-body-sm: 14px;         /* Secondary text, captions */
--text-body-xs: 12px;         /* Labels, meta info */

/* Specialized */
--text-button-lg: 18px;       /* Primary CTAs */
--text-button-md: 16px;       /* Secondary buttons */
--text-button-sm: 14px;       /* Tertiary buttons */
```

### Typography Specs

#### Display Text (Marcellus)
```css
.display-xl {
  font-family: var(--font-display);
  font-size: var(--text-display-xl);
  line-height: 100%;
  letter-spacing: -2px;
  font-weight: 400;
}

.display-lg {
  font-family: var(--font-display);
  font-size: var(--text-display-lg);
  line-height: 100%;
  letter-spacing: -2px;
  font-weight: 400;
}

.display-md {
  font-family: var(--font-display);
  font-size: var(--text-display-md);
  line-height: 100%;
  letter-spacing: -2px;
  font-weight: 400;
}
```

#### Headings (Marcellus)
```css
.h1 {
  font-family: var(--font-display);
  font-size: var(--text-h1);
  line-height: 100%;
  letter-spacing: -2px;
  font-weight: 400;
}

.h2 {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: 100%;
  letter-spacing: -2px;
  font-weight: 400;
}

.h3 {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: 100%;
  letter-spacing: -2px;
  font-weight: 400;
}

.h4 {
  font-family: var(--font-display);
  font-size: var(--text-h4);
  line-height: 100%;
  letter-spacing: -2px;
  font-weight: 400;
}
```

#### Body Text (Manrope)
```css
.body-xl {
  font-family: var(--font-body);
  font-size: var(--text-body-xl);
  line-height: 150%;
  letter-spacing: 0;
  font-weight: 400;
}

.body-lg {
  font-family: var(--font-body);
  font-size: var(--text-body-lg);
  line-height: 150%;
  letter-spacing: 0;
  font-weight: 400;
}

.body-md {
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  line-height: 150%;
  letter-spacing: 0;
  font-weight: 400;
}

.body-sm {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  line-height: 150%;
  letter-spacing: 0;
  font-weight: 400;
}

.body-xs {
  font-family: var(--font-body);
  font-size: var(--text-body-xs);
  line-height: 150%;
  letter-spacing: 0;
  font-weight: 400;
}
```

#### Button Text (Manrope)
```css
.button-text-lg {
  font-family: var(--font-body);
  font-size: var(--text-button-lg);
  line-height: 100%;
  letter-spacing: 1px;
  font-weight: 600;
  text-transform: uppercase;
}

.button-text-md {
  font-family: var(--font-body);
  font-size: var(--text-button-md);
  line-height: 100%;
  letter-spacing: 1px;
  font-weight: 600;
  text-transform: uppercase;
}

.button-text-sm {
  font-family: var(--font-body);
  font-size: var(--text-button-sm);
  line-height: 100%;
  letter-spacing: 1px;
  font-weight: 600;
  text-transform: uppercase;
}
```

### Font Weights (Manrope)
```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 📐 Spacing System

**Based on 4px baseline grid** for mathematical precision and visual harmony.

### Core Spacing Scale
```css
--space-1: 4px;      /* Micro spacing - tight elements */
--space-2: 8px;      /* XXS - icon margins, compact spacing */
--space-3: 12px;     /* XS - small gaps */
--space-4: 16px;     /* SM - standard element spacing */
--space-5: 20px;     /* MD - comfortable spacing */
--space-6: 24px;     /* LG - section spacing */
--space-8: 32px;     /* XL - component separation */
--space-10: 40px;    /* XXL - large sections */
--space-12: 48px;    /* 3XL - major sections */
--space-16: 64px;    /* 4XL - hero spacing */
--space-20: 80px;    /* 5XL - section breaks */
--space-24: 96px;    /* 6XL - major page sections */
--space-32: 128px;   /* 7XL - dramatic spacing */
--space-40: 160px;   /* 8XL - maximum spacing */
```

### Fibonacci-Based Spacing (Alternative)
For special use cases requiring golden ratio harmony:
```css
--fib-1: 8px;       /* Fibonacci */
--fib-2: 13px;      /* Fibonacci (rounded) */
--fib-3: 21px;      /* Fibonacci */
--fib-4: 34px;      /* Fibonacci */
--fib-5: 55px;      /* Fibonacci */
--fib-6: 89px;      /* Fibonacci */
--fib-7: 144px;     /* Fibonacci */
```

### Semantic Spacing

```css
/* Component Internal Spacing */
--spacing-button-padding-x: var(--space-6);        /* 24px */
--spacing-button-padding-y: var(--space-4);        /* 16px */
--spacing-input-padding-x: var(--space-4);         /* 16px */
--spacing-input-padding-y: var(--space-3);         /* 12px */
--spacing-card-padding: var(--space-6);            /* 24px */
--spacing-section-padding: var(--space-12);        /* 48px */

/* Layout Spacing */
--spacing-container-padding-mobile: var(--space-5);  /* 20px */
--spacing-container-padding-tablet: var(--space-8);  /* 32px */
--spacing-container-padding-desktop: var(--space-12); /* 48px */

/* Vertical Rhythm */
--spacing-text-paragraph: var(--space-4);          /* 16px between paragraphs */
--spacing-text-section: var(--space-8);            /* 32px between sections */
--spacing-component-gap: var(--space-6);           /* 24px between components */
--spacing-section-gap: var(--space-16);            /* 64px between major sections */
--spacing-hero-gap: var(--space-24);               /* 96px for hero sections */

/* Grid & Columns */
--spacing-grid-gap: var(--space-6);                /* 24px */
--spacing-column-gap: var(--space-8);              /* 32px */
```

---

## 🔘 Components

### Buttons

#### Primary Button (Conversion-Focused)
```css
.button-primary {
  /* Typography */
  font-family: var(--font-body);
  font-size: var(--text-button-lg);
  line-height: 100%;
  letter-spacing: 1px;
  font-weight: 600;
  text-transform: uppercase;
  
  /* Spacing */
  padding: var(--space-4) var(--space-8);    /* 16px 32px */
  
  /* Visual - Updated for #0066FF */
  background: var(--color-accent);
  color: var(--color-white);
  border: 2px solid var(--color-accent);
  border-radius: 8px;
  
  /* Interaction */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-primary:hover {
  background: #0052CC;
  border-color: #0052CC;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 102, 255, 0.24);
}

.button-primary:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.16);
}
```

#### Secondary Button
```css
.button-secondary {
  /* Typography */
  font-family: var(--font-body);
  font-size: var(--text-button-md);
  line-height: 100%;
  letter-spacing: 1px;
  font-weight: 600;
  text-transform: uppercase;
  
  /* Spacing */
  padding: var(--space-3) var(--space-6);    /* 12px 24px */
  
  /* Visual */
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--neutral-700);
  border-radius: 8px;
  
  /* Interaction */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-secondary:hover {
  background: var(--neutral-700);
  color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(29, 29, 31, 0.12);
}
```

#### Ghost Button
```css
.button-ghost {
  /* Typography */
  font-family: var(--font-body);
  font-size: var(--text-button-sm);
  line-height: 100%;
  letter-spacing: 1px;
  font-weight: 600;
  text-transform: uppercase;
  
  /* Spacing */
  padding: var(--space-2) var(--space-4);    /* 8px 16px */
  
  /* Visual */
  background: transparent;
  color: var(--text-primary);
  border: none;
  
  /* Interaction */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.button-ghost::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-accent);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-ghost:hover::after {
  width: 100%;
}
```

### Cards

#### Project Card (Portfolio)
```css
.card-project {
  /* Layout */
  padding: var(--space-6);               /* 24px */
  
  /* Visual */
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  
  /* Interaction */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.card-project:hover {
  border-color: var(--color-accent);
  box-shadow: 0 16px 48px rgba(0, 102, 255, 0.16);
  transform: translateY(-4px);
}

.card-project-image {
  margin-bottom: var(--space-5);         /* 20px */
  border-radius: 8px;
  overflow: hidden;
}

.card-project-title {
  margin-bottom: var(--space-2);         /* 8px */
}

.card-project-description {
  margin-bottom: var(--space-4);         /* 16px */
}
```

#### Service Card
```css
.card-service {
  /* Layout */
  padding: var(--space-8);               /* 32px */
  text-align: center;
  
  /* Visual */
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid transparent;
  
  /* Interaction */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-service:hover {
  background: var(--bg-primary);
  border-color: var(--border-light);
  transform: scale(1.02);
}

.card-service-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-5);         /* 20px bottom */
  color: var(--color-accent);
}
```

### Forms

#### Input Field
```css
.input {
  /* Typography */
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  line-height: 150%;
  letter-spacing: 0;
  
  /* Spacing */
  padding: var(--space-3) var(--space-4);  /* 12px 16px */
  
  /* Visual */
  background: var(--bg-primary);
  border: 2px solid var(--border-light);
  border-radius: 8px;
  color: var(--text-primary);
  
  /* Interaction */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(0, 102, 255, 0.12);
}

.input::placeholder {
  color: var(--text-secondary);
}
```

#### Textarea
```css
.textarea {
  /* Typography */
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  line-height: 150%;
  letter-spacing: 0;
  
  /* Spacing */
  padding: var(--space-4);               /* 16px */
  min-height: 120px;
  
  /* Visual */
  background: var(--bg-primary);
  border: 2px solid var(--border-light);
  border-radius: 8px;
  color: var(--text-primary);
  resize: vertical;
  
  /* Interaction */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(0, 102, 255, 0.12);
}
```

---

## 🎯 Layout

### Container
```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-left: var(--spacing-container-padding-mobile);
  padding-right: var(--spacing-container-padding-mobile);
}

@media (min-width: 768px) {
  .container {
    padding-left: var(--spacing-container-padding-tablet);
    padding-right: var(--spacing-container-padding-tablet);
  }
}

@media (min-width: 1024px) {
  .container {
    padding-left: var(--spacing-container-padding-desktop);
    padding-right: var(--spacing-container-padding-desktop);
  }
}
```

### Grid System
```css
.grid {
  display: grid;
  gap: var(--spacing-grid-gap);
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Responsive */
@media (max-width: 1023px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 767px) {
  .grid-2,
  .grid-3,
  .grid-4 { grid-template-columns: 1fr; }
}
```

### Section Spacing
```css
.section {
  padding-top: var(--spacing-section-gap);     /* 64px */
  padding-bottom: var(--spacing-section-gap);  /* 64px */
}

.section-hero {
  padding-top: var(--spacing-hero-gap);        /* 96px */
  padding-bottom: var(--spacing-hero-gap);     /* 96px */
}

.section-tight {
  padding-top: var(--space-12);                /* 48px */
  padding-bottom: var(--space-12);             /* 48px */
}

@media (max-width: 767px) {
  .section {
    padding-top: var(--space-12);              /* 48px */
    padding-bottom: var(--space-12);           /* 48px */
  }
  
  .section-hero {
    padding-top: var(--space-16);              /* 64px */
    padding-bottom: var(--space-16);           /* 64px */
  }
}
```

---

## 🎭 Shadows & Elevation

```css
/* Elevation System */
--shadow-xs: 0 1px 2px rgba(29, 29, 31, 0.04);
--shadow-sm: 0 2px 8px rgba(29, 29, 31, 0.08);
--shadow-md: 0 8px 16px rgba(29, 29, 31, 0.12);
--shadow-lg: 0 16px 32px rgba(29, 29, 31, 0.16);
--shadow-xl: 0 24px 48px rgba(29, 29, 31, 0.20);

/* Accent Shadows (for interactive elements) - Updated for #0066FF */
--shadow-accent-sm: 0 4px 12px rgba(0, 102, 255, 0.16);
--shadow-accent-md: 0 8px 24px rgba(0, 102, 255, 0.24);
--shadow-accent-lg: 0 16px 48px rgba(0, 102, 255, 0.32);
```

---

## 🔄 Animations & Transitions

### Timing Functions
```css
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-decelerate: cubic-bezier(0.0, 0, 0.2, 1);
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
--ease-smooth: cubic-bezier(0.4, 0, 0.6, 1);
```

### Duration
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

### Common Transitions
```css
.transition-all {
  transition: all var(--duration-normal) var(--ease-standard);
}

.transition-colors {
  transition: background-color var(--duration-normal) var(--ease-standard),
              border-color var(--duration-normal) var(--ease-standard),
              color var(--duration-normal) var(--ease-standard);
}

.transition-transform {
  transition: transform var(--duration-normal) var(--ease-standard);
}
```

---

## 📱 Breakpoints

```css
/* Mobile First Approach */
--breakpoint-xs: 375px;    /* Small mobile */
--breakpoint-sm: 640px;    /* Large mobile */
--breakpoint-md: 768px;    /* Tablet */
--breakpoint-lg: 1024px;   /* Desktop */
--breakpoint-xl: 1280px;   /* Large desktop */
--breakpoint-2xl: 1536px;  /* Extra large desktop */
```

### Media Query Mixins (for reference)
```css
/* Mobile: default styles */

@media (min-width: 640px) {
  /* Large mobile */
}

@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Large desktop */
}
```

---

## 🎨 Border Radius

```css
--radius-xs: 4px;
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;
```

---

## 📋 Z-Index Scale

```css
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

---

## ♿ Accessibility

### Focus States
```css
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}
```

### Screen Reader Only
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
  border-width: 0;
}
```

---

## 📱 Responsive Design System

### Philosophy: Intentional Simplification Across Devices

**Core Principle**: The design should feel native to each device, not just "shrunk down" or "stretched out". Every breakpoint is a design opportunity, not a compromise.

---

### Breakpoint Strategy

```css
/* Mobile First - Progressive Enhancement */

/* Mobile Phones (Base) */
/* 320px - 639px */
/* Default styles go here */

/* Large Mobile / Phablets */
@media (min-width: 640px) {
  /* Enhanced mobile experience */
}

/* Tablets Portrait */
@media (min-width: 768px) {
  /* Tablet-optimized layouts */
}

/* Tablets Landscape / Small Desktop */
@media (min-width: 1024px) {
  /* Desktop layouts begin */
}

/* Desktop */
@media (min-width: 1280px) {
  /* Optimal desktop experience */
}

/* Large Desktop */
@media (min-width: 1536px) {
  /* Spacious layouts */
}

/* Ultra-Wide / 4K */
@media (min-width: 1920px) {
  /* Premium large-screen experience */
}

/* 4K+ Displays */
@media (min-width: 2560px) {
  /* Maximum width constraints + scale */
}
```

---

### Mobile Design (320px - 767px)

#### Typography Scale - Mobile
```css
/* Mobile prioritizes readability and touch-friendliness */

/* Display - Reduced for mobile screens */
.display-xl { font-size: 48px; }  /* Hero headlines (reduced from 89px) */
.display-lg { font-size: 34px; }  /* Major sections (reduced from 55px) */
.display-md { font-size: 24px; }  /* Subsections (reduced from 34px) */

/* Headings */
.h1 { font-size: 34px; }          /* Page titles (reduced from 55px) */
.h2 { font-size: 24px; }          /* Section headings (reduced from 34px) */
.h3 { font-size: 18px; }          /* Card titles (reduced from 21px) */
.h4 { font-size: 16px; }          /* Small headings (reduced from 18px) */

/* Body - Optimized for mobile reading */
.body-xl { font-size: 18px; }     /* Lead text (reduced from 21px) */
.body-lg { font-size: 16px; }     /* Primary body (reduced from 18px) */
.body-md { font-size: 16px; }     /* Standard body (same) */
.body-sm { font-size: 14px; }     /* Secondary text (same) */
.body-xs { font-size: 12px; }     /* Labels (same) */

/* Buttons - Touch-optimized */
.button-text-lg { font-size: 16px; } /* Primary CTAs (reduced from 18px) */
.button-text-md { font-size: 14px; } /* Secondary (reduced from 16px) */
.button-text-sm { font-size: 13px; } /* Tertiary (reduced from 14px) */
```

#### Mobile Spacing
```css
/* Tighter spacing for smaller screens while maintaining hierarchy */

/* Container padding */
.container {
  padding-left: var(--space-5);   /* 20px */
  padding-right: var(--space-5);  /* 20px */
}

/* Section spacing - Reduced but proportional */
.section {
  padding-top: var(--space-12);    /* 48px (reduced from 64px) */
  padding-bottom: var(--space-12); /* 48px */
}

.section-hero {
  padding-top: var(--space-16);    /* 64px (reduced from 96px) */
  padding-bottom: var(--space-16); /* 64px */
}

/* Component spacing */
--spacing-component-gap-mobile: var(--space-5);  /* 20px (reduced from 24px) */
--spacing-section-gap-mobile: var(--space-12);   /* 48px (reduced from 64px) */

/* Card padding */
.card-project {
  padding: var(--space-5);  /* 20px (reduced from 24px) */
}

.card-service {
  padding: var(--space-6);  /* 24px (reduced from 32px) */
}
```

#### Mobile Touch Targets
```css
/* WCAG 2.1 Compliance - Minimum 44x44px touch targets */

.button-primary,
.button-secondary {
  min-height: 48px;              /* Comfortable touch target */
  padding: var(--space-4) var(--space-6);  /* 16px 24px */
}

.button-ghost {
  min-height: 44px;
  padding: var(--space-3) var(--space-4);  /* 12px 16px */
}

/* Navigation items */
.nav-link {
  min-height: 48px;
  padding: var(--space-4);       /* 16px vertical touch area */
}

/* Form inputs */
.input,
.textarea {
  min-height: 48px;
  padding: var(--space-3) var(--space-4);  /* 12px 16px */
  font-size: 16px;               /* Prevents iOS zoom on focus */
}
```

#### Mobile Layout Patterns
```css
/* Stack everything vertically on mobile */

.grid-2,
.grid-3,
.grid-4 {
  grid-template-columns: 1fr;    /* Single column */
  gap: var(--space-5);           /* 20px */
}

/* Mobile navigation - Hamburger menu */
.nav-desktop {
  display: none;
}

.nav-mobile {
  display: flex;
}

/* Full-width cards on mobile */
.card {
  width: 100%;
  margin-bottom: var(--space-5);
}

/* Hero content - Centered, stacked */
.hero {
  text-align: center;
  flex-direction: column;
  gap: var(--space-6);           /* 24px */
}
```

#### Mobile-Specific UX Rules
```css
/* Reduce motion for performance and battery */
@media (max-width: 767px) {
  * {
    animation-duration: 0.2s !important;
    transition-duration: 0.2s !important;
  }
  
  /* Disable parallax on mobile */
  .parallax {
    transform: none !important;
  }
  
  /* Simplify hover states to tap states */
  .button:active {
    transform: scale(0.98);
  }
}

/* Hide non-essential content on mobile */
.mobile-hidden {
  display: none;
}

/* Optimize images for mobile */
@media (max-width: 767px) {
  img {
    max-width: 100%;
    height: auto;
  }
}
```

---

### Tablet Design (768px - 1023px)

#### Typography Scale - Tablet
```css
/* Tablet - Intermediate sizing */

.display-xl { font-size: 68px; }  /* Between mobile and desktop */
.display-lg { font-size: 44px; }
.display-md { font-size: 28px; }

.h1 { font-size: 44px; }
.h2 { font-size: 28px; }
.h3 { font-size: 20px; }
.h4 { font-size: 17px; }

.body-xl { font-size: 20px; }
.body-lg { font-size: 17px; }
.body-md { font-size: 16px; }
```

#### Tablet Spacing
```css
@media (min-width: 768px) {
  .container {
    padding-left: var(--space-8);   /* 32px */
    padding-right: var(--space-8);  /* 32px */
  }
  
  .section {
    padding-top: var(--space-16);    /* 64px */
    padding-bottom: var(--space-16); /* 64px */
  }
  
  .section-hero {
    padding-top: var(--space-20);    /* 80px */
    padding-bottom: var(--space-20); /* 80px */
  }
}
```

#### Tablet Layout
```css
@media (min-width: 768px) {
  /* 2-column grids for better use of space */
  .grid-3,
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);  /* 24px */
  }
  
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Hero can be side-by-side on tablet landscape */
  .hero {
    flex-direction: row;
    text-align: left;
    gap: var(--space-8);  /* 32px */
  }
}
```

---

### Desktop Design (1024px - 1919px)

#### Typography Scale - Desktop
```css
/* Desktop - Full scale as designed */

@media (min-width: 1024px) {
  .display-xl { font-size: 89px; }  /* Full size */
  .display-lg { font-size: 55px; }
  .display-md { font-size: 34px; }
  
  .h1 { font-size: 55px; }
  .h2 { font-size: 34px; }
  .h3 { font-size: 21px; }
  .h4 { font-size: 18px; }
  
  .body-xl { font-size: 21px; }
  .body-lg { font-size: 18px; }
  .body-md { font-size: 16px; }
  
  .button-text-lg { font-size: 18px; }
  .button-text-md { font-size: 16px; }
}
```

#### Desktop Spacing
```css
@media (min-width: 1024px) {
  .container {
    padding-left: var(--space-12);   /* 48px */
    padding-right: var(--space-12);  /* 48px */
    max-width: 1280px;               /* Optimal reading width */
  }
  
  .section {
    padding-top: var(--space-16);     /* 64px */
    padding-bottom: var(--space-16);  /* 64px */
  }
  
  .section-hero {
    padding-top: var(--space-24);     /* 96px */
    padding-bottom: var(--space-24);  /* 96px */
  }
}
```

#### Desktop Layout
```css
@media (min-width: 1024px) {
  /* Full grid layouts */
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }
  
  /* Desktop navigation - Horizontal */
  .nav-mobile {
    display: none;
  }
  
  .nav-desktop {
    display: flex;
    gap: var(--space-8);  /* 32px between nav items */
  }
  
  /* Hero layouts - Asymmetric for visual interest */
  .hero {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;  /* Golden ratio inspired */
    gap: var(--space-12);  /* 48px */
  }
}
```

#### Desktop Hover States
```css
@media (min-width: 1024px) {
  /* Rich hover interactions for mouse users */
  
  .button-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 102, 255, 0.24);
  }
  
  .card-project:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 102, 255, 0.16);
  }
  
  .nav-link:hover {
    color: var(--color-accent);
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--color-accent);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .nav-link:hover::after {
    width: 100%;
  }
}
```

---

### Large Desktop (1536px - 1919px)

#### Spacing Strategy
```css
@media (min-width: 1536px) {
  .container {
    max-width: 1440px;               /* Wider content area */
    padding-left: var(--space-16);   /* 64px */
    padding-right: var(--space-16);  /* 64px */
  }
  
  .section {
    padding-top: var(--space-20);     /* 80px */
    padding-bottom: var(--space-20);  /* 80px */
  }
  
  .section-hero {
    padding-top: var(--space-32);     /* 128px */
    padding-bottom: var(--space-32);  /* 128px */
  }
  
  /* Larger gaps for spacious feel */
  .grid {
    gap: var(--space-8);  /* 32px */
  }
}
```

---

### Ultra-Wide / 4K Displays (1920px - 2559px)

#### The Maximum Width Strategy

**Problem**: Content stretched across 1920px+ becomes unreadable and loses focus.

**Solution**: Constrain content width, increase white space, scale strategically.

```css
@media (min-width: 1920px) {
  /* CONSTRAIN content for readability */
  .container {
    max-width: 1600px;                /* Maximum readable width */
    padding-left: var(--space-20);    /* 80px */
    padding-right: var(--space-20);   /* 80px */
  }
  
  /* Hero section can breathe with asymmetric white space */
  .section-hero {
    padding-top: var(--space-40);      /* 160px */
    padding-bottom: var(--space-40);   /* 160px */
  }
  
  /* Generous section spacing */
  .section {
    padding-top: var(--space-24);      /* 96px */
    padding-bottom: var(--space-24);   /* 96px */
  }
  
  /* Grid spacing increases for breathing room */
  .grid {
    gap: var(--space-10);  /* 40px */
  }
  
  /* Images can be larger but maintain aspect ratio */
  .project-image {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

#### Typography - Ultra-Wide
```css
@media (min-width: 1920px) {
  /* Slight scale increase for larger displays */
  .display-xl { font-size: 96px; }   /* +7px from base */
  .display-lg { font-size: 60px; }   /* +5px */
  .display-md { font-size: 36px; }   /* +2px */
  
  .h1 { font-size: 60px; }           /* +5px */
  .h2 { font-size: 36px; }           /* +2px */
  .h3 { font-size: 22px; }           /* +1px */
  
  /* Body text can remain the same or slightly larger */
  .body-xl { font-size: 22px; }      /* +1px */
  .body-lg { font-size: 19px; }      /* +1px */
  .body-md { font-size: 17px; }      /* +1px for comfort */
}
```

---

### 4K+ Displays (2560px+)

#### Extreme Constraint + Scale Strategy

```css
@media (min-width: 2560px) {
  /* HARD LIMIT on content width */
  .container {
    max-width: 1800px;                 /* Absolute maximum */
    padding-left: var(--space-24);     /* 96px */
    padding-right: var(--space-24);    /* 96px */
  }
  
  /* Center everything with massive white space */
  body {
    background: var(--bg-secondary);   /* Subtle background */
  }
  
  main {
    background: var(--bg-primary);
    max-width: 2400px;
    margin: 0 auto;
    box-shadow: 0 0 100px rgba(29, 29, 31, 0.08);
  }
  
  /* Hero gets dramatic spacing */
  .section-hero {
    padding-top: 200px;
    padding-bottom: 200px;
  }
  
  /* Optional: Scale UI by 1.1x for better visibility */
  html {
    font-size: 110%;  /* Everything scales proportionally */
  }
}
```

#### 4K Grid Strategy
```css
@media (min-width: 2560px) {
  /* Can show more columns OR larger cards */
  
  /* Option 1: More columns */
  .grid-4 {
    grid-template-columns: repeat(5, 1fr);  /* 5 columns */
  }
  
  /* Option 2: Larger cards with more space (RECOMMENDED) */
  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-12);  /* 48px */
  }
  
  .card {
    padding: var(--space-10);  /* 40px */
  }
}
```

---

### Responsive Images - Complete Strategy

```html
<!-- Mobile-first responsive images -->
<picture>
  <!-- 4K+ Displays -->
  <source 
    media="(min-width: 2560px)" 
    srcset="image-4k.webp 2x, image-4k.webp 1x"
    type="image/webp"
  >
  
  <!-- Ultra-wide 1920px+ -->
  <source 
    media="(min-width: 1920px)" 
    srcset="image-ultrawide.webp"
    type="image/webp"
  >
  
  <!-- Desktop 1024px+ -->
  <source 
    media="(min-width: 1024px)" 
    srcset="image-desktop.webp"
    type="image/webp"
  >
  
  <!-- Tablet 768px+ -->
  <source 
    media="(min-width: 768px)" 
    srcset="image-tablet.webp"
    type="image/webp"
  >
  
  <!-- Mobile (default) -->
  <source 
    srcset="image-mobile.webp"
    type="image/webp"
  >
  
  <!-- Fallback -->
  <img 
    src="image-desktop.jpg" 
    alt="Descriptive alt text"
    width="1200"
    height="800"
    loading="lazy"
  >
</picture>
```

---

### Responsive Navigation Pattern

```css
/* Mobile - Hamburger Menu */
@media (max-width: 1023px) {
  .nav-primary {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh;
    background: var(--bg-primary);
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: var(--space-20) var(--space-5);
    z-index: var(--z-modal);
  }
  
  .nav-primary.is-open {
    right: 0;
  }
  
  .nav-list {
    flex-direction: column;
    gap: var(--space-6);  /* 24px */
  }
  
  .nav-link {
    font-size: 24px;
    padding: var(--space-4) 0;
  }
  
  .hamburger {
    display: block;
  }
}

/* Desktop - Horizontal Nav */
@media (min-width: 1024px) {
  .nav-primary {
    position: static;
    width: auto;
    height: auto;
    padding: 0;
    background: transparent;
  }
  
  .nav-list {
    flex-direction: row;
    gap: var(--space-8);  /* 32px */
  }
  
  .nav-link {
    font-size: 16px;
    padding: var(--space-2) var(--space-4);
  }
  
  .hamburger {
    display: none;
  }
}
```

---

### Component Responsiveness

#### Responsive Cards
```css
/* Mobile - Full width, stacked */
@media (max-width: 767px) {
  .card-project {
    width: 100%;
    padding: var(--space-5);
  }
  
  .card-project-image {
    margin-bottom: var(--space-4);
  }
}

/* Tablet - 2 columns */
@media (min-width: 768px) and (max-width: 1023px) {
  .card-project {
    padding: var(--space-6);
  }
}

/* Desktop - 3-4 columns */
@media (min-width: 1024px) {
  .card-project {
    padding: var(--space-6);
  }
  
  .card-project-image {
    margin-bottom: var(--space-5);
  }
}
```

#### Responsive Forms
```css
/* Mobile - Stacked fields */
@media (max-width: 767px) {
  .form-row {
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .form-field {
    width: 100%;
  }
}

/* Desktop - Side by side where appropriate */
@media (min-width: 768px) {
  .form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
  
  .form-field-full {
    grid-column: 1 / -1;
  }
}
```

---

### Fluid Typography (Advanced)

#### Clamp-based Fluid Scaling
```css
/* Automatically scales between mobile and desktop */

.display-xl {
  font-size: clamp(48px, 8vw, 89px);
  /* Min: 48px, Preferred: 8% viewport, Max: 89px */
}

.display-lg {
  font-size: clamp(34px, 5vw, 55px);
}

.h1 {
  font-size: clamp(34px, 4.5vw, 55px);
}

.h2 {
  font-size: clamp(24px, 3vw, 34px);
}

.h3 {
  font-size: clamp(18px, 2vw, 21px);
}

.body-lg {
  font-size: clamp(16px, 1.5vw, 18px);
}

.body-md {
  font-size: clamp(15px, 1.2vw, 16px);
}
```

---

### Performance Optimization by Device

```css
/* Reduce animations on mobile for performance */
@media (max-width: 767px) {
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
  
  /* Simplify effects */
  .card:hover {
    transform: none;
    box-shadow: 0 4px 8px rgba(29, 29, 31, 0.08);
  }
}

/* Full effects on desktop */
@media (min-width: 1024px) {
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 102, 255, 0.16);
  }
  
  /* Parallax effects only on desktop */
  .parallax {
    transform: translateY(var(--scroll-offset));
  }
}
```

---

### Testing Checklist

#### Mobile Testing (Required Devices/Sizes)
- [ ] iPhone SE (375px) - Smallest modern mobile
- [ ] iPhone 12/13/14 (390px) - Common size
- [ ] iPhone 14 Pro Max (430px) - Large mobile
- [ ] Samsung Galaxy S21 (360px) - Android
- [ ] iPad Mini (768px) - Small tablet

#### Desktop Testing
- [ ] 1024px - Minimum desktop
- [ ] 1280px - Standard laptop
- [ ] 1440px - Large laptop / small desktop
- [ ] 1920px - Full HD monitor
- [ ] 2560px - 2K monitor
- [ ] 3840px - 4K monitor

#### Cross-Browser Testing
- [ ] Chrome (Desktop + Mobile)
- [ ] Safari (Desktop + Mobile)
- [ ] Firefox
- [ ] Edge
- [ ] Samsung Internet (Android)

---

### UX Rules for Responsive Success

#### 1. Content Priority
**Mobile**: Show only essential content first. Progressive disclosure.
**Tablet**: Balance between mobile simplicity and desktop richness.
**Desktop**: Full content, side-by-side layouts, rich interactions.

#### 2. Touch vs. Mouse
**Mobile/Tablet**: 
- Minimum 48px touch targets
- No hover-dependent interactions
- Swipe gestures for carousels
- Bottom navigation for thumb reach

**Desktop**:
- Hover states for all interactive elements
- Keyboard navigation support
- Mouse-optimized interactions

#### 3. Visual Hierarchy
**Mobile**: 
- Larger headings (proportionally)
- More white space vertically
- Single-column focus

**Desktop**:
- Multi-column layouts
- Asymmetric grids for interest
- Horizontal white space

#### 4. Performance Budgets
**Mobile**: 
- < 1MB total page size
- < 3s load time on 3G
- Lazy load everything below fold

**Desktop**:
- < 2MB total page size
- < 2s load time
- Preload critical assets

#### 5. Navigation
**Mobile**: 
- Hamburger menu
- Fixed header (slides up on scroll down)
- Bottom tab bar for key actions

**Desktop**:
- Persistent horizontal navigation
- Sticky header on scroll
- Dropdown menus on hover

---

### Intentional Simplification Principles

#### The "Award-Winning Without Overwhelm" Framework

1. **Less is More at Every Breakpoint**
   - Mobile: 3-4 key sections maximum above fold
   - Tablet: 5-6 sections visible
   - Desktop: 7-8 sections with clear hierarchy

2. **One Clear Action Per Screen**
   - Every viewport should have ONE primary CTA
   - Secondary actions are subtle and supporting
   - Tertiary actions hidden until needed

3. **Breathing Room Scales with Screen Size**
   - Mobile: Tight but never cramped (20px min padding)
   - Desktop: Generous but never wasteful (48px+ padding)
   - 4K: Dramatic white space (96px+ padding)

4. **Animation Philosophy**
   - Mobile: Minimal, functional only
   - Tablet: Subtle transitions
   - Desktop: Rich micro-interactions
   - Always respect `prefers-reduced-motion`

5. **Information Density**
   - Mobile: One thought per screen
   - Tablet: Related thoughts grouped
   - Desktop: Complete context visible
   - 4K: Spacious, editorial-style layouts

---

### Quick Reference: Responsive Checklist

#### Before Launch
- [ ] All text readable at smallest viewport (320px)
- [ ] All touch targets minimum 48x48px on mobile
- [ ] No horizontal scroll at any breakpoint
- [ ] Images optimized for each breakpoint
- [ ] Typography scales smoothly (no jarring jumps)
- [ ] Navigation works on all devices
- [ ] Forms usable on mobile (16px inputs)
- [ ] Content hierarchy clear at all sizes
- [ ] Performance budget met for mobile
- [ ] Tested on real devices, not just browser tools

#### The Golden Responsive Rules
1. **Mobile first, always** - Build up, not down
2. **Content before chrome** - Content loads first, UI second
3. **Performance is UX** - Fast = good experience
4. **Touch-first on small screens** - No hover dependencies
5. **Constraint breeds creativity** - Use max-width thoughtfully
6. **Test on real devices** - Simulators lie
7. **One breakpoint, one purpose** - Each breakpoint solves a specific layout problem
8. **Maintain hierarchy** - Visual importance stays consistent across devices
9. **Respect user preferences** - Honor system settings (dark mode, reduced motion)
10. **Never sacrifice readability** - Content is king, always

---

## 🎯 Conversion-Focused Design Principles

### Visual Hierarchy Rules

1. **Hero Section**
   - Display XL (89px) for main headline with -2px letter spacing
   - Body XL (21px) for supporting copy with 150% line height
   - Minimum 96px top/bottom padding for breathing room

2. **Section Headers**
   - H2 (34px) for section titles
   - 64px spacing above, 32px spacing below
   - Keep headlines under 8 words for scannability

3. **Body Content**
   - Body MD (16px) for optimal readability
   - Maximum 65-75 characters per line
   - 16px spacing between paragraphs

4. **Call-to-Action Hierarchy**
   - Primary CTA: Accent background, prominent placement
   - Secondary CTA: Outlined style, supporting position
   - Ghost CTA: Minimal style for tertiary actions

### Spacing for Conversion

1. **White Space Strategy**
   - Generous padding around CTAs (minimum 32px from other elements)
   - Section breaks use 64px-96px for clear delineation
   - Card spacing: 24px internal, 24px gap between cards

2. **Visual Breathing Room**
   - Hero sections: 96px-128px vertical padding
   - Content sections: 64px vertical padding
   - Component sections: 48px vertical padding

3. **Grid & Alignment**
   - All elements align to 4px baseline grid
   - Maintain consistent 24px-32px column gaps
   - Center-align hero content, left-align body content

### Attention Direction

1. **Color Usage**
   - Accent color (#0066FF) only for CTAs and key interactive elements
   - Maximum 10% accent color coverage per screen
   - Black text (#1D1D1F) for readability, neutral backgrounds

2. **Size & Scale**
   - Fibonacci ratios create natural eye flow
   - Hero headlines 3x larger than body text
   - CTAs 1.5x larger than surrounding text

3. **Motion & Interaction**
   - Hover states lift elements 2-4px
   - Transitions: 300ms for smooth, professional feel
   - Micro-interactions guide user through booking flow

---

## 📐 Quick Reference: Common Patterns

### Hero Section
```css
/* Spacing */
padding-top: 96px;
padding-bottom: 96px;
margin-bottom: 64px;

/* Typography */
h1: 55px, -2px letter-spacing, 100% line-height
p: 21px, 0 letter-spacing, 150% line-height
gap: 24px between elements
```

### Project Grid
```css
/* Layout */
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 24px;
margin-bottom: 64px;

/* Cards */
padding: 24px;
border-radius: 12px;
```

### Contact Form
```css
/* Spacing */
gap: 16px (between fields);
padding: 16px (inside inputs);
margin-bottom: 24px (form sections);

/* Button */
margin-top: 32px;
padding: 16px 32px;
```

### Navigation
```css
/* Height & Spacing */
height: 72px;
padding: 0 48px;
gap: 32px (between links);

/* Typography */
font-size: 16px;
letter-spacing: 0;
font-weight: 500;
```

---

## 🚀 Implementation Notes

1. **CSS Variables**: Use CSS custom properties for all design tokens
2. **Mobile-First**: Start with mobile styles, progressively enhance
3. **Modularity**: Create reusable component classes
4. **Performance**: Minimize animations on mobile, optimize for 60fps
5. **Testing**: Test on real devices, verify 4px grid alignment
6. **Accessibility**: Maintain WCAG 2.1 AA compliance minimum
7. **Consistency**: Use this system religiously - no ad-hoc spacing

---

**Design System Version**: 1.1  
**Last Updated**: January 30, 2026  
**Designed for**: Conversion-optimized UX/UI portfolio  
**Framework Ready**: Framer, Tailwind, CSS-in-JS compatible
**Accent Color**: #0066FF (4.75:1 contrast ratio - WCAG AA compliant)
