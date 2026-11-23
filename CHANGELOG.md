# Changelog

What changed in chandratand/ui, newest first. Each entry is dated and names the registry items it affects. Re-pull those items in a Consumer app with `npx shadcn add chandratand/ui/<item> --overwrite`.

**Breaking** marks a change that needs work in the Consumer app after the re-pull (renamed or removed tokens, props or variants, changed markup). It applies from the first Consumer app on: before that, nothing can break.

No version tags or changesets: whatever is on `main` is released, and the date is the version. A Consumer app notes the date it last pulled and reads the entries above it.

## 2026-11-23

- Baseline. No Consumer app has installed anything yet, so earlier changes are not listed here; `git log` has them. Entries from here on stay one line per item until the first Consumer app installs, which gets its own entry.
