# Future Work

This file is the shared place for deferred work, phase 2 ideas, nice-to-have items, and future wishes for `vt-design-system`.

Use it when:

- Something is intentionally left out of an implementation for now
- A feature is described as "later", "phase 2", "nice to have", or "worth revisiting"
- A future improvement is discovered while working on a related component
- You want to capture your own plans or wishes for later

Working agreement:

- Keep entries short, clear, and actionable
- Prefer adding a short reason for why something was deferred
- Link related components or files when that helps
- Check this file before or during related implementations to see whether work can be grouped together
- Remove or move items once they are fully completed

Status labels:

- `Deferred`: intentionally skipped in the current implementation
- `Planned`: expected future work
- `Idea`: worth keeping, but not committed yet
- `Research`: needs investigation or design exploration

Entry template:

## Area

- [ ] Item title
      Status: `Deferred`
      Why later: Short reason.
      Related: `path/to/file.tsx`
      Revisit when: A good trigger or milestone.
      Notes: Optional extra context.

## TreeView

- [ ] Add virtualization support for very large trees
      Status: `Deferred`
      Why later: The initial release already covers expansion, search, multi-select, editing, drag and drop, and async loading. Virtualization adds extra complexity around flattened rows, scroll coordination, and measurement.
      Related: `src/components/Navigation/TreeView.tsx`
      Revisit when: TreeView needs to handle very large datasets, or another list-heavy component needs the same foundation.
      Notes: This may be best as a shared internal utility that TreeView and future list-like components can reuse. See `docs/technical/research/shared-list-and-virtualization-foundation.md`.

- [ ] Add an optional TreeView state helper for expansion, selection, editing, and async loading orchestration
      Status: `Deferred`
      Why later: The component already supports controlled and uncontrolled usage, so a higher-level state helper was not required for the first release.
      Related: `src/components/Navigation/TreeView.tsx`
      Revisit when: Multiple consuming apps start repeating the same state wiring patterns.
      Notes: Revisit alongside `docs/technical/research/shared-list-and-virtualization-foundation.md`.

- [ ] Evaluate richer accessibility support for advanced tree interactions
      Status: `Research`
      Why later: A focused accessibility pass has already improved keyboard navigation, async status messaging, and tree semantics, but the most advanced interaction gaps still deserve a deeper review.
      Related: `src/components/Navigation/TreeView.tsx`
      Revisit when: TreeView becomes a more central primitive or accessibility review is scheduled.
      Notes: Remaining areas to evaluate include keyboard drag-and-drop alternatives, broader screen-reader review, and any additional ARIA polish that surfaces from real consumer usage.

## Foundation Follow-Ups

- [ ] Evaluate a shared non-modal overlay utility for Tooltip hover intent, arrow rendering, and nested overlay coordination
      Status: `Research`
      Why later: Tooltip now shares the anchored positioning foundation, but deeper overlay edge cases such as arrows, nested layers, and hover-intent tuning deserve a focused pass.
      Related: `src/components/Overlay/Tooltip.tsx`, `src/components/Overlay/Popover.tsx`, `src/internal/useDismissibleLayer.ts`
      Revisit when: More anchored overlays or nested overlay combinations are introduced.
      Notes: Research home: `docs/technical/research/non-modal-overlay-foundation-follow-ups.md`.

- [ ] Evaluate full row virtualization support for DataTable on top of the newer pinned/resizable grid foundation
      Status: `Planned`
      Why later: DataTable now supports column resizing, pinning, and a scroll-container handoff, but full virtualization still needs a clearer second consumer and a more deliberate internal foundation.
      Related: `src/components/DataDisplay/DataTable.tsx`
      Revisit when: Larger datasets or more spreadsheet-like workflows appear in consuming apps.

## Consumer-Driven New Components

- [ ] Add a flexible `ClipView` or `Mask` wrapper for shaped media presentation
      Status: `Idea`
      Why later: It is visually useful, but it likely belongs after the base `Image` primitive exists.
      Related: `src/components/DataDisplay/Avatar.tsx`
      Revisit when: A real page needs non-rectangular image or media crops beyond what `Avatar` already covers.
      Notes: Consider a lightweight wrapper around arbitrary children instead of a media-only component.

- [ ] Add a focused `AudioPlayer` or `MediaPlayer` for simple wav and mp3 playback
      Status: `Planned`
      Why later: The first consumer already has working playback UI, so the design-system version can wait until the shared control surface is better understood.
      Related: `src/components/Forms/Button.tsx`, `src/components/Layout/Toolbar.tsx`
      Revisit when: The first consumer begins replacing its local audio playback controls.
      Notes: Prefer an audio-first component before attempting a large general-purpose media framework.

