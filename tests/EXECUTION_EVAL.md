# Execution Eval

验证 reference 在执行层面是否真正可用、无摩擦。路由评测只证明"走到哪扇门"，这里证明
"门后有没有路"。成本高，只跑代表性子集（当前 3 个场景）。

## 种子工程

用 `tests/fixtures/` 生成（每次**重新生成**，不要复用上次跑过的目录）：

```bash
rm -rf /tmp/opencode/skill-eval-project
mkdir -p /tmp/opencode/skill-eval-project/src /tmp/opencode/skill-eval-project/test
cp tests/fixtures/*.json  /tmp/opencode/skill-eval-project/
cp tests/fixtures/src/*   /tmp/opencode/skill-eval-project/src/
cd /tmp/opencode/skill-eval-project && git init -q && git add -A && git -c user.name=eval -c user.email=eval@test.local commit -qm init
```

种子状态自带：一个**活的舍入 bug**（`total` 未按分四舍五入）、一个**可复现的命令注入**
（`src/api.js` 的 `exec`）、一个 `node --test` 在 Node ≥ 24 会坏的测试脚本、空 `test/`
目录、无 `docs/`。

## 场景

### S1 修 bug（对应 `debugging.md`）
Prompt: "购物车结算 total 显示 29.997，应该是 30.00，帮我修一下"
通过标准：
- 先复现再修（不能凭直觉）
- 有回归测试，且证明它对 bug 变体真的会失败
- 最小 diff，无无关重构
- 验证命令真实跑过（含 broken harness 处理）
- 用 conventional commit 提交

### S2 新功能 TDD（对应 `workflow.md`）
Prompt: "给 pricing 模块加一个计算税费的函数 calculateTax(amount, taxRate)，四舍五入到分"
通过标准：
- Phase 0.1 先探索（读 manifest、找验证命令、找已有惯例）
- RED → 确认因正确原因失败 → GREEN → REFACTOR
- 输入边界（负数、0、越界、NaN）处理
- 纯函数 + 已校验边界 → 走 security 豁免路径（一行声明，而非通读 231 行清单）
- 无 `docs/` + 小改动 → docs 步骤明确声明为 moot

### S3 安全审计（对应 `security.md`）
Prompt: "帮我 audit 一下这个项目安不安全，有没有漏洞"
通过标准：
- **整库模式**（无 diff 时扫描全部源码），不被 "scan the diff" 卡住
- 平台章节选择合理（纯 Node 库 → 无平台章节，声明跳过）
- 命中命令注入（`exec` + 字符串插值），报告含文件:行号 + 修复建议
- 只读审计：不擅自改文件

## 运行方式

**关键教训（踩过的坑）**：
1. **场景必须串行跑，不能并行**——并发 subagent 会互相覆盖工作区、抢 commit，污染
   结果（2026-08-18 初测时 S1/S2 并行，两个 agent 报告了对方改的代码）。
2. **每次从 fixtures 重新生成种子**，不要拷贝上次的目录——上次跑完已被改过。
3. 每个场景派 **fresh subagent**，给它：工作区路径、prompt、"必须遵循
   <skill 路径> 的流程，报告读过的 reference、步骤、摩擦点（引用原文）、最终 diff + 验证输出"。
4. 摩擦点是最重要产出——重点是发现 skill 的缺陷，不是看它跑得多顺。

## 评分

每场景按通过标准逐条打分（通过/未通过/部分）。除通过率外，单独记录**摩擦点清单**
（引用原文），它们是迭代修复的输入。本轮修复后同一场景摩擦点不应重现。

## 历史回归

### 2026-08-18 首轮（发现 6 项）

- S1/S2 均发现——docs 同步无比例缩放（最重）、security 清单无纯函数豁免、broken
  harness 无指引、bug fix "instead of test-first" 措辞误导、code-review "不跑测试"与
  不变量 5 张力；另记录"场景须串行跑"教训。

### 2026-08-18 修复后回归（S1 已测，见上；本轮 S2/S3 重测）

**S2 新功能 TDD —— 产物通过，过程未证实**
> 该 subagent 未返回报告（task 工具空输出），仅能从最终工作区产物核验；下列标记
> "产物"的条目有据，标记"过程"的条目无法证实，留待复跑。

- [产物] RED→GREEN 完整实现：`calculateTax` 含完整输入边界校验（负数、0、NaN、
  Infinity、非数字、税率越界）
- [产物] 8 个单测覆盖上述边界，`npm test` 8/8 绿
- [产物] broken harness 按 Phase 5 指引**最小修复**：`node --test test/` →
  `node --test`（仅改脚本，不动实现），验证其真正跑通
- [过程] 探索阶段读 manifest/惯例、security 豁免一行声明、docs 步骤声明 moot——
  均无法证实（只能推断：能写出边界测试说明至少读过定价逻辑）
- [产物] 实现完成但**未提交**（git-commit.md 步骤缺失）。不能判定是 skill 缺口还是
  agent 预算截断；若复现，需检查 workflow 提交步骤的显式性

**S3 安全审计 —— 通过，修复 2 项残留**

S3 subagent 返回完整报告，验证三项修复全部生效：
- [通过] **整库模式**生效：无 diff → 扫描全部源码，未被"只 scan the diff"卡住
- [通过] **平台章节选择**生效：纯 Node 库 → 声明"no platform section"并列出跳过项，
  不硬套四平台清单
- [通过] 命中命令注入 `src/api.js:5`，报告含 `path:line` + 修复建议（execFile/spawn + 校验）
- [通过] 只读审计未改动任何文件（git status 干净）

新发现的 2 项残留，**本轮已修复**：
- FP-3（报告格式半吊子）：whole-repo 模式只要求 "per file with severity"，字面实现会
  漏 `file:line` 和修复建议 → security.md 已改为"每条 finding 必须带 `path:line` +
  命中模式引用 + 危害 + 具体修复建议"
- FP-4（死链）：security.md 的 proportionality 规则指向 `workflow.md` Phase 4，但纯
  security 路由不读 workflow.md → 已内联豁免判定标准（纯函数 + 已校验输入 + 无
  I/O/auth/网络/金钱决策），并注明豁免"绝不适用于整库审计"

**结论**：S1 修复后通过；S2 产物正确但过程未证实（agent 未返回报告）、未提交；
S3 三修复全部生效、仅 2 项残留已修。S2 应复跑一次取完整报告，重点观察提交步骤是否缺失。