import { expect, test } from "@playwright/test";

test.describe("Empty", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/empty");
  });

  test("explains the empty state in text and offers a next action", async ({ page }) => {
    const usage = page.getByRole("region", { name: "Usage" });
    await expect(usage.getByRole("heading", { name: "No clients yet" })).toBeVisible();
    await expect(
      usage.getByText("Add your first client to send them invoices."),
    ).toBeVisible();

    const action = usage.getByRole("button", { name: "Add client" });
    await action.focus();
    await expect(action).toBeFocused();
  });

  test("works without an action", async ({ page }) => {
    const section = page.getByRole("region", { name: "Without an action" });
    await expect(section.getByRole("heading", { name: "No results" })).toBeVisible();
    await expect(section.getByText(/Try a different search/)).toBeVisible();
    await expect(section.getByRole("button")).toHaveCount(0);
  });
});
