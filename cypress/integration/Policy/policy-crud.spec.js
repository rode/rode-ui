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
