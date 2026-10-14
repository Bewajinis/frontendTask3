import { useId, useState, type ReactNode } from 'react'
import './Disclosure.css'

export interface DisclosureProps {
  /**
   * Content of the toggle button. Its text becomes the button's accessible name.
   */
  trigger: ReactNode
  /**
   * Content of the region that the button shows and hides.
   */
  children: ReactNode
  /**
   * Whether the region is expanded on first render.
   *
   * @default false
   */
  defaultExpanded?: boolean
  /**
   * Disables the toggle button.
   *
   * @default false
   */
  disabled?: boolean
  /**
   * Called with the new expanded state whenever the button is activated.
   */
  onExpandedChange?: (expanded: boolean) => void
  /**
   * Extra class names for the root element.
   */
  className?: string
}

/**
 * Disclosure widget following the W3C ARIA Authoring Practices pattern:
 * a native button that toggles a region, exposing its state with
 * `aria-expanded` and pointing at the region with `aria-controls`.
 * Native button semantics give mouse, Enter, and Space activation for free.
 *
 * The panel is a plain container addressed by `aria-controls`, matching the
 * APG's own FAQ disclosure example. It deliberately does not use
 * `role="region"`: that would add a landmark per disclosure, and landmarks
 * whose content appears and disappears tend to clutter landmark navigation
 * for short content. Revisit for substantial, standalone panels.
 */
export function Disclosure({
  trigger,
  children,
  defaultExpanded = false,
  disabled = false,
  onExpandedChange,
  className,
}: DisclosureProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const baseId = useId()
  const triggerId = `${baseId}-trigger`
  const panelId = `${baseId}-panel`

  const handleToggle = () => {
    const next = !expanded
    setExpanded(next)
    onExpandedChange?.(next)
  }

  return (
    <div className={className ? `disclosure ${className}` : 'disclosure'}>
      <button
        type="button"
        id={triggerId}
        className="disclosure__trigger"
        aria-expanded={expanded}
        aria-controls={panelId}
        disabled={disabled}
        onClick={handleToggle}
      >
        <span className="disclosure__icon" aria-hidden="true">
          {expanded ? '\u2212' : '+'}
        </span>
        {trigger}
      </button>

      <div id={panelId} hidden={!expanded} className="disclosure__panel">
        <div className="disclosure__content">{children}</div>
      </div>
    </div>
  )
}

export default Disclosure
