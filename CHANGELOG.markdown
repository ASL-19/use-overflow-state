# @asl-19/use-overflow-state changelog

## 1.1.0 [2026-10-16]

- Clear the pending throttled update on unmount, so the hook no longer reads the scrollable element or updates state after the component unmounts
- Narrow `react` and `react-dom` peer dependency ranges from `>=19.0.0` to `^19.0.0`
- Add parameter and return value descriptions to type declarations

Development tooling:

- Replace API Extractor and API Documenter with TypeDoc
- Add Vitest tests (happy-dom, React Testing Library)
- Remove package-changed and npm-check-updates, and add `outdated` scripts
- Add publint, Are the Types Wrong? (`attw`) and a docs freshness check to `lint-test`
- Manage Node.js 24 and pinact with mise, replacing `.node-version`
- Add npm supply-chain gates (`.npmrc`, `devEngines`, `allowScripts`)
- Update TypeScript to 6.0, ESLint to 10, @asl-19/eslint-config to 1.0 and Prettier to 3.9, and compile with `module: "nodenext"`
- Pin GitHub Actions to commit SHAs, limit the workflow token to read-only, and run CI on pull requests
- Add agent instructions (`AGENTS.md`) and Claude Code permission settings

## [1.0.0](https://github.com/ASL-19/use-overflow-state/pulls?q=is%3Aclosed+is%3Apr+milestone%3A1.0.0) [2025-08-15]

- Migrate to ESM [[#3](https://github.com/ASL-19/use-overflow-state/pull/3)]

## [0.1.1](https://github.com/ASL-19/use-overflow-state/pulls?q=is%3Aclosed+is%3Apr+milestone%3A0.1.1) [2020-11-11]

- Reduced package.json engines.node to ">= 12" [[#2](https://github.com/ASL-19/use-overflow-state/pull/2)]

## 0.1.0 [2020-11-11]

First release
