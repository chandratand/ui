import { expect, test } from "@playwright/test";

import registry from "../registry.json" with { type: "json" };
import { appShellSmoke } from "./blocks/app-shell";
import { formSheetSmoke } from "./blocks/form-sheet";
import type { BlockSmoke } from "./blocks/harness";
import { gotoHydrated } from "./hydration";

/**
 * One smoke interaction per Block, keyed by registry name. A Block missing here fails the
 * suite: add `tests/blocks/<name>.ts` exporting a `BlockSmoke` and register it.
 */
const smokeTests: Record<string, BlockSmoke> = {
  "app-shell": appShellSmoke,
  "form-sheet": formSheetSmoke,
};

const blocks = registry.items.filter((item) => item.type === "registry:block");
const titleOf = new Map(registry.items.map((item) => [item.name, item.title]));
const ownPrefix = "chandratand/ui/";

for (const block of blocks) {
  const url = `/docs/${block.name}`;

  test.describe(`${block.title} Block`, () => {
    test("docs page lists every Component it installs", async ({ page }) => {
      await page.goto(url);
      const installs = page.getByRole("navigation", { name: "Components installed" });
      const components = (block.registryDependencies ?? []).filter((dep) =>
        dep.startsWith(ownPrefix),
      );
      expect(components.length).toBeGreaterThan(0);
      for (const dep of components) {
        const name = dep.slice(ownPrefix.length);
        await expect(
          installs.getByRole("link", { name: titleOf.get(name), exact: true }),
        ).toHaveAttribute("href", `/docs/${name}`);
      }
    });

    for (const mode of ["Light", "Dark"] as const) {
      test(`its Components compose: keyboard smoke test in ${mode} mode`, async ({ page }) => {
        // A smoke test walks a whole flow with several axe scans; on `next dev` that can pass 30s.
        test.slow();
        const smoke = smokeTests[block.name];
        expect(smoke, `no smoke test registered for ${block.name} in tests/blocks.spec.ts`).toBeDefined();
        await gotoHydrated(page, url);
        const toggle = page.getByRole("button", { name: mode, exact: true });
        await toggle.click();
        await expect(toggle).toHaveAttribute("aria-pressed", "true");
        await smoke(page);
      });
    }
  });
}
