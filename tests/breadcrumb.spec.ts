import { expect, test } from "@playwright/test";

test.describe("Breadcrumb", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/breadcrumb");
  });

  test("is a navigation landmark that marks the current page", async ({ page }) => {
    const nav = page.getByRole("region", { name: "Usage" }).getByRole("navigation", {
      name: "Breadcrumb",
    });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "Invoices" })).toBeVisible();
    await expect(nav.getByText("INV-2026-0142")).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "INV-2026-0142" })).toHaveCount(0);
  });

  test("navigates with a custom link passed via asChild, by keyboard", async ({ page }) => {
    const section = page.getByRole("region", { name: "With a router link" });
    const nav = section.getByRole("navigation", { name: "Breadcrumb" });
    await expect(nav.getByText("Client", { exact: true })).toHaveAttribute("aria-current", "page");

    const clients = nav.getByRole("link", { name: "Clients" });
    await clients.focus();
    await expect(clients).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(nav.getByText("Clients", { exact: true })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Clients" })).toHaveCount(0);
    await expect(section.getByText("Showing Clients")).toBeVisible();
  });

  test("announces collapsed levels", async ({ page }) => {
    const nav = page
      .getByRole("region", { name: "Collapsed" })
      .getByRole("navigation", { name: "Breadcrumb" });
    await expect(nav.getByRole("button", { name: "Show hidden levels" })).toBeVisible();
  });
});
