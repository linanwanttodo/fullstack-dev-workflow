# Development Workflow

The per-change loop for work inside an existing project. For a whole project or a large,
poorly-scoped feature, run the **full lifecycle first** (see the lifecycle overview in
`SKILL.md`): requirements → feasibility → planning/tech selection → design → then execute
each slice of work with this loop. Follow these phases in order; compress them
proportionally for trivial edits (a rename, a comment/format fix — no design or plan
needed, but verification still applies). A value change, a message change, or any change
a user could observe is behavior-changing and follows the full loop, not the trivial path.

**Docs proportionality (governs the docs steps in Phases 1, 3, 4 and 6).** The docs-sync
requirements below presuppose a `docs/` folder and a change that alters public surfaces.
They are not a mandate to create documentation machinery for a small change in a project
that has none:

- If the project has **no `docs/` folder** and the change is small or behavior-only (a bug
  fix, a small feature, a config tweak), the docs steps are moot — say so in one line in
  your report and move on. Do not scaffold `docs/` for such a change.
- If the project **has** `docs/`, apply the sync rules as written: update the relevant
  document in the same change whenever a public surface, schema, flow, architecture, or
  deployment config actually changed.
- Scaffold `docs/` only for a whole project or a change that genuinely introduces a new
  architecture/API/database surface that future work depends on.

## Phase 0 — Explore & clarify intent

### 0.1 Explore the codebase (mandatory first)

Do this before anything else, including clarifying questions. In a fresh context you
have no project knowledge — the skill does not carry it, so you must go find it.

- Read the README and manifest files (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `build.gradle`, `requirements.txt`, etc.) to learn the stack, scripts, and dependencies already in use.
- If a `docs/` folder exists, start from `docs/README.md` and the theme documents relevant
  to the change (`01-requirements/`, `03-architecture/`, `04-modules/`) — they carry the
  project context and design decisions. Read them before asking clarifying questions. See
  `documentation.md` for the docs standard.
- List the directory structure and find where your change fits (existing modules, layers, conventions).
- Find the **verification commands** — test / lint / typecheck / build — in `package.json` scripts, a Makefile, or CI config. You will need these in Phase 5.
- Skim existing tests to match their conventions and see what infra exists (test runner, fakes, fixtures).
- Search for existing code that already does something similar (grep for feature keywords) before building anything new — avoid reinventing what already exists.
- If the task touches UI, check frontend conventions and existing components too.
- If there is **no codebase yet** (greenfield), say so explicitly and confirm scope with the user before designing.
- Do not write implementation code in this phase.

*principle #1 and #4 (see `SKILL.md` AI work principles): consult the existing
interfaces and code; reuse what already exists — never guess an API or invent a new
interface when an existing one fits.*

### 0.2 Clarify intent

- Restate the goal in your own words; list the requirements as you understand them.
- Ask about anything ambiguous: scope, edge cases, failure modes, dependencies, acceptance criteria.
- Note constraints: existing code style, libraries already in use, platform conventions.
- For a large feature or a new project, treat this as lightweight requirements analysis —
  use `requirements.md` to capture problem, scope, and acceptance criteria before designing.
  Treat a feature as large when it touches a new subsystem or introduces new infrastructure;
  otherwise keep it to clarifying questions.
- For a greenfield project, also check feasibility and plan technology selection per
  `planning.md` before writing any code.

*principle #2 and #3 (see `SKILL.md` AI work principles): seek confirmation on anything
ambiguous, and validate business intent with the user — never proceed on a guess or
silently invent requirements.*

## Phase 1 — Design & plan

- Propose an approach: the components involved, their responsibilities, interfaces, and data flow.
- Follow `architecture.md` (SOLID, cohesion/coupling, dependency injection, interface-first).
- If the task involves UI or user-facing design, also read `references/frontend-design.md`
  and produce the design plan (colors, type, layout, signature) before building.
- For non-trivial work, produce a written plan with concrete steps and verification checkpoints.
- When the change touches architecture, APIs, database schema, or module boundaries,
  update the relevant `docs/` document (`03-architecture/` or `04-modules/`) as part of
  the design, per `documentation.md`. Documentation updates ship in the same change as
  the code.
- For a large feature, design 2-3 implementation approaches with different trade-offs —
  minimal changes (smallest diff, maximum reuse), clean architecture (maintainability,
  elegant boundaries), pragmatic balance (speed + quality). Compare them, form a
  recommendation with reasoning, and ask the user which they prefer before implementing.
- **Approval gate**: for large features, wait for explicit user approval of the design
  before writing implementation code.

## Phase 2 — Test-first, by task kind

- **Behavior-changing work** (new features, bug fixes): write a failing test first, watch it fail, then implement. See `testing.md`.
- **Behavior-preserving work** (refactoring): pin current behavior with characterization tests before changing anything. See `refactoring.md`. Do NOT write red/green tests for a refactor — the goal is unchanged behavior, not new behavior.

## Phase 3 — Implement

- Write code that satisfies the tests and the design. Keep functions small and single-purpose.
- Follow `code-standards.md` for naming and comments.
- As each module or interface lands, keep its `docs/` deep dive current
  (`04-modules/<module>/`): signatures, dependencies, and key flows that actually changed.
  Never leave the code and its doc out of sync at commit time.

## Phase 4 — Self-review

- Re-read your diff as if you were the reviewer.
- Check: SRP violations, duplicated logic, missing edge cases, naming and comments (`code-standards.md`).
- Run the `security.md` checklist whenever the change touches input, data, auth, or money — including refactors of that code. **Proportionality exemption**: if the change is a pure function with validated inputs at its boundary, and it touches no I/O, no external data, no auth, no network, and no money *decision* (e.g. a rounding fix), state that the security sweep was skipped and why — one line — instead of running the full checklist. When in doubt, run it.
- Review the change from multiple perspectives and report only high-confidence issues —
  see `code-review.md` (guidelines compliance, obvious bugs, historical context,
  confidence scoring with an >= 80 threshold, and the false-positive filter list).
- If the change touches public surfaces, schema, flows, or deployment: confirm the
  corresponding `docs/` file is updated in this diff, the `docs/README.md` index is
  current, and any Mermaid diagram still matches (see `documentation.md`).

## Phase 5 — Verify

- Run the project's verification commands discovered in 0.1: tests, linter, typechecker, build.
- Confirm real output — evidence before assertions. Never claim "done" or "fixed" without running these.
- **Broken harness**: if the project's own verify command fails or is misconfigured (e.g. a
  test script that crashes on load), do not silently skip verification or quietly change
  project files. Fix the harness minimally and transparently (state that you changed e.g.
  `package.json` and why), or report the failure honestly as a blocker. Never report
  "verified" from a command that did not actually run.

## Phase 6 — Commit & finish

- Write a conventional commit message (`git-commit.md`).
- Stage and commit the doc updates with the code in the same change (see `documentation.md`).
- Report what was done, what was verified, and any remaining risks or follow-ups.
