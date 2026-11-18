import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/field");
});

test("a control is named by its label and described by its hint", async ({ page }) => {
  const email = page.getByRole("textbox", { name: "Work email" });
  await expect(email).toHaveAccessibleDescription("We send invoices to this address.");
  await expect(email).not.toHaveAttribute("aria-invalid", "true");
});

test("a control with an error is described by hint and error, and marked invalid", async ({
  page,
}) => {
  const username = page.getByRole("textbox", { name: "Username" });
  await expect(username).toHaveAccessibleDescription(
    "Letters and numbers only. Username is already taken.",
  );
  await expect(username).toHaveAttribute("aria-invalid", "true");
});

test("a group of controls is named by its legend and described by its hint and error", async ({
  page,
}) => {
  const group = page.getByRole("group", { name: "Invoice reminders" });
  await expect(group).toHaveAccessibleDescription(
    "Sent to the client by email. Choose at least one reminder.",
  );
  await expect(group.getByRole("checkbox", { name: "3 days before due" })).toBeVisible();
});

test("a disabled field disables its control and keeps its hint", async ({ page }) => {
  const field = page.getByRole("textbox", { name: "Client ID" });
  await expect(field).toBeDisabled();
  await expect(field).toHaveAccessibleDescription("Assigned when the client is created.");
});

test("the react-hook-form example shows, announces and clears a validation error", async ({
  page,
}) => {
  const form = page.getByRole("form", { name: "New client" });
  const name = form.getByRole("textbox", { name: "Client name" });
  await expect(name).not.toHaveAttribute("aria-invalid", "true");

  await form.getByRole("button", { name: "Save client" }).click();
  await expect(form.getByRole("alert")).toHaveText("Enter the client name.");
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAccessibleDescription(
    "As it appears on invoices. Enter the client name.",
  );
  await expect(name).toBeFocused();

  await name.fill("PT Maju Jaya");
  await expect(form.getByRole("alert")).toHaveCount(0);
  await expect(name).not.toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAccessibleDescription("As it appears on invoices.");
});
