# SauceDemo Playwright BDD

End-to-end test suite for [SauceDemo](https://www.saucedemo.com) built with **Playwright**, **TypeScript**, and **Gherkin/Cucumber (BDD)**, following the **Page Object Model**.

This mirrors the practice used in my Cypress + Cucumber/BDD suite ([Desafio-Automacao-Inventario-CTI](https://github.com/WylkerReis/Desafio-Automacao-Inventario-CTI)) — same approach (Gherkin scenarios, POM, clean test architecture), applied to a different tool.

![Passing test report](docs/passing-report.png)

## Why this project

SauceDemo is a public e-commerce practice site with login, a product catalog, cart, and checkout — flows that map closely to what an automation suite looks like on a real project. The suite covers:

- **Login** — valid credentials, a locked-out account, an invalid password, and blank-field validation.
- **Session** — logging out, and the route guard that blocks direct access to the inventory page when signed out.
- **Cart** — adding one or several products, removing a product (down to an empty cart), and the "Continue Shopping" link — all verified against the cart badge/contents.
- **Sorting** — reordering the product catalog by price and by name, in both directions.
- **Checkout** — a full end-to-end purchase, required-field validation for every field, canceling from either step, and the order review's price math (subtotal + tax = total).
- **Known issues** — SauceDemo ships several seeded "problem" accounts (`problem_user`, `error_user`, `performance_glitch_user`) with real, reproducible defects. The suite exercises them and documents 5 confirmed bugs — duplicate product images, a broken sort dropdown, a checkout form that rejects a valid last name, a "Finish" button that silently fails to complete the order, and a ~5s login regression — each tagged `@fail` (`test.fail()`) so they're re-verified on every run without breaking CI. See [features/known-issues.feature](features/known-issues.feature) and the full write-up in [docs/bug-report.md](docs/bug-report.md).

## Documentation

This README covers installation, execution, and structure. The rest of the QA process lives in dedicated documents:

- [docs/test-plan.md](docs/test-plan.md) — objective, scope, test approach/techniques, environment, tools, and risks.
- [docs/execution-report.md](docs/execution-report.md) — the latest run's result, scenario by scenario.
- [docs/bug-report.md](docs/bug-report.md) — each confirmed defect, with severity, Gherkin reproduction steps, and expected vs. actual result.

Evidence (a screenshot and a video per scenario, pass or fail) is captured automatically on every run — see [Running the tests](#running-the-tests) — rather than committed as static files, so it never goes stale.

## Tech stack

- [Playwright](https://playwright.dev/) (`@playwright/test`) — browser automation and test runner
- [playwright-bdd](https://github.com/vitalets/playwright-bdd) + [`@cucumber/cucumber`](https://github.com/cucumber/cucumber-js) — compiles `.feature` files into native Playwright tests, so the suite keeps Playwright's fixtures, parallelization, and HTML reporting instead of a separate BDD runner
- TypeScript
- GitHub Actions for CI

## Project structure

```
features/     Gherkin scenarios (Given/When/Then), business language
steps/        Step definitions — call into page objects, hold no selectors
pages/        Page Object classes (LoginPage, InventoryPage, CartPage, CheckoutPage, BasePage)
```

Each `.feature` file describes one user-facing flow in plain language a non-technical stakeholder could follow. Step definitions translate those steps into Playwright actions by delegating to the page objects — selectors live only in `pages/`.

```gherkin
Scenario: Successful login with valid credentials
  Given I am on the login page
  When I log in with username "standard_user" and password "secret_sauce"
  Then I should see the inventory page
```

## Running the tests

```bash
npm install
npx playwright install chrome
npm test
```

`npm test` runs `bddgen` (compiles the feature files into runnable Playwright specs under `.features-gen/`) followed by `playwright test`, against Google Chrome (the only configured project — see [playwright.config.ts](playwright.config.ts)).

Other useful commands:

```bash
npm run test:headed   # run with visible browser windows
npm run report         # open the last HTML report
```

## Continuous Integration

Every push and pull request runs the full suite via [GitHub Actions](.github/workflows/playwright.yml), which installs dependencies and browsers, generates the tests from the feature files, and runs them headless. The HTML report is uploaded as a workflow artifact.

[![Playwright Tests](https://github.com/WylkerReis/SauceDemo-Playwright-BDD/actions/workflows/playwright.yml/badge.svg)](https://github.com/WylkerReis/SauceDemo-Playwright-BDD/actions/workflows/playwright.yml)

## Author

**Wylker Reis** — QA Automation Engineer
[GitHub](https://github.com/WylkerReis)
