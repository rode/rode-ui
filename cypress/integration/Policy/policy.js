import { Before, Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import * as selectors from "../../pages/policy";
import policies from "../../fixtures/policies.json";
import Chance from "chance";
import { mockFailedPolicyValidation, mockSuccessPolicyValidation } from "../../mock-responses/policy-responses";

const chance = new Chance();

let updatedPolicyName;

Before({ tags: "@updatePolicy" }, () => {
  updatedPolicyName = chance.string();
});

Given(/^I am on the "([^"]*)" policy details page$/, (policyName) => {
  cy.mockRequest(
    { url: "**/api/policies/*", method: "GET" },
    policies[policyName]
  );
  cy.visit(`/policies/${policies[policyName].id}`);
});

When(/^I search for "([^"]*)" policy$/, (searchTerm) => {
  if (policies[searchTerm]) {
    cy.mockRequest({ url: "**/api/policies*", method: "GET" }, [
      policies[searchTerm],
    ]);
  }
  cy.get(selectors.PolicySearchInput).focus().clear().type(searchTerm);
  cy.get(selectors.PolicySearchButton).click();
});


When(/^I test invalid rego policy code$/, () => {
    cy.mockRequest({
      url: "**/api/policies/validate", method: "POST"
    }, mockFailedPolicyValidation);

  cy.get(selectors.PolicyRegoInput).clear().type(`Package ${chance.word()}`);
  cy.get(selectors.ValidatePolicyButton).click();
});

When(/^I test valid rego policy code$/, () => {
    cy.mockRequest({
      url: "**/api/policies/validate", method: "POST"
    }, mockSuccessPolicyValidation);

  cy.get(selectors.PolicyRegoInput).clear().type(`Package ${chance.word()}`);
  cy.get(selectors.ValidatePolicyButton).click();
});

When(/^I create the "([^"]*)" policy$/, (policyName) => {
  const policy = policies[policyName];
  cy.mockRequest(
    { url: `**/api/policies`, method: "POST" },
    policy
  );
  cy.get(selectors.PolicyNameInput).clear().type(policy.name);
  cy.get(selectors.PolicyDescriptionInput).clear().type(policy.description);
  cy.get(selectors.PolicyRegoInput).clear().type(policy.regoContent);
  cy.get(selectors.SavePolicyButton).click();
});

When(/^I update and save the "([^"]*)" policy name$/, (policyName) => {
  const policy = policies[policyName];
  const updatedPolicy = {
    ...policy,
    name: updatedPolicyName,
  };
  cy.mockRequest(
    { url: `**/api/policies/${policy.id}`, method: "PATCH" },
    updatedPolicy
  );
  cy.get(selectors.PolicyNameInput).clear().type(updatedPolicyName);
  cy.get(selectors.UpdatePolicyButton).click();
});

When("I confirm to delete the policy", () => {
  cy.mockRequest(
    { url: `**/api/policies/*`, method: "DELETE"},
    {}
  )
  cy.contains(selectors.DeletePolicyConfirmMessage).should("be.visible");
  cy.get(selectors.DeletePolicyModal).within(() => {
    cy.get(selectors.DeletePolicyButton).click()
  });
});

Then(/^I see "([^"]*)" policy search result$/, (policyName) => {
  const policy = policies[policyName];

  cy.contains(`Policy Name: ${policy.name}`).should("be.visible");
  cy.contains(`Description: ${policy.description}`).should("be.visible");
  cy.get(selectors.ViewPolicyButton).should("be.visible");
});

Then(/^I see "([^"]*)" policy details$/, (policyName) => {
  const policy = policies[policyName];
  cy.contains(policy.name).should("be.visible");
  cy.contains(policy.description).should("be.visible");
  cy.contains(policy.regoContent).should("be.visible");
  cy.get(selectors.EditPolicyButton).should("be.visible");
  cy.get(selectors.EvaluatePlaygroundButton).should("be.visible");
});

Then(/^I see the updated "([^"]*)" policy name$/, (policyName) => {
  const policy = policies[policyName];
  cy.url().should("match", new RegExp(`/policies/${policy.id}`));

  cy.contains(policy.name).should("not.exist");
  cy.contains(updatedPolicyName).should("be.visible");
});

Then(
  /^I see the Edit Policy form for "([^"]*)" policy$/,
  (policyName) => {
    const form = selectors.EditPolicyForm;
    const policy = policies[policyName];

    cy.url().should("match", new RegExp(`/policies/${policy.id}/edit`));

    form.fields.forEach((field) => {
      cy.get(field).should("have.value", policy[field.slice(1)]);
    });
    form.buttons.forEach((button) => {
      cy.get(button).should("be.visible");
    });
  }
);
