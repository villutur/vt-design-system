# vt-design-system

This repository contains a reusable design system built with React, TypeScript, and Tailwind CSS v4. It is published as an npm package so shared UI components, design tokens, and styles can be reused consistently across other projects.

## Purpose

- **Reusability:** Provide common components such as buttons, inputs, cards, navigation, and overlays for multiple applications.
- **Consistency:** Keep a single visual language through centralized tokens, shared Tailwind mappings, and common component patterns.
- **Simplicity:** Make the package easy to consume by exporting React components and a shared stylesheet.

## Project Structure

- `src/components/`: Source code for all React components, grouped by category such as `Layout`, `Navigation`, `Forms`, `Feedback`, `Overlay`, `Surfaces`, and `DataDisplay`.
- `src/theme.css`: Central Tailwind CSS v4 theme contract. Shared tokens, semantic utilities, dark-mode handling, and runtime CSS variables live here.
- `src/styles.css`: Shared Tailwind entrypoint for package component styles.
- `src/tokens.ts`: Single source of truth for design tokens.
- `src/index.ts`: Public package entrypoint. Every component that should ship in the package must be exported here.
- `src/internal/`: Internal implementation helpers for floating positioning, dismissal, focus handling, controllable state, and list navigation. These are not part of the public package API.
- `src/docs/`: Storybook docs-only pages and example pages that are not tied to a single component folder.
- `docs/technical/`: Contributor- and agent-facing technical handbook pages, research notes, and short ADR-style decision notes.
- `docs/technical/research/`: Internal research notes for open technical questions, tradeoff analysis, and architecture exploration before work becomes an ADR, stable pattern, or deferred backlog item.
- `dev/App.tsx`: Development preview entrypoint.
- `dev/preview/`: The real home for preview composition, navigation, controls, and per-section preview modules.
- `.storybook/`: Storybook configuration for interactive component documentation.
- `package.json`: Build scripts and exported package entrypoints for JS and CSS assets.

## Guidelines For Developers And Agents

When working in this repository, follow these rules so local conventions stay aligned with the `use-vt-design-system` and `storybook-stories` skills.

### 0. Language Policy

- **English only:** All code, comments, docs, commit messages, story text, and variable names created in this repository must be written in English.

### 1. Before Creating Something New

- Look for an existing component before creating a custom solution.
- Prefer extending the current component catalog and visual language over introducing one-off patterns.
- Keep new components inside the existing category structure under `src/components/{Category}/`.

### 2. Creating Or Updating Components

- Create each component in its own file, for example `src/components/Navigation/Breadcrumbs.tsx`.
- Interactive UI components should use `React.forwardRef` so consuming apps can attach refs reliably.
- Extend the relevant standard HTML attributes when possible, for example `React.ButtonHTMLAttributes<HTMLButtonElement>`.
- Components should accept a `className` prop and merge it with internal classes using the shared `cn(...)` utility from `src/utils/cn.ts`.
- Prefer data-driven component APIs when that matches existing library patterns.
- Prefer viewer-only or render-only contracts for workflow-oriented display surfaces unless the design system intentionally owns higher-level behavior. Components such as `MarkdownRenderer`, `AIResponseView`, and `LogViewer` should not absorb session state, logger/store concerns, worker logic, or transport orchestration by default.
- Keep read-only inspection surfaces such as `InspectorPanel` presentation-first. They can frame details, metadata, and comparison content, but they should not own route orchestration, persistence, or workflow state.
- If a component uses icons, prefer `@tabler/icons-react`, which is the icon library used across this design system.
- For complex overlays, searchable lists, and menu-like components, prefer reusing shared helpers from `src/internal/` instead of reimplementing focus, dismissal, or list navigation behavior.
- If app shells need reusable top-bar controls such as theme toggles or environment actions, prefer extending the shared `Header` API instead of layering custom absolute-positioned controls in each consumer.

### 3. Styling, Tokens, And Theming

- Tailwind CSS v4 is the default styling layer. Prefer Tailwind utilities over inline styles, custom CSS files, or CSS modules.
- Use semantic theme classes and mapped design-system tokens instead of hardcoded hex colors inside components.
- Design tokens belong in `src/tokens.ts`. If you add new tokens that Tailwind should expose, also map them in `src/theme.css`.
- Be careful with Tailwind theme namespace collisions. If you introduce tokens in a namespace that also drives core utilities, verify the generated consumer classes still mean what callers expect. The current `theme.css` intentionally restores the standard `max-w-*` container measures because the package also exposes custom `--spacing-*` aliases such as `p-lg` and `gap-xl`.
- Preview and demo displays for tokens should derive token names and values from `src/tokens.ts`, not from hardcoded demo arrays.
- Components should remain compatible with the repository's `.dark` theme handling.
- When adding new UI, provide appropriate `dark:` variants rather than building light-only styles.
- Consumers should import `vt-design-system/theme.css` in their Tailwind entry stylesheet and `vt-design-system/styles.css` for package component styles.
- Public multiline text entry should prefer the shared `Textarea` component unless a workflow truly needs the richer `CommandInput` surface or a custom `Field` composition.

### 4. Exporting Components

