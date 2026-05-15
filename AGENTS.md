# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React 19 + TypeScript image playground. Application code lives in `src/`: `components/` contains UI components, `hooks/` contains reusable React hooks, and `lib/` contains API clients, image utilities, viewport logic, database helpers, and compatibility code. State is centralized in `src/store.ts`, with shared types in `src/types.ts`. Tests are colocated with source files as `*.test.ts` under `src/` and `src/lib/`. Static PWA assets live in `public/`, screenshots and documentation assets in `docs/images/`, and deployment files in `deploy/`.

## Build, Test, and Development Commands

- `npm install` or `npm ci`: install dependencies; use `npm ci` in automation.
- `npm run dev`: start the Vite development server.
- `npm run build`: run TypeScript project checks and produce the static build in `dist/`.
- `npm run preview`: preview the built app locally.
- `npm test`: run the Vitest suite once.
- `npm run test:watch`: run Vitest in watch mode during development.

For optional local API proxy testing, copy `dev-proxy.config.example.json` to `dev-proxy.config.json`, edit the target, then restart `npm run dev`.

## Coding Style & Naming Conventions

Use TypeScript with strict compiler settings. Match the existing style: two-space indentation, single quotes, no semicolons, and trailing commas in multiline literals. React components use PascalCase filenames such as `TaskCard.tsx`; hooks use `useXxx.ts`; general utilities use camelCase filenames such as `maskPreprocess.ts`. Prefer small, focused modules in `src/lib/` for API and data transformations, and keep browser UI behavior inside components or hooks.

## Testing Guidelines

Vitest is the test runner. Add or update colocated `*.test.ts` files for changes to API handling, parameter compatibility, masks, viewport transforms, persistence, and proxy behavior. Keep tests deterministic; mock browser APIs or network boundaries rather than calling external services. Run `npm test` before submitting changes and `npm run build` when TypeScript or Vite configuration is affected.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit-style prefixes such as `feat:`, `fix:`, `docs:`, `refactor:`, and `release:`. Keep messages imperative and scoped to one change. Pull requests should include a concise description, test results, linked issues when applicable, and screenshots or screen recordings for UI-visible changes. Note any deployment, Docker, Vercel, or environment variable impact.

## Security & Configuration Tips

Do not commit API keys, `.env.local`, or local proxy targets containing credentials. Keep default examples generic, and document new public environment variables in `README.md` when behavior changes.
