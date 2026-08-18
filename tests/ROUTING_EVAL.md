# Routing Eval

验证 skill 的分诊路由：给定一条真实开发请求，skill 是否把它路由到**正确且唯一**的
reference。这是最便宜、最高价值的评测——路由错了一切都错。

## 用例集（19 条）

每条记录期望路由。`+` 表示条件附加（`entry.md` §3 的 `(+ …)` 语义）；trivial 行期望
"无 reference"。

| # | Prompt | 期望路由 | 测试点 |
|---|---|---|---|
| 1 | 这个下单接口偶尔返回 500，有时又正常，帮我查一下 | `debugging.md` | 偶发故障 → 复现分支 |
| 2 | 首页加载特别慢，帮我优化一下性能 | `debugging.md`（性能章节） | 性能归口 |
| 3 | 给我加一个用户登录功能，用 JWT，放在现有项目里 | `workflow.md`, `architecture.md`, `testing.md` + `security.md` | **安全敏感功能必须带 security.md** |
| 4 | userService 这个类 800 行了，帮我拆一下 | `refactoring.md` | 重构主路由 |
| 5 | 帮我 audit 一下这个项目安不安全，有没有漏洞 | `security.md` | "audit 项目"→security（撞词按宾语裁决） |
| 6 | review 一下我刚提交的这版代码 | `code-review.md` | "audit/检查变更"→review |
| 7 | 这个登录页太丑了，帮我重新设计一下 | `frontend-design.md` | "redesign 页面"→frontend |
| 8 | 这个项目是干嘛的？给我讲讲整体架构和各个模块 | `understanding.md` | 纯信息任务 |
| 9 | 帮我给用户模块写一份详细的模块文档 | `documentation.md` | 文档任务 |
| 10 | 给 pricing 模块补一下单元测试 | `testing.md` | 测试任务 |
| 11 | 帮我设计一个订单系统的 API 和数据库表结构 | `architecture.md` | API + schema 设计 |
| 12 | 帮我配一个 GitHub Actions CI，跑测试和部署 | `deployment.md` | CI/CD |
| 13 | 我们该用 PostgreSQL 还是 MongoDB？对比一下 | `planning.md` | 技术选型；可交叉指向 architecture.md |
| 14 | 帮我从零搭一个待办事项全栈应用，前端 React 后端 Node | 全生命周期（SKILL.md 阶段 1-9） | 整体项目 |
| 15 | 帮我写个 commit message | `git-commit.md` | 提交 |
| 16 | 这个文件命名风格不一致，统一一下 | `code-standards.md`（惯例）+ trivial 路径 | 不要误入 refactoring.md |
| 17 | 这个导出接口有 bug 而且很慢，帮我看看 | `debugging.md`（两个意图同一文件） | 混合意图不合并成半个流程 |
| 18 | 这个新东西你帮我搞定 | 无意图 → **先问澄清问题** | 不得猜测执行（principle #2/#3） |
| 19 | 把这个变量名改成 camelCase | 无 reference（trivial，仅验证） | trivial 行命中，不悬空 |

## 运行方式

**方式 A — 自检（快）**：按 `entry.md` 逐条分类，与上表对照。适用于本人/单个 agent。

**方式 B — 独立 agent 盲测（更可信）**：派一个 fresh subagent，只给它 prompt 集和
skill 路径，让它读 `SKILL.md` + `references/entry.md` 后独立给出每条的路由，再与上表
对照。fresh context 才能暴露真实分类误差。

## 评分

- 每条：期望路由完全命中 = 1；主路由命中但漏条件附加（如 JWT 漏 security.md）= 0.5；
  主路由错误 = 0。
- 通过线：`≥ 0.9`。
- 关注点：**撞词裁决**（audit/redesign/clean up）、**trivial 命中**、**无意图先问**、
  **安全敏感功能带 security.md**。

## 历史回归

- 2026-08-18 初测：19 条平均清晰度 4.3；trivial（#16/#19）、无意图（#18）、JWT 漏
  security（#3）、撞词无裁决、单/多 reference 表述矛盾 等 8 类问题。
- 2026-08-18 修复后重测（人工核验）：19/19 正确，无回归。