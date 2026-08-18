# Safe Refactoring

Refactoring changes **structure, not behavior**. The goal is identical behavior with
better design. Everything below exists to keep behavior identical while you restructure.

## Inventory first

Before touching anything, read the code you are about to refactor and list what it
actually does:

- Enumerate the responsibilities currently crammed into the module (this is your SRP audit).
- List its public API surface and who calls it (grep for usages).
- Note side effects and risky operations: transaction boundaries, idempotency, signature
  verification, external calls, money math. Moving any of these incorrectly changes behavior.

## Produce a before/after design

Before changing anything, write the refactor plan as an explicit before/after design:
- **Before**: current structure, responsibilities, and the pain points (from the inventory above).
- **After**: the target structure — modules, responsibilities, interfaces, dependency direction
  (per `architecture.md`), and what moves where.
- **Steps**: the ordered, independently committable steps that get from before to after, each with
  its verification checkpoint.

This document is the deliverable the refactor routes to. It turns "safe steps" from a promise
into something concrete and reviewable. Plan the change deliberately — never modify blindly;
know exactly what the before/after is before touching anything (principle #8, `SKILL.md` AI
work principles).

## Pin behavior with characterization tests

After the design, but before changing any production code, write **characterization tests**
that lock in the current observable behavior (typical inputs → observed outputs), even if the
current behavior is imperfect. These are the contract your refactor must not break.

- Run them against the unrefactored code so they are green before you start.
- Prefer public-API-level tests; they survive internal restructuring.
- Do not "fix" behavior as a side effect of restructuring — that belongs in a separate,
  explicit change.

## Work in small, committable steps

- Extract the pure logic first (value objects, state machines, pure functions — lowest risk), then interfaces, then I/O and orchestration last.
- Each step must keep the characterization tests green and be independently committable.
- If a step changes behavior, stop — you have mixed a refactor with a fix. Split them.

## Techniques

- **Extract method / extract class**: pull one responsibility into its own unit.
- **Introduce interface + adapter**: replace `new ConcreteClient()` inside the class with an injected abstraction (see `architecture.md`).
- **Strangler pattern**: for large rewrites, add the new structure alongside the old, route callers over gradually, delete the old once unused.
- **Move transaction/side-effect boundaries carefully**: when relocating DB or network calls, keep the same scope and the same failure semantics; verify idempotency and signature checks are not weakened.

## Definition of done

- [ ] Same public API, same messages, same external contracts as before.
- [ ] No duplicated logic left behind; old code is deleted, not commented out.
- [ ] Characterization tests still pass; verification commands (test / lint / typecheck / build) all pass.
- [ ] No unrelated fixes or features bundled into the refactor commits.
- [ ] Security properties (auth, validation, idempotency, signature checks) unchanged or explicitly strengthened.

## Red flags

- Rewriting the module in one shot instead of incremental steps.
- Refactor + feature/bugfix in the same commit.
- "Cleaning up" code you cannot verify — no baseline tests before restructuring.
