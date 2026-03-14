# Overlay

This file adds local rules for `src/components/Overlay/`.

Canonical implementation guidance lives in:

- `docs/technical/component-patterns.md`
- Root `AGENTS.md`

Use this file only for short local rules that are easy to forget.

## Local Rules

- Build new anchored, non-modal overlays on `Popover` unless there is a clear reason not to.
- Use `Tooltip` only for brief contextual help, not for modal or action-heavy surfaces.
- Keep `Modal` and `Drawer` in the dialog layer. They should not be modeled as popovers.
- Reuse shared overlay internals for focus return, dismissal, positioning, focus trap, and body scroll lock instead of reimplementing them.
- Every overlay should make its behavior explicit:
  - anchored non-modal overlay
  - dialog-like modal overlay
  - hover/focus help
- When public overlay behavior changes, update the component story and the Storybook foundations docs if consumers rely on the pattern.
