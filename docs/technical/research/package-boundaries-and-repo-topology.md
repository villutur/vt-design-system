# Package Boundaries And Repo Topology

- Status: `Open`
- Date: 2026-03-12

## Question

Should behavior-heavy capabilities such as virtualization and similar data-oriented utilities remain inside the current design system package, or should they eventually move into a separate package or project? If separation becomes desirable, should it happen inside the same repo as a monorepo/workspace or as a separate repository? Should Storybook remain attached to the design system package or eventually move into a separate docs surface?

## Context

`vt-design-system` currently ships as a single package with a growing set of public UI components and private internal helpers. The component catalog now includes richer primitives such as `TreeView`, `DataTable`, `ComboBox`, and overlay foundations, which means some future work may involve behavior-heavy features such as virtualization, more reusable state orchestration, or shared data-display utilities.

At the same time, the repository now has clearer documentation layers:

- `docs/technical/component-patterns.md` for stable internal patterns
- `docs/future-work.md` for deferred implementation work
- `docs/technical/adr/` for accepted architectural decisions
- `src/docs/**` for public consumer guidance

That makes this a good time to clarify where heavier behavior and documentation surfaces should live if the repository continues to grow.

## Discussion

The main tension is between simplicity and long-term separation of concerns.

Keeping behavior-heavy utilities inside the design system package preserves a straightforward developer experience for both maintainers and consumers. It also fits well when the utilities are tightly coupled to visual components, keyboard interaction models, or shared internal helpers such as focus, dismissal, and list navigation.

Splitting behavior-heavy utilities into a separate package can improve architectural clarity when those utilities begin to have their own release cadence, non-visual consumers, or a maintenance surface that no longer feels naturally owned by a design system package.

Moving work into a separate repository is an even stronger separation. That can be valuable when ownership, publishing, release management, and versioning truly diverge, but it also introduces more coordination overhead and documentation fragmentation.

Storybook is related but slightly different. It is a consumer-facing documentation surface for the published design system package. If the repository later contains multiple packages with equally important consumer surfaces, it may become worth extracting documentation into a broader docs app. Until then, Storybook remains most useful when it stays close to the package it documents.

## Option A

Keep behavior and rendering utilities inside the current design system package.

This keeps the repository and package model simple. It works best when the utilities are still primarily in service of UI primitives, such as virtualization for `TreeView` or future table/list components, rather than a broad standalone utility layer with non-UI consumers.

## Option B

Split behavior-heavy primitives or utilities into a separate package inside the same repo or a monorepo/workspace.

This creates a clearer architectural boundary while preserving shared tooling, coordinated versioning options, and a single collaboration surface. It is a good middle path if behavior-heavy internals become reusable across multiple packages or start to feel awkward inside the design system package itself.

## Option C

Split behavior-heavy primitives or utilities into a separate project or repository.

This is the strongest isolation model. It may make sense if ownership, release cadence, or technical goals diverge substantially, but it also increases coordination cost and makes local development, cross-package changes, and documentation discovery more complex.

## Pros

- The current single-package setup is the simplest model to maintain while the component library is still consolidating patterns and boundaries.
- A future monorepo/workspace split offers a strong escape hatch without immediately paying the cost of a separate repository.
- Keeping Storybook attached to the design system package preserves tight feedback loops between implementation, documentation, and preview examples.

## Cons

- Leaving everything in one package for too long can blur the boundary between visual primitives and more general behavior or data-layer utilities.
- Introducing a package split later has migration, versioning, and dependency costs that are easier to absorb before many consumers depend on the current shape.
- A separate repository would reduce accidental coupling, but it would also fragment documentation, local development, and release coordination earlier than the current scale appears to justify.

## Implementation Complexity

Keeping the current package structure has the lowest short-term complexity because it avoids changes to publishing, imports, Storybook ownership, and release workflows.

A monorepo/workspace split would add moderate complexity. It would require package boundary decisions, new build and publish flows, clearer internal APIs, and likely a broader decision about how docs and examples should reference multiple packages.

A separate repository would add the highest complexity. It would require duplicated or coordinated tooling, cross-repo version management, documentation discoverability decisions, and more overhead for changes that span both visual components and their supporting behavior.

## Expected Benefit

The main expected benefit of staying in the current model is focus. It allows the design system to continue solidifying component patterns, documentation layers, and internal helper boundaries before introducing package and repository complexity.

The main expected benefit of a future monorepo/workspace split is clarity. It provides a path to separate concerns without losing the practical advantages of a shared repo when multiple packages genuinely emerge.

The main expected benefit of a separate repository would be hard isolation, but that benefit only becomes compelling when ownership or release independence is a first-order need.

## Open Questions

- At what point do behavior-heavy utilities stop feeling like internal component support and start feeling like a separate product surface?
- Would future virtualization, state orchestration, or list-management utilities be consumed outside the design system package?
- If multiple packages emerge, should Storybook remain package-specific while a higher-level docs site links across packages?
- What release or ownership signals would justify a separate repository instead of a monorepo/workspace split?

## Recommendation

Keep the current single-package setup for now.

If package boundaries become necessary, prefer a monorepo/workspace split before introducing a separate repository.

Keep Storybook attached to the design system package for now, and revisit a broader docs surface only when multiple packages or clearly divergent release cadences exist.

## Next Step

Leave this note open and revisit it when one of these triggers appears:

- virtualization or similar behavior-heavy utilities begin to serve multiple components
- non-visual or cross-package consumers start to appear
- publishing or ownership needs diverge
- a monorepo/workspace transition becomes an active implementation topic
