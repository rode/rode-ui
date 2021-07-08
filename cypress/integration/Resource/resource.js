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
  const resource = resources[resourceName].data[0];
  cy.mockRequest(
    { url: "**/api/occurrences*", method: "GET" },
    resource.occurrences
  );

  cy.mockRequest(
    { url: "**/api/resources/**/resource-evaluations*", method: "GET" },
    { data: resource.evaluations }
  );

  cy.mockRequest(
    { url: "**/api/resource-versions*", method: "GET" },
    { data: resource.versions }
  );
  cy.visit(`/resources/${encodeURIComponent(resource.uri)}`);
});

When(/^I click on ([^"]*) occurrence$/, (occurrenceType) => {
  const occurrenceName = `${occurrenceType}Occurrence`;
  cy.contains(selectors[occurrenceName]).click();
});

When(
  /^I click the search result to view the "([^"]*)" resource$/,
  (resourceName) => {
    const resource = resources[resourceName].data[0];
    cy.mockRequest(
      { url: "**/api/resource-versions*", method: "GET" },
      { data: resource.versions }
    );

    cy.get(selectors.ViewResourceButton).click();
  }
);

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
      cy.contains(vulnerability.packageName).should("be.visible");
      if (vulnerability.effectiveSeverity === "SEVERITY_UNSPECIFIED") {
        cy.contains("Severity N/A").should("be.visible");
      } else {
        cy.contains("Severity").should("be.visible");
        cy.contains(vulnerability.effectiveSeverity).should("be.visible");
      }

      cy.contains(vulnerability.packageName).click();

      cy.contains(vulnerability.description).should("be.visible");
    });
  });
});

Then(/^I see "([^"]*)" Deployment occurrence details$/, (resourceName) => {
  cy.get(selectors.ShowJsonButton).should("be.visible");

  const resource = resources[resourceName].data[0];
  resource.occurrences.deploy.forEach((deployment) => {
    cy.contains(deployment.platform).should("be.visible");
    cy.contains(deployment.resourceUris.join(", ")).should("be.visible");
  });
});

Then(/^I see "([^"]*)" resource search result$/, (resourceName) => {
  const resource = resources[resourceName].data[0];

  cy.contains(resource.resourceName).should("be.visible");
  cy.contains(resource.resourceVersion.substring(0, 12)).should("be.visible");
  cy.get(selectors.ViewResourceButton).should("be.visible");
});

Then(/^I see "([^"]*)" resource details$/, (resourceName) => {
  const resource = resources[resourceName].data[0];
  cy.mockRequest(
    { url: "**/api/occurrences*", method: "GET" },
    resource.occurrences
  );
  cy.mockRequest(
    { url: "**/api/resource-versions*", method: "GET" },
    resource.versions
  );

  cy.url().should("contain", `/resources/${encodeURIComponent(resource.uri)}`);
  cy.contains("h1", resource.resourceName).should("be.visible");
  cy.contains(resource.type).should("be.visible");
  cy.get("span")
    .contains(resource.resourceVersion.substring(0, 12))
    .should("be.visible");
  cy.get(selectors.EvaluateResourceInPlaygroundButton).should("be.visible");
});

Then(/^I see evaluation history details$/, () => {
  cy.url().should("contain", "#evaluationHistory");

  const evaluation = resources.Existing.data[0].evaluations[0];

  cy.get('[data-testid="toggleCard"]')
    .click()
    .within(() => {
      cy.contains(evaluation.policyGroup).should("be.visible");
      cy.contains(evaluation.policyEvaluations[0].policyName).should(
        "be.visible"
      );
    });
});

Then(/^I see the available resource versions$/, () => {
  const resourceVersion = resources.Existing.data[0].versions[0];

  cy.get('[data-testid="drawer"]').within(() => {
    cy.contains(resourceVersion.versionedResourceUri.substring(0, 12)).should(
      "be.visible"
    );
    resourceVersion.aliases.forEach((alias) => {
      const trimmedAlias = alias.split(":")[1];
      cy.contains(trimmedAlias).should("be.visible");
    });
  });
});
