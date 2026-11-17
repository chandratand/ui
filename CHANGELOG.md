# Changelog

What changed in chandratand/ui, newest first. Each entry is dated and names the registry items it affects. Re-pull those items in a Consumer app with `npx shadcn add chandratand/ui/<item> --overwrite`.

**Breaking** marks a change that needs work in the Consumer app after the re-pull (renamed or removed tokens, props or variants, changed markup).

No version tags or changesets: the date is the version.

## 2026-11-17

- Docs site: `/docs/<name>` reads its URL param inside `<Suspense>`, so client navigation shows the shared page chrome at once and streams the item content. No registry item changed, so nothing to re-pull.
- Docs site: each Component and Block gets its own page at `/docs/<name>`, generated from `registry.json`. `button` is the first; the rest move over from the demo page next. No registry item changed, so nothing to re-pull.
- **Breaking** · `tokens`: removed the `saas` Brand. Its `[data-brand="saas"]` overrides were identical to the default, so nothing changes visually, but `shadcn add` merges CSS and does not delete it: remove the `[data-brand="saas"]` rules from your `globals.css` by hand, and drop `data-brand="saas"` from `<html>`. The `data-brand` mechanism stays; see `docs/design-system.md` §3 for how to add a Brand.
- `tokens`: added `overlay`, the scrim behind dialogs and sheets.
- Added the rest of the Priority 1 components: `radio-group`, `alert`, `dialog`, `alert-dialog`, `dropdown-menu`, `popover`, `tooltip`, `sonner`, `tabs`, `table`, `separator`, `skeleton`, `avatar`.
- **Breaking** · all items: registry slug renamed from `chandratand/ct-ui` to `chandratand/ui`. Install from `chandratand/ui/<item>`; `registryDependencies` of re-pulled items now point there.

## 2026-11-15

- First items: `tokens` (as a `registry:theme`), `button`, `input`, `card`, `badge`, `label`, `textarea`, `select`, `checkbox`, `switch`.
