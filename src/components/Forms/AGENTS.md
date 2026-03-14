# Forms

This file adds local rules for `src/components/Forms/`.

Canonical implementation guidance lives in:

- `docs/technical/component-patterns.md`
- Root `AGENTS.md`

Use this file only for short local rules that are easy to forget.

## Local Rules

- New public form controls should compose with `Field` unless there is a strong structural reason not to.
- Keep field-related prop names aligned with the shared vocabulary where possible:
  - `label`
  - `description`
  - `helperText`
  - `errorText`
  - `error`
  - `required`
  - `disabled`
  - `size`
- Wire labels and messages through the correct `id`, `htmlFor`, and `aria-describedby` relationships.
- If a control opens an anchored panel, follow both the Forms rules here and the Overlay rules in `src/components/Overlay/AGENTS.md`.
- When public form behavior changes, update both the relevant component story and the Storybook foundations docs if the pattern is consumer-relevant.
