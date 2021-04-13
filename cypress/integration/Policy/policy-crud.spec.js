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
  mockFailedPatchPolicyResponse,
  mockFailedPolicyValidation,
  mockMappedPolicy,
  mockSuccessPolicyValidation,
} from "../../mock-responses/policy-responses";

context("Policy CRUD", () => {
  context("Policy Creation", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get('[aria-label="Toggle Navigation"]').click();
      cy.get('a[href="/policies/new"]').click();
      cy.url().should("match", /\/policies\/new/);
    });

    it("should show validation errors when you submit an empty form", () => {
      cy.contains("Save Policy").click();

      cy.contains("Policy Name is a required field").should("be.visible");
      cy.contains("Rego Policy Code is a required field").should("be.visible");
    });

    it("should remove the errors while you fill out the fields", () => {
      cy.get("#name").type("Policy Name");
      cy.get("#regoContent").type("RegoRegoRego");
      cy.get("#description").focus();

      cy.contains("Policy Name is a required field").should("not.exist");
      cy.contains("Rego Policy Code is a required field").should("not.exist");
    });

    it("should display an error when the rego code is invalid", () => {
      cy.mockRequest(
        { url: "**/api/policies/validate", method: "POST" },
        mockFailedPolicyValidation
      );

      cy.get("#regoContent").type("RegoRegoRego");
      cy.contains("Validate Policy").click();

      cy.contains("This policy failed validation").should("be.visible");
      cy.contains("Invalid rego code").should("be.visible");
    });

    it("should display a message when the rego code is valid", () => {
      cy.mockRequest(
        { url: "**/api/policies/validate", method: "POST" },
        mockSuccessPolicyValidation
      );

      cy.get("#regoContent").type("package play");
      cy.contains("Validate Policy").click();

      cy.contains("This policy passes validation").should("be.visible");
    });

    it("should redirect you to the created policy page when creation is successful", () => {
      cy.mockRequest(
        { url: "**/api/policies", method: "POST" },
        mockMappedPolicy[0]
      );
      cy.mockRequest({ url: "**/api/policies/*" }, mockMappedPolicy[0]);

      cy.get("#name").type("Test Policy");
      cy.get("#description").type("Testing policy creation through Cypress");
      cy.get("#regoContent").type("package play");
      cy.contains("Save Policy").click();

      cy.url().should(
        "match",
        new RegExp(`/policies/${mockMappedPolicy[0].id}`)
      );
    });
  });

  context("Edit a Policy", () => {
    beforeEach(() => {
      cy.mockRequest(
        { url: "**/api/policies/*", method: "GET" },
        mockMappedPolicy[0]
      );

      cy.visit(`/policies/${mockMappedPolicy[0].id}`);
      cy.contains("Edit Policy").click();

      cy.url().should(
        "match",
        new RegExp(`/policies/${mockMappedPolicy[0].id}/edit`)
      );
    });

    it("should not update the policy if the rego is invalid", () => {
      cy.mockRequest(
        { url: "**/api/policies/*", method: "PATCH", status: 500 },
        mockFailedPatchPolicyResponse
      );
      cy.get("#regoContent").type(" this is invalid rego code");
      cy.contains("Update Policy").click();

      cy.url().should(
        "match",
        new RegExp(`/policies/${mockMappedPolicy[0].id}/edit`)
      );
      cy.contains(
        "Failed to update the policy due to invalid Rego code."
      ).should("be.visible");
      cy.contains("This policy failed validation").should("be.visible");
    });

    it("should show an error if the update failed", () => {
      cy.mockRequest(
        { url: "**/api/policies/*", method: "PATCH", status: 500 },
        {}
      );
      cy.get("#regoContent").type(" this is invalid rego code");
      cy.contains("Update Policy").click();

      cy.url().should(
        "match",
        new RegExp(`/policies/${mockMappedPolicy[0].id}/edit`)
      );
      cy.contains("Failed to update the policy.").should("be.visible");
    });

    it("should allow the user to edit any field in the policy", () => {
      cy.mockRequest(
        { url: "**/api/policies/*", method: "PATCH" },
        mockMappedPolicy[0]
      );
      cy.get("#name").clear().type("My Updated Policy Name");
      cy.get("#description").type("This is an updated policy description");
      cy.get("#regoContent").type("package play");
      cy.contains("Update Policy").click();

      cy.url().should(
        "match",
        new RegExp(`/policies/${mockMappedPolicy[0].id}`)
      );
    });
  });

  context("Delete a Policy", () => {
    beforeEach(() => {
      cy.mockRequest(
        { url: "**/api/policies/*", method: "GET" },
        mockMappedPolicy[0]
      );

      cy.visit(`/policies/${mockMappedPolicy[0].id}`);
      cy.contains("Edit Policy").click();

      cy.url().should(
        "match",
        new RegExp(`/policies/${mockMappedPolicy[0].id}/edit`)
      );
    });

    it("should allow for a successful deletion", () => {
      cy.mockRequest(
        {
          url: "**/api/policies/*",
          method: "DELETE",
        },
        {}
      );
      cy.contains("Delete Policy").click();

      cy.contains("Are you sure you want to delete this policy?");
      cy.contains("Delete Policy").click();

      cy.url().should("match", /\/policies$/);
      cy.contains("Policy was successfully deleted.").should("be.visible");
    });

    it("should show an error if the delete failed", () => {
      cy.mockRequest(
        {
          url: "**/api/policies/*",
          method: "DELETE",
          status: 500,
        },
        {}
      );
      cy.contains("Delete Policy").click();

      cy.contains("Are you sure you want to delete this policy?");
      cy.contains("Delete Policy").click();

      cy.url().should(
        "match",
        new RegExp(`/policies/${mockMappedPolicy[0].id}/edit`)
      );
      cy.contains(
        "An error occurred while deleting the policy. Please try again."
      ).should("be.visible");
    });
  });
});
