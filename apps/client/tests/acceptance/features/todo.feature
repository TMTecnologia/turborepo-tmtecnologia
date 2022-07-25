Feature: todo
  As a user
  I want to add an item to the todo list
  So that I can organize tasks

  Scenario: Add item to the todo list
    Given a user has navigated to the homepage
    # the text inside the quote works as a variable that can be passed to a function
    When the user adds "test" to the todo list using the webUI
    Then card "test" should be displayed on the webUI