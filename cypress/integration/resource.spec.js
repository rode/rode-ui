import {
  mockResource,
  mockResourceOccurrences,
} from "../mock-responses/resource-responses";

context("Resources", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('a[href="/resources"]').click();
    cy.url().should("match", /\/resources$/);
  });

  it("should search for a resource that does not exist", () => {
    cy.intercept(`${Cypress.env("api_url")}/resources`, {});
    cy.get("#resourceSearch").focus().type("not a match");
    cy.get('button[aria-label="Search"]').click();
    cy.contains("No resources found");
  });

  it("should search for a resource that does exist", () => {
    cy.intercept(`${Cypress.env("api_url")}/resources`, mockResource);
    cy.get("#resourceSearch").focus().type("nginx");
    cy.get('button[aria-label="Search"]').click();
    cy.contains("View Details");
  });

  it("should show resource details when a resource is selected", () => {
    cy.intercept(
      `${Cypress.env("api_url")}/resources`,
      mockResourceOccurrences
    );

    cy.get("#resourceSearch").focus().type("nginx");
    cy.get('button[aria-label="Search"]').click();
    cy.contains("View Details").click();

    cy.get('button[class^="Occurrences_previewContainer"]').should(
      "have.length",
      5
    );

    cy.contains("Produced 1 Artifact").click();
    cy.get('button[aria-label="Show JSON"]').click();
    cy.get("pre").should("be.visible");
    cy.get("code").should("be.visible");

    cy.contains("Vulnerability Scan").click();
    cy.contains("Package: apt").should("be.visible");

    cy.contains("Deployment to CUSTOM").click();
    cy.contains("Deployed to CUSTOM").should("be.visible");
  });
});
