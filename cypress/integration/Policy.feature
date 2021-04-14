Feature: Policies

  Scenario: Opening the policy search page
    Given I open the application
    When I navigate to the "PolicySearch" page
    Then I see "PolicySearchInput"

  Scenario: Searching for a non-existent policy
    Given I am on the "PolicySearch" page
    When I search for "NonExistent" policy
    Then I see "NoPoliciesFound" message

    @smoke
  Scenario: Searching for an existing policy
    Given I am on the "PolicySearch" page
    When I search for "Existing" policy
    Then I see "Existing" policy search result
    When I click the "ViewPolicy" button
    Then I see "Existing" policy details

    @smoke
  Scenario: Creating policy
    Given I open the application
    When I navigate to the "CreatePolicy" page
    Then I see the "CreatePolicy" form
    When I create the "New" policy
    Then I see "New" policy details

  Scenario: Creating policy - require policy name
    Given I am on the "CreatePolicy" page
    When I click the "SavePolicy" button
    Then I see "PolicyNameRequired" message
    When I type "name" into "PolicyName" input
    And I click the "SavePolicy" button
    Then I no longer see "PolicyNameRequired" message

  Scenario: Creating policy - required rego code
    Given I am on the "CreatePolicy" page
    When I click the "SavePolicy" button
    Then I see "PolicyRegoRequired" message
    When I type "rego" into "PolicyRegoContent" input
    And I click the "SavePolicy" button
    Then I no longer see "PolicyRegoRequired" message

  Scenario: Creating policy - validating invalid rego code
    Given I am on the "CreatePolicy" page
    When I test invalid rego policy code
    Then I see "PolicyFailedValidation" message

  Scenario: Creating policy - validating valid rego code
    Given I am on the "CreatePolicy" page
    When I test valid rego policy code
    Then I see "PolicyPassedValidation" message

    @updatePolicy
  Scenario Outline: Editing policy - update fields
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    Then I see the Edit Policy form for "Existing" policy
    When I update and save the "Existing" policy <field>
    Then I see the updated "Existing" policy <field>
    Scenarios:
      | field   |
      | name        |
      | description |
      | regoContent |

  Scenario: Deleting policy
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    And I click the "DeletePolicy" button
    And I confirm to delete the policy
    Then I see "DeleteSuccess" message


