// Converts tokens/tokens.css + tokens/theme.css into the official shadcn
// `registry:theme` item "tokens" inside registry.json, so `npx shadcn add`
// merges the tokens into the consumer's globals.css.
//
// Source of truth stays the CSS files. Do not edit the tokens item in
// registry.json by hand — run `pnpm registry:build`.
//
// Mapping (verified against shadcn CLI behaviour):
//   semantic vars (names defined in `.dark`) → cssVars.light / cssVars.dark,
//     with var(--primitive) resolved to literal values so the CLI recognises
//     them as colors and adds --color-* mappings correctly.
//   --radius → cssVars.light (the CLI handles it specially).
//   Tailwind theme overrides (radius-sm…xl, shadow-sm/lg) → cssVars.theme, literal.
//   theme.css `@theme inline` → cssVars.theme.
//   other :root vars (primitives, spacing, sizes, motion, fonts) → css[":root"],
//     so the CLI does not add junk `--x: var(--x)` lines to @theme inline.
//   other selectors ([data-brand]) and @media → css, as written.
//   color-scheme, plus border/body colors → css["@layer base"]: a Style install
//     (`extends: "none"`) gets no shadcn base layer, so the tokens carry one.
//   @custom-variant dark is NOT shipped: shadcn projects already define it.

import { readFileSync, writeFileSync } from "node:fs";
import postcss from "postcss";

const root = new URL("../", import.meta.url);
const read = (p) => postcss.parse(readFileSync(new URL(p, root), "utf8"));

const tokens = read("tokens/tokens.css");
const theme = read("tokens/theme.css");

const THEME_OVERRIDE = /^(radius-(sm|md|lg|xl)|shadow-(sm|lg))$/;

const rootDecls = [];
const darkDecls = {};
const otherRules = [];
const mediaRules = [];

tokens.each((node) => {
  if (node.type === "rule" && node.selector === ":root") {
    node.walkDecls((d) => rootDecls.push(d));
  } else if (node.type === "rule" && node.selector === ".dark") {
    node.walkDecls((d) => {
      if (d.prop.startsWith("--")) darkDecls[d.prop.slice(2)] = d.value;
    });
  } else if (node.type === "rule") {
    otherRules.push(node);
  } else if (node.type === "atrule" && node.name === "media") {
    mediaRules.push(node);
  }
});

const rootVars = {};
for (const d of rootDecls) if (d.prop.startsWith("--")) rootVars[d.prop.slice(2)] = d.value;

const resolve = (value, seen = new Set()) =>
  value.replace(/var\(--([\w-]+)\)/g, (m, name) => {
    if (seen.has(name) || !(name in rootVars)) return m;
    return resolve(rootVars[name], new Set([...seen, name]));
  });

const semantic = new Set(Object.keys(darkDecls));
const light = {};
const dark = {};
const themeVars = {};
const rootCss = {};

for (const [name, value] of Object.entries(rootVars)) {
  if (name === "radius") light.radius = value;
  else if (THEME_OVERRIDE.test(name)) themeVars[name] = value;
  else if (semantic.has(name)) light[name] = resolve(value);
  else rootCss[`--${name}`] = value;
}
for (const [name, value] of Object.entries(darkDecls)) dark[name] = resolve(value);

theme.walkAtRules("theme", (at) => {
  at.walkDecls((d) => {
    const name = d.prop.slice(2);
    if (!(name in themeVars)) themeVars[name] = d.value;
  });
});

const declsOf = (rule) => {
  const out = {};
  rule.walkDecls((d) => (out[d.prop] = d.value));
  return out;
};

const css = { ":root": rootCss };
for (const rule of otherRules) css[rule.selector.replace(/\s*\n\s*/g, " ")] = declsOf(rule);
for (const at of mediaRules) {
  const inner = {};
  at.each((r) => r.type === "rule" && (inner[r.selector] = declsOf(r)));
  css[`@media ${at.params}`] = inner;
}
css["@layer base"] = {
  ":root": { "color-scheme": "light" },
  ".dark": { "color-scheme": "dark" },
  "*": { "@apply border-border": {} },
  body: { "@apply bg-background text-foreground": {} },
};

const item = {
  name: "tokens",
  type: "registry:theme",
  title: "chandratand/ui tokens",
  description:
    "chandratand theme: semantic colors (light/dark), Brand overrides via data-brand, sizes, radius, motion. Merged into globals.css by the shadcn CLI. Generated from tokens/*.css.",
  cssVars: { theme: themeVars, light, dark },
  css,
};

const registryPath = new URL("registry.json", root);
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const i = registry.items.findIndex((it) => it.name === "tokens");
if (i === -1) registry.items.unshift(item);
else registry.items[i] = item;
writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");
console.log("✔ tokens item written to registry.json");
