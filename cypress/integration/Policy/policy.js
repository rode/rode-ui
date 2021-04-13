import { When, Then } from "cypress-cucumber-preprocessor/steps";
import * as selectors from "../../pages/policy";
import policies from "../../fixtures/policies.json";

When(/^I search for "([^"]*)" policy$/, (searchTerm) => {
  if (policies[searchTerm]) {
    cy.mockRequest(
      { url: "**/api/policies*", method: "GET" },
      [policies[searchTerm]]
    );
  }
  cy.get("#policySearch").focus().clear().type(searchTerm);
  cy.get('button[aria-label="Search Policies"]').click();
});

Then(/^I see "([^"]*)"$/, (element) => {
  cy.get(selectors[element]).should("be.visible");
});

Then(/^I see "([^"]*)" search result$/, (policyName) => {
  cy.contains(`Policy Name: ${policies[policyName].name}`).should("be.visible");
  cy.contains(`Description: ${policies[policyName].description}`).should(
    "be.visible"
  );
  cy.contains("View Policy").should("be.visible");
});

Then(/^I see "([^"]*)" message$/, (messageName) => {
  cy.contains(selectors[messageName]).should("be.visible");
});
