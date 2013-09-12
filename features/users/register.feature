Feature: A new user can create a new account

  Scenario Outline: Creating a new account
    Given I have an "<email>" and "<password>"
    When  I post the user info to /register
    Then  the app makes a password digest
    And   The server responds with my email and token

  Examples:
    |     email    |   password   |
    | jim@jim.com  |    ados23    |
    | bob@bob.com  |    324ere    |
