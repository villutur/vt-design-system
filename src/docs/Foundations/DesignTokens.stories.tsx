import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconMoon, IconPalette, IconSun } from "@tabler/icons-react";
import { Alert } from "../../components/Feedback/Alert";
import { Badge } from "../../components/DataDisplay/Badge";
import { CodeBlock } from "../../components/DataDisplay/CodeBlock";
import { Divider } from "../../components/Layout/Divider";
import { StatusBadge } from "../../components/DataDisplay/StatusBadge";
import { designTokens } from "../../tokens";
import {
  consumerThemeOverrideCssExample,
  formatRemWithPx,
  radiusTokens,
  semanticUtilityUsageExample,
  sizeModeCssExample,
  typographyFontFamilies,
  typographyFontSizes,
  typographyFontWeights,
} from "../../internal/examples/foundationsDocs";

const primaryScale = [
  { token: "DEFAULT", hex: designTokens.colors.primary.DEFAULT },
  { token: "50", hex: designTokens.colors.primary[50] },
  { token: "100", hex: designTokens.colors.primary[100] },
  { token: "200", hex: designTokens.colors.primary[200] },
  { token: "300", hex: designTokens.colors.primary[300] },
  { token: "400", hex: designTokens.colors.primary[400] },
  { token: "500", hex: designTokens.colors.primary[500] },
  { token: "600", hex: designTokens.colors.primary[600] },
  { token: "700", hex: designTokens.colors.primary[700] },
  { token: "800", hex: designTokens.colors.primary[800] },
  { token: "900", hex: designTokens.colors.primary[900] },
] as const;

const semanticRows = [
  {
    token: "canvas",
    utility: "bg-canvas",
    usage: "App shell and page background",
    light: designTokens.colors.semantic.light.canvas,
    dark: designTokens.colors.semantic.dark.canvas,
  },
  {
    token: "surface",
    utility: "bg-surface",
    usage: "Cards, panels, drawers, dialogs",
    light: designTokens.colors.semantic.light.surface,
    dark: designTokens.colors.semantic.dark.surface,
  },
  {
    token: "surface-subtle",
    utility: "bg-surface-subtle",
    usage: "Hover blocks and quiet panel sections",
    light: designTokens.colors.semantic.light.surfaceSubtle,
    dark: designTokens.colors.semantic.dark.surfaceSubtle,
  },
  {
    token: "surface-muted",
    utility: "bg-surface-muted",
    usage: "Inputs, chips, muted chrome, handles",
    light: designTokens.colors.semantic.light.surfaceMuted,
    dark: designTokens.colors.semantic.dark.surfaceMuted,
  },
  {
    token: "foreground",
    utility: "text-foreground",
    usage: "Primary text on the current theme",
    light: designTokens.colors.semantic.light.foreground,
    dark: designTokens.colors.semantic.dark.foreground,
  },
  {
    token: "foreground-muted",
    utility: "text-foreground-muted",
    usage: "Secondary copy, helper text, labels",
    light: designTokens.colors.semantic.light.foregroundMuted,
    dark: designTokens.colors.semantic.dark.foregroundMuted,
  },
  {
    token: "foreground-subtle",
    utility: "text-foreground-subtle",
    usage: "Metadata, dividers, placeholders",
    light: designTokens.colors.semantic.light.foregroundSubtle,
    dark: designTokens.colors.semantic.dark.foregroundSubtle,
  },
  {
    token: "foreground-inverse",
    utility: "text-foreground-inverse",
    usage: "Text on dark tooltips or inverse surfaces",
    light: designTokens.colors.semantic.light.foregroundInverse,
    dark: designTokens.colors.semantic.dark.foregroundInverse,
  },
  {
    token: "border-default",
    utility: "border-default",
    usage: "Default panel and list separators",
    light: designTokens.colors.semantic.light.borderDefault,
    dark: designTokens.colors.semantic.dark.borderDefault,
  },
  {
    token: "border-strong",
    utility: "border-strong",
    usage: "Input chrome and stronger neutral emphasis",
    light: designTokens.colors.semantic.light.borderStrong,
    dark: designTokens.colors.semantic.dark.borderStrong,
  },
  {
    token: "overlay",
    utility: "bg-overlay/40",
    usage: "Scrims behind modal, drawer, palette",
    light: designTokens.colors.semantic.light.overlay,
    dark: designTokens.colors.semantic.dark.overlay,
  },
] as const;

