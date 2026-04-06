# Skill: Website Design Extractor

## When to activate
Trigger whenever: crawling a website for design analysis, capturing UI references for replication,
analyzing frontend design patterns, cloning/rebuilding a website's interface. Use on: "copy the
look of this site", "replicate this design", "match the style of X", "what colors/fonts does this
site use", "extract the design tokens from this URL". Run proactively during any website crawl
that has a UI replication goal.

---

## Goal
Visit a website, deeply analyze its visual design system, and produce a structured report giving
a frontend developer everything needed to faithfully replicate the look and feel — without visiting
the site themselves.

**Precision matters.** "Uses a blue color" is useless. "`#1A73E8` (primary action buttons, links)" is valuable.

---

## Step-by-Step Process

### 1. Navigate to the website
Open the target URL. Start with homepage, then key pages (landing, dashboard, product).

### 2. Capture the page visually
- Take a full-page screenshot in default state
- Hover over interactive elements (buttons, links, nav items) to capture hover states
- If there's a dark mode toggle, capture both modes

### 3. Extract design data via JavaScript

```javascript
// Extract computed styles from common elements
const elements = document.querySelectorAll('h1, h2, h3, p, button, a, input, nav');
elements.forEach(el => {
  const s = window.getComputedStyle(el);
  console.log(el.tagName, {
    color: s.color,
    background: s.backgroundColor,
    fontFamily: s.fontFamily,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    lineHeight: s.lineHeight,
    borderRadius: s.borderRadius,
    padding: s.padding,
    boxShadow: s.boxShadow,
  });
});
```

```javascript
// Extract CSS custom properties (design tokens)
const cssVars = Array.from(document.styleSheets)
  .flatMap(sheet => {
    try { return Array.from(sheet.cssRules); } catch(e) { return []; }
  })
  .filter(rule => rule.selectorText === ':root')
  .flatMap(rule => rule.cssText.match(/--[\w-]+:\s*[^;]+/g) || []);
console.log(cssVars);
```

### 4. Inspect priority UI components
- **Primary button** — most important, sets the tone for the whole design
- **Navigation bar** — background, link styles, active state
- **Cards** (if present)
- **Input fields**
- **Hero/banner sections**
- **Footer**

For each: check exact color values (convert to HEX), border radius, box shadow, padding, hover/active states.

### 5. Analyze layout
- Maximum content width (`max-width` on container elements)
- Grid or flexbox? Column count?
- Standard section padding (top/bottom)
- Spacing between content blocks

### 6. Convert ALL colors to HEX
Always convert `rgb(r, g, b)` → HEX.  Example: `rgb(26, 115, 232)` → `#1A73E8`

---

## Output Format

```
# [Site Name] — Visual Design System

## Overview
[1–2 sentence description: "Minimal SaaS dashboard with a dark sidebar, white content area,
and a blue primary accent. Uses Inter for all text."]

## 1. Color System

### Primary Colors
| Name         | HEX     | Usage                          |
|--------------|---------|-------------------------------|
| Primary Blue | #1A73E8 | CTA buttons, links, highlights |

### Secondary / Accent Colors
| Name | HEX | Usage |
|------|-----|-------|

### Neutral / Background Colors
| Name               | HEX     | Usage                |
|--------------------|---------|----------------------|
| Page Background    | #F8F9FA | Main page background |
| Card Background    | #FFFFFF | Cards, modals        |
| Sidebar Background | #1E1E2D | Left nav / sidebar   |

### Text Colors
| Name         | HEX     | Usage               |
|--------------|---------|---------------------|
| Primary Text | #212529 | Body copy, headings |
| Muted Text   | #6C757D | Labels, captions    |

### Border Colors
| Name           | HEX     | Usage         |
|----------------|---------|---------------|
| Default Border | #DEE2E6 | Cards, inputs |

### Interactive States
| State        | HEX     | Context              |
|--------------|---------|----------------------|
| Hover        | #1557B0 | Primary button hover |
| Active/Focus | #0D47A1 | Input focus ring     |

## 2. Typography

### Font Families
- **Primary Font**: [Name] — used for [headings / body / all text]
- **Secondary Font**: [Name or "None"]
- **Import source**: [Google Fonts URL / self-hosted / system font stack]

### Type Scale
| Element | Font  | Size | Weight | Line Height | Letter Spacing |
|---------|-------|------|--------|-------------|----------------|
| H1      | Inter | 48px | 700    | 1.2         | -0.5px         |
| H2      | Inter | 36px | 600    | 1.3         | normal         |
| H3      | Inter | 24px | 600    | 1.4         | normal         |
| Body    | Inter | 16px | 400    | 1.6         | normal         |
| Button  | Inter | 15px | 600    | normal      | 0.3px          |
| Caption | Inter | 12px | 400    | 1.4         | normal         |

## 3. UI Components

### Primary Button
- Background: `#1A73E8` | Text: `#FFFFFF` | Font: Inter 15px 600
- Border Radius: `8px` | Padding: `10px 24px`
- Hover: `#1557B0` | Active: `#0D47A1`

