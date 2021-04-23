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

import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import resources from "../../fixtures/resources.json";
import * as selectors from "../../page-objects/resource";

Given(/^I am on the "([^"]*)" resource details page$/, (resourceName) => {
  cy.mockRequest(
    { url: "**/api/occurrences*", method: "GET" },
    resources[resourceName].data[0].occurrences
  );
  cy.visit(
    `/resources/${encodeURIComponent(resources[resourceName].data[0].uri)}`
  );
});

When(/^I click on ([^"]*) occurrence$/, (occurrenceType) => {
  const occurrenceName = `${occurrenceType}Occurrence`;
  cy.contains(selectors[occurrenceName]).click();
});

Then(/^I see "([^"]*)" Build occurrence details$/, (resourceName) => {
  cy.get(selectors.ShowJsonButton).should("be.visible");

  const resource = resources[resourceName].data[0];
  resource.occurrences.build.forEach((build) => {
    cy.contains(build.creator).should("be.visible");

    build.artifacts.forEach((artifact) => {
      cy.contains(artifact.checksum).should("be.visible");
      cy.contains(artifact.id).should("be.visible");
      cy.contains(artifact.names.join(", ")).should("be.visible");
    });
  });
});

Then(/^I see "([^"]*)" Vulnerability occurrence details$/, (resourceName) => {
  cy.get(selectors.ShowJsonButton).should("be.visible");

  const resource = resources[resourceName].data[0];
  resource.occurrences.secure.forEach((scan) => {
    cy.contains(`${scan.vulnerabilities.length} vulnerabilities found`).should(
      "be.visible"
    );

    scan.vulnerabilities.forEach((vulnerability) => {
      cy.contains(`Package: ${vulnerability.packageName}`).should("be.visible");
      if (vulnerability.effectiveSeverity === "SEVERITY_UNSPECIFIED") {
        cy.contains("Severity N/A").should("be.visible");
      } else {
        cy.contains(`Severity ${vulnerability.effectiveSeverity}`).should(
          "be.visible"
        );
      }

      cy.contains(`Package: ${vulnerability.packageName}`).click();

      cy.contains(`Description: ${vulnerability.description}`).should(
        "be.visible"
      );
    });
  });
});

Then(/^I see "([^"]*)" Deployment occurrence details$/, (resourceName) => {
  cy.get(selectors.ShowJsonButton).should("be.visible");

  const resource = resources[resourceName].data[0];
  resource.occurrences.deploy.forEach((deployment) => {
    cy.contains(`Deployed to ${deployment.platform}`).should("be.visible");
    cy.contains(
      `Resources Deployed: ${deployment.resourceUris.join(", ")}`
    ).should("be.visible");
  });
});

Then(/^I see "([^"]*)" resource search result$/, (resourceName) => {
  const resource = resources[resourceName].data[0];

  cy.contains(`Resource Name: ${resource.resourceName}`).should("be.visible");
  cy.contains(`Version: ${resource.resourceVersion}`).should("be.visible");
  cy.get(selectors.ViewResourceButton).should("be.visible");
});

Then(/^I see "([^"]*)" resource details$/, (resourceName) => {
  const resource = resources[resourceName].data[0];

  cy.url().should("contain", `/resources/${encodeURIComponent(resource.uri)}`);
  cy.contains(resource.resourceName).should("be.visible");
  cy.contains(resource.resourceVersion).should("be.visible");
  cy.get(selectors.EvaluateResourceInPlaygroundButton).should("be.visible");
});
