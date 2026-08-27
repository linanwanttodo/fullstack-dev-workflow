#!/usr/bin/env node
// Consistency checks for the fdw repo — run in CI (check.yml) and locally.
//
// Guards against the drift classes hit during the 2026-08-18 eval round:
//   1. routing-table drift between entry.md (authoritative) and the README summaries
//   2. stale reference counts ("16 份引用文档" / "16 reference docs") in docs and site
//   3. broken internal markdown links
//   4. web i18n key drift between index.html and i18n.ts
//   5. eval file structural regressions (case counts, route targets, fixtures)
//   6. SKILL.md version vs CHANGELOG.md mismatch
//
// Zero dependencies. Exit 1 on any [FAIL], warnings do not fail the run.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, basename, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

function read(rel) {
  try {
    return readFileSync(join(ROOT, rel), "utf8");
  } catch {
    fail(`cannot read ${rel}`);
    return "";
  }
}

// ---- reference files on disk ------------------------------------------------

const REFS_DIR = join(ROOT, ".agents/skills/fdw/references");
const refFiles = readdirSync(REFS_DIR).filter((f) => f.endsWith(".md")).sort();

// ---- 1. routing-table anti-drift --------------------------------------------

// Locate the first markdown table after a heading matching `headingRe`.
// Return data rows as arrays of trimmed cells (header + separator removed).
function tableAfterHeading(text, headingRe) {
  const lines = text.split("\n");
  let inSection = false;
  let rows = null;
  for (const line of lines) {
    if (/^#{1,6}\s/.test(line)) {
      if (inSection && rows) break; // next heading ends the section
      inSection = headingRe.test(line);
      continue;
    }
    if (!inSection) continue;
    if (rows === null) {
      if (!line.startsWith("|")) continue;
      rows = [];
    }
    if (!line.startsWith("|")) break;
    rows.push(line);
  }
  if (!rows || rows.length < 3) return null;
  // drop header + separator
  return rows.slice(2).map((r) => r.split("|").slice(1, -1).map((c) => c.trim()));
}

// Reduce a route cell to the set of reference files it names. Strategy:
// cut the cell at the first explanatory marker ("(", "（", ". ", "—"), then
// collect *.md tokens; drop SKILL.md (lifecycle pointer, not a reference).
function routeFiles(cell) {
  const cut = [" (", "（", ". ", "—"]
    .map((m) => cell.indexOf(m))
    .filter((i) => i >= 0);
  const head = cut.length ? cell.slice(0, Math.min(...cut)) : cell;
  const tokens = head.match(/[\w./-]+\.md/g) ?? [];
  return new Set(
    tokens.map((t) => basename(t)).filter((t) => t !== "SKILL.md")
  );
}

function routingSequence(file, headingRe) {
  const text = read(file);
  const rows = tableAfterHeading(text, headingRe);
  if (!rows) {
    fail(`${file}: routing table not found (heading /${headingRe.source}/)`);
    return null;
  }
  return rows.map((cells, i) => ({ row: i + 1, cell: cells[1] ?? "", files: routeFiles(cells[1] ?? "") }));
}

const seqEntry = routingSequence(
  ".agents/skills/fdw/references/entry.md",
  /Intent-to-route/
);
const seqZh = routingSequence("README.md", /任务分诊路由/);
const seqEn = routingSequence("README.en.md", /[Rr]out(e|ing)/);

if (seqEntry && seqZh && seqEn) {
  if (seqZh.length !== seqEntry.length) {
    fail(`README.md routing table has ${seqZh.length} rows, entry.md has ${seqEntry.length}`);
  }
  if (seqEn.length !== seqEntry.length) {
    fail(`README.en.md routing table has ${seqEn.length} rows, entry.md has ${seqEntry.length}`);
  }
  const n = Math.min(seqEntry.length, seqZh.length, seqEn.length);
  for (let i = 0; i < n; i++) {
    const a = seqEntry[i], b = seqZh[i], c = seqEn[i];
    const same = (x, y) => x.size === y.size && [...x].every((t) => y.has(t));
    if (!same(a.files, b.files) || !same(a.files, c.files)) {
      fail(
        `routing drift at row ${i + 1}: entry.md="${a.cell}" | README.md="${b.cell}" | README.en.md="${c.cell}"`
      );
    }
  }
}

// every references/*.md mentioned anywhere must exist
for (const file of ["README.md", "README.en.md", ".agents/skills/fdw/SKILL.md", ".agents/skills/fdw/references/entry.md"]) {
  const text = read(file);
  for (const m of text.matchAll(/references\/([\w-]+\.md)/g)) {
    if (!refFiles.includes(m[1])) fail(`${file}: links to missing reference "${m[1]}"`);
  }
}

