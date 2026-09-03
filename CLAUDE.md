# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                # npx bddgen && npx playwright test — full suite (Chrome)
npm run test:headed     # same, with visible browser windows
npm run report          # open the last HTML report (npx playwright show-report)
```

Run a subset directly with the Playwright CLI (run `npx bddgen` first if `.features-gen/` is missing or a `.feature`/`steps/*.ts` file changed — it is not run automatically by these):

```bash
npx bddgen                                          # regenerate .features-gen/ from features/*.feature + steps/*.ts
npx playwright test --project=chrome                 # explicit project (Chrome is the only one)
npx playwright test .features-gen/features/login.feature.spec.js   # single feature file
npx playwright test -g "Locked out user"              # by scenario name
```

There is no lint/typecheck script configured; `tsc` runs implicitly via `ts-node`/Playwright's TS support when tests execute.

## Architecture

This is a **Playwright + BDD (Gherkin/Cucumber)** end-to-end suite for [SauceDemo](https://www.saucedemo.com), using `playwright-bdd` to compile `.feature` files into native Playwright tests (so Playwright's own fixtures, parallelization, and HTML reporter are used — there is no separate Cucumber test runner).

**Execution pipeline**: `features/*.feature` + `steps/*.ts` → (`bddgen`, driven by `defineBddConfig` in [playwright.config.ts](playwright.config.ts)) → generated specs in `.features-gen/` (gitignored, regenerated on every `npm test`) → run by `playwright test`.

**Three-layer structure, each layer with one job:**
- `features/*.feature` — Gherkin scenarios in business language. No implementation detail (no selectors, no "click" verbs).
- `steps/*.steps.ts` — step definitions created via `createBdd()` from `playwright-bdd`. These *only* translate Gherkin text into calls on page objects — they never hold selectors themselves. `steps/common.steps.ts` holds step definitions shared across multiple feature files (e.g. the login-as-user Background step, the shared error-message assertion) to avoid Cucumber "ambiguous step" errors from duplicate definitions in different files — do not redefine a step pattern that already exists in `common.steps.ts` or another `steps/*.ts` file.
- `pages/*.ts` — Page Object classes holding all selectors and page interactions. `BasePage` holds the `errorMessage` locator (`[data-test="error"]`), which is shared because SauceDemo reuses the same error banner element on both the login page and the checkout info page; `LoginPage` and `CheckoutPage` both `extends BasePage` rather than redeclaring it.

When adding a scenario: write the `.feature` file first in plain business language, then add/extend a page object method if the interaction is new, then wire a step definition that calls that method. Don't put `page.locator(...)` calls directly in `steps/`.

**Live-site trust note**: SauceDemo's DOM/copy has drifted from common assumptions before (see git history — a `data-test` attribute and an error-message string both needed correction after checking the real site). When adding assertions against exact text or `data-test` attributes, verify against the live site rather than assuming.

## Config

[playwright.config.ts](playwright.config.ts) sets `baseURL: 'https://www.saucedemo.com'` (so `page.goto('/')` in `LoginPage.goto()` works) and runs a single project `chrome` (`channel: 'chrome'`, i.e. real Google Chrome rather than bundled Chromium — CI installs it with `npx playwright install --with-deps chrome`). CI (`.github/workflows/playwright.yml`) runs `npm ci`, installs Chrome with `--with-deps chrome`, then `bddgen` and `playwright test`, uploading `playwright-report/` as an artifact — it runs single-worker there (`workers: process.env.CI ? 1 : undefined`) vs. parallel locally.
