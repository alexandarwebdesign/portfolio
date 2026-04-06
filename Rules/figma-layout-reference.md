# Figma Layout Reference for Google Antigravity
**Alexandar Pavlov Portfolio Website**

---

## 🔗 Figma Source

```
https://www.figma.com/design/gqKVKGWVU2rh5QUauSMIC2/Untitled?node-id=209-2367
```

---

## 📐 Page Structure

### Desktop Layout
- **Page Width**: 1200px
- **Content Width**: 1072px (centered)
- **Side Margins**: 64px

---

## 🧱 Sections (Top to Bottom)

### 1. Navigation Bar (Fixed)
- Position: Fixed at top, centered horizontally
- Contents:
  - Left: Logo text "© ALEKSANDAR P."
  - Center: Nav links (Work, About, Services)
  - Right: CTA button "Contact Me →"

---

### 2. Hero Section
- Full viewport height (800px)
- Content centered vertically and horizontally
- Structure:
  ```
  [Title - large heading]
  [Subtitle - single line]
  [CTA Button - "Let's Work Together"]
  ```

---

### 3. Work Section
- Section title "WORK" on left, project count "(06)" on right
- 2-column grid layout
- 6 project cards (3 rows × 2 columns)

#### Project Card Structure:
```
[Project Image - landscape ratio]
[Project Title]     [Arrow Icon →]
[Project Category]
```

---

### 4. About Section
- Section title "ABOUT" (left-aligned)
- Bio paragraph (max-width ~580px)
  - Note: "beautiful websites convert" is highlighted/linked
- CTA Button below bio

---

### 5. Services Section
- Section title "Services"
- 3 service items stacked vertically

#### Service Item Structure:
```
[Service Title - uppercase]
[Service Description - 2 lines]
```

- Services:
  1. Web Design & UX Strategy
  2. Framer Development
  3. End-to-End Solutions

- CTA Button centered below all services

---

### 6. Contact Section
- Split layout (2 columns)

#### Left Column:
```
[Large Title]
"Let's"
"Work"
"Together"

[Subtitle]
"Open to freelance & collaborations"

[Email Link Section]
"Prefer Email?"
"alexanderpavlov75@gmail.com" (clickable)
```

#### Right Column - Contact Form:
```
[Label] Full name
[Input Field]

[Label] Email
[Input Field]

[Label] What do you need?
[Dropdown - Select Service]

[Label] Tell me about your project
[Textarea - tall]

[Submit Button - full width] "Send Message"

[Helper Text] "I typically respond within 24 hours"
```

---

### 7. Footer
- 2 rows with large gap between them

#### Row 1:
```
© 2026 Alexandar Pavlov • Design & Development
```

#### Row 2:
```
Home    Work    Services    About    Contact
```

---

## 📱 Component Hierarchy

```
Page
├── Navbar (fixed)
│   ├── Logo
│   ├── Nav Links
│   └── CTA Button
│
├── Hero Section
│   ├── Title
│   ├── Subtitle
│   └── CTA Button
│
├── Work Section
│   ├── Section Header (Title + Count)
│   └── Project Grid (2 columns)
│       └── Project Card ×6
│           ├── Image
│           ├── Title + Arrow
│           └── Category
│
├── About Section
│   ├── Section Title
│   ├── Bio Text
│   └── CTA Button
│
├── Services Section
│   ├── Section Title
│   ├── Service Item ×3
│   │   ├── Title
│   │   └── Description
│   └── CTA Button
│
├── Contact Section
│   ├── Left Column
│   │   ├── Large Title
│   │   ├── Subtitle
│   │   └── Email Link
│   └── Right Column (Form)
│       ├── Name Input
│       ├── Email Input
│       ├── Service Dropdown
│       ├── Message Textarea
│       ├── Submit Button
│       └── Helper Text
│
└── Footer
    ├── Copyright
    └── Nav Links
```

---

## ⚡ Prompt for Google Antigravity

```
Build my portfolio website following the exact layout from my Figma design. 
Use my existing design system for all colors, typography, spacing, and component styles.

Figma: https://www.figma.com/design/gqKVKGWVU2rh5QUauSMIC2/Untitled?node-id=209-2367

The layout has these sections in order:
1. Fixed navbar with logo, nav links, and contact CTA
2. Hero with centered title, subtitle, and CTA button
3. Work section with 2-column project card grid (6 projects)
4. About section with bio text and CTA
5. Services section with 3 stacked service items and CTA
6. Contact section split into left (title + email) and right (form)
7. Footer with copyright and nav links

Follow the Figma for layout and structure only. 
Apply styling from my design system.
```

---

**Document Version**: 1.0  
**Created**: January 30, 2026  
**Purpose**: Layout reference only - styling from design system
