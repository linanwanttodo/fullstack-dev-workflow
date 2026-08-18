# Deployment & Operations

Deployment is not the finish line — it is the start of real-world feedback. Plan the
release and the ongoing operation before the first deploy. The general process below
applies to every platform; use the platform section for the specifics of your target.

## Environments

- Keep development / staging / production separate. Never test in production.
- Configuration comes from environment variables or a config store — never hard-coded
  values, never committed secrets.

## CI/CD pipeline

The path from commit to production. Each stage is a gate that stops the pipeline on failure:

```
push → install deps → lint → typecheck → unit tests → integration tests → build
     → deploy to staging → E2E / smoke tests → (approval gate) → deploy to prod → smoke tests
```

- Preview deploys for pull requests let reviewers see changes live.
- Cache dependencies and parallelize tests to keep feedback fast.
- Add a dependency vulnerability scan (e.g. `npm audit`, `pip-audit`) as a gate.

## Rollback & release strategy

- Document the rollback plan **before** the first deploy: how to revert, who decides, what to verify after.
- Prefer strategies that limit blast radius: blue/green, canary, staged rollout.
- After any deploy, run automated smoke tests on the critical paths (login, core workflow,
  payment). If they fail, roll back.

## Secrets & credentials

- Secrets live in environment variables or a secrets manager — never in the repo, config
  files, or logs.
- Rotate credentials on a schedule; scan dependencies in CI.

## Monitoring & operations

- **Metrics**: uptime, error rate, latency, capacity. Set SLOs where possible.
- **Logging**: structured logs for the failure paths that matter.
- **Error tracking**: surface unhandled exceptions automatically (error-tracking tooling) — do not wait for users to report them.
- **Alerting**: alert only on what requires action; avoid alert fatigue.
- **Feedback loop**: collect user feedback and metrics; production incidents get a
  postmortem that produces actionable follow-up items in the backlog. Each new change then
  starts a new iteration of the lifecycle.

## Platform sections

Apply the section for the platform you are deploying to.

### Web (server / frontend)

- Serve over TLS (HTTPS) with valid certificates; set HSTS.
- Deploy behind a reverse proxy; restrict access to admin/internal routes.
- Configure the environment per environment (dev / staging / prod) via the config store.
- Containerize and pin image versions; scan images in CI.
- Use environment-specific feature flags for staged rollouts.

### Android

- **Signing**: sign the release APK/AAB with a production keystore, never the debug key.
  Store the keystore securely (secrets manager), back it up — losing it locks you out of
  updating the app.
- **Versioning**: bump `versionCode` on every release and `versionName` per semantic
  version. Play rejects a build whose `versionCode` was already uploaded before and
  requires it to be higher than the **highest ever uploaded** `versionCode` for the app —
  not merely higher than the currently live one.
- **Distribution**: upload the App Bundle (`.aab`) to Google Play Console; manage rollout
  via staged rollout percentages rather than a single 100% push.
- **Release build**: enable minification/R8, and make sure release builds strip debug
  logging and are not debuggable (`debuggable=false`).
- **App signing key**: enable Play App Signing so Google holds your signing key; keep the
  upload key separate and secure.
- **Update rollback**: a 100% Android store release cannot be fully reverted — you must
  ship a new version. A **staged (percentage) rollout can be rolled back** to the previous
  release, so use staged rollouts and keep the previous version's `versionCode` pattern in
  mind; test the update path from the previous live version.

### iOS / macOS

- **Signing & provisioning**: use distribution certificates and provisioning profiles from
  the Apple Developer account; never sign with a development profile for release.
- **Notarization (macOS)**: notarize and staple distribution builds; users and Gatekeeper
  reject unsigned/unanotarized apps.
- **Distribution**: submit to App Store Connect via TestFlight first (internal + external
  testers), then release after review. macOS apps can also distribute via Developer ID +
  notarization outside the App Store.
- **Versioning**: bump `CFBundleShortVersionString` (visible version) and
  `CFBundleVersion` (build) per release.
- **App Store review**: keep privacy details (Privacy Nutrition Labels), permission usage
  strings, and data-collection disclosures accurate — rejection delays release.
- **Update rollback**: an approved release is the only live version; a bad release needs a
  new submission. Test the update path and keep App Store phased release (gradual rollout)
  enabled.

### Desktop (Windows / macOS / Linux, incl. Electron / Tauri)

- **Code signing**: sign Windows executables (Authenticode), macOS apps (Developer ID),
  and Linux packages where the platform requires it — unsigned apps trigger OS warnings.
- **Auto-update**: use a signed updater (Electron autoUpdater, Tauri updater) that verifies
  the update signature over TLS. Stage the update; allow rollback to the last signed build.
- **Installers**: produce per-platform installers (MSI/NSIS, .dmg, .AppImage/.deb/.rpm);
  pin and sign them in CI.
- **Publishing**: publish to the platform stores (Microsoft Store, Mac App Store) or
  distribution sites; keep version parity across channels.
- **Update rollback**: ship updates gradually (a small percentage, monitor crash rate,
  then widen); keep the previous signed build downloadable until the new one is stable.

## Review rule

- If you are not sure a release is safe to promote, say so explicitly and gate the
  promotion rather than shipping on assumption.