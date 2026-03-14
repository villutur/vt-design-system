# Worker-Backed Browser Log Pipeline

- Status: `Open`
- Date: 2026-03-12

## Question

For a browser-based logger and log viewer, is it a good idea to let a Web Worker own log storage, filtering, and subscription fan-out so the main UI thread stays lighter? When is that approach meaningfully better than a simpler main-thread store with virtualization?

## Context

There is an experimental project under `.stash/browser-log-studio` that explores this architecture.

The current experiment already has several notable traits:

- A dedicated worker owns an in-memory circular log buffer and active subscriptions.
- The main-thread logger serializes arguments, posts log entries to the worker, and supports filtered snapshot reads plus subscriptions.
- Consumers can fetch logs, subscribe to updates, and apply filters.
- The terminal uses a custom virtualized rendering approach with row measurement, follow mode, search, level and tag filters, and an optional tree view for grouped logs.

The implementation already demonstrates the core architectural split:

- ingestion and central log storage are moved off the main thread
- rendering, view shaping, search filtering, tree building, and virtualization still happen in the main thread

That makes this a good case study for where worker ownership helps, where it only partially helps, and what alternative architectures may be better depending on scale.

## Discussion

The idea is strong, but the payoff depends on which bottleneck is actually dominant.

If the expensive part is log ingestion, buffering, indexing, or fan-out to multiple consumers, a worker-backed data plane is often a very sensible choice. It can keep bursty write traffic, filtering, and retention policies away from the UI thread, which usually improves responsiveness under load.

If the expensive part is instead React state churn, rendering a very large list, syntax highlighting, row measurement, or building derived view models in the UI layer, moving storage into a worker only solves part of the problem. The rendering side can still dominate once snapshots are pulled back into the main thread.

There is also an important memory nuance:

- a worker can reduce main-thread working set and execution pressure
- it does not magically reduce total page memory
- data often gets cloned across the worker boundary unless the design is careful about transfer shape, batching, and snapshot size

That tradeoff matters a lot for logging. Logs are append-heavy, often bursty, and can contain objects that are expensive to serialize or clone. A worker helps most when it is allowed to stay the source of truth and do meaningful work there, such as retention, indexing, query filtering, aggregation, or partial snapshot generation.

In the current experiment, the architecture is already directionally good, but the offload is only partial:

- `logger.ts` still does `safeSerialize(...)` on the main thread before posting to the worker
- `useLogs(...)` keeps a full local React state copy per consumer
- `LogTerminal.tsx` still filters, builds the tree, flattens it, computes row positions, and manages virtualization in the main thread

So the current design improves isolation and centralization, but it does not yet fully move heavy derived-data work away from the UI.

## Option A

Keep the dedicated worker as the central log data plane and continue investing in it.

In this model, the worker remains the source of truth for storage, retention, filtering, and subscription fan-out. Future improvements would move more query and shaping work into the worker rather than pulling broad snapshots back to the main thread.

This is the strongest fit when:

- log volume can be high
- multiple consumers may subscribe at once
- filtering or indexing may grow more expensive
- responsiveness during burst logging matters

## Option B

Use a hybrid model: keep worker-backed ingestion and storage, but introduce a lighter main-thread view store that subscribes to already-shaped slices.

In this model, the worker still owns raw storage and background work, but UI consumers subscribe to smaller derived views rather than each holding large copies of the full dataset. The worker could expose paged or windowed queries, filtered snapshots, summary counts, or pre-grouped slices.

This is a strong middle path when the worker idea is correct, but the current end-to-end pipeline still creates too much duplication in the main thread.

## Option C

Use a main-thread store first, and rely on batching, selectors, and virtualization unless clear evidence shows the worker is needed.

This is the simpler architecture. It works surprisingly well when log volume is moderate, filters are cheap, and the main cost is just rendering too many rows. A well-structured store with selector-based subscriptions plus list virtualization can get very far before a worker becomes necessary.

This option is better when:

- total log volume is modest
- filters are simple
- there are not many simultaneous consumers
- implementation simplicity matters more than peak throughput

