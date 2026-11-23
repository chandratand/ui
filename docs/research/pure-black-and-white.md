# Pure black (#000) and pure white (#fff) in chandratand/ui

Research note, 2026-11-23. Question: why does UI/UX advice say "avoid pure black and pure white", and is this repo's use of them appropriate?

## TL;DR

- **The advice is mostly about dark mode**, and specifically about *pure-black backgrounds* (shadows can't show elevation, light text can feel harsh). The primary sources that own this rule (Material) say so for dark themes only. For **light mode, a pure-white background is mainstream**: shadcn, Tailwind, Material 3 (for its lowest surface and `on-primary`), Apple and GitHub Primer all use `#ffffff`.
- **"Pure black text on white is harsh"** is opinion, not evidence. WCAG has no maximum contrast. APCA, the WCAG 3 candidate, sets **no maximum for small text** and suggests a maximum only for very large/bold text and large colour areas.
- **The halation/astigmatism claim** (white text on black blurs for people with astigmatism) has **no primary support** that I could find. It is plausible but folklore-grade. The peer-reviewed reading research favours dark-on-light for normal vision and light-on-dark for some low-vision users.
- **Repo verdict:** our pure-white usages are fine and should stay. That covers the light `background`/`card`/`popover` and the white `*-foreground` on solid fills (swapping white for off-white would cut the `warning` margin to 4.76:1). The scrims (`oklch(0 0 0 / α)`) are fine. Dark mode already avoids pure black and pure white. Two things are worth acting on:
  1. **Dark-mode dialogs and sheets sit on the darkest surface** (`bg-background` = neutral-950), which is the reverse of Material's and Apple's "elevated = lighter" rule.
  2. **Dark-mode body contrast is near the maximum** (18.96:1, APCA Lc −104). Lowering it a little is optional and has weak evidence behind it.

## 1. The reasoning, claim by claim

Evidence grades: **Primary** = the owning spec, vendor doc or peer-reviewed paper was read. **Secondary** = only blogs, press or forum posts were found. **Folklore** = repeated widely, but no primary support found.

### 1.1 Dark mode: dark grey surfaces, not black (Primary)

- Material's Android implementation states the reasons directly: *"The baseline Material Dark theme background and surface colors are dark grey instead of black, which increases visibility for shadows and also reduces eye strain for light text."* ([MDC Android, Dark theme doc](https://github.com/material-components/material-components-android/blob/master/docs/theming/Dark.md)).
- That grey is `#121212`: `design_dark_default_color_background` and `design_dark_default_color_surface` are both `#121212` in [MDC Android `colors.xml`](https://github.com/material-components/material-components-android/blob/master/lib/java/com/google/android/material/color/res/values/colors.xml). The m2.material.io dark-theme page that is usually cited is a JS app and could not be fetched. The value was verified from source instead.
- Why it helps elevation: *"Shadows are less effective in an app using a dark theme … Material surfaces become lighter … at higher elevations"* (same doc). On `#000` there is no darker value left for a shadow, so depth has to come from **lighter** surfaces.
- Material 3 baseline (token export used by Flutter's generator, [`color_dark.json`](https://github.com/flutter/flutter/blob/master/dev/tools/gen_defaults/data/color_dark.json) / [`palette.json`](https://github.com/flutter/flutter/blob/master/dev/tools/gen_defaults/data/palette.json)): dark `surface` = neutral6 `#141218`, `on-surface` = neutral90 `#E6E0E9` (14.35:1, not white). The surface containers get **lighter** as they rise (neutral4 → 22). Dialogs use `surfaceContainerHigh` ([`dialog.json`](https://github.com/flutter/flutter/blob/master/dev/tools/gen_defaults/data/dialog.json)).
- Apple goes the other way on iOS base colours (system dark background is true black), but keeps the elevation principle: *"the system uses two sets of background colors — called base and elevated … The base colors are dimmer … the elevated colors are brighter, making foreground interfaces appear to advance"*, and the background *"automatically changes from base to elevated when an interface is in the foreground, such as a popover or modal sheet"* ([HIG, Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)). The exact iOS hex values (`#000000` / `#1C1C1E`) are not stated on the HIG page and are **Secondary** here.
- Apple on visual comfort (visionOS context): *"high contrast … can also cause visual discomfort if people's eyes have adjusted to low light or darkness … avoid displaying a bright object on a very dark or black background"* ([HIG, Color](https://developer.apple.com/design/human-interface-guidelines/color)).

**Well-evidenced core:** in dark mode, a non-black base lets elevated surfaces read as lighter, which is a design-system mechanism and not a perception claim. The "eye strain" part is asserted by Material without a cited study (**Primary as a vendor claim, unsupported by research I found**).

### 1.2 Contrast limits: WCAG has none; APCA has one only for big text (Primary)

- WCAG 2.2 sets minimums only: 4.5:1 text, 3:1 large text ([Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)), 3:1 non-text ([1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)), 7:1 enhanced ([1.4.6](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)). There is no maximum. The Understanding doc only notes *"Some people with cognitive disabilities require color combinations or hues that have low contrast"*, and it encourages authors to let users adjust colours.
- Apple asks for at least 4.5:1 and *"strive for … 7:1, especially in small text"* ([HIG, Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)), which is guidance for more contrast, not less.
- APCA: *"Lc 90 is a suggested maximum for very large and bold fonts (greater than 36px bold), and large areas of color. Small fonts do not have a maximum."* ([APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html)). The [apca-w3 README](https://github.com/Myndex/apca-w3) gives *"Fonts larger than 24px and weight 300 or more have a maximum contrast of Lc 90."* APCA is polarity-aware (light-on-dark and dark-on-light are computed differently) and is still a draft, not a standard.

**Conclusion:** no normative or draft-normative source bans pure black text on white or pure white text on black for body text. The only ceiling (APCA Lc 90) applies to large bold type and big colour fields.

### 1.3 Reading research: polarity matters more than "pure" (Primary)

Traced from [NN/g, Dark Mode vs. Light Mode](https://www.nngroup.com/articles/dark-mode/) to the papers:

- Piepenbrock et al., *Positive display polarity is advantageous for both younger and older adults*, Ergonomics 2013 ([doi:10.1080/00140139.2013.790485](https://doi.org/10.1080/00140139.2013.790485)). Dark-on-light did better on acuity and proofreading.
- Piepenbrock et al., Human Factors 2014 ([doi:10.1177/0018720813515509](https://doi.org/10.1177/0018720813515509)). The advantage grows as characters get smaller. A 2014 Ergonomics follow-up ties it to smaller pupils (PubMed 25135324).
- Dobres et al., Applied Ergonomics 2017 ([doi:10.1016/j.apergo.2016.11.001](https://doi.org/10.1016/j.apergo.2016.11.001)). No polarity effect in daytime lighting. At night, light mode was better.
- Legge et al. 1985/1987 (Vision Research). People with cloudy ocular media read better light-on-dark, attributed to light scatter in the eye ([Legge, Rubin & Luebker 1987, PDF](https://legge.dl8.umn.edu/sites/legge.psych.umn.edu/files/2020-08/psychophysics_of_reading-v._the_role_of_contrast_in_normal_vision_legge_rubin_luebker_1987.pdf)).

None of these studies tests `#000` against near-black, or `#fff` against off-white. They support **offering** both modes. They do not support a "no pure black/white" rule.

### 1.4 Halation and astigmatism (Folklore / Secondary)

The claim is that white text on a black background "glows" or blurs for people with astigmatism. I found only advocacy and blog sources (for example the [Level Access blog](https://www.levelaccess.com/blog/accessibility-for-people-with-astigmatism/)) and no peer-reviewed test of astigmatism × polarity. Light scatter is real (Legge, above), but in that research it **favoured** light-on-dark for the affected group. Treat this as a plausible hypothesis, not a design rule.

### 1.5 OLED black smear (Secondary)

On some OLED panels, pixels switching from fully off (true `#000`) to on respond slowly, which smears dark content as it moves. The sources are tech press and forums ([GSMArena on the Pixel 2 XL](https://www.gsmarena.com/google_pixel_2_xl_display_reportedly_has_black_smear_issues-news-27886.php), [Blur Busters](https://blurbusters.com/?p=1308)), with no vendor guidance. It matters mostly for scrolling or animated content on true-black backgrounds. The opposite argument, that true black saves battery, is measured but small at normal brightness: 3–9% at 30–50% brightness, 39–47% at 100% (Dash & Hu, MobiSys '21, via [Purdue's release](https://www.purdue.edu/newsroom/releases/2021/Q3/dark-mode-may-not-save-your-phones-battery-life-as-much-as-you-think,-but-there-are-a-few-silver-linings.html); paper not read, **Secondary**).

### 1.6 What the mainstream systems actually ship (Primary)

| System | Light bg | Light text | White on fills? | Dark bg | Dark text | Scrim |
| --- | --- | --- | --- | --- | --- | --- |
| Tailwind v4 ([theme.css](https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/theme.css)) | `white` = `#fff`, `black` = `#000`; `neutral-950` = `oklch(14.5% 0 0)` | | | | | |
| shadcn ([Theming](https://ui.shadcn.com/docs/theming)) | `oklch(1 0 0)` (pure white) | `oklch(0.145 0 0)` | `primary-foreground` `oklch(0.985 0 0)` (near-white) | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | originals use `bg-black/50` |
| Material 3 baseline | surface neutral98 `#FEF7FF`; lowest container `#FFFFFF` | neutral10 `#1D1B20` (16.2:1) | `on-primary` = `#FFFFFF` | `#141218` | `#E6E0E9` (14.35:1) | `scrim` = neutral0 `#000000` |
| GitHub Primer ([@primer/primitives](https://www.npmjs.com/package/@primer/primitives) 10.3.4) | `#ffffff` | `#1f2328` (15.8:1) | `fgColor-onEmphasis` = `#ffffff` | `#0d1117` | `#f0f6fc` (17.4:1) | tinted `#21283066` (dark) / `#c8d1da66` (light) |

In short, pure white page backgrounds and white text on saturated fills are standard practice. Near-black text is common (Material, Primer), but it is not a contrast-driven requirement. Dark modes avoid `#000` backgrounds, except on Apple iOS.

## 2. Audit of this repo

Ratios are WCAG 2.x, computed from the token values (OKLCH converted to sRGB). APCA Lc is computed with the apca-w3 0.0.98G constants. No `bg-white`, `text-black`, `#fff`/`#000` or `white`/`black` keyword appears in `registry/` or `app/`. Every instance is in tokens (and the generated `registry.json`, which mirrors `tokens/tokens.css`).

| Location | Token / use | Value | Ratio | Verdict | Reason |
| --- | --- | --- | --- | --- | --- |
| `tokens/tokens.css:84` | `--background` (light) | `#ffffff` | text 19.79:1 | **Fine** | Light-mode white is mainstream (§1.6). The "no pure white" advice comes from dark mode (§1.1). |
| `tokens/tokens.css:86`, `:88` | `--card`, `--popover` (light) | `#ffffff` | — | **Fine** | Cards separate by `border` (hard rule 7). Popovers add `shadow-sm`, which works on white. Note that a card cannot be tonally separated from a white page (see R4). |
| `tokens/tokens.css:85` | `--foreground` (light) | neutral-950 `#080a0d` | 19.79:1, Lc 105.9 | **Fine** | Effectively black (black gives 21:1), but tinted. No source sets a maximum for body text (§1.2). Material and Primer use about 16:1 by taste, not by rule. |
| `tokens/tokens.css:91` | `--primary-foreground` (light) | `#ffffff` on brand-600 `#326897` | 5.88:1 (hover 7.72, active 10.38) | **Fine, keep** | Same as Material `on-primary` and Primer `onEmphasis`. Off-white would only lose margin. |
| `tokens/tokens.css:106` | `--success-foreground` | `#ffffff` on `#0a7e3a` | 5.17:1 | **Fine, keep** | Neutral-50 would give 4.96:1. |
| `tokens/tokens.css:110` | `--warning-foreground` | `#ffffff` on `#a36000` | **4.96:1** | **Fine, keep (tightest)** | Neutral-50 would drop it to 4.76:1. White is what keeps this pair comfortably above 4.5:1. |
| `tokens/tokens.css:114` | `--destructive-foreground` | `#ffffff` on `#c2181d` | 6.10:1 | **Fine, keep** | |
| `tokens/tokens.css:118` | `--info-foreground` | `#ffffff` on `#0074a0` | 5.24:1 | **Fine, keep** | |
| `tokens/tokens.css:103` | `--overlay` (light) | `oklch(0 0 0 / 0.5)` | dialog vs dimmed page 3.95:1 | **Fine** | A scrim is a dimming layer, not a surface or text. M3 `scrim` is pure black too. A tinted scrim (Primer) is a style choice: `oklch(0.145 0.007 247.3 / α)` would match the neutral tint, with no accessibility difference. |
| `tokens/tokens.css:152` | `--overlay` (dark) | `oklch(0 0 0 / 0.7)` | — | **Fine** | Same reasoning. In dark mode it makes the elevation problem below worse, but the scrim is not the cause. |
| `tokens/tokens.css:67–68` | `--shadow-sm/-lg` | `rgb(0 0 0 / 0.1)` | — | **Fine** | Black-based shadows are standard (Tailwind default). They are almost invisible in dark mode, as Material predicts (§1.1), which is why dark elevation must come from surface lightness. |
| `tokens/tokens.css:133`, `:135`, `:137` | dark `--background` / `--card` / `--popover` | neutral-950 `#080a0d` / neutral-900 `#14181b` / neutral-900 | card vs bg 1.11:1 | **Fine** | Not pure black. Card and popover are lighter than the page, which is correct Material/Apple-style elevation. It is very close to black (L 0.145, the same as shadcn), darker than Material `#121212`/`#141218` and Primer `#0d1117`. |
| `tokens/tokens.css:134` | dark `--foreground` | neutral-50 `#f9fafb` on `#080a0d` | **18.96:1, Lc −104** | **Consider (low priority)** | Not pure white, but close to the maximum, and higher than M3 (14.35) and Primer (17.39). This is the only place the "too harsh" argument applies, and its evidence is weak (§1.2, §1.4). |
| `registry/chandratand/ui/dialog.tsx:66`, `alert-dialog.tsx:55`, `sheet.tsx:52` | dialog/sheet surface | `bg-background` → dark neutral-950 | dark: dialog vs page dimmed by the 70% scrim 1.04:1. A neutral-900 surface would give 1.16:1 | **Change (medium priority)** | In dark mode the most elevated layer uses the **darkest** surface, the opposite of the elevated-is-lighter rule from both Apple and Material (§1.1). The edge is held by the `border-border` (neutral-800) alone, because `shadow-lg` is invisible on near-black. In light mode it is fine. |
| `registry.json:83–116`, `:145` | generated mirror | same values | — | n/a | Generated from `tokens/*.css`. Fix the source, then run `pnpm registry:build`. |
| `docs/design-system.md:94–95`, `:102` | token table | "white", "black 50%/70%" | — | n/a | Accurate. Update only if tokens change. |

## 3. Recommendations (prioritised)

**R1. Lift dark-mode dialogs and sheets (medium; component change).** Make `Dialog`, `AlertDialog` and `Sheet` use `bg-popover text-popover-foreground` (neutral-900 in dark, still white in light), or add a dedicated `--surface-raised` style token if `popover` should stay distinct. This matches Apple's base/elevated model and M3's `surfaceContainerHigh` for dialogs. Light mode is unchanged. Re-run axe in both Modes. Changelog entry needed. Consumers re-pull the three components.

**R2. Keep white `*-foreground` on solid fills (no action; document it).** Add a one-line note in design-system doc §4.1: white text on solid status/primary fills is deliberate, and off-white would cost contrast (warning 4.96 → 4.76:1). This stops a future "fix" based on the folklore. A new Brand's `--primary` must still reach ≥ 4.5:1 against `#ffffff`.

**R3. Optionally soften dark-mode body contrast (low; token change, needs a visual review).** Two options, each still far above AA:
- `--foreground` (dark) → neutral-100 `#f2f4f7` (17.99:1) or neutral-200 `#e2e6e9` (15.79:1, close to Primer and M3).
- `--background` (dark) → a slightly lighter step around `oklch(0.17 0.008 247.3)`, which leaves more room below for depth.

Pick one at most, and re-check `--muted-foreground` (neutral-400: 7.67:1 on the page, 5.83:1 on `muted`) and `--input` (3.62:1) afterwards. The evidence for this change is weak (§1.2–1.4), so treat it as taste rather than accessibility. Skipping it is defensible.

**R4. Leave light-mode white surfaces alone (no action).** If cards ever need to stand out without borders, the mainstream pattern is an off-white page (neutral-50) with white cards, not off-white cards. That would be a layout decision, not a fix.

**R5. Scrims: no change.** A brand-tinted scrim (`oklch(0.145 0.007 247.3 / α)`) is purely aesthetic. Do it only if the overlay ever looks "dead" next to the tinted neutrals.

**Do not:** replace `#ffffff` with `#fafafa`-style off-white across the light theme, or replace the light `--foreground` with a mid-grey "to reduce harshness". No primary source asks for either, and both reduce contrast margins that hard rule 8 depends on.

## 4. Open questions

- Is there peer-reviewed work on near-black vs true-black backgrounds (not just polarity) for reading comfort? None found. The Material "eye strain" claim cites nothing.
- Did Material's m2.material.io page give quantitative reasons (for example a 15.8:1 text figure)? It couldn't be fetched (JS-rendered). `#121212` was verified from MDC Android source instead.
- Should the docs site's axe run also report APCA values? axe only checks WCAG 2.x minimums, so the "too much contrast" side is never measured.
- The iOS true-black base (`systemBackground`) hex values come from memory or secondary sources. Apple's HIG text only says "dimmer" and "brighter".
