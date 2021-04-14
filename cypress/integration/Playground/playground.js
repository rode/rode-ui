import { Before, Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import * as selectors from "../../page-objects/playground";
import policies from "../../fixtures/policies.json";
import Chance from "chance";

When(/^I select "([^"]*)" policy for evaluation$/, () => {
    cy.get(selectors.SelectPolicyButton).click();
});

When(/^I select "([^"]*)" resource for evaluation$/, () => {
    cy.get(selectors.SelectResourceButton).click()
});