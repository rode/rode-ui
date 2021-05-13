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
import BuildOccurrenceDetails from "components/occurrences/BuildOccurrenceDetails";
import { createMockMappedBuildOccurrence } from "test/testing-utils/mocks";
import dayjs from "dayjs";

jest.mock("dayjs");

describe("BuildOccurrenceDetails", () => {
  let occurrence, resource, rerender;

  beforeEach(() => {
    occurrence = createMockMappedBuildOccurrence();
    resource = {
      resourceType: chance.string(),
      uri: chance.url(),
    };
    dayjs.mockReturnValue({
      format: jest
        .fn()
        .mockReturnValueOnce(occurrence.started)
        .mockReturnValue(occurrence.completed),
    });

    const utils = render(
      <BuildOccurrenceDetails occurrence={occurrence} resource={resource} />
    );
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should display the summary details of the build", () => {
    expect(screen.getByText("Build")).toBeInTheDocument();
    expect(screen.getByText(/view source/i))
      .toBeInTheDocument()
      .toHaveAttribute("href", occurrence.sourceUri);
    expect(screen.getByText(/view logs/i))
      .toBeInTheDocument()
      .toHaveAttribute("href", occurrence.logsUri);
    expect(
      screen.getByText(`Started ${occurrence.started}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Completed ${occurrence.completed}`)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show JSON" })
    ).toBeInTheDocument();
    expect(screen.getByText("Created By")).toBeInTheDocument();
    expect(screen.getByText(occurrence.creator)).toBeInTheDocument();
  });

  describe("showing the related git resource", () => {
    it("should show a link to the git resource that originated the build occurrence", () => {
      const renderedLink = screen.getByText("View Git Resource");
      expect(renderedLink).toBeInTheDocument();
      expect(renderedLink).toHaveAttribute(
        "href",
        `/resources/${encodeURIComponent(
          occurrence.originals.occurrences[0].resource.uri
        )}`
      );
    });

    it("should not show a link when viewing a git resource", () => {
      resource.resourceType = "Git";

      rerender( <BuildOccurrenceDetails occurrence={occurrence} resource={resource} />);

      const renderedLink = screen.queryByText("View Git Resource");
      expect(renderedLink).not.toBeInTheDocument();
    });

    it("should not show a link when the build occurrence is associated with the request resource", () => {
      resource.uri = occurrence.originals.occurrences[0].resource.uri;

      rerender( <BuildOccurrenceDetails occurrence={occurrence} resource={resource} />);

      const renderedLink = screen.queryByText("View Git Resource");
      expect(renderedLink).not.toBeInTheDocument();
    });
  });

  it("should show source not available if there are is not a source uri", () => {
    occurrence.sourceUri = null;
    rerender(
      <BuildOccurrenceDetails occurrence={occurrence} resource={resource} />
    );

    expect(screen.getByText("Source not available")).toBeInTheDocument();
  });

  it("should show logs not available if there are is not logs uri", () => {
    occurrence.logsUri = null;
    rerender(
      <BuildOccurrenceDetails occurrence={occurrence} resource={resource} />
    );

    expect(screen.getByText("Logs not available")).toBeInTheDocument();
  });

  it("should show the list of artifacts produced from the build", () => {
    const renderedArtifactCards = screen.queryAllByText(/build artifact/i);

    occurrence.artifacts.forEach((artifact, index) => {
      expect(renderedArtifactCards[index]).toBeInTheDocument();
      expect(screen.getByText(artifact.names.join(", "))).toBeInTheDocument();
      expect(screen.getByText(artifact.id)).toBeInTheDocument();
      expect(screen.getByText(artifact.checksum)).toBeInTheDocument();
    });
  });
});
