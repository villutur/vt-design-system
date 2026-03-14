import React from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import {
  Alert,
  Badge,
  Button,
  CodeBlock,
  Divider,
  SectionPanel,
  StatusBadge,
  designTokens,
} from "../../../src/index";
import type { SizeMode } from "../../../src/index";
import {
  consumerThemeOverrideCssExample,
  semanticUtilityUsageExample,
  sizeModeCssExample,
} from "../../../src/internal/examples/foundationsDocs";

const primaryScaleEntries = [
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

const semanticTokenRows = [
  {
    token: "canvas",
    utility: "bg-canvas",
    usage: "Page and app shell background",
    light: designTokens.colors.semantic.light.canvas,
    dark: designTokens.colors.semantic.dark.canvas,
  },
  {
    token: "surface",
    utility: "bg-surface",
    usage: "Cards, sections, dialogs, drawers",
    light: designTokens.colors.semantic.light.surface,
    dark: designTokens.colors.semantic.dark.surface,
  },
  {
    token: "surface-subtle",
    utility: "bg-surface-subtle",
    usage: "Quiet panels and hover blocks",
    light: designTokens.colors.semantic.light.surfaceSubtle,
    dark: designTokens.colors.semantic.dark.surfaceSubtle,
  },
  {
    token: "surface-muted",
    utility: "bg-surface-muted",
    usage: "Inputs, chips, muted controls",
    light: designTokens.colors.semantic.light.surfaceMuted,
    dark: designTokens.colors.semantic.dark.surfaceMuted,
  },
  {
    token: "foreground",
    utility: "text-foreground",
    usage: "Primary content copy",
    light: designTokens.colors.semantic.light.foreground,
    dark: designTokens.colors.semantic.dark.foreground,
  },
  {
    token: "foreground-muted",
    utility: "text-foreground-muted",
    usage: "Helper text and secondary copy",
    light: designTokens.colors.semantic.light.foregroundMuted,
    dark: designTokens.colors.semantic.dark.foregroundMuted,
  },
  {
    token: "foreground-subtle",
    utility: "text-foreground-subtle",
    usage: "Metadata, placeholders, separators",
    light: designTokens.colors.semantic.light.foregroundSubtle,
    dark: designTokens.colors.semantic.dark.foregroundSubtle,
  },
  {
    token: "foreground-inverse",
    utility: "text-foreground-inverse",
    usage: "Text on inverse surfaces like tooltips",
    light: designTokens.colors.semantic.light.foregroundInverse,
    dark: designTokens.colors.semantic.dark.foregroundInverse,
  },
  {
    token: "border-default",
    utility: "border-default",
    usage: "Default panel chrome and dividers",
    light: designTokens.colors.semantic.light.borderDefault,
    dark: designTokens.colors.semantic.dark.borderDefault,
  },
  {
    token: "border-strong",
    utility: "border-strong",
    usage: "Stronger neutral emphasis",
    light: designTokens.colors.semantic.light.borderStrong,
    dark: designTokens.colors.semantic.dark.borderStrong,
  },
  {
    token: "overlay",
    utility: "bg-overlay/40",
    usage: "Backdrop scrims behind overlays",
    light: designTokens.colors.semantic.light.overlay,
    dark: designTokens.colors.semantic.dark.overlay,
  },
] as const;

const statusTokenRows = [
  {
    name: "primary",
    hex: designTokens.colors.primary.DEFAULT,
    badgeVariant: "softPrimary" as const,
  },
  {
    name: "success",
    hex: designTokens.colors.success.DEFAULT,
    badgeVariant: "softSuccess" as const,
  },
  {
    name: "warning",
    hex: designTokens.colors.warning.DEFAULT,
    badgeVariant: "softWarning" as const,
  },
  {
    name: "error",
    hex: designTokens.colors.error.DEFAULT,
    badgeVariant: "softError" as const,
  },
] as const;

function ThemeTokenSwatch({ label, value }: { label: string; value: string }) {
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
          This card scales locally so the three size modes are visibly different
          side by side.
        </p>
      </div>
    </div>
  );
}

