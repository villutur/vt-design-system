# Internal Helpers

This file adds local rules for `src/internal/`.

Canonical implementation guidance lives in:

- `docs/technical/component-patterns.md`
- Root `AGENTS.md`

Use this file only for short local rules that are easy to forget.

## Local Rules

- Add a shared helper only when the behavior is already reused or is clearly becoming cross-component infrastructure.
- Prefer narrowly scoped helpers with clear names over one large helper that mixes unrelated concerns.
- Keep `src/internal/` private to the package unless there is a deliberate decision to promote an abstraction to the public API.
- Internal helpers should optimize for reuse across components, not for exposing configuration that only one component needs.
- When a new helper creates or changes a stable architectural pattern, document that pattern in `docs/technical/component-patterns.md`.
