---
name: fullstack-dev-workflow
description: >-
  Enforce a rigorous software-engineering process across the entire development lifecycle on every coding task.
  Use this skill for ALL development work — new projects, new features, bug fixes,
  debugging, refactoring, architecture/API/database design, understanding or explaining a project/module/feature,
  technology selection, code review, testing, UI/frontend design, deployment/CI-CD,
  documentation, security checks, or commits. It covers the full lifecycle from requirements and
  feasibility through planning, technology selection, design (SOLID, high cohesion/low coupling,
  interface-oriented programming, clean layering, API and database contracts),
  test-driven implementation, testing, deployment, and operations — plus frontend design standards, comment
  and git commit conventions, project documentation (docs/ folder with requirements, planning,
  architecture, module deep dives, deployment docs, Mermaid diagrams), and security checks.
  Trigger on ANY development task — even a quick fix, a one-line change, or a request that does
  not mention process, standards, architecture, plan, refactor, best practices, or "quality".
  Do NOT use for non-development work: pure conversation, creative writing, translation, math or
  general-knowledge questions, image generation, or non-code document tasks.
---

# Fullstack Dev Workflow

This skill defines the engineering standards and workflow that govern every development
task. It is self-contained: all required procedures live in `references/`. Read the
reference(s) for the current task type before writing implementation code.

## Core invariants

These always apply, no matter the task:

1. **Plan before code.** Understand the task, its context, and the intended design before writing implementation code.
2. **Correctness over speed.** Prefer correct, verifiable, maintainable work over fast-but-fragile output.
3. **Design for maintainability.** Follow SOLID (especially SRP and DIP), high cohesion / low coupling, interface-oriented programming, and dependency injection.
4. **Tests protect behavior.** New features and bug fixes ship with tests unless the user explicitly says otherwise.
5. **Verify before claiming done.** Run the actual verification commands and confirm their output before reporting success.
6. **Proportionate process.** Treat as trivial only what is mechanical, low-risk, and
   structurally unchanged — a rename, a comment/whitespace/format fix, reorganizing
   existing code with no behavior change. Trivial work needs no plan or tests, just
   verification. The test for "not trivial": if a user could observe the difference — a
   value, a message, a timing, a decision, an output — it changes behavior and follows the
   workflow below. A one-line constant change and a config tweak are behavior changes.

## AI work principles

These behavioral rules apply on top of the invariants — every task, every phase. The
honor is the default; the shame is what you must never do. Each principle is anchored
into the reference that enforces it:

1. **Honor consulting, shame guessing APIs.** Read the actual interface and code before
   assuming what they do. (Anchored in `workflow.md` Phase 0.1.)
2. **Honor seeking confirmation, shame vague execution.** When intent is ambiguous,
   confirm the goal instead of proceeding on a guess. (Anchored in `workflow.md`
   Phase 0.2.)
3. **Honor human confirmation, shame assuming the business.** Validate business intent
   with the user; never invent requirements silently. (Anchored in `workflow.md`
   Phase 0.2 and `requirements.md`.)
4. **Honor reusing existing, shame inventing new.** Prefer existing interfaces and code
   over creating new ones. (Anchored in `workflow.md` Phase 0.1 and `architecture.md`.)
5. **Honor testing proactively, shame skipping verification.** Test and verify; never
   report done without running the checks. (Anchored in `testing.md` and invariant 5.)
6. **Honor following conventions, shame breaking architecture.** Stay within the
   project's standards and architectural boundaries. (Anchored in `code-standards.md`
   and invariant 3.)
7. **Honor honest ignorance, shame faking understanding.** Say clearly what you don't
   know instead of pretending. (Anchored in `security.md` and `debugging.md`.)
8. **Honor careful refactoring, shame blind modification.** Change deliberately with a
   before/after design; fix root cause, not symptoms. (Anchored in `refactoring.md` and
   `debugging.md`.)

## Full lifecycle overview

For a whole project (or a large, poorly-scoped feature), run these phases in order. For
incremental work inside an existing project, skip straight to `references/workflow.md`
and compress the front-loaded phases.

Read `references/documentation.md` first — it defines the `docs/` structure each phase
captures into. Then follow the phases:

