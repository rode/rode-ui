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
  mockFailedPolicyValidation,
  mockMappedPolicy,
  mockSuccessPolicyValidation,
} from "../mock-responses/policy-responses";

context("Policies", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('a[href="/policies"]').click();
    cy.url().should("match", /\/policies$/);
  });

  context("Policy Search", () => {
    it("should search for a policy that does not exist", () => {
      cy.mockRequest("**/api/policies*", []);

      cy.searchForPolicy("not a match");
      cy.contains("No policies found");
    });

    it("should search for a policy that does exist", () => {
      cy.mockRequest("**/api/policies*", mockMappedPolicy);

      cy.searchForPolicy("policy");
      cy.url().should("contain", "search=policy");

      cy.contains("View Policy");
    });

    it("should show policy details when a policy is selected", () => {
      cy.mockRequest("**/api/policies*", mockMappedPolicy);
      cy.mockRequest("**/api/policies/*", mockMappedPolicy[0]);

      cy.searchForPolicy("policy");
      cy.contains("View Policy").click();

      cy.contains("My Policy Name").should("be.visible");
      cy.contains("This is a policy description").should("be.visible");
      cy.contains("RegoRegoRego").should("be.visible");
    });
  });

  context("Policy Creation", () => {
    beforeEach(() => {
      cy.contains("Create New Policy").click();
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

    it("should validate invalid rego code", () => {
      cy.mockRequest("**/api/policies/validate", mockFailedPolicyValidation);
      cy.get("#regoContent").type("RegoRegoRego");
      cy.contains("Validate Policy").click();

      cy.contains("This policy failed validation").should("be.visible");
      cy.contains("Invalid rego code").should("be.visible");
    });

    it("should validate valid rego code", () => {
      cy.mockRequest("**/api/policies/validate", mockSuccessPolicyValidation);

      cy.get("#regoContent").type("package play");
      cy.contains("Validate Policy").click();

      cy.contains("This policy passes validation").should("be.visible");
    });

    it("should redirect you to the created policy page when creation is successful", () => {
      cy.mockRequest("**/api/policies", mockMappedPolicy[0]);
      cy.mockRequest("**/api/policies/*", mockMappedPolicy[0]);

      cy.get("#name").type("Test Policy");
      cy.get("#description").type("Testing policy creation through Cypress");
      cy.get("#regoContent").type("package play");
      cy.contains("Save Policy").click();

      cy.url().should("match", /\/policies\/12345678910/);
    });
  });
});
