import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import registry from "../registry.json" with { type: "json" };

// Read from registry.json directly, not app/docs/manifest.ts, so a bug there cannot hide an item.
const documentedTypes = new Set(["registry:ui", "registry:block"]);
const items = registry.items.filter((item) => documentedTypes.has(item.type));
const wcag22aa = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const item of items) {
  const url = `/docs/${item.name}`;

  test.describe(item.title, () => {
    // Asserted by content, not status: with partial prerendering an unlisted param streams
    // its not-found page with a 200.
    test("has a docs page", async ({ page }) => {
      await page.goto(url);
      await expect(page.getByRole("heading", { level: 1, name: item.title })).toBeVisible();
    });

    for (const mode of ["Light", "Dark"] as const) {
      test(`has no WCAG 2.2 AA violations in ${mode} mode`, async ({ page }) => {
        await page.goto(url);
        const toggle = page.getByRole("button", { name: mode, exact: true });
        await toggle.click();
        await expect(toggle).toHaveAttribute("aria-pressed", "true");

        const { violations } = await new AxeBuilder({ page }).withTags(wcag22aa).analyze();
        expect(violations).toEqual([]);
      });
    }
  });
}
