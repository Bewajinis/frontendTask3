import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import './ModalDialog.css'

/**
 * Every element that can receive keyboard focus inside the dialog.
 * `[tabindex]` is included here and filtered to exclude `-1` below, since
 * those are programmatically focusable only.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(', ')

function isVisible(element: HTMLElement): boolean {
  return (
    element.offsetWidth > 0 ||
    element.offsetHeight > 0 ||
    element.getClientRects().length > 0
  )
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (element) => element.getAttribute('tabindex') !== '-1' && isVisible(element),
  )
}

export interface ModalDialogProps {
  /**
   * Content of the button that opens the dialog. Its text becomes the
   * button's accessible name.
   */
  trigger: ReactNode
  /**
   * Dialog heading. Rendered as the dialog's accessible name via
   * `aria-labelledby`.
   */
  title: ReactNode
  /**
   * Dialog body content.
   */
  children: ReactNode
  /**
   * Optional footer, typically the dialog's action buttons.
   */
  footer?: ReactNode
  /**
   * Whether the dialog is open on first render.
   *
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Called with the new open state whenever the dialog opens or closes.
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Accessible name for the close button.
   *
   * @default 'Close dialog'
   */
  closeLabel?: string
  /**
   * Extra class names for the dialog element.
   */
  className?: string
}

/**
 * Modal dialog following the W3C ARIA Authoring Practices pattern:
 * `role="dialog"` + `aria-modal="true"`, named by its heading, focus moved
 * into the dialog on open and trapped while it is open, Escape closes, and
 * focus returns to the trigger on close.
 */
export function ModalDialog({
  trigger,
  title,
  children,
  footer,
  defaultOpen = false,
  onOpenChange,
  closeLabel = 'Close dialog',
  className,
}: ModalDialogProps) {
  const [open, setOpen] = useState(defaultOpen)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const baseId = useId()
  const titleId = `${baseId}-title`

  const openDialog = useCallback(() => {
    setOpen(true)
    onOpenChange?.(true)
  }, [onOpenChange])

  const closeDialog = useCallback(() => {
    setOpen(false)
    onOpenChange?.(false)
  }, [onOpenChange])

  // Move focus into the dialog when it opens, lock background scrolling, and
  // restore focus to the trigger (or whatever had focus) on close. Re-runs on
  // every open/close cycle, so repeated open/close is handled and the cleanup
  // always undoes exactly what this pass did.
  useEffect(() => {
    if (!open) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    // Capture the trigger node now; the ref may point elsewhere by cleanup.
    const triggerNode = triggerRef.current
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      const restoreTarget =
        previouslyFocused && previouslyFocused !== document.body
          ? previouslyFocused
          : triggerNode
      restoreTarget?.focus()
    }
  }, [open])

  // Escape closes and Tab/Shift+Tab wrap inside the dialog. A document-level
  // listener so the trap holds no matter where focus currently is.
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeDialog()
        return
      }

      if (event.key !== 'Tab') return

      const dialog = dialogRef.current
      if (!dialog) return

      const focusable = getFocusableElements(dialog)
      const active = document.activeElement

      if (focusable.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const outside = !(active instanceof Node) || !dialog.contains(active)

      if (event.shiftKey) {
        if (outside || active === first || active === dialog) {
          event.preventDefault()
          last.focus()
        }
      } else if (outside || active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, closeDialog])

  const handleBackdropMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    // Cancel mousedown's default focus move. The dialog is unmounted during
    // this event, so the browser's focus fix-up would otherwise target <body>
    // *after* the cleanup below restores focus to the trigger, silently
    // dropping focus to the top of the document.
    event.preventDefault()
    closeDialog()
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className="modal__trigger"
        aria-haspopup="dialog"
        disabled={open}
        onClick={openDialog}
      >
        {trigger}
      </button>

      {open &&
        createPortal(
          <div
            className="modal__backdrop"
            onMouseDown={handleBackdropMouseDown}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              className={className ? `modal__dialog ${className}` : 'modal__dialog'}
            >
              <div className="modal__header">
                <h2 id={titleId} className="modal__title">
                  {title}
                </h2>
                <button
                  type="button"
                  className="modal__close"
                  aria-label={closeLabel}
                  onClick={closeDialog}
                >
                  {'\u00d7'}
                </button>
              </div>

              <div className="modal__body">{children}</div>

              {footer && <div className="modal__footer">{footer}</div>}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

export default ModalDialog
