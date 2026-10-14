# Prompts

All prompts used in this session, in order.

## 1. Initial setup

> I'm starting a frontend engineering assignment to build three accessible React components from scratch: a modal dialog, tabs, and a disclosure.
>
> Set up a clean React + TypeScript project using Vite in the current workspace.
>
> Requirements:
>
> - Use React, TypeScript, and Vite.
> - Install the necessary dependencies.
> - Configure ESLint and TypeScript using the standard Vite setup.
> - Create a simple, working development environment.
> - Keep the project structure clean and minimal.
> - Do not install any component libraries yet.
> - Do not build the assignment components yet.
>
> Inspect the current workspace before making changes. Avoid nesting a second project inside the existing folder or overwriting existing files unnecessarily.
>
> Run the development/build checks and fix any setup errors.
>
> When finished, summarize the project structure, dependencies, and commands needed to run the app. Stop before building the components. remove any file or folder in frontendtask3. ensure everything you're doing is inside the folder.

## 2. Linter decision (answered via question prompt)

Question asked:

> The newest Vite react-ts template defaults to oxlint, not ESLint. Which linter setup do you want?

Selected answer:

> **Add ESLint, drop oxlint (Recommended)** — Install ESLint with the standard Vite config (`@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`), remove oxlint/`.oxlintrc.json`. Matches your stated requirement, keeps one linter.

## 3. Prompts file

> Also save all the prompts used in prompts.md file in the root dir

## 4. Project structure for the assignment

> Prepare the existing React + TypeScript project for the accessibility component assignment.
>
> Create a clean structure for:
>
> - `playground/` — my three custom components and their demos.
> - `components/` — shared UI components added later by shadcn/ui.
> - `NOTES.md` — the final comparison notes.
>
> Keep the Vite entry files and configuration in their appropriate locations. Set up basic global styling and a simple playground page that can eventually display all three components.
>
> Do not implement the modal, tabs, or disclosure yet. Do not install shadcn/ui yet.
>
> Ensure TypeScript imports and the development server work correctly. Avoid unnecessary dependencies and abstractions. Stop after preparing the structure.

## 5. Disclosure component

> Build a custom Disclosure component in `src/playground/Disclosure.tsx` using React and TypeScript, without component libraries.
>
> Follow the W3C ARIA Authoring Practices disclosure pattern.
>
> Requirements:
>
> - Use a native button to toggle the content.
> - Support mouse, Enter, and Space activation.
> - Correctly expose expanded/collapsed state using `aria-expanded`.
> - Connect the trigger to the content using `aria-controls`.
> - Support optional initial expanded state through properly typed props.
> - Keep the component reusable and semantic.
>
> Add a working demo to the playground page, with a question and answer that expand and collapse.
>
> Do not use `any`. Do not install additional dependencies. Run TypeScript and lint checks, fix any issues, and stop after completing the disclosure.

## 6. Tabs component

> Build a custom Tabs component in `src/playground/Tabs.tsx` using React and TypeScript, without component libraries.
>
> Follow the W3C ARIA Authoring Practices tabs pattern.
>
> Requirements:
>
> - Support multiple tabs and associated content panels.
> - Use the correct `tablist`, `tab`, and `tabpanel` roles and ARIA attributes.
> - Maintain the selected tab state.
> - Implement arrow-key navigation between tabs, including wrapping at the ends.
> - Support Home and End keys where required by the chosen pattern.
> - Ensure only the appropriate tab is in the normal Tab sequence.
> - Keep keyboard focus and selected state consistent.
> - Use explicit TypeScript prop types without `any`.
>
> Add a working demo with three tabs, each displaying different content.
>
> Choose manual or automatic activation deliberately, following the W3C pattern, and document the choice in a code comment.
>
> Do not install component libraries or modify unrelated project files. Run TypeScript and lint checks, fix issues, and stop after completing tabs.

## 7. Modal dialog component

> Build a custom modal dialog in `src/playground/ModalDialog.tsx` using React and TypeScript, without component libraries.
>
> Follow the W3C ARIA Authoring Practices modal dialog pattern.
>
> Requirements:
>
> - Provide a button that opens the dialog.
> - Use the correct dialog semantics, including `role="dialog"` and `aria-modal="true"`.
> - Give the dialog an accessible name using `aria-labelledby` or an appropriate alternative.
> - Move focus into the dialog when it opens.
> - Trap Tab and Shift+Tab focus within the open dialog.
> - Close the dialog with Escape.
> - Provide a visible close button.
> - Restore focus to the original trigger when the dialog closes.
> - Handle repeated open/close cycles and cleanup correctly.
> - Use React refs and effects appropriately.
> - Use properly typed props and no `any`.
>
> Add a working demo to the playground page.
>
> Do not install component libraries. Do not claim the dialog is accessible until its keyboard behavior has been tested. Run TypeScript and lint checks, fix issues, and stop after completing the modal.

## 8. Accessibility audit

> Audit the three custom components in `src/playground/` against the relevant W3C ARIA Authoring Practices patterns.
>
> Test and review:
>
> - Disclosure: Enter, Space, expanded state, and content association.
> - Tabs: arrow keys, Home/End, Tab behavior, selected state, and panel association.
> - Modal: opening focus, Tab/Shift+Tab trapping, Escape, close button, and focus restoration.
>
> Inspect the actual implementation rather than assuming it is correct.
>
> Fix any keyboard, focus-management, ARIA, semantic HTML, or TypeScript issues found. Keep the custom components independent of component libraries.
>
> Run the available TypeScript, ESLint, and production build checks. Do not use `any` to silence errors.
>
> Provide a concise summary of the changes and any remaining limitations. Do not install shadcn/ui yet.
