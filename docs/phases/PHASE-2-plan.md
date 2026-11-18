# PHASE 2 PLAN: Sri Lankan Design System & UX

**Project:** Padanama Publications — Web Platform, E-Commerce, Digital Library & Unified Admin  
**Document:** `docs/phases/PHASE-2-plan.md`  
**Phase:** Phase 2 (Sri Lankan Design System & UX)  
**Status:** In Progress  
**Date:** November 2026  

---

## 1. Phase Objectives

The goal of Phase 2 is to design and implement an unmistakably Sri Lankan, accessible, and high-performance design system for Padanama Publications:
1. **Cultural Design Tokens:** Formalize the Sri Lankan palette (`--maroon` #8D153A, `--saffron` #EB7400, `--gold` #FFBE29, `--green` #00534E, warm cream paper background `#FFF8EC`, ink text `#1E1A17`) ensuring all foreground/background pairings exceed **WCAG AA contrast ratios (4.5:1 minimum)**.
2. **Typography System:** Implement responsive typography rules pairing Gemunu Libre for headings with Noto Sans/Serif Sinhala, Noto Sans Tamil, and Inter for UI, strictly enforcing `line-height >= 1.7` to prevent diacritic clipping.
3. **Core Component Library (`src/components/ui/`):** Implement robust, accessible primitives:
   - `Button` (Primary Maroon, Saffron CTA, Outline, Ghost, Link; size variants; loading states)
   - `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`
   - `Badge` (In-Stock, Sale, Award Winner, Digital, Grade Level)
   - `BookCard` (Cover, title, author, price, rating, quick-add, "Read Sample" link)
   - `Rating` (1–5 interactive/display stars)
   - `Stepper` (1-2-3 Checkout progress indicator)
   - `Tabs` (Multilingual tabs, description/reviews/specs)
   - `Modal` / `Drawer` (Accessible dialogs and mini-cart drawer)
   - `Toast` (Notification feedback)
   - `EmptyState` (Culturally illustrated empty cart/search)
   - `DataTable` (Admin responsive tables with sorting and pagination)
4. **Interactive `/design-system` Showcase:** A dev/staging page displaying every component, color token, typography scale, and state across Sinhala, English, and Tamil.
5. **Brand Concept & Favicon:** Stylized "ප" monogram medallion icon with gold border and lotus accents.
6. **Automated Contrast Testing:** Unit tests verifying color contrast ratios and diacritic line-height constraints.

---

## 2. Component Inventory & Specifications

| Component | Variants | Accessibility & Cultural Polish |
|---|---|---|
| **Button** | `default` (Maroon), `cta` (Saffron), `outline`, `ghost`, `gold` | Minimum touch target $44\times 44\text{px}$ on mobile; focus-visible ring |
| **BookCard** | Grid & Horizontal List | Cover aspect ratio $1:1.5$; sale badge; LKR price; quick "Read Sample" |
| **Badge** | `maroon`, `saffron`, `green`, `gold`, `outline` | High-contrast font weight with uppercase micro-typography |
| **Rating** | Display & Interactive | Accessible ARIA `aria-label="4.5 out of 5 stars"` |
| **Stepper** | Active, Completed, Pending | Numbered steps with localized labels (Address $\to$ Shipping $\to$ Payment) |
| **EmptyState** | Cart, Search, Orders | Helpful suggestions with direct CTA buttons |

---

## 3. Acceptance Criteria
- [x] All design tokens configured in Tailwind and CSS variables.
- [x] Complete component library implemented in `src/components/ui/`.
- [x] `/design-system` page active showing components in `/si`, `/en`, and `/ta`.
- [x] SVG logo concept and favicon created.
- [x] Automated tests verifying contrast compliance and token integrity.
- [x] Zero TypeScript errors, lint clean, production build green.
