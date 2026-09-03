# Test Plan — SauceDemo Playwright BDD Suite

## 1. Objective

Provide automated end-to-end regression coverage for [SauceDemo](https://www.saucedemo.com)'s core shopping flow (login, session handling, product catalog, cart, checkout), and use the application's own seeded "problem" accounts to actively hunt for and document real, reproducible defects — rather than only proving the happy path works.

## 2. Scope

### In scope

| Area | Covered by |
|---|---|
| Authentication | [features/login.feature](../features/login.feature) |
| Session handling (logout, route guard) | [features/session.feature](../features/session.feature) |
| Shopping cart | [features/cart.feature](../features/cart.feature) |
| Product catalog sorting | [features/sorting.feature](../features/sorting.feature) |
| Checkout | [features/checkout.feature](../features/checkout.feature) |
| Known application defects (exploratory / negative) | [features/known-issues.feature](../features/known-issues.feature) |

### Out of scope

- Cross-browser coverage (Firefox, Safari/WebKit) — the suite runs on Google Chrome only, matching this project's own CI (see [playwright.config.ts](../playwright.config.ts)).
- Mobile/responsive layouts.
- Non-functional testing beyond the single login-latency check in `known-issues.feature` (no dedicated load/performance suite).
- Visual regression (the `visual_user` seeded account exists for this purpose on SauceDemo but is not covered — see [Risks and assumptions](#5-risks-and-assumptions)).
- Payment processing (SauceDemo's checkout is a simulated flow with no real payment gateway to test).

## 3. Test approach

- **BDD / Gherkin** — every scenario is written in [features/*.feature](../features) files in plain business language first; step definitions in [steps/](../steps) only translate that language into calls on [Page Object](../pages) methods (see [CLAUDE.md](../CLAUDE.md) for the full layering rule).
- **Page Object Model** — all selectors live in `pages/`, keeping the suite maintainable as the UI changes.
- **Boundary / negative testing** — every required form field (login username/password, checkout first name/last name/postal code) has a dedicated scenario asserting the exact validation message SauceDemo returns when that field is blank.
- **Exploratory bug hunting against seeded defects** — SauceDemo ships accounts (`problem_user`, `error_user`, `performance_glitch_user`) that are intentionally broken in different ways. `known-issues.feature` exercises each one and asserts the behavior a real customer would expect. Where the app fails that expectation, the scenario is tagged `@fail` (`test.fail()` in Playwright terms): it still runs and is still verified on every execution, but an expected failure doesn't break the build — see [bug-report.md](bug-report.md) for the specific defects this surfaced.
- **Evidence per scenario** — `playwright.config.ts` captures a screenshot and a video for every scenario, pass or fail (`screenshot: 'on'`, `video: 'on'`), embedded directly into the HTML report.

## 4. Environment & tools

| | |
|---|---|
| Target under test | https://www.saucedemo.com (public demo app, published test credentials) |
| Browser | Google Chrome (`channel: 'chrome'`), Desktop viewport |
| Test runner | [Playwright](https://playwright.dev/) (`@playwright/test`) |
| BDD layer | [playwright-bdd](https://github.com/vitalets/playwright-bdd) + [`@cucumber/cucumber`](https://github.com/cucumber/cucumber-js) |
| Language | TypeScript |
| CI | GitHub Actions ([.github/workflows/playwright.yml](../.github/workflows/playwright.yml)), Ubuntu runner, single worker, 2 retries |

### Test data

| User | Role in the suite |
|---|---|
| `standard_user` | The well-behaved account used for all happy-path and validation scenarios |
| `locked_out_user` | Login-denial scenario |
| `problem_user` | Bug hunting — broken product images, broken sort, broken checkout form |
| `error_user` | Bug hunting — broken sort, checkout that never completes |
| `performance_glitch_user` | Bug hunting — abnormal login latency |

Product data is not mocked — scenarios use SauceDemo's real, live catalog (e.g. "Sauce Labs Backpack") and its real prices, so the checkout price-math scenario is validated against genuine, unmodified application output.

## 5. Risks and assumptions

- **Live external dependency.** The suite has no control over saucedemo.com; a copy/DOM change there can break scenarios unrelated to any code change here. This has happened before on this project (see [CLAUDE.md](../CLAUDE.md)'s live-site trust note) — every assertion added to this suite, including all of the ones in this iteration, was verified against the live site before being written, not assumed from memory.
- **`visual_user` is out of scope.** Its defects are visual/CSS-level and would require screenshot-diffing (visual regression) infrastructure this suite doesn't have. Flagged here rather than silently skipped.
- **`performance_glitch_user`'s delay is currently ~5–8s** against a 3s budget in `known-issues.feature`, measured directly (not assumed) across multiple runs before being encoded. If SauceDemo changes that delay, the threshold may need revisiting.
- **CI runs single-worker**; local runs are parallel. Scenario independence (each scenario logs in fresh, no shared state) is what makes this safe in both modes.

## 6. Entry / exit criteria

- **Entry**: `npm install` completed, Chrome installed via `npx playwright install chrome`.
- **Exit**: `npm test` completes with exit code 0. This includes the `known-issues.feature` scenarios succeeding *as expected failures* — a red run there (an "expected to fail, but passed" result) is itself a signal worth investigating, documented in [bug-report.md](bug-report.md).

## 7. Coverage summary

| Feature | Scenarios | Notes |
|---|---:|---|
| Login | 5 | Valid login, locked-out account, wrong password, blank username+password, blank password |
| Session | 2 | Logout, unauthenticated route guard |
| Cart | 5 | Add one/multiple, remove one, badge hidden at zero, continue shopping |
| Sorting | 4 | All 4 dropdown options (name/price × ascending/descending) |
| Checkout | 7 | Happy path, all 3 required fields validated individually, cancel from both steps, order-total math |
| Known issues | 6 executions (5 scenarios, one parameterized) | 5 confirmed defects — see [bug-report.md](bug-report.md) |
| **Total** | **29** | See [execution-report.md](execution-report.md) for the latest run's per-scenario result |
