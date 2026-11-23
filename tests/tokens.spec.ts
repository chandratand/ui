import { expect, test } from "@playwright/test";

import registry from "../registry.json" with { type: "json" };

// The contract of the Tokens as shipped (registry.json, values already resolved), so it
// holds for every Consumer app, not just this docs site.
const tokens = registry.items.find((item) => item.name === "tokens");
const modes = ["light", "dark"] as const;

type Rgb = [number, number, number];

function parse(value: string): Rgb {
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16) / 255) as Rgb;

  const oklch = value.match(/^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/);
  if (!oklch) throw new Error(`Unsupported colour: ${value}`);
  const [l, c, h] = oklch.slice(1).map(Number);
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return linear.map((v) => {
    const x = Math.min(1, Math.max(0, v));
    return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
  }) as Rgb;
}

function luminance(value: string) {
  const [r, g, b] = parse(value).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

for (const mode of modes) {
  test.describe(`Tokens, ${mode} Mode`, () => {
    const vars = (tokens?.cssVars as Record<string, Record<string, string>>)[mode];
    const surfaces = ["background", "card", "popover"];

    test("raised surfaces (card, popover) are at least as light as the page", () => {
      for (const surface of ["card", "popover"]) {
        expect(luminance(vars[surface]), surface).toBeGreaterThanOrEqual(luminance(vars.background));
      }
    });

    test("body text meets 4.5:1 on every surface", () => {
      for (const surface of surfaces) {
        expect(contrast(vars.foreground, vars[surface]), surface).toBeGreaterThanOrEqual(4.5);
      }
      for (const surface of [...surfaces, "muted"]) {
        expect(contrast(vars["muted-foreground"], vars[surface]), surface).toBeGreaterThanOrEqual(4.5);
      }
    });

    test("form borders and the focus ring meet 3:1 on every surface", () => {
      for (const surface of surfaces) {
        expect(contrast(vars.input, vars[surface]), `input on ${surface}`).toBeGreaterThanOrEqual(3);
        expect(contrast(vars.ring, vars[surface]), `ring on ${surface}`).toBeGreaterThanOrEqual(3);
      }
    });

    test("text on solid fills meets 4.5:1", () => {
      for (const fill of ["primary", "success", "warning", "destructive", "info"]) {
        expect(contrast(vars[`${fill}-foreground`], vars[fill]), fill).toBeGreaterThanOrEqual(4.5);
      }
    });
  });
}

test("the light page background is off-white, not pure white", () => {
  const light = (tokens?.cssVars as Record<string, Record<string, string>>).light;
  expect(luminance(light.background)).toBeLessThan(1);
  expect(luminance(light.card)).toBeGreaterThan(luminance(light.background));
});
