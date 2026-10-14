# Comparison Notes

Final comparison of the hand-built components against their shadcn/ui
counterparts. Fill this in as each component is completed.

## How to use

For each component, document the same five areas so the entries stay
comparable:

1. **Behavior** — what the component actually does.
2. **Accessibility** — keyboard map, ARIA attributes, focus management, screen
   reader announcements.
3. **Implementation notes** — hooks, refs, portals, and any tricky parts.
4. **shadcn/ui comparison** — what the library version does differently.
5. **Verdict** — what is better in each version and what was learned.

---

## Modal Dialog

| Area | Custom | shadcn/ui |
| --- | --- | --- |
| Behavior | `open` state in the component; portal to `document.body`; backdrop click and Escape close | Base UI `Dialog.Root` owns state; `DialogPortal` renders `InternalBackdrop` when `modal` |
| Keyboard | Document-level `keydown`: Escape closes, Tab/Shift+Tab wrap inside the dialog | `useDismiss`: Escape closes with an IME composition guard; Tab handled by Base UI's internal focus trap |
| ARIA | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` → heading | Popup renders `role` (default `dialog`), `aria-labelledby`, `aria-describedby` — **no `aria-modal`** (verified in `@base-ui/react/dialog/popup`) |
| Focus management | Focuses the dialog container (`tabIndex={-1}`); restores to previously focused element, falling back to the trigger | Focuses the **first tabbable element** inside the popup by default (popup itself on touch, to avoid the virtual keyboard); `initialFocus`/`finalFocus` props override; restore targets trigger or previously focused element |
| Bundle / dependencies | Zero dependencies (`react`, `react-dom` only) | `@base-ui/react` (+ `@base-ui/utils`, `@floating-ui/*`, `use-sync-external-store`) and `lucide-react` for the close icon |

### Notes

- **Verified gap 1 — `aria-modal`:** the custom dialog sets `aria-modal="true"`;
  the generated shadcn/Base UI popup does not emit it (grep of
  `node_modules/@base-ui/react/dialog` only finds `aria-labelledby`,
  `aria-describedby`, `role`). For `role="dialog"` the ARIA APG recommends
  `aria-modal="true"` so AT knows background content is inert. Base UI instead
  blocks interaction with an internal backdrop element.
- **Verified gap 2 — initial focus target:** the custom dialog focuses the
  dialog container itself, so screen readers announce the `aria-labelledby`
  title first. Base UI's default (`createDefaultInitialFocus`) moves focus to
  the **first tabbable element** (the close button in the generated
  `DialogContent`), which announces the close button first unless the consumer
  passes `initialFocus`. Both restore focus on close; the custom version
  hardcodes the fallback, Base UI exposes `finalFocus`.
- **Verified gap 3 — scroll lock:** the custom dialog toggles
  `document.body.style.overflow` and restores the previous value on cleanup.
  No body-overflow scroll locking exists anywhere in `@base-ui/react` (grep
  confirms), so background scrolling is not locked by the generated shadcn
  dialog.
- The custom backdrop handler calls `preventDefault()` on `mousedown` to stop
  the browser's focus fix-up from stealing focus back to `<body>` after the
  dialog unmounts — a subtle bug the library avoids by unmounting asynchronously.
- The custom trigger is `disabled` while the dialog is open; Base UI keeps the
  trigger active and manages re-entry itself.

### Verdict

The custom dialog's `aria-modal` and title-first initial focus are arguably
more spec-aligned out of the box; the library wins on IME-safe Escape,
configurable `initialFocus`/`finalFocus`, outside-press handling across input
types, and transition support.

---

## Tabs

| Area | Custom | shadcn/ui |
| --- | --- | --- |
| Behavior | Controlled selection state; all panels stay mounted and are toggled with `hidden` | Base UI `Tabs.Root`; inactive panels **unmounted by default** (`keepMounted = false`), kept only if `keepMounted` is set |
| Keyboard | Manual activation: Left/Right wrap, Home/End jump, Enter/Space select; disabled tabs skipped | Manual by default too (`activateOnFocus` defaults `false`); `loopFocus` defaults `true` (wrapping); Enter/Space activate |
| ARIA | `role="tablist"` + `aria-label`, `role="tab"` + `aria-selected` + `aria-controls`, `role="tabpanel"` + `aria-labelledby` | Same roles via Base UI primitives; selected state additionally exposed as `data-active` attribute for styling |
| Focus management | Roving tabindex computed from `focusedId ?? selectedId`; resets when focus leaves the tablist | Roving tabindex maintained internally by Base UI; panels get `tabIndex: open ? 0 : -1` (custom sets `tabIndex={0}` on **all** panels, hidden ones included) |
| Bundle / dependencies | Zero dependencies | Same Base UI stack as Dialog + `class-variance-authority` for the variant API |

### Notes

- **Verified gap 1 — panel mounting:** Base UI's `TabsPanel` defaults
  `keepMounted = false`, so hidden panels are removed from the DOM. The custom
  component keeps every panel mounted and flips the `hidden` attribute. Keeping
  panels mounted preserves internal state (e.g. a form half-filled in a
  background panel); unmounting avoids rendering cost for large panels.
- **Verified gap 2 — panel tabindex:** the custom panels all get
  `tabIndex={0}`, so when a panel is focused and the user presses Tab twice
  they could in principle reach a `hidden` panel's tab stop in browsers that
  ignore `hidden` for focusability quirks (defense-in-depth is the `hidden`
  attribute itself). Base UI sets `tabIndex: open ? 0 : -1`, matching the APG
  recommendation that only the **active** panel be in the page Tab sequence
  exactly.
- **Verified gap 3 — activation options:** Base UI offers an `activateOnFocus`
  prop to switch to automatic activation (arrow key both moves focus and
  selects, as in the APG example for tabs with instant panel swaps). The custom
  component intentionally implements only manual activation and documents why
  in `Tabs.tsx`.
- The custom `onTabChange(id)` callback is simpler than Base UI's
  `onValueChange(value, eventDetails)` which also passes the event and a change
  reason (`interacted`, `initial`, `disabled`, `missing`).

### Verdict

Both implement manual-activation APG tabs; the library adds configurable
activation and leaner DOM (unmounted panels), while the custom version keeps
panel state alive and has zero dependencies. The custom panel `tabIndex={0}`
on hidden panels is the one place the hand-built version is less precise than
the library.

---

## Disclosure

| Area | Custom | shadcn/ui |
| --- | --- | --- |
| Behavior | | |
| Keyboard | | |
| ARIA | | |
| Focus management | | |
| Bundle / dependencies | | |

### Notes

- The assignment only required installing the shadcn **Dialog** and **Tabs**
  components, so no shadcn/ui counterpart for the Disclosure was installed
  (the nearest shadcn component would be `Collapsible`/`Accordion`). The custom
  Disclosure follows the APG FAQ disclosure pattern with a native button,
  `aria-expanded`, and `aria-controls`; see `scripts/a11y-check.tsx` for the
  automated structural assertions.

---

## Overall takeaways

- `shadcn init` **replaces same-named CSS variables in `:root`**. The custom
  playground tokens `--muted`, `--border`, and `--accent` were overwritten with
  shadcn's oklch values and had to be restored; shadcn's own tokens now live
  under different names (`--muted-foreground`, `--input`, `--ring`, …) except
  for the three restored ones, which shadcn components will read as the
  playground's original colors.
- Tailwind preflight resets heading font sizes/weights and list bullets; the
  playground opted back in explicitly (`h1`–`h3` sizes in `index.css`,
  `list-style: disc` for demo lists in `Tabs.css`).
- Base UI (the library behind this shadcn "base" style) is more configurable
  (`initialFocus`, `finalFocus`, `activateOnFocus`, `keepMounted`, `loopFocus`)
  but ships different defaults than the APG examples: first-tabbable initial
  focus, no `aria-modal`, no scroll lock, unmounted inactive panels.
- The hand-built components are dependency-free and fully explicit, which made
  every ARIA wiring decision auditable in the source — the shadcn equivalents
  delegate those decisions to Base UI's internals.
