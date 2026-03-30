# Repository Guidelines

## Project Snapshot
- This repo is a single-package Nuxt 3 application.
- Use `npm`; the repo has `package-lock.json` and `.npmrc`.
- The Nuxt source directory is `app/` (`nuxt.config.ts`).
- Quest data is generated into `support/quest-browser/quests.json`.
- `support/tools/build-quest-site.mjs` is part of the normal dev/build flow.

## Source Of Truth
- Runtime scripts: `package.json`
- Nuxt config: `nuxt.config.ts`
- Global styles: `app/assets/css/main.css`
- Main page: `app/pages/index.vue`
- Core logic: `app/composables/useQuestBrowser.ts`
- Shared types: `app/types/quest.ts`
- Active API handler: `app/server/api/quests.get.ts`
- Data generator: `support/tools/build-quest-site.mjs`

## Cursor And Copilot Rules
- No `.cursorrules` file was found.
- No `.cursor/rules/` directory was found.
- No `.github/copilot-instructions.md` file was found.
- Do not invent extra repo rules that are not present on disk.

## Install And Run
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Preview production build: `npm run preview`
- Regenerate quest data manually: `node support/tools/build-quest-site.mjs`
- `npm run dev` runs `predev` first.
- `npm run build` runs `prebuild` first.
- Both `predev` and `prebuild` regenerate quest data.

## Command Notes
- Dev and preview bind to `0.0.0.0:3000`.
- If UI data is missing, regenerate `support/quest-browser/quests.json` first.
- Do not assume hidden npm scripts exist beyond those in `package.json`.
- Prefer repo scripts over raw framework commands when both exist.

## Lint, Typecheck, And Test Status
- There is no official `lint` script.
- There is no official `typecheck` script.
- There is no official `test` script.
- No root-level project config for Vitest, Jest, or Playwright was found.
- Do not claim lint/tests passed unless you actually added and ran that tooling.

## Single Test Execution
- There is no supported single-test command today.
- No project-owned `*.test.*` or `*.spec.*` files were found under app/source code.
- Test matches found in `node_modules/` are irrelevant to this repo.
- If tests are added later, update this file with the exact single-test command.

## Repository Structure
- `app/`: Nuxt app code
- `app/components/quest/`: quest UI components
- `app/composables/`: reusable stateful logic
- `app/types/`: shared TypeScript interfaces
- `app/assets/css/`: global CSS variables and shared UI primitives
- `server/api/`: server handlers used by the app
- `support/tools/`: Node scripts for data generation
- `support/quest-browser/`: generated assets and legacy/plain JS output
- `support/config/ftbquests/quests/`: upstream quest source data

## Working Agreement For Agents
- Prefer small, local changes over broad refactors.
- Preserve directory-specific style instead of normalizing the whole repo.
- Do not add new tooling unless the task explicitly asks for it.
- Treat generated quest data as output, not hand-maintained source.
- If a change touches quest shape or search behavior, inspect both app code and generator code.

## Style Zones
- `app/**`, `server/**`, and `nuxt.config.ts` use TypeScript-first Nuxt style.
- `support/tools/**` and legacy `support/quest-browser/**` use plain JavaScript style with semicolons.
- Match the surrounding file's conventions.
- Do not reformat one style zone to look like the other.

## Imports
- Use ESM imports.
- Use `import type` for type-only imports.
- Keep runtime imports separate from type imports when practical.
- In Vue/TS files, framework imports usually come before project imports.
- Prefer direct imports from `~/types/quest` instead of adding barrels.

## Formatting
- In app/server TypeScript, use 2-space indentation.
- In app/server TypeScript, use single quotes.
- In app/server TypeScript, do not add semicolons unless the file already uses them.
- Multi-line objects and calls may keep trailing commas.
- In templates, break long attribute lists across lines for readability.
- Keep CSS class names in kebab-case.
- In `support/tools/**` and `support/quest-browser/**`, preserve semicolons.
- Keep Node scripts imperative and explicit.