### Secondary / Ghost Button
- Background: `transparent` | Text: `#1A73E8` | Border: `1.5px solid #1A73E8`
- Hover: Background `#E8F0FE`

### Cards
- Background: `#FFFFFF` | Border: `1px solid #E8EAED` | Border Radius: `12px`
- Padding: `24px` | Box Shadow: `0 1px 3px rgba(0,0,0,0.08)`

### Navigation Bar
- Height: `64px` | Link Color: `#3C4043` | Active Link: `#1A73E8`
- Active Indicator: `2px solid #1A73E8` (bottom border)
- Mobile hamburger at `768px` breakpoint

### Input Fields
- Border: `1px solid #DADCE0` | Border Radius: `8px` | Padding: `10px 16px`
- Focus Border: `2px solid #1A73E8` | Focus Shadow: `0 0 0 3px rgba(26,115,232,0.15)`
- Error Border: `#D93025`

### Tables (if present)
- Header Background: `#F8F9FA` | Row Border: `1px solid #E8EAED`
- Row Hover: `#F8F9FA` | Cell Padding: `12px 16px`

### Modals (if present)
- Overlay: `rgba(0,0,0,0.5)` | Border Radius: `16px` | Padding: `32px`
- Box Shadow: `0 20px 60px rgba(0,0,0,0.3)` | Max Width: `560px`

### Sidebar (if present)
- Width: `240px` (collapsed: `64px`) | Background: `#1E1E2D`
- Active item indicator: `3px solid #4C8BF5` (left border)

## 4. Layout System

### Container
- Max Width: `1280px` | Side Padding: `24px` (desktop) / `16px` (mobile) | Centered: yes

### Breakpoints
| Name    | Width      |
|---------|------------|
| Mobile  | < 768px    |
| Tablet  | 768–1024px |
| Desktop | > 1024px   |

### Spacing Scale
| Token | Value |
|-------|-------|
| xs    | 4px   |
| sm    | 8px   |
| md    | 16px  |
| lg    | 24px  |
| xl    | 32px  |
| 2xl   | 48px  |

## 5. Visual Style Notes
[Animations, icon style (outline vs filled, Heroicons/Lucide), image treatment, illustration style,
loading states, etc.]

## 6. CSS Variables / Design Tokens (if found)
```css
--primary: #1A73E8;
--background: #F8F9FA;
--text: #212529;
--radius: 8px;
```
If no CSS variables found, note: "No CSS custom properties detected."

## 7. Replication Checklist
- [ ] All HEX values verified (not estimated)
- [ ] Font families confirmed from `<head>` or DevTools
- [ ] Primary button hover state captured
- [ ] Container max-width confirmed
- [ ] Spacing scale extracted from computed styles
```

---

## Tips for Accuracy

- **Tailwind sites:** Infer spacing from class names (`p-4` = 16px, `gap-6` = 24px)
- **CSS-in-JS sites:** Check for theme object in page source or `window.__NEXT_DATA__`
- **Always prefer computed values** from `getComputedStyle` over authored values
- **When in doubt about a color:** Use the browser's eyedropper to sample directly from screenshot
- **Don't estimate:** If you can't find the exact value, say so and explain how to find it manually
