import React from "react";
import { IconRocket } from "@tabler/icons-react";
import {
  Alert,
  Badge,
  Card,
  Divider,
  Grid,
  GridItem,
  Header,
  SectionPanel,
} from "../../../src/index";
import { designTokens } from "../../../src/index";
import {
  formatRemWithPx,
  radiusTokens,
  typographyFontFamilies,
  typographyFontSizes,
  typographyFontWeights,
} from "../../../src/internal/examples/foundationsDocs";

const spacingTokens = Object.entries(designTokens.spacing)
  .filter(([token]) => token !== "none")
  .map(([token, size]) => ({
    token,
    size,
  }));

const fontSizeClassMap = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
} as const;

const fontSizes = typographyFontSizes.map(({ name, size }) => ({
  name,
  size,
  cls: fontSizeClassMap[name as keyof typeof fontSizeClassMap] ?? "text-base",
}));

const fontWeightClassMap = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

const fontWeights = typographyFontWeights.map(({ name, weight }) => ({
  name,
  weight,
  cls:
    fontWeightClassMap[name as keyof typeof fontWeightClassMap] ??
    "font-normal",
}));

export function TypographySection() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="softPrimary">Foundations Guide</Badge>
          <Badge variant="soft">Typography</Badge>
          <Badge variant="soft">Spacing & Radius</Badge>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Typography & Layout Tokens
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-foreground-muted">
            This preview explains the current typography, spacing, and radius
            tokens from `src/tokens.ts`. Font sizes are defined in `rem`, so
            they respond to the preview size mode controls without requiring
            per-component overrides.
          </p>
        </div>
      </div>

      <Alert type="info" title="Typography scaling">
        `fontSize` tokens remain `rem`-based, so changing the preview size mode
        is the fastest way to test readability before changing the token scale
        itself.
      </Alert>

      <div>
        <h3 className="mb-4 text-xl font-semibold text-foreground">
          Grid System
        </h3>
        <Grid
          cols={12}
          gap="md"
          className="rounded-xl border border-dashed border-strong bg-surface-subtle p-4"
        >
          <GridItem
            colSpan="full"
            className="flex h-16 items-center justify-center rounded-lg bg-primary/10 font-medium text-primary"
          >
            Header (colSpan="full")
          </GridItem>
          <GridItem
            colSpan={8}
            className="flex h-32 items-center justify-center rounded-lg border border-default bg-primary/10 font-medium text-primary"
          >
            Main Content (colSpan=8)
          </GridItem>
          <GridItem
            colSpan={4}
            className="flex h-32 items-center justify-center rounded-lg border border-default bg-surface font-medium text-foreground"
          >
            Sidebar (colSpan=4)
          </GridItem>
          <GridItem
            colSpan={4}
            className="flex h-24 items-center justify-center rounded-lg border border-default bg-surface-muted font-medium text-foreground"
          >
            Widget 1
          </GridItem>
          <GridItem
            colSpan={4}
            className="flex h-24 items-center justify-center rounded-lg border border-default bg-surface-muted font-medium text-foreground"
          >
            Widget 2
          </GridItem>
          <GridItem
            colSpan={4}
            className="flex h-24 items-center justify-center rounded-lg border border-default bg-surface-muted font-medium text-foreground"
          >
            Widget 3
          </GridItem>
        </Grid>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold text-foreground">
          Header Variants
        </h3>
        <SectionPanel
          title="Header"
          subtitle="The same layout states that now exist in Storybook"
        >
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-default bg-surface">
              <div className="border-b border-default px-md py-sm">
                <p className="text-sm font-semibold text-foreground">Default</p>
                <p className="mt-xs text-sm text-foreground-muted">
                  Search, notifications, help, and user identity all visible.
                </p>
              </div>
              <Header
                logoName="Nexus Enterprise"
                userName="Alex Rivera"
                userRole="System Admin"
                hasUnreadNotifications
                showSearch
                showNotifications
                showHelp
                showUser
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-default bg-surface">
              <div className="border-b border-default px-md py-sm">
                <p className="text-sm font-semibold text-foreground">
                  With User Image
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  Avatar image variant from the Storybook examples.
                </p>
              </div>
              <Header
                logoName="Nexus Enterprise"
                userName="Alex Rivera"
                userRole="System Admin"
                userImageUrl="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                hasUnreadNotifications
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-default bg-surface">
              <div className="border-b border-default px-md py-sm">
                <p className="text-sm font-semibold text-foreground">
                  No Unread Notifications
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  Keeps the same layout while removing the unread indicator.
                </p>
              </div>
              <Header
                logoName="Nexus Enterprise"
                userName="Alex Rivera"
                userRole="System Admin"
                hasUnreadNotifications={false}
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-default bg-surface">
              <div className="border-b border-default px-md py-sm">
                <p className="text-sm font-semibold text-foreground">
                  Custom Logo Prop
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  Custom brand lockup without changing the rest of the shell.
                </p>
              </div>
              <Header
                logo={
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-emerald-500 p-1.5 text-white">
                      <IconRocket size={20} />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-emerald-600">
                      My Custom App
                    </span>
                  </div>
                }
                userName="Alex Rivera"
                userRole="System Admin"
                hasUnreadNotifications
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="overflow-hidden rounded-2xl border border-default bg-surface lg:col-span-1">
                <div className="border-b border-default px-md py-sm">
                  <p className="text-sm font-semibold text-foreground">
                    Minimal
                  </p>
                  <p className="mt-xs text-sm text-foreground-muted">
                    Logo-only state for focused layouts.
                  </p>
                </div>
                <Header
                  logoName="Nexus Enterprise"
                  showSearch={false}
                  showNotifications={false}
                  showHelp={false}
                  showUser={false}
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-default bg-surface lg:col-span-1">
                <div className="border-b border-default px-md py-sm">
                  <p className="text-sm font-semibold text-foreground">
                    No Search
                  </p>
                  <p className="mt-xs text-sm text-foreground-muted">
                    Action area stays visible while the global search field is removed.
                  </p>
                </div>
                <Header
                  logoName="Nexus Enterprise"
                  userName="Alex Rivera"
                  userRole="System Admin"
                  hasUnreadNotifications
                  showSearch={false}
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-default bg-surface lg:col-span-1">
                <div className="border-b border-default px-md py-sm">
                  <p className="text-sm font-semibold text-foreground">
                    No Notifications / Help
                  </p>
                  <p className="mt-xs text-sm text-foreground-muted">
                    User identity stays visible even when the action buttons are hidden.
                  </p>
                </div>
                <Header
                  logoName="Nexus Enterprise"
                  userName="Alex Rivera"
                  userRole="System Admin"
                  hasUnreadNotifications
                  showNotifications={false}
                  showHelp={false}
                />
              </div>
            </div>
          </div>
        </SectionPanel>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold text-foreground">
          Spacing Tokens
        </h3>
        <Card className="p-6">
          <div className="space-y-4">
            {spacingTokens.map((space) => (
              <div key={space.token} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-foreground-muted">
                  {space.token}{" "}
                  <span className="text-xs opacity-70">({space.size})</span>
                </div>
                <div
                  className="h-8 rounded bg-primary/20 dark:bg-primary/40"
                  style={{ width: space.size }}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold text-foreground">
          Typography
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SectionPanel title="Font Family">
            <div className="space-y-4">
              {typographyFontFamilies.map((fontFamily, index) => (
                <React.Fragment key={fontFamily.name}>
                  {index > 0 ? <Divider /> : null}
                  <div>
                    <p className="mb-1 text-sm text-foreground-subtle">
                      {fontFamily.name} - {fontFamily.label}
                    </p>
                    <p
                      style={{ fontFamily: fontFamily.label }}
                      className={
                        fontFamily.name === "mono"
                          ? "text-lg text-foreground"
                          : "text-2xl text-foreground"
                      }
                    >
                      {fontFamily.sample}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel title="Font Sizes">
            <div className="space-y-3">
              {fontSizes.map(({ name, size, cls }) => (
                <div key={name} className="flex items-baseline gap-4">
                  <span className="w-14 shrink-0 font-mono text-[10px] text-foreground-subtle">
                    {name}
                  </span>
                  <span className={`${cls} leading-none text-foreground`}>
                    Ag
                  </span>
                  <span className="text-xs text-foreground-subtle">
                    {formatRemWithPx(size)}
                  </span>
                </div>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel title="Font Weights">
            <div className="space-y-3">
              {fontWeights.map(({ name, weight, cls }) => (
                <div key={name} className="flex items-center gap-4">
                  <span className="w-20 shrink-0 font-mono text-[10px] text-foreground-subtle">
                    {name} ({weight})
                  </span>
                  <span className={`${cls} text-lg text-foreground`}>
                    The quick brown fox
                  </span>
                </div>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel title="Border Radii">
            <div className="flex flex-wrap gap-4">
              {radiusTokens.map(({ name, radius }) => (
                <div key={name} className="flex flex-col items-center gap-2">
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
          </SectionPanel>
        </div>
      </div>
    </section>
  );
}
