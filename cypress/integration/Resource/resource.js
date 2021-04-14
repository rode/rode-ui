import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import resources from "../../fixtures/resources.json";
import * as selectors from "../../page-objects/resource";

Given(/^I am on the "([^"]*)" resource details page$/, (resourceName) => {
  cy.mockRequest(
    { url: "**/api/occurrences*", method: "GET" },
    resources[resourceName].occurrences
  );
  cy.visit(`/resources/${encodeURIComponent(resources[resourceName].uri)}`);
});

When(/^I click on ([^"]*) occurrence$/, (occurrenceType) => {
  const occurrenceName = `${occurrenceType}Occurrence`;
  cy.contains(selectors[occurrenceName]).click();
});

Then(/^I see "([^"]*)" Build occurrence details$/, (resourceName) => {
  cy.get(selectors.ShowJsonButton).should("be.visible");

  const resource = resources[resourceName];
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

  const resource = resources[resourceName];
  resource.occurrences.secure.forEach((scan) => {
    cy.contains(`${scan.vulnerabilities.length} vulnerabilities found`).should(
      "be.visible"
    );

    scan.vulnerabilities.forEach((vulnerability) => {
      cy.contains(`Package: ${vulnerability.packageName}`).should("be.visible");
      cy.contains(`Description: ${vulnerability.description}`).should(
        "be.visible"
      );
      if (vulnerability.effectiveSeverity === "SEVERITY_UNSPECIFIED") {
        cy.contains("Severity N/A").should("be.visible");
      } else {
        cy.contains(`Severity ${vulnerability.effectiveSeverity}`).should(
          "be.visible"
        );
      }
    });
  });
});

Then(/^I see "([^"]*)" Deployment occurrence details$/, (resourceName) => {
  cy.get(selectors.ShowJsonButton).should("be.visible");

  const resource = resources[resourceName];
  resource.occurrences.deploy.forEach((deployment) => {
    cy.contains(`Deployed to ${deployment.platform}`).should("be.visible");
    cy.contains(
      `Resources Deployed: ${deployment.resourceUris.join(", ")}`
    ).should("be.visible");
  });
});

Then(/^I see "([^"]*)" resource search result$/, (resourceName) => {
  const resource = resources[resourceName];

  cy.contains(`Resource Name: ${resource.resourceName}`).should("be.visible");
  cy.contains(`Version: ${resource.resourceVersion}`).should("be.visible");
  cy.get(selectors.ViewResourceButton).should("be.visible");
});

Then(/^I see "([^"]*)" resource details$/, (resourceName) => {
  const resource = resources[resourceName];

  cy.url().should("contain", `/resources/${encodeURIComponent(resource.uri)}`);
  cy.contains(resource.resourceName).should("be.visible");
  cy.contains(resource.resourceVersion).should("be.visible");
  cy.get(selectors.EvaluateResourceInPlaygroundButton).should("be.visible");
});
