import ModalDialog from './ModalDialog'

function ModalDialogDemo() {
  return (
    <div className="modal-demo">
      <ModalDialog
        trigger="Open dialog"
        title="Discard draft?"
        footer={
          <>
            <button type="button" className="modal-demo__button">
              Cancel
            </button>
            <button
              type="button"
              className="modal-demo__button modal-demo__button--primary"
            >
              Discard
            </button>
          </>
        }
      >
        <p>
          Your draft has unsaved changes. Discarding cannot be undone, so
          confirm before continuing.
        </p>
        <label className="modal-demo__field">
          Reason (optional)
          <input type="text" placeholder="Why are you discarding this?" />
        </label>
      </ModalDialog>

      <p className="modal-demo__hint">
        Tab and Shift+Tab cycle inside the dialog, Escape closes it, and focus
        returns to the button that opened it.
      </p>
    </div>
  )
}

export default ModalDialogDemo
