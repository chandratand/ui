import { expect, test } from "@playwright/test";

test("Accordion expands, collapses and moves between sections by keyboard", async ({ page }) => {
  // Keys pressed before hydration are lost; network idle means the client bundle has run.
  await page.goto("/docs/accordion", { waitUntil: "networkidle" });

  const billing = page.getByRole("button", { name: "Can I change my billing plan?" });
  const refunds = page.getByRole("button", { name: "Do you offer refunds?" });
  await expect(billing).toHaveAttribute("aria-expanded", "false");

  await billing.focus();
  await page.keyboard.press("Enter");
  await expect(billing).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("region", { name: "Can I change my billing plan?" })).toBeVisible();

  await page.keyboard.press("Space");
  await expect(billing).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("region", { name: "Can I change my billing plan?" })).toBeHidden();

  await page.keyboard.press("ArrowDown");
  await expect(refunds).toBeFocused();
});

test("Accordion opens and closes without animation under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Keys pressed before hydration are lost; network idle means the client bundle has run.
  await page.goto("/docs/accordion", { waitUntil: "networkidle" });

  const billing = page.getByRole("button", { name: "Can I change my billing plan?" });
  await billing.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Can I change my billing plan?" })).toBeVisible();

  const runningDurations = await page.evaluate(() =>
    document.getAnimations().map((animation) => animation.effect?.getComputedTiming().duration),
  );
  expect(runningDurations.filter((duration) => Number(duration) > 0)).toEqual([]);
});
