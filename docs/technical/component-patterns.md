# Component Patterns

This document is the canonical internal handbook for implementation patterns, API structure, and documentation maintenance in `vt-design-system`.

Use this file when:

- Adding a new public component
- Extending an existing API
- Introducing a new shared internal helper
- Deciding where a technical pattern should be documented
- Reviewing whether a change stays aligned with the current component architecture

For consumer-facing guidance, document the public subset of these patterns in Storybook foundations docs under `src/docs/**`.

## Core API Conventions

- Interactive public components should use `React.forwardRef`.
- Extend the closest relevant native HTML attribute interface when possible.
- Accept `className` and merge it with internal classes via `cn(...)`.
- Prefer controlled and uncontrolled support for stateful primitives when the pattern is likely to be reused.
- Prefer data-driven APIs when the component models structured content.
- Prefer render props or composition only when a data-driven API would become awkward or overly restrictive.
- Export every public component from `src/index.ts`.
- Keep `src/internal/` helpers private to the package unless there is a deliberate decision to promote them.

## Forms

- `Field` is the shared shell for label, description, helper text, error text, required state, disabled state, and message spacing.
- New public form controls should compose with `Field` unless the control is intentionally label-less or has a strong structural reason not to.
- Use the same core prop vocabulary when possible:
  - `label`
  - `description`
  - `helperText`
  - `errorText`
  - `error`
  - `required`
  - `disabled`
  - `size` when density is configurable
- Support predictable label-to-control wiring through `id`, `htmlFor`, `aria-describedby`, and related field messaging IDs.
- If a control needs custom markup, prefer wrapping the markup with `Field` instead of reimplementing label and message layout logic.
- Anchored form controls such as `ComboBox` and `DatePicker` should follow both the Forms and Overlay patterns.
- `CommandInput` is the multiline prompt-oriented control that extends `Field` into command, prompt, and assistant-style workflows. It may expose optional prompt history and slash-command discovery, but it should remain a reusable input surface rather than absorbing chat session or transport orchestration.
- `SplitButton` is the preferred pattern when a primary action should remain dominant while related alternatives stay attached to the same control.

## Overlays

- Use `Popover` as the base for anchored overlays that open relative to a trigger and are not modal dialogs.
- Use `Tooltip` for brief, non-interactive contextual help. It shares positioning foundations with other anchored overlays, but it remains a specialized pattern.
- `Dropdown` should follow the popover-style anchored overlay model rather than implementing its own positioning and dismissal stack.
- `Modal` and `Drawer` are dialog-layer components. They should not be modeled as popovers.
- Reuse shared internals for:
  - anchored positioning
  - outside dismissal
  - escape handling
  - focus return
  - focus trap when the overlay is modal
  - body scroll lock for dialog layers
- When introducing a new overlay, decide explicitly whether it is:
  - non-modal and anchored to a trigger
  - modal and dialog-like
  - hover/focus help only

## Data Display

- `Table` is the lightweight semantic table primitive.
- `DataTable` is the advanced behavior layer for filtering, sorting, pagination, selection, and richer toolbar workflows.
- `Toolbar` is the shared action-bar primitive for dense command areas such as `DataTable`, inspectors, and filter surfaces.
- `Image` is the low-level media primitive for shared image presentation, fit, framing, rounding, and fallback handling. It should stay display-only rather than absorbing gallery or upload concerns.
- `MarkdownRenderer` is the shared content primitive for markdown-heavy surfaces such as release notes, generated summaries, and assistant output.
- `AIResponseView` is the workflow-oriented renderer for assistant responses, tool calls, reasoning summaries, and lightweight attachments. It should stay transport-agnostic and composition-friendly rather than owning chat session logic.
- `ChatBubble` is the conversation-row primitive for chat-style layouts. It should stay focused on alignment, tone, meta, and long-content resilience rather than owning assistant session or transport state.
- `LogViewer` is the viewer-only high-volume log surface for structured operational logs. It should stay focused on rendering, filtering, search, expansion, and virtualization rather than shipping a logger, worker, or transport layer in v1.
- When append-only chat or operational surfaces need shared scroll-to-tail behavior, prefer `ScrollArea` with its opt-in `followTail` contract and keep jump-to-tail controls in the surrounding composition.
- Both table surfaces should support realistic state handling where applicable:
  - loading
  - empty
  - error
  - long-content overflow
  - density
  - sticky headers when useful
- Keep advanced grid behaviors such as column resizing and pinning opt-in so `DataTable` can scale up without forcing spreadsheet-like complexity on every usage.
- Avoid creating additional table-like surfaces before checking whether the need belongs in `Table`, `DataTable`, or a future planned extension.

## Feedback And Status

- `Banner` is for page- or section-level messaging.
- `Alert` is for inline messaging within a view or surface.
- `Toast` is for transient notifications.
- `EmptyState` is for zero-data or first-run surfaces.
- `Skeleton` and `Spinner` represent loading states at different levels of fidelity.
- `MetricCard` is a KPI-oriented surface, not a generic message component.
- When adding new feedback components, define their role relative to this ladder instead of overlapping existing behavior.

## Styling, Tokens, And Theming

- Prefer semantic neutral classes such as `bg-surface`, `bg-surface-subtle`, `text-foreground`, `text-foreground-muted`, and `border-default`.
- Avoid raw `slate-*`, `gray-*`, or other hardcoded neutral color utilities in components, docs, and preview examples when semantic tokens exist.
- Add `dark:` behavior or rely on semantic tokens so new UI remains compatible with the `.dark` theme model.
- Keep token source-of-truth changes in `src/tokens.ts`, and expose new mapped values through Tailwind configuration when needed.

## Documentation Maintenance Rules

- Update this file when a stable internal pattern or API convention changes.
- Update nested `AGENTS.md` files only when an area needs short local rules beyond the repo-wide defaults.
- Update Storybook foundations docs when consumers need to understand a public pattern or usage contract.
- Update affected component stories with concise component-level docs when public behavior changes.
- Update `README.md` when installation, setup, exports, or high-level package guidance changes.
- Update `docs/future-work.md` when something is intentionally deferred or identified as phase 2 work.
- For larger architectural decisions that are worth preserving separately, add a short ADR-style note under `docs/technical/adr/`.
