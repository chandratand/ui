import { expect } from "@playwright/test";

import { type BlockSmoke, expectNoAxeViolations } from "./harness";

export const loginFormSmoke: BlockSmoke = async (page) => {
  const form = page.getByRole("form", { name: "Sign in" });
  const email = form.getByRole("textbox", { name: "Email" });
  const password = form.getByLabel("Password");
  const submit = form.getByRole("button", { name: "Sign in" });

  await expect(email).toHaveAttribute("autocomplete", "username");
  await expect(email).toHaveAttribute("type", "email");
  await expect(password).toHaveAttribute("autocomplete", "current-password");
  await expect(password).toHaveAttribute("type", "password");

  await submit.focus();
  await page.keyboard.press("Enter");

  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription("Enter your email address.");
  await expect(password).toHaveAttribute("aria-invalid", "true");
  await expect(password).toHaveAccessibleDescription("Enter your password.");
  await expect(form.getByRole("alert")).toHaveText([
    "Enter your email address.",
    "Enter your password.",
  ]);
  await expect(email).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("");
  await expectNoAxeViolations(page);

  await page.keyboard.type("budi@");
  await page.keyboard.press("Enter");
  await expect(email).toHaveAccessibleDescription("Enter a valid email address.");
  await expect(email).toBeFocused();

  await page.keyboard.type("majujaya.co.id");
  await expect(email).not.toHaveAttribute("aria-invalid", "true");
  await page.keyboard.press("Tab");
  await expect(password).toBeFocused();
  await page.keyboard.type("correct horse");
  await expect(form.getByRole("alert")).toHaveCount(0);
  await page.keyboard.press("Enter");

  await expect(page.getByRole("status")).toHaveText("Signed in as budi@majujaya.co.id.");
};
