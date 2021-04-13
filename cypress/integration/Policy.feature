Feature: Policy Search

  I want to search for a policy

  Scenario: Opening the search page
    Given I open the application
    When I navigate to the "PolicySearch" page
    Then I see "PolicySearchInput"

  Scenario: Searching for a non-existent policy
    Given I am on the "PolicySearch" page
    When I search for "NonExistent" policy
    Then I see "NoPoliciesFound" message

  Scenario: Searching for an existing policy
    Given I am on the "PolicySearch" page
    When I search for "Existing" policy
    Then I see "Existing" search result

  Scenario: Viewing policy details
    Given I am on the "Existing" policy details page
    Then I see "Existing" policy details

  Scenario: Editing policy details
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    Then I see the "EditPolicy" form for "Existing" policy


