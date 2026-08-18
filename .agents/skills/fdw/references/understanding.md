# Understanding a Project / Module / Feature

For pure-information requests: "understand this project", "what does this module do",
"how does this feature work", "explain this". No code is written. The goal is a
structured understanding the user can act on or that feeds a later change.

## 1. Start from the docs (fastest path)

If a `docs/` folder exists, read `docs/README.md` first, then the theme documents
relevant to the question:

- `01-requirements/` — what the system is for, scope, personas.
- `03-architecture/` — layering, module responsibilities, data flow, contracts.
- `04-modules/<module>/` — the module deep dive for the specific module asked about.

Docs give intent and design decisions. Read them before diving into code.

## 2. Map the code

- List the directory structure: entry points, modules, layers (UI → application → domain
  → infrastructure).
- Identify manifest files and the stack (`package.json`, `pyproject.toml`, `go.mod`,
  etc.) for the dependency picture.
- Locate where the asked-about concern lives: which module, which files, which layer.

## 3. For a specific module or feature, trace:

- **Responsibilities** — what it does and does not do (SRP from `architecture.md`).
- **Public interfaces** — exported functions/classes/API, their signatures and callers.
- **Data flow** — how a request or event enters, is handled, and reaches persistence or
  a response.
- **Dependencies** — what it depends on, what depends on it, and the dependency direction.

Use `architecture.md` concepts (responsibilities, interfaces, coupling) as the lens.

## 4. Follow key flows through the code

Trace one real flow end to end (request → handler → service → data layer), reading the
actual code path. This is where understanding becomes concrete.

## 5. Output a structured summary

Present: what the project/module does, its boundaries, public interfaces, dependencies,
key flows, and how it fits the whole system. Keep it proportional to the question —
do not dump the entire codebase for a one-module question. Note anything that looks
inconsistent with the docs (possible drift).

Do not modify code, docs, or behavior. If the user then asks to change something,
re-triage through `entry.md` to the change's route.