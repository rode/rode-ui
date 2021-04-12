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

import { mockMappedPolicy } from "../../mock-responses/policy-responses";

context("Policy Search", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[aria-label="Toggle Navigation"]').click();
    cy.get('a[href="/policies"]').click();
    cy.url().should("match", /\/policies$/);
  });

  it("should search for a policy that does not exist", () => {
    cy.mockRequest({ url: "**/api/policies*" }, []);

    cy.searchForPolicy("not a match");
    cy.contains("No policies found");
  });

  it("should search for a policy that does exist", () => {
    cy.mockRequest({ url: "**/api/policies*" }, mockMappedPolicy);

    cy.searchForPolicy("policy");
    cy.url().should("contain", "search=policy");

    cy.contains("View Policy");
  });

  it("should show policy details when a policy is selected", () => {
    const { name, description, regoContent } = mockMappedPolicy[0];
    cy.mockRequest({ url: "**/api/policies*" }, mockMappedPolicy);
    cy.mockRequest({ url: "**/api/policies/*" }, mockMappedPolicy[0]);

    cy.searchForPolicy("policy");
    cy.contains("View Policy").click();

    cy.contains(name).should("be.visible");
    cy.contains(description).should("be.visible");
    cy.contains(regoContent).should("be.visible");
  });
});
