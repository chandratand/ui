import { expect, test } from "@playwright/test";

import registry from "../registry.json" with { type: "json" };

type Css = Record<string, Record<string, unknown>>;
const cssOf = (item: (typeof registry.items)[number]) =>
  ("css" in item ? item.css : undefined) as Css | undefined;

test("every item that installs tw-animate-css also imports it into the app's CSS", () => {
  const animated = registry.items.filter((item) =>
    ("dependencies" in item ? (item.dependencies as string[]) : []).includes("tw-animate-css"),
  );
  expect(animated.length).toBeGreaterThan(0);
  for (const item of animated) {
    expect(cssOf(item), item.name).toHaveProperty(['@import "tw-animate-css"']);
  }
});

test("the Tokens give borders, page background and text their semantic colors", () => {
  const tokens = registry.items.find((item) => item.name === "tokens")!;
  const base = cssOf(tokens)?.["@layer base"];
  expect(base?.["*"]).toEqual({ "@apply border-border": {} });
  expect(base?.body).toEqual({ "@apply bg-background text-foreground": {} });
});
