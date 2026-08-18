# Entry Triage

The first step of every task. Classify the user's request before doing anything else —
before exploring code, before clarifying questions, before writing any code. The
intent determines the route; the route determines which reference(s) to read.

This file is the **single, authoritative intent-to-route map** for the whole skill.
`SKILL.md` does not duplicate it; add or change routes here only.

## 1. Classify first

Read the user's request and identify its core intent from keywords and context. Do not
start a workflow or write code until you have decided the intent. If the request does
not obviously fit, use the intent-to-route table below.

## 2. Intent-to-route table

| Intent (user asks to…) | Route (read these) |
|---|---|
| debug / fix unexpected behavior / why is X broken / why does X fail | `references/debugging.md` |
| performance / slow / why is X slow / optimize / profile | `references/debugging.md` (performance analysis section) |
| deploy / CI-CD / pipeline / release / environments / ops / monitoring | `references/deployment.md` |
| understand / explain / what does this module do / project overview / how does X work | `references/understanding.md` |
| write or update docs / architecture docs / plans / diagrams / docs folder | `references/documentation.md` |
| security / audit / is this safe / check for vulnerabilities | `references/security.md` |
| commit / write a commit message / git / version control | `references/git-commit.md` |
| review / audit a change / check this PR | `references/code-review.md` (which points to `code-standards.md`, `security.md`, `git-commit.md` for the full review passes) |
| UI / frontend / make it look better / style it / design a page / redesign a page or layout | `references/frontend-design.md` (+ `references/architecture.md`, `references/workflow.md` when the change builds new UI or components) |
| refactor / redesign code / clean up code / improve structure | `references/refactoring.md` (+ `references/architecture.md` for design targets, `references/workflow.md` for the change loop) |
| write tests / test authoring / add coverage | `references/testing.md` (+ `references/workflow.md` when running the TDD loop inside a change) |
| new feature / build something / add functionality | `references/workflow.md`, `references/architecture.md`, `references/testing.md` (+ `references/security.md` when the feature touches auth, credentials, money, user input, or network/data surfaces — e.g. login/JWT, payments, file uploads, webhooks) |
| architecture / API / database design / design interfaces | `references/architecture.md` |
| technology selection / feasibility / plan / estimate | `references/planning.md` |
| whole project / build from scratch / full application | Full lifecycle in `SKILL.md` (requirements → feasibility → planning/tech selection → design → scaffold → implement → test → deploy → operate; see the full phase list and project-level definition of done there) |
| comments / code style / naming conventions | `references/code-standards.md` |
| trivial / mechanical edits: rename, comment/whitespace/format fix, restructure with no behavior change | No reference. Apply `SKILL.md` invariant 6 (proportionate process): no plan or tests, just verification. Do not route renames or format fixes to `refactoring.md` — that path exists for structural refactors. |

## 3. Route to the narrowest match

- A single intent routes to its **primary reference** — the first one listed for that row —
  which is self-contained for the core task. A docs-only task reads only
  `documentation.md`; a review task reads `code-review.md` (which carries the
  standards/security/commit passes). The extra files in a row are **conditional
  additions**, not a required bundle: `(+ …)` means load them only when the specific
  condition applies (e.g. the new feature touches a security surface; the UI change
  actually builds new components). A reference also points to related references when a
  task needs them during its phases (e.g. `debugging.md` points to `testing.md` and
  `git-commit.md`; `workflow.md` points to `code-standards.md`, `code-review.md`,
  `security.md`, and `git-commit.md`). Follow those as the phase requires.
- Full lifecycle only when the request is a whole project or a large, poorly-scoped
  feature. For incremental work inside an existing project, route to `workflow.md`
  instead.

## 4. Ambiguity, collisions, and mixed intents

- **Ambiguous request** — two sub-cases:
  - The request has *some* identifiable intent: pick the most likely single path, state
    your assumption in one sentence, and proceed. If the user corrects you, re-triage
    and switch.
  - The request has **no identifiable intent** (e.g. "这个新东西你帮我搞定" / "do something
    with this"): do **not** guess and proceed. Ask a focused clarifying question first —
    proceeding on a guess violates the confirm-first principles (#2/#3 in `SKILL.md`).
- **Keyword collisions** — when a request matches more than one row, break the tie by the
  most specific intent: the object of the verb decides. "audit this project" → security;
  "audit a change / check this PR" → review; "redesign a page" → frontend; "redesign
  code / clean up code" → refactor. If the object is still ambiguous, state your
  assumption and proceed (or ask, if the consequences of guessing are high).
- **Mixed intents** (e.g. "fix this bug and check the security"): handle the primary
  intent first, then the secondary intents in order. Do not merge them into one
  half-executed workflow.

## 5. Standalone use

Every reference is usable alone. This skill is one coherent standard — the triage layer
only decides which piece applies to this request. There is no need to run the full
lifecycle unless the request is genuinely a whole project.