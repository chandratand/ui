# chandratand/ui

The chandratand design system: tokens and React components shared by the chandratand portfolio and SaaS. Built on shadcn/ui conventions, Tailwind CSS v4 and Radix.

- Brand anchor `#326897` · WCAG 2.2 AA · light + dark · Brand overrides via `data-brand`
- Framework-agnostic React components (no `next/*` imports) — works in Next.js, Vite, React Router

## Use in a project

Requires a shadcn project (`components.json`, Tailwind CSS v4).

1. Add the Style: the Tokens and every Component in one command. The shadcn CLI merges the tokens into your `globals.css` (`:root`, `.dark`, `@theme inline` and reduced-motion rules):

   ```bash
   npx shadcn@latest add chandratand/ui/style
   ```

   Or pick: `chandratand/ui/tokens` first, then only the components you need (`chandratand/ui/button chandratand/ui/input …`).

2. Add Blocks one by one; the Style does not include them, since the app owns and edits a Block after install:

   ```bash
   npx shadcn@latest add chandratand/ui/login-form
   ```

   The registry is this public GitHub repo (root `registry.json`); no hosting or `components.json` entry is needed.

3. Theming is the app's job: put `.dark` on `<html>` for dark mode (e.g. `next-themes` with `attribute="class"`). Load your fonts and set `--font-sans` / `--font-mono` on `html`.

Never edit chandratand/ui components inside an app. Fix them here, then pull again with `npx shadcn add … --overwrite`. [`CHANGELOG.md`](CHANGELOG.md) says what changed and when a re-pull needs changes on your side (**Breaking**).

## Develop

```bash
pnpm install
pnpm dev              # docs at localhost:3000, one page per item at /docs/<name>
pnpm registry:build   # tokens/*.css → registry.json tokens + style items, then public/r/*.json
pnpm test:e2e         # Playwright + axe over every docs page, light and dark
```

Design rules and workflows: [`docs/design-system.md`](docs/design-system.md). Short rules for Claude Code: `CLAUDE.md`.
