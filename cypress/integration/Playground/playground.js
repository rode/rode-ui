import { When } from "cypress-cucumber-preprocessor/steps";
import * as selectors from "../../page-objects/playground";
import {
  mockFailedPolicyEvaluation,
  mockSuccessPolicyEvaluation,
} from "../../mock-responses/policy-responses";

When(/^I select "([^"]*)" policy for evaluation$/, () => {
  cy.get(selectors.SelectPolicyButton).click();
});

When(/^I select "([^"]*)" resource for evaluation$/, () => {
  cy.get(selectors.SelectResourceButton).click();
});

When("the resource passes the policy", () => {
  cy.mockRequest(
    { url: "**/api/policies/**/attest", method: "POST" },
    mockSuccessPolicyEvaluation
  );
  cy.get(selectors.EvaluatePlaygroundButton).click();
});

When("the resource fails the policy", () => {
  cy.mockRequest(
    { url: "**/api/policies/**/attest", method: "POST" },
    mockFailedPolicyEvaluation
  );
  cy.get(selectors.EvaluatePlaygroundButton).click();
});

When("I evaluate and an error occurs", () => {
  cy.mockRequest(
    { url: "**/api/policies/**/attest", method: "POST", status: 500 },
    mockFailedPolicyEvaluation
  );
  cy.get(selectors.EvaluatePlaygroundButton).click();
});
