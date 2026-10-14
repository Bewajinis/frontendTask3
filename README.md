# Accessibility Component Playground

React + TypeScript + Vite project for the accessibility component assignment:
a modal dialog, tabs, and a disclosure — each built from scratch and compared
against its shadcn/ui counterpart.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server (http://localhost:5173) |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## Structure

```
NOTES.md               # final custom vs. shadcn/ui comparison notes
src/
  main.tsx             # Vite entry point
  App.tsx              # renders the playground page
  index.css            # global styles
  playground/          # the three components + their demos
  components/          # shared UI, added later by shadcn/ui
public/                # static assets
vite.config.ts         # Vite config
tsconfig*.json         # TypeScript project references
eslint.config.js       # ESLint flat config (standard Vite react-ts setup)
```

## Stack

- React 19, TypeScript 6, Vite 8
- ESLint 10 + `typescript-eslint` + `eslint-plugin-react-hooks` +
  `eslint-plugin-react-refresh`
- No component libraries installed yet
