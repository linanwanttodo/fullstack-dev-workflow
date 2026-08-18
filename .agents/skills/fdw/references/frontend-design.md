# Frontend / UI Design Standards

Applies whenever a task touches UI, frontend code, or user-facing design. Condensed from
the frontend-design, ui-ux-pro-max, and imagegen skill guidance; keep the core intact.

## Process: design plan before code

1. **Ground it in the subject.** Name one concrete subject, its audience, and the
   page's single job. Distinctive choices come from the subject's own world.
2. **Write a compact design plan first**: a token system with 4-6 named colors, type
   roles (a characterful display face used with restraint, a complementary body face, a
   utility face for captions/data), a layout concept, and one signature element — the
   single memorable thing.
3. **Review the plan for genericness before building.** Four looks currently read as
   AI-default rather than choice: (a) warm cream background with high-contrast serif and
   a terracotta accent; (b) near-black background with one acid-green or vermilion
   accent; (c) broadsheet layout with hairline rules and dense newspaper columns;
   (d) the generic purple/violet gradient SaaS hero with a rounded pill CTA and a
   neutral sans (Poppins/Inter). Each is legitimate for some briefs, but they are
   defaults. If the plan reads like one, revise it and state what changed and why.
4. **Re-check the built artifact against the same genericness test** — a look that was
   defensible in a sketch can still land as default when rendered. If a finished page
   reads as one of the four clusters, that is a violation in its own right, not just a
   planning concern.
5. **Then build**, deriving every color and type decision from the approved plan. Do the
   planning and iteration in thinking; only show ideas when confidence is high.

## Forbidden patterns (default, unless the user explicitly requests them)

- **Floating elements** — no gratuitous `position: fixed/absolute` UI or free-floating
  cards; keep elements in the document flow with a clear layout structure.
- **Gradients** — no gradient fills or gradient accents.
- **Emoji** — never emoji as UI icons or decoration; use SVG icons (Heroicons, Lucide,
  Simple Icons).
- **Neon effects** — no glowing, neon, or high-saturation artificial-light effects. This
  includes flat acid colors used decoratively without any glow (acid green, vermilion,
  magenta, electric blue): high-saturation neon-family fills and borders are violations
  on their own, glow or not.
- **Sidebar color-strip message boxes** — no white/pure-color body with a colored strip
  on one side. Use a subtle solid panel or a bordered box instead.
- **Liquid glass / glassmorphism** — no frosted translucent surfaces.
- **Decorative number markers** — no "01/02/03" labels unless the numbering genuinely
  carries order information the reader needs (a real sequence, timeline, or process with
  meaningful ordering). Question the choice before keeping it; if the numbers only
  decorate and the meaning survives without them, remove them. When in doubt, treat as
  decorative and remove.
- **Decorative rules / hairline dividers** — no empty elements used purely as visual
  lines or columns (empty `<p>`, spacer `<div>`, `border-left` shared-rule columns
  outside a genuine newspaper brief). Use a real `<hr>` only where the rule encodes
  structure, or drop the divider. Hairline rules, double rules, and rule-based column
  separators are a broadsheet-family default; they read as AI-generated unless they serve
  the subject.
- **Emoji in content copy** — no emoji as paragraph decoration or filler anywhere in UI
  copy, not just as icons.
- **Animation everywhere** — no scattered effects; one orchestrated moment lands harder
  than many. Extra animation contributes to an AI-generated feel. Respect
  `prefers-reduced-motion`.

## Design principles

- The hero is a thesis: open with the most characteristic thing in the subject's world
  — a headline, an image, an animation, a live demo.
- Typography carries the personality. Pair display and body faces deliberately (not the
  same families used on every project) and set a clear type scale with intentional
  weights, widths, and spacing.
- Structure is information: dividers, labels, and markers should encode something true
  about the content, not decorate it.
- Match complexity to the vision: maximalist directions need elaborate execution;
  minimal directions need precision in spacing, type, and detail.
- Spend boldness in one place: keep everything around the signature element quiet and
  disciplined; cut any decoration that does not serve the brief.

## UX quality floor (non-negotiable)

- **Accessibility**: color contrast >= 4.5:1 for normal text; visible focus states;
  keyboard navigation with tab order matching visual order; semantic markup; alt text
  for meaningful images; every icon-only interactive element — buttons, links, or
  non-semantic clickable elements (div, span, fixed-position FABs) — needs an
  accessible name (aria-label/text), or must be replaced by a real button/link; labels
  bound to inputs; color is never the only indicator; status messages use announce
  semantics (`role="alert"`/`aria-live`) so screen readers hear them.
- **Touch & interaction**: minimum 44x44px touch targets; `cursor-pointer` on clickable
  elements; disable buttons during async operations; error messages near the problem
  and clear.
- **Responsive**: responsive down to mobile; minimum 16px body text on mobile; no
  horizontal scroll; content never hidden behind fixed elements; define a z-index scale.
- **Performance**: 150-300ms transitions using transform/opacity (not width/height);
  skeleton screens or spinners for async content; reserve space to avoid layout jumps;
  lazy-load and optimize images (WebP, srcset — web only).
- **Typography**: line-height 1.5-1.75 for body text; line length limited to 65-75
  characters.
- **State handling**: loading, empty, and error states are part of the design, never an
  afterthought.

## UI copy

- Copy is design material. Name things by what people control and recognize, never by
  how the system is built. Use active voice: "Save changes", not "Submit". Keep the same
  verb through a whole flow (a "Publish" button produces a "Published" toast).
- Failure and emptiness are direction, not mood: explain what went wrong and how to fix
  it, in the interface's voice. Errors don't apologize and are never vague about what
  happened.

## When to generate images (vs code-native)

- Prefer code-native output for icons, logos, diagrams, wireframes, and UI graphics
  (SVG, HTML/CSS, canvas) so they match existing repo assets.
- Use image generation only for true raster assets: photos, illustrations, product
  mockups, hero images, textures, sprites.
- For edits, preserve invariants aggressively and save non-destructively: change only
  what was requested, keep everything else unchanged.