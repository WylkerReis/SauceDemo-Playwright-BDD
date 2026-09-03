Feature: Checkout
  As a customer with items in my cart
  I want to complete the checkout process
  So that I can purchase my selected products

  Background:
    Given I am logged in as "standard_user"
    And I add "Sauce Labs Backpack" to the cart
    And I open the cart

  Scenario: Completing checkout end to end with valid information
    When I proceed to checkout
    And I fill in my checkout information as "John", "Doe", "12345"
    And I finish the checkout
    Then I should see the confirmation message "Thank you for your order!"

  Scenario: Checkout is blocked when required information is missing
    When I proceed to checkout
    And I fill in my checkout information as "John", "", "12345"
    Then I should see an error message "Error: Last Name is required"

  Scenario: Checkout is blocked when first name is missing
    When I proceed to checkout
    And I fill in my checkout information as "", "Doe", "12345"
    Then I should see an error message "Error: First Name is required"

  Scenario: Checkout is blocked when postal code is missing
    When I proceed to checkout
    And I fill in my checkout information as "John", "Doe", ""
    Then I should see an error message "Error: Postal Code is required"

  Scenario: Canceling checkout information returns to the cart
    When I proceed to checkout
    And I cancel the checkout
    Then I should see the cart page

  Scenario: Canceling the order review returns to the product catalog
    When I proceed to checkout
    And I fill in my checkout information as "John", "Doe", "12345"
    And I cancel the checkout
    Then I should see the inventory page

  Scenario: The order review total matches the subtotal plus tax
    When I proceed to checkout
    And I fill in my checkout information as "John", "Doe", "12345"
    Then the order total should equal the subtotal plus tax
