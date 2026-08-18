# Project Documentation Standards

Every development task produces and maintains project documentation under `docs/`.
Documentation is code: it lives in git, updates in the same change/PR as the code it
describes, and is reviewed alongside it. A developer taking over the project must be
able to ramp up from `docs/README.md` alone.

## Directory structure

Themed directories numbered `01-05` matching the lifecycle order. Each document is a
single file directly under its theme directory. Multi-module projects get one
subdirectory per module under `04-modules/`.

```
docs/
├── README.md                      # Index: every document + one-line purpose
├── 01-requirements/
│   └── YYYY-MM-DD-<topic>.md      # e.g. 2026-08-17-需求分析.md
├── 02-planning/
│   └── YYYY-MM-DD-<topic>.md      # e.g. 2026-08-17-开发计划.md
├── 03-architecture/
│   └── YYYY-MM-DD-<topic>.md      # e.g. 2026-08-17-架构设计.md
├── 04-modules/
│   └── <module-name>/
│       └── YYYY-MM-DD-<module>.md # e.g. 2026-08-17-用户模块详解.md
└── 05-deployment/
    └── YYYY-MM-DD-<topic>.md      # e.g. 2026-08-17-部署与运维.md
```

- **Filename** = date + concrete topic: `YYYY-MM-DD-<topic>.md`. The date in the filename
  is the **creation date**; a topic that is later updated is edited in place (one
  canonical file per topic, history preserved in git) — do not create a new dated file
  for routine updates, and do not rename to today (breaks links and history). Start a new
  dated file only for a genuinely new topic.
- **docs/README.md** is the mandatory entry point: every document listed with a one-line
  purpose, plus a short "how to run / verify" pointer so a newcomer starts fast.
- Create a theme directory as soon as its first document is needed; a single document
  still lives in its own theme folder — never scatter files in the `docs/` root.
- **Module subdirectories** under `04-modules/` use the module's own name as it appears
  in the code (its package or directory name); the document title uses the readable name
  in the doc language.

## Per-phase documents

| Theme dir | Document(s) | Core contents | Lifecycle phase |
|---|---|---|---|
| `01-requirements/` | Requirements analysis | Problem, scope, personas, functional/non-functional requirements, user stories + acceptance criteria, MoSCoW priority | 1 |
| `02-planning/` | Development plan | Feasibility verdict (go/no-go + why), technology selection + rationale (ADR: chosen, rejected, trade-offs), task breakdown, milestones with definition of done, risk register | 2-3 |
| `03-architecture/` | Architecture design; database design | Layering diagram, module responsibilities, API contracts, data flow; ER diagram, schema, indexes, migration plan | 4 |
| `04-modules/` | Per-module deep dive | Responsibilities, public interfaces (signatures), internal implementation notes, dependencies, key flows, extension points, test notes | 6 |
| `05-deployment/` | Deployment & operations | Environments, CI/CD pipeline, configuration/secrets, rollback plan, smoke tests, monitoring, troubleshooting | 8-9 |

Each theme document follows the analysis structure defined in its corresponding
reference file: `01-requirements/` per `requirements.md`, `02-planning/` per
`planning.md`, `03-architecture/` per `architecture.md`, `05-deployment/` per
`deployment.md`. The module deep-dive template below is self-contained; the other four
themes translate their reference file's checklist into a written document.

### Module deep-dive template (`04-modules/`)

Write one document per module. The test: could someone edit this module from this
document alone? Translate the section headings to the document language.

```markdown
# <Module> 详解

## 职责
- 一句话说明模块做什么、不做什么。

## 对外接口
- 公共函数/类/API,签名 + 一句话语义 + 关键错误行为。
- 被哪些模块调用。
- HTTP 接口含响应状态与响应体形态;导出的内部辅助函数(如签发 token)也在此列出。

## 数据模型
- 本模块涉及的表/实体(字段、键),或对 `03-architecture/` 中数据模型的引用。

## 配置
- 本模块依赖的环境变量/配置项(JWT_SECRET、有效期、成本因子等),缺失值如何表现。

## 内部实现
- 关键结构、算法或状态机(仅解释"为什么",不粘贴大段实现代码)。

## 依赖
- 依赖的模块/服务/库,以及依赖方向。

## 关键流程
- 核心时序,用 Mermaid sequenceDiagram 或分步说明。

## 扩展点
- 设计上预留的扩展方式,如何新增变体。

## 测试要点
- 该模块的主要测试文件、典型用例、边界情况。
```

## Diagram rules (Mermaid)

- **System architecture** → `flowchart` (module responsibilities and layering).
- **Key flows / sequences** → `sequenceDiagram`.
- **Data model** → `erDiagram` (entities, relations, keys).
- **State machine** → `stateDiagram`.
- Diagrams only where they carry real structure; split complex diagrams rather than
  one giant graph; labels name the thing, not the mechanism.

## Sync policy — docs update with code

Docs are updated in the **same change/PR** as the code they describe, never in a
separate documentation pass:

- **Architecture/API/database changes** → update the relevant `03-architecture/` document
  in the same change.
- **New or changed module/interface** → update its `04-modules/` deep dive in the same
  change (signatures, dependencies, key flows that actually changed).
- **New requirement, feature, or stack decision** → update `01-requirements/` or
  `02-planning/` as relevant.
- **Deployment/config changes** → update `05-deployment/`.
- **docs/README.md** → update whenever a document is added or renamed, and when a listed
  document's purpose materially changes.
- The commit message mentions the doc update alongside the code (conventional commit,
  scope reflects both).
- Stale docs are a defect. If code and doc disagree, fix the doc as part of the change —
  never leave known drift.

## When docs must be updated (threshold)

- **Required** when a change alters a module's public surface (interfaces, signatures,
  error behavior), its dependencies, its data model, its key flows, architecture, API
  contracts, schema, or deployment/configuration. Update in the same change.
- **Optional** for mechanical, low-risk edits that do not change behavior or structure
  (a rename, a comment/whitespace/format fix) — the trivial-work exemption from
  `SKILL.md` applies to docs too. A one-line constant or config change is a behavior
  change and updates docs as required above.
- When in doubt, update. A short doc update beats a stale doc.

## Quality standards

- **Accuracy first**: written docs must match the code. Discovered drift gets fixed in
  the same change.
- **Concise and executable**: commands are copy-paste ready; no restating the obvious or
  re-explaining what the code already says.
- **Templated**: follow the theme template above; no free-form variation.
- **Language follows the user**: write in the user's language by default; if the user
  specifies a language, follow it; if the repo or team has a language convention, follow
  that; if unsure, ask. Never assume — pick the language of the conversation unless told
  otherwise.
- **No code duplication**: explain why and how to use — do not paste large implementation
  blocks into docs.
- **Ramp-up test**: after writing a section, ask "can someone edit this module from this
  doc alone?" — if not, fill the gap.