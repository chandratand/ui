// Generated so a new Component cannot be left out of the Style; do not edit the
// style item in registry.json by hand — run `pnpm registry:build`.
//
// `extends: "none"`: the Style stands alone instead of layering on a shadcn style.

import { readFileSync, writeFileSync } from "node:fs";

const registryPath = new URL("../registry.json", import.meta.url);
const registry = JSON.parse(readFileSync(registryPath, "utf8"));

const own = (name) => `chandratand/ui/${name}`;
const components = registry.items.filter((it) => it.type === "registry:ui");

const item = {
  name: "style",
  type: "registry:style",
  extends: "none",
  title: "chandratand/ui style",
  description:
    "Tokens and every chandratand/ui Component in one install. Blocks are not included: add each one on its own. Generated from registry.json.",
  registryDependencies: [own("tokens"), ...components.map((it) => own(it.name))],
};

const rest = registry.items.filter((it) => it.name !== "style");
const afterTokens = rest.findIndex((it) => it.name === "tokens") + 1;
registry.items = [...rest.slice(0, afterTokens), item, ...rest.slice(afterTokens)];
writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");
console.log(`✔ style item written to registry.json (tokens + ${components.length} components)`);
