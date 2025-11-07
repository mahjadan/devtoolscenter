# DevTools Center Theme Audit & Implementation Spec

## Project Inputs

- **Project structure summary**
  ```
  src/
    _includes/
      layouts/{base.njk, article.njk, blog.njk, tool.njk}
      partials/{header.njk, nav.njk, footer.njk}
    assets/{css/styles.css, js/{theme-toggle.js, mobile-menu.js, nav-active-state.js, tools/*.js}}
    index.njk, blog/, pages/, tools/
  _site/ (Eleventy build output mirroring src)
  ```
- **Layouts & partials**
  `src/_includes/layouts/base.njk`, `article.njk`, `blog.njk`, `tool.njk`; `src/_includes/partials/header.njk`, `nav.njk`, `footer.njk`
- **CSS entry points**
  `src/assets/css/styles.css` (Tailwind layer file compiled to `_site/assets/css/styles.css`)
- **Known problem areas**
  - Inline styles injected via tool scripts (e.g. JSON formatter badge spans with hard-coded colors)
  - Hard-coded gradients/shadows in `.article-hero-gradient`, `.code-block-enhanced`
  - Global classes mixing Tailwind tokens and fixed colors (`.tool-card`, `.btn-*`) causing theme drift
- **Brand constraints**
  Clean developer aesthetic built on neutral blues/grays with green accents, WCAG AA contrast minimum, subtle motion
- **Layout freeze pages**
  `/`, `/base64-encode-decode/`, `/json-formatter/`, `/yaml-to-json/`, `/jwt-decoder/`, `/regex-tester/`, `/jsonpath-tester/`, `/url-encode-decode/`, `/uuid-generator/`, `/blog/` and article detail pages, `/about/`, `/contact/`, `/privacy-policy/`, `/terms-of-service/`

---

## Component Inventory Overview

| Component | Purpose & States | Key Issues | Minimal Spec |
| --- | --- | --- | --- |
| Header & nav | Branding, primary navigation (default, hover, focus, mobile) | Mixed padding per breakpoint; focus ring color drifts; sticky shadow uneven in dark mode | 16px vertical padding, 24px horizontal link spacing, `var(--radius-md)` focus outline, border `var(--color-border)`, text `var(--color-text)` |
| Hero banner (home) | Landing message, value props pills | Gradient fixed to light palette; dark overlay muted | 80px vertical padding, pills `var(--radius-full)`, background uses `--color-surface` with accent gradient tokens |
| Tool card | Browse tools (default/hover/focus) | Hover border tied to Tailwind `primary-500`, inconsistent shadow | Padding 24px, `var(--radius-lg)`, border `1px solid var(--color-border)`, hover border `--color-primary`, shadow `--shadow-sm` |
| Buttons `.btn*` | Tool actions (default, hover, focus-visible, disabled) | Focus ring offset inconsistent; no disabled guidance | Padding 12px x 20px, `var(--radius-md)`, `var(--font-weight-semibold)`, transitions via motion tokens, disabled as `opacity:0.6` |
| Tool textarea | JSON/text input (default, focus, error, disabled) | No error variant; focus ring tied to Tailwind class | Padding 16px, border `--color-border`, background `--color-surface`, text size `--font-size-sm`, focus outline `--color-primary`, error border `--color-danger` |
| Alerts (`#error-message`) | Inline feedback (neutral, success, danger) | Hard-coded backgrounds; success relies on inline spans | `.alert` + variants, padding 16px, border-left 4px, background `--color-subtle`, text `--color-text`, semantic colors via tokens |
| Prose & article shells | Blog typography, code blocks | Embedded keyframes, light-only gradients | Heading borders use `--color-border`, code blocks `--radius-lg`, 24px padding, use motion tokens |
| Related grids | Cross-links to tools/articles | Hover states mix tokens & Tailwind | Align with card spec, 20px gap, `--shadow-xs` |
| Footer | Sitewide nav + legal | Background `gray-100` with low contrast in dark mode | Background `--color-surface`, border `--color-border`, padding 48px, text `--color-text-muted` |
| Skip link `.sr-only` | Accessibility skip-to-content | Manual focus styling | Background `--color-primary`, text `--color-primary-contrast`, outline uses tokens |
| Mobile menu | Small screen nav (open/close animation) | Keyframes not tokenized | Use `motion-slide-in-y-8` primitive, overlay uses `rgba(var(--color-bg-rgb), 0.8)` |

