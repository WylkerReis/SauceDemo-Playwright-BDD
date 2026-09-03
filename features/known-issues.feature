Feature: Known application defects
  As a QA engineer maintaining this suite
  I want automated coverage of SauceDemo's seeded problem accounts
  So that real, reproducible defects stay documented and are re-verified on every run

  # Each scenario below asserts the behavior a customer would reasonably expect.
  # It is tagged @fail because the underlying defect is a known, live bug in the
  # application (not a flaky test) — the scenario is expected to fail until
  # SauceDemo fixes it. If one of these ever starts passing, that's a signal the
  # defect was fixed and the scenario (and its @fail tag) should be revisited.

  @fail
  Scenario: Product catalog images should be unique per product
    Given I am logged in as "problem_user"
    Then each product should display its own distinct image

  @fail
  Scenario Outline: Sorting the catalog should reorder the products
    Given I am logged in as "<user>"
    When I sort products by "Name (Z to A)"
    Then the products should be displayed in descending name order

    Examples:
      | user         |
      | problem_user |
      | error_user   |

  @fail
  Scenario: Checkout should accept a complete, valid last name
    Given I am logged in as "problem_user"
    And I add "Sauce Labs Backpack" to the cart
    And I open the cart
    When I proceed to checkout
    And I fill in my checkout information as "John", "Doe", "12345"
    Then I should see the checkout overview page

  @fail
  Scenario: Finishing checkout should complete the order
    Given I am logged in as "error_user"
    And I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I proceed to checkout
    And I fill in my checkout information as "John", "Doe", "12345"
    When I finish the checkout
    Then I should see the confirmation message "Thank you for your order!"

  @fail
  Scenario: Login should complete within a reasonable time
    Given I am on the login page
    Then logging in as "performance_glitch_user" with password "secret_sauce" should complete within 3 seconds
