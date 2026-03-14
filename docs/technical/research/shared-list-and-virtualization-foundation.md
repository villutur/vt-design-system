# Shared List And Virtualization Foundation

- Status: `Open`
- Date: 2026-03-12

## Question

Should `vt-design-system` introduce a shared internal foundation for list-like components that may need flattening, virtualization readiness, selection orchestration, or higher-level state helpers, or should each component continue to own those concerns independently until specific needs force reuse?

## Context

The repository now has multiple components with list- or collection-oriented behavior:

- `TreeView` already supports expansion, selection, editing, drag and drop, search, and async child loading
- `DataTable` already supports filtering, sorting, pagination, selection, and richer state surfaces
- future backlog items include TreeView virtualization, a possible TreeView state helper, and more advanced DataTable ergonomics

At the moment, these components manage their own behavior inside their component files. That keeps them straightforward for v1, but it also raises the question of when shared internal abstractions become worth the cost.

## Discussion

The main tradeoff is between local clarity and reusable behavior foundations.

Keeping TreeView and DataTable self-contained preserves readability and makes it easier to tune each component for its own semantics. Tree structures and table grids are not interchangeable, and premature abstraction could easily create generic helpers that are harder to reason about than the components themselves.

At the same time, some concerns are not inherently tree-specific or table-specific. Examples include flattened visible-row modeling, selection orchestration, virtualization readiness, scroll coordination, and async state helpers. If those concerns begin to repeat across multiple components, the repository may benefit from shared internal utilities that remain private to the package.

This is also related to package boundaries. If shared list behavior starts to feel like its own layer, that may eventually reinforce the case for a future workspace split. For now, the more immediate question is whether reuse should start inside `src/internal/`.

## Option A

Keep TreeView, DataTable, and similar collection components self-contained for now.

Only extract shared logic when repeated patterns are proven in at least two components and the extracted helper has a clear internal API.

## Option B

Start building a shared internal collection foundation in `src/internal/` now.

This would likely include utilities for flattened visible items, virtualization-ready measurement boundaries, reusable selection helpers, and higher-level state orchestration for components with nested or large datasets.

## Option C

Take a middle path by defining extraction criteria now, but delay the actual shared helpers until one more component or feature forces the overlap.

This keeps the current components local while documenting what signals should trigger shared internal work.

## Pros

- Staying local avoids premature abstraction while TreeView and DataTable are still maturing.
- A shared internal foundation could reduce duplicate work if virtualization, selection orchestration, and large-list ergonomics begin to converge.
- A criteria-first middle path gives the repository a decision rule without forcing abstraction too early.

## Cons

- Leaving behavior local for too long can cause subtle duplication and divergent interaction models across collection components.
- Extracting shared internal foundations too early can create generic helpers that are awkward for both tree and table semantics.
- If virtualization arrives independently in multiple components, later consolidation may become more expensive.

## Implementation Complexity

Keeping behavior local has the lowest short-term complexity.

Building a shared internal collection foundation now would have moderate to high complexity because it requires identifying reusable behavior boundaries before the repository has more than a few proven consumers. It would also need careful naming and ownership so internal helpers do not become a vague dumping ground.

The criteria-first middle path has low complexity. It mostly requires documenting what would justify extraction and then revisiting the question when another component or feature creates concrete overlap.

## Expected Benefit

The main expected benefit of waiting is focus. It lets the current components stabilize before introducing another abstraction layer.

The main expected benefit of a future shared internal foundation is consistency. It could help large collection components share better behavior around flattening, selection, virtualization readiness, and async orchestration without immediately exposing those details as public API.

## Open Questions

- Which parts of TreeView virtualization would actually be reusable outside TreeView?
- Would DataTable benefit from the same flattened viewport and measurement utilities as TreeView, or are their needs too different?
- Should a future state helper remain component-specific, such as `useTreeViewState`, before a broader collection abstraction is considered?
- What minimum number of consuming components should justify a new internal collection helper?

## Recommendation

Take the middle path.

Keep TreeView and DataTable self-contained for now, but treat repeated behavior in flattening, virtualization readiness, selection orchestration, and large-list state management as a strong trigger for shared internal extraction.

Prefer component-specific helpers first when only one component clearly benefits. Promote them into broader `src/internal/` collection utilities only after a second real consumer appears.

## Next Step

Leave this note open and use it as the research home for these follow-ups:

- TreeView virtualization
- a possible TreeView state helper
- virtualization-ready or large-list hooks in DataTable

If a second component begins to need the same visible-row or scroll-coordination primitives, turn that into an implementation plan for a small internal collection foundation.
