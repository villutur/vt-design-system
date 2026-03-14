# Research Notes

This folder is the internal workspace for open technical questions, tradeoff analysis, and architecture exploration in `vt-design-system`.

Use it when:

- A technical question is important enough to document, but not stable enough to become an ADR
- Multiple implementation or architecture options need to be compared in one place
- A discussion needs durable context beyond chat history
- A topic may lead to future work, but needs analysis before it should be turned into backlog items

Do not use it for:

- Stable internal rules or component patterns
- Accepted architecture decisions
- Public consumer guidance
- Deferred implementation tasks or phase 2 backlog items

Promotion flow:

- Deferred implementation ideas go to `docs/future-work.md`
- Accepted architecture decisions become ADRs under `docs/technical/adr/`
- Stable internal implementation rules go to `docs/technical/component-patterns.md`
- Public consumer guidance goes to Storybook docs under `src/docs/**`

Working agreement:

- Both the user and agents may add, refine, or revisit research notes over time
- Keep notes analytical rather than task-oriented
- Prefer comparing options and tradeoffs over writing stream-of-consciousness notes
- Leave uncertainty explicit when a topic is still exploratory
- Add a `Next step` so each note points clearly to ADR work, future work, implementation planning, or an intentionally open outcome

Naming convention:

- Use descriptive kebab-case filenames
- Do not use ADR-style numbering for research notes
- Create one note per meaningful question area rather than one catch-all file

Status vocabulary:

- `Open`: A live question with no clear recommendation yet
- `In Discussion`: Active exploration with multiple plausible directions
- `Converging`: A preferred direction is emerging, but the decision is not final
- `Parked`: The topic matters, but there is no immediate next step
- `Decided`: The research note has served its purpose and the outcome has been promoted elsewhere
- `Superseded`: A newer note or decision has replaced this one

Suggested workflow:

1. Start a new note from `_template.md`
2. Capture the question, context, and realistic options
3. Compare tradeoffs, implementation complexity, and expected benefit
4. Add a recommendation or explicitly leave the question open
5. Promote conclusions to the right long-term home when they become stable

## Current Notes

- `package-boundaries-and-repo-topology.md`: Whether behavior-heavy utilities should remain inside the current package, move into a future workspace package, or live in a separate repository.
- `shared-list-and-virtualization-foundation.md`: Whether `TreeView`, `DataTable`, and future large list-like surfaces should grow shared internal foundations for flattening, virtualization readiness, and higher-level state orchestration.
- `non-modal-overlay-foundation-follow-ups.md`: Whether `Popover`, `Tooltip`, `Dropdown`, and future anchored overlays should converge further on shared hover intent, nested layer coordination, and optional arrow behavior.
- `worker-backed-browser-log-pipeline.md`: Whether a browser logger and log viewer should let a dedicated worker own log storage, filtering, and subscription fan-out instead of keeping the whole pipeline on the main thread.
