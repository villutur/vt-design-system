import { designTokens, semanticCssVariables, sizeModeCssVariables } from "../../tokens";

function formatCssVariableBlock(variables: Record<string, string>, indentation = "  ") {
  return Object.entries(variables)
    .map(([name, value]) => `${indentation}${name}: ${value};`)
    .join("\n");
}

function createCssRule(selector: string, variables: Record<string, string>) {
  return `${selector} {\n${formatCssVariableBlock(variables)}\n}`;
}

export const sizeModeCssExample = [
  "/* Preview size mode controls */",
  createCssRule('html[data-size-mode="compact"]', sizeModeCssVariables.compact),
  createCssRule('html[data-size-mode="default"]', sizeModeCssVariables.default),
  createCssRule('html[data-size-mode="comfortable"]', sizeModeCssVariables.comfortable),
].join("\n\n");

export const consumerThemeOverrideCssExample = [
  "/* app-theme.css */",
  "/*",
  "  Copy this file into a consuming application, import it after",
  '  "vt-design-system/theme.css", and override only the tokens you need.',
  "  These are the runtime CSS variables exposed by the package today.",
  "*/",
  createCssRule(":root", {
    ...semanticCssVariables.light,
    ...sizeModeCssVariables.default,
  }),
  createCssRule(".dark", semanticCssVariables.dark),
  createCssRule('html[data-size-mode="compact"]', sizeModeCssVariables.compact),
  createCssRule('html[data-size-mode="default"]', sizeModeCssVariables.default),
  createCssRule('html[data-size-mode="comfortable"]', sizeModeCssVariables.comfortable),
].join("\n\n");

export const semanticUtilityUsageExample = `// Prefer semantic tokens for neutral UI
<div className="bg-canvas text-foreground">
  <section className="rounded-2xl border border-default bg-surface">
    <header className="border-b border-default bg-surface-subtle">
      <p className="text-foreground-muted">Workspace settings</p>
    </header>

    <p className="text-foreground">
      Primary content follows the active theme automatically.
    </p>
    <p className="text-foreground-subtle">
      Metadata and placeholders stay visually quiet.
    </p>
  </section>
</div>

// Keep semantic accents for meaning
<Badge variant="softSuccess">Healthy</Badge>
<Alert type="warning" title="Attention required" />`;

export function formatRemWithPx(value: string) {
  if (!value.endsWith("rem")) {
    return value;
  }

  const remValue = Number.parseFloat(value);

  if (Number.isNaN(remValue)) {
    return value;
  }

  const pixelValue = remValue * 16;

  return `${Math.round(pixelValue)}px / ${value}`;
}

export const typographyFontFamilies = Object.entries(designTokens.typography.fontFamily).map(([name, family]) => ({
  name,
  family,
  label: family.join(", "),
  sample: name === "mono" ? "NODE_ALPHA_001 - 0x1F4A3B" : "The quick brown fox jumps over the lazy dog",
}));

export const typographyFontSizes = Object.entries(designTokens.typography.fontSize).map(([name, size]) => ({
  name,
  size,
}));

export const typographyFontWeights = Object.entries(designTokens.typography.fontWeight).map(([name, weight]) => ({
  name,
  weight,
}));

export const radiusTokens = Object.entries(designTokens.radius).map(([name, radius]) => ({
  name,
  radius,
}));
