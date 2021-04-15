Feature: Resources

  Scenario: Open the resource search page
    Given I open the application
    When I navigate to the "ResourceSearch" page
    Then I see "ResourceSearchInput"

  Scenario: Search for a non-existent resource
    Given I am on the "ResourceSearch" page
    When I search for "NonExistent" resource
    Then I see "NoResourcesFound" message

  @smoke
  Scenario: Search for an existing resource
    Given I am on the "ResourceSearch" page
    When I search for "Existing" resource
    Then I see "Existing" resource search result
    When I click the "ViewResource" button
    Then I see "Existing" resource details

  Scenario Outline: Viewing Resource Details
    Given I am on the "Existing" resource details page
    When I click on <occurrenceType> occurrence
    Then I see "Existing" <occurrenceType> occurrence details
    Scenarios:
    |occurrenceType|
    | Build |
    | Vulnerability |
    | Deployment |