## Vue And Nuxt Conventions
- Use `script setup lang="ts"` for Vue SFCs.
- Prefer Composition API patterns already present in the repo.
- Keep page-level fetching in pages, not leaf components.
- Put reusable UI state and derived data in composables.
- Follow established Nuxt usage such as `useFetch`, `useRoute`, `useRouter`, and `useSeoMeta`.
- Keep template structure readable rather than overly compressed.

## Types, Naming, And State
- Reuse interfaces from `app/types/quest.ts` before inventing new shapes.
- Prefer explicit business interfaces such as `QuestDataset`, `QuestRecord`, and `QuestFilters`.
- Use explicit generics where they clarify data flow.
- Never use `any`, `as any`, `@ts-ignore`, or `@ts-expect-error`.
- Component filenames use PascalCase.
- Composables use the `useXxx` naming pattern.
- Local variables and functions use camelCase.
- CSS classes use kebab-case.
- Keep filter state grouped in a reactive object when extending existing files.
- Return composable state and actions from one clear object.
- Do not introduce Pinia casually; no active store pattern is established here.

## Error Handling
- In server handlers, wrap filesystem/parsing work in `try/catch`.
- On server failures, log with `console.error(error)` before throwing.
- Surface API failures with `createError({ statusCode, statusMessage })`.
- In scripts, throw explicit `Error` objects with actionable messages.
- Do not swallow errors silently.
- Keep maintainer-facing error messages concrete.

## Data And Search Logic
- Preserve the existing text normalization behavior for search.
- Current matching normalizes with `NFKC`, lowercases, collapses whitespace, and trims.
- Keep filtering deterministic and easy to trace.
- Preserve locale-aware sorting with `localeCompare(..., 'zh-Hans-CN')` where already used.
- If you change quest data shape, update generator, shared types, and consumers together.
- Fix root data issues upstream instead of masking them in the UI.

## UI And Content
- Reuse CSS variables from `app/assets/css/main.css`.
- Reuse existing shared patterns such as `panel-card`, `ghost-button`, `mini-button`, and chip styles.
- Keep the established visual direction: dark surfaces, Chinese font pairing, gold/teal accents.
- Preserve responsive behavior with explicit media queries when editing layouts.
- Product-facing copy is Chinese; keep new strings aligned with the current tone.
- Keep added comments short, useful, and in Chinese.

## API And Validation
- The main API reads `support/quest-browser/quests.json` from disk.
- Current build output resolves `/api/quests` from `app/server/api/quests.get.ts`.
- Before debugging frontend data bugs, confirm the JSON was regenerated.
- The most reliable existing verification commands are `npm run dev` and `npm run build`.
- Because there is no official lint/test pipeline, state clearly what you verified and what you could not verify.
- If you add tooling or scripts, update this file in the same change.

## Watchouts
- `support/quest-browser/` contains generated output; inspect carefully before editing.
- Many runtime issues can originate in `support/config/ftbquests/quests/` or `support/tools/build-quest-site.mjs`.
- There are currently duplicate quest API handlers in `app/server/api/quests.get.ts` and `server/api/quests.get.ts`.
- Treat `app/server/api/quests.get.ts` as the active handler unless a fresh build proves otherwise.
- Do not assume monorepo patterns; this repo is currently a single app.

## Quick Decision Guide
- Change filtering, route sync, or results logic: start with `app/composables/useQuestBrowser.ts`.
- Change displayed quest fields or card layout: inspect `app/components/quest/`.
- Change schema or metadata shape: inspect `app/types/quest.ts` and `support/tools/build-quest-site.mjs` together.
- Fix missing runtime data: regenerate quest data, then inspect `app/server/api/quests.get.ts` first.
- Need a command for lint, typecheck, or tests: verify it exists before telling another agent to run it.
