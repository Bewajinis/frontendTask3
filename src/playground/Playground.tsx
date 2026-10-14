import type { ReactNode } from 'react'
import DisclosureDemo from './DisclosureDemo'
import ModalDialogDemo from './ModalDialogDemo'
import TabsDemo from './TabsDemo'
import './playground.css'

interface Demo {
  id: string
  title: string
  summary: string
  demo?: ReactNode
}

const demos: Demo[] = [
  {
    id: 'modal-dialog',
    title: 'Modal Dialog',
    summary: 'Focus-trapping dialog with Escape to close and focus restoration.',
    demo: <ModalDialogDemo />,
  },
  {
    id: 'tabs',
    title: 'Tabs',
    summary: 'Roving-tabindex tablist with arrow-key navigation and manual activation.',
    demo: <TabsDemo />,
  },
  {
    id: 'disclosure',
    title: 'Disclosure',
    summary: 'Button-controlled expand/collapse region wired with aria-expanded.',
    demo: <DisclosureDemo />,
  },
]

function Playground() {
  return (
    <main className="playground">
      <header className="playground__header">
        <h1>Accessibility Component Playground</h1>
        <p>
          Three components built from scratch, each compared against its
          shadcn/ui counterpart in <code>NOTES.md</code>.
        </p>
      </header>

      <div className="playground__demos">
        {demos.map(({ id, title, summary, demo }) => (
          <section
            key={id}
            className="demo"
            data-demo={id}
            aria-labelledby={`${id}-heading`}
          >
            <h2 id={`${id}-heading`}>{title}</h2>
            <p className="demo__summary">{summary}</p>
            <div
              className={demo ? 'demo__slot demo__slot--filled' : 'demo__slot'}
            >
              {demo ?? (
                <p className="demo__placeholder">
                  Component demo will be rendered here.
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

export default Playground
