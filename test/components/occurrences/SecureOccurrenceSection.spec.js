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
import SecureOccurrenceSection from "components/occurrences/SecureOccurrenceSection";
import { createMockMappedOccurrences } from "test/testing-utils/mocks";

describe("SecureOccurrenceSection", () => {
  let occurrences;

  it("should return null if there are no relevant occurrences", () => {
    occurrences = [];
    render(<SecureOccurrenceSection occurrences={occurrences}/> );

    expect(screen.queryByText(/secure/i)).not.toBeInTheDocument();
  });
  describe("vulnerability or discovery occurrences exist", () => {
    beforeEach(() => {
      const {secure} = createMockMappedOccurrences();
      occurrences = secure;
      render(<SecureOccurrenceSection occurrences={occurrences}/> );
    });

    it("should render the section title", () => {
      expect(screen.getByText("Secure")).toBeInTheDocument();
      expect(screen.getByTitle("Shield Check")).toBeInTheDocument();
    });

    it("should render a preview for each vulnerability scan", () => {
      occurrences.forEach((occurrence, index) => {
        expect(screen.queryAllByText("Vulnerability Scan")[index]).toBeInTheDocument();

        const renderedVulnerabilityCount = screen.queryAllByText(/vulnerabilities found/i);
        expect(renderedVulnerabilityCount[index]).toBeInTheDocument();
        expect(renderedVulnerabilityCount[index]).toHaveTextContent(new RegExp(occurrence.vulnerabilities.length + " vulnerabilities found", "i"));
      });
    });
  });
});