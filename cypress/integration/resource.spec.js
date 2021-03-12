import { mockResource, mockResourceOccurrences } from "cypress/mock-responses/resource-responses";

const RODE_URL = "http://localhost:50054/v1alpha1";

context('Resources', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('a[href="/resources"]').click();
    cy.url().should('match', /\/resources$/);
  });

  it("should search for a resource that does not exist", () => {
    cy.intercept(`${RODE_URL}/resources`, {});
    cy.get('#resourceSearch').focus().type('not a match');
    cy.get('button[aria-label="Search"]').click();
    cy.contains('No resources found');
  });

  it("should search for a resource that does exist", () => {
    cy.intercept(`${RODE_URL}/resources`, mockResource);
    cy.get('#resourceSearch').focus().type('nginx');
    cy.get('button[aria-label="Search"]').click();
    cy.contains('View Details');
  });

  it("should show resource details when a resource is selected", () => {
    cy.intercept(`${RODE_URL}/resources`, mockResourceOccurrences);

    cy.get('#resourceSearch').focus().type('nginx');
    cy.get('button[aria-label="Search"]').click();
    cy.contains('View Details').click();

    cy.contains('Produced 1 Artifact').click();
    cy.get('button[aria-label="Show JSON"]').click();
    cy.get('pre').should('be.visible');
    cy.get('code').should('be.visible');

    cy.contains('Vulnerability Scan').click();
    cy.contains('Package: apt').should('be.visible');

    cy.contains('Deployment to CUSTOM').click();
    cy.contains('Deployed to CUSTOM').should('be.visible');
  });
});