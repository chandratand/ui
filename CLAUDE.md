@AGENTS.md

# chandratand/ui — design system

Shared tokens + React components for every chandratand project (portfolio, SaaS). Distributed as a **shadcn registry** (copy-paste, not an npm package): consumers start with `npx shadcn init chandratand/ui/style` (or `…/tokens`), then run `npx shadcn add chandratand/ui/<name>` (GitHub registry, this public repo) and own the copied code. Never a plain `shadcn init` first: its Base UI setup makes the CLI rewrite our Radix components (README).

**`docs/design-system.md`** holds the design rules with their reasons, the workflows (§7: port from shadcn, new component, change a token) and the component inventory with what's next (§8). Read it before writing or porting a component or touching a token; update it in the same change when a rule, token or inventory status changes. The hard rules below are the short version.

## Layout

| Path | What |
| --- | --- |
| `tokens/tokens.css` | **Source of truth** for all CSS variables: primitives, semantic (shadcn names), `.dark`, `[data-brand]` overrides (none today), reduced motion. Framework-agnostic. |
| `tokens/theme.css` | Tailwind v4 bridge (`@theme inline`, `dark` custom variant). |
| `scripts/tokens-to-registry.mjs` | Generates the `tokens` item (`registry:theme`) in `registry.json` from `tokens/*.css`. Mapping documented at the top of the file. |
| `scripts/style-to-registry.mjs` | Generates the `style` item (`registry:style`, `extends: "none"`): Tokens + every `registry:ui` item, no Blocks. |
| `registry/chandratand/ui/*.tsx` | Component source — what the registry ships. |
| `registry/chandratand/blocks/<name>/` | Block source (`registry:block`): Components composed into one screen pattern. The app owns it after install. Workflow in the design-system doc §7.6. |
| `CHANGELOG.md` | Hand-written, dated entries per change, naming affected items; **Breaking** marked. Tells Consumer apps when to re-pull with `--overwrite`. No version tags or changesets. |
| `.github/workflows/ci.yml` | CI: lint, build, registry build (+ stale-output check) on every push and PR. |
| `registry.json` | Registry manifest. The `tokens` and `style` items are generated: change `tokens/*.css` (or add a Component) and run `pnpm registry:build`. |
| `app/` | Docs site for this repo only (Next.js). Imports `tokens/*.css` directly. Not shipped. `app/page.tsx` is the index: links to every item page, plus the Style and Tokens sections. |
| `app/docs/` | Per-item docs pages: `/docs/<name>`, one per Component and Block in `registry.json`. Page bodies in `app/docs/_pages/`, registered in its `index.ts`. |
| `app/preview/<name>/` | Full-page preview of a Block that fills the window (app shell), shown on its docs page in an iframe. Docs only, not shipped. How: design-system doc §7.6. |
| `tests/` | Playwright suite over the docs pages: fails on an item without a page and runs axe (WCAG 2.2 AA) in light and dark Mode, on every item page and the home index. `blocks.spec.ts` runs each Block's smoke test (`tests/blocks/<name>.ts`) in both Modes and fails for a Block without one. |
| `components.json` | shadcn CLI config for this repo (matches the official `registry-template`). Not shipped. |
| `components/ui/` | Staging for shadcn originals while porting. Never committed; delete after the port. |

## Hard rules

1. **Components are framework-agnostic React.** Never import `next/*` (link, image, font, navigation) inside `registry/`. Accept `asChild` (`Slot.Root` from `radix-ui`) so apps can pass their own `<Link>`.
2. **Semantic utilities only** in components (`bg-primary`, `text-muted-foreground`, `border-input`, `font-heading`). Hex values and `brand-*` ramps live in tokens and docs.
3. **Token names follow shadcn exactly.** Additions follow the same pattern (`success`, `success-foreground`, `success-bg`, `success-border`).
4. **Theming:** mode = `.dark` class; brand = `data-brand` attribute. Brands override semantic tokens only (primary family, `ring`, `chart-1`); components never know which brand is active. chandratand is the default and only Brand; how to add one is in the design-system doc §3. Tokens ship as `cssVars` + `css` on a `registry:theme`, so `shadcn add` merges them into the consumer's `globals.css`.
5. **Sizes:** interactive components take `size: "sm" | "md" | "lg"` → `h-control-sm|md|lg` (32/36/44px). Default `md`.
6. **Radius:** `rounded-sm` 2px (badges, checkboxes), `rounded-md` 4px (inputs, buttons), `rounded-lg` 6px (cards, dialogs). Only avatars, switches and radio buttons go rounder.
7. **Elevation:** borders first. Cards: `border`, no shadow. `shadow-sm` popovers/dropdowns/toasts; `shadow-lg` dialogs/sheets.
8. **Accessibility (WCAG 2.2 AA):** text ≥ 4.5:1; form borders, focus rings, meaningful icons ≥ 3:1. Focus = `focus-visible:ring-2 ring-ring ring-offset-2`. Status always pairs color with icon or text. Motion uses `duration-(--duration-*)`, which collapses to 0 under reduced motion.
9. **Icons:** lucide-react, stroke 1.5, `size-icon-sm` (16) / `size-icon-lg` (20). Exception: the Checkbox mark uses stroke 2 (legibility at 14px).
10. **Radix:** import from the unified `radix-ui` package (`import { Dialog as DialogPrimitive } from "radix-ui"`), never `@radix-ui/react-*`. Registry `dependencies`: `"radix-ui"`.
11. **One component using another** needs two things:
    - Import it via `@/registry/...` (e.g. `import { Button } from "@/registry/chandratand/ui/button"`). The CLI rewrites `@/registry` to the consumer's alias on install; `@/components/...` and relative paths break.
    - List it in `registryDependencies` as `chandratand/ui/<name>`. A bare `"button"` resolves to **shadcn's** Button. Bare `"utils"` is intentional (shadcn's `cn`, imported as `@/lib/utils`).
12. **Fix chandratand/ui components here**, then re-pull into apps with `npx shadcn add … --overwrite`. Consuming apps never edit them.
13. **Every change to a registry item (tokens, a Component or a Block) is done when** it's in `registry.json`, has its own docs page at `/docs/<name>` (tokens and the Style: their sections on `app/page.tsx`) checked in light + dark, `pnpm lint`, `pnpm build`, `pnpm registry:build`, `pnpm test:e2e` all pass, and a Changelog entry is written (design-system doc §7.5).

## Commands

pnpm (version pinned in `package.json` → `packageManager`). Consumer-facing docs keep `npx shadcn add`, since apps use any package manager.

`pnpm registry:build` runs `tokens/*.css` → `registry.json` tokens item, then the style item (Tokens + every Component), then `shadcn build` → `public/r/*.json`.

`pnpm test:e2e` runs the Playwright suite (starts `next dev` on port 3100, or reuses one; in CI it serves the build). First run locally: `pnpm exec playwright install chromium`. Tests assert roles, names, focus and axe results only (plus computed animation state, for reduced-motion criteria), never class names or DOM structure.

## Open decisions (revisit when the SaaS starts)

- Copy-paste vs an npm package for components, and `@chandratand/ui-tokens` on npm.
- Registry hosting. The GitHub registry needs none until then. Candidate `chandratand-ui.vercel.app`.

## Agent skills

### Issue tracker

GitHub Issues on chandratand/ui, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` + `docs/adr/`. See `docs/agents/domain.md`.