- [ ] Evaluate a lightweight `List` or `ListGroup` surface for rich rows, media-heavy items, and simple virtualization
      Status: `Research`
      Why later: The first consumer already uses list-like UIs, but the request overlaps with the broader list and virtualization foundation question.
      Related: `src/components/Layout/ScrollArea.tsx`, `src/components/DataDisplay/Table.tsx`
      Revisit when: Another list-heavy surface appears or the first consumer needs shared list-row patterns beyond plain layout composition.
      Notes: Research home: `docs/technical/research/shared-list-and-virtualization-foundation.md`.

- [ ] Evaluate whether the AI chat workspace example should become a first-class `AIChat` component
      Status: `Idea`
      Why later: The design system now has `ChatBubble`, `CommandInput`, `AIResponseView`, and a documented AI chat reference composition. A public monolith should wait until multiple consumers converge on the same shell behavior.
      Related: `src/internal/examples/aiChatWorkspace.tsx`, `src/docs/Examples/AIChatWorkspace.stories.tsx`
      Revisit when: More than one consuming app wants the same conversation shell instead of just the same lower-level primitives.
      Notes: Keep the current path composition-first, and avoid absorbing session, transport, or agent orchestration into the component surface prematurely.

- [ ] Evaluate a reusable `PromptWorkbench` or `PromptComposer` surface after multiple apps share the same controls
      Status: `Idea`
      Why later: `Textarea`, `Select`, `NumberInput`, `CommandInput`, and `AIResponseView` already cover the first consumer without forcing the design system to own app-specific orchestration too early.
      Related: `src/components/Forms/Textarea.tsx`, `src/components/Forms/CommandInput.tsx`, `src/components/DataDisplay/AIResponseView.tsx`
      Revisit when: More than one consuming app needs the same prompt settings layout, response framing, and action model.
      Notes: Keep request validation, model allowlists, and route workflow state in the application layer until the composition truly stabilizes.

## Additional New Components

- [ ] Add a `RangeSlider`
      Status: `Planned`
      Why later: It is broadly useful, but it has not been needed enough yet to outrank the current backlog.
      Related: `src/components/Forms/NumberInput.tsx`
      Revisit when: A settings or media workflow needs range selection instead of freeform numeric input.

- [ ] Add a `Carousel`
      Status: `Idea`
      Why later: It is useful for media and showcase surfaces, but it is lower priority than the more workflow-oriented backlog items above.
      Related: `src/components/Surfaces/Card.tsx`
      Revisit when: A real media or preview-heavy page needs a shared carousel pattern.

- [ ] Add a `Canvas` or `CanvasSurface` primitive with pan, zoom, and optional grid support
      Status: `Research`
      Why later: This is powerful, but it is significantly more behavior-heavy than most current primitives and should be justified by a concrete workflow.
      Related: `src/components/Layout/Panel.tsx`, `src/components/Layout/ScrollArea.tsx`
      Revisit when: Diagramming, visual editing, or node-based layout work becomes active implementation.

- [ ] Add a `Dock` navigation pattern
      Status: `Idea`
      Why later: It is visually interesting, but it is more specialized than the current navigation backlog.
      Related: `src/components/Navigation/Tabs.tsx`, `src/components/Layout/AppShell.tsx`
      Revisit when: A touch-first or app-launcher style surface needs it.

- [ ] Add a `Stack` layout helper
      Status: `Idea`
      Why later: Existing layout primitives and plain flex utilities already cover most simple stacking needs for now.
      Related: `src/components/Layout/Grid.tsx`, `src/components/Layout/Divider.tsx`
      Revisit when: Repeated vertical rhythm and gap patterns start creating too much duplicated layout code.

## Existing Component Follow-Ups

- [ ] Add nested or grouped log support to `LogViewer`
      Status: `Deferred`
      Why later: The first shared release focuses on flat, high-volume rows with virtualization, expansion, and filtering. Nested flattening deserves a separate pass once the base row model is proven in consuming apps.
      Related: `src/components/DataDisplay/LogViewer.tsx`
      Revisit when: A consumer needs parent or child relationships, request trees, or correlation-group drilldown.

- [ ] Add update-by-id support for streaming or long-running `LogViewer` rows
      Status: `Deferred`
      Why later: The first version preserves a viewer-only contract and expects already-shaped items. In-place mutation semantics should wait until a real consumer proves the right API for running or streaming rows.
      Related: `src/components/DataDisplay/LogViewer.tsx`
      Revisit when: A consumer needs rows that transition from running to success or error without appending a replacement row.

- [ ] Add pinned rows, bookmarks, or jump markers to `LogViewer`
      Status: `Idea`
      Why later: These are useful navigation aids, but they were intentionally left out of the first release to keep the main filtering and virtualization model focused.
      Related: `src/components/DataDisplay/LogViewer.tsx`
      Revisit when: Operators need to mark important rows or cycle through notable events in long sessions.

