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
import BuildOccurrenceSection from "components/occurrences/BuildOccurrenceSection";
import { createMockMappedBuildOccurrence } from "test/testing-utils/mocks";
import { getResourceDetails, RESOURCE_TYPES } from "utils/resource-utils";

describe("BuildOccurrenceSection", () => {
  let occurrences, rerender;

  it("should return null if there are no relevant occurrences", () => {
    occurrences = [];
    render(
      <BuildOccurrenceSection
        occurrences={occurrences}
        type={chance.pickone(RESOURCE_TYPES)}
      />
    );

    expect(screen.queryByText(/build/i)).not.toBeInTheDocument();
  });
  describe("build occurrences exist", () => {
    beforeEach(() => {
      occurrences = chance.n(createMockMappedBuildOccurrence, chance.d4());
      const utils = render(
        <BuildOccurrenceSection
          occurrences={occurrences}
          type={chance.pickone(RESOURCE_TYPES)}
        />
      );
      rerender = utils.rerender;
    });

    it("should render the section title", () => {
      expect(screen.getByText("Build")).toBeInTheDocument();
      expect(screen.getByTitle("Cog")).toBeInTheDocument();
    });

    it("should render a preview for each build occurrence", () => {
      occurrences.forEach((occurrence, index) => {
        const renderedProducedText = screen.queryAllByText(/produced/i);
        expect(renderedProducedText[index]).toBeInTheDocument();
        expect(renderedProducedText[index]).toHaveTextContent(
          new RegExp(
            "Produced " + occurrence.artifacts.length + " Artifact",
            "i"
          )
        );

        const renderedTimestamp = screen.queryAllByText(/^completed at/i);
        expect(renderedTimestamp).toHaveLength(occurrences.length);

        const renderedSourceLinks = screen.queryAllByText(/view source/i);
        expect(renderedSourceLinks[index]).toBeInTheDocument();
        expect(renderedSourceLinks[index]).toHaveAttribute(
          "href",
          occurrence.sourceUri
        );

        const renderedLogsLinks = screen.queryAllByText(/view logs/i);
        expect(renderedLogsLinks[index]).toBeInTheDocument();
        expect(renderedLogsLinks[index]).toHaveAttribute(
          "href",
          occurrence.logsUri
        );
      });
    });

    it("should render the produced artifact if the build occurrence is representing a git resource", () => {
      rerender(
        <BuildOccurrenceSection
          occurrences={occurrences}
          type={RESOURCE_TYPES.GIT}
        />
      );

      occurrences.forEach((occurrence, index) => {
        const renderedTimestamp = screen.queryAllByText(/^completed at/i);
        expect(renderedTimestamp).toHaveLength(occurrences.length);
        expect(renderedTimestamp[index]).toBeInTheDocument();

        const artifactVersions = occurrence.artifacts.map((artifact) => {
          const { resourceVersion } = getResourceDetails(artifact.id);
          return resourceVersion;
        });

        expect(
          screen.getByText(artifactVersions[0].substring(0, 12))
        ).toBeInTheDocument();
      });
    });
  });
});