---

## Theme Token System

### Color Tokens (AA validated)

| Token | Light | Dark | Notes |
| --- | --- | --- | --- |
| `--color-bg` | `#f8fafc` | `#0b1120` | Page background |
| `--color-surface` | `#ffffff` | `#111c2f` | Cards, header, footer |
| `--color-subtle` | `#f1f5f9` | `#1b2538` | Muted panels |
| `--color-border` | `#cbd5e1` | `#3f4a63` | Dividers, outlines |
| `--color-text` | `#0f172a` | `#e2e8f0` | Primary copy |
| `--color-text-muted` | `#475569` | `#94a3b8` | Secondary text |
| `--color-primary` | `#0284c7` | `#38bdf8` | Primary CTA |
| `--color-primary-contrast` | `#ffffff` | `#041423` | On-primary text/icons |
| `--color-accent` | `#16a34a` | `#4ade80` | Accents, toggles |
| `--color-success` | `#15803d` | `#22c55e` | Success |
| `--color-warning` | `#b45309` | `#f59e0b` | Warnings |
| `--color-danger` | `#dc2626` | `#f87171` | Errors |

### Elevation, Radius, Motion, Typography Tokens

- **Elevation**
  - `--shadow-xs`: `0 1px 2px rgba(15, 23, 42, 0.08)`
  - `--shadow-sm`: `0 4px 12px rgba(15, 23, 42, 0.12)`
  - `--shadow-md`: `0 12px 24px rgba(15, 23, 42, 0.16)` (adjust rgba base to `rgba(8, 15, 30, 0.32)` in dark mode using `--shadow-color-base`)
- **Radius**
  - `--radius-xs`: `4px`
  - `--radius-sm`: `6px`
  - `--radius-md`: `8px`
  - `--radius-lg`: `12px`
  - `--radius-full`: `9999px`
- **Motion**
  - `--motion-duration-quick`: `120ms`
  - `--motion-duration-normal`: `200ms`
  - `--motion-duration-slow`: `320ms`
  - `--motion-ease-standard`: `cubic-bezier(0.2, 0, 0, 1)`
  - `--motion-ease-emphasized`: `cubic-bezier(0.3, 0.7, 0.4, 1)`
- **Typography**
  - `--font-sans`: `"Inter", "Segoe UI", system-ui, sans-serif`
  - `--font-mono`: `"Fira Code", "Courier New", monospace`
  - Sizes `--font-size-xs` through `--font-size-3xl`: `0.75rem`, `0.875rem`, `1rem`, `1.125rem`, `1.25rem`, `1.5rem`, `1.875rem`
  - Weights `--font-weight-regular`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`: `400`, `500`, `600`, `700`

### Variable Maps

```css
:root {
  color-scheme: light dark;
  font-family: var(--font-sans);
}

