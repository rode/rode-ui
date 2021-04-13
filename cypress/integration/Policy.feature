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

  Scenario: Search for an existing policy
    Given I am on the "PolicySearch" page
    When I search for "Existing" policy
    Then I see "Existing" search result



