import { expect } from "@playwright/test";

import { type BlockSmoke, expectNoAxeViolations } from "./harness";

export const appShellSmoke: BlockSmoke = async (page) => {
  const frame = page.getByTitle("App shell preview");
  const shell = frame.contentFrame();
  const nav = shell.getByRole("navigation", { name: "Primary" });
  const breadcrumb = shell.getByRole("navigation", { name: "Breadcrumb" });
  const trigger = shell.getByRole("button", { name: "Toggle sidebar" });

  // The frame takes the Mode from a storage event after the toggle; axe before that would
  // check the previous Mode.
  const colorScheme = () => document.documentElement.style.colorScheme;
  const mode = await page.evaluate(colorScheme);
  await expect.poll(() => shell.locator(":root").evaluate(colorScheme)).toBe(mode);
  await expectNoAxeViolations(page);

  const skipLink = shell.getByRole("link", { name: "Skip to content" });
  await page.getByRole("link", { name: "Open the preview full screen" }).focus();
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  for (const name of ["Dashboard", "Invoices", "Clients", "Reports"]) {
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name })).toBeFocused();
  }
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Enter");
  await expect(nav.getByRole("link", { name: "Clients" })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "Invoices" })).not.toHaveAttribute("aria-current", /.*/);
  await expect(breadcrumb.getByText("Clients")).toHaveAttribute("aria-current", "page");
  await expect(breadcrumb.getByRole("link", { name: "Dashboard" })).toBeVisible();
  await expect(shell.getByRole("heading", { level: 1, name: "Clients" })).toBeVisible();

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(nav.getByRole("link", { name: "Reports" })).toBeVisible();
  await expectNoAxeViolations(page);
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await skipLink.focus();
  await page.keyboard.press("Enter");
  await expect(shell.getByRole("main")).toBeFocused();

  // The Sidebar switches to a Sheet on the frame's width, which follows the page's.
  await page.setViewportSize({ width: 390, height: 800 });
  await expect(nav).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(breadcrumb.getByRole("link", { name: "Dashboard" })).toBeHidden();
  await trigger.focus();
  await page.keyboard.press("Enter");

  const sheet = shell.getByRole("dialog", { name: "Navigation" });
  await expect(sheet).toBeVisible();
  await expect(sheet).toBeFocused();
  await expectNoAxeViolations(page);
  for (const name of ["Dashboard", "Invoices", "Clients", "Reports"]) {
    await page.keyboard.press("Tab");
    await expect(sheet.getByRole("link", { name })).toBeFocused();
  }
  await page.keyboard.press("Enter");
  await expect(sheet).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(shell.getByRole("heading", { level: 1, name: "Reports" })).toBeVisible();
};
