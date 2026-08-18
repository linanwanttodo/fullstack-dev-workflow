# Systematic Debugging

## Workflow

1. **Reproduce**: get a minimal, reliable reproduction. If you cannot reproduce, gather logs and state to narrow it down. Be honest about what you don't know yet — guessing at the cause before reproducing is how diagnosis goes wrong (principle #7, `SKILL.md` AI work principles).
2. **Read the error**: treat the message literally; identify the failing line and its type. For behavior bugs with no error message ("the price is wrong"), treat the **expected-vs-actual discrepancy** as the error — state it literally ("expected 85, got 100") and trace which value is being produced wrong.
3. **Form hypotheses**: at most a couple at a time; use the codebase to validate or discard each.
4. **Test the hypothesis**: check the evidence — logs, debugging output, a small experiment. Never fix "blind" on intuition alone.
5. **Find the root cause**: keep asking "why" until you reach the underlying defect, not just the surface symptom.
6. **Fix the cause, not the symptom**: the smallest change that addresses the root cause and preserves existing behavior. Change deliberately — blind modification that happens to stop the symptom is a trap (principle #8, `SKILL.md` AI work principles).
7. **Add a regression test**: prove the bug is fixed and prevent recurrence. Follow
   `testing.md` for how to write and place the test.
8. **Verify**: run the tests, and re-run the original reproduction to confirm it is
   resolved. Find the test/verify commands per `workflow.md` Phase 0.1 if not already known.
9. **Commit**: write a conventional commit message (`git-commit.md`) for the fix, separate from any unrelated changes.

## Bug fix quality bar

- Minimal diff; no unrelated refactors bundled in.
- Explain the root cause before proposing the fix (in the response or the PR).
- Confirm the reproduction case passes after the fix.

## Red flags

- Fixing symptoms ("the value is wrong" → "round it") without understanding why it is wrong.
- Blind code changes with no reproduction.
- Over-engineering a fix — new abstractions for a one-line defect.

## Performance analysis

For "why is X slow" requests, adapt the same discipline to performance. For frontend/UI
performance specifically (page load, transitions, images, layout), also check the
performance items in `references/frontend-design.md` — the two references cover different
halves of the same problem.

1. **Measure first**: profile or time the actual path before changing anything. Never
   optimize on intuition. Use a profiler, tracing, or a benchmark that reproduces the
   slow case.
2. **Establish the baseline**: record current numbers so the fix is verifiable.
3. **Find the bottleneck**: analyze the profile — which calls dominate (queries, N+1,
   blocking I/O, rendering, allocations). One dominant cost, not scattered guesses.
4. **Form and test hypotheses** as in the debugging workflow — change one thing, re-measure.
5. **Fix the cause, not the symptom**: the smallest change that removes the dominant cost
   (an index, a cache, batching, avoiding recomputation). Re-measure to confirm the
   improvement and that behavior is unchanged.
6. **Verify**: run tests, re-run the benchmark, and confirm the original slow case is
   faster. Report before/after numbers.
