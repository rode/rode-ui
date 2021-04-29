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

import React from "react";
import { render, screen } from "test/testing-utils/renderer";
import DeploymentOccurrenceSection from "components/occurrences/DeploymentOccurrenceSection";
import { createMockMappedDeploymentOccurrence } from "test/testing-utils/mocks";

describe("DeploymentOccurrenceSection", () => {
  let occurrences;

  it("should return null if there are no relevant occurrences", () => {
    occurrences = [];
    render(<DeploymentOccurrenceSection occurrences={occurrences} />);

    expect(screen.queryByText(/build/i)).not.toBeInTheDocument();
  });
  describe("build occurrences exist", () => {
    beforeEach(() => {
      occurrences = chance.n(createMockMappedDeploymentOccurrence, chance.d4());
      render(<DeploymentOccurrenceSection occurrences={occurrences} />);
    });

    it("should render the section title", () => {
      expect(screen.getByText("Deploy")).toBeInTheDocument();
      expect(screen.getByTitle("Server")).toBeInTheDocument();
    });

    it("should render a preview for each deployment occurrence", () => {
      console.log("occurrences", occurrences);
      occurrences.forEach((occurrence, index) => {
        const renderedDeployedToText = screen.queryAllByText(
          /^deployment to \w+/i
        );
        expect(renderedDeployedToText[index]).toBeInTheDocument();
        expect(renderedDeployedToText[index]).toHaveTextContent(
          /^deployment to \w+/i
        );

        const renderedDeployedAtText = screen.queryAllByText(/^deployed at/i);
        expect(renderedDeployedAtText).toHaveLength(occurrences.length);

        const renderedDeployedResourcesText = screen.queryAllByText(
          /deployed (\d)/i
        );
        expect(renderedDeployedResourcesText[index]).toBeInTheDocument();
        expect(renderedDeployedResourcesText[index]).toHaveTextContent(
          /^deployed (\d) resources?$/i
        );
      });
    });
  });
});
