import { expect, type Locator, test } from "@playwright/test";

const focusIsInside = (container: Locator) =>
  container.evaluate((el) => el.contains(document.activeElement));

const sides = ["top", "right", "bottom", "left"] as const;

test.describe("Sheet", () => {
  for (const side of sides) {
    test(`opens from the ${side}, traps focus, closes on Escape and returns focus`, async ({
      page,
    }) => {
      await page.goto("/docs/sheet");
      const trigger = page.getByRole("button", { name: `Open ${side} sheet` });
      await trigger.click();

      const sheet = page.getByRole("dialog", { name: `Sheet from the ${side}` });
      await expect(sheet).toBeVisible();
      await expect.poll(() => focusIsInside(sheet)).toBe(true);

      // Tabbing past the last control must wrap inside the sheet, never reach the page.
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press("Tab");
        expect(await focusIsInside(sheet)).toBe(true);
      }

      await page.keyboard.press("Escape");
      await expect(sheet).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  }

  test("closes from its close button", async ({ page }) => {
    await page.goto("/docs/sheet");
    await page.getByRole("button", { name: "Open right sheet" }).click();
    const sheet = page.getByRole("dialog", { name: "Sheet from the right" });
    await sheet.getByRole("button", { name: "Close", exact: true }).click();
    await expect(sheet).toBeHidden();
  });

  test("does not animate under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/sheet");
    await page.getByRole("button", { name: "Open right sheet" }).click();
    const sheet = page.getByRole("dialog", { name: "Sheet from the right" });
    await expect(sheet).toBeVisible();
    const duration = await sheet.evaluate((el) => getComputedStyle(el).animationDuration);
    expect(duration).toBe("0s");
  });

  test("animates when motion is allowed", async ({ page }) => {
    await page.goto("/docs/sheet");
    await page.getByRole("button", { name: "Open right sheet" }).click();
    const sheet = page.getByRole("dialog", { name: "Sheet from the right" });
    await expect(sheet).toBeVisible();
    const duration = await sheet.evaluate((el) => getComputedStyle(el).animationDuration);
    expect(duration).not.toBe("0s");
  });
});