const statusTokens = [
  {
    name: "primary",
    base: designTokens.colors.primary.DEFAULT,
    badge: "softPrimary" as const,
  },
  {
    name: "success",
    base: designTokens.colors.success.DEFAULT,
    badge: "softSuccess" as const,
  },
  {
    name: "warning",
    base: designTokens.colors.warning.DEFAULT,
    badge: "softWarning" as const,
  },
  {
    name: "error",
    base: designTokens.colors.error.DEFAULT,
    badge: "softError" as const,
  },
] as const;

const fontSizeClassMap = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
} as const;

const fontWeightClassMap = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

function TokenSwatch({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-default bg-surface p-3">
      <div
        className="h-14 rounded-lg border border-default"
        style={{ backgroundColor: value }}
      />
      <div className="mt-3 space-y-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="font-mono text-xs text-foreground-muted">{value}</p>
      </div>
    </div>
  );
}

function ThemePreview({
  theme,
  icon,
}: {
  theme: "light" | "dark";
  icon: React.ReactNode;
}) {
  const semantic = designTokens.colors.semantic[theme];

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="rounded-2xl border border-default bg-canvas p-4 text-foreground">
        <div className="rounded-2xl border border-default bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-default bg-surface-subtle px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {theme === "light" ? "Light theme" : "Dark theme"}
                </p>
                <p className="text-xs text-foreground-muted">
                  Semantic neutrals are driven by CSS variables.
                </p>
              </div>
            </div>
            <Badge variant="softPrimary">
              .dark {theme === "dark" ? "on" : "off"}
            </Badge>
          </div>

          <div className="space-y-4 p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <TokenSwatch label="canvas" value={semantic.canvas} />
              <TokenSwatch label="surface" value={semantic.surface} />
              <TokenSwatch
                label="surface-muted"
                value={semantic.surfaceMuted}
              />
            </div>

            <div className="rounded-xl border border-default bg-surface-subtle p-4">
              <p className="text-sm font-semibold text-foreground">
                Preview card
              </p>
              <p className="mt-1 text-sm text-foreground-muted">
                The same semantic utility classes resolve to different CSS
                variables in light and dark mode.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="softPrimary">Primary accent</Badge>
                <Badge variant="softSuccess">Success accent</Badge>
                <Badge variant="softWarning">Warning accent</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SizeModeComparisonCard({
  label,
  rootFontSize,
  description,
}: {
  label: string;
  rootFontSize: string;
  description: string;
}) {
  return (
    <div
      className="rounded-xl border border-default bg-surface-subtle p-4"
      style={{ fontSize: rootFontSize }}
    >
      <p className="font-semibold text-[1em] text-foreground">{label}</p>
      <p className="mt-1 font-mono text-[0.75em] text-foreground-muted">
        {rootFontSize}
      </p>
      <p className="mt-3 text-[0.8em] leading-[1.5] text-foreground-muted">
        {description}
      </p>
      <div className="mt-4 rounded-lg border border-default bg-surface px-[0.875em] py-[0.75em]">
        <p className="text-[0.95em] font-medium text-foreground">
          Sample sentence
        </p>
        <p className="mt-1 text-[0.8em] text-foreground-muted">
          This card scales locally so each size mode remains visibly different
          in the same preview.
        </p>
      </div>
    </div>
  );
}

function DesignTokensDocs() {
  return (
    <div className="min-h-screen bg-canvas px-6 py-8 text-foreground sm:px-10 sm:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="softPrimary">Foundations Guide</Badge>
            <Badge variant="soft">Design tokens</Badge>
            <Badge variant="soft">Typography</Badge>
            <Badge variant="soft">Theming</Badge>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Design Tokens, Typography, and Theming
            </h1>
            <p className="max-w-3xl text-base text-foreground-muted">
              `src/tokens.ts` is the source of truth for palette, spacing,
              typography, radius, shadows, and semantic theme values. The
              semantic neutral layer is exposed through the exported
              `src/theme.css`, which maps Tailwind utilities and injects the
              active light, dark, and size-mode CSS variables. `src/styles.css`
              then builds the shared package component styles on top of that
              theme contract.
            </p>
          </div>
        </header>

        <Alert type="info" title="Recommended token strategy">
          Use semantic tokens for neutral UI structure: `bg-canvas`,
          `bg-surface`, `bg-surface-subtle`, `bg-surface-muted`,
          `text-foreground`, `text-foreground-muted`, `text-foreground-subtle`,
          `border-default`, and `border-strong`. Keep `primary`, `success`,
          `warning`, and `error` for meaning, not layout chrome.
        </Alert>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Preview size modes
            </h2>
            <div className="mt-4 space-y-4 text-sm text-foreground-muted">
              <p>
                The Storybook toolbar now includes `compact`, `default`, and
                `comfortable` preview modes. Each mode updates
                `--vt-root-font-size` on the `html` element.
              </p>
              <p>
                Because a large part of the design system already uses `rem`
                values, this gives a fast, realistic scale experiment before
                changing individual spacing or type tokens.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {Object.entries(designTokens.sizeModes).map(
                  ([mode, config]) => (
                    <SizeModeComparisonCard
                      key={mode}
                      label={config.label}
                      rootFontSize={config.rootFontSize}
                      description={config.description}
                    />
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Size mode implementation
            </h2>
            <div className="mt-4">
              <CodeBlock
                code={sizeModeCssExample}
                language="css"
                title="size-mode.css"
                copyable
                wrapLongLines
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Theming architecture
            </h2>
            <div className="mt-4 space-y-4 text-sm text-foreground-muted">
              <p>
                1. `designTokens.colors.semantic` defines the token values for
                both theme modes.
              </p>
              <p>
                2. `src/theme.css` maps those values to semantic Tailwind
                utility names and injects `:root`, `.dark`, and
                `html[data-size-mode]` CSS variables.
              </p>
              <p>
                3. `src/styles.css` builds the shared component stylesheet,
                while consuming apps import `vt-design-system/theme.css` in
                their own Tailwind entry so app-local utilities stay in sync.
              </p>
              <p>
                4. Components consume the utilities instead of raw palette
                classes, which keeps theme switching consistent.
              </p>
            </div>

            <Divider className="my-6" />

            <CodeBlock
              code={semanticUtilityUsageExample}
              language="tsx"
              title="Semantic utility example"
              copyable
              wrapLongLines
            />
          </div>

          <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Accent and status tokens
            </h2>
            <div className="mt-4 grid gap-4">
              {statusTokens.map((token) => (
                <div
                  key={token.name}
                  className="rounded-xl border border-default bg-surface-subtle p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground capitalize">
                        {token.name}
                      </p>
                      <p className="font-mono text-xs text-foreground-muted">
                        {token.base}
                      </p>
                    </div>
                    <Badge variant={token.badge}>{token.name}</Badge>
                  </div>
                  <div
                    className="mt-3 h-3 rounded-full"
                    style={{ backgroundColor: token.base }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatusBadge status="active" />
              <StatusBadge status="pending" />
              <StatusBadge status="warning" />
              <StatusBadge status="error" />
              <StatusBadge status="archived" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Consumer Theme Override File
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Import a consumer override file after
              `vt-design-system/theme.css` and replace only the runtime CSS
              variables you need.
            </p>
            <div className="mt-4">
              <CodeBlock
                code={consumerThemeOverrideCssExample}
                language="css"
                title="app-theme.css"
                copyable
                wrapLongLines
              />
            </div>
          </div>

          <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Consumer Notes
            </h2>
            <div className="mt-4 space-y-4 text-sm text-foreground-muted">
              <p>
                The runtime override surface currently includes semantic neutral
                colors plus `--vt-root-font-size`.
              </p>
              <p>
                Accent palette tokens such as `primary`, `success`, `warning`,
                and `error`, along with spacing and font-family tokens, are
                still build-time values today rather than runtime CSS variables.
              </p>
              <p>
                That means consumers can retheme neutral surfaces immediately by
                overriding CSS variables, while deeper token changes still
                require forking token values at build time.
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Semantic neutral reference
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              These are the primary neutrals that should replace raw slate,
              gray, white, and black classes in components.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-default bg-surface shadow-sm">
            <div className="grid gap-px bg-border-default md:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
              <div className="bg-surface-subtle px-4 py-3 text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                Token
              </div>
              <div className="bg-surface-subtle px-4 py-3 text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                Light
              </div>
              <div className="bg-surface-subtle px-4 py-3 text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                Dark
              </div>
              <div className="bg-surface-subtle px-4 py-3 text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                Usage
              </div>

              {semanticRows.map((row) => (
                <React.Fragment key={row.token}>
                  <div className="bg-surface px-4 py-4">
                    <p className="text-sm font-semibold text-foreground">
                      {row.token}
                    </p>
                    <p className="mt-1 font-mono text-xs text-foreground-muted">
                      {row.utility}
                    </p>
                  </div>
                  <div className="bg-surface px-4 py-4">
                    <div
                      className="h-8 rounded-lg border border-default"
                      style={{ backgroundColor: row.light }}
                    />
                    <p className="mt-2 font-mono text-xs text-foreground-muted">
                      {row.light}
                    </p>
                  </div>
                  <div className="bg-surface px-4 py-4">
                    <div
                      className="h-8 rounded-lg border border-default"
                      style={{ backgroundColor: row.dark }}
                    />
                    <p className="mt-2 font-mono text-xs text-foreground-muted">
                      {row.dark}
                    </p>
                  </div>
                  <div className="bg-surface px-4 py-4 text-sm text-foreground-muted">
                    {row.usage}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Theme mode preview
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              The exact same utility classes below are rendered once in light
              mode and once inside a `.dark` wrapper.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ThemePreview theme="light" icon={<IconSun size={16} />} />
            <ThemePreview theme="dark" icon={<IconMoon size={16} />} />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Primary scale
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              The primary palette remains a scale token and is most useful for
              action emphasis, selected states, and semantic highlights.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {primaryScale.map((swatch) => (
              <TokenSwatch
                key={swatch.token}
                label={`primary.${swatch.token}`}
                value={swatch.hex}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Typography tokens
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              These values come directly from `designTokens.typography` and are
              the baseline for text rhythm across the package.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground">
                Font families
              </h3>
              <div className="mt-4 space-y-4">
                {typographyFontFamilies.map((fontFamily, index) => (
                  <React.Fragment key={fontFamily.name}>
                    {index > 0 ? <Divider /> : null}
                    <div>
                      <p className="text-sm text-foreground-subtle">
                        {fontFamily.name} - {fontFamily.label}
                      </p>
                      <p
                        style={{ fontFamily: fontFamily.label }}
                        className={
                          fontFamily.name === "mono"
                            ? "mt-2 text-lg text-foreground"
                            : "mt-2 text-2xl text-foreground"
                        }
                      >
                        {fontFamily.sample}
                      </p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground">
                Font sizes
              </h3>
              <div className="mt-4 space-y-3">
                {typographyFontSizes.map(({ name, size }) => (
                  <div key={name} className="flex items-baseline gap-4">
                    <span className="w-14 shrink-0 font-mono text-[10px] text-foreground-subtle">
                      {name}
                    </span>
                    <span
                      className={`${
                        fontSizeClassMap[
                          name as keyof typeof fontSizeClassMap
                        ] ?? "text-base"
                      } leading-none text-foreground`}
                    >
                      Ag
                    </span>
                    <span className="text-xs text-foreground-subtle">
                      {formatRemWithPx(size)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground">
                Font weights
              </h3>
              <div className="mt-4 space-y-3">
                {typographyFontWeights.map(({ name, weight }) => (
                  <div key={name} className="flex items-center gap-4">
                    <span className="w-20 shrink-0 font-mono text-[10px] text-foreground-subtle">
                      {name} ({weight})
                    </span>
                    <span
                      className={`${
                        fontWeightClassMap[
                          name as keyof typeof fontWeightClassMap
                        ] ?? "font-normal"
                      } text-lg text-foreground`}
                    >
                      The quick brown fox
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground">
                Radius tokens
              </h3>
              <div className="mt-4 flex flex-wrap gap-4">
                {radiusTokens.map(({ name, radius }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="h-12 w-12 border-2 border-primary bg-primary/10"
                      style={{ borderRadius: radius }}
                    />
                    <span className="font-mono text-[10px] text-foreground-subtle">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="rounded-2xl border border-default bg-surface p-6 shadow-sm">
          <div className="flex flex-wrap items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconPalette size={18} />
            </span>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                Compatibility notes
              </h2>
              <p className="text-sm text-foreground-muted">
                Legacy aliases like `background.*`, `border.muted`, and
                `text.primary` are still present in `designTokens` so existing
                consumers do not break. New component work should prefer the
                semantic neutral layer.
              </p>
              <p className="text-sm text-foreground-muted">
                Syntax coloring in `CodeBlock` remains an intentional exception
                until the system gains dedicated syntax tokens.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Design Tokens",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Reference page for vt-design-system design tokens, typography tokens, semantic theme utilities, and light/dark theming behavior.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => <DesignTokensDocs />,
};

export const DarkModeReference: Story = {
  render: () => <DesignTokensDocs />,
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};
