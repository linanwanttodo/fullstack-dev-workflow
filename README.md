# Fullstack Dev Workflow (fdw)

> 一套为 AI 编码代理设计的严谨软件工程技能。从需求到运维，从原则到清单，把「好工程师的默认行为」编码成可执行的流程。

[![package skill](https://github.com/linanwanttodo/fullstack-dev-workflow/actions/workflows/package.yml/badge.svg)](https://github.com/linanwanttodo/fullstack-dev-workflow/actions/workflows/package.yml)
[![deploy site](https://github.com/linanwanttodo/fullstack-dev-workflow/actions/workflows/pages.yml/badge.svg)](https://github.com/linanwanttodo/fullstack-dev-workflow/actions/workflows/pages.yml)
[![release](https://img.shields.io/github/v/release/linanwanttodo/fullstack-dev-workflow)](https://github.com/linanwanttodo/fullstack-dev-workflow/releases)

[English](README.en.md) · [项目网页](https://linanwanttodo.github.io/fullstack-dev-workflow/)

---

## 这是什么

`fdw` 是一个可安装到 AI 编码代理的 skill。它定义了一套完整的软件工程标准：

- **6 条核心不变量** —— 无论什么任务都成立的行为底线（先规划再写码、验证后才算完成……）
- **8 条 AI 工作原则** —— 用「荣誉/羞耻」约束代理，防止猜测 API、跳过验证、假装理解
- **9 阶段生命周期** —— 需求 → 可行性 → 规划选型 → 设计 → 脚手架 → 实现 → 测试 → 部署 → 运维
- **16 份引用文档** —— 分诊路由（`entry.md`）指向 15 份流程细节
- **可重复评测** —— 技能自带触发/路由/执行三份测试，改动防回归

给代理安装后，它会：先理解再动手、测试保护行为、验证后才声称完成、按规范提交、保持文档同步。

## 快速安装

### 方式一 · 交给 AI（推荐）

把下面这段话复制给你的 AI（Claude Code / Codex / opencode 等任意支持 agents skills 的代理），它会自动完成安装：

````text
请帮我安装 fullstack-dev-workflow (fdw) 这个 skill，请执行：
1. 下载 https://github.com/linanwanttodo/fullstack-dev-workflow/releases/latest/download/fdw.zip
2. 解压到 ~/.agents/skills/fdw/
3. 验证 ~/.agents/skills/fdw/SKILL.md 与 ~/.agents/skills/fdw/references/ 均存在
4. 报告安装结果
````

### 方式二 · 手动

1. 从 [Releases](https://github.com/linanwanttodo/fullstack-dev-workflow/releases) 下载 `fdw.zip`
2. 解压到你的 agents skills 目录：

```bash
unzip fdw.zip -d ~/.agents/skills/
# 结果：~/.agents/skills/fdw/SKILL.md 与 ~/.agents/skills/fdw/references/
```

## 目录结构

```
fullstack-dev-workflow/
├── .agents/skills/fdw/       # skill 本体（唯一事实来源）
│   ├── SKILL.md              # 入口：不变量、原则、生命周期、路由说明
│   ├── README.md             # skill 内部说明
│   └── references/           # 16 份流程引用文档（entry 分诊 → 各流程）
├── web/                      # 项目网页（Vite + TS，中英双语）
├── tests/                    # 可重复评测机制（触发/路由/执行）
├── .github/workflows/
│   ├── package.yml           # CI：打包 fdw → fdw.zip → artifact / Release
│   └── pages.yml             # CI：构建网页 → GitHub Pages
├── LICENSE
└── README.md / README.en.md
```

## 评测

技能每次修改都经过 [tests/](tests/) 三份评测防回归：

| 评测 | 验证内容 | 通过线 |
|---|---|---|
| `TRIGGER_EVAL.md` | description 是否正确触发（20 条含近失例） | ≥ 0.95 |
| `ROUTING_EVAL.md` | 请求是否路由到正确且唯一的引用（19 条） | ≥ 0.9 |
| `EXECUTION_EVAL.md` | 修 bug / TDD / 安全审计三场景执行无摩擦 | 见文件内标准 |

## 开发

```bash
# 网页
cd web && npm install && npm run dev    # 本地预览
npm run build                            # 产出 dist/

# 评测：见 tests/README.md
```

修改 skill 后，重跑对应评测并更新各文件底部「历史回归」。

## License

[MIT](LICENSE) © 2026 linanwanttodo