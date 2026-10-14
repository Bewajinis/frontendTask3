import {
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import './Tabs.css'

export interface TabItem {
  /** Unique, stable id. Used for focus management and ARIA wiring. */
  id: string
  /** Tab label. Becomes the tab's accessible name. */
  label: ReactNode
  /** Content of the panel associated with this tab. */
  content: ReactNode
  /**
   * Disables the tab. Disabled tabs are skipped by arrow-key navigation.
   *
   * @default false
   */
  disabled?: boolean
}

export interface TabsProps {
  /**
   * The tabs, in visual order, each with its panel content.
   *
   * Selection is initialised once from this value (like `defaultTabId`); to
   * swap the whole tab set at runtime, remount the component with a new `key`.
   */
  tabs: TabItem[]
  /**
   * Tab selected on first render. Falls back to the first enabled tab.
   */
  defaultTabId?: string
  /**
   * Accessible name for the tablist, e.g. "Formatting options".
   */
  label?: string
  /**
   * Called with the newly selected tab id whenever the selection changes.
   */
  onTabChange?: (id: string) => void
  /**
   * Extra class names for the root element.
   */
  className?: string
}

function getInitialTabId(
  tabs: TabItem[],
  defaultTabId?: string,
): string | undefined {
  if (
    defaultTabId &&
    tabs.some((tab) => tab.id === defaultTabId && !tab.disabled)
  ) {
    return defaultTabId
  }
  return tabs.find((tab) => !tab.disabled)?.id
}

/**
 * Tabs following the W3C ARIA Authoring Practices pattern.
 *
 * Activation: MANUAL (deliberate choice).
 *
 * The APG defines two activation styles. This component uses manual
 * activation, where Left/Right arrows and Home/End move keyboard focus
 * between tabs and Enter or Space selects the focused tab:
 *
 * - It is the safer of the two styles, so the behaviour stays correct even
 *   when a panel's content is slow to load or expensive to render — arrowing
 *   through tabs never triggers side effects.
 * - Selecting only on explicit activation means screen-magnifier and
 *   screen-reader users do not get content swapped out from under them while
 *   they are simply exploring the tablist.
 * - It still satisfies the APG: every key it requires is implemented, focus
 *   movement wraps at both ends, and only one tab is in the page Tab
 *   sequence (roving tabindex).
 *
 * Automatic activation (arrow keys select immediately) would be the better
 * choice for a tablist whose panels are guaranteed instant to display.
 */
export function Tabs({
  tabs,
  defaultTabId,
  label,
  onTabChange,
  className,
}: TabsProps) {
  const baseId = useId()
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())
  const [selectedId, setSelectedId] = useState<string | undefined>(() =>
    getInitialTabId(tabs, defaultTabId),
  )
  // Tracks focus *inside* the tablist so the roving tabindex follows keyboard
  // focus, and falls back to the selected tab once focus leaves the tablist.
  const [focusedId, setFocusedId] = useState<string | null>(null)

  if (tabs.length === 0) {
    return null
  }

  const tabbableId = focusedId ?? selectedId
  const enabledTabs = tabs.filter((tab) => !tab.disabled)

  const select = (id: string) => {
    if (id === selectedId) return
    setSelectedId(id)
    onTabChange?.(id)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (enabledTabs.length === 0) return

    const activeId = focusedId ?? selectedId
    const currentIndex = Math.max(
      0,
      enabledTabs.findIndex((tab) => tab.id === activeId),
    )

    let nextIndex: number

    switch (event.key) {
      // Horizontal tablist, per the APG: Left/Right move, Home/End jump.
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % enabledTabs.length
        break
      case 'ArrowLeft':
        nextIndex =
          (currentIndex - 1 + enabledTabs.length) % enabledTabs.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = enabledTabs.length - 1
        break
      default:
        return
    }

    event.preventDefault()
    const nextTab = enabledTabs[nextIndex]
    setFocusedId(nextTab.id)
    tabRefs.current.get(nextTab.id)?.focus()
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocusedId(null)
    }
  }

  const tabId = (id: string) => `${baseId}-tab-${id}`
  const panelId = (id: string) => `${baseId}-panel-${id}`

  return (
    <div className={className ? `tabs ${className}` : 'tabs'}>
      <div
        role="tablist"
        aria-label={label}
        className="tabs__list"
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      >
        {tabs.map((tab) => {
          const selected = tab.id === selectedId

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={selected}
              aria-controls={panelId(tab.id)}
              tabIndex={tab.id === tabbableId ? 0 : -1}
              disabled={tab.disabled}
              className="tabs__tab"
              data-tab={tab.id}
              ref={(node) => {
                if (node) {
                  tabRefs.current.set(tab.id, node)
                } else {
                  tabRefs.current.delete(tab.id)
                }
              }}
              onFocus={() => setFocusedId(tab.id)}
              onClick={() => select(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={panelId(tab.id)}
          aria-labelledby={tabId(tab.id)}
          hidden={tab.id !== selectedId}
          // Keeps the panel reachable when its content has no focusable
          // elements, as recommended by the APG.
          tabIndex={0}
          className="tabs__panel"
          data-tab={tab.id}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}

export default Tabs
