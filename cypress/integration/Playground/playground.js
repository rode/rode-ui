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

When(/^I select "([^"]*)" resource version for evaluation$/, () => {
  cy.get(selectors.SelectResourceVersionButton).click();
});

When(/^the resource (?:(passes|fails)) the policy$/i, (passOrFail) => {
  cy.mockRequest(
    { url: "**/api/policies/**/attest", method: "POST" },
    passOrFail === "passes"
      ? mockSuccessPolicyEvaluation
      : mockFailedPolicyEvaluation
  );
  cy.get(selectors.EvaluatePlaygroundButton).click();
});

When(
  /^I open the (?:(policy|resource)) search drawer$/i,
  (policyOrResource) => {
    let selector = selectors.OpenPolicySearchDrawerButton;
    if (policyOrResource === "resource") {
      selector = selectors.OpenResourceSearchDrawerButton;
    }
    cy.get(selector).click();
  }
);

When("I evaluate and an error occurs", () => {
  cy.mockRequest(
    { url: "**/api/policies/**/attest", method: "POST", status: 500 },
    mockFailedPolicyEvaluation
  );
  cy.get(selectors.EvaluatePlaygroundButton).click();
});
