# Feasibility, Planning & Technology Selection

Runs after requirements are understood and before design. Decide whether the project is
worth doing, how it will be built, and in what order.

## Feasibility

Check five dimensions before committing to the build:

- **Technical** — can we build it with available skills and infrastructure? Run a proof
  of concept (POC) if any technology is unproven.
- **Economic** — is it worth the cost? Compare cost against the benefit.
- **Operational** — can the organization run and support it once built?
- **Legal / compliance** — regulations, data residency, licensing.
- **Schedule** — can it be done in the time available?

Surface risks with probability × impact. Then make an explicit decision:
**go / no-go / reduce-scope**, and say why.

## Technology selection

Choose the stack based on requirements, team expertise, and long-term maintainability —
not trends. Weigh: requirements fit, team familiarity, ecosystem health, community and
support, license and cost, deployment ease, scalability needs.

- Record the choice **and the rationale** — an ADR-style note: what was chosen, the
  alternatives rejected, why, and the trade-offs accepted. An irreversible choice without
  a recorded rationale is a latent problem.
- Use sensible defaults unless there is a concrete reason to deviate. Prefer proven,
  well-supported libraries; do not roll your own auth, crypto, or session management.
- For fullstack apps, decide explicitly: monolith vs microservices (monolith is the right
  default until there is a real scaling need), backend architecture, database (relational
  is the default for most apps), hosting, and auth model. The relational-vs-document
  decision criteria and schema design live in `architecture.md` (Database schema design).

## Project plan

- **Task breakdown** — decompose the work into small, ordered, independently completable
  tasks (WBS). Each task has a clear output.
- **Estimation** — give each task a size (S/M/L or points) and a rough time, then sum for
  a total. Estimation turns a task list into a schedule: it is the evidence behind the
  schedule-feasibility check. Be honest about uncertainty — give a range, flag the
  unknowns, and never tune estimates down to fit a deadline. Re-estimate after each
  milestone against actuals.
- **Dependencies & sequencing** — note task dependencies and the critical path; order the
  plan around them (what must finish before what can start).
- **Milestones** — external checkpoints, each with a definition of done.
- **Risk register** — risks, probability, impact, mitigation, owner, and the response
  (mitigate / accept / transfer / avoid).
- Keep assumptions explicit. A plan is a prediction, not a promise — when scope, resources,
  or dates conflict, surface the conflict rather than silently cutting corners.
