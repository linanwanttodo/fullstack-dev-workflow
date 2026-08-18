export type Lang = "zh" | "en";

export interface RefItem {
  file: string;
  zh: string;
  en: string;
}

export interface RefGroup {
  key: string;
  zh: string;
  en: string;
  items: RefItem[];
}

export const INVARIANTS: { zh: string; en: string }[] = [
  {
    zh: "先规划，再写码。写实现代码之前，先理解任务、上下文与预期设计。",
    en: "Plan before code. Understand the task, its context, and the intended design before writing implementation code.",
  },
  {
    zh: "正确性优先于速度。可靠、可验证、可维护的工作，胜过快而不稳。",
    en: "Correctness over speed. Prefer correct, verifiable, maintainable work over fast-but-fragile output.",
  },
  {
    zh: "面向可维护性设计。遵循 SOLID、高内聚低耦合、面向接口编程与依赖注入。",
    en: "Design for maintainability. Follow SOLID, high cohesion / low coupling, interface-oriented programming, and dependency injection.",
  },
  {
    zh: "测试保护行为。新功能与 bug 修复都要带测试，除非用户明确反对。",
    en: "Tests protect behavior. New features and bug fixes ship with tests unless the user explicitly says otherwise.",
  },
  {
    zh: "验证后才算完成。实际运行验证命令并确认输出，再报告成功。",
    en: "Verify before claiming done. Run the actual verification commands and confirm their output before reporting success.",
  },
  {
    zh: "流程与任务相称。机械、低风险、结构不变的改动视为琐碎，无需规划与测试，只需验证。",
    en: "Proportionate process. Mechanical, low-risk, structurally-unchanged edits are trivial: no plan or tests, just verification.",
  },
];

export const PRINCIPLES: { zh: string; en: string }[] = [
  {
    zh: "荣誉：先读真实接口再动手。 羞耻：凭空猜 API。",
    en: "Honor consulting, shame guessing APIs. Read the actual interface before assuming what it does.",
  },
  {
    zh: "荣誉：意图模糊时先确认。 羞耻：基于猜测含糊执行。",
    en: "Honor seeking confirmation, shame vague execution. Confirm the goal when intent is ambiguous.",
  },
  {
    zh: "荣誉：向人类验证业务意图。 羞耻：擅自发明需求。",
    en: "Honor human confirmation, shame assuming the business. Validate business intent, never invent requirements silently.",
  },
  {
    zh: "荣誉：复用现有接口与代码。 羞耻：凭空发明新的。",
    en: "Honor reusing existing, shame inventing new. Prefer existing interfaces over creating new ones.",
  },
  {
    zh: "荣誉：主动测试与验证。 羞耻：跳过验证就报告完成。",
    en: "Honor testing proactively, shame skipping verification. Never report done without running the checks.",
  },
  {
    zh: "荣誉：遵守项目惯例。 羞耻：破坏架构边界。",
    en: "Honor following conventions, shame breaking architecture. Stay within the project's standards and boundaries.",
  },
  {
    zh: "荣誉：诚实承认不懂。 羞耻：假装理解。",
    en: "Honor honest ignorance, shame faking understanding. Say clearly what you don't know instead of pretending.",
  },
  {
    zh: "荣誉：谨慎地重构。 羞耻：盲目地改动。",
    en: "Honor careful refactoring, shame blind modification. Change deliberately with a before/after design.",
  },
];

export const LIFECYCLE: { zh: string; en: string }[] = [
  { zh: "需求", en: "Requirements" },
  { zh: "可行性", en: "Feasibility" },
  { zh: "规划与技术选型", en: "Planning & tech selection" },
  { zh: "设计", en: "Design" },
  { zh: "脚手架", en: "Scaffold" },
  { zh: "实现", en: "Implementation" },
  { zh: "测试", en: "Testing" },
  { zh: "部署", en: "Deployment" },
  { zh: "运维", en: "Operation & maintenance" },
];

export const REF_GROUPS: RefGroup[] = [
  {
    key: "entry",
    zh: "路由入口",
    en: "Routing entry",
    items: [
      { file: "entry.md", zh: "意图→引用分诊", en: "Intent-to-route triage" },
    ],
  },
  {
    key: "lifecycle",
    zh: "生命周期核心",
    en: "Lifecycle core",
    items: [
      { file: "workflow.md", zh: "逐变更循环", en: "Per-change loop" },
      { file: "requirements.md", zh: "需求分析", en: "Requirements analysis" },
      { file: "planning.md", zh: "可行性与规划", en: "Feasibility & planning" },
      { file: "architecture.md", zh: "设计与契约", en: "Design & contracts" },
      { file: "documentation.md", zh: "docs/ 结构与规范", en: "Docs structure & rules" },
      { file: "understanding.md", zh: "理解项目/模块", en: "Understand a codebase" },
    ],
  },
  {
    key: "quality",
    zh: "质量保障",
    en: "Quality assurance",
    items: [
      { file: "testing.md", zh: "TDD 与测试质量", en: "TDD & test quality" },
      { file: "debugging.md", zh: "系统化调试", en: "Systematic debugging" },
      { file: "refactoring.md", zh: "安全重构", en: "Safe refactoring" },
      { file: "code-standards.md", zh: "命名与风格", en: "Naming & style" },
      { file: "code-review.md", zh: "评审方法论", en: "Review methodology" },
      { file: "git-commit.md", zh: "提交规范", en: "Commit conventions" },
    ],
  },
  {
    key: "special",
    zh: "专项",
    en: "Specialized",
    items: [
      { file: "security.md", zh: "安全检查清单", en: "Security checklist" },
      { file: "frontend-design.md", zh: "前端设计规范", en: "UI design standards" },
      { file: "deployment.md", zh: "部署与运维", en: "Deployment & ops" },
    ],
  },
];

