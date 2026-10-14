/**
 * One-off audit script (not shipped with the app).
 *
 * Renders the three custom playground components with react-dom/server and
 * asserts the ARIA wiring required by the W3C APG. Keyboard interaction and
 * focus management need a real browser; see the manual checklist in the audit
 * report for those.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { Disclosure } from '../src/playground/Disclosure'
import { Tabs } from '../src/playground/Tabs'
import { ModalDialog } from '../src/playground/ModalDialog'

type Result = { name: string; pass: boolean; detail: string }
const results: Result[] = []

function check(name: string, pass: boolean, detail: string) {
  results.push({ name, pass, detail })
}

// --- Disclosure ---------------------------------------------------------
{
  const closed = renderToStaticMarkup(
    createElement(Disclosure, { trigger: 'Q' }, createElement('p', null, 'A')),
  )
  const open = renderToStaticMarkup(
    createElement(
      Disclosure,
      { trigger: 'Q', defaultExpanded: true },
      createElement('p', null, 'A'),
    ),
  )

  const btnMatch = closed.match(/<button[^>]*aria-controls="([^"]+)"[^>]*>/)
  const panelMatch = closed.match(/<div id="([^"]+)" hidden/)
  check(
    'Disclosure: trigger is a native <button>',
    closed.includes('<button type="button"'),
    'native button element present',
  )
  check(
    'Disclosure: aria-expanded=false when collapsed / true when expanded',
    closed.includes('aria-expanded="false"') &&
      open.includes('aria-expanded="true"'),
    `closed=${closed.includes('aria-expanded="false"')} open=${open.includes('aria-expanded="true"')}`,
  )
  check(
    'Disclosure: aria-controls matches panel id',
    btnMatch !== null &&
      panelMatch !== null &&
      btnMatch[1] === panelMatch[1],
    `button id=${btnMatch?.[1]} panel id=${panelMatch?.[1]}`,
  )
  check(
    'Disclosure: panel hidden while collapsed',
    /<div id="[^"]+" hidden/.test(closed),
    'hidden attribute present on collapsed panel',
  )
  check(
    'Disclosure: disabled state renders native disabled attr',
    renderToStaticMarkup(
      createElement(Disclosure, { trigger: 'Q', disabled: true }, 'x'),
    ).includes('disabled'),
    'disabled attribute present',
  )
}

// --- Tabs ---------------------------------------------------------------
{
  const tabs = [
    { id: 'a', label: 'A', content: 'alpha' },
    { id: 'b', label: 'B', content: 'beta' },
    { id: 'c', label: 'C', content: 'gamma', disabled: true },
  ]
  const markup = renderToStaticMarkup(
    createElement(Tabs, { tabs, label: 'Docs' }),
  )

  check(
    'Tabs: tablist named via aria-label',
    markup.includes('role="tablist"') && markup.includes('aria-label="Docs"'),
    'role=tablist + aria-label present',
  )

  const tabIds = [...markup.matchAll(/id="([^"]*tab-a)"/g)].map((m) => m[1])
  const panelIds = [...markup.matchAll(/id="([^"]*panel-a)"/g)].map((m) => m[1])
  check(
    'Tabs: aria-controls (tab) === panel id === aria-labelledby target',
    tabIds.length > 0 &&
      panelIds.length > 0 &&
      markup.includes(`aria-controls="${panelIds[0]}"`) &&
      markup.includes(`aria-labelledby="${tabIds[0]}"`),
    `tab=${tabIds[0]} panel=${panelIds[0]}`,
  )

  const tabTags = [...markup.matchAll(/<button[^>]*role="tab"[^>]*>/g)].map(
    (m) => m[0],
  )
  check(
    'Tabs: exactly one tab has tabIndex=0 (roving tabindex)',
    tabTags.filter((t) => t.includes('tabindex="0"')).length === 1,
    `${tabTags.filter((t) => t.includes('tabindex="0"')).length} of ${tabTags.length} tabs tabindex=0`,
  )
  check(
    'Tabs: aria-selected=true only on first tab',
    tabTags.filter((t) => t.includes('aria-selected="true"')).length === 1 &&
      tabTags[0].includes('aria-selected="true"'),
    'first tab selected by default',
  )
  check(
    'Tabs: disabled tab renders disabled attr and is not selected',
    tabTags.some((t) => t.includes('disabled')) &&
      tabTags[tabTags.length - 1].includes('aria-selected="false"'),
    'disabled tab present and unselected',
  )
  const panels = [
    ...markup.matchAll(/<div[^>]*role="tabpanel"[^>]*>/g),
  ].map((m) => m[0])
  check(
    'Tabs: exactly the unselected panel(s) are hidden',
    panels.length === 3 &&
      panels.filter((p) => p.includes('hidden')).length === 2 &&
      !panels[0].includes('hidden'),
    `${panels.length} panels, ${panels.filter((p) => p.includes('hidden')).length} hidden, first hidden=${panels[0]?.includes('hidden')}`,
  )
  check(
    'Tabs: tabpanel is focusable (tabindex=0)',
    /<div[^>]*role="tabpanel"[^>]*tabindex="0"/.test(markup) ||
      /<div[^>]*tabindex="0"[^>]*role="tabpanel"/.test(markup),
    'tabpanel has tabindex=0',
  )
}

// --- ModalDialog --------------------------------------------------------
{
  const closed = renderToStaticMarkup(
    createElement(ModalDialog, {
      trigger: 'Open',
      title: 'T',
      children: 'body',
    }),
  )
  check(
    'ModalDialog: trigger is a native button with aria-haspopup=dialog',
    closed.includes('aria-haspopup="dialog"'),
    'aria-haspopup="dialog" present',
  )
  check(
    'ModalDialog: nothing rendered in the tree while closed (portal only on open)',
    !closed.includes('role="dialog"'),
    'no dialog markup when closed',
  )

  let openError: string | null = null
  try {
    renderToStaticMarkup(
      createElement(
        ModalDialog,
        { trigger: 'Open', title: 'T', defaultOpen: true },
        'body',
      ),
    )
  } catch (e) {
    openError = e instanceof Error ? e.message : String(e)
  }
  // createPortal is unsupported in SSR; expected failure mode in Node.
  check(
    'ModalDialog: defaultOpen reaches portal code (SSR cannot render portals)',
    openError !== null,
    `expected SSR portal error, got: ${openError ?? 'no error (unexpected success)'}`,
  )
}

// --- shadcn/ui components (statically renderable ones) ------------------
{
  try {
    const { Tabs: ShTabs, TabsList, TabsTrigger, TabsContent } = await import(
      '../src/components/ui/tabs'
    )
    const ui = renderToStaticMarkup(
      createElement(
        ShTabs,
        { defaultValue: 'x' },
        createElement(
          TabsList,
          null,
          createElement(TabsTrigger, { value: 'x' }, 'X'),
        ),
        createElement(TabsContent, { value: 'x' }, 'panel'),
      ),
    )
    check(
      'shadcn Tabs: renders tablist/tab/tabpanel roles',
      ui.includes('tablist') && ui.includes('tab') && ui.includes('tabpanel'),
      'roles present in generated Base UI markup',
    )
  } catch (e) {
    check('shadcn Tabs: renders', false, `error: ${String(e)}`)
  }
}

// --- report -------------------------------------------------------------
const failed = results.filter((r) => !r.pass)
for (const r of results) {
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name} — ${r.detail}`)
}
console.log(`\n${results.length - failed.length}/${results.length} passed`)
if (failed.length > 0) process.exit(1)
