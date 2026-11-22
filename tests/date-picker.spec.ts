import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Pinned so "today", the month shown on open and the expected names are stable.
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 17, 10, 0));
});

test("Date Picker is operable by keyboard and returns focus to its trigger", async ({ page }) => {
  await page.goto("/docs/date-picker");
  const trigger = page.getByRole("button", { name: /^Due date/ });

  await trigger.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("grid", { name: "November 2026" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: /November 17, 2026/ })).toBeFocused();

  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("button", { name: /November 18, 2026/ })).toBeFocused();

  await page.keyboard.press("PageDown");
  await expect(dialog.getByRole("grid", { name: "December 2026" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: /December 18, 2026/ })).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAccessibleName("Due date December 18th, 2026");
});

test("Date Picker arrow keys cross into the next month", async ({ page }) => {
  await page.goto("/docs/date-picker");
  await page.getByRole("button", { name: /^Due date/ }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: /November 17, 2026/ })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await expect(dialog.getByRole("grid", { name: "December 2026" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: /December 1, 2026/ })).toBeFocused();
});

test("a controlled Date Picker shows the placeholder again when its value is cleared", async ({
  page,
}) => {
  await page.goto("/docs/date-picker");
  const trigger = page.getByRole("button", { name: /^Paid on/ });
  await expect(trigger).toHaveAccessibleName("Paid on November 24th, 2026");

  await trigger.click();
  await page.getByRole("dialog").getByRole("button", { name: /November 20, 2026/ }).click();
  await expect(trigger).toHaveAccessibleName("Paid on November 20th, 2026");

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(trigger).toHaveAccessibleName("Paid on Pick a date");
});

test("Date Picker closes on Escape without selecting", async ({ page }) => {
  await page.goto("/docs/date-picker");
  const trigger = page.getByRole("button", { name: /^Due date/ });

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAccessibleName("Due date Pick a date");
});

test("Date Picker shows the locale and display format it is given", async ({ page }) => {
  await page.goto("/docs/date-picker");
  const trigger = page.getByRole("button", { name: /^Tanggal jatuh tempo/ });

  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("navigation", { name: "Bilah navigasi" })).toBeVisible();
  // Indonesian weeks start on Monday.
  await expect(dialog.getByRole("gridcell").first()).toHaveAccessibleName(/^Senin, /);

  await dialog.getByRole("button", { name: /Rabu, 18 November 2026/ }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toHaveAccessibleName("Tanggal jatuh tempo Rabu, 18 November 2026");
});

// The docs-page suite scans the page with the popover closed; the open Calendar needs its own scan.
test("open Date Picker has no WCAG 2.2 AA violations", async ({ page }) => {
  await page.goto("/docs/date-picker");
  await page.getByRole("button", { name: /^Due date/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  const { violations } = await new AxeBuilder({ page })
    .include("[role=dialog]")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(violations).toEqual([]);
});

test("Calendar selects a day and moves between months", async ({ page }) => {
  await page.goto("/docs/calendar");
  const calendar = page.getByRole("region", { name: "Single date" });

  await calendar.getByRole("button", { name: "Go to the Next Month" }).click();
  await expect(calendar.getByRole("grid", { name: "December 2026" })).toBeVisible();

  await calendar.getByRole("button", { name: /December 10, 2026/ }).click();
  await expect(calendar.getByRole("gridcell", { selected: true })).toHaveAccessibleName(/10/);
});
