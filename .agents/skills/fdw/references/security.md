# Security Checklist

Apply the relevant items to every change. Anything that touches user input, external
data, credentials, authentication, or the network is high risk. Review in three layers:
(1) scan the diff for the dangerous patterns below, (2) check the change against the
platform section for the target platform, (3) for cross-cutting changes, trace data flow
across files to catch multi-file issues (IDOR, auth bypass, SSRF) that single-file
scanning misses.

## Audit modes

- **Diff mode** (default, for a change): scan the changed lines for the dangerous patterns
  below, then the platform section.
- **Whole-repo mode** (for "audit this project / is this safe"): there is no diff to scan —
  scan **all** source files for the dangerous patterns below, treat every file as "new or
  edited", then run the cross-cutting scan list. Report findings per finding with severity —
  each finding must carry `path:line` — the pattern hit (quote it) — why it is dangerous —
  and a concrete suggested fix.
- **Choosing the platform section**: pick the section that matches the code's actual
  surface, not its packaging. A plain backend/library module with no HTTP server, UI, or
  OS integration has **no platform section** — apply the language-agnostic dangerous
  patterns and the cross-cutting scan list only, and skip browser/OS-specific items
  (DOM XSS, cookie flags, entitlements, etc.) as not applicable. State which sections you
  applied and which you skipped.
- **Proportionality**: a tiny change (a pure function with validated inputs, no I/O or
  external data, no auth/network/money decisions) can be exempted from the full sweep with
  one line of justification instead — the exemption is defined for implementers in
  `workflow.md` Phase 4, and it never applies to a whole-repo audit.

## Threat modeling (for new features / new surfaces)

For a new feature, endpoint, or trust boundary, think adversarially before writing code —
the pattern scan below catches known mistakes, threat modeling catches the design-level
ones:

1. **Draw the data flow**: what enters the system (input, third-party data, deep links),
   where it crosses a trust boundary (user → app → server → database / keychain / filesystem).
2. **Ask "what if an attacker controls this?"** per STRIDE: Spoofing identity, Tampering,
   Repudiation, Information disclosure, Denial of service, Elevation of privilege.
3. **Identify the crown jewels**: the data and operations an attacker would want
   (credentials, payment, PII, admin actions, deletion).
4. **Rank the threats** by likelihood × impact, and design controls for the top ones into
   the architecture — not retrofitted after the pattern scan flags a symptom.
5. Record the model (even briefly) in the design doc / `docs/03-architecture/` so the
   security decisions are traceable.

A threat model is a design artifact; the checklist below is the mechanical scan. Run both.

## Dangerous patterns (language-agnostic — flag any of these in new or edited code)

- **Unsafe deserialization**: `pickle`/`cPickle`/`cloudpickle`/`dill`/`marshal`/`shelve`
  `load`/`loads`, `joblib.load`, `pandas.read_pickle`, `numpy.load(..., allow_pickle=True)`,
  `torch.load` without `weights_only=True`, and any binary serializer fed untrusted data =
  arbitrary code execution. Prefer JSON or a schema-validated deserializer (pydantic,
  msgspec, marshmallow).
- **Unsafe YAML**: `yaml.load()`/`yaml.unsafe_load()` execute arbitrary code via
  `!!python/object` tags. Use `yaml.safe_load()` and validate against a schema.
- **Command injection**: `os.system()`, `subprocess.*(..., shell=True)`,
  `child_process.exec()`/`execSync()`, `exec.Command("sh", "-c", ...)` run through a
  shell — build command argument lists instead (`subprocess.run([...])`, `execFile`/`spawn`).
- **Dynamic code**: `eval()`, `new Function()`, and `dlopen`/reflection with interpolated
  input = code injection. Use a safe expression parser or allow-listed dispatch.
- **Weak crypto**: `createCipher`/`createDecipher` (no IV, insecure KDF) — use
  `createCipheriv`/`createDecipheriv`; AES-ECB leaks structure — use AES-GCM or
  CBC+HMAC. Do not invent custom cryptography; use a reviewed library.
- **TLS verification disabled**: `verify=False`, `rejectUnauthorized: false`,
  `InsecureSkipVerify: true`, `NODE_TLS_REJECT_UNAUTHORIZED=0`,
  `ssl._create_unverified_context` — enables MITM; never disable verification.
- **Unsafe XML parsing**: stdlib `xml.etree.ElementTree`/`minidom`/`xml.sax` parsers are
  vulnerable to XXE and billion-laughs — use `defusedxml`.
- **GitHub Actions injection**: never interpolate untrusted event fields (issue/PR
  titles and bodies, commit messages, `client_payload`) into `run:` commands or `ref:`
  parameters — pass them via `env:` with proper quoting.

If a flagged pattern is genuinely safe in context, add a comment explaining why; the
inline justification documents the exclusion.

## Input handling

- Validate and sanitize all external input (API payloads, query params, headers, file uploads, deep links).
- Parameterize all database queries — never interpolate user input into SQL or NoSQL queries.
- Escape output for the target context (HTML/JS, shell, template, OS call) to prevent injection.

