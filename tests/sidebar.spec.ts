import { expect, test } from "@playwright/test";

import { gotoHydrated } from "./hydration";

test.describe("Sidebar", () => {
  test("collapses and expands from its trigger, by keyboard", async ({ page }) => {
    await gotoHydrated(page, "/docs/sidebar");
    const preview = page.getByRole("region", { name: "Usage" });
    const trigger = preview.getByRole("button", { name: "Toggle sidebar" });
    const nav = preview.getByRole("navigation", { name: "Main" });

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(nav.getByRole("link", { name: "Invoices" })).toBeVisible();

    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(nav).toBeHidden();

    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(nav.getByRole("link", { name: "Invoices" })).toBeVisible();
  });

  test("a collapsed sidebar is out of the tab order", async ({ page }) => {
    await gotoHydrated(page, "/docs/sidebar");
    const preview = page.getByRole("region", { name: "Usage" });
    const trigger = preview.getByRole("button", { name: "Toggle sidebar" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    // It leaves the tab order when the slide-out ends, not on the click.
    await expect(preview.getByRole("navigation", { name: "Main" })).toBeHidden();

    // The trigger is the first control after the sidebar, so Shift+Tab leaves the preview.
    await page.keyboard.press("Shift+Tab");
    expect(await preview.evaluate((el) => el.contains(document.activeElement))).toBe(false);
  });

  test("marks the active item as the current page", async ({ page }) => {
    await gotoHydrated(page, "/docs/sidebar");
    const nav = page.getByRole("region", { name: "Usage" }).getByRole("navigation", { name: "Main" });
    const invoices = nav.getByRole("link", { name: "Invoices" });
    const clients = nav.getByRole("link", { name: "Clients" });
    await expect(invoices).toHaveAttribute("aria-current", "page");
    await expect(clients).not.toHaveAttribute("aria-current", /.*/);


    await clients.focus();
    await page.keyboard.press("Enter");
    await expect(clients).toHaveAttribute("aria-current", "page");
    await expect(invoices).not.toHaveAttribute("aria-current", /.*/);
  });

  test("collapsed to icons, items keep their names and show them as tooltips on focus", async ({
    page,
  }) => {
    await gotoHydrated(page, "/docs/sidebar");
    const preview = page.getByRole("region", { name: "Collapse to icons" });
    await expect(preview.getByRole("button", { name: "Toggle sidebar" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    const reports = preview.getByRole("navigation", { name: "Main" }).getByRole("link", {
      name: "Reports",
    });
    await expect(reports).toBeVisible();
    // Focus before hydration opens nothing; retry until the tooltip's handler is attached.
    await expect(async () => {
      await reports.blur();
      await reports.focus();
      await expect(page.getByRole("tooltip", { name: "Reports" })).toBeVisible({ timeout: 1000 });
    }).toPass();
  });

  test.describe("on a small screen", () => {
    test.use({ viewport: { width: 390, height: 800 } });

    test("opens as a Sheet and closes after navigating", async ({ page }) => {
      await gotoHydrated(page, "/docs/sidebar");
      const preview = page.getByRole("region", { name: "Usage" });
      const trigger = preview.getByRole("button", { name: "Toggle sidebar" });
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      await trigger.focus();
      await page.keyboard.press("Enter");
      const sheet = page.getByRole("dialog", { name: "Sidebar" });
      await expect(sheet).toBeVisible();
      // The open Sheet hides the page from assistive tech, so read the trigger as a DOM node.
      await expect(
        page.getByRole("button", { name: "Toggle sidebar", includeHidden: true }).first(),
      ).toHaveAttribute("aria-expanded", "true");

      const clients = sheet.getByRole("link", { name: "Clients" });
      await clients.focus();
      await page.keyboard.press("Enter");
      await expect(sheet).toBeHidden();
      await expect(trigger).toBeFocused();
      await expect(preview.getByText("Clients", { exact: true }).first()).toBeVisible();
    });

    test("closes the Sheet on Escape and returns focus to the trigger", async ({ page }) => {
      await gotoHydrated(page, "/docs/sidebar");
      const trigger = page
        .getByRole("region", { name: "Usage" })
        .getByRole("button", { name: "Toggle sidebar" });
      await trigger.click();
      const sheet = page.getByRole("dialog", { name: "Sidebar" });
      await expect(sheet).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(sheet).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  });

  test("toggles with Ctrl+B", async ({ page }) => {
    await gotoHydrated(page, "/docs/sidebar");
    const trigger = page
      .getByRole("region", { name: "Usage" })
      .getByRole("button", { name: "Toggle sidebar" });
    // The shortcut listener attaches on hydration, which can land after network idle.
    await expect(async () => {
      await page.keyboard.press("Control+b");
      await expect(trigger).toHaveAttribute("aria-expanded", "false", { timeout: 1000 });
    }).toPass();
    await page.keyboard.press("Control+b");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("leaves Ctrl+B to a text field that has focus", async ({ page }) => {
    await gotoHydrated(page, "/docs/sidebar");
    const preview = page.getByRole("region", { name: "Usage" });
    const trigger = preview.getByRole("button", { name: "Toggle sidebar" });
    const search = preview.getByRole("searchbox", { name: "Search" });
    // Prove the shortcut is live first, so a pass below is not just an unhydrated page.
    await expect(async () => {
      await page.keyboard.press("Control+b");
      await expect(trigger).toHaveAttribute("aria-expanded", "false", { timeout: 1000 });
    }).toPass();
    await page.keyboard.press("Control+b");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await search.focus();
    await page.keyboard.press("Control+b");
    await page.keyboard.type("ok");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(search).toHaveValue("ok");
  });
});
