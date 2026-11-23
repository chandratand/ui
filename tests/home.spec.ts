import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import registry from "../registry.json" with { type: "json" };

const indexByType: Record<string, string> = { "registry:ui": "Components", "registry:block": "Blocks" };
const items = registry.items.filter((item) => item.type in indexByType);
const wcag22aa = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test("home page links to every Component and Block docs page", async ({ page }) => {
  await page.goto("/");
  for (const item of items) {
    const index = page.getByRole("navigation", { name: indexByType[item.type] });
    await expect(index.getByRole("link", { name: item.title, exact: true })).toHaveAttribute(
      "href",
      `/docs/${item.name}`,
    );
  }
});

test("home page explains the Style install and that Blocks install one by one", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Style" });
  await expect(section).toContainText("npx shadcn add chandratand/ui/style");
  await expect(section).toContainText(/Blocks are not included/i);
});

test("home page shows the Tokens", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 2, name: "Tokens" })).toBeVisible();
});

for (const mode of ["Light", "Dark"] as const) {
  test(`home page has no WCAG 2.2 AA violations in ${mode} mode`, async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: mode, exact: true });
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    const { violations } = await new AxeBuilder({ page }).withTags(wcag22aa).analyze();
    expect(violations).toEqual([]);
  });
}
