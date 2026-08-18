# Fullstack Dev Workflow (fdw)

> A rigorous software-engineering skill for AI coding agents. From requirements to operations, from principles to checklists — encoding a good engineer's default behavior into an executable process.

[![package skill](https://github.com/linanwanttodo/fullstack-dev-workflow/actions/workflows/package.yml/badge.svg)](https://github.com/linanwanttodo/fullstack-dev-workflow/actions/workflows/package.yml)
[![deploy site](https://github.com/linanwanttodo/fullstack-dev-workflow/actions/workflows/pages.yml/badge.svg)](https://github.com/linanwanttodo/fullstack-dev-workflow/actions/workflows/pages.yml)
[![release](https://img.shields.io/github/v/release/linanwanttodo/fullstack-dev-workflow)](https://github.com/linanwanttodo/fullstack-dev-workflow/releases)

[中文](README.md) · [Project site](https://linanwanttodo.github.io/fullstack-dev-workflow/)

---

## What is this

`fdw` is a skill you can install into an AI coding agent. It defines a complete set of software-engineering standards:

- **6 core invariants** — behavioral floors that hold for every task (plan before code, verify before claiming done…)
- **8 AI work principles** — constraining agents with honor/shame to prevent guessing APIs, skipping verification, or faking understanding
- **9-phase lifecycle** — requirements → feasibility → planning/tech selection → design → scaffold → implementation → testing → deployment → operations
- **16 reference docs** — `entry.md` triage routing to 15 procedure documents
- **Repeatable eval** — the skill carries its own trigger/routing/execution tests; every change is guarded against regression

Once installed, your agent will: understand before coding, protect behavior with tests, verify before claiming done, commit by convention, and keep docs in sync.

## Quick install

### Option 1 · Let the AI do it (recommended)

Copy this to your AI (Claude Code / Codex / opencode, or any agent supporting agents skills) — it will install itself:

````text
Please install the fullstack-dev-workflow (fdw) skill for me. Do the following:
1. Download https://github.com/linanwanttodo/fullstack-dev-workflow/releases/latest/download/fdw.zip
2. Unpack it to ~/.agents/skills/fdw/
3. Verify ~/.agents/skills/fdw/SKILL.md and ~/.agents/skills/fdw/references/ both exist
4. Report the install result
````

### Option 2 · Manual

1. Download `fdw.zip` from [Releases](https://github.com/linanwanttodo/fullstack-dev-workflow/releases)
2. Unpack it into your agents skills directory:

```bash
unzip fdw.zip -d ~/.agents/skills/
# Result: ~/.agents/skills/fdw/SKILL.md and ~/.agents/skills/fdw/references/
```

## Directory layout

```
fullstack-dev-workflow/
├── .agents/skills/fdw/       # the skill itself (single source of truth)
│   ├── SKILL.md              # entry: invariants, principles, lifecycle, routing
│   ├── README.md             # in-skill notes
│   └── references/           # 16 procedure references (entry triage → each flow)
├── web/                      # project site (Vite + TS, bilingual)
├── tests/                    # repeatable eval (trigger / routing / execution)
├── .github/workflows/
│   ├── package.yml           # CI: package fdw → fdw.zip → artifact / Release
│   └── pages.yml             # CI: build site → GitHub Pages
├── LICENSE
└── README.md / README.en.md
```

## Eval

Every change to the skill passes the three evals in [tests/](tests/) to prevent regression:

| Eval | Verifies | Pass line |
|---|---|---|
| `TRIGGER_EVAL.md` | description fires correctly (20 queries incl. near-misses) | ≥ 0.95 |
| `ROUTING_EVAL.md` | requests route to the correct single reference (19 cases) | ≥ 0.9 |
| `EXECUTION_EVAL.md` | bug-fix / TDD / security-audit run friction-free | see file |

## Development

```bash
# Site
cd web && npm install && npm run dev    # local preview
npm run build                            # outputs dist/

# Eval: see tests/README.md
```

After changing the skill, re-run the matching evals and update the "history" notes at the bottom of each file.

## License

[MIT](LICENSE) © 2026 linanwanttodo