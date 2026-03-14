# vt-design-system

A reusable React design system built with TypeScript and Tailwind CSS v4.

## What It Provides

- Shared React components for app layout, navigation, forms, feedback, overlays, and data display
- Layout primitives can carry app-level controls such as header actions without forcing consumers into overlay hacks
- Viewer-only workflow and operational surfaces such as `MarkdownRenderer`, `AIResponseView`, and `LogViewer`
- Composition-friendly conversation and media primitives such as `Image` and `ChatBubble`
- Foundation primitives such as `Field`, `Popover`, and `Banner` for building higher-level patterns consistently
- Centralized design tokens exported from `src/tokens.ts`
- Shared theme and component stylesheets published as `vt-design-system/theme.css` and `vt-design-system/styles.css`
- A theme contract that keeps the package's semantic spacing aliases like `p-lg` and `gap-xl` while preserving standard Tailwind container measures such as `max-w-sm` through `max-w-7xl`
- Consumer-facing package types published from `vt-design-system` so linked workspace apps can resolve the same public API in `dev`, `build`, and `tsc`
- Storybook documentation and a local preview app for development

## Installation

```bash
npm install vt-design-system
# or
pnpm add vt-design-system
# or
yarn add vt-design-system
```

## Usage

Import the shared theme into your app stylesheet so Tailwind can generate the
shared utilities:

```css
@import "tailwindcss";
@import "vt-design-system/theme.css";
```

Then import the component stylesheet once at your app root:

```tsx
import "vt-design-system/styles.css";
```

The shared theme also preserves the expected Tailwind `max-w-*` container scale
for consumer apps, even though the package exposes custom spacing aliases like
`p-lg`, `px-xl`, and `gap-2xl`.

Then import the components you need:

```tsx
import {
  Button,
  Card,
  CardTitle,
  CardDescription,
  MetricCard,
} from "vt-design-system";
import { IconCurrencyDollar } from "@tabler/icons-react";

export function Example() {
  return (
    <div className="space-y-6 p-8">
      <Card>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>
          Shared UI built on the vt-design-system package.
        </CardDescription>
      </Card>

      <MetricCard
        title="Revenue"
        value="$12,345"
        trendValue="+14%"
        trendType="success"
        icon={<IconCurrencyDollar size={20} />}
      />

      <Button>Open dashboard</Button>
    </div>
  );
}
```

## Public Exports

The package currently exports components in these categories.

### Layout

- `AppShell`
- `CommandBar`
- `Divider`
- `Grid`
- `Header`
- `Panel`
- `ScrollArea`
- `Sidebar`
- `Toolbar`

### Navigation

- `Breadcrumbs`
- `Pagination`
- `Stepper`
- `Tabs`
- `TreeView`

### Surfaces

- `Accordion`
- `Card`
- `MetricCard`
- `SectionPanel`

### Feedback

- `Alert`
- `Banner`
- `EmptyState`
- `ProgressBar`
- `Skeleton`
- `Spinner`
- `Toast`

### Data Display

- `AIResponseView`
- `Avatar`
- `Badge`
- `ChatBubble`
- `Chip`
- `CodeBlock`
- `DataTable`
- `HealthBar`
- `Image`
- `KeyValue`
- `LogViewer`
- `MarkdownRenderer`
- `Sparkline`
- `StatusBadge`
- `Table`
- `Timeline`

### Forms

- `Button`
- `Checkbox`
- `ComboBox`
- `CommandInput`
- `DatePicker`
- `Field`
- `FileUpload`
- `Input`
- `NumberInput`
- `Radio`
- `Select`
- `SplitButton`
- `Textarea`
- `Toggle`

### Overlay

- `CommandPalette`
- `ContextMenu`
- `Dropdown`
- `Drawer`
- `Modal`
- `Popover`
- `Tooltip`

### Tokens

- `designTokens`
- `sizeModes`
- `SizeMode` (TypeScript type)

## Development

Install dependencies:

```bash
pnpm install
```

Run the local preview app:

```bash
pnpm run dev:app
```

Run Storybook:

```bash
pnpm run storybook
```

Technical documentation lives in two places:

- Storybook foundations pages under `src/docs/**` are the public technical handbook for consumers of the package.
- `docs/technical/component-patterns.md` is the contributor- and agent-facing internal handbook for implementation patterns and API structure.
- `docs/technical/research/**` is the internal workspace for open technical questions, tradeoff analysis, and architecture exploration before work becomes an ADR, stable pattern, or deferred backlog item.

Build the package and generated stylesheet:

```bash
pnpm run build --reporter=append-only
```

Quick component review checklist:

- Interactive components should forward refs where appropriate.
- Public components should merge `className` predictably with `cn(...)`.
- States should be covered for dark theme, disabled usage, and long content.
- Form controls should expose consistent label, helper, and error behavior.
- Overlays should handle outside dismissal, escape, focus movement, and focus return.
- Stories and preview examples should demonstrate realistic states, not only smoke tests.

## Repository Notes

- Public exports are defined in `src/index.ts`.
- Package entrypoints for JS, CSS, and consumer-facing types are declared in `package.json`.
- Component stories live alongside components in `src/components/**`, and docs/example stories also live in `src/docs/**`.
- Contributor-facing technical documentation and ADR-style notes live under `docs/technical/**`.
- Internal research notes for open technical questions and tradeoff analysis live under `docs/technical/research/**`.
- `dev/App.tsx` is the local preview entrypoint.
- `dev/preview/` contains the real preview composition, sidebar, controls, and section modules.
- Deferred and phase-2 ideas are tracked in `docs/future-work.md`.
- Repository-specific maintenance guidance lives in `AGENTS.md`.
