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

import { Given, When, Then, Before } from "cypress-cucumber-preprocessor/steps";
import * as selectors from "../../page-objects/policy-group";
import policyGroups from "../../fixtures/policy-groups.json";
import policies from "../../fixtures/policies.json";
import Chance from "chance";

const chance = new Chance();
let updatedValues;

Before({ tags: "@updatePolicyGroup" }, () => {
  updatedValues = {
    description: chance.sentence(),
  };
});

Given(/^I am on the ([^"]*) policy group details page$/, (policyGroupName) => {
  cy.mockRequest(
    { url: "**/api/policy-groups/*", method: "GET" },
    policyGroups[policyGroupName].data[0]
  );

  cy.mockRequest(
    { url: "**/api/policy-groups/**/assignments*", method: "GET" },
    { data: policyGroups[policyGroupName].assignments }
  );
  cy.visit(`/policy-groups/${policyGroups[policyGroupName].data[0].name}`);
});

When(/^I create the "([^"]*)" policy group$/, (policyGroupName) => {
  const policyGroup = policyGroups[policyGroupName].data[0];
  cy.mockRequest({ url: `**/api/policy-groups`, method: "POST" }, policyGroup);
  cy.get(selectors.PolicyGroupNameInput).clear().type(policyGroup.name);
  cy.get(selectors.PolicyGroupDescriptionInput)
    .clear()
    .type(policyGroup.description);
  cy.get(selectors.SavePolicyGroupButton).click();
});

When(
  /^I update and save the ([^"]*) policy group description$/,
  (policyGroupName) => {
    const policyGroup = policyGroups[policyGroupName].data[0];
    const updatedPolicyGroup = {
      ...policyGroup,
      description: updatedValues.description,
    };
    cy.mockRequest(
      { url: `**/api/policy-groups/${policyGroup.name}`, method: "PATCH" },
      updatedPolicyGroup
    );
    cy.get(selectors.PolicyGroupDescriptionInput)
      .clear()
      .type(updatedPolicyGroup.description);
    cy.get(selectors.UpdatePolicyGroupButton).click();
  }
);

When(
  /^I assign the ([^"]*) policy to the ([^"]*) policy group$/,
  (policyName, policyGroupName) => {
    const policy = policies[policyName];
    const assignment = {
      ...policy.assignments[0],
      policyId: policy.data[0].id,
      policyVersion: policy.data[0].currentVersion,
      policyVersionCount: policy.data[0].currentVersion,
      policyName: policy.data[0].name,
    };
    cy.mockRequest(
      { url: "**/api/policy-groups/**/assignments*", method: "POST" },
      {
        data: assignment,
      }
    );
    cy.mockRequest(
      {
        url: `**/api/policy-groups/${policyGroupName}/assignments*`,
        method: "GET",
      },
      {
        data: {
          data: assignment,
        },
      }
    );
    cy.get(selectors.AssignToPolicyGroupButton).click();
  }
);

Then(
  /^I see the updated ([^"]*) policy group description$/,
  (policyGroupName) => {
    const policyGroup = policyGroups[policyGroupName].data[0];
    cy.url().should(
      "contain",
      `/policy-groups/${encodeURIComponent(policyGroup.name)}`
    );

    cy.contains(policyGroup.name).should("be.visible");
    cy.contains(updatedValues.description).should("be.visible");
    cy.get(selectors.EditPolicyGroupButton).should("be.visible");
  }
);

Then(/^I see the "([^"]*)" policy group details$/, (policyGroupName) => {
  const policyGroup = policyGroups[policyGroupName].data[0];
  cy.url().should(
    "contain",
    `/policy-groups/${encodeURIComponent(policyGroup.name)}`
  );

  cy.contains(policyGroup.name).should("be.visible");
  cy.contains(policyGroup.description).should("be.visible");
  cy.get(selectors.EditPolicyGroupButton).should("be.visible");
  cy.get(selectors.EditAssignmentsButton).should("be.visible");
});

Then(/^I see the policy groups dashboard$/, () => {
  cy.contains(selectors.PolicyGroupDashboardHeader).should("be.visible");
  cy.get(selectors.CreateNewPolicyGroupButton).should("be.visible");
});

Then(/^I see the Edit ([^"]*) Assignments page$/, (policyGroupName) => {
  const policyGroup = policyGroups[policyGroupName].data[0];
  cy.url().should(
    "contain",
    `/policy-groups/${encodeURIComponent(policyGroup.name)}/assignments`
  );

  cy.contains(policyGroup.name).should("be.visible");
  cy.contains(selectors.NoPolicyGroupAssignmentsMessage).should("be.visible");
});

Then(
  /^I see the ([^"]*) policy assigned to the ([^"]*) policy group$/,
  (policyName, policyGroupName) => {
    const policy = policies[policyName];

    cy.contains("Saved!").should("be.visible");

    cy.contains(policy.data[0].name).should("be.visible");
    cy.contains(policy.data[0].currentVersion).should("be.visible");
  }
);
