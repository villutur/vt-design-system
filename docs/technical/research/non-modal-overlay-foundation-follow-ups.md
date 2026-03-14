# Non-Modal Overlay Foundation Follow-Ups

- Status: `Open`
- Date: 2026-03-12

## Question

Should `vt-design-system` deepen its shared non-modal overlay foundation so that `Popover`, `Tooltip`, `Dropdown`, and future anchored overlays share more behavior around hover intent, nested layer coordination, and optional arrow rendering, or should those concerns remain specialized per component?

## Context

The repository now has a clearer overlay split:

- `Popover` is the anchored non-modal base
- `Dropdown` follows the popover-style anchored model
- `Tooltip` shares positioning foundations but remains a specialized assistive pattern
- `Modal` and `Drawer` are dialog-layer components rather than anchored overlays

At the same time, the future-work backlog already calls out deeper overlay questions such as hover intent, arrow rendering, and nested overlay coordination. The code also shows that `Popover` and `Tooltip` currently share positioning concepts without fully sharing the same interaction stack.

## Discussion

The key tension is between architectural consistency and component-specific interaction semantics.

Shared non-modal overlay internals are attractive because anchored overlays often repeat the same low-level concerns: placement, portal behavior, outside interactions, escape handling, focus return, nested layer awareness, and sometimes hover-intent timing. That suggests there may be a meaningful internal foundation beyond `useAnchoredFloating`.

However, `Tooltip` is not just a smaller `Popover`. It is an assistive hover/focus pattern with different expectations for interactivity, timing, dismissal, and accessibility. If the overlay foundation becomes too generalized, it could make specialized components harder to reason about rather than easier.

The question is therefore not whether every overlay should behave identically, but whether a deeper shared layer would meaningfully reduce duplication while preserving clear semantics for each overlay type.

## Option A

Keep the current model where `useAnchoredFloating` is the main shared foundation and each overlay owns its specialized interaction logic.

This favors explicit component behavior and keeps Tooltip, Popover, and Dropdown easy to tune independently.

## Option B

Build a deeper shared internal non-modal overlay utility layer.

This might include shared hover-intent utilities, nested overlay coordination, optional arrow positioning support, and more consistent dismissal behavior for anchored overlays.

## Option C

Extract only narrowly scoped helpers as concrete needs appear, without trying to define a full overlay framework up front.

This would allow focused reuse for one problem at a time, such as hover intent or nested layer handling, while keeping the component-level interaction models clear.

## Pros

- The current model keeps overlay semantics easy to understand and avoids over-generalizing Tooltip.
- A deeper shared layer could reduce duplication as more anchored overlays are added.
- Narrowly scoped extractions allow the repository to reuse real pain points without forcing one large abstraction too early.

## Cons

- Leaving all specialized behavior inside each component may create inconsistent overlay interactions over time.
- Building a broad shared overlay layer too early risks hiding important semantic differences between Tooltip, Popover, and future overlays.
- Piecemeal extraction can still become messy if naming and ownership are not clear.

## Implementation Complexity

Keeping the current model has the lowest immediate complexity.

Creating a broad shared non-modal overlay layer now would have moderate complexity. It would require careful interface design so internals stay composable without turning into a second public component system hiding inside `src/internal/`.

Extracting smaller helpers as needed has low to moderate complexity and is likely easier to validate incrementally, especially if each extraction is tied to a real overlay problem already seen in more than one component.

## Expected Benefit

The main expected benefit of waiting is semantic clarity. Each overlay can continue to optimize for its own role.

The main expected benefit of targeted internal reuse is consistency. Shared helpers for hover intent, nested overlay coordination, or arrow positioning could improve polish across anchored overlays without forcing identical behavior everywhere.

## Open Questions

- Which current or planned anchored overlays would truly share hover-intent logic?
- Should arrow rendering remain purely visual inside each component, or is there enough positioning logic to justify a shared helper?
- What nested overlay combinations should be treated as first-class scenarios, such as tooltip inside dropdown or popover inside popover?
- Is there a useful internal distinction between anchored interactive overlays and anchored assistive overlays?

## Recommendation

Take the narrow-extraction path.

Keep `Popover`, `Tooltip`, and `Dropdown` semantically distinct, but extract small shared helpers when the same non-modal overlay problem appears more than once. Treat hover intent, nested layer coordination, and optional arrow positioning as separate possible utilities rather than one large overlay abstraction.

## Next Step

Leave this note open and use it to guide future overlay follow-ups.

If nested anchored overlays, tooltip arrow support, or hover-intent tuning become active implementation work in more than one component, turn the relevant slice into a focused implementation plan for a small internal helper rather than a broad overlay rewrite.
