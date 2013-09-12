Feature: A user can login to an existing account

  Scenario Outline: Logging in
    Given an "<email>" and "<password>"
    When  I post the user info to /login
    Then  the app makes a password digest
    And   The server responds with my "<email>" and token

  Examples:
    |     email    |   password   |
    | jim@jim.com  |    ados23    |
    | bob@bob.com  |    324ere    |
