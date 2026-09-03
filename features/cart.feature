Feature: Shopping cart
  As a logged in customer
  I want to add and remove products from my cart
  So that I can keep track of what I intend to buy

  Background:
    Given I am logged in as "standard_user"

  Scenario: Adding a product updates the cart badge count
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"

  Scenario: Adding multiple products updates the cart badge count
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    Then the cart badge should show "2"

  Scenario: Removing a product from the cart removes it from the cart page
    Given I add "Sauce Labs Backpack" to the cart
    When I open the cart
    And I remove "Sauce Labs Backpack" from the cart
    Then my cart should not contain "Sauce Labs Backpack"

  Scenario: Removing the last product hides the cart badge
    Given I add "Sauce Labs Backpack" to the cart
    And I open the cart
    When I remove "Sauce Labs Backpack" from the cart
    Then the cart badge should not be visible

  Scenario: Continue shopping returns to the product catalog
    Given I open the cart
    When I continue shopping
    Then I should see the inventory page
