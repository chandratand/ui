import { expect, test } from "@playwright/test";

test.describe("Pagination", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/pagination");
  });

  test("is a navigation landmark that marks the current page", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Pagination" }).first();
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "2", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(nav.getByRole("link", { name: "1", exact: true })).not.toHaveAttribute(
      "aria-current",
      /.*/,
    );
  });

  test("labels previous and next", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Pagination" }).first();
    await expect(nav.getByRole("link", { name: "Go to previous page" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Go to next page" })).toBeVisible();
  });

  test("pages through with a custom link passed via asChild, by keyboard", async ({ page }) => {
    const section = page.getByRole("region", { name: "With a router link" });
    const nav = section.getByRole("navigation", { name: "Pagination" });
    await expect(nav.getByRole("link", { name: "1", exact: true })).toHaveAttribute("aria-current", "page");

    const next = nav.getByRole("link", { name: "Go to next page" });
    await next.focus();
    await expect(next).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(nav.getByRole("link", { name: "2", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(section.getByText("Showing page 2 of 5")).toBeVisible();
  });

  test("the ellipsis is as tall as the page links of its size", async ({ page }) => {
    const navs = page.getByRole("region", { name: "Sizes" }).getByRole("navigation");
    await expect(navs).toHaveCount(3);
    for (const nav of await navs.all()) {
      const link = await nav.getByRole("link", { name: "1", exact: true }).boundingBox();
      const ellipsis = await nav
        .getByRole("listitem")
        .filter({ hasText: "More pages" })
        .boundingBox();
      expect(ellipsis?.height).toBe(link?.height);
    }
  });

  test("disables previous on the first page", async ({ page }) => {
    const section = page.getByRole("region", { name: "With a router link" });
    await expect(section.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