// ---- 2. SKILL.md references table + web REF_GROUPS cover all references -----

const skillText = read(".agents/skills/fdw/SKILL.md");
const skillTableRefs = [...skillText.matchAll(/references\/([\w-]+\.md)/g)].map((m) => m[1]);
// routing prose in SKILL.md mentions some references too; require the References
// table (at end of file) to cover every file on disk
const refsTableSection = skillText.slice(skillText.indexOf("## References"));
const tableRefs = new Set([...refsTableSection.matchAll(/references\/([\w-]+\.md)/g)].map((m) => m[1]));
for (const f of refFiles) {
  if (!tableRefs.has(f)) fail(`SKILL.md References table is missing "${f}"`);
}
for (const t of tableRefs) {
  if (!refFiles.includes(t)) fail(`SKILL.md References table lists unknown file "${t}"`);
}

const i18nSrc = read("web/src/i18n.ts");
const refGroupFiles = new Set([...i18nSrc.matchAll(/\bfile:\s*"([\w-]+\.md)"/g)].map((m) => m[1]));
if (refGroupFiles.size === 0) {
  fail("web/src/i18n.ts: no REF_GROUPS file entries found");
} else {
  for (const f of refFiles) {
    if (!refGroupFiles.has(f)) fail(`web/src/i18n.ts REF_GROUPS is missing "${f}"`);
  }
  for (const t of refGroupFiles) {
    if (!refFiles.includes(t)) fail(`web/src/i18n.ts REF_GROUPS lists unknown file "${t}"`);
  }
}

// ---- 3. reference-count claims ----------------------------------------------

const claimFiles = ["README.md", "README.en.md", "web/index.html", "web/src/i18n.ts"];
const actualCount = refFiles.length;
for (const file of claimFiles) {
  const text = read(file);
  for (const m of text.matchAll(/(\d+)\s*份引用文档/g)) {
    if (Number(m[1]) !== actualCount) fail(`${file}: claims "${m[1]} 份引用文档" but references/ has ${actualCount}`);
  }
  for (const m of text.matchAll(/(\d+)\s+reference docs/gi)) {
    if (Number(m[1]) !== actualCount) fail(`${file}: claims "${m[1]} reference docs" but references/ has ${actualCount}`);
  }
}

// ---- 4. internal markdown links ---------------------------------------------

function* markdownFiles(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === "dist") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* markdownFiles(p);
    else if (name.endsWith(".md")) yield p;
  }
}
for (const path of markdownFiles(ROOT)) {
  const text = readFileSync(path, "utf8");
  for (const m of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const clean = target.split("#")[0];
    if (!clean) continue;
    const abs = resolve(dirname(path), clean);
    try {
      statSync(abs);
    } catch {
      fail(`${relative(ROOT, path)}: broken internal link "${target}"`);
    }
  }
}

// ---- 5. web i18n keys --------------------------------------------------------

const html = read("web/index.html");
const htmlKeys = new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]));
if (htmlKeys.size === 0) fail("web/index.html: no data-i18n keys found");

const staticIdx = i18nSrc.indexOf("export const STATIC");
if (staticIdx < 0) {
  fail("web/src/i18n.ts: STATIC export not found");
} else {
  const staticSrc = i18nSrc.slice(staticIdx);
  const enIdx = staticSrc.indexOf("en: {");
  const zhBlock = staticSrc.slice(0, enIdx);
  const enBlock = staticSrc.slice(enIdx);
  const keysIn = (block) => new Set([...block.matchAll(/"([\w.]+)":/g)].map((m) => m[1]));
  const zhKeys = keysIn(zhBlock);
  const enKeys = keysIn(enBlock);
  for (const k of htmlKeys) {
    if (!zhKeys.has(k)) fail(`i18n key "${k}" used in index.html is missing from STATIC.zh`);
    if (!enKeys.has(k)) fail(`i18n key "${k}" used in index.html is missing from STATIC.en`);
  }
  for (const k of zhKeys) if (!enKeys.has(k)) fail(`i18n key "${k}" exists in zh but not en`);
  for (const k of enKeys) if (!zhKeys.has(k)) fail(`i18n key "${k}" exists in en but not zh`);
  for (const k of zhKeys) {
    if (!htmlKeys.has(k)) warn(`i18n key "${k}" is not referenced by any data-i18n in index.html`);
  }
  if (!i18nSrc.includes('STATIC[lang]["ins.cta"]')) {
    // main.ts hard-references this key; keep the guard in case the key is renamed
    if (!zhKeys.has("ins.cta")) fail('i18n key "ins.cta" (hard-referenced in main.ts) is missing');
  }
}

