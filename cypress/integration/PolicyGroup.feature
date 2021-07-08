Feature: Policy Groups

  Scenario: Open Policy Group Dashboard
    Given I open the application
    When I navigate to the "PolicyGroup" page
    Then I see the policy groups dashboard

  Scenario: Create policy group
    Given I open the application
    When I navigate to the "PolicyGroup" page
    And I click the "CreateNewPolicyGroup" button
    Then I see the "CreatePolicyGroup" form
    When I create the "New" policy group
    Then I see the "New" policy group details

  Scenario: Create policy group - invalid name
    Given I open the application
    When I navigate to the "PolicyGroup" page
    And I click the "CreateNewPolicyGroup" button
    Then I see the "CreatePolicyGroup" form
    When I type "Invalid*Name" into "PolicyGroupName" input
    And I click the "SavePolicyGroup" button
    Then I see the "InvalidPolicyGroupName" message

  @updatePolicyGroup
  Scenario: Edit policy group description
    Given I am on the Existing policy group details page
      When I click the "EditPolicyGroup" button
      Then I see the "EditPolicyGroup" form
      When I update and save the Existing policy group description
      Then I see the updated Existing policy group description