- Every public component must be exported from `src/index.ts`.
- If a component is not exported from `src/index.ts`, it will not be available in the built npm package.
- Keep the package export surface intentional for React Server Components. The root `vt-design-system` entrypoint is the client-oriented barrel, while `vt-design-system/server` should stay limited to hook-free, read-only presentation exports that Server Components can import safely.
- When a consumer app needs a reusable component, token, helper, or stylesheet path, fix the package export surface here rather than telling the consumer to import from this repository via `../..`.
- Maintain a clean consumer contract. Other repositories in the workspace should consume `vt-design-system` through package exports, not through direct cross-repo source imports.
- Keep the published consumer contract complete: package exports should cover runtime JS, CSS entrypoints, and a normal TypeScript declaration path that linked workspace apps can resolve reliably.

### 5. Dev Preview

- Always keep the dev preview current when adding a new component or making a significant change to an existing one.
- `dev/App.tsx` is the preview entrypoint, but significant preview logic may live in the modular `dev/preview/` structure.
- The preview should demonstrate realistic usage, not only a minimal smoke test.

### 6. Storybook Conventions In This Repository

- Storybook is part of the required maintenance workflow for components in this repository.
- Component stories live alongside components as `ComponentName.stories.tsx` files inside `src/components/**`, not in a separate `src/stories/` directory.
- Docs-only and example Storybook pages may also live under `src/docs/**` when they represent foundations, documentation pages, or cross-component examples rather than a single component.
- This repository uses `@storybook/react-vite`, configured from `.storybook/main.ts`.
- Use the standard Storybook typing pattern:

  ```tsx
  import type { Meta, StoryObj } from "@storybook/react-vite";
  ```

- Use `title` values that follow the current catalog structure, for example `Components/Navigation/Breadcrumbs`.
- Include `tags: ["autodocs"]` unless there is a strong reason not to.
- Add meaningful states and variants, not just a single default example.
- Use `args` and `argTypes` when they improve discoverability and controls in Storybook.
- Add `play` functions only when interaction testing adds clear value for the component.
- In this Storybook setup, interaction helpers such as `fn`, `expect`, `userEvent`, and `within` should come from `storybook/test`. Do not import `fn` from `storybook/actions`.
- Stories should work correctly with the global theme toolbar and preview wrapper defined in `.storybook/preview.ts`.
- Repository-specific Storybook conventions take precedence over generic Storybook skill templates if they conflict.

### 7. Consuming vt-design-system In Other Projects

- Consumers should import components from the package entrypoint:

  ```tsx
  import { Button, Card, CardTitle, CardDescription } from "vt-design-system";
  ```

- Consumers must also import the shared theme in their Tailwind entry and the shared component stylesheet at the app root:

  ```css
  @import "tailwindcss";
  @import "vt-design-system/theme.css";
  ```

  ```tsx
  import "vt-design-system/styles.css";
  ```

- If consumers need an additional public stylesheet path or export, add it to `package.json` exports in this repository instead of relying on relative filesystem imports from the consuming app.

### 8. Technical Documentation Sources

- Keep the documentation split by audience:
  - `AGENTS.md` is the repo-wide ruleset and entrypoint for contributors and agents.
  - `docs/technical/component-patterns.md` is the canonical internal handbook for implementation patterns, API structure, and documentation maintenance rules.
  - `docs/technical/research/` is the internal workspace for open technical questions, tradeoff analysis, and architecture exploration before conclusions are promoted elsewhere.
  - Nested `AGENTS.md` files may exist near component categories or internal helpers when local rules genuinely differ from the repo-wide defaults.
  - Storybook foundations docs under `src/docs/**` are the public-facing technical reference for consumers of the package.
- Treat `docs/technical/component-patterns.md` as the internal source of truth when a pattern changes.
- Use `docs/technical/research/` for exploratory technical notes, not for stable rules or deferred implementation tracking.
- Treat Storybook foundations docs as the consumer-facing source of truth when public usage guidance changes.
- Skills are optional accelerators for agents, not canonical documentation sources. If a skill is added later, it must summarize and link back to the canonical docs instead of diverging from them.
- When a technical change lands, update the right layer:
  - Open technical question or architecture tradeoff exploration: `docs/technical/research/**`
  - Internal pattern or implementation rule: `docs/technical/component-patterns.md` and any relevant nested `AGENTS.md`
  - Consumer-visible API or usage pattern: Storybook foundations docs and affected component stories
  - Exported surface or setup guidance: `README.md`
  - Deferred work: `docs/future-work.md`

### 9. Future Work Tracking

- Use `docs/future-work.md` as the shared backlog for deferred implementation details, phase 2 ideas, nice-to-have items, and future wishes.
- When work is intentionally left out of the current implementation, add a short entry to `docs/future-work.md` instead of relying on memory.
- When the user mentions something as "later", "phase 2", "nice to have", "worth revisiting", or similar, capture it in `docs/future-work.md`.
- Agents may also add relevant future-work items discovered during implementation when they are clearly out of scope for the current task.
- Before implementing a component or extending a related area, quickly check `docs/future-work.md` to see whether any connected items are worth addressing at the same time.
- The file is collaborative: both agents and the user may add, edit, or remove entries over time.

### 10. Build And Sanity Check

- The codebase should always remain buildable.
- After adding or significantly changing a component, run:

  ```bash
  pnpm run build --reporter=append-only
  ```

- This verifies the package build, type declarations, and generated stylesheet output.
