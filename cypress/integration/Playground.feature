Feature: Policy Playground

  Scenario: Successful Policy Evaluation
    Given I am on the "PolicyPlayground" page
    When I search for "Existing" policy
    And I select "Existing" policy for evaluation
    And I search for "Existing" resource
    And I select "Existing" resource for evaluation
    When I click the "EvaluatePlayground" button
    Then I see "SuccessfulEvaluation" message

  Scenario: Failed Policy Evaluation
    Given I am on the "PolicyPlayground" page
    When I search for "Existing" policy
    And I select "Existing" policy for evaluation
    And I search for "Existing" resource
    And I select "Existing" resource for evaluation
    When I click the "EvaluatePlayground" button
    Then I see "FailedEvaluation" message
#    How do signal failed vs passing evaluation