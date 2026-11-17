import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Combobox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/combobox");
  });

  test("picks a client by keyboard: open, filter, arrow, Enter", async ({ page }) => {
    const trigger = page.getByRole("combobox", { name: "Client", exact: true });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const search = page.getByRole("combobox", { name: "Search clients" });
    await expect(search).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("option", { name: "Bumi Persada" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await page.keyboard.type("sinar");
    await expect(page.getByRole("option")).toHaveText(["Sinar Abadi Antara"]);

    await page.keyboard.press("Enter");
    await expect(page.getByRole("listbox")).toBeHidden();
    await expect(trigger).toHaveText("Sinar Abadi Antara");
    await expect(trigger).toBeFocused();
  });

  test("Escape closes without picking and returns focus to the trigger", async ({ page }) => {
    const trigger = page.getByRole("combobox", { name: "Client", exact: true });
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("listbox")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toHaveText("Select a client");
    await expect(trigger).toBeFocused();
  });

  test("says so when nothing matches the search", async ({ page }) => {
    await page.getByRole("combobox", { name: "Client", exact: true }).click();
    await page.getByRole("combobox", { name: "Search clients" }).fill("zzz");
    await expect(page.getByRole("option")).toHaveCount(0);
    await expect(page.getByText("No clients found.")).toBeVisible();
  });

  test("links the error message to the invalid field", async ({ page }) => {
    const invalid = page.getByRole("combobox", { name: "Invoice client" });
    await expect(invalid).toHaveAttribute("aria-invalid", "true");
    await expect(invalid).toHaveAccessibleDescription("Choose a client.");
  });

  test("skips disabled options and the disabled field", async ({ page }) => {
    await expect(page.getByRole("combobox", { name: "Archived client" })).toBeDisabled();
    await page.getByRole("combobox", { name: "Client", exact: true }).click();
    await expect(page.getByRole("option", { name: "Tirta Utama" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("has no WCAG 2.2 AA violations while open", async ({ page }) => {
    await page.getByRole("combobox", { name: "Client", exact: true }).click();
    await expect(page.getByRole("listbox")).toBeVisible();
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(violations).toEqual([]);
  });
});

test.describe("Command", () => {
  test("filters and shows an empty message inline", async ({ page }) => {
    await page.goto("/docs/command");
    const search = page.getByRole("combobox", { name: "Search commands" });
    await search.fill("calc");
    await expect(page.getByRole("option")).toHaveText(["Calculator"]);
    await search.fill("zzz");
    await expect(page.getByText("No results found.")).toBeVisible();
  });

  test("opens as a command palette dialog and closes with Escape", async ({ page }) => {
    await page.goto("/docs/command");
    const opener = page.getByRole("button", { name: "Open command palette" });
    await opener.click();
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await expect(dialog.getByRole("combobox", { name: "Search commands" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });
});
