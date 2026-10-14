import Disclosure from './Disclosure'

function DisclosureDemo() {
  return (
    <ul className="faq">
      <li>
        <Disclosure trigger="What is a disclosure widget?">
          <p>
            A single button that shows and hides a related section of content,
            exposing its state so assistive technology can announce whether the
            content is currently expanded or collapsed.
          </p>
        </Disclosure>
      </li>

      <li>
        <Disclosure trigger="How is this one built?" defaultExpanded>
          <p>
            A native <code>&lt;button&gt;</code> with{' '}
            <code>aria-expanded</code> and <code>aria-controls</code>,
            toggling a container that is hidden while collapsed — the W3C ARIA
            Authoring Practices disclosure pattern, with no component library.
          </p>
        </Disclosure>
      </li>

      <li>
        <Disclosure trigger="Can the toggle be disabled?" disabled>
          <p>
            Yes — pass <code>disabled</code> to render a native disabled
            button. The expanded state is still exposed correctly, but nothing
            can activate it.
          </p>
        </Disclosure>
      </li>
    </ul>
  )
}

export default DisclosureDemo
