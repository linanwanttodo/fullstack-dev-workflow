# Git Commit Conventions

## Message format

Follow Conventional Commits:

```
<type>(<scope>): <subject>

<body> (optional)

<footer> (optional)
```

- **Type**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `style`, `build`, `ci`, `revert`.
- **Scope**: the module or area affected, when helpful.
- **Subject**: imperative mood, ≤ 72 chars, no trailing period, lowercase after the colon.

**Examples:**

- `feat(auth): add JWT-based login`
- `fix(cart): correct total when discount is applied`
- `refactor(parser): extract tokenizer from lexer`
- `test(utils): cover empty-input cases for formatPrice`

## Commit hygiene

- One logical change per commit; the subject states the change, the body explains the why.
- Reference issues or tickets in the footer (e.g. `Closes #42`).
- Stage only intended files; never commit secrets, credentials, or generated artifacts.
- If a commit fails a hook, fix the issue and make a new commit — do not amend a failed commit.
