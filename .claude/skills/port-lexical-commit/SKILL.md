---
name: port-lexical-commit
disable-model-invocation: true
description: Port an upstream Lexical commit (from the facebook/lexical checkout at /Users/umar/Projects/lexical) into svelte-lexical — translating React plugins/components to Svelte, adopting logic that moved into @lexical/* packages, and porting e2e tests. Use whenever the user says "/port-lexical-commit <sha>".
---

# Port an upstream Lexical commit

svelte-lexical mirrors Lexical's React bindings and playground in Svelte 5. The core `lexical` / `@lexical/*` packages are consumed from npm (pinned versions in `packages/svelte-lexical/package.json`), so a port is rarely a file copy: it is deciding which parts of the upstream commit already arrive through the dependency, which parts need a Svelte translation, and which parts don't apply at all.

Upstream checkout: `/Users/umar/Projects/lexical`. If the sha isn't found there, stop and flag it to the user.

## 1. Understand the upstream commit

```bash
cd /Users/umar/Projects/lexical
git show --stat=200 --format='%h %s%n%b' <sha>
```

Large commits produce huge output (lockfiles, examples, docs). Filter the stat (`grep -v 'examples/\|package-lock\|\.svg\|lexical-website'`) and then read diffs per package rather than all at once.

Bucket every changed file:

| Upstream path | What to do |
|---|---|
| `packages/lexical/`, `packages/lexical-<pkg>/src` (core packages) | Usually nothing — arrives via npm. Check the version check below. If svelte-lexical keeps a *local copy* of that logic, replace the copy with the package export. |
| `packages/lexical-react/src/*Plugin.tsx`, `shared/` | Translate to the matching Svelte plugin under `packages/svelte-lexical/src/lib/core/plugins/` (or `src/lib/components/`). |
| `packages/lexical-playground/src/` (nodes, plugins, UI, CSS) | Translate to `packages/svelte-lexical/src/lib/...` (playground components live in the library) and/or `demos/playground/`. |
| `packages/lexical-playground/__tests__/` | Port to `demos/playground/src/__tests__/` (same file names, `.spec.mjs`). |
| `flow/`, `.flowconfig`, website docs, `examples/`, devtools, CI, build scripts, lockfiles | Skip. |

**Version check:** compare the commit date/release with the pinned `lexical` version (`grep '"lexical"' packages/svelte-lexical/package.json`; `git -C /Users/umar/Projects/lexical tag --contains <sha> | head -1`). If the pinned version already contains the commit, core changes are already present — confirm by grepping the installed package in `node_modules/.pnpm/@lexical+<pkg>@<ver>/node_modules/@lexical/<pkg>/*.d.ts`. If the pinned version is older, tell the user the port needs a dependency bump first and ask before bumping.

## 2. Find the Svelte counterparts

```bash
cd /Users/umar/Projects/svelte-lexical/packages/svelte-lexical
grep -rln '<SymbolOrPluginName>' src/lib
```

Names mostly match upstream (`LexicalLinkPlugin.tsx` → `link/LinkPlugin.svelte`, `ImageComponent.tsx` → `Image/ImageComponent.svelte`). Public exports are in `src/lib/index.ts` — keep them stable.

Some upstream things have no Svelte counterpart (never ported). Note them in the final report rather than creating new plugins, unless the user asks.

## 3. Translate

Follow the conventions already in the target file — read it before editing.

- use Svelte 5 runes.
- `$`-prefixed lexical functions are imported with an alias without the `$` in `.svelte` files (`$getSelection as getSelection`) because `$` is reserved in Svelte script; `.ts` files may keep the `$` name.

## 4. Verify

Only verify packages that have changes:

```bash
pnpm check   # svelte-check, fails on warnings
pnpm lint    # prettier --check + eslint; run `pnpm format` if prettier complains
pnpm size
```

If behaviour changed, run the relevant e2e specs. The playground consumes the built package, so build first:

```bash
cd packages/svelte-lexical && pnpm package
cd ../../demos/playground && pnpm run build-dev
CI=true E2E_PORT=4000 E2E_BROWSER=chromium npx playwright test --project=chromium --reporter=line src/__tests__/e2e/<Spec>.spec.mjs
```

This takes several minutes — run it in the background, and only the specs touching the ported area. Report failures with their output.

## 5. Report and commit

Report briefly: what was ported (file → what changed), what was skipped and why (already in npm dependency, React-only, no Svelte counterpart, would be breaking), and verification results.

Don't commit. 

Provide a commit message: use the repo's conventional-commit style with the upstream title, stripped of `[package]` tags and the PR number:

- upstream `[lexical-playground] Bug Fix: Image links lose link state when dragged (#7890)` → `fix: Image links lose link state when dragged`
- upstream `[lexical][lexical-extension][*] Feature: Lexical Extension (#7706)` → `feat: Lexical Extension`

Prefixes: `fix:`, `feat:`, `refactor:`, `perf:`, `test:` (only tests ported), `breaking:` (public API change).
