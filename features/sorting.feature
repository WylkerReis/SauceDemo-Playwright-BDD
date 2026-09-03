Feature: Product sorting
  As a customer browsing the product catalog
  I want to sort products by price or name
  So that I can find what I'm looking for more easily

  Background:
    Given I am logged in as "standard_user"

  Scenario: Sorting products by price, low to high
    When I sort products by "Price (low to high)"
    Then the products should be displayed in ascending price order

  Scenario: Sorting products by name, Z to A
    When I sort products by "Name (Z to A)"
    Then the products should be displayed in descending name order

  Scenario: Sorting products by name, A to Z
    When I sort products by "Name (A to Z)"
    Then the products should be displayed in ascending name order

  Scenario: Sorting products by price, high to low
    When I sort products by "Price (high to low)"
    Then the products should be displayed in descending price order
