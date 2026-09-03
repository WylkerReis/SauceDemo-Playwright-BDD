Feature: Session handling
  As a SauceDemo customer
  I want my session to be protected and easy to end
  So that my account and activity stay secure

  Scenario: Logging out returns to the login page
    Given I am logged in as "standard_user"
    When I log out
    Then I should see the login page

  Scenario: Visiting the inventory page without logging in is blocked
    When I visit the inventory page directly without logging in
    Then I should see an error message "Epic sadface: You can only access '/inventory.html' when you are logged in."
