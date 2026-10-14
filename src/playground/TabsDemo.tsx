import Tabs, { type TabItem } from './Tabs'

const tabs: TabItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <p>
        A set of layered panels, where only the selected panel is shown. The
        selected tab, its panel, and the tablist are wired together with
        <code> aria-controls</code> and <code>aria-labelledby</code>.
      </p>
    ),
  },
  {
    id: 'keyboard',
    label: 'Keyboard',
    content: (
      <>
        <p>Manual activation: arrows move focus, Enter or Space selects.</p>
        <ul>
          <li>
            <code>Left</code> / <code>Right</code> — move focus, wrapping at
            both ends
          </li>
          <li>
            <code>Home</code> / <code>End</code> — move focus to the first /
            last enabled tab
          </li>
          <li>
            <code>Enter</code> / <code>Space</code> — select the focused tab
          </li>
          <li>
            <code>Tab</code> — leaves the tablist and enters the selected
            panel
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'aria',
    label: 'ARIA',
    content: (
      <ul>
        <li>
          <code>role=&quot;tablist&quot;</code> on the container, named by its{' '}
          <code>aria-label</code>
        </li>
        <li>
          <code>role=&quot;tab&quot;</code> + <code>aria-selected</code> on
          each button
        </li>
        <li>
          <code>role=&quot;tabpanel&quot;</code>, focusable and labelled by its
          tab
        </li>
        <li>Only the active tab is in the page Tab sequence</li>
      </ul>
    ),
  },
]

function TabsDemo() {
  return <Tabs tabs={tabs} label="Component documentation" />
}

export default TabsDemo
