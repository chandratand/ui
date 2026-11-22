import type { Page } from "@playwright/test";

/** Opens a page and waits until it is hydrated, for tests that press keys right away. */
export async function gotoHydrated(page: Page, path: string) {
  // Keys pressed before hydration are lost; network idle means the client bundle has run.
  await page.goto(path, { waitUntil: "networkidle" });
}
