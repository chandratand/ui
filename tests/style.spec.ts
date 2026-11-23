import { expect, test } from "@playwright/test";

import registry from "../registry.json" with { type: "json" };

const style = registry.items.find((item) => item.name === "style");
const own = (name: string) => `chandratand/ui/${name}`;

test("the Style is a standalone registry:style", () => {
  expect(style?.type).toBe("registry:style");
  expect(style && "extends" in style ? style.extends : undefined).toBe("none");
});

test("the Style installs the Tokens and every Component in the manifest", () => {
  const components = registry.items.filter((item) => item.type === "registry:ui");
  expect(new Set(style?.registryDependencies)).toEqual(
    new Set([own("tokens"), ...components.map((item) => own(item.name))]),
  );
});

test("the Style includes the Priority 2 Components", () => {
  const priority2 = [
    "sheet", "combobox", "command", "field", "calendar", "date-picker", "pagination",
    "spinner", "empty", "sidebar", "breadcrumb", "progress", "accordion", "scroll-area",
  ];
  for (const name of priority2) {
    expect(style?.registryDependencies).toContain(own(name));
  }
});

test("the Style installs no Blocks", () => {
  const blocks = registry.items.filter((item) => item.type === "registry:block");
  expect(blocks.length).toBeGreaterThan(0);
  for (const block of blocks) {
    expect(style?.registryDependencies).not.toContain(own(block.name));
  }
});
