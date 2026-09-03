# Bug Report

5 confirmed defects, found by exercising SauceDemo's own seeded "problem" accounts and asserting the behavior a real customer would expect. Every bug below was reproduced live against https://www.saucedemo.com before being written up — none of this is inferred from documentation or assumed from a prior SauceDemo version (see [CLAUDE.md](../CLAUDE.md)'s note on this site's history of drift). Each is encoded as an automated, `@fail`-tagged scenario in [features/known-issues.feature](../features/known-issues.feature), so it is re-verified — and its evidence (screenshot + video) regenerated — on every suite run; see [Evidence](#evidence) below instead of static attached images.

| ID | Title | Severity |
|---|---|---|
| [BUG-01](#bug-01-every-product-shows-the-same-broken-image-for-problem_user) | Every product shows the same broken image | Medium |
| [BUG-02](#bug-02-changing-the-sort-order-does-nothing-for-problem_user-and-error_user) | Changing the sort order does nothing | Medium |
| [BUG-03](#bug-03-checkout-rejects-a-valid-last-name-for-problem_user) | Checkout rejects a valid last name | High |
| [BUG-04](#bug-04-finish-button-never-completes-the-order-for-error_user) | "Finish" button never completes the order | Critical |
| [BUG-05](#bug-05-performance_glitch_user-login-takes-58-seconds) | Login takes 5–8 seconds | Low |

---

## BUG-01: Every product shows the same broken image (for `problem_user`)

**Severity:** Medium — cosmetic/content defect, but visible on the very first screen after login and directly affects purchase confidence.

**Account affected:** `problem_user`

**Steps to reproduce:**
```gherkin
Given I am logged in as "problem_user"
Then each product should display its own distinct image
```
(`features/known-issues.feature`)

**Expected result:** Each of the 6 products on the inventory page shows its own product photo, as it does for `standard_user`.

**Actual result:** All 6 `<img>` elements point to the exact same file — `/assets/sl-404-Cq1a9k9X.jpg` (a literal "404" placeholder) — regardless of product.

**Automated check:** asserts the 6 image `src` values are pairwise distinct (`new Set(srcs).size === srcs.length`); fails because the set collapses to 1.

---

## BUG-02: Changing the sort order does nothing (for `problem_user` and `error_user`)

**Severity:** Medium — a whole feature (catalog sorting) is silently non-functional; no error is shown to the user, so the bug is easy to miss without automation.

**Accounts affected:** `problem_user`, `error_user`

**Steps to reproduce:**
```gherkin
Given I am logged in as "<user>"
When I sort products by "Name (Z to A)"
Then the products should be displayed in descending name order

Examples:
  | user         |
  | problem_user |
  | error_user   |
```
(`features/known-issues.feature`)

**Expected result:** Selecting any of the 4 sort options (Name A–Z / Z–A, Price low–high / high–low) reorders the product grid accordingly, exactly as it does for `standard_user`.

**Actual result:** For both accounts, selecting *any* of the 4 options leaves the catalog in its default Name A–Z order. Verified directly: cycling through all 4 dropdown values for `problem_user` and `error_user` produced the identical product order every time, while the same script against `performance_glitch_user` and `visual_user` correctly produced 4 distinct orderings.

---

## BUG-03: Checkout rejects a valid last name (for `problem_user`)

**Severity:** High — blocks the customer from completing a purchase despite supplying complete, correct information; a direct revenue-blocking defect.

**Account affected:** `problem_user`

**Steps to reproduce:**
```gherkin
Given I am logged in as "problem_user"
And I add "Sauce Labs Backpack" to the cart
And I open the cart
When I proceed to checkout
And I fill in my checkout information as "John", "Doe", "12345"
Then I should see the checkout overview page
```
(`features/known-issues.feature`)

**Expected result:** With First Name, Last Name, and Postal Code all filled in, clicking Continue advances to the order review (`checkout-step-two.html`).

**Actual result:** The app rejects the submission with `Error: Last Name is required`, even though "Doe" was entered into the Last Name field — the checkout form for this account doesn't correctly register the typed value.

---

## BUG-04: "Finish" button never completes the order (for `error_user`)

**Severity:** Critical — the single most damaging class of e-commerce bug: the customer does everything right (browses, adds to cart, fills in valid info) and still cannot complete the purchase, with no error message explaining why.

**Account affected:** `error_user`

**Steps to reproduce:**
```gherkin
Given I am logged in as "error_user"
And I add "Sauce Labs Backpack" to the cart
And I open the cart
And I proceed to checkout
And I fill in my checkout information as "John", "Doe", "12345"
When I finish the checkout
Then I should see the confirmation message "Thank you for your order!"
```
(`features/known-issues.feature`)

**Expected result:** Clicking "Finish" on the order review completes the order and shows the "Thank you for your order!" confirmation page.

**Actual result:** The click registers (no error thrown, button is enabled and visible) but the app never navigates away from `checkout-step-two.html` — the confirmation page is never reached. The order review itself renders correctly beforehand (item, $29.99 subtotal, $2.40 tax, $32.39 total all display normally), which makes this easy to miss in manual testing unless you specifically wait for and check the final confirmation screen.

---

## BUG-05: `performance_glitch_user` login takes 5–8 seconds

**Severity:** Low — no functional break, but a large, consistent latency regression against a page that should be near-instant; worth tracking as a performance SLA violation.

**Account affected:** `performance_glitch_user`

**Steps to reproduce:**
```gherkin
Given I am on the login page
Then logging in as "performance_glitch_user" with password "secret_sauce" should complete within 3 seconds
```
(`features/known-issues.feature`)

**Expected result:** Login completes (URL reaches `/inventory.html`) within a reasonable budget — 3 seconds, matching the ~1–2 second experience every other account gets.

**Actual result:** Measured directly and repeatedly: a consistent ~5.1 second delay in isolation, and 5.7–8.5 seconds observed when the full suite runs in parallel. Every other account logs in within ~1.5 seconds under the same conditions.

---

## Evidence

Rather than committing static screenshots/videos to this report (which silently go stale the moment the app or the suite changes), every scenario above captures its own screenshot and video automatically on every run — see `screenshot: 'on'` / `video: 'on'` in [playwright.config.ts](../playwright.config.ts). To view current evidence for any bug:

```bash
npm test
npm run report
```
then open the corresponding scenario in `features/known-issues.feature` from the report — its screenshot and full video recording are attached inline.