function ThemeModePreview({
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
                  {theme === "light" ? "Light mode" : "Dark mode"}
                </p>
                <p className="text-xs text-foreground-muted">
                  Same classes, different CSS variable values.
                </p>
              </div>
            </div>
            <Badge variant="softPrimary">
              {theme === "dark" ? ".dark active" : ":root active"}
            </Badge>
          </div>

          <div className="space-y-4 p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <ThemeTokenSwatch label="canvas" value={semantic.canvas} />
              <ThemeTokenSwatch label="surface" value={semantic.surface} />
              <ThemeTokenSwatch
                label="surface-muted"
                value={semantic.surfaceMuted}
              />
            </div>

            <div className="rounded-xl border border-default bg-surface-subtle p-4">
              <p className="text-sm font-semibold text-foreground">
                Themed surface preview
              </p>
              <p className="mt-1 text-sm text-foreground-muted">
                Inputs, cards, overlays, and helper text should use semantic
                neutrals rather than raw slate or gray classes.
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

interface ThemeSectionProps {
  sizeMode: SizeMode;
  onSizeModeChange: (mode: SizeMode) => void;
}

export function ThemeSection({
  sizeMode,
  onSizeModeChange,
}: ThemeSectionProps) {
  const activeSizeMode = designTokens.sizeModes[sizeMode];

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="softPrimary">Foundations Guide</Badge>
          <Badge variant="soft">Design tokens</Badge>
          <Badge variant="soft">Theming</Badge>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Design Tokens & Theming
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-foreground-muted">
            This view explains the current runtime theming surface for the
            component library. `src/tokens.ts` is the source of truth,
            `src/theme.css` exposes semantic utilities and injects the active
            CSS variables, and `src/styles.css` builds the shared component
            stylesheet on top of that theme contract.
          </p>
        </div>
      </div>

      <Alert type="info" title="Recommended usage">
        Prefer semantic tokens for neutral layout and chrome: `bg-canvas`,
        `bg-surface`, `bg-surface-subtle`, `bg-surface-muted`,
        `text-foreground`, `text-foreground-muted`, `text-foreground-subtle`,
        `border-default`, and `border-strong`. Keep `primary`, `success`,
        `warning`, and `error` for meaning and state.
      </Alert>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionPanel
          title="Preview Size Modes"
          subtitle="Quick experiment for overall component scale"
        >
          <div className="space-y-4">
            <p className="text-sm text-foreground-muted">
              Size mode changes `--vt-root-font-size` on the `html` element.
              Because much of the system already relies on `rem` units,
              switching modes scales a large part of the library immediately
              without editing individual components.
            </p>

            <div className="flex flex-wrap gap-sm">
              {Object.entries(designTokens.sizeModes).map(([mode, config]) => (
                <Button
                  key={mode}
                  variant={mode === sizeMode ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => onSizeModeChange(mode as SizeMode)}
                >
                  {config.label}
                </Button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(designTokens.sizeModes).map(([, config]) => (
                <SizeModeComparisonCard
                  key={config.label}
                  label={config.label}
                  rootFontSize={config.rootFontSize}
                  description={config.description}
                />
              ))}
            </div>

            <div className="rounded-xl border border-default bg-surface-subtle p-md">
              <p className="text-sm font-semibold text-foreground">
                Active preview mode: {activeSizeMode.label}
              </p>
              <p className="mt-xs text-sm text-foreground-muted">
                {activeSizeMode.description}
              </p>
              <p className="mt-sm font-mono text-xs text-foreground-muted">
                --vt-root-font-size: {activeSizeMode.rootFontSize}
              </p>
            </div>

            <p className="text-sm text-foreground-muted">
              This is the fastest way to compare readability before deciding
              whether `typography.fontSize` and `spacing` tokens should change
              permanently.
            </p>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Size Mode Implementation"
          subtitle="CSS variable that powers the preview"
          noPadding
        >
          <CodeBlock
            code={sizeModeCssExample}
            language="css"
            title="size-mode.css"
            copyable
            wrapLongLines
            className="rounded-none border-0 shadow-none"
          />
        </SectionPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionPanel
          title="Theming Architecture"
          subtitle="How tokens become utilities"
        >
          <div className="space-y-3 text-sm text-foreground-muted">
            <p>
              1. `designTokens.colors.semantic` defines light and dark values
              for neutrals like canvas, surface, foreground, and borders.
            </p>
            <p>
              2. `src/theme.css` maps those values to utilities like
              `bg-canvas`, `bg-surface`, `text-foreground`, and
              `border-default`, then injects `:root`, `.dark`, and
              `html[data-size-mode]` CSS variables.
            </p>
            <p>
              3. `src/styles.css` builds the package component stylesheet, and
              consuming apps import `vt-design-system/theme.css` in their own
              Tailwind entry so app-local utilities use the same theme.
            </p>
            <p>
              4. Components consume semantic utilities instead of raw `slate-*`,
              `gray-*`, `white`, or `black` neutrals.
            </p>
            <p>
              5. Accent tokens like `primary`, `success`, `warning`, and `error`
              remain meaning-driven.
            </p>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Preferred Usage"
          subtitle="Semantic utility example"
          noPadding
        >
            <CodeBlock
              code={semanticUtilityUsageExample}
              language="tsx"
              title="semantic-theme.tsx"
              copyable
            wrapLongLines
            className="rounded-none border-0 shadow-none"
          />
        </SectionPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionPanel
          title="Consumer Theme Override File"
          subtitle="Runtime CSS variables available to consuming apps today"
          noPadding
        >
          <CodeBlock
            code={consumerThemeOverrideCssExample}
            language="css"
            title="app-theme.css"
            copyable
            wrapLongLines
            className="rounded-none border-0 shadow-none"
          />
        </SectionPanel>

        <SectionPanel
          title="Consumer Notes"
          subtitle="What this file can and cannot change"
        >
          <div className="space-y-3 text-sm text-foreground-muted">
            <p>
              Import a consumer override file after
              `vt-design-system/theme.css`, then replace only the CSS variables
              you need.
            </p>
            <p>
              The runtime override surface currently includes semantic neutral
              colors plus `--vt-root-font-size`.
            </p>
            <p>
              Accent palette values such as `primary`, `success`, `warning`,
              and `error`, along with spacing and font-family tokens, are still
              build-time tokens today rather than runtime CSS variables.
            </p>
            <p>
              If we later expose a broader runtime token surface, this override
              file should be the place where consumers discover it first.
            </p>
          </div>
        </SectionPanel>
      </div>

      <SectionPanel
        title="Semantic Neutral Tokens"
        subtitle="Light and dark values from src/tokens.ts"
        noPadding
      >
        <div className="overflow-hidden">
          <div className="grid gap-px bg-border-default md:grid-cols-[1.1fr_1fr_1fr_1.2fr]">
            <div className="bg-surface-subtle px-md py-sm text-[10px] font-bold tracking-[0.14em] text-foreground-subtle uppercase">
              Token
            </div>
            <div className="bg-surface-subtle px-md py-sm text-[10px] font-bold tracking-[0.14em] text-foreground-subtle uppercase">
              Light
            </div>
            <div className="bg-surface-subtle px-md py-sm text-[10px] font-bold tracking-[0.14em] text-foreground-subtle uppercase">
              Dark
            </div>
            <div className="bg-surface-subtle px-md py-sm text-[10px] font-bold tracking-[0.14em] text-foreground-subtle uppercase">
              Usage
            </div>

            {semanticTokenRows.map((row) => (
              <React.Fragment key={row.token}>
                <div className="bg-surface px-md py-md">
                  <p className="text-sm font-semibold text-foreground">
                    {row.token}
                  </p>
                  <p className="mt-xs font-mono text-xs text-foreground-muted">
                    {row.utility}
                  </p>
                </div>
                <div className="bg-surface px-md py-md">
                  <div
                    className="h-8 rounded-lg border border-default"
                    style={{ backgroundColor: row.light }}
                  />
                  <p className="mt-sm font-mono text-xs text-foreground-muted">
                    {row.light}
                  </p>
                </div>
                <div className="bg-surface px-md py-md">
                  <div
                    className="h-8 rounded-lg border border-default"
                    style={{ backgroundColor: row.dark }}
                  />
                  <p className="mt-sm font-mono text-xs text-foreground-muted">
                    {row.dark}
                  </p>
                </div>
                <div className="bg-surface px-md py-md text-sm text-foreground-muted">
                  {row.usage}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </SectionPanel>

      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            Theme Mode Preview
          </h3>
          <p className="mt-1 text-sm text-foreground-muted">
            The same semantic classes are rendered once in light mode and once
            inside a `.dark` wrapper.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ThemeModePreview theme="light" icon={<IconSun size={16} />} />
          <ThemeModePreview theme="dark" icon={<IconMoon size={16} />} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionPanel
          title="Primary Scale"
          subtitle="Action emphasis and selection states"
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {primaryScaleEntries.map((swatch) => (
              <ThemeTokenSwatch
                key={swatch.token}
                label={`primary.${swatch.token}`}
                value={swatch.hex}
              />
            ))}
          </div>
        </SectionPanel>

        <SectionPanel
          title="Status Tokens"
          subtitle="Semantic accents stay meaning-driven"
        >
          <div className="space-y-4">
            {statusTokenRows.map((token) => (
              <div
                key={token.name}
                className="rounded-xl border border-default bg-surface-subtle p-md"
              >
                <div className="flex items-center justify-between gap-md">
                  <div>
                    <p className="text-sm font-semibold text-foreground capitalize">
                      {token.name}
                    </p>
                    <p className="font-mono text-xs text-foreground-muted">
                      {token.hex}
                    </p>
                  </div>
                  <Badge variant={token.badgeVariant}>{token.name}</Badge>
                </div>
                <div
                  className="mt-sm h-3 rounded-full"
                  style={{ backgroundColor: token.hex }}
                />
              </div>
            ))}

            <Divider />

            <div className="flex flex-wrap gap-2">
              <StatusBadge status="active" />
              <StatusBadge status="pending" />
              <StatusBadge status="warning" />
              <StatusBadge status="error" />
              <StatusBadge status="archived" />
            </div>
          </div>
        </SectionPanel>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Status Palette</h3>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="active" />
          <StatusBadge status="success" />
          <StatusBadge status="pending" />
          <StatusBadge status="warning" />
          <StatusBadge status="error" />
          <StatusBadge status="failed" />
          <StatusBadge status="archived" />
          <StatusBadge status="inactive" />
        </div>
      </div>
    </section>
  );
}
