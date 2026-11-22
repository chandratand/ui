import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/**
 * Drives a Block on its hydrated docs page by keyboard and accessible roles, asserting as it
 * goes. The harness runs it once per Mode at the desktop viewport; set a phone width with
 * `page.setViewportSize` inside the smoke test when the Block needs one. Assert names, roles, focus and visible text only,
 * never classes or DOM structure; call `expectNoAxeViolations` in states the page load
 * does not show (an open Sheet, an error).
 */
export type BlockSmoke = (page: Page) => Promise<void>;

const wcag22aa = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(wcag22aa).analyze();
  expect(violations).toEqual([]);
}
