# Code & Comment Standards

## Naming

- Names communicate intent: `calculateTotalPrice` not `doIt`; `isActive` for predicates.
- Follow the surrounding code's casing conventions (camelCase, snake_case, PascalCase, kebab-case) for the language and ecosystem.
- Booleans read as questions; verbs for actions; nouns for things.

## Comments

- Explain the **why**, not the what — the code already says what it does.
- Comment non-obvious constraints, invariants, trade-offs, and the reasoning behind a non-trivial decision.
- Keep comments next to the code they describe and update them with the code.
- Do not restate the code; do not leave stale TODO graveyards without a reference.

## Formatting & structure

- Follow the project's existing style; run the configured formatter and linter.
- Keep functions small; one level of abstraction per function.
- No dead code; remove commented-out code.

## Error handling

- Fail loudly and early for programmer errors; handle expected errors explicitly.
- Propagate errors with context; do not swallow exceptions silently.
- Validate external input at boundaries.

## Code review checklist

- [ ] Behavior matches the requirement / test.
- [ ] No obvious bugs or missed edge cases.
- [ ] Follows SOLID and the project's structure.
- [ ] Clear names; comments only where they earn their place.
- [ ] No security issues (see `security.md`).
- [ ] Tests cover the change.

*principle #6 (see `SKILL.md` AI work principles): follow the project's conventions and
architectural boundaries — never break the architecture to make a change fit.*
