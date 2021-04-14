import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";
import * as navigation from "../../pages/navigation";
import * as selectors from "../../pages/index";

Given("I open the application", () => {
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

When(/^I click the "([^"]*)" button$/, (buttonName) => {
  const button = `${buttonName}Button`;
  cy.get(selectors[button]).click();
});

When(/^I type "([^"]*)" into "([^"]*)" input$/, (text, inputName) => {
  const input = `${inputName}Input`;
  cy.get(selectors[input]).type(text);
});

Then(/^I see "([^"]*)"$/, (element) => {
  cy.get(selectors[element]).should("be.visible");
});

Then(/^I see "([^"]*)" message$/, (messageName) => {
  const message = `${messageName}Message`;
  cy.contains(selectors[message]).should("be.visible");
});

Then(/^I no longer see "([^"]*)" message$/, (messageName) => {
  const message = `${messageName}Message`;
  cy.contains(selectors[message]).should("not.exist");
});

Then(/^I see the "([^"]*)" form$/, (formName) => {
  const form = selectors[`${formName}Form`];

  form.fields.forEach((field) => {
    cy.get(field).should("be.visible");
  });
  form.buttons.forEach((button) => {
    cy.get(button).should("be.visible");
  });
});
