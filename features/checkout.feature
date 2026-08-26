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