## Option D

Use persistence-oriented infrastructure such as IndexedDB plus an optional worker query layer.

This is the heavier option, but it becomes interesting if logs need to survive reloads, support large history windows, or act more like a local event database than a transient in-memory console.

It is likely too heavy for the current experiment, but it is a realistic future direction if the viewer grows into a serious diagnostics tool.

## Pros

- A dedicated worker is a good architectural fit for append-heavy logging pipelines, especially when bursts, filtering, or multi-consumer fan-out would otherwise compete with rendering on the UI thread.
- Worker ownership gives a clear source of truth for retention policy, subscriptions, and future query/indexing logic.
- The approach scales better than a naive React-local log store when more consumers, filters, or derived views are introduced.
- The current experiment already demonstrates a useful separation between ingestion/storage concerns and rendering concerns.
- A hybrid evolution path exists, so the current idea does not lock the system into an all-or-nothing worker architecture.

## Cons

- A worker does not automatically reduce total memory usage; it mainly shifts or duplicates memory pressure unless snapshots and updates are designed carefully.
- Structured cloning and serialization can become a major cost for large or frequent payloads.
- In the current implementation, some potentially expensive work still runs on the main thread, especially argument serialization and view shaping.
- Per-consumer copies in `useLogs(...)` weaken some of the memory benefits if several consumers each hold large arrays.
- Worker debugging, lifecycle handling, and request-response coordination add complexity compared with a plain store.

## Implementation Complexity

The current experiment already proves the baseline feasibility, so keeping the worker model is not speculative. The next complexity comes from deciding how far the worker should go.

Keeping the current model with only incremental cleanup is moderate complexity. Likely improvements would include:

- moving more filtering and search into the worker
- returning windowed or paged results instead of broad snapshots
- adding summary queries such as level counts or available tags
- reducing per-consumer array duplication
- clarifying whether the main thread or the worker owns grouped and flattened log views

Moving to a hybrid view-model approach is higher complexity, but likely the most balanced evolution path if the experiment becomes a product-quality tool.

A full persistence-backed system with IndexedDB and worker-driven querying would be the highest complexity and should only happen if durable log history becomes a real requirement.

## Expected Benefit

The main benefit of the worker-backed model is UI resilience. If the log stream becomes noisy, consumers multiply, or filtering/query logic grows more expensive, the UI thread has a better chance of staying responsive.

The main benefit of the hybrid variant is efficiency. It keeps the architectural separation, but reduces the cost of repeatedly cloning, copying, and reshaping broad datasets in each consumer.

The main benefit of the simpler main-thread approach is lower complexity, but it is most attractive only when measured scale stays comfortably small.

## Open Questions

- What is the expected peak log volume in realistic usage, not just synthetic tests?
- How many concurrent consumers would actually subscribe in the same page?
- Are logs transient debugging data, or should they eventually support persistence, export, or replay?
- Is main-thread cost currently dominated more by serialization, filtering, or rendering?
- Would a worker-owned filtered/windowed query API provide a better payoff than pushing full arrays into React state?

## Recommendation

The idea is good, and it is especially reasonable for logging because logging is append-heavy, can be bursty, and often benefits from a central fan-out point.

That said, the strongest version of the idea is not simply "put logs in a worker." The stronger recommendation is:

- keep the worker as the central source of truth when log volume or consumer count may grow
- do not assume this automatically solves memory pressure, because cloned snapshots can reintroduce cost on the main thread
- if the experiment evolves further, prefer a hybrid next step where the worker owns more query and shaping work and the UI consumes narrower slices

In other words, the worker-backed architecture is directionally strong, but it should be treated as a data-plane foundation, not as a complete performance solution by itself.

## Next Step

Leave this note open for future discussion.

If this experiment becomes active implementation work later, the most useful follow-up would be to compare these concrete evolutions:

- keep the current dedicated worker shape and clean up obvious inefficiencies
- add worker-side filtered and windowed queries so consumers stop copying broad arrays
- test whether a simpler main-thread store plus virtualization is already sufficient for the expected scale
