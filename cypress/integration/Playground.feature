Feature: Policy Playground

  @smoke
  Scenario Outline: Successful Policy Evaluation
    Given I am on the "PolicyPlayground" page
    When I open the policy search drawer
    And I search for an "Existing" policy
    And I select "Existing" policy for evaluation
    And I open the resource search drawer
    And I search for "Existing" resource
    And I select "Existing" resource for evaluation
    And I search for "Existing" resource version
    And I select "Existing" resource version for evaluation
    When the resource <outcome> the policy
    Then I see "<message>" message
    Scenarios:
    | outcome | message |
    | passes | SuccessfulEvaluation |
    | fails | FailedEvaluation |

  Scenario: Policy Evaluation - unexpected errors
    Given I am on the "PolicyPlayground" page
    When I open the policy search drawer
    And I search for an "Existing" policy
    And I select "Existing" policy for evaluation
    And I open the resource search drawer
    And I search for "Existing" resource
    And I select "Existing" resource for evaluation
    And I search for "Existing" resource version
    And I select "Existing" resource version for evaluation
    When I evaluate and an error occurs
    Then I see "EvaluationError" message