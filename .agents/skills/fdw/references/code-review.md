# Code Review Standards

Apply when reviewing a pull request, a set of changes, or your own work before declaring
it done. Condensed from the code-review plugin methodology: parallel review perspectives,
confidence-based scoring, and aggressive false-positive filtering so only issues that
truly matter are reported.

## Scope

- Review the actual changes only (the diff). Focus on bugs the change introduces, not
  pre-existing issues.
- Do not run the build, linter, typechecker, or tests yourself — assume CI covers them;
  review is about logic, correctness, and conventions. (This applies when you are the
  *reviewer*. When you are reviewing your own work as part of `workflow.md` Phase 4, the
  implementer's own Phase 5 verification still applies — the skill never replaces "verify
  before claiming done" with a review. If a project has no CI, say so and note that the
  change's verification is your own Phase 5 job, not the reviewer's.)
- Skip the review entirely for trivial changes, or when it is not needed (no meaningful
  behavioral change).

## Review from multiple perspectives

Examine the change independently from each angle (run them as separate passes or parallel
agents when feasible):

1. **Guidelines compliance** — does the change follow the project's explicit rules
   (AGENTS.md/CLAUDE.md or the standards in this skill): structure, naming, error
   handling, testing, conventions?
2. **Obvious bugs** — shallow scan of the changed lines for real bugs: logic errors,
   null/undefined handling, race conditions, memory leaks, broken control flow. Focus on
   large bugs; ignore nitpicks and likely false positives.
3. **Historical context** — read the git blame/history of the modified code: does the
   change break a prior decision or repeat a past fix?
4. **Related feedback** — check previous PRs or comments that touched these files: does
   prior feedback still apply to the current change?
5. **Code comments** — do the modified files' existing comments constrain how the code
   should behave, and does the change comply?

## Confidence scoring

Score each candidate issue 0-100 to decide whether to report it:

- **0** — Not confident; a false positive, or a pre-existing issue.
- **25** — Somewhat confident; might be real but unverified.
- **50** — Moderately confident; a real issue, but a nitpick or rare in practice, and
  minor relative to the change.
- **75** — Highly confident; verified it is very likely hit in practice, the current
  approach is insufficient, and it directly impacts functionality — or it is directly
  called out by the project's guidelines.
- **100** — Absolutely certain; double-checked and confirmed a real issue that will
  happen frequently.

**Report only issues scored >= 80.** For guideline-flagged issues, verify the guideline
actually calls out that specific point before reporting.

## Filter out false positives

Do not report: pre-existing issues; code that looks like a bug but is not; pedantic
nitpicks a senior engineer would not raise; anything a linter/typechecker/compiler would
catch (formatting, missing imports, type errors); general quality issues (coverage,
docs) unless the guidelines require them; issues silenced in code (e.g. lint-ignore
comments); likely-intentional changes; real issues on lines the change did not touch.

## Output format

- Start by stating what was reviewed.
- Report only high-confidence issues, grouped by severity (critical vs important).
- For each issue: a brief description with its confidence score, the file path and line
  number, the guideline reference or bug explanation, and a concrete fix suggestion.
- Link and cite code rather than describing vaguely. For GitHub links use the full SHA
  and a line range with at least one line of context.
- If no high-confidence issues exist, say so briefly and confirm the change meets the
  standards — do not pad the review with noise.
- No emoji.