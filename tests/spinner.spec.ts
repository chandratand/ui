import { expect, test } from "@playwright/test";

test.describe("Spinner", () => {
  test("exposes an accessible loading status", async ({ page }) => {
    await page.goto("/docs/spinner");
    await expect(page.getByRole("status", { name: "Loading" }).first()).toBeVisible();
    await expect(page.getByRole("status", { name: "Loading clients" })).toBeVisible();
  });

  test("a button that is busy keeps its own name and is disabled", async ({ page }) => {
    await page.goto("/docs/spinner");
    await expect(page.getByRole("button", { name: "Saving" })).toBeDisabled();
  });

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`animates only without reduced motion (${reducedMotion})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto("/docs/spinner");
      const spinner = page.getByRole("status", { name: "Loading" }).first();
      await expect(spinner).toBeVisible();
      const running = await spinner.evaluate((element) => element.getAnimations().length);
      expect(running > 0).toBe(reducedMotion === "no-preference");
    });
  }
});
