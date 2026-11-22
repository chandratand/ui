import { expect } from "@playwright/test";

import { type BlockSmoke, expectNoAxeViolations } from "./harness";

export const formSheetSmoke: BlockSmoke = async (page) => {
  const trigger = page.getByRole("button", { name: "Add client" });
  await trigger.focus();
  await page.keyboard.press("Enter");

  const sheet = page.getByRole("dialog", { name: "Add client" });
  await expect(sheet).toBeVisible();
  const name = sheet.getByRole("textbox", { name: "Client name" });
  const email = sheet.getByRole("textbox", { name: "Email" });
  await expect(name).toBeFocused();

  await page.keyboard.type("PT Maju Jaya");
  await page.keyboard.press("Tab");
  await expect(email).toBeFocused();
  await page.keyboard.type("finance@");
  await page.keyboard.press("Enter");

  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("alert")).toHaveText("Enter a valid email address.");
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription(
    "We send invoices to this address. Enter a valid email address.",
  );
  await expect(email).toBeFocused();
  await expect(name).not.toHaveAttribute("aria-invalid", "true");
  await expectNoAxeViolations(page);

  await page.keyboard.type("majujaya.co.id");
  await expect(sheet.getByRole("alert")).toHaveCount(0);
  await expect(email).not.toHaveAttribute("aria-invalid", "true");
  await page.keyboard.press("Enter");

  await expect(sheet).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("Saved PT Maju Jaya.");
};
