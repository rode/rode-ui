Feature: Policy Playground

  @smoke
  Scenario: Successful Policy Evaluation
    Given I am on the "PolicyPlayground" page
    When I search for "Existing" policy
    And I select "Existing" policy for evaluation
    And I search for "Existing" resource
    And I select "Existing" resource for evaluation
    When the resource passes the policy
    Then I see "SuccessfulEvaluation" message

  Scenario: Failed Policy Evaluation
    Given I am on the "PolicyPlayground" page
    When I search for "Existing" policy
    And I select "Existing" policy for evaluation
    And I search for "Existing" resource
    And I select "Existing" resource for evaluation
    When the resource fails the policy
    Then I see "FailedEvaluation" message

  Scenario: Policy Evaluation - unexpected errors
    Given I am on the "PolicyPlayground" page
    When I search for "Existing" policy
    And I select "Existing" policy for evaluation
    And I search for "Existing" resource
    And I select "Existing" resource for evaluation
    When I evaluate and an error occurs
    Then I see "EvaluationError" message