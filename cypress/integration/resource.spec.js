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

import {
  mockMappedOccurrences,
  mockMappedResource,
} from "../mock-responses/resource-responses";

context("Resources", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('a[href="/resources"]').click();
    cy.url().should("match", /\/resources$/);
  });

  it("should search for a resource that does not exist", () => {
    cy.intercept("**/api/resources*", []);
    cy.searchForResource("not a match");
    cy.contains("No resources found");
  });

  it("should search for a resource that does exist", () => {
    cy.intercept("**/api/resources*", mockMappedResource);

    cy.searchForResource("alpine");
    cy.url().should("contain", "search=alpine");

    cy.contains("View Details");
  });

  it("should show resource details when a resource is selected", () => {
    cy.intercept("**/api/resources*", mockMappedResource);
    cy.intercept("**/api/occurrences*", mockMappedOccurrences);

    cy.searchForResource("nginx");
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
