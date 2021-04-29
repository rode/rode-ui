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

import { Before, Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import * as selectors from "../../page-objects/policy";
import policies from "../../fixtures/policies.json";
import Chance from "chance";
import {
  mockFailedPatchPolicyResponse,
  mockFailedPolicyValidation,
  mockSuccessPolicyValidation,
} from "../../mock-responses/policy-responses";
import { capitalize } from "../../page-objects/utils";

const chance = new Chance();

let updatedValues;

Before({ tags: "@updatePolicy" }, () => {
  updatedValues = {
    name: chance.string(),
    description: chance.sentence(),
    regoContent:
      'package testPackage\npass = true\n\nviolations[result] {\n    result:={\n        "pass": true\n        }\n}',
  };
});

Given(/^I am on the "([^"]*)" policy details page$/, (policyName) => {
  cy.mockRequest(
    { url: "**/api/policies/*", method: "GET" },
    policies[policyName].data[0]
  );
  cy.visit(`/policies/${policies[policyName].data[0].id}`);
});

When(/^I test (?:(valid|invalid)) Rego policy code$/, (validity) => {
  cy.mockRequest(
    {
      url: "**/api/policies/validate",
      method: "POST",
    },
    validity === "invalid"
      ? mockFailedPolicyValidation
      : mockSuccessPolicyValidation
  );

  cy.get(selectors.PolicyRegoContentInput)
    .clear()
    .type(`Package ${chance.word()}`);
  cy.get(selectors.ValidatePolicyButton).click();
});

When(/^I create the "([^"]*)" policy$/, (policyName) => {
  const policy = policies[policyName].data[0];
  cy.mockRequest({ url: `**/api/policies`, method: "POST" }, policy);
  cy.get(selectors.PolicyNameInput).clear().type(policy.name);
  cy.get(selectors.PolicyDescriptionInput).clear().type(policy.description);
  cy.get(selectors.PolicyRegoContentInput).clear().type(policy.regoContent);
  cy.get(selectors.SavePolicyButton).click();
});

When(
  /^I update and save the "([^"]*)" policy ([^"]*)$/,
  (policyName, field) => {
    const policy = policies[policyName].data[0];
    const updatedPolicy = {
      ...policy,
      [field]: updatedValues[field],
    };
    cy.mockRequest(
      { url: `**/api/policies/${policy.id}`, method: "PATCH" },
      updatedPolicy
    );
    const selectorName = `Policy${capitalize(field)}Input`;
    cy.get(selectors[selectorName]).clear().type(updatedValues[field]);
    cy.get(selectors.UpdatePolicyButton).click();
  }
);

When("I save the Edit Policy form and an error occurs", () => {
  cy.mockRequest(
    { url: `**/api/policies/**`, method: "PATCH", status: 500 },
    {}
  );
  cy.get(selectors.UpdatePolicyButton).click();
});

When("I save invalid rego code", () => {
  cy.mockRequest(
    { url: `**/api/policies/**`, method: "PATCH", status: 500 },
    mockFailedPatchPolicyResponse
  );
  cy.get(selectors.PolicyRegoContentInput).clear().type(chance.string());
  cy.get(selectors.UpdatePolicyButton).click();
});

When("I confirm to delete the policy", () => {
  cy.mockRequest({ url: `**/api/policies/*`, method: "DELETE" }, {});
  cy.contains(selectors.DeletePolicyConfirmMessage).should("be.visible");
  cy.get(selectors.DeletePolicyModal).within(() => {
    cy.get(selectors.DeletePolicyButton).click();
  });
});

When("I confirm to delete the policy and an error occurs", () => {
  cy.mockRequest(
    { url: `**/api/policies/*`, method: "DELETE", status: 500 },
    {}
  );
  cy.contains(selectors.DeletePolicyConfirmMessage).should("be.visible");
  cy.get(selectors.DeletePolicyModal).within(() => {
    cy.get(selectors.DeletePolicyButton).click();
  });
});

Then(/^I see "([^"]*)" policy search result$/, (policyName) => {
  const policy = policies[policyName].data[0];

  cy.contains(`Policy Name: ${policy.name}`).should("be.visible");
  cy.contains(`Description: ${policy.description}`).should("be.visible");
  cy.get(selectors.ViewPolicyButton).should("be.visible");
});

Then(/^I see "([^"]*)" policy details$/, (policyName) => {
  const policy = policies[policyName].data[0];
  cy.url().should("contain", `/policies/${encodeURIComponent(policy.id)}`);

  cy.contains(policy.name).should("be.visible");
  cy.contains(policy.description).should("be.visible");
  cy.contains(policy.regoContent).should("be.visible");
  cy.get(selectors.EditPolicyButton).should("be.visible");
  cy.get(selectors.EvaluatePolicyInPlaygroundButton).should("be.visible");
});

Then(/^I see the updated "([^"]*)" policy ([^"]*)$/, (policyName, field) => {
  const policy = policies[policyName].data[0];
  cy.url().should("match", new RegExp(`/policies/${policy.id}`));

  cy.contains(policy[field]).should("not.exist");
  cy.contains(updatedValues[field]).should("be.visible");
});

Then(/^I see the Edit Policy form for "([^"]*)" policy$/, (policyName) => {
  const form = selectors.EditPolicyForm;
  const policy = policies[policyName].data[0];

  cy.url().should("match", new RegExp(`/policies/${policy.id}/edit`));

  form.fields.forEach((field) => {
    cy.get(field).should("have.value", policy[field.slice(1)]);
  });
  form.buttons.forEach((button) => {
    cy.get(button).should("be.visible");
  });
});