:root[data-theme="light"] {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-subtle: #f1f5f9;
  --color-border: #cbd5e1;
  --color-text: #0f172a;
  --color-text-muted: #475569;
  --color-primary: #0284c7;
  --color-primary-contrast: #ffffff;
  --color-accent: #16a34a;
  --color-success: #15803d;
  --color-warning: #b45309;
  --color-danger: #dc2626;
  --shadow-color-base: rgba(15, 23, 42, 0.12);
}
```

```css
:root[data-theme="dark"] {
  --color-bg: #0b1120;
  --color-surface: #111c2f;
  --color-subtle: #1b2538;
  --color-border: #3f4a63;
  --color-text: #e2e8f0;
  --color-text-muted: #94a3b8;
  --color-primary: #38bdf8;
  --color-primary-contrast: #041423;
  --color-accent: #4ade80;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #f87171;
  --shadow-color-base: rgba(8, 15, 30, 0.32);
}
```

> **Deriving pairs:** Start with existing Tailwind palette hues to maintain brand familiarity, adjust luminance ±20% in OKLCH space so text tokens hit ≥4.5:1 contrast on both `--color-surface` and `--color-bg`. Prefer saturation tweaks over opacity to keep colors vivid.

---

## Component Implementation Examples

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  color: var(--color-text);
  padding: 1.5rem;
  transition: box-shadow var(--motion-duration-normal) var(--motion-ease-standard),
              border-color var(--motion-duration-normal) var(--motion-ease-standard);
}
.card:hover,
.card:focus-within {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.button-primary {
  background: var(--color-primary);
  border-radius: var(--radius-md);
  color: var(--color-primary-contrast);
  font-weight: var(--font-weight-semibold);
  padding: 0.75rem 1.25rem;
  transition: transform var(--motion-duration-quick) var(--motion-ease-emphasized);
}
.button-primary:hover,
.button-primary:focus-visible {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
.button-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## Motion & Effects

- **fade-in**: `opacity: 0 → 1`, `var(--motion-duration-normal)` with `var(--motion-ease-standard)`; apply to hero, article entrances; avoid on validation feedback.
- **elevate**: On hover/focus, transition from `--shadow-xs` to `--shadow-sm`, `transform: translateY(-2px)`, duration `var(--motion-duration-quick)`, easing `var(--motion-ease-emphasized)`.
- **slide-in-y-8**: `transform: translateY(0.5rem) → 0`, `opacity: 0 → 1`, ~240ms, standard easing; use for tool panels or mobile menu.
- **pulse-soft**: `transform: scale(1) ↔ 1.025`, light box-shadow oscillation, duration `1.2s` looped twice; reserve for hints (theme toggle, onboarding).

Reduced-motion fallback:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
```

Avoid animating form validation messages, sticky header reveal, or changes triggered by typing.

---

## Tool Isolation Strategy

1. Wrap tool markdown content in `layouts/tool.njk` with a `.tool-shell` container.
2. Create `src/assets/css/tool-shell.css` for shared tool styles (`.tool-shell`, `.tool-shell__panel`, `.tool-shell__actions`, `.tool-shell--warning`).
3. Extract inline tool styles into dedicated files under `src/assets/css/tools/` (e.g. `tool-json-formatter.css`), scoped via `.tool-shell--json-formatter`.
4. Update tool front matter with a `toolStyles` property that injects the relevant CSS file through the layout.
5. Refactor tool JS output to toggle class names (`.badge--success`, `.badge--error`) instead of injecting `style` attributes.
6. Provide token-aware utility classes for legacy content during migration, then remove once each tool adopts `.tool-shell`.

---

## Rollout Plan

1. **Phase 1 – Token infrastructure**  
   Introduce root CSS variables, ensure Tailwind config references them, keep visuals unchanged.
2. **Phase 2 – Token adoption**  
   Replace hard-coded colors/borders in `styles.css`, layouts, and partials with tokens. Validate critical pages via snapshot tests.
3. **Phase 3 – Motion primitives**  
   Add `.motion-fade-in`, `.motion-elevate`, `.motion-slide-in-y-8`, `.motion-pulse-soft`; apply to non-critical surfaces, confirm reduced-motion behavior.
4. **Phase 4 – Tool isolation**  
   Implement `.tool-shell` wrappers, extract per-tool styles, adjust scripts. Pilot with JSON formatter, then cascade to remaining tools.
5. **Phase 5 – Polish & accessibility**  
   Re-run contrast checks, verify focus outlines, tune gradient overlays for dark mode, document token usage in README.

---

## Red Flags & Mitigation

- `.article-hero-gradient`, `.code-block-enhanced` (hard-coded gradients/shadows) → validate replacements before rollout.
- Tool scripts in `src/assets/js/tools/*.js` → ensure class-based messaging doesn’t break logic.
- Sticky header `.shadow-sm` vs new tokens → confirm parity to avoid visual flicker.
- Tailwind `dark:` overrides in templates → plan incremental swap to token-based utilities.
- Heavy `@apply` usage in `styles.css` → confirm Tailwind build handles token references (`theme()` or custom properties).

---

## Reference Notes

- Pair light/dark colors by adjusting luminance while staying within brand hue angles; confirm AA contrast for text/icons on both `--color-surface` and `--color-bg`.
- Prioritize incremental adoption to avoid breaking the layout-frozen pages listed in the inputs.
- Keep motion subtle and disable transitions on high-frequency interactions to stay aligned with the "minimal motion" brand constraint.


