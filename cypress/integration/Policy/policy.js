import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import * as selectors from "../../pages/policy";
import policies from "../../fixtures/policies.json";

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
  cy.get("#policySearch").focus().clear().type(searchTerm);
  cy.get('button[aria-label="Search Policies"]').click();
});

Then(/^I see "([^"]*)"$/, (element) => {
  cy.get(selectors[element]).should("be.visible");
});

Then(/^I see "([^"]*)" search result$/, (policyName) => {
  const policy = policies[policyName];

  cy.contains(`Policy Name: ${policy.name}`).should("be.visible");
  cy.contains(`Description: ${policy.description}`).should("be.visible");
  cy.contains("View Policy").should("be.visible");
});

Then(/^I see "([^"]*)" message$/, (messageName) => {
  cy.contains(selectors[messageName]).should("be.visible");
});

Then(/^I see "([^"]*)" policy details$/, (policyName) => {
  const policy = policies[policyName];
  cy.contains(policy.name).should("be.visible");
  cy.contains(policy.description).should("be.visible");
  cy.contains(policy.regoContent).should("be.visible");
  cy.contains("Edit Policy").should("be.visible");
  cy.contains("Evaluate in Policy Playground").should("be.visible");
});

Then(
  /^I see the "([^"]*)" form for "([^"]*)" policy$/,
  (formName, policyName) => {
    const form = selectors[`${formName}Form`];
    const policy = policies[policyName];

    cy.url().should("match", new RegExp(`/policies/${policy.id}/edit`));

    form.fields.forEach((field) => {
      cy.contains(field.label).should("be.visible");
      cy.get(field.selector).should(
        "have.value",
        policy[field.selector.slice(1)]
      );
    });
    form.buttons.forEach((button) => {
      cy.contains(button).should("be.visible");
    });
  }
);
