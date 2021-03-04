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
import { useFetch } from "hooks/useFetch";
import { createMockMappedOccurrences } from "test/testing-utils/mocks";
import ResourceOccurrences from "components/resources/ResourceOccurrences";
import { useResources } from "providers/resources";

jest.mock("hooks/useFetch");
jest.mock("providers/resources");

describe("ResourceOccurrences", () => {
  let resourceUri;

  beforeEach(() => {
    useResources.mockReturnValue({
      state: {},
    });
    resourceUri = chance.string();
  });

  it("should not make the fetch call if there is no resource uri specified", () => {
    useFetch.mockReturnValue({});
    render(<ResourceOccurrences resourceUri={null} />);
    expect(useFetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(null, {
      resourceUri: null,
    });
  });

  it("should call to fetch the occurrences is a uri is specified", () => {
    useFetch.mockReturnValue({});
    render(<ResourceOccurrences resourceUri={resourceUri} />);
    expect(useFetch)
      .toHaveBeenCalledTimes(2)
      .toHaveBeenCalledWith("/api/occurrences", {
        resourceUri,
      });
  });

  it("should show a loading indicator while fetching the data", () => {
    useFetch.mockReturnValue({
      loading: true,
    });

    render(<ResourceOccurrences resourceUri={resourceUri} />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  describe("when data has been fetched", () => {
    let rerender, data;

    beforeEach(() => {
      data = createMockMappedOccurrences();
      useFetch.mockReturnValue({
        data,
      });
      const utils = render(<ResourceOccurrences resourceUri={resourceUri} />);
      rerender = utils.rerender;
    });

    it("should render the build occurrence section", () => {
      expect(screen.getByText("Build")).toBeInTheDocument();
      expect(screen.getByTitle("Cog")).toBeInTheDocument();
    });

    it("should render the secure occurrence section", () => {
      expect(screen.getByText("Secure")).toBeInTheDocument();
      expect(screen.getByTitle("Shield Check")).toBeInTheDocument();
    });

    it("should render the deployment occurrence section", () => {
      expect(screen.getByText("Deploy")).toBeInTheDocument();
      expect(screen.getByTitle("Server")).toBeInTheDocument();
    });

    it("should render the occurrence details if they should be shown", () => {
      expect(screen.queryByTestId("occurrenceDetails")).not.toBeInTheDocument();

      useResources.mockReturnValue({
        state: {
          occurrenceDetails: data.build[0],
        },
      });

      rerender(<ResourceOccurrences resourceUri={resourceUri} />);

      expect(screen.getByTestId("occurrenceDetails")).toBeInTheDocument();
    });
  });
});
