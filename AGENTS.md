# @asl-19/use-overflow-state

React hook that returns the horizontal overflow state of a scrollable element, published to npm as an ESM-only TypeScript package. See [README.markdown](./README.markdown) for human-facing setup.

## Commands

```sh
npm run dev-lint-test    # npm install, then docs check, type check, ESLint, Prettier, Vitest, publint, attw
npm run build-lint-test  # build, then the same checks (what CI and prepublishOnly run)
npm run docs             # regenerate docs/ (docs-check fails if it's stale)
npm run outdated         # report Node, npm package and GitHub Actions updates
```

- Run `npm run docs` after changing a TSDoc comment or an exported signature.
- Tests are Vitest with happy-dom and React Testing Library (`renderHook`), in `src/*.test.ts`. happy-dom doesn't do layout, so tests mock element dimensions and scroll positions.
- The Node major is set in both `mise.toml` and `package.json`'s `devEngines.runtime`; change them together.
- `tsconfig-dist.json` checks `src/` without Node types: library code runs in browsers, so don't use Node APIs there.

## Don't name consuming projects

This is a public package. Don't name the projects or products that use it anywhere in this repository: code, comments, tests, docs, README, CHANGELOG, commit messages, branch names or pull request text. Describe usage generically instead ("a consuming project", "an app using the hook"). This applies even when a change was prompted by, or tested in, a specific project.

## Agent boundaries

`.claude/settings.json` makes Claude Code ask before editing `.npmrc` or `.claude/`, and before running `mise trust` or `git add`, `commit`, `push` or `config`. It denies edits to `.git/` outright: a hook dropped in `.git/hooks/` would run unconfined as the developer.

These rules are a backstop, not the boundary. Against the file tools (Read/Edit/Write) they're structural, but against Bash they only match command text, so `sh -c '…'` would slip past one. Never rephrase a command so it no longer matches a rule. A permission prompt isn't an invitation: only take the actions below when the user has asked for them, and treat a declined prompt as the user's decision. When a rule or gate blocks something, say what blocked it and hand over the exact command or edit for a human to run.

- **Only stage, commit or push when asked.** Otherwise leave changes in the working tree for a human to review. Don't rewrite history or change git config unless asked.
- **Only edit `.npmrc` or `.claude/` when asked.** `.npmrc` holds the supply-chain gates below, and `.claude/` holds these rules.
- **Keep `mise.toml` `[tools]`-only.** mise trusts a tools-only config automatically. Adding `[env]`, `[hooks]` or `[tasks]` makes it require `mise trust`, which lets the config run code, so only run `mise trust` when asked.
- **Node comes from mise's shims.** If `node --version` doesn't match `mise.toml`, stop and tell the user rather than prefixing commands with `mise exec`.

## npm supply-chain gates

npm enforces these itself, from `.npmrc` and `package.json`'s `devEngines` and `allowScripts`:

- **`min-release-age=1`**: installs only resolve versions published more than a day ago. Our own `@asl-19/*` scope is exempt. `npm ci` installs exactly what's in the lockfile, so it isn't affected.
- **`strict-allow-scripts=true`**: dependency install scripts run only if `allowScripts` approves them.
- **`allow-git=none`, `allow-remote=none`**: dependencies come from the npm registry only.
- **`engine-strict=true` + `devEngines`**: npm older than 11.17 ignores the keys above, so this refuses to run with one.

Every gate can be switched off for a single command with a CLI flag or an `npm_config_*` environment variable. That's an escape hatch for a human, not for an agent looking at a failed install:

- **Never loosen a gate for a command.** That means no `--min-release-age`, `--min-release-age-exclude`, `--before`, `--allow-scripts`, `--dangerously-allow-all-scripts`, `--no-strict-allow-scripts`, `--allow-git`, `--allow-remote` or `--no-engine-strict`, no `npm_config_*` equivalents, and the same for `npx`.
- **Don't edit `devEngines` or `allowScripts` in `package.json` to get past a gate.** The rest of `package.json` is fine to edit.
- **When a gate blocks an install, stop and report it:**
  - _Version too new:_ wait out the release-age window, or hand the install command to a human to run in their own terminal.
  - _Unapproved install script:_ name the package and what its script does. Approving it (`npm install-scripts approve <pkg>`) is a human decision.
  - _`EBADDEVENGINES`:_ the active Node or npm isn't the one from `mise.toml`, so see "Node comes from mise's shims" above.