export const STATIC: Record<Lang, Record<string, string>> = {
  zh: {
    "hero.kicker": "工程流程 · 为 AI 代理而生",
    "hero.title1": "全栈开发",
    "hero.title2": "工作流",
    "hero.sub":
      "一套可安装到 AI 编码代理的严谨软件工程技能：从需求到运维，从原则到清单，把「好工程师的默认行为」编码成可执行的流程。",
    "hero.cta1": "安装技能",
    "hero.cta2": "查看流程",
    "hero.spec1": "1 个 SKILL.md",
    "hero.spec2": "16 份引用文档",
    "hero.spec3": "9 阶段生命周期",
    "hero.spec4": "6 条核心不变量",
    "inv.title": "核心不变量",
    "inv.lede": "无论任务是什么，以下六条始终成立。它们定义了「什么是好的开发工作」。",
    "pri.title": "AI 工作原则",
    "pri.lede": "行为准则——用「荣誉」约束代理：该做的是默认，该羞耻的是绝不能做。",
    "life.title": "完整生命周期",
    "life.lede": "一个序列：九个阶段按序推进，每个阶段产出写入 docs/ 对应目录。增量开发则压缩前置阶段。",
    "ref.title": "引用文档",
    "ref.lede": "流程的全部细节沉淀在 references/ 下。每个任务由 entry.md 分诊，路由到正确的引用。",
    "ins.title": "安装",
    "ins.lede": "两种方式：手动解压，或把一段提示词复制给你的 AI——它会自动完成安装。",
    "ins.m1": "方式一 · 手动",
    "ins.s1": "下载 fdw.zip（GitHub Release）",
    "ins.s2": "解压到 ~/.agents/skills/fdw/",
    "ins.s3": "确认 SKILL.md 与 references/ 就位",
    "ins.m2": "方式二 · 交给 AI",
    "ins.s4": "复制 README 中的「安装提示词」发给你的 AI，它会下载压缩包、解压并验证安装。",
    "ins.cta": "获取提示词",
    "tst.title": "可重复评测",
    "tst.lede": "这个技能自己有测试：触发评测、路由评测、执行评测——每次修改都防回归。",
    "tst.t1": "触发评测",
    "tst.t1d": "20 条查询，验证 description 该触发时触发、不该触发时不触发。",
    "tst.t2": "路由评测",
    "tst.t2d": "19 条请求，验证正确路由到唯一引用。",
    "tst.t3": "执行评测",
    "tst.t3d": "修 bug / TDD / 安全审计三个场景，在种子工程上验证流程无摩擦。",
    "end.line": "没有流程的工程是冒险；有流程的工程是纪律。",
    "end.sub": "fdw · fullstack dev workflow · one skill to rule the stack",
  },
  en: {
    "hero.kicker": "ENGINEERING PROCESS · FOR AI AGENTS",
    "hero.title1": "FULLSTACK DEV",
    "hero.title2": "WORKFLOW",
    "hero.sub":
      "A rigorous software-engineering skill you can install into an AI coding agent: from requirements to operations, from principles to checklists — encoding a good engineer's default behavior into an executable process.",
    "hero.cta1": "Install the skill",
    "hero.cta2": "View the flow",
    "hero.spec1": "1 SKILL.md",
    "hero.spec2": "16 reference docs",
    "hero.spec3": "9-phase lifecycle",
    "hero.spec4": "6 core invariants",
    "inv.title": "Core invariants",
    "inv.lede": "These six always hold, no matter the task. They define what good development work is.",
    "pri.title": "AI work principles",
    "pri.lede": "Behavioral rules — constraining agents with honor: the honorable action is the default; the shameful one is what you must never do.",
    "life.title": "Full lifecycle",
    "life.lede": "A sequence: nine phases in order, each captured into its docs/ folder. Incremental work compresses the front-loaded phases.",
    "ref.title": "Reference docs",
    "ref.lede": "All procedural detail lives under references/. Every task is triaged by entry.md and routed to the right reference.",
    "ins.title": "Install",
    "ins.lede": "Two ways: unpack manually, or copy a prompt to your AI — it will complete the install itself.",
    "ins.m1": "Option 1 · Manual",
    "ins.s1": "Download fdw.zip (GitHub Release)",
    "ins.s2": "Unpack to ~/.agents/skills/fdw/",
    "ins.s3": "Verify SKILL.md and references/ are in place",
    "ins.m2": "Option 2 · Let the AI do it",
    "ins.s4": "Copy the “install prompt” from the README to your AI — it will download the archive, unpack, and verify.",
    "ins.cta": "Get the prompt",
    "tst.title": "Repeatable eval",
    "tst.lede": "This skill has its own tests: trigger, routing, and execution eval — every change is guarded against regression.",
    "tst.t1": "Trigger eval",
    "tst.t1d": "20 queries verify the description fires when it should and stays silent when it should not.",
    "tst.t2": "Routing eval",
    "tst.t2d": "19 requests verify correct routing to a single reference.",
    "tst.t3": "Execution eval",
    "tst.t3d": "Bug-fix / TDD / security-audit scenarios run on a seed project to verify the flow has no friction.",
    "end.line": "Engineering without a process is risk; engineering with a process is discipline.",
    "end.sub": "fdw · fullstack dev workflow · one skill to rule the stack",
  },
};