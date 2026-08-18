# Requirements Analysis

Goal: turn a vague request into a documented, testable contract **before** any design
or code. Ambiguous requirements are the #1 cause of failed projects — resolve them here,
not in code.

This applies to whole projects and to any large or poorly-scoped feature. For small,
well-understood changes inside an existing project, compress it into the clarifying
questions of `workflow.md` Phase 0.2.

## Problem statement

- What problem does this solve, and who experiences it? (1–2 sentences.)
- Success metrics: how will we know it worked? (adoption, task time, revenue, error rate, …)

## Scope

- **In**: what this deliverable includes.
- **Out**: what it explicitly excludes (this is what prevents scope creep).
- **Constraints**: budget, timeline, compliance, platform, integration requirements.

## Users

- 2–3 primary personas: role, goals, frustrations, technical comfort.

## Requirements

- **Functional (FR)** — what the system must do. Write as user stories with acceptance
  criteria: *"As a [role], I want [feature], so that [benefit]."* Every story needs
  testable acceptance criteria.
- **Non-functional (NFR)** — performance (response time, concurrency), security,
  availability, scalability, accessibility, data retention / compliance.

## Traceability

- Give each story an ID (e.g. `FR-01`, `NFR-01`). Reference the ID in the design
  (`architecture.md`), the tests (`testing.md`), and the module docs (`documentation.md`)
  it maps to. A requirement with no linked test and no linked design is unverifiable.
- Verify each requirement maps to at least one test at sign-off: if a story has no
  acceptance test, it is not done.

## Change management

- Requirements signed off are the baseline. When the user asks for a change after sign-off:
  record what changed, the reason, and the impact on scope/schedule/cost; update the
  baseline; and re-confirm with the user. Silent scope drift — a change absorbed without
  being recorded — is the failure mode this prevents.

## Prioritization

- MoSCoW: **M**ust / **S**hould / **C**ould / **W**on't. Ship the Must set first (MVP).

## Output

A requirements summary the user signs off on before you design. Include: problem statement,
scope, personas, prioritized stories with acceptance criteria, and NFRs. If the user cannot
answer a requirement question, record the assumption explicitly and flag it.

*principle #3 (see `SKILL.md` AI work principles): business intent is confirmed with a
human and signed off here — never invented or assumed silently.*
