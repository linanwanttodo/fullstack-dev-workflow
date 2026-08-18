# Testing Standards

## Test strategy

Follow the test pyramid — most tests at the bottom, fewest at the top:

- **Unit** — most tests: a single class/function/component in isolation (fast, no I/O).
  Cover business logic, edge cases, pure functions.
- **Integration** — medium: a component with its real collaborators (repository + database,
  handler + service), or a module boundary. Cover the seams where units connect.
- **E2E** — fewest: the critical user journeys end to end (login, checkout, core flow).
  Slow and brittle; keep them few and protect the pyramid's shape.
- **Contract** — for systems with API contracts (from `architecture.md`), a contract test
  per endpoint: request/response shape, status codes, error model.
- **Performance & security** — beyond functional tests: a load/benchmark check for
  perf-sensitive paths, and a security scan pass (see `security.md`) — run in CI, not just
  ad hoc.

Plan which level covers each requirement before writing tests: every acceptance criterion
from `requirements.md` maps to at least one test, at the cheapest pyramid level that
catches it.

*principle #5 (see `SKILL.md` AI work principles): test proactively and verify — never
skip verification or report done without running the checks.*

## Test-driven development (TDD) loop

1. Write one failing test that expresses the desired behavior (RED).
2. Run it and confirm it fails for the right reason.
3. Write the minimal implementation that makes it pass (GREEN).
4. Refactor while keeping the test green (REFACTOR).

## What to test

- Behavior, not implementation details.
- Happy path, edge cases (empty, boundary, extreme), and error paths.
- The regression case that motivated a bug fix.

## Test quality

- One clear assertion theme per test (multiple asserts are fine when they belong to the same behavior).
- Descriptive names: `shouldReturnFalseWhenListIsEmpty`.
- Tests must be fast, deterministic, and isolated — no shared mutable state; no network or database unless the suite is explicitly integration-scoped.
- Avoid testing your own mocks; prefer real collaborators or narrow fakes.

## Coverage guidance

- Aim for meaningful coverage of the behaviors that matter; a coverage percentage is a floor, not a target.
- New code must be covered by a test that would fail if the behavior regressed.

## Regression strategy

- Every bug fix ships a regression test that fails on the old code and passes on the fix
  (see `debugging.md`).
- If a new regression test passes **immediately** (the bug was already fixed by the time
  you wrote the test), it is not yet a valid guard: prove it would have caught the bug by
  temporarily restoring the buggy behavior (or simulating the old variant) and confirming
  the test fails, then restore the fix. Only report the test as regression coverage after
  that check.
- Keep the full suite green before merging; run it in CI on every push so regressions are
  caught at the source.
- When a test is deleted or weakened, say why — the regression it guarded is otherwise
  silently reintroduced.

## Verification

- Find the test command in the project's manifest/scripts (see `workflow.md` Phase 0.1), run it after changes, and confirm the pass/fail output yourself.

## Refactoring note

- For behavior-preserving work, do **not** use the red/green loop. Write characterization tests that pin current behavior instead — see `refactoring.md`.
