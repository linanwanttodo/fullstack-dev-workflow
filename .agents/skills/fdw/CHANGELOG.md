# Changelog

All notable changes to the fdw skill are recorded here. The project follows
[Keep a Changelog](https://keepachangelog.com/) and [SemVer](https://semver.org/).
The `version` field in `SKILL.md` frontmatter must match the latest entry below;
CI enforces this on release tags (the tag must be `v` + that version).

## [0.2.0] - 2026-08-28

### Added

- `version` in SKILL.md frontmatter and a `VERSION` file inside the packaged zip,
  so installed users can tell which build they have.
- Repo-level consistency gate: `scripts/check-consistency.mjs` (routing-table
  anti-drift across `entry.md` / `README.md` / `README.en.md`, reference-count
  claims, SKILL.md References table and site REF_GROUPS coverage, internal
  markdown links, web i18n key parity, eval-file structure, version/changelog
  sync) — run on every push/PR via the new `check.yml` workflow.
- Release integrity: CI verifies the release tag matches the SKILL.md version
  before publishing.

### Changed

- Site: async (non-blocking) font loading, favicon, SEO/OG meta tags.

## [0.1.0] - 2026-08-18

### Added

- Initial skill: `SKILL.md` + 16 reference docs (entry triage, per-change
  workflow, requirements, planning, architecture, documentation, frontend
  design, testing, debugging, refactoring, code standards, code review,
  git commit, security, deployment, understanding).
- Repeatable eval suite: trigger (20 cases), routing (19 cases), execution
  (3 scenarios) with a seed project carrying a live rounding bug and a command
  injection vulnerability.
- Bilingual intro site (Vite + TypeScript) and CI: zip packaging with release
  assets, GitHub Pages deployment.