1. **Requirements** → `references/requirements.md` — problem, scope, personas, functional/non-functional requirements, user stories + acceptance criteria, success metrics, MoSCoW priority. Captured in `docs/01-requirements/`.
2. **Feasibility** → `references/planning.md` — technical/economic/operational/legal/schedule viability, risk, explicit go/no-go. Captured in `docs/02-planning/`.
3. **Planning & technology selection** → `references/planning.md` — stack with recorded rationale (ADR), task breakdown, milestones, risk register. Captured in `docs/02-planning/`.
4. **Design** → `references/architecture.md` (+ `references/frontend-design.md`, `references/security.md`) — architecture, layering, API contracts, database schema, data flow, UI/UX, and security design. Captured in `docs/03-architecture/`.
5. **Scaffold** → initialize the repo skeleton before implementing: version control, the stack selected in phase 3 (build system, framework, project layout), `docs/` folders, and the test harness. A working skeleton with one green test is the floor for starting feature work.
6. **Implementation** → `references/workflow.md` — the per-change loop: explore → clarify → design → test-first → implement → self-review → verify → commit. Module deep dives kept current in `docs/04-modules/`.
7. **Testing** → `references/testing.md` — unit → integration → E2E, plus performance and security checks.
8. **Deployment** → `references/deployment.md` — CI/CD, environments, rollback plan, smoke tests, secrets. Captured in `docs/05-deployment/`.
9. **Operation & maintenance** → `references/deployment.md` — monitoring, error tracking, feedback loop; each new change starts another iteration. All docs stay in sync per `references/documentation.md`.

**Project-level definition of done** — the project is complete when: every Must
requirement has a passing test (per `requirements.md` traceability) and is verified;
the app runs end to end; the build, tests, and security scan pass in CI; deployment and
rollback are exercised; and the `docs/` folders are accurate and current. Milestones in
`planning.md` carry their own per-milestone definitions of done; this is the whole-project
gate.

## Task-type routing

Routing is handled by `references/entry.md` — the single, authoritative intent-to-route
map. Read it first, classify the request's core intent, and route to the reference(s) it
lists. Do not maintain a parallel route table here; when adding a route, change
`entry.md` only.

- A whole project or a large, poorly-scoped feature routes to the **full lifecycle**
  (phases 1-9 above) instead of a single reference.
- Incremental work inside an existing project routes to `references/workflow.md`, which
  compresses the front-loaded phases.
- `workflow.md` is the spine for feature/refactor work. Its later phases point to
  `code-standards.md` (implement), `code-review.md` + `security.md` (self-review), and
  `git-commit.md` (commit) — load each when the phase requires it. Bug fixes follow
  `debugging.md` instead (reproduce → root cause → minimal fix → **regression test** →
  verify — the regression test is still written, but the design-first red/green loop is
  not). Refactors follow `refactoring.md` instead (characterization tests, never red/green).

## How to use

1. Read `references/entry.md` and classify the request: what is its core intent?
2. Route to the reference(s) `entry.md` lists, or to the full lifecycle for a whole
   project / large feature. For ambiguous requests, pick the most likely path, state the
   assumption, and re-triage if corrected — but if the request has no identifiable intent
   at all, ask a focused clarifying question first (`entry.md` §4).
3. Read the listed reference(s); they are the authoritative procedures.
4. Follow the workflow and produce the required output format.
5. Never skip verification — run tests / linter / typecheck / build and confirm output — before reporting completion.

## References

| File | Contents |
|---|---|
| `references/workflow.md` | Per-change loop: explore codebase, clarify intent, design, test-first, implement, self-review, verify, commit |
| `references/entry.md` | Entry triage: classify any request by core intent and route to the matching reference(s) or the full lifecycle |
| `references/understanding.md` | Understand a project/module/feature: read docs, map code, trace flows, output a structured summary |
| `references/requirements.md` | Requirements analysis: problem, scope, personas, FR/NFR, user stories + acceptance criteria, MoSCoW |
| `references/planning.md` | Feasibility, technology selection with rationale, task breakdown, milestones, risk register |
| `references/architecture.md` | SOLID, cohesion/coupling, interface design, dependency injection, layering, API contracts, database schema, common pitfalls |
| `references/documentation.md` | Project docs: `docs/` folder structure, per-phase document templates, Mermaid diagram rules, sync-with-code policy, quality standards |
| `references/frontend-design.md` | UI design process, forbidden patterns (floating elements, gradients, emoji, neon, sidebar-strip boxes, liquid glass), UX quality floor, copy, image-vs-code-native |
| `references/testing.md` | Test-driven development loop, what to test, test quality, coverage guidance |
| `references/debugging.md` | Systematic debugging, root-cause analysis, minimal-fix discipline, regression verification |
| `references/refactoring.md` | Safe refactoring: characterization tests, small steps, behavior-preserving techniques, definition of done |
| `references/code-standards.md` | Naming, comments, formatting, error handling, code review checklist |
| `references/code-review.md` | Review methodology: multi-perspective review, confidence scoring (>= 80), false-positive filter, output format |
| `references/git-commit.md` | Conventional Commits format and commit hygiene |
| `references/security.md` | Security checklist: language-agnostic dangerous patterns (deserialization, YAML, command injection, XSS, weak crypto, TLS, XML, Actions), input handling, secrets, auth, plus platform sections for Android / iOS / desktop / web |
| `references/deployment.md` | Deployment & operations: environments, CI/CD, rollback, secrets, monitoring, plus platform sections for web / Android / iOS / desktop (signing, stores, auto-update) |