## Secrets & credentials

- Never commit secrets, API keys, tokens, or passwords to the repository or logs.
- Read secrets from environment variables or a secret manager; never hard-code them.
- Do not log sensitive data (PII, tokens, credentials).
- Use the platform's secure credential storage (Keychain, Keystore, OS keyring) — never
  store credentials in plaintext files or in-memory globals.

## Authentication & authorization

- Enforce authorization on every protected endpoint or resource — do not rely on hiding UI.
- Use secure defaults: deny-by-default, least privilege.
- Sessions/tokens: expiry, revocation, and never place credentials in URLs.
- Never trust client-supplied identifiers for authorization decisions (IDOR).

## Data & transport

- Use TLS in production; validate certificates.
- Store passwords with a strong adaptive hash (bcrypt/argon2), never plaintext or fast hashes.
- Encrypt sensitive data at rest with the platform's keychain/keystore-backed encryption.

## Platform sections

Apply the section for the platform you are working on. The dangerous patterns above
apply everywhere; these items are platform-specific.

### Android (Kotlin / Java)

- **Exported components**: `exported="true"` on activities/services/receivers/providers
  exposes them to other apps. Keep components non-exported unless an external entry point
  is required, and set explicit intent filters.
- **Intent redirection**: never pass a received intent's `extras` back into `startActivity`
  / `startService` / `PendingIntent` without validation — a crafted intent can target an
  arbitrary component. Validate `action`, `data`, and `component`.
- **Deep links**: validate `android:path`/`pathPrefix` and the deep-link target; never
  trust URI query data for authorization.
- **Plaintext storage**: don't store credentials, tokens, or PII in SharedPreferences,
  internal files, or the filesystem without encryption. Use Keystore-backed encryption
  (EncryptedSharedPreferences is deprecated but functional).
- **Logging**: `Log.d`/`Log.i` in production can leak tokens and PII into `logcat`.
  Strip or gate debug logging in release builds.
- **Backup**: `android:allowBackup="true"` (default) lets app data flow into cloud
  backups and device-to-device transfer. Set `allowBackup="false"`, or use
  `dataExtractionRules` (Android 12+) to exclude sensitive data.
- **WebView**: `setJavaScriptEnabled(true)` + `addJavascriptInterface` on untrusted
  content = code execution. Load only trusted content, and validate URLs. Disable
  `setAllowFileAccess`, `setAllowContentAccess`, and the `setAllowFileAccessFromFileURLs`
  / `setAllowUniversalAccessFromFileURLs` flags unless the feature genuinely needs them.
- **FileProvider**: a `content://` URI is a grantable capability — over-broad
  `<paths>`/`<root-path>` or unsanitized file names passed to `getUriForFile` can expose
  files outside the intended root. Scope the paths, sanitize names, and grant read/write
  flags explicitly per use.
- **PendingIntent**: create `PendingIntent` with `FLAG_IMMUTABLE`; a mutable PendingIntent
  whose `fillIn` carries attacker data can be redirected to an unintended target.
- **Keystore keys**: generate keys in the Android Keystore (never hard-code or embed a
  master key); use a unique random IV per encryption; don't store a master key in
  SharedPreferences next to the ciphertext.
- **Cleartext traffic**: `usesCleartextTraffic="true"` or a cleartext base URL disables
  the default TLS requirement. Keep cleartext off for any user data.
- **Permissions**: request only what is needed (deny-by-default); dangerous permissions
  must be user-visible and least-privilege.
- **Network security config**: scope trusted certs / domains to what the app actually uses.
- **Deep links / App Links**: prefer `android:autoVerify` App Links over custom schemes —
  custom schemes can be claimed by a competing app. Never trust deep-link data for
  authorization without server-side checks.

### iOS / macOS (Swift / Objective-C)

- **Keychain misuse**: store secrets with `kSecAttrAccessible` set to
  `WhenUnlockedThisDeviceOnly` (or stricter); never `Always`/`kSecAttrAccessibleAlways`.
  Don't store large secrets in Keychain, and don't cache them in memory longer than needed.
- **Data protection**: enable file/data protection; mark sensitive files
  `CompleteFileProtection` or `NSFileProtectionComplete`.
- **ATS (App Transport Security)**: keep `NSAllowsArbitraryLoads` false; scope exceptions
  with justification. Note ATS does not apply to `WKWebView` content — set
  `NSAllowsArbitraryLoadsInWebContent` deliberately and scope it to trusted origins only.
- **Hardened runtime (macOS)**: enable Hardened Runtime for distribution builds; the
  system enforces its restrictions at process launch and it is the core boundary for
  Electron/Tauri-style apps. Add `com.apple.security.cs.disable-library-validation` only
  if the app genuinely needs unvalidated native code — that entitlement *weakens* the
  runtime.
- **Logging**: `print`/`os_log` with default privacy can leak PII; use `.private`/
  redaction or structured logging for sensitive values.
- **Sandbox / entitlements**: keep entitlements (network, keychain-access-groups,
  app-sandbox, camera, etc.) at least privilege; request only what the app needs.
