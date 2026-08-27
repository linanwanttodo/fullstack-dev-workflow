# Skill Eval

本 skill 的可重复评测机制。任何对 `SKILL.md` 或 `references/` 的改动都应该过一遍这里，
防止回归。三份评测按成本/价值排序：

| 文件 | 验证什么 | 成本 | 通过线 |
|---|---|---|---|
| `TRIGGER_EVAL.md` | description 是否正确触发 skill（20 条含近失例） | 极低 | ≥ 0.95 |
| `ROUTING_EVAL.md` | 请求是否路由到正确且唯一的 reference（19 条） | 低 | ≥ 0.9 |
| `EXECUTION_EVAL.md` | reference 执行层面是否可用、无摩擦（3 场景，需种子工程） | 高 | 见文件内逐条标准 |

## 标准流程

1. **触发** → `TRIGGER_EVAL.md`：改过 `description` 才需要重跑；否则跳过。
2. **路由** → `ROUTING_EVAL.md`：改过 `entry.md` / `SKILL.md` 路由相关文字必跑；
   改 references 内容建议跑。
3. **执行** → `EXECUTION_EVAL.md`：改过 `debugging.md` / `workflow.md` / `testing.md` /
   `security.md` 等流程类 reference 必跑对应场景；只改文档/表述类 reference 可跳过。

每份文件底部有"历史回归"节，记录上次跑的日期、发现、修复，便于追溯和防重。

评测文件的结构（用例数、期望路由、种子文件、历史回归节）由 `scripts/check-consistency.mjs`
自动校验，随 CI 的 `check.yml` 在每次 push/PR 运行；本地执行：`node scripts/check-consistency.mjs`。

## 历史

- 2026-08-18 首轮：三份评测全部建立并跑通；发现并修复 12 项问题（见各文件"历史回归"
  及仓库根 `docs/` 下本轮记录）。