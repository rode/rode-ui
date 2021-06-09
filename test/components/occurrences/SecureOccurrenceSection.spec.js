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
import { createMockMappedVulnerabilityOccurrence } from "test/testing-utils/mocks";
import { getVulnerabilityBreakdown } from "utils/occurrence-utils";

describe("SecureOccurrenceSection", () => {
  let occurrences;

  it("should return null if there are no relevant occurrences", () => {
    occurrences = [];
    render(<SecureOccurrenceSection occurrences={occurrences} />);

    expect(screen.queryByText(/secure/i)).not.toBeInTheDocument();
  });

  describe("vulnerability or discovery occurrences exist", () => {
    let rerender;
    beforeEach(() => {
      occurrences = chance.n(
        createMockMappedVulnerabilityOccurrence,
        chance.d4()
      );
      const utils = render(
        <SecureOccurrenceSection occurrences={occurrences} />
      );
      rerender = utils.rerender;
    });

    it("should render the section title", () => {
      expect(screen.getByText("Secure")).toBeInTheDocument();
      expect(screen.getByTitle("Shield Check")).toBeInTheDocument();
    });

    it("should render a preview for each vulnerability scan", () => {
      occurrences.forEach((occurrence, index) => {
        expect(
          screen.queryAllByText("Vulnerability Scan")[index]
        ).toBeInTheDocument();

        if (occurrence.vulnerabilities.length) {
          const breakdown = getVulnerabilityBreakdown(
            occurrence.vulnerabilities
          );
          const renderedBreakdown = screen.queryAllByText(breakdown);

          expect(renderedBreakdown[0]).toBeInTheDocument();
        }

        const renderedTimestamps = screen.queryAllByText(/^completed at/i);
        expect(renderedTimestamps).toHaveLength(occurrences.length);

        const renderedVulnerabilityCount = screen.queryAllByText(
          /vulnerabilities found/i
        );
        expect(renderedVulnerabilityCount[index]).toBeInTheDocument();
        expect(renderedVulnerabilityCount[index]).toHaveTextContent(
          new RegExp(
            occurrence.vulnerabilities.length + " vulnerabilities found",
            "i"
          )
        );
      });
    });

    it("should render the preview with the note description if it exists", () => {
      const description = chance.string();
      occurrences[0].notes = {
        shortDescription: description,
      };

      rerender(<SecureOccurrenceSection occurrences={occurrences} />);

      expect(screen.getByText(description)).toBeInTheDocument();
    });

    it("should render the preview as 'In Progress' when a scan has not completed", () => {
      occurrences[0].completed = null;

      rerender(<SecureOccurrenceSection occurrences={occurrences} />);

      expect(screen.getByText("In Progress")).toBeInTheDocument();
      const renderedVulnerabilityCount = screen.queryAllByText(
        /vulnerabilities found/i
      );
      expect(renderedVulnerabilityCount).toHaveLength(occurrences.length - 1);
    });
  });
});
