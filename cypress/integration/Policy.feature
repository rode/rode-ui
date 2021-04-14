Feature: Policies

  Scenario: Open the policy search page
    Given I open the application
    When I navigate to the "PolicySearch" page
    Then I see "PolicySearchInput"

  Scenario: Search for a non-existent policy
    Given I am on the "PolicySearch" page
    When I search for "NonExistent" policy
    Then I see "NoPoliciesFound" message

    @smoke
  Scenario: Search for an existing policy
    Given I am on the "PolicySearch" page
    When I search for "Existing" policy
    Then I see "Existing" policy search result
    When I click the "ViewPolicy" button
    Then I see "Existing" policy details

    @smoke
  Scenario: Create policy
    Given I open the application
    When I navigate to the "CreatePolicy" page
    Then I see the "CreatePolicy" form
    When I create the "New" policy
    Then I see "New" policy details

  Scenario Outline: Create policy - required fields
    Given I am on the "CreatePolicy" page
    When I click the "SavePolicy" button
    Then I see "<message>" message
    When I type "<text>" into "<input>" input
    And I click the "SavePolicy" button
    Then I no longer see "<message>" message
    Scenarios:
    | message | text | input |
    | PolicyNameRequired | name | PolicyName |
    | PolicyRegoRequired | rego | PolicyRegoContent |

  Scenario Outline: Create policy - validating rego code
    Given I am on the "CreatePolicy" page
    When I test <validity> rego policy code
    Then I see "<message>" message
    Scenarios:
    | validity | message |
    | invalid  | PolicyFailedValidation |
    | valid    | PolicyPassedValidation |

    @updatePolicy
  Scenario Outline: Edit policy - update fields
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

  Scenario: Edit policy - invalid rego
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    Then I see the Edit Policy form for "Existing" policy
    When I save invalid rego code
    Then I see "PolicyFailedUpdateInvalidRego" message
    Then I see "PolicyFailedValidation" message

  Scenario: Edit policy - unexpected errors
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    And I save the Edit Policy form and an error occurs
    Then I see "PolicyFailedUpdate" message

  Scenario: Delete policy
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    And I click the "DeletePolicy" button
    And I confirm to delete the policy
    Then I see "DeleteSuccess" message

  Scenario: Delete policy - unexpected errors
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    And I click the "DeletePolicy" button
    And I confirm to delete the policy and an error occurs
    Then I see "PolicyFailedDelete" message


