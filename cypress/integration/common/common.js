/**
 * Copyright 2021 The Rode Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";
import * as navigation from "../../page-objects/navigation";
import * as selectors from "../../page-objects/index";
import policies from "../../fixtures/policies.json";
import resources from "../../fixtures/resources.json";

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

When(/^I clear the "([^"]*)" input$/, (inputName) => {
  const input = `${inputName}Input`;
  cy.get(selectors[input]).clear();
});

When(/^I type "([^"]*)" into "([^"]*)" input$/, (text, inputName) => {
  const input = `${inputName}Input`;
  cy.get(selectors[input]).type(text);
});

When(/^I search for (?:a|an) "([^"]*)" policy$/, (searchTerm) => {
  if (policies[searchTerm]) {
    cy.mockRequest(
      { url: "**/api/policies*", method: "GET" },
      policies[searchTerm]
    );
  }
  cy.get(selectors.PolicySearchInput).focus().clear().type(searchTerm);
  cy.get(selectors.SearchPolicyButton).click();
});

When(/^I search for "([^"]*)" resource$/, (searchTerm) => {
  if (resources[searchTerm]) {
    cy.mockRequest(
      { url: "**/api/resources*", method: "GET" },
      resources[searchTerm]
    );
  }
  cy.get(selectors.ResourceSearchInput).focus().clear().type(searchTerm);
  cy.get(selectors.SearchResourceButton).click();
});

When(/^I search for "([^"]*)" resource version$/, (resourceName) => {
  if (resources[resourceName]) {
    const resource = resources[resourceName].data[0];
    cy.mockRequest(
      { url: "**/api/resource-versions*", method: "GET" },
      { data: resource.versions }
    );
  }
  cy.get(selectors.ResourceVersionSearchInput)
    .focus()
    .clear()
    .type(resourceName);
  cy.get(selectors.SearchResourceVersionButton).click();
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


When(/^I select the ([^"]*) Section$/, (sectionName) => {
  const section = `${sectionName}Section`;
  cy.contains(selectors[section]).click();
});
