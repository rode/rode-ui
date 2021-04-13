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
import { mockMappedResource } from "../../mock-responses/resource-responses";

context("Policy Playground", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[aria-label="Toggle Navigation"]').click();
    cy.contains("Policy Playground").click();
    cy.url().should("match", /\/playground/);
  });

  it("should allow the user to do an evaluation", () => {
    cy.mockRequest(
      { url: "**/api/resources*", method: "GET" },
      mockMappedResource
    );
    cy.mockRequest(
      { url: "**/api/policies*", method: "GET" },
      mockMappedPolicy
    );

    cy.searchForResource("hello");
    cy.contains("Select Resource").click();
    cy.searchForPolicy("policy name");
    cy.contains("Select Policy").click();

    cy.contains("Evaluate").click();

    cy.contains(/^the resource (?:passed|failed) the policy./i).should(
      "be.visible"
    );
  });
});
