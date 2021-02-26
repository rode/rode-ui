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
import { render, screen } from "@testing-library/react";
import { createMockOccurrence } from "test/testing-utils/mocks";
import BuildOccurrencePreview from "components/occurrences/BuildOccurrencePreview";

describe("BuildOccurrencePreview", () => {
  let occurrence;

  beforeEach(() => {
    occurrence = createMockOccurrence("BUILD");

    render(<BuildOccurrencePreview occurrence={occurrence} />);
  });

  it("should show the build id", () => {
    expect(
      screen.getByText(`Build Id: ${occurrence.build.provenance.id}`)
    ).toBeInTheDocument();
  });

  it("should show the project id", () => {
    expect(
      screen.getByText(`Project Id: ${occurrence.build.provenance.projectId}`)
    ).toBeInTheDocument();
  });
  it("should show each build artifact", () => {
    occurrence.build.provenance.builtArtifacts.forEach((artifact) => {
      expect(
        screen.getByText(`Checksum: ${artifact.checksum}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Artifact Id: ${artifact.id}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Names: ${artifact.names.join(",")}`)
      ).toBeInTheDocument();
    });
  });
});
