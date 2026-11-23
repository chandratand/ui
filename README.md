# chandratand/ui

The chandratand design system: tokens and React components shared by the chandratand portfolio and SaaS. Built on shadcn/ui conventions, Tailwind CSS v4 and Radix.

- Brand anchor `#326897` · WCAG 2.2 AA · light + dark · Brand overrides via `data-brand`
- Framework-agnostic React components (no `next/*` imports) — works in Next.js, Vite, React Router

## Use in a project

Requires Tailwind CSS v4. The components are built on Radix, so the app must be a Radix shadcn project: start it with one of our items, not a plain `shadcn init` (see step 1).

1. Start the app with the Style: the Tokens and every Component in one command. The shadcn CLI writes `components.json` and merges the tokens into your `globals.css` (`:root`, `.dark`, `@theme inline`, base layer and reduced-motion rules):

   ```bash
   npx shadcn@latest init chandratand/ui/style
   ```

   Or start with the Tokens only, then add just the components you need:

   ```bash
   npx shadcn@latest init chandratand/ui/tokens
   npx shadcn@latest add chandratand/ui/button chandratand/ui/input
   ```

   Don't run a plain `npx shadcn init` first. It now sets the app up for Base UI (`"style": "base-nova"`), and the CLI then rewrites our Radix components (`asChild` → `render`) into code that does not compile.

   **Already a shadcn app?**

   1. If `style` in `components.json` starts with `base-`, change it to `"style": "new-york"`.
   2. Add with `--overwrite`, so our components replace shadcn's files of the same name (without it the CLI stops at a prompt and installs nothing):

      ```bash
      npx shadcn@latest add chandratand/ui/style --overwrite
      ```

   3. In your own code, swap Base UI `render={…}` props for `asChild`. shadcn-only leftovers (`--sidebar-*` variables, `@base-ui/react`) are unused and can be removed.

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