- **Deep links / universal links**: validate `associated-domains` targets; never trust
  URL data for authorization without server-side checks.
- **Keychain sharing**: only share keychain groups that are necessary; a broad
  access-group leaks across apps.
- **Objective-C**: never `performSelector` with attacker-controlled selectors; validate
  `@selector` input.

### Desktop (Windows / macOS / Linux, incl. Electron / Tauri)

- **Electron — isolate renderers**: set `sandbox: true`, `contextIsolation: true`, and
  `nodeIntegration: false` in webPreferences (the Chromium OS-level sandbox is a separate
  flag from context isolation — enable both); keep the preload bridge to a minimal,
  validated API. Never expose a generic IPC channel that passes arbitrary arguments to
  Node.
- **IPC input validation**: validate every IPC message (`ipcMain.on` / `invoke`) —
  treat renderer input as untrusted; type-check and range-check before use.
- **File-system access**: only read/write the paths the app legitimately needs; validate
  resolved paths to prevent traversal when a user-supplied path is involved.
- **Native code**: validate input before passing to FFI / `CommandLine` / native modules —
  classic injection surfaces on the desktop.
- **Permissions**: request OS permissions (camera, microphone, notifications, location)
  only when needed, at the moment of use, and degrade gracefully when denied.
- **Auto-update security**: only download updates over TLS from a pinned, signed URL;
  verify the update package signature before applying.
- **WebView components**: when embedding a web view (Electron, WebView2, WKWebView,
  CEF), keep `nodeIntegration`/`RemoteDebuggingPort` off in production and gate
  navigation to trusted origins.
- **Clipboard / drag-drop**: sanitize pasted/dropped HTML — dragging content into a rich
  editor is a common injection vector on the desktop.
- **External URLs (`shell.openExternal`/`openPath`, Tauri opener)**: never pass
  user-controlled or untrusted URLs to the shell opener — a `file://` or `javascript:`
  value becomes code execution. Validate the scheme (https only) and allow-list hosts
  before opening.
- **Navigation control**: block untrusted navigation — handle `will-navigate`,
  `setWindowOpenHandler`, and `will-attach-webview`; keep `webviewTag: false` unless the
  feature requires it.
- **Tauri**: grant only the capabilities the app needs (v2 capabilities/permissions — no
  blanket `shell`/`fs`/`http` permissions); keep the isolation pattern for remote content;
  configure CSP; the updater signs via public/private key — manage the private key as a
  secret and never commit it.

### Web (browser / frontend / server)

- **DOM XSS sinks**: `dangerouslySetInnerHTML`, `document.write`,
  `innerHTML`/`outerHTML` assignment, `insertAdjacentHTML` — use `textContent` or
  sanitize with an HTML sanitizer (e.g. DOMPurify).
- **External scripts without SRI**: remote `<script src=...>` without
  `integrity=... crossorigin` — add Subresource Integrity.
- **CSRF**: state-changing requests must carry a CSRF token or be SameSite-protected;
  don't rely on `Origin` alone.
- **CSP**: set a restrictive Content-Security-Policy (default-src 'self'; no unsafe-inline/eval unless required and scoped); report violations during rollout.
- **CORS**: allow only the origins the app needs; do not reflect arbitrary `Origin` headers; validate preflight.
- **Cookie flags**: set `HttpOnly`, `Secure`, and `SameSite` on session/auth cookies; never accept auth over insecure contexts.
- **JWT usage**: validate signature and algorithm strictly — never accept `alg: none` or weak algorithms; check issuer/audience/expiry.
- **File uploads**: validate type, size, and content; store outside the web root or serve with a safe Content-Disposition; never execute uploaded files.
- **XSS (stored / reflected / DOM)**: escape on output for HTML/JS context; sanitize
  user content.
- **SSRF / open redirects**: validate URLs against an allow-list before server-side
  fetches or redirects.
- **Path traversal / file inclusion**: resolve and confine paths to the intended root.

## Cross-cutting scan list (all platforms)

Run through this before calling a change done; each item lives in a section above:

- [ ] Injection: SQL/NoSQL (input handling), command injection (dangerous patterns), template injection (escape output)
- [ ] XSS / DOM sinks (Web section) / Electron renderer isolation (Desktop section)
- [ ] CSRF / state-changing requests (Web section)
- [ ] SSRF / open redirects (Web section)
- [ ] Path traversal / file inclusion (Web + Desktop file-system access)
- [ ] Insecure deserialization (dangerous patterns)
- [ ] Insecure direct object references (IDOR) / broken access control (auth section)
- [ ] Authentication bypass (auth section)
- [ ] Secrets exposure (secrets section)
- [ ] Platform-specific items in the section for the target platform
- [ ] Dependency vulnerabilities (run the project's audit tool)

## Review rule

- If you are not sure whether a change introduces a vulnerability, say so explicitly and flag it for review rather than assuming it is safe.

*principle #7 (see `SKILL.md` AI work principles): honest ignorance beats faking
understanding — if unsure, say so and flag it; never assume it is safe.*