- [ ] Evaluate a reusable session-log drawer composition on top of `LogViewer`
      Status: `Planned`
      Why later: Consumers are likely to want a right-side live log panel during requests or sessions, but the shared composition should wait until at least one real app proves the expected header, actions, and follow-tail behavior.
      Related: `src/components/DataDisplay/LogViewer.tsx`, `src/components/Overlay/Drawer.tsx`
      Revisit when: `vt-playground` starts implementing a live session-log drawer for Prompt Workbench or chat.
      Notes: Keep the component viewer-focused. The data store and session orchestration should stay in the consuming app.

- [ ] Evaluate an opt-in logger adapter for internal diagnostics without coupling components to app storage
      Status: `Research`
      Why later: Some shared components or internal helpers may eventually want lightweight diagnostics, but `vt-design-system` should not become a central logging owner or force a store on consumers.
      Related: `src/components/DataDisplay/LogViewer.tsx`, `src/internal/`
      Revisit when: A real consumer needs shared diagnostics beyond local development warnings.
      Notes: Prefer an optional adapter for diagnostics or warnings, not a package-owned sink or global logger singleton.

- [ ] Add richer row-selection behavior to `DataTable`
      Status: `Planned`
      Why later: The current table already supports the initial advanced data-table contract, but row-click selection, modifier-based selection, and programmatic focus need a more deliberate interaction pass.
      Related: `src/components/DataDisplay/DataTable.tsx`
      Revisit when: More spreadsheet-like workflows or keyboard-heavy datasets appear in consuming apps.
      Notes: Evaluate row selection, shift or ctrl multi-select, and programmatic row targeting together.

- [ ] Add row expansion, inline edit, and overflow-cell affordances to `DataTable`
      Status: `Idea`
      Why later: These are valuable, but they widen the table into a much richer grid-editing surface and should follow real workflow pressure.
      Related: `src/components/DataDisplay/DataTable.tsx`, `src/components/Overlay/Popover.tsx`
      Revisit when: A consuming app starts needing record detail expansion or spreadsheet-like editing.

- [ ] Add live-data update highlighting to `DataTable`
      Status: `Idea`
      Why later: Visual row or cell flashing can be useful for streaming data, but it is a more specialized v3-style enhancement.
      Related: `src/components/DataDisplay/DataTable.tsx`
      Revisit when: A real-time or monitoring view starts depending on frequent data updates.

- [ ] Add open, close, and collapsible behavior to `Sidebar`
      Status: `Planned`
      Why later: The current component provides the structural surface, but toggle and collapsible behavior were intentionally left simpler.
      Related: `src/components/Layout/Sidebar.tsx`
      Revisit when: A consuming app begins replacing its local collapsible side navigation.

- [ ] Add context-menu and recursive expand or collapse helpers to `TreeView`
      Status: `Planned`
      Why later: The core tree behavior is already broad, but contextual actions and recursive controls were intentionally deferred.
      Related: `src/components/Navigation/TreeView.tsx`, `src/components/Overlay/ContextMenu.tsx`
      Revisit when: The first consumer starts using TreeView for richer explorer-like workflows.

- [ ] Evaluate direct JavaScript object input and circular-reference handling in `TreeView`
      Status: `Research`
      Why later: Supporting raw objects with lazy circular references is powerful, but it requires careful handling around expansion, recursion, and async rendering.
      Related: `src/components/Navigation/TreeView.tsx`
      Revisit when: Object-inspection and developer-tooling style trees become active implementation work.

- [ ] Add a horizontal variant to `Timeline`
      Status: `Planned`
      Why later: The current vertical surface is enough for the initial use cases, but horizontal timelines are a natural extension.
      Related: `src/components/DataDisplay/Timeline.tsx`
      Revisit when: A roadmap, release, or milestone surface needs horizontal progression.

- [ ] Refine the horizontal connector layout in `Stepper` so the line passes through the circles and spans the available width
      Status: `Planned`
      Why later: The current layout is serviceable, but the horizontal connector treatment still looks visually off.
      Related: `src/components/Navigation/Stepper.tsx`
      Revisit when: Stepper is used in a more polished production workflow or its layout is revisited for the next design pass.

## Package Maintenance

- [ ] Add a repo-safe version-bump release script for `vt-design-system`
      Status: `Planned`
      Why later: Releasing the package will get easier to trust if one script owns the full bump flow. That script should verify the git worktree is clean, bump `patch` by default while also supporting `minor`, `major`, or an explicit higher version, then commit the version change and create the matching git tag.
      Related: `package.json`, `README.md`
      Revisit when: `vt-design-system` starts getting published or tagged often enough that manual version management becomes repetitive or risky.
      Notes: Prefer a workflow that can share conventions with `vt-playground` and `gemini-ai-lib`, even if each repo keeps its own small entry script.

## Open Ideas

- [ ] Add future items here
      Status: `Idea`
      Why later: Reserved placeholder so the file is easy to keep using.
