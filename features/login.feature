Feature: Login
  As a SauceDemo customer
  I want to log in to my account
  So that I can browse and purchase products

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I log in with username "standard_user" and password "secret_sauce"
    Then I should see the inventory page

  Scenario: Locked out user cannot log in
    When I log in with username "locked_out_user" and password "secret_sauce"
    Then I should see an error message "Epic sadface: Sorry, this user has been locked out."

  Scenario: Login fails with an incorrect password
    When I log in with username "standard_user" and password "wrong_password"
    Then I should see an error message "Epic sadface: Username and password do not match any user in this service"

  Scenario: Login fails when both username and password are blank
    When I log in with username "" and password ""
    Then I should see an error message "Epic sadface: Username is required"

  Scenario: Login fails when password is blank
    When I log in with username "standard_user" and password ""
    Then I should see an error message "Epic sadface: Password is required"
