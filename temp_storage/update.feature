Feature: A user can update their account

  Scenario Outline: Updating a password
    Given I have a "<new password>"
    When  I post the token, "<old password>", and "<new password>"
    Then  my password gets changed to the "<new password>"

  Examples:
    | old password | new password |
    | fgh54y5y     |    ados23    |
    | fgh4h4h      |    324ere    |




  Scenario Outline: Changing an email address
  Given
  When
  Then

  Examples:
  |  |  |
  |  |  |


  Scenario Outline: ?
    Given
    When
    Then

  Examples:
    |  |  |
    |  |  |