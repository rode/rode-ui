Feature: Policies

  Scenario: Open the policy search page
    Given I open the application
    When I navigate to the "PolicySearch" page
    Then I see "PolicySearchInput"

  Scenario: Search for a non-existent policy
    Given I am on the "PolicySearch" page
    When I search for a "NonExistent" policy
    Then I see the "NoPoliciesFound" message

  @smoke
  Scenario: Search for an existing policy
    Given I am on the "PolicySearch" page
    When I search for an "Existing" policy
    Then I see "Existing" policy search result
    When I click the "ViewPolicy" button
    Then I see "Existing" policy details

  Scenario: View policy details
    Given I am on the "Existing" policy details page
    When I select the PolicyDetails Section
    Then I see "Existing" policy details

  Scenario: View policy version history
    Given I am on the "Existing" policy details page
    When I select the History Section
    Then I see "Existing" policy version history

  Scenario: View policy assignments
    Given I am on the "Existing" policy details page
    When I select the Assignments Section
    Then I see "Existing" policy assignment data

  @smoke
  Scenario: Create policy
    Given I open the application
    When I navigate to the "CreatePolicy" page
    Then I see the "CreatePolicy" form
    When I create the "New" policy
    Then I see "New" policy details

  Scenario: Create policy - require name field
    Given I am on the "CreatePolicy" page
    When I click the "SavePolicy" button
    Then I see the "PolicyNameRequired" message
    When I type "name" into "PolicyName" input
    And I click the "SavePolicy" button
    Then I no longer see "PolicyNameRequired" message

  Scenario: Create policy - require rego content field
    Given I am on the "CreatePolicy" page
    When I clear the "PolicyRegoContent" input
    When I click the "SavePolicy" button
    Then I see the "PolicyRegoRequired" message
    When I type "text" into "PolicyRegoContent" input
    And I click the "SavePolicy" button
    Then I no longer see "PolicyRegoRequired" message

  Scenario Outline: Create policy - validating rego code
    Given I am on the "CreatePolicy" page
    When I test <validity> Rego policy code
    Then I see the "<message>" message
    Scenarios:
      | validity | message                |
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
      | field       |
      | name        |
      | description |

  Scenario: Edit policy - create new policy version
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    Then I see the Edit Policy form for "Existing" policy
    When I update and save the "Existing" policy regoContent
    Then I see the "NewPolicyVersion" message
    When I type "this is an update message" into "PolicyUpdateMessage" input
    And I click the "ConfirmUpdatePolicy" button
    Then I see the updated "Existing" policy regoContent

  Scenario: Edit policy - invalid rego
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    Then I see the Edit Policy form for "Existing" policy
    When I save invalid rego code
    Then I see the "PolicyFailedUpdateInvalidRego" message
    Then I see the "PolicyFailedValidation" message

  Scenario: Edit policy - unexpected errors
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    And I save the Edit Policy form and an error occurs
    Then I see the "PolicyFailedUpdate" message

  Scenario: Delete policy
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    And I click the "DeletePolicy" button
    And I confirm to delete the policy
    Then I see the "DeleteSuccess" message

  Scenario: Delete policy - unexpected errors
    Given I am on the "Existing" policy details page
    When I click the "EditPolicy" button
    And I click the "DeletePolicy" button
    And I confirm to delete the policy and an error occurs
    Then I see the "PolicyFailedDelete" message


