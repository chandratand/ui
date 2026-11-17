import { expect, test } from "@playwright/test";

test("Scroll Area without focusable content can be focused and scrolled by keyboard", async ({
  page,
}) => {
  // Keys pressed before hydration are lost; network idle means the client bundle has run.
  await page.goto("/docs/scroll-area", { waitUntil: "networkidle" });

  const notes = page.getByRole("region", { name: "Release notes" });
  const lastNote = notes.getByText("v1.0.0: first release.");
  await expect(lastNote).not.toBeInViewport();

  // The release notes are the page's first example, so they are the next tab stop.
  await page.getByRole("heading", { level: 1, name: "Scroll Area" }).click();
  await page.keyboard.press("Tab");
  await expect(notes).toBeFocused();

  await page.keyboard.press("End");
  await expect(lastNote).toBeInViewport();
});

test("Scroll Area brings focused content into view", async ({ page }) => {
  await page.goto("/docs/scroll-area", { waitUntil: "networkidle" });

  const lastTag = page.getByRole("link", { name: "v0.1.0" });
  await expect(lastTag).not.toBeInViewport();

  await lastTag.focus();
  await expect(lastTag).toBeFocused();
  await expect(lastTag).toBeInViewport();
});
