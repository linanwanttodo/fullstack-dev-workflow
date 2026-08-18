# Architecture & Design Standards

## SOLID principles

- **S — Single Responsibility**: a class, module, or function should have exactly one reason to change. If you can name two responsibilities, split it.
- **O — Open/Closed**: extend behavior by adding code, not by modifying tested code.
- **L — Liskov Substitution**: subtypes must be substitutable for their base type without breaking invariants.
- **I — Interface Segregation**: clients should not depend on interfaces they do not use; prefer several small interfaces over one fat interface.
- **D — Dependency Inversion**: depend on abstractions, not concretions; high-level modules should not depend on low-level modules.

## High cohesion, low coupling

- **Cohesion**: the elements inside a module belong together — one responsibility, one domain concept.
- **Coupling**: modules interact through narrow, stable interfaces; minimize shared mutable state and transitive dependencies.
- Rule of thumb: if a change ripples across many modules, coupling is too high.

## Interface-oriented programming

- Design the interface (the contract) before the implementation.
- Interfaces should be minimal, stable, and expressed in terms of the caller's needs, not the callee's internals.
- Program to the interface; inject the concrete implementation.

*principle #4 (see `SKILL.md` AI work principles): reuse existing interfaces and code
before inventing new ones — a new interface is a last resort, not a default.*

## Dependency injection

- Construct dependencies outside the object and pass them in — constructor injection is preferred.
- Do not instantiate collaborators inside the class when choosing the collaborator is a policy decision.
- Benefits: testability (swap in fakes), flexibility, clearer ownership.
- Use a DI container only when the object graph grows large; manual wiring is often clearer.

## Layering & boundaries

- Keep dependency direction consistent (e.g. UI → application → domain → infrastructure).
- Domain logic should not depend on framework or transport details.
- Keep persistence, I/O, and framework concerns at the edges.

## Interface design checklist

- [ ] Named after what it does, not how it is implemented.
- [ ] Small surface: few methods, each with a clear single purpose.
- [ ] Stable: changes rarely break callers.
- [ ] Symmetric and unsurprising: things that look similar behave similarly.
- [ ] Documented contract: preconditions, postconditions, error behavior.

## API contract design

- Define the contract **before** implementation: endpoints, methods, request/response
  schemas, error model, authentication. Document it (OpenAPI/Swagger or equivalent).
- Design for the caller: resource-oriented naming, consistent status codes, a versioning
  strategy from day one.
- A written contract lets frontend and backend build in parallel against a mock, and lets
  API tests be written before the implementation exists.

## Error model design

- Design failure behavior explicitly, not as an afterthought: what can fail, what the
  caller sees (status/error type), and what the system does (retry, fallback, crash).
  The API contract's error model (`architecture.md` API contract section) must be designed
  here, not improvised.
- Choose the error strategy per layer: exceptions for unrecoverable program errors, typed
  results (e.g. `Result`/`Either`) for expected business failures, validation errors
  returned to the caller. Be consistent within a layer.
- Fail loudly for programming errors (fail-fast in development); fail gracefully for
  expected failures (degrade, retry, surface a clear message). Never swallow errors.
- Define retry/backoff and idempotency for operations that can partially fail — retrying a
  non-idempotent write duplicates the effect.

## Concurrency & data consistency

- Identify shared mutable state and its concurrency needs: threads/async tasks, locking,
  transaction isolation levels, race conditions, and the consistency model (strong vs
  eventual).
- Choose the simplest correct model: single-threaded by default; add locking or immutable
  data only where the shared state genuinely requires it. Document the chosen isolation
  level for transactions that read-then-write.
- Think in boundaries: where does concurrent access cross module/process boundaries, and
  what is the coordination (transaction, lock, queue, idempotent API)?

## Database schema design

- Model entities and their relationships first (ER). Choose relational vs document based
  on the data shape and transaction needs — relational is the default for most apps.
- Define primary keys, foreign keys, and the indexes the hot queries actually need.
- Plan migrations as versioned, reversible, reviewable changes.
- Keep business rules in the domain layer, not scattered in triggers or stored procedures.

## UI/UX design

- Design for the user's task first, then the visuals. Sketch the key screens and user
  flows before building, and confirm the flow with the user.
- Follow the frontend design standards in `references/frontend-design.md`: design plan
  first, forbidden patterns (floating elements, gradients, emoji, neon, sidebar-strip
  message boxes, liquid glass), accessibility baseline, and image-vs-code-native
  decisions.
- Handle loading, empty, and error states explicitly — they are part of the design.
- Keep UI components thin: presentational layers call into application logic, never the
  other way around.

## Common pitfalls

- God objects / god classes (SRP violation).
- Service locators and global state (hidden coupling, break testability).
- Premature abstraction: do not introduce an interface or pattern before there is real variation to justify it.
- Coupling domain code to concrete framework classes.
