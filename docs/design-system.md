# chandratand/ui design system

The rules of the chandratand design system: what it is, the values it is built on, and how components are made. **This repo is the source of truth.** Anything else (Claude Design artifacts, Figma, slides) is generated from it, never the other way round.

- Values live in `tokens/tokens.css`. This document explains them; it does not redefine them. If the two disagree, the CSS wins and this document gets fixed.
- `CLAUDE.md` holds the short version of these rules for Claude Code. It points here for the reasons.

## Contents

1. [What chandratand/ui is](#1-what-chandratandui-is)
2. [Principles](#2-principles)
3. [Architecture: three layers, two theme axes](#3-architecture-three-layers-two-theme-axes)
4. [Foundations](#4-foundations)
5. [Component rules](#5-component-rules)
6. [Accessibility](#6-accessibility)
7. [Workflows](#7-workflows)
8. [Inventory](#8-inventory)

---

## 1. What chandratand/ui is

A **shadcn registry**: tokens and React components that every chandratand project (portfolio, SaaS) copies in with the shadcn CLI.

```bash
npx shadcn@latest init chandratand/ui/tokens     # theme, merged into globals.css (or init …/style: tokens + every component)
npx shadcn@latest add chandratand/ui/button      # a component, copied into the app
```

| Layer | Role |
| --- | --- |
| **shadcn/ui** | Raw material. A well-built, accessible starting point for most components. |
| **chandratand/ui (this repo)** | shadcn adjusted to our rules: tokens, sizes, API, accessibility. The only place components are edited. |
| **Apps** | Consumers. They install from chandratand/ui and never edit the copied components. A fix happens here, then the app pulls again with `--overwrite`. |

Not every component has to start from shadcn. A component shadcn doesn't have is written from scratch, following the same rules.

## 2. Principles

**Calm, precise, trustworthy.** The products handle money and business data. The UI should feel like a well-made instrument, not a marketing page.

1. **Borders before shadows.** Surfaces are separated by 1px borders. Shadows are reserved for things that float above the page (menus, toasts, dialogs). Fewer shadows means the ones that exist carry meaning.
2. **Square-ish.** Small radii (4–8px). Nothing pill-shaped except avatars, switches and radio buttons.
3. **Meaning over decoration.** Colour is used for state (primary action, success, error), not for decoration. Status is never colour alone.
4. **Density is a choice, not an accident.** Three control sizes and two table densities, so a data-heavy screen and a touch screen use the same components.
5. **Accessible by default.** WCAG 2.2 AA is built into the components, so an app gets it without thinking.
6. **Framework-agnostic.** Plain React. Works in Next.js, Vite, React Router.

## 3. Architecture: three layers, two theme axes

```
primitives          semantic tokens            components
--brand-600   →     --primary            →     bg-primary
--brand-200   →     --border             →     border-border
```

1. **Primitives**: raw ramps (`--brand-50…950`, `--neutral-50…950`), spacing, radius, sizes, motion. Never used directly by components.
2. **Semantic tokens**: what a colour *means* (`--primary`, `--muted-foreground`, `--destructive-bg`). Names follow shadcn exactly, so shadcn components and docs keep working.
3. **Components**: use only semantic Tailwind utilities (`bg-primary`, `text-muted-foreground`, `h-control-md`).

Theming has two independent axes that combine freely:

| Axis | Mechanism | Who sets it |
| --- | --- | --- |
| **Mode** | `.dark` class on `<html>` | The app (e.g. `next-themes` with `attribute="class"`) |
| **Brand** | `data-brand="<name>"` on `<html>` | The app |

chandratand is the default Brand and the only one today: it is `:root` / `.dark`, with no `data-brand` attribute. Components never know which brand or mode is active.

To add a Brand, add a block to `tokens/tokens.css` that overrides **only** the brand-driven semantic tokens: the primary family (`--primary`, `--primary-foreground`, `--primary-hover`, `--primary-active`), `--ring` and `--chart-1`. Define them for both modes, and check contrast in both (section 6):

```css
[data-brand="<name>"] { --primary: …; --primary-foreground: …; --primary-hover: …; --primary-active: …; --ring: …; --chart-1: …; }
[data-brand="<name>"].dark,
[data-brand="<name>"] .dark { /* the same tokens, dark values */ }
```

Everything else (neutrals, status colours, radius, sizes, motion) is shared by every Brand. Then run `pnpm registry:build` and add a Brand toggle to the theme controls on the docs site so it can be checked. A Brand that would be identical to the default is not added.

`tokens/theme.css` is the Tailwind v4 bridge that turns the variables into utilities. `scripts/tokens-to-registry.mjs` turns both files into the `tokens` registry item; never edit that item by hand. `scripts/style-to-registry.mjs` then writes the `style` item from the Components in `registry.json`, so a new Component joins the Style without a manual step.

## 4. Foundations

### 4.1 Colour

**Brand ramp.** The portfolio's venice-blue, hue ~243–251, anchored at `#326897` = `brand-600`. Defined in OKLCH. In light Mode the brand ramp also supplies the quiet fills, borders and text, so the whole page leans blue.

**Neutral ramp.** Achromatic (chroma 0), as in the portfolio's dark Mode. Dark Mode surfaces and text come from it.

**Semantic tokens** (light → dark):

| Token | Use | Light | Dark |
| --- | --- | --- | --- |
| `background` / `foreground` | Page, body text | off-white tinted blue / brand-950 | neutral-950 / neutral-100 |
| `card`, `popover` (+ `-foreground`) | Raised surfaces, form controls | white | neutral-900 |
| `primary` (+ `-foreground`, `-hover`, `-active`) | Main action, selection | brand-600 on brand-50 (hover 700, active 800) | brand-600 on brand-50 (hover 500, active 400) |
| `secondary`, `muted` | Quiet fills | brand-100 | neutral grey 0.245 |
| `accent` | Hover and selected backgrounds | brand-200 | neutral-800 |
| `muted-foreground` | Secondary text | brand-700 (5.5:1 on accent) | neutral-400 |
| `border` | **Decorative** dividers and surface edges | brand-200 | white 10% |
| `input` | **Form control** borders (below 3:1 by choice, see below) | brand-200 | white 15% |
| `ring` | Focus ring | brand-500 | brand-500 |
| `link` | Link text (Button `link`, inline links); separate from `primary` so dark mode can keep a deeper primary fill | brand-600 | brand-400 |
| `overlay` | Scrim behind dialogs and sheets | black 50% | black 70% |

`border` vs `input` matters: `border` is allowed to be faint because it's decoration. `input` marks where a control is, so WCAG asks for 3:1. **Exception:** chandratand/ui keeps the portfolio's faint input border (about 1.3:1 light, 1.5:1 dark) because it looks better, so `tests/tokens.spec.ts` no longer checks `input`. The focus ring still meets 3:1.

**Surfaces get lighter as they rise, in both Modes.** The page (`background`) is the darkest surface; `card` and `popover` sit on it and are lighter. That is why the light page is off-white rather than white: a white card on a white page is held apart by its border alone. In dark Mode, near-black rather than black does the same job, since shadows don't show on black. So in a component:

- `bg-background` only for what *is* the page: the Sidebar and the App shell header.
- `bg-popover` for anything that floats: dialogs, alert dialogs, sheets, toasts, menus.
- `bg-card` for cards and for filled controls (inputs, selects, checkboxes, radios, the outline button, the active segmented tab), so a field is white whether it sits on the page or in a card.
- Nothing that has to match the surface behind it (a fill that masks a line, say): it breaks on the other surface. `FieldSeparator` draws two lines either side of its text for this reason.

**Pure white and black stay where they are.** `-foreground` on the warning and info fills is white because off-white costs contrast (warning drops from 4.96:1 to 4.76:1). Primary, success and destructive take the portfolio's near-white tints, which still pass 4.5:1. The `overlay` scrim is neutral black, as in Material 3. Body text is never `#000` (neutral-950). The research behind this: [`docs/research/pure-black-and-white.md`](research/pure-black-and-white.md).

**Status colours.** Four statuses, each with the same four tokens:

| Status | Tokens | Use |
| --- | --- | --- |
| success | `success`, `success-foreground`, `success-bg`, `success-border` | Paid, saved, done |
| warning | `warning…` | Due soon, needs attention |
| destructive | `destructive…` | Error, overdue, delete |
| info | `info…` | Draft, neutral notice |

- `-bg` + `-border` + `text-<status>` = tinted badge/alert (the common case).
- `bg-<status>` + `text-<status>-foreground` = solid fill (e.g. the destructive button).

**Chart palette.** `chart-1…5`, distinguishable in both modes. `chart-1` follows the brand.

**Never** use hex, `rgb()`, Tailwind palette colours (`bg-blue-500`, `bg-black/50`) or `brand-*` utilities in a component. If a meaning is missing, add a semantic token (see 7.3).

### 4.2 Typography

| Token | Default | Use |
| --- | --- | --- |
| `--font-sans` | Inter | Everything |
| `--font-heading` | Montserrat | Headings, dialog/card titles (`font-heading`) |
| `--font-mono` | Geist Mono | IDs, codes, keyboard shortcuts |

The app loads the font files and may override these variables; components only reference the tokens. The type scale is Tailwind's default (`text-xs`…`text-5xl`). Components mostly use `text-sm` (14px), `text-xs` for meta/labels, `text-base` in `lg` size controls. Use `tabular-nums` for amounts and numbers in tables.

Copy: sentence case, no trailing colons on labels, mark optional fields "(optional)".

### 4.3 Spacing

4px base, 8px rhythm: `--space-1` (4) … `--space-16` (64). In components use Tailwind's spacing scale (`gap-2`, `p-4`), which is on the same 4px grid.

### 4.4 Radius

| Utility | Value | Use |
| --- | --- | --- |
| `rounded-sm` | 4px | Badges, checkboxes, tab triggers |
| `rounded-md` | 6px | Inputs, buttons, menu items, tooltips |
| `rounded-lg` | 8px | Cards, dialogs, popovers, menus, alerts, toasts |
| `rounded-xl` | 12px | Large marketing panels only |

The scale is shadcn's, derived from `--radius: 0.5rem` as the portfolio uses it.
| `rounded-full` | — | Avatars, switches, radio buttons only |

Rule of thumb: the inner element is never rounder than its container.

### 4.5 Sizing and density

| Token | Value | Utility | Use |
| --- | --- | --- | --- |
| `--control-sm` | 32px | `h-control-sm` | Dense screens (ERP tables, toolbars) |
| `--control-md` | 40px | `h-control-md` | **Default** |
| `--control-lg` | 48px | `h-control-lg` | Touch / kiosk (meets the 44px touch target) |
| `--row-comfortable` | 40px | `h-row-comfortable` | Default table rows |
| `--row-compact` | 32px | `h-row-compact` | Dense tables |
| `--icon-sm` | 16px | `size-icon-sm` | Icons in sm/md controls and text |
| `--icon-lg` | 20px | `size-icon-lg` | Icons in lg controls |

### 4.6 Elevation

| Level | Style | Surface | Use |
| --- | --- | --- | --- |
| 0 | `border`, no shadow | `bg-card` | Cards, tables, alerts, everything on the page |
| 1 | `border` + `shadow-sm` | `bg-popover` | Popovers, dropdowns, select content, tooltips, toasts |
| 2 | `border` + `shadow-lg` + `bg-overlay` scrim | `bg-popover` | Dialogs, alert dialogs, sheets |

### 4.7 Motion

| Token | Value | Use |
| --- | --- | --- |
| `--duration-fast` | 120ms | Hover/colour changes, menus, tooltips, popovers |
| `--duration-normal` | 200ms | Dialogs, overlays |
| `--duration-slow` | 300ms | Larger surfaces (sheets) |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Everything |

Always write durations as `duration-(--duration-*)` plus `ease-standard`. Under `prefers-reduced-motion` the durations become 0, so every transition and animation switches off with no extra code. Overlays use `tw-animate-css` classes (`animate-in fade-in-0 zoom-in-95`) which read the same duration. Motion is subtle: fades and a 95% zoom, no bounces or slides across the screen.

Exceptions:

- **Spinner** uses `motion-reduce:animate-none`: an endless spin has no duration to collapse.
- **Sheet** slides in from its own edge: that shows where the panel came from, and it moves only its own width, not across the screen.
- **Sidebar** slides off canvas to its own edge, or narrows to its icons, for the same reason and with the same `--duration-slow`.

### 4.8 Icons

- **lucide-react** only.
- Stroke **1.5** (`stroke-[1.5]`). Exception: the Checkbox mark uses 2, for legibility at 14px.
- `size-icon-sm` (16) in sm/md controls, `size-icon-lg` (20) in lg controls.
- Decorative icons get `aria-hidden`. An icon-only button gets an `aria-label` (and usually a Tooltip).

## 5. Component rules

### 5.1 Code

1. **No framework imports.** Never `next/*` (link, image, font, navigation) or `next-themes` inside `registry/`. For links, accept `asChild` (`Slot.Root` from `radix-ui`) so the app passes its own `<Link>`.
2. **Radix from the unified package**: `import { Dialog as DialogPrimitive } from "radix-ui"`, never `@radix-ui/react-*`.
3. **One function per part**, each with a `data-slot="<component>-<part>"` attribute (shadcn convention; lets parents style children).
4. **Variants with `cva`**, exported alongside the component (`buttonVariants`) so apps can style a link like a button.
5. **`className` is always last in `cn()`** so the app can override.
6. **Using another chandratand/ui component**: import it from `@/registry/chandratand/ui/<name>` and list `chandratand/ui/<name>` in `registryDependencies`. A bare `"button"` would pull **shadcn's** Button. Bare `"utils"` is intended (shadcn's `cn`).
7. A short doc comment on the main export says **when** to use the component and when to use something else.

### 5.2 API conventions

| Prop | Values | Notes |
| --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"`, default `"md"` | Every interactive control. Maps to `h-control-*`. Button also has `"icon"`. |
| `variant` | Named by meaning: `primary`, `secondary`, `outline`, `ghost`, `destructive`, `link`; status components use `neutral`, `info`, `success`, `warning`, `destructive` | shadcn's `"default"` is renamed to what it actually is (`primary`, `neutral`, `segmented`). |
| `asChild` | boolean | Anything that can be a link or wrap a custom element. |
| `density` | `"comfortable" \| "compact"` | Tables. |

### 5.3 States

| State | Style |
| --- | --- |
| Hover | `hover:bg-accent` (quiet) or `hover:bg-primary-hover` (primary) |
| Focus | `outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background` (exactly this, everywhere) |
| Invalid | `aria-invalid:border-destructive`, plus an error message linked with `aria-describedby` |
| Disabled | `disabled:opacity-50` + `cursor-not-allowed`; inputs also `disabled:bg-muted` |
| Selected / open | `data-[state=…]` with `bg-accent` or primary |

## 6. Accessibility

Target: **WCAG 2.2 AA**.

- Text ≥ **4.5:1** against its background (large text ≥ 3:1).
- Form control borders, focus rings and meaningful icons ≥ **3:1**. That's why `--input` exists separately from `--border`. (`--input` is knowingly below it; see 4.1.)
- Focus is always visible (`focus-visible` ring, never removed without a replacement).
- Status always pairs **colour with an icon or text** (badges, alerts, toasts).
- Small controls (checkbox, radio, switch) get an invisible `::after` hit area of 24px, or 44px at `size="lg"`.
- Every form control has a visible `<Label>`.
- Dialogs always have a title (use `sr-only` if it must be hidden).
- Motion respects `prefers-reduced-motion` (via the duration tokens).
- Tooltips never hold essential information or interactive content.

When a new token is added, check its contrast in **light and dark** and note the ratio in a comment in `tokens.css`.

## 7. Workflows

### 7.1 Port a component from shadcn

1. Pull the original into the staging folder (never committed):
   ```bash
   pnpm dlx shadcn@latest add <name> [<name> …]
   ```
   It lands in `components/ui/`. It may also add npm dependencies; drop any you don't keep (e.g. the `cn` package).
2. Rewrite it into `registry/chandratand/ui/<name>.tsx`, going through this checklist:
   - [ ] `cn` from `@/lib/utils`, Radix from `radix-ui`, icons from lucide with `aria-hidden`
   - [ ] No raw colours (`bg-black/50` → `bg-overlay`, `bg-destructive/10` → `bg-destructive-bg`, …)
   - [ ] Radius per 4.4, elevation per 4.6
   - [ ] `size` sm/md/lg on interactive controls → `h-control-*`, icons `size-icon-*` stroke 1.5
   - [ ] Focus ring and states per 5.3
   - [ ] Durations `duration-(--duration-*) ease-standard`
   - [ ] Variant names per 5.2 (no `"default"`)
   - [ ] Other chandratand/ui components imported from `@/registry/...`; no `next/*`, no `next-themes`
   - [ ] Doc comment: when to use it; inline comments only for a non-obvious why
3. Add the item to `registry.json` (`dependencies`, `registryDependencies` with `utils` and any `chandratand/ui/<name>`).
4. Give it a docs page: add `app/docs/_pages/<name>.tsx` (variants, sizes, states) and register it in `app/docs/_pages/index.ts`; the route `/docs/<name>` follows from `registry.json`. Check light and dark with the Mode toggle.
5. Run `pnpm lint`, `pnpm build`, `pnpm registry:build`, `pnpm test:e2e`.
6. Write a `CHANGELOG.md` entry (7.5).
7. Delete `components/`.

### 7.2 New component (not in shadcn)

Same as 7.1 from step 2, starting from the closest existing chandratand/ui component as a pattern.

### 7.3 Change or add a token

1. Edit `tokens/tokens.css` only (light in `:root`, dark in `.dark`; add to `[data-brand]` only if brand-driven).
2. Name it the shadcn way (`thing`, `thing-foreground`, `thing-bg`, `thing-border`).
3. Add `--color-thing: var(--thing)` (or the right namespace) to `tokens/theme.css`.
4. Check contrast in both modes; note the ratio in a comment.
5. `pnpm registry:build`, then update this document.
6. Write a `CHANGELOG.md` entry naming `tokens` (7.5).

### 7.4 Use chandratand/ui in an app

See `README.md`. In short: `shadcn init chandratand/ui/style` (tokens + every Component; or `init chandratand/ui/tokens`, then `add` components one by one), then each Block the app needs. Never a plain `shadcn init` first: it sets the app up for Base UI, and the CLI rewrites our Radix components for it so they no longer compile; an existing app switches `components.json` `style` to `new-york` before `add --overwrite`. The app sets `.dark` (and `data-brand` if a Brand other than the default exists) and loads fonts; components are never edited in the app.

### 7.5 Done criteria for a change

A change to a registry item (tokens, a Component or a Block) is done when:

- [ ] It is in `registry.json`.
- [ ] It has its own docs page at `/docs/<name>`, checked in light and dark. Tokens and the Style have no item page; their docs are the Tokens and Style sections on `app/page.tsx`, which also links to every item page.
- [ ] `pnpm lint`, `pnpm build`, `pnpm registry:build` and `pnpm test:e2e` pass (CI runs all four on every push and pull request, and fails if the committed registry output is stale). `test:e2e` fails when a Component or Block has no docs page or its page has a WCAG 2.2 AA violation in either Mode.
- [ ] A `CHANGELOG.md` entry is written: dated and naming the affected items. Until the first Consumer app installs, one line per item is enough. From then on, mark it **Breaking** when a Consumer app re-pulling with `--overwrite` would need to change its own code or markup.
- [ ] A Block also has a smoke test (7.6).

### 7.6 New Block

A Block is a composition of Components for one recurring screen (form in a sheet, login, data table). Unlike a Component, the Consumer app owns and edits it after install, so it is a known-good starting point, not an API to keep stable.

1. Put its files in `registry/chandratand/blocks/<name>/components/`, each a `registry:component` file. No `registry:page`: pages are framework-specific, and the app places the Block itself.
2. Same code rules as a Component (5.1): semantic utilities, no `next/*`, chandratand/ui Components imported from `@/registry/chandratand/ui/<name>`. Keep Block-only npm packages (e.g. TanStack Table) in the Block's `dependencies`, never in a Component's. One Block file importing another uses the same form, `@/registry/chandratand/blocks/<name>/components/<file>`: the CLI rewrites it to the Consumer's components alias, where the file lands.
3. Add a `registry:block` item to `registry.json` listing every chandratand/ui Component it uses as `chandratand/ui/<name>` in `registryDependencies`. Its docs page lists them under "Installs" on its own, from that list.
4. Docs page: `app/docs/_pages/<name>.tsx` with a live preview and short usage, registered in `index.ts`. A Block that fills the window (an app shell) gets a page of its own at `app/preview/<name>/page.tsx`, shown on the docs page in an `<iframe>` with a `title`: its landmarks stay top-level, and the Sidebar's phone layout follows the frame's width. The frame takes the Mode from the docs page through next-themes' storage sync.
5. Smoke test: `tests/blocks/<name>.ts` exports a `BlockSmoke` that drives the preview by keyboard and roles through the Block's main flow, calling `expectNoAxeViolations` in states the page load does not show (an open Sheet, an error). Register it in `tests/blocks.spec.ts`, which fails for a Block without one and runs it in both Modes.
6. Then 7.5.

## 8. Inventory

| Status | Components |
| --- | --- |
| **Done** | Style (`style`: tokens + every Component, no Blocks) · tokens · Button · Input · Textarea · Label · Select · Checkbox · Radio Group · Switch · Card · Badge · Alert · Dialog · Alert Dialog · Dropdown Menu · Popover · Tooltip · Toast (sonner) · Tabs · Table · Separator · Skeleton · Avatar · Sheet · Calendar · Date Picker · Pagination · Spinner · Empty · Field · Progress · Accordion · Scroll Area · Command · Combobox · Sidebar · Breadcrumb |
| **Later, if needed** | Carousel · Chart · Slider · Toggle Group · Hover Card · Navigation Menu · Context Menu · Input OTP · Resizable · Drawer · Collapsible · Kbd |

| Status | Blocks |
| --- | --- |
| **Done** | Form in Sheet (`form-sheet`) · App shell (`app-shell`) · Data table (`data-table`) · Login form (`login-form`) |
