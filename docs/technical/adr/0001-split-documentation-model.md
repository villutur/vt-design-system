# ADR 0001: Split Documentation Model

- Status: Accepted
- Date: 2026-03-12

## Context

The design system now has stable technical patterns for public APIs, form architecture, overlays, data display, and feedback surfaces. Those patterns need to be understandable in two different contexts:

- contributors and agents working inside this repository
- consumers using the published package from other projects

One documentation location is not a good fit for both audiences. Internal contributors need implementation guidance and source-of-truth rules, while consumers need stable usage guidance without internal-only details.

## Decision

Adopt a split documentation model:

- `AGENTS.md` stays the repo-wide entrypoint for contributors and agents.
- `docs/technical/component-patterns.md` becomes the canonical internal handbook for implementation and API structure patterns.
- Short nested `AGENTS.md` files may exist near component categories or internal helpers when local rules materially differ.
- Storybook foundations docs under `src/docs/**` become the public-facing technical handbook for consumers.
- Skills are optional mirrors for agents and must not become the canonical source of truth.

## Consequences

- Internal rules and public usage guidance can evolve together without being collapsed into one audience-mismatched document.
- Contributors have a clear place to record implementation patterns and maintenance rules.
- Consumers get technical guidance in the documentation surface they already use to browse the package.
- Future technical changes must be documented in the correct layer instead of relying on one catch-all file.
