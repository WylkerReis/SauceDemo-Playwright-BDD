# Execution Report

**Run date:** 2026-09-03 · **Command:** `npm test` (`bddgen` + `playwright test`, project `chrome`) · **Result:** 29 passed, 0 failed, exit code 0

This is a real run against the live site, not a hypothetical — see [Reproducing this report](#reproducing-this-report). The 5 `known-issues.feature` scenarios below are tagged `@fail`: they are *expected* to fail (they assert the behavior a customer should see; the app doesn't deliver it), and Playwright reports an expected failure as a pass for build-status purposes. Their row is marked **Bug** rather than **Pass** here because that's what they represent for QA purposes, even though the test run treats them as a non-blocking success.

## Login — 5/5 passed

| Scenario | Result |
|---|---|
| Successful login with valid credentials | Pass |
| Locked out user cannot log in | Pass |
| Login fails with an incorrect password | Pass |
| Login fails when both username and password are blank | Pass |
| Login fails when password is blank | Pass |

## Session handling — 2/2 passed

| Scenario | Result |
|---|---|
| Logging out returns to the login page | Pass |
| Visiting the inventory page without logging in is blocked | Pass |

## Shopping cart — 5/5 passed

| Scenario | Result |
|---|---|
| Adding a product updates the cart badge count | Pass |
| Adding multiple products updates the cart badge count | Pass |
| Removing a product from the cart removes it from the cart page | Pass |
| Removing the last product hides the cart badge | Pass |
| Continue shopping returns to the product catalog | Pass |

## Product sorting — 4/4 passed

| Scenario | Result |
|---|---|
| Sorting products by price, low to high | Pass |
| Sorting products by name, Z to A | Pass |
| Sorting products by name, A to Z | Pass |
| Sorting products by price, high to low | Pass |

## Checkout — 7/7 passed

| Scenario | Result |
|---|---|
| Completing checkout end to end with valid information | Pass |
| Checkout is blocked when required information is missing (last name) | Pass |
| Checkout is blocked when first name is missing | Pass |
| Checkout is blocked when postal code is missing | Pass |
| Canceling checkout information returns to the cart | Pass |
| Canceling the order review returns to the product catalog | Pass |
| The order review total matches the subtotal plus tax | Pass |

## Known application defects — 6/6 ran as expected (5 confirmed bugs)

| Scenario | Result | Bug ref |
|---|---|---|
| Product catalog images should be unique per product | Bug (expected failure) | [BUG-01](bug-report.md#bug-01-every-product-shows-the-same-broken-image-for-problem_user) |
| Sorting the catalog should reorder the products · Example #1 (`problem_user`) | Bug (expected failure) | [BUG-02](bug-report.md#bug-02-changing-the-sort-order-does-nothing-for-problem_user-and-error_user) |
| Sorting the catalog should reorder the products · Example #2 (`error_user`) | Bug (expected failure) | [BUG-02](bug-report.md#bug-02-changing-the-sort-order-does-nothing-for-problem_user-and-error_user) |
| Checkout should accept a complete, valid last name | Bug (expected failure) | [BUG-03](bug-report.md#bug-03-checkout-rejects-a-valid-last-name-for-problem_user) |
| Finishing checkout should complete the order | Bug (expected failure) | [BUG-04](bug-report.md#bug-04-finish-button-never-completes-the-order-for-error_user) |
| Login should complete within a reasonable time | Bug (expected failure) | [BUG-05](bug-report.md#bug-05-performance_glitch_user-login-takes-58-seconds) |

## Summary

| | Count |
|---|---:|
| Total scenarios executed | 29 |
| Passing (functional coverage) | 23 |
| Expected failures (documented defects) | 6 executions / 5 confirmed bugs |
| Unexpected failures | 0 |
| Build result | **Green** (exit code 0) |

## Reproducing this report

```bash
npm test
npm run report   # opens the HTML report locally — every scenario's screenshot/video is attached there
```

Every scenario captures its own screenshot and video (`screenshot: 'on'`, `video: 'on'` in [playwright.config.ts](../playwright.config.ts)), viewable per-test in the HTML report rather than committed as static files here — that keeps the evidence live and current on every run instead of a snapshot that silently goes stale.