// install prompt URL must stay identical across READMEs and the site
const installUrl = "releases/latest/download/fdw.zip";
for (const file of ["README.md", "README.en.md", "web/src/i18n.ts"]) {
  if (!read(file).includes(installUrl)) {
    fail(`${file}: install prompt is missing the canonical URL ".../${installUrl}"`);
  }
}

// ---- 6. eval structure -------------------------------------------------------

function evalRows(text, headingRe) {
  const rows = tableAfterHeading(text, headingRe);
  return rows;
}

const triggerText = read("tests/TRIGGER_EVAL.md");
{
  const claimed = (triggerText.match(/（(\d+)\s*条/) ?? [])[1];
  const rows = evalRows(triggerText, /查询集/);
  if (!rows || !claimed) {
    fail("tests/TRIGGER_EVAL.md: query table or claimed count not found");
  } else {
    if (rows.length !== Number(claimed)) {
      fail(`tests/TRIGGER_EVAL.md: claims ${claimed} cases but table has ${rows.length}`);
    }
    rows.forEach((cells, i) => {
      const gold = cells[2] ?? "";
      if (!/^(YES|NO)/.test(gold)) fail(`tests/TRIGGER_EVAL.md: case ${i + 1} gold must start with YES/NO, got "${gold}"`);
    });
  }
  if (!triggerText.includes("历史回归")) fail("tests/TRIGGER_EVAL.md: missing 历史回归 section");
}

const routingText = read("tests/ROUTING_EVAL.md");
{
  const claimed = (routingText.match(/（(\d+)\s*条/) ?? [])[1];
  const rows = evalRows(routingText, /用例集/);
  if (!rows || !claimed) {
    fail("tests/ROUTING_EVAL.md: case table or claimed count not found");
  } else {
    if (rows.length !== Number(claimed)) {
      fail(`tests/ROUTING_EVAL.md: claims ${claimed} cases but table has ${rows.length}`);
    }
    rows.forEach((cells, i) => {
      const gold = cells[2] ?? "";
      for (const m of gold.matchAll(/[\w./-]+\.md/g)) {
        const name = basename(m[0]);
        if (name === "SKILL.md") continue;
        if (!refFiles.includes(name)) fail(`tests/ROUTING_EVAL.md: case ${i + 1} routes to unknown reference "${name}"`);
      }
    });
  }
  if (!routingText.includes("历史回归")) fail("tests/ROUTING_EVAL.md: missing 历史回归 section");
}

const execText = read("tests/EXECUTION_EVAL.md");
{
  for (const s of ["S1", "S2", "S3"]) {
    if (!new RegExp(`### ${s}`).test(execText)) fail(`tests/EXECUTION_EVAL.md: missing scenario ${s}`);
  }
  if (!execText.includes("历史回归")) fail("tests/EXECUTION_EVAL.md: missing 历史回归 section");
  for (const f of ["tests/fixtures/package.json", "tests/fixtures/src/api.js", "tests/fixtures/src/index.js", "tests/fixtures/src/pricing.js"]) {
    try {
      statSync(join(ROOT, f));
    } catch {
      fail(`tests/EXECUTION_EVAL.md: seed file missing: ${f}`);
    }
  }
}

// ---- 7. version metadata -----------------------------------------------------

const frontmatter = skillText.match(/^---\n([\s\S]*?)\n---/);
const skillVersion = frontmatter?.[1].match(/^version:\s*(\S+)/m)?.[1];
if (!skillVersion) {
  fail(".agents/skills/fdw/SKILL.md: frontmatter is missing a `version:` field");
} else if (!/^\d+\.\d+\.\d+$/.test(skillVersion)) {
  fail(`.agents/skills/fdw/SKILL.md: version "${skillVersion}" is not semver`);
}

const changelogText = read(".agents/skills/fdw/CHANGELOG.md");
if (skillVersion) {
  const latest = (changelogText.match(/^##\s*\[?(\d+\.\d+\.\d+)\]?/m) ?? [])[1];
  if (!latest) {
    fail(".agents/skills/fdw/CHANGELOG.md: no `## [x.y.z]` release heading found");
  } else if (latest !== skillVersion) {
    fail(`version mismatch: SKILL.md is ${skillVersion}, CHANGELOG.md latest entry is ${latest}`);
  }
}

// ---- report ------------------------------------------------------------------

for (const w of warnings) console.log(`[WARN] ${w}`);
for (const e of errors) console.error(`[FAIL] ${e}`);
if (errors.length === 0) {
  console.log(`OK — all consistency checks passed (${refFiles.length} references, routing tables aligned).`);
  if (warnings.length) console.log(`${warnings.length} warning(s).`);
} else {
  console.error(`${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
