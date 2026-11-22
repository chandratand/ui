import { expect, test } from "@playwright/test";

test("Progress exposes its label and value to assistive tech", async ({ page }) => {
  await page.goto("/docs/progress");

  const progress = page.getByRole("progressbar", { name: "Uploading invoice.pdf" });
  await expect(progress).toHaveAttribute("aria-valuemin", "0");
  await expect(progress).toHaveAttribute("aria-valuemax", "100");
  await expect(progress).toHaveAttribute("aria-valuenow", "60");
  await expect(progress).toHaveAttribute("aria-valuetext", "60%");
});
