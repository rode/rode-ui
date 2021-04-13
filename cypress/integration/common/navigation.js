import {When, Given} from "cypress-cucumber-preprocessor/steps";
import * as navigation from "../../pages/navigation";

Given('I open the application', () => {
  cy.visit("/");
});

Given(/^I am on the "([^"]*)" page$/, (pageName) => {
  cy.visit(navigation[pageName].href);
});

When(/^I navigate to the "([^"]*)" page$/, (pageName) => {
  cy.get('[aria-label="Toggle Navigation"]').click();
  cy.contains(navigation[pageName].label).click();
  cy.url().should("match", new RegExp(navigation[pageName].href));
});