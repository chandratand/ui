import { expect } from "@playwright/test";

import { type BlockSmoke, expectNoAxeViolations } from "./harness";

export const dataTableSmoke: BlockSmoke = async (page) => {
  const table = page.getByRole("table", { name: "Invoices" });
  const summary = page.getByRole("status").filter({ hasText: /^(Showing|No|Loading)/ });
  const search = page.getByRole("searchbox", { name: "Search invoices" });
  // The header row plus a page of 10.
  await expect(table.getByRole("row")).toHaveCount(11);
  await expect(summary).toHaveText("Showing 1–10 of 24");

  await search.focus();
  await page.keyboard.type("zzz");
  await expect(page.getByRole("heading", { name: "No invoices match" })).toBeVisible();
  await expect(summary).toHaveText("No invoices match");
  await expectNoAxeViolations(page);

  const clear = page.getByRole("button", { name: "Clear search and filter" });
  await clear.focus();
  await page.keyboard.press("Enter");
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();
  await expect(summary).toHaveText("Showing 1–10 of 24");

  const loading = page.getByRole("switch", { name: "Show loading state" });
  await loading.focus();
  await page.keyboard.press("Space");
  await expect(summary).toHaveText("Loading invoices");
  await expect(table).toHaveAttribute("aria-busy", "true");
  await expectNoAxeViolations(page);
  await page.keyboard.press("Space");
  await expect(summary).toHaveText("Showing 1–10 of 24");

  const pages = page.getByRole("navigation", { name: "Invoices pages" });
  const next = pages.getByRole("button", { name: "Go to next page" });
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(pages.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  await expect(summary).toHaveText("Showing 11–20 of 24");
  await page.keyboard.press("Enter");
  await expect(summary).toHaveText("Showing 21–24 of 24");
  await expect(next).toHaveAttribute("aria-disabled", "true");
  await expect(next).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(summary).toHaveText("Showing 21–24 of 24");

  const client = page.getByRole("combobox", { name: "Client", exact: true });
  await client.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("combobox", { name: "Search client" })).toBeFocused();
  await page.keyboard.type("maju");
  await page.keyboard.press("Enter");
  await expect(client).toHaveText("Maju Jaya");
  await expect(client).toBeFocused();
  await expect(summary).toHaveText("Showing 1–4 of 4");
  await expect(table.getByRole("row").filter({ hasText: "Maju Jaya" })).toHaveCount(4);
  await expect(pages).toBeHidden();

  await page.keyboard.press("Enter");
  await page.keyboard.type("all");
  await page.keyboard.press("Enter");
  await expect(client).toHaveText("All clients");
  await expect(summary).toHaveText("Showing 1–10 of 24");

  // A row action on page 2 changes the data; the page and the focus must hold.
  const page2 = pages.getByRole("button", { name: "Page 2" });
  await page2.focus();
  await page.keyboard.press("Enter");
  await expect(summary).toHaveText("Showing 11–20 of 24");
  const row = table.getByRole("row").filter({ hasText: "INV-0014" });
  await expect(row.getByText("Sent", { exact: true })).toBeVisible();
  const actions = row.getByRole("button", { name: "Actions for INV-0014" });
  await actions.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitem", { name: "View invoice" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menu.getByRole("menuitem", { name: "Mark as paid" })).toBeFocused();
  await expectNoAxeViolations(page);
  await page.keyboard.press("Enter");
  await expect(menu).toBeHidden();
  await expect(actions).toBeFocused();
  await expect(row.getByText("Paid", { exact: true })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "Marked INV-0014 as paid." })).toBeVisible();
  await expect(summary).toHaveText("Showing 11–20 of 24");